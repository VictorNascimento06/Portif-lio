import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createLandingPageSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  slug: z.string().min(1, 'Slug é obrigatório').regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  description: z.string().optional(),
  category: z.enum(['seguros', 'cursos', 'ecommerce', 'servicos', 'consultoria']).default('seguros'),
  template: z.string().default('modern'),
  content: z.object({
    headline: z.string().min(1, 'Headline é obrigatório'),
    subheadline: z.string().optional(),
    buttonText: z.string().default('Quero Saber Mais'),
    features: z.array(z.string()).optional(),
    primaryColor: z.string().default('#3B82F6'),
    images: z.array(z.string()).optional()
  })
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Buscar o usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    const landingPages = await prisma.landingPage.findMany({
      where: {
        userId: user.id
      },
      include: {
        _count: {
          select: {
            leads: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ landingPages })

  } catch (error) {
    console.error('Erro ao buscar landing pages:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('📝 Criando landing page:', body)
    
    const data = createLandingPageSchema.parse(body)

    // Buscar o usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se slug já existe
    const existingSlug = await prisma.landingPage.findUnique({
      where: { slug: data.slug }
    })

    if (existingSlug) {
      return NextResponse.json(
        { error: 'Slug já existe. Escolha outro.' },
        { status: 400 }
      )
    }

    const landingPage = await prisma.landingPage.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        content: JSON.stringify({
          ...data.content,
          category: data.category
        }),
        template: data.template,
        userId: user.id,
      }
    })

    console.log('✅ Landing page criada:', landingPage)

    return NextResponse.json({
      message: 'Landing page criada com sucesso',
      landingPage: {
        id: landingPage.id,
        title: landingPage.title,
        slug: landingPage.slug,
        url: `/lp/${landingPage.slug}`
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log('❌ Erro de validação:', error.errors)
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('❌ Erro ao criar landing page:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}