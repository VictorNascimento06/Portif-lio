import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Listar todos os testes A/B do usuário
export async function GET() {
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

    const abTests = await prisma.aBTest.findMany({
      where: { userId: user.id },
      include: {
        landingPage: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Parse variants JSON
    const testsWithParsedVariants = abTests.map(test => ({
      ...test,
      variants: JSON.parse(test.variants)
    }))

    return NextResponse.json(testsWithParsedVariants)
  } catch (error) {
    console.error('Erro ao buscar testes A/B:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar novo teste A/B
export async function POST(request: NextRequest) {
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

    const { name, landingPageId, variants } = await request.json()

    // Validações
    if (!name || !landingPageId || !variants || variants.length < 2) {
      return NextResponse.json(
        { error: 'Dados inválidos. Nome, landing page e pelo menos 2 variantes são obrigatórios.' },
        { status: 400 }
      )
    }

    // Verificar se a soma das porcentagens é 100%
    const totalPercentage = variants.reduce((sum: number, variant: any) => sum + variant.trafficPercentage, 0)
    if (totalPercentage !== 100) {
      return NextResponse.json(
        { error: 'A soma das porcentagens de tráfego deve ser exatamente 100%' },
        { status: 400 }
      )
    }

    // Verificar se a landing page pertence ao usuário
    const landingPage = await prisma.landingPage.findFirst({
      where: {
        id: landingPageId,
        userId: user.id
      }
    })

    if (!landingPage) {
      return NextResponse.json(
        { error: 'Landing page não encontrada ou não pertence ao usuário' },
        { status: 404 }
      )
    }

    // Gerar IDs únicos para as variantes
    const variantsWithIds = variants.map((variant: any, index: number) => ({
      ...variant,
      id: `variant_${Date.now()}_${index}`,
      conversions: 0,
      views: 0
    }))

    // Criar o teste A/B
    const abTest = await prisma.aBTest.create({
      data: {
        name,
        landingPageId,
        userId: user.id,
        variants: JSON.stringify(variantsWithIds),
        isActive: true
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
      ...abTest,
      variants: variantsWithIds
    }, { status: 201 })

  } catch (error) {
    console.error('Erro ao criar teste A/B:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}