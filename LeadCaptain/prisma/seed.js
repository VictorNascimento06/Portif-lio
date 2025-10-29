const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar usuário de exemplo
  const hashedPassword = await bcrypt.hash('123456', 12)
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@leadcaptain.com' },
    update: {},
    create: {
      email: 'demo@leadcaptain.com',
      name: 'Demo User',
      password: hashedPassword,
      role: 'USER',
    },
  })

  console.log('✅ Usuário criado:', user.email)

  // Criar landing page de exemplo
  const landingPageContent = {
    hero: {
      title: 'Transforme Seus Visitantes em Clientes',
      subtitle: 'Sistema completo de captura e gestão de leads com A/B testing automático',
      cta: 'Quero Começar Agora'
    },
    features: [
      {
        title: 'Analytics em Tempo Real',
        description: 'Acompanhe suas métricas de conversão ao vivo'
      },
      {
        title: 'A/B Testing Automático',
        description: 'Otimize suas páginas automaticamente'
      },
      {
        title: 'Captura Inteligente',
        description: 'Capture leads com formulários otimizados'
      }
    ]
  }

  const landingPage = await prisma.landingPage.upsert({
    where: { slug: 'demo-leadcaptain' },
    update: {},
    create: {
      title: 'Demo - LeadCaptain',
      slug: 'demo-leadcaptain',
      description: 'Página de demonstração do sistema LeadCaptain',
      content: JSON.stringify(landingPageContent),
      template: 'default',
      isActive: true,
      userId: user.id,
    },
  })

  console.log('✅ Landing page criada:', landingPage.slug)

  // Criar alguns leads de exemplo
  const leads = [
    {
      email: 'joao@empresa.com',
      name: 'João Silva',
      phone: '(11) 99999-1111',
      source: 'google',
      medium: 'cpc',
      campaign: 'leadcaptain-demo'
    },
    {
      email: 'maria@startup.com',
      name: 'Maria Santos',
      phone: '(11) 99999-2222',
      source: 'facebook',
      medium: 'social',
      campaign: 'leadcaptain-promo'
    },
    {
      email: 'pedro@tech.com',
      name: 'Pedro Costa',
      phone: '(11) 99999-3333',
      source: 'linkedin',
      medium: 'social',
      campaign: 'b2b-outreach'
    }
  ]

  for (const leadData of leads) {
    const existingLead = await prisma.lead.findFirst({
      where: {
        email: leadData.email,
        landingPageId: landingPage.id
      }
    })

    if (!existingLead) {
      await prisma.lead.create({
        data: {
          ...leadData,
          landingPageId: landingPage.id,
          landingPageSlug: landingPage.slug,
          userId: user.id,
        }
      })
    }
  }

  console.log('✅ Leads de exemplo criados')

  // Criar dados de analytics
  const today = new Date()
  
  // Criar dados dos últimos 7 dias
  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)

    // Views
    const viewCount = Math.floor(Math.random() * 50) + 20
    for (let j = 0; j < viewCount; j++) {
      await prisma.analytics.create({
        data: {
          landingPageId: landingPage.id,
          event: 'view',
          createdAt: date,
        }
      })
    }

    // Conversions
    const conversionCount = Math.floor(Math.random() * 5) + 1
    for (let j = 0; j < conversionCount; j++) {
      await prisma.analytics.create({
        data: {
          landingPageId: landingPage.id,
          event: 'conversion',
          utmSource: ['google', 'facebook', 'linkedin'][Math.floor(Math.random() * 3)],
          utmMedium: ['cpc', 'social', 'organic'][Math.floor(Math.random() * 3)],
          createdAt: date,
        }
      })
    }
  }

  console.log('✅ Dados de analytics criados')

  console.log('🎉 Seed concluído com sucesso!')
  console.log('')
  console.log('📋 Dados criados:')
  console.log('- Usuário: demo@leadcaptain.com (senha: 123456)')
  console.log('- Landing page: /lp/demo-leadcaptain')
  console.log('- 3 leads de exemplo')
  console.log('- Dados de analytics dos últimos 7 dias')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })