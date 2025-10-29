import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const landingPageId = searchParams.get('landingPageId')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {
      userId: session.user.id
    }

    if (landingPageId) {
      where.landingPageId = landingPageId
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Buscar leads com paginação
    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: {
          landingPage: {
            select: {
              title: true,
              slug: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.lead.count({ where })
    ])

    // Processar metadata (converter de string para JSON)
    const processedLeads = leads.map(lead => ({
      ...lead,
      metadata: lead.metadata ? JSON.parse(lead.metadata) : null
    }))

    return NextResponse.json({
      leads: processedLeads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Erro ao buscar leads:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}