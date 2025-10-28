import { Router, Request, Response } from 'express';
import { Lead } from '../models';
import { logger } from '../utils/logger';

export const leadRoutes = Router();

// GET /api/leads - Listar todos os leads
leadRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const leads = await Lead.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('assignedTo', 'name email');

    const total = await Lead.countDocuments();
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        leads,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    logger.error('Erro ao buscar leads:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/leads/:id - Buscar lead por ID
leadRoutes.get('/:id', async (req: Request, res: Response) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('messages');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead não encontrado'
      });
    }

    res.json({
      success: true,
      data: lead
    });
  } catch (error) {
    logger.error('Erro ao buscar lead:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PUT /api/leads/:id - Atualizar lead
leadRoutes.put('/:id', async (req: Request, res: Response) => {
  try {
    const { status, assignedTo, notes, qualificationScore } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        status,
        assignedTo,
        notes,
        qualificationScore,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('assignedTo', 'name email');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead não encontrado'
      });
    }

    res.json({
      success: true,
      data: lead,
      message: 'Lead atualizado com sucesso'
    });
  } catch (error) {
    logger.error('Erro ao atualizar lead:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// DELETE /api/leads/:id - Deletar lead
leadRoutes.delete('/:id', async (req: Request, res: Response) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Lead deletado com sucesso'
    });
  } catch (error) {
    logger.error('Erro ao deletar lead:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/leads/stats/overview - Estatísticas gerais
leadRoutes.get('/stats/overview', async (req: Request, res: Response) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const hotLeads = await Lead.countDocuments({ qualificationScore: { $gte: 8 } });
    const warmLeads = await Lead.countDocuments({ qualificationScore: { $gte: 5, $lt: 8 } });
    const coldLeads = await Lead.countDocuments({ qualificationScore: { $lt: 5 } });
    
    const pendingLeads = await Lead.countDocuments({ status: 'pending' });
    const contactedLeads = await Lead.countDocuments({ status: 'contacted' });
    const qualifiedLeads = await Lead.countDocuments({ status: 'qualified' });
    const convertedLeads = await Lead.countDocuments({ status: 'converted' });

    res.json({
      success: true,
      data: {
        total: totalLeads,
        byScore: {
          hot: hotLeads,
          warm: warmLeads,
          cold: coldLeads
        },
        byStatus: {
          pending: pendingLeads,
          contacted: contactedLeads,
          qualified: qualifiedLeads,
          converted: convertedLeads
        }
      }
    });
  } catch (error) {
    logger.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});