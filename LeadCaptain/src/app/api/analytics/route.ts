import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { cache } from '@/lib/cache'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '7d' // 7d, 30d, 90d
    const landingPageId = searchParams.get('landingPageId')

    // Calcular data de início baseada no período
    const now = new Date()
    let startDate = new Date()
    
    switch (period) {
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      default: // 7d
        startDate.setDate(now.getDate() - 7)
    }

    // Filtros base
    const whereClause: any = {
      createdAt: {
        gte: startDate,
        lte: now
      }
    }

    // Se especificou landing page, filtrar por ela
    if (landingPageId) {
      whereClause.landingPageId = landingPageId
    } else {
      // Se não, buscar apenas landing pages do usuário
      const userLandingPages = await prisma.landingPage.findMany({
        where: { userId: session.user.id },
        select: { id: true }
      })
      whereClause.landingPageId = {
        in: userLandingPages.map(lp => lp.id)
      }
    }

    // Buscar dados de analytics
    const [
      totalViews,
      totalConversions,
      dailyStats,
      leadSources,
      topLandingPages
    ] = await Promise.all([
      // Total de visualizações
      prisma.analytics.count({
        where: {
          ...whereClause,
          event: 'view'
        }
      }),

      // Total de conversões
      prisma.analytics.count({
        where: {
          ...whereClause,
          event: 'conversion'
        }
      }),

      // Estatísticas diárias
      prisma.analytics.groupBy({
        by: ['createdAt'],
        where: whereClause,
        _count: {
          event: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      }),

      // Fontes de leads
      prisma.analytics.groupBy({
        by: ['utmSource'],
        where: {
          ...whereClause,
          event: 'conversion',
          utmSource: {
            not: null
          }
        },
        _count: {
          event: true
        },
        orderBy: {
          _count: {
            event: 'desc'
          }
        },
        take: 5
      }),

      // Top landing pages
      prisma.analytics.groupBy({
        by: ['landingPageId'],
        where: whereClause,
        _count: {
          event: true
        },
        orderBy: {
          _count: {
            event: 'desc'
          }
        },
        take: 5
      })
    ])

    // Calcular taxa de conversão
    const conversionRate = totalViews > 0 ? (totalConversions / totalViews) * 100 : 0

    // Processar estatísticas diárias
    const processedDailyStats = dailyStats.reduce((acc, stat) => {
      const date = stat.createdAt.toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = { views: 0, conversions: 0 }
      }
      acc[date].views += stat._count.event
      return acc
    }, {} as Record<string, { views: number; conversions: number }>)

    // Buscar informações das landing pages para o relatório
    const landingPageDetails = await prisma.landingPage.findMany({
      where: {
        id: {
          in: topLandingPages.map(lp => lp.landingPageId)
        }
      },
      select: {
        id: true,
        title: true,
        slug: true
      }
    })

    const topLandingPagesWithDetails = topLandingPages.map(lp => {
      const details = landingPageDetails.find(lpd => lpd.id === lp.landingPageId)
      return {
        ...lp,
        title: details?.title,
        slug: details?.slug
      }
    })

    return NextResponse.json({
      summary: {
        totalViews,
        totalConversions,
        conversionRate: parseFloat(conversionRate.toFixed(2)),
        period
      },
      dailyStats: processedDailyStats,
      leadSources: leadSources.map(source => ({
        source: source.utmSource,
        count: source._count.event
      })),
      topLandingPages: topLandingPagesWithDetails
    })

  } catch (error) {
    console.error('Erro ao buscar analytics:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}