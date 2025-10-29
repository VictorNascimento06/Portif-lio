import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { cache } from '@/lib/cache'

const captureLeadSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  phone: z.string().optional(),
  landingPageSlug: z.string().min(1, 'Slug da landing page é obrigatório'),
  source: z.string().optional(),
  medium: z.string().optional(),
  campaign: z.string().optional(),
  metadata: z.record(z.any()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📥 Dados recebidos:', body)
    
    const leadData = captureLeadSchema.parse(body)
    console.log('✅ Dados validados:', leadData)

    // Buscar a landing page pelo slug
    const landingPage = await prisma.landingPage.findUnique({
      where: { slug: leadData.landingPageSlug },
      include: { user: true }
    })

    if (!landingPage) {
      return NextResponse.json(
        { error: 'Landing page não encontrada' },
        { status: 404 }
      )
    }

    // Verificar se o lead já existe para esta landing page
    const existingLead = await prisma.lead.findFirst({
      where: {
        email: leadData.email,
        landingPageId: landingPage.id
      }
    })

    if (existingLead) {
      return NextResponse.json(
        { error: 'Lead já existe para esta landing page' },
        { status: 400 }
      )
    }

    // Capturar informações do request
    const userAgent = request.headers.get('user-agent') || ''
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    const referrer = request.headers.get('referer') || ''

    // Criar o lead
    const lead = await prisma.lead.create({
      data: {
        email: leadData.email,
        name: leadData.name,
        phone: leadData.phone,
        source: leadData.source,
        medium: leadData.medium,
        campaign: leadData.campaign,
        landingPageId: landingPage.id,
        landingPageSlug: leadData.landingPageSlug,
        userId: landingPage.userId,
        metadata: leadData.metadata ? JSON.stringify(leadData.metadata) : null,
      }
    })

    // Registrar analytics
    await prisma.analytics.create({
      data: {
        landingPageId: landingPage.id,
        event: 'conversion',
        userAgent,
        ip,
        referrer,
        utmSource: leadData.source,
        utmMedium: leadData.medium,
        utmCampaign: leadData.campaign,
        metadata: leadData.metadata ? JSON.stringify(leadData.metadata) : null,
      }
    })

    // Incrementar contador no cache
    const cacheKey = `leads:${landingPage.id}:count`
    cache.incr(cacheKey)

    // Incrementar contador de conversões diárias
    const today = new Date().toISOString().split('T')[0]
    const dailyKey = `conversions:${landingPage.id}:${today}`
    cache.incr(dailyKey)

    return NextResponse.json({
      message: 'Lead capturado com sucesso',
      leadId: lead.id,
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log('❌ Erro de validação:', error.errors)
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('❌ Erro na captura de lead:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Endpoint para registrar visualizações de página
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const variant = searchParams.get('variant')

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar a landing page
    const landingPage = await prisma.landingPage.findUnique({
      where: { slug }
    })

    if (!landingPage) {
      return NextResponse.json(
        { error: 'Landing page não encontrada' },
        { status: 404 }
      )
    }

    // Capturar informações do request
    const userAgent = request.headers.get('user-agent') || ''
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    const referrer = request.headers.get('referer') || ''

    // Registrar visualização
    await prisma.analytics.create({
      data: {
        landingPageId: landingPage.id,
        event: 'view',
        variant,
        userAgent,
        ip,
        referrer,
      }
    })

    // Incrementar contador de visualizações no cache
    const viewKey = `views:${landingPage.id}:count`
    cache.incr(viewKey)

    // Incrementar contador de visualizações diárias
    const today = new Date().toISOString().split('T')[0]
    const dailyViewKey = `views:${landingPage.id}:${today}`
    cache.incr(dailyViewKey)

    if (variant) {
      const variantKey = `views:${landingPage.id}:variant:${variant}`
      cache.incr(variantKey)
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Erro no registro de visualização:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}