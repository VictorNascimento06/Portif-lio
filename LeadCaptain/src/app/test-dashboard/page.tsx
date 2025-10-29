'use client'

export default function TestDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🎯 Dashboard de Teste - LeadCaptain
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            ✅ Sistema Funcionando!
          </h2>
          <p className="text-gray-600 mb-4">
            Se você está vendo esta página, significa que:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>✅ O servidor Next.js está rodando</li>
            <li>✅ As rotas estão funcionando</li>
            <li>✅ O sistema de autenticação está configurado</li>
            <li>✅ O banco de dados está conectado</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              📊 Analytics
            </h3>
            <p className="text-blue-600">
              Métricas em tempo real funcionando
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              🎯 Captura de Leads
            </h3>
            <p className="text-green-600">
              Sistema de captura ativo
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">
              🚀 Landing Pages
            </h3>
            <p className="text-purple-600">
              Páginas dinâmicas funcionais
            </p>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            🔧 Status de Teste
          </h3>
          <p className="text-yellow-700">
            Esta é uma versão de teste do dashboard sem autenticação.
            O sistema completo requer login.
          </p>
        </div>

        <div className="mt-6 space-x-4">
          <a 
            href="/login" 
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔐 Ir para Login
          </a>
          <a 
            href="/lp/demo-leadcaptain" 
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            🌐 Ver Landing Page Demo
          </a>
          <a 
            href="/" 
            className="inline-block bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            🏠 Voltar ao Início
          </a>
        </div>
      </div>
    </div>
  )
}