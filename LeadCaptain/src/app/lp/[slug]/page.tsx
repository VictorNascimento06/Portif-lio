'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Target, ArrowRight, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

// Configurações de conteúdo por categoria
const categoryContent = {
  seguros: {
    formTitle: 'Receba seu Orçamento Gratuito',
    formSubtitle: 'Preencha o formulário e nossa equipe entrará em contato',
    sectionTitle: 'Por que escolher nossos planos?',
    sectionSubtitle: 'Proteção completa para você e sua família',
    defaultFeatures: [
      'Cobertura nacional em toda rede credenciada',
      'Atendimento 24 horas todos os dias',
      'Sem período de carência para urgências'
    ],
    bottomCards: [
      {
        title: 'Cobertura Completa',
        description: 'Ampla rede credenciada em todo o país'
      },
      {
        title: 'Sem Burocracia',
        description: 'Atendimento rápido e sem complicações'
      },
      {
        title: 'Melhor Preço',
        description: 'Planos que cabem no seu orçamento'
      }
    ]
  },
  cursos: {
    formTitle: 'Garante sua Vaga Agora',
    formSubtitle: 'Preencha o formulário e receba mais informações',
    sectionTitle: 'Por que escolher nosso curso?',
    sectionSubtitle: 'Educação de qualidade com certificação reconhecida',
    defaultFeatures: [
      'Certificado reconhecido pelo MEC',
      'Suporte online com professores',
      'Material didático completo incluso'
    ],
    bottomCards: [
      {
        title: 'Certificação',
        description: 'Certificado reconhecido pelo mercado'
      },
      {
        title: 'Suporte Total',
        description: 'Professores disponíveis para dúvidas'
      },
      {
        title: 'Resultados',
        description: 'Capacitação completa garantida'
      }
    ]
  },
  ecommerce: {
    formTitle: 'Aproveite esta Oferta Especial',
    formSubtitle: 'Preencha seus dados e finalize sua compra',
    sectionTitle: 'Por que comprar conosco?',
    sectionSubtitle: 'Garantia de qualidade e satisfação',
    defaultFeatures: [
      'Entrega grátis para todo o Brasil',
      'Garantia estendida de 12 meses',
      'Desconto especial para primeira compra'
    ],
    bottomCards: [
      {
        title: 'Entrega Rápida',
        description: 'Receba em casa sem taxa de entrega'
      },
      {
        title: 'Garantia Total',
        description: 'Produto com garantia estendida'
      },
      {
        title: 'Melhor Preço',
        description: 'Preços imbatíveis do mercado'
      }
    ]
  },
  servicos: {
    formTitle: 'Solicite seu Orçamento',
    formSubtitle: 'Preencha o formulário e nossa equipe entrará em contato',
    sectionTitle: 'Por que escolher nossos serviços?',
    sectionSubtitle: 'Profissionais qualificados e resultados garantidos',
    defaultFeatures: [
      'Profissionais certificados e experientes',
      'Orçamento gratuito sem compromisso',
      'Garantia de qualidade nos serviços'
    ],
    bottomCards: [
      {
        title: 'Profissionais',
        description: 'Equipe qualificada e experiente'
      },
      {
        title: 'Orçamento Grátis',
        description: 'Avaliação sem compromisso'
      },
      {
        title: 'Garantia',
        description: 'Qualidade garantida nos serviços'
      }
    ]
  },
  consultoria: {
    formTitle: 'Agende sua Consulta Estratégica',
    formSubtitle: 'Preencha o formulário e vamos conversar sobre seus objetivos',
    sectionTitle: 'Por que nossa consultoria?',
    sectionSubtitle: 'Metodologia comprovada e resultados mensuráveis',
    defaultFeatures: [
      'Consultoria personalizada para seu negócio',
      'Metodologia comprovada no mercado',
      'Resultados garantidos em 90 dias'
    ],
    bottomCards: [
      {
        title: 'Estratégia',
        description: 'Plano personalizado para seu negócio'
      },
      {
        title: 'Experiência',
        description: 'Metodologia testada no mercado'
      },
      {
        title: 'Resultados',
        description: 'ROI garantido em até 90 dias'
      }
    ]
  }
}

