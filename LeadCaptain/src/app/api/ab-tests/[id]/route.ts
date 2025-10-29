import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Buscar teste A/B específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    const abTest = await prisma.aBTest.findFirst({
      where: {
        id: params.id,
        userId: user.id
      },
      include: {
        landingPage: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      }
    })

    if (!abTest) {
      return NextResponse.json({ error: 'Teste A/B não encontrado' }, { status: 404 })
    }

    // Buscar analytics do teste
    const analytics = await prisma.analytics.findMany({
      where: {
        landingPageId: abTest.landingPageId,
        variant: { not: null }
      }
    })

    // Calcular métricas por variante
    const variants = JSON.parse(abTest.variants)
    const variantsWithMetrics = variants.map((variant: any) => {
      const variantAnalytics = analytics.filter(a => a.variant === variant.id)
      const views = variantAnalytics.filter(a => a.event === 'view').length
      const conversions = variantAnalytics.filter(a => a.event === 'conversion').length
      
      return {
        ...variant,
        views,
        conversions,
        conversionRate: views > 0 ? (conversions / views) * 100 : 0
      }
    })

    return NextResponse.json({
      ...abTest,
      variants: variantsWithMetrics
    })

  } catch (error) {
    console.error('Erro ao buscar teste A/B:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PATCH - Atualizar teste A/B
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    const { isActive, winner, endDate } = await request.json()

    const abTest = await prisma.aBTest.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    })

    if (!abTest) {
      return NextResponse.json({ error: 'Teste A/B não encontrado' }, { status: 404 })
    }

    const updatedTest = await prisma.aBTest.update({
      where: { id: params.id },
      data: {
        ...(isActive !== undefined && { isActive }),
        ...(winner && { winner }),
        ...(endDate && { endDate: new Date(endDate) }),
        updatedAt: new Date()
      },
      include: {
        landingPage: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      }
    })

    return NextResponse.json({
      ...updatedTest,
      variants: JSON.parse(updatedTest.variants)
    })

  } catch (error) {
    console.error('Erro ao atualizar teste A/B:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar teste A/B
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    const abTest = await prisma.aBTest.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    })

    if (!abTest) {
      return NextResponse.json({ error: 'Teste A/B não encontrado' }, { status: 404 })
    }

    await prisma.aBTest.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Teste A/B deletado com sucesso' })

  } catch (error) {
    console.error('Erro ao deletar teste A/B:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}