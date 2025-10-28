import { Client, LocalAuth, Message } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { Server } from 'socket.io';
import { Lead, Message as MessageModel, ILead, IMessage } from '../models';
import { AIQualificationService } from './ai-qualification';
import { NotificationService } from './notification-service';
import { logger } from '../utils/logger';

export class WhatsAppBot {
  private static instance: WhatsAppBot;
  private client: Client;
  private io: Server;
  private aiService: AIQualificationService;
  private notificationService: NotificationService;
  private isReady: boolean = false;

  private constructor(io: Server) {
    this.io = io;
    this.aiService = new AIQualificationService();
    this.notificationService = new NotificationService();
    
    this.client = new Client({
      authStrategy: new LocalAuth({
        clientId: process.env.WHATSAPP_SESSION_NAME || 'lead-bot-session'
      }),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      }
    });

    this.setupEventListeners();
  }

  public static getInstance(io?: Server): WhatsAppBot {
    if (!WhatsAppBot.instance && io) {
      WhatsAppBot.instance = new WhatsAppBot(io);
    }
    if (!WhatsAppBot.instance) {
      throw new Error('WhatsApp bot not initialized with Socket.IO instance');
    }
    return WhatsAppBot.instance;
  }

  public async initialize(): Promise<void> {
    try {
      await this.client.initialize();
      logger.info('WhatsApp bot initializing...');
    } catch (error) {
      logger.error('Failed to initialize WhatsApp bot:', error);
      throw error;
    }
  }

  // Método para uso no webhook - enviar resposta automática
  public async sendMessage(phone: string, lead: ILead, message: IMessage): Promise<void> {
    if (!this.isReady) {
      logger.warn('WhatsApp bot not ready, message queued');
      return;
    }

    try {
      // Gerar resposta automática baseada no conteúdo da mensagem
      const response = await this.generateAutomaticResponse(lead, message.content);
      
      if (response) {
        await this.client.sendMessage(phone, response);
        logger.info(`Automatic response sent to ${phone}`);
      }
    } catch (error) {
      logger.error('Error sending WhatsApp message:', error);
    }
  }

  // Método para enviar mensagem manual
  public async sendManualMessage(phone: string, message: string): Promise<boolean> {
    if (!this.isReady) {
      logger.warn('WhatsApp bot not ready');
      return false;
    }

    try {
      await this.client.sendMessage(phone, message);
      logger.info(`Manual message sent to ${phone}`);
      return true;
    } catch (error) {
      logger.error('Error sending manual message:', error);
      return false;
    }
  }

  private async generateAutomaticResponse(lead: ILead, incomingMessage: string): Promise<string> {
    try {
      // Usar IA para gerar resposta contextual
      const response = await this.aiService.generateResponse(incomingMessage, lead);
      return response;
    } catch (error) {
      logger.error('Error generating automatic response:', error);
      return 'Olá! Obrigado pelo seu contato. Nossa equipe entrará em contato em breve. 😊';
    }
  }

  private setupEventListeners(): void {
    this.client.on('qr', (qr) => {
      logger.info('WhatsApp QR Code received');
      qrcode.generate(qr, { small: true });
      this.io.emit('qr-code', qr);
    });

    this.client.on('ready', () => {
      logger.info('✅ WhatsApp bot is ready!');
      this.isReady = true;
      this.io.emit('bot-status', { status: 'ready' });
    });

    this.client.on('disconnected', (reason) => {
      logger.warn('WhatsApp bot disconnected:', reason);
      this.isReady = false;
      this.io.emit('bot-status', { status: 'disconnected', reason });
    });

    this.client.on('auth_failure', (msg) => {
      logger.error('WhatsApp authentication failed:', msg);
      this.io.emit('bot-status', { status: 'auth_failure', message: msg });
    });

    this.client.on('message', async (message) => {
      try {
        await this.handleIncomingMessage(message);
      } catch (error) {
        logger.error('Error handling incoming message:', error);
      }
    });
  }

  private async handleIncomingMessage(message: Message): Promise<void> {
    if (message.fromMe) return; // Ignore own messages

    const contact = await message.getContact();
    const phone = contact.number;
    const messageContent = message.body;

    logger.info(`📱 New message from ${phone}: ${messageContent}`);

    try {
      // Find or create lead
      let lead = await Lead.findOne({ phone });
      
      if (!lead) {
        lead = new Lead({
          phone,
          name: contact.pushname || phone,
          source: 'whatsapp',
          status: 'pending',
          createdAt: new Date()
        });
      }

      // Save message
      const messageDoc = new MessageModel({
        leadId: lead._id,
        from: phone,
        to: 'bot',
        direction: 'inbound',
        content: messageContent,
        type: 'text',
        timestamp: new Date()
      });

      await messageDoc.save();

      // Update lead with new message
      if (!lead.messages) {
        lead.messages = [];
      }
      (lead.messages as any).push(messageDoc._id);
      lead.lastContact = new Date();

      // AI qualification for new or low-score leads
      if (lead.messages.length === 1 || !lead.qualificationScore || lead.qualificationScore < 5) {
        try {
          const qualification = await this.aiService.qualifyLead(messageContent, phone);
          
          lead.qualificationScore = qualification.score;
          lead.qualificationReason = qualification.reason;
          lead.detectedIntent = qualification.intent;
          
          // Extract additional data
          if (qualification.extractedData?.name) {
            lead.name = qualification.extractedData.name;
          }
          if (qualification.extractedData?.email) {
            lead.email = qualification.extractedData.email;
          }
          if (qualification.extractedData?.company) {
            lead.company = qualification.extractedData.company;
          }

          // Set temperature based on score
          if (qualification.score >= 8) {
            lead.temperature = 'hot';
          } else if (qualification.score >= 5) {
            lead.temperature = 'warm';
          } else {
            lead.temperature = 'cold';
          }

          logger.info(`Lead qualified: ${phone} - Score: ${qualification.score}`);
        } catch (aiError) {
          logger.error('Error in AI qualification:', aiError);
        }
      }

      await lead.save();

      // Send notification for hot leads
      if (lead.qualificationScore && lead.qualificationScore >= 8) {
        try {
          await this.notificationService.notifyHotLead(lead, messageDoc);
        } catch (notifyError) {
          logger.error('Error sending notification:', notifyError);
        }
      }

      // Send automatic response
      await this.sendAutomaticResponse(lead, messageContent);

      // Emit to dashboard
      this.io.emit('new-message', {
        leadId: lead._id,
        message: messageDoc,
        qualification: {
          score: lead.qualificationScore,
          temperature: lead.temperature
        }
      });

    } catch (error) {
      logger.error('Error processing incoming message:', error);
    }
  }

  private async sendAutomaticResponse(lead: ILead, incomingMessage: string): Promise<void> {
    try {
      const response = await this.generateAutomaticResponse(lead, incomingMessage);
      
      if (response && this.isReady) {
        await this.client.sendMessage(lead.phone, response);
        
        // Save bot message
        const botMessage = new MessageModel({
          leadId: lead._id,
          from: 'bot',
          to: lead.phone,
          direction: 'outbound',
          content: response,
          type: 'text',
          isFromBot: true,
          timestamp: new Date()
        });
        
        await botMessage.save();
        logger.info(`Automatic response sent to ${lead.phone}`);
      }
    } catch (error) {
      logger.error('Error sending automatic response:', error);
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.client.destroy();
      this.isReady = false;
      logger.info('WhatsApp bot disconnected');
    } catch (error) {
      logger.error('Error disconnecting WhatsApp bot:', error);
    }
  }

  public getStatus(): boolean {
    return this.isReady;
  }
}