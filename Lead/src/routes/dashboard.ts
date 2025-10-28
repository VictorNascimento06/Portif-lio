import { Router, Request, Response } from 'express';
import { Lead, Message, User, Analytics } from '../models';
import { logger } from '../utils/logger';

export const dashboardRoutes = Router();

// GET /api/dashboard/stats - Estatísticas do dashboard
dashboardRoutes.get('/stats', async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Estatísticas gerais
    const totalLeads = await Lead.countDocuments();
    const leadsToday = await Lead.countDocuments({ createdAt: { $gte: startOfDay } });
    const leadsThisWeek = await Lead.countDocuments({ createdAt: { $gte: startOfWeek } });
    const leadsThisMonth = await Lead.countDocuments({ createdAt: { $gte: startOfMonth } });

    // Por status
    const pendingLeads = await Lead.countDocuments({ status: 'pending' });
    const contactedLeads = await Lead.countDocuments({ status: 'contacted' });
    const qualifiedLeads = await Lead.countDocuments({ status: 'qualified' });
    const convertedLeads = await Lead.countDocuments({ status: 'converted' });

    // Por score de qualificação
    const hotLeads = await Lead.countDocuments({ qualificationScore: { $gte: 8 } });
    const warmLeads = await Lead.countDocuments({ qualificationScore: { $gte: 5, $lt: 8 } });
    const coldLeads = await Lead.countDocuments({ qualificationScore: { $lt: 5 } });

    // Taxa de conversão
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

    // Mensagens hoje
    const messagesToday = await Message.countDocuments({ timestamp: { $gte: startOfDay } });

    res.json({
      success: true,
      data: {
        overview: {
          totalLeads,
          leadsToday,
          leadsThisWeek,
          leadsThisMonth,
          conversionRate: parseFloat(conversionRate.toFixed(2)),
          messagesToday
        },
        leadsByStatus: {
          pending: pendingLeads,
          contacted: contactedLeads,
          qualified: qualifiedLeads,
          converted: convertedLeads
        },
        leadsByScore: {
          hot: hotLeads,
          warm: warmLeads,
          cold: coldLeads
        }
      }
    });
  } catch (error) {
    logger.error('Erro ao buscar estatísticas do dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/dashboard/charts/leads-timeline - Dados para gráfico de timeline de leads
dashboardRoutes.get('/charts/leads-timeline', async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 7;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const leadsData = await Lead.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          count: { $sum: 1 },
          converted: {
            $sum: {
              $cond: [{ $eq: ["$status", "converted"] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      success: true,
      data: leadsData
    });
  } catch (error) {
    logger.error('Erro ao buscar dados do gráfico:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/dashboard/charts/conversion-funnel - Dados para funil de conversão
dashboardRoutes.get('/charts/conversion-funnel', async (req: Request, res: Response) => {
  try {
    const funnelData = await Lead.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const statusOrder = ['pending', 'contacted', 'qualified', 'converted'];
    const orderedData = statusOrder.map(status => {
      const found = funnelData.find(item => item._id === status);
      return {
        status,
        count: found ? found.count : 0
      };
    });

    res.json({
      success: true,
      data: orderedData
    });
  } catch (error) {
    logger.error('Erro ao buscar dados do funil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/dashboard/recent-leads - Leads recentes
dashboardRoutes.get('/recent-leads', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    const recentLeads = await Lead.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('assignedTo', 'name')
      .select('name phone qualificationScore status createdAt');

    res.json({
      success: true,
      data: recentLeads
    });
  } catch (error) {
    logger.error('Erro ao buscar leads recentes:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/dashboard/hot-leads - Leads quentes (score >= 8)
dashboardRoutes.get('/hot-leads', async (req: Request, res: Response) => {
  try {
    const hotLeads = await Lead.find({
      qualificationScore: { $gte: 8 },
      status: { $in: ['pending', 'contacted'] }
    })
      .sort({ qualificationScore: -1, createdAt: -1 })
      .limit(20)
      .populate('assignedTo', 'name')
      .select('name phone qualificationScore status createdAt assignedTo');

    res.json({
      success: true,
      data: hotLeads
    });
  } catch (error) {
    logger.error('Erro ao buscar leads quentes:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/dashboard/team-performance - Performance da equipe
dashboardRoutes.get('/team-performance', async (req: Request, res: Response) => {
  try {
    const teamPerformance = await User.aggregate([
      {
        $match: { role: 'sales', isActive: true }
      },
      {
        $lookup: {
          from: 'leads',
          localField: '_id',
          foreignField: 'assignedTo',
          as: 'leads'
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          totalLeads: { $size: '$leads' },
          convertedLeads: {
            $size: {
              $filter: {
                input: '$leads',
                as: 'lead',
                cond: { $eq: ['$$lead.status', 'converted'] }
              }
            }
          }
        }
      },
      {
        $addFields: {
          conversionRate: {
            $cond: [
              { $gt: ['$totalLeads', 0] },
              { $multiply: [{ $divide: ['$convertedLeads', '$totalLeads'] }, 100] },
              0
            ]
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: teamPerformance
    });
  } catch (error) {
    logger.error('Erro ao buscar performance da equipe:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});