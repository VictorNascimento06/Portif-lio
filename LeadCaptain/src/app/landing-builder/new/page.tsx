'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ArrowLeft, Target, Save, Upload, X } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

// Configurações por categoria
const categoryConfig = {
  seguros: {
    name: 'Seguros & Planos de Saúde',
    color: '#2563EB', // Azul confiança
    buttonText: 'Solicitar Orçamento',
    templates: ['corporativo', 'moderno', 'minimalista'],
    features: ['Cobertura Nacional', 'Atendimento 24h', 'Sem Carência']
  },
  cursos: {
    name: 'Cursos & Educação',
    color: '#7C3AED', // Roxo criatividade
    buttonText: 'Quero me Inscrever',
    templates: ['educacional', 'moderno', 'dinamico'],
    features: ['Certificado Reconhecido', 'Suporte Online', 'Material Incluso']
  },
  ecommerce: {
    name: 'E-commerce & Produtos',
    color: '#DC2626', // Vermelho urgência
    buttonText: 'Comprar Agora',
    templates: ['vendas', 'promocional', 'moderno'],
    features: ['Entrega Grátis', 'Garantia Estendida', 'Desconto Especial']
  },
  servicos: {
    name: 'Serviços Profissionais',
    color: '#059669', // Verde profissional
    buttonText: 'Solicitar Serviço',
    templates: ['profissional', 'corporativo', 'moderno'],
    features: ['Profissionais Qualificados', 'Orçamento Gratuito', 'Garantia de Qualidade']
  },
  consultoria: {
    name: 'Consultoria & Coaching',
    color: '#7C2D12', // Marrom autoridade
    buttonText: 'Agendar Consulta',
    templates: ['executivo', 'profissional', 'minimalista'],
    features: ['Consultoria Personalizada', 'Resultados Garantidos', 'Metodologia Comprovada']
  }
}

export default function NewLandingPagePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    slug: '',
    category: 'seguros', // Nova categoria
    template: 'modern',
    primaryColor: '#3B82F6',
    headline: '',
    subheadline: '',
    buttonText: 'Quero Saber Mais',
    features: ['', '', ''],
    images: [] as File[], // Para upload de imagens
    imageUrls: [] as string[] // URLs das imagens
  })

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }))
  }

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData(prev => ({ ...prev, features: newFeatures }))
  }

  const handleCategoryChange = (category: string) => {
    const config = categoryConfig[category as keyof typeof categoryConfig]
    setFormData(prev => ({
      ...prev,
      category,
      primaryColor: config.color,
      buttonText: config.buttonText,
      features: config.features,
      template: config.templates[0]
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + formData.images.length > 6) {
      toast.error('Máximo de 6 imagens permitidas')
      return
    }

    // Criar URLs para preview
    const newImageUrls = files.map(file => URL.createObjectURL(file))
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files],
      imageUrls: [...prev.imageUrls, ...newImageUrls]
    }))
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Primeiro, fazer upload das imagens se houver
      let uploadedImageUrls: string[] = []
      
      if (formData.images.length > 0) {
        const formDataImages = new FormData()
        formData.images.forEach((image, index) => {
          formDataImages.append(`image-${index}`, image)
        })

        const uploadResponse = await fetch('/api/upload/images', {
          method: 'POST',
          body: formDataImages,
        })

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          uploadedImageUrls = uploadData.urls
        } else {
          toast.error('Erro ao fazer upload das imagens')
          setIsLoading(false)
          return
        }
      }

      // Criar a landing page com as URLs das imagens
      const response = await fetch('/api/landing-pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          slug: formData.slug,
          category: formData.category,
          template: formData.template,
          content: {
            headline: formData.headline,
            subheadline: formData.subheadline,
            buttonText: formData.buttonText,
            features: formData.features.filter(f => f.trim() !== ''),
            primaryColor: formData.primaryColor,
            images: uploadedImageUrls
          }
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Landing page criada com sucesso!')
        router.push(`/lp/${formData.slug}`)
      } else {
        toast.error(data.error || 'Erro ao criar landing page')
      }
    } catch (error) {
      toast.error('Erro ao criar landing page')
    } finally {
      setIsLoading(false)
    }
  }

  if (!session) {
    return <div>Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Voltar ao Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-2">
                <Target className="w-6 h-6 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">LeadCaptain</span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Olá, {session.user?.name}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Criar Nova Landing Page</h1>
            <p className="text-gray-600 mt-2">
              Configure sua página de captura de leads personalizada
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Informações Básicas */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Informações Básicas</h2>
              
              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria do Negócio *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(categoryConfig).map(([key, config]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleCategoryChange(key)}
                      className={`p-3 border-2 rounded-lg text-left transition-colors ${
                        formData.category === key
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-sm">{config.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{config.buttonText}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título da Landing Page *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Curso de Marketing Digital"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL (Slug) *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      /lp/
                    </span>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="curso-marketing-digital"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descreva o que essa landing page oferece..."
                />
              </div>
            </div>

            {/* Conteúdo */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Conteúdo da Página</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título Principal (Headline) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.headline}
                  onChange={(e) => setFormData(prev => ({ ...prev, headline: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Aprenda Marketing Digital do Zero"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtítulo
                </label>
                <input
                  type="text"
                  value={formData.subheadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, subheadline: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Curso completo com certificado"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texto do Botão
                </label>
                <input
                  type="text"
                  value={formData.buttonText}
                  onChange={(e) => setFormData(prev => ({ ...prev, buttonText: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Quero me Inscrever"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Benefícios/Features (até 3)
                </label>
                <div className="space-y-3">
                  {formData.features.map((feature, index) => (
                    <input
                      key={index}
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Benefício ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Upload de Imagens */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Imagens e Logos</h2>
              <p className="text-sm text-gray-600">
                Adicione logos de operadoras, certificações ou imagens do produto (máximo 6 imagens)
              </p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload de Imagens
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Clique para fazer upload de imagens
                        </span>
                        <span className="mt-1 block text-sm text-gray-500">
                          PNG, JPG, JPEG até 5MB cada
                        </span>
                      </label>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        className="sr-only"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </div>
                </div>

                {/* Preview das imagens */}
                {formData.imageUrls.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Imagens Selecionadas:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {formData.imageUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Design */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Design</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template
                  </label>
                  <select
                    value={formData.template}
                    onChange={(e) => setFormData(prev => ({ ...prev, template: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categoryConfig[formData.category as keyof typeof categoryConfig]?.templates.map(template => (
                      <option key={template} value={template}>
                        {template.charAt(0).toUpperCase() + template.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor Principal
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-4 pt-6">
              <Link
                href="/dashboard"
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'Criando...' : 'Criar Landing Page'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}