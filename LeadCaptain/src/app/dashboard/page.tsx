'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Eye,
  Target,
  LogOut,
  Plus,
  Calendar,
  Download
} from 'lucide-react'
import { LeadsByDayChart, ConversionRateChart } from '@/components/charts'

// Mock data para demonstração
const mockStats = {
  totalLeads: 1247,
  conversionRate: 3.4,
  visitors: 36650,
  revenue: 89400
}

const mockChartData = [
  { date: '2025-10-22', leads: 45, visitors: 1200 },
  { date: '2025-10-23', leads: 52, visitors: 1350 },
  { date: '2025-10-24', leads: 38, visitors: 1100 },
  { date: '2025-10-25', leads: 61, visitors: 1500 },
  { date: '2025-10-26', leads: 48, visitors: 1280 },
  { date: '2025-10-27', leads: 55, visitors: 1400 },
  { date: '2025-10-28', leads: 43, visitors: 1250 },
]

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/login')
      return
    }

    setIsLoading(false)
  }, [session, status, router])

  const handleCreateLandingPage = () => {
    // Redirecionar para a página de criação de landing page
    router.push('/landing-builder/new')
  }

  const handleNewABTest = () => {
    // Redirecionar para a página de A/B test
    router.push('/ab-test')
  }

  const handleExportReport = () => {
    alert('Funcionalidade de Exportar Relatório em desenvolvimento!')
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">LeadCaptain</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Olá, {session?.user?.name}
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Acompanhe suas métricas de conversão em tempo real</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Leads</p>
                <p className="text-3xl font-bold text-gray-900">{mockStats.totalLeads.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+12% este mês</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                <p className="text-3xl font-bold text-gray-900">{mockStats.conversionRate}%</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+0.8% esta semana</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Visitantes</p>
                <p className="text-3xl font-bold text-gray-900">{mockStats.visitors.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+24% este mês</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita</p>
                <p className="text-3xl font-bold text-gray-900">R$ {mockStats.revenue.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+18% este mês</span>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Leads por Dia</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700">Ver detalhes</button>
            </div>
            <div className="h-64">
              <LeadsByDayChart data={mockChartData} />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Taxa de Conversão</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700">Ver detalhes</button>
            </div>
            <div className="h-64">
              <ConversionRateChart data={mockChartData} />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={handleCreateLandingPage}
              className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <div className="text-center">
                <Plus className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm font-medium text-gray-600">Criar Landing Page</p>
              </div>
            </button>

            <button 
              onClick={handleNewABTest}
              className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors"
            >
              <div className="text-center">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm font-medium text-gray-600">Novo A/B Test</p>
              </div>
            </button>

            <button 
              onClick={handleExportReport}
              className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors"
            >
              <div className="text-center">
                <Download className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm font-medium text-gray-600">Exportar Relatório</p>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}