import { Router, Request, Response } from 'express';
import { WhatsAppBot } from '../services/whatsapp-bot';
import { AIQualificationService } from '../services/ai-qualification';
import { NotificationService } from '../services/notification-service';
import { Lead, Message } from '../models';
import { logger } from '../utils/logger';

export const webhookRoutes = Router();

// POST /api/webhooks/whatsapp - Webhook do WhatsApp
webhookRoutes.post('/whatsapp', async (req: Request, res: Response) => {
  try {
    const { from, body, timestamp } = req.body;

    if (!from || !body) {
      return res.status(400).json({
        success: false,
        message: 'Dados incompletos no webhook'
      });
    }

    // Procurar lead existente pelo telefone
    let lead = await Lead.findOne({ phone: from });

    // Se não existir, criar novo lead
    if (!lead) {
      lead = new Lead({
        phone: from,
        name: from, // Será atualizado posteriormente
        status: 'pending',
        source: 'whatsapp',
        createdAt: new Date()
      });
    }

    // Salvar mensagem
    const message = new Message({
      leadId: lead._id,
      from: from,
      to: 'bot',
      content: body,
      type: 'text',
      direction: 'inbound',
      timestamp: timestamp ? new Date(timestamp) : new Date()
    });

    await message.save();

    // Adicionar mensagem ao lead
    if (!lead.messages) {
      lead.messages = [];
    }
    (lead.messages as any).push(message._id);

    // Processar com IA se for a primeira mensagem ou score baixo
    if (lead.messages.length === 1 || !lead.qualificationScore || lead.qualificationScore < 5) {
      try {
        const aiService = new AIQualificationService();
        const qualification = await aiService.qualifyLead(body, lead.phone);
        
        lead.qualificationScore = qualification.score;
        lead.qualificationReason = qualification.reason;
        lead.detectedIntent = qualification.intent;
        
        // Extrair nome se detectado
        if (qualification.extractedData?.name) {
          lead.name = qualification.extractedData.name;
        }
        
        // Atualizar outras informações
        if (qualification.extractedData?.email) {
          lead.email = qualification.extractedData.email;
        }
        
        if (qualification.extractedData?.company) {
          lead.company = qualification.extractedData.company;
        }

        logger.info(`Lead qualified: ${from} - Score: ${qualification.score}`);
      } catch (aiError) {
        logger.error('Erro na qualificação por IA:', aiError);
        // Continuar sem qualificação em caso de erro
      }
    }

    // Atualizar último contato
    lead.lastContact = new Date();
    await lead.save();

    // Enviar notificação se lead quente (score >= 8)
    if (lead.qualificationScore && lead.qualificationScore >= 8) {
      try {
        const notificationService = new NotificationService();
        await notificationService.notifyHotLead(lead, message);
        logger.info(`Hot lead notification sent: ${from}`);
      } catch (notifyError) {
        logger.error('Erro ao enviar notificação:', notifyError);
      }
    }

    // Resposta automática via WhatsApp Bot
    try {
      const whatsappBot = WhatsAppBot.getInstance();
      await whatsappBot.sendMessage(from, lead, message);
    } catch (botError) {
      logger.error('Erro ao enviar resposta automática:', botError);
    }

    res.json({
      success: true,
      data: {
        leadId: lead._id,
        messageId: message._id,
        qualificationScore: lead.qualificationScore
      },
      message: 'Webhook processado com sucesso'
    });

  } catch (error) {
    logger.error('Erro no webhook do WhatsApp:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/webhooks/whatsapp/status - Webhook de status de mensagem
webhookRoutes.post('/whatsapp/status', async (req: Request, res: Response) => {
  try {
    const { messageId, status, timestamp } = req.body;

    if (!messageId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Dados incompletos no webhook de status'
      });
    }

    // Atualizar status da mensagem
    await Message.findOneAndUpdate(
      { whatsappMessageId: messageId },
      {
        status: status,
        statusUpdatedAt: timestamp ? new Date(timestamp) : new Date()
      }
    );

    logger.debug(`Message status updated: ${messageId} - ${status}`);

    res.json({
      success: true,
      message: 'Status atualizado com sucesso'
    });

  } catch (error) {
    logger.error('Erro no webhook de status:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/webhooks/whatsapp/verify - Verificação do webhook (Meta/Facebook)
webhookRoutes.get('/whatsapp/verify', (req: Request, res: Response) => {
  try {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'leadai-webhook-token';

    if (mode === 'subscribe' && token === verifyToken) {
      logger.info('WhatsApp webhook verified successfully');
      res.status(200).send(challenge);
    } else {
      logger.warn('WhatsApp webhook verification failed');
      res.status(403).json({
        success: false,
        message: 'Forbidden'
      });
    }
  } catch (error) {
    logger.error('Erro na verificação do webhook:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/webhooks/test - Endpoint para testes
webhookRoutes.post('/test', async (req: Request, res: Response) => {
  try {
    const { phone, message } = req.body;

    if (!phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'Telefone e mensagem são obrigatórios'
      });
    }

    // Simular webhook do WhatsApp
    const webhookData = {
      from: phone,
      body: message,
      timestamp: new Date().toISOString()
    };

    // Processar como se fosse um webhook real
    const response = await fetch(`${req.protocol}://${req.get('host')}/api/webhooks/whatsapp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(webhookData)
    });

    const result = await response.json();

    res.json({
      success: true,
      data: result,
      message: 'Webhook de teste processado'
    });

  } catch (error) {
    logger.error('Erro no webhook de teste:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});