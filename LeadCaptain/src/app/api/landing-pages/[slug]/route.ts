import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    const landingPage = await prisma.landingPage.findUnique({
      where: { 
        slug,
        isActive: true 
      },
      select: {
        id: true,
        title: true,
        description: true,
        content: true,
        template: true,
        slug: true
      }
    })

    if (!landingPage) {
      return NextResponse.json(
        { error: 'Landing page não encontrada' },
        { status: 404 }
      )
    }

    // Parse do conteúdo JSON
    const parsedContent = landingPage.content ? JSON.parse(landingPage.content) : null

    return NextResponse.json({
      landingPage: {
        ...landingPage,
        content: parsedContent
      }
    })

  } catch (error) {
    console.error('Erro ao buscar landing page:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}