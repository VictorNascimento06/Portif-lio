'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface LandingPage {
  id: string
  title: string
  slug: string
}

interface ABTestVariant {
  id: string
  name: string
  title: string
  description: string
  content: any
  trafficPercentage: number
}

interface ABTest {
  id: string
  name: string
  landingPageId: string
  landingPage: LandingPage
  variants: ABTestVariant[]
  isActive: boolean
  startDate: string
  endDate?: string
  winner?: string
  createdAt: string
}

export default function ABTestPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [abTests, setAbTests] = useState<ABTest[]>([])
  const [landingPages, setLandingPages] = useState<LandingPage[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedTest, setSelectedTest] = useState<ABTest | null>(null)

  // Form state for creating new A/B test
  const [formData, setFormData] = useState({
    name: '',
    landingPageId: '',
    variants: [
      { name: 'Variante A (Original)', trafficPercentage: 50 },
      { name: 'Variante B', trafficPercentage: 50 }
    ]
  })

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
      return
    }
    fetchData()
  }, [session, status])

  const fetchData = async () => {
    try {
      const [abTestsRes, landingPagesRes] = await Promise.all([
        fetch('/api/ab-tests'),
        fetch('/api/landing-pages')
      ])
      
      const abTestsData = await abTestsRes.json()
      const landingPagesData = await landingPagesRes.json()
      
      setAbTests(abTestsData)
      setLandingPages(landingPagesData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/ab-tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowCreateForm(false)
        setFormData({
          name: '',
          landingPageId: '',
          variants: [
            { name: 'Variante A (Original)', trafficPercentage: 50 },
            { name: 'Variante B', trafficPercentage: 50 }
          ]
        })
        fetchData()
      }
    } catch (error) {
      console.error('Erro ao criar teste A/B:', error)
    }
  }

  const handleToggleTest = async (testId: string, isActive: boolean) => {
    try {
      await fetch(`/api/ab-tests/${testId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      })
      fetchData()
    } catch (error) {
      console.error('Erro ao atualizar teste:', error)
    }
  }

  const addVariant = () => {
    const currentTotal = formData.variants.reduce((sum, v) => sum + v.trafficPercentage, 0)
    if (currentTotal < 100) {
      setFormData({
        ...formData,
        variants: [
          ...formData.variants,
          { 
            name: `Variante ${String.fromCharCode(65 + formData.variants.length)}`, 
            trafficPercentage: Math.min(100 - currentTotal, 25) 
          }
        ]
      })
    }
  }

  const updateVariantPercentage = (index: number, percentage: number) => {
    const newVariants = [...formData.variants]
    newVariants[index].trafficPercentage = percentage
    setFormData({ ...formData, variants: newVariants })
  }

  const getTotalPercentage = () => {
    return formData.variants.reduce((sum, v) => sum + v.trafficPercentage, 0)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Testes A/B</h1>
              <p className="mt-2 text-gray-600">
                Gerencie seus testes A/B e otimize suas conversões
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Novo Teste A/B
            </button>
          </div>
        </div>

        {/* Create Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">Criar Novo Teste A/B</h2>
              
              <form onSubmit={handleCreateTest} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome do Teste</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Teste de Título Homepage"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Landing Page</label>
                  <select
                    value={formData.landingPageId}
                    onChange={(e) => setFormData({ ...formData, landingPageId: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecione uma landing page</option>
                    {landingPages.map((lp) => (
                      <option key={lp.id} value={lp.id}>
                        {lp.title} ({lp.slug})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium">Variantes</label>
                    <button
                      type="button"
                      onClick={addVariant}
                      disabled={formData.variants.length >= 5 || getTotalPercentage() >= 100}
                      className="text-blue-600 hover:text-blue-700 disabled:text-gray-400"
                    >
                      + Adicionar Variante
                    </button>
                  </div>
                  
                  {formData.variants.map((variant, index) => (
                    <div key={index} className="flex items-center space-x-4 mb-3">
                      <input
                        type="text"
                        value={variant.name}
                        onChange={(e) => {
                          const newVariants = [...formData.variants]
                          newVariants[index].name = e.target.value
                          setFormData({ ...formData, variants: newVariants })
                        }}
                        className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="Nome da variante"
                      />
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={variant.trafficPercentage}
                          onChange={(e) => updateVariantPercentage(index, parseInt(e.target.value) || 0)}
                          className="w-20 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-500">%</span>
                      </div>
                      {formData.variants.length > 2 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newVariants = formData.variants.filter((_, i) => i !== index)
                            setFormData({ ...formData, variants: newVariants })
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <div className="text-sm text-gray-600 mt-2">
                    Total: {getTotalPercentage()}% 
                    {getTotalPercentage() !== 100 && (
                      <span className="text-red-600 ml-2">
                        (Deve somar 100%)
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={getTotalPercentage() !== 100}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    Criar Teste
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tests List */}
        <div className="space-y-6">
          {abTests.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📊</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Nenhum teste A/B criado
              </h3>
              <p className="text-gray-600 mb-6">
                Crie seu primeiro teste A/B para começar a otimizar suas conversões
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Criar Primeiro Teste
              </button>
            </div>
          ) : (
            abTests.map((test) => (
              <div key={test.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{test.name}</h3>
                    <p className="text-gray-600">
                      Landing Page: {test.landingPage.title} ({test.landingPage.slug})
                    </p>
                    <p className="text-sm text-gray-500">
                      Criado em: {new Date(test.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      test.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {test.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                    <button
                      onClick={() => handleToggleTest(test.id, test.isActive)}
                      className={`px-4 py-2 rounded-lg text-sm ${
                        test.isActive
                          ? 'bg-red-100 text-red-800 hover:bg-red-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {test.isActive ? 'Pausar' : 'Ativar'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {test.variants.map((variant, index) => (
                    <div key={variant.id} className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">{variant.name}</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>Tráfego: {variant.trafficPercentage}%</p>
                        <p>Conversões: 0</p>
                        <p>Taxa: 0.0%</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setSelectedTest(test)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Ver Detalhes →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}