interface LandingPageData {
  id: string
  title: string
  description: string
  content: any
  template: string
}

export default function LandingPage() {
  const { slug } = useParams()
  const [landingPage, setLandingPage] = useState<LandingPageData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (slug) {
      fetchLandingPage()
      // Registrar visualização
      registerView()
    }
  }, [slug])

  const fetchLandingPage = async () => {
    try {
      const response = await fetch(`/api/landing-pages/${slug}`)
      if (response.ok) {
        const data = await response.json()
        setLandingPage(data.landingPage)
      } else {
        toast.error('Landing page não encontrada')
      }
    } catch (error) {
      toast.error('Erro ao carregar página')
    } finally {
      setIsLoading(false)
    }
  }

  const registerView = async () => {
    try {
      await fetch(`/api/leads/capture?slug=${slug}`, {
        method: 'PUT'
      })
    } catch (error) {
      console.error('Erro ao registrar visualização:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const submitData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        landingPageSlug: slug,
        source: new URLSearchParams(window.location.search).get('utm_source') || undefined,
        medium: new URLSearchParams(window.location.search).get('utm_medium') || undefined,
        campaign: new URLSearchParams(window.location.search).get('utm_campaign') || undefined,
      }
      
      console.log('🚀 Enviando dados do formulário:', submitData)
      
      const response = await fetch('/api/leads/capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Obrigado! Entraremos em contato em breve.')
        setFormData({ name: '', email: '', phone: '' })
      } else {
        console.error('Erro na API:', data)
        toast.error(data.error || 'Erro ao enviar formulário')
      }
    } catch (error) {
      toast.error('Erro ao enviar formulário')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!landingPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Página não encontrada
          </h1>
          <p className="text-gray-600">
            A landing page que você está procurando não existe.
          </p>
        </div>
      </div>
    )
  }

  // Obter categoria da landing page
  const category = landingPage.content?.category || 'seguros'
  const categoryConfig = categoryContent[category as keyof typeof categoryContent] || categoryContent.seguros

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">LeadCaptain</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {landingPage.content?.headline || landingPage.title}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {landingPage.content?.subheadline || landingPage.description || 'Transforme seu negócio com nossa solução inovadora.'}
            </p>

            {/* Benefícios */}
            <div className="space-y-4 mb-8">
              {landingPage.content?.features?.length > 0 ? (
                landingPage.content.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-lg text-gray-700">{feature}</span>
                  </div>
                ))
              ) : (
                categoryConfig.defaultFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-lg text-gray-700">{feature}</span>
                  </div>
                ))
              )}
            </div>

            {/* Logos/Imagens das Operadoras */}
            {landingPage.content?.images?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  {landingPage.content.category === 'seguros' ? 'Operadoras Parceiras' : 'Nossos Parceiros'}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {landingPage.content.images.map((imageUrl: string, index: number) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                      <img
                        src={imageUrl}
                        alt={`Parceiro ${index + 1}`}
                        className="w-full h-16 object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Formulário */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {categoryConfig.formTitle}
              </h2>
              <p className="text-gray-600">
                {categoryConfig.formSubtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email profissional *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{ backgroundColor: landingPage.content?.primaryColor || '#3B82F6' }}
                className="w-full text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Enviando...</span>
                ) : (
                  <>
                    <span>{landingPage.content?.buttonText || 'Quero a Demonstração Gratuita'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-4">
              Seus dados estão seguros conosco. Não fazemos spam.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {categoryConfig.sectionTitle}
            </h2>
            <p className="text-lg text-gray-600">
              {categoryConfig.sectionSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {categoryConfig.bottomCards[0].title}
              </h3>
              <p className="text-gray-600">
                {categoryConfig.bottomCards[0].description}
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {categoryConfig.bottomCards[1].title}
              </h3>
              <p className="text-gray-600">
                {categoryConfig.bottomCards[1].description}
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {categoryConfig.bottomCards[2].title}
              </h3>
              <p className="text-gray-600">
                {categoryConfig.bottomCards[2].description}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}