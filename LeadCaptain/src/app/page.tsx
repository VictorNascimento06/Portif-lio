import Link from 'next/link'
import { ArrowRight, BarChart3, Target, Zap, Users, TrendingUp, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">LeadCaptain</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Funcionalidades
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Preços
              </Link>
              <Link href="#demo" className="text-gray-600 hover:text-gray-900 transition-colors">
                Demo
              </Link>
            </nav>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/login" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Entrar
              </Link>
              <Link 
                href="/register" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Começar Grátis
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Transforme Visitantes em{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Clientes
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Sistema avançado de captura de leads com A/B testing automático, 
              analytics em tempo real e integrações poderosas para maximizar suas conversões.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link 
                href="/register" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
              >
                Começar Gratuitamente
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link 
                href="/demo" 
                className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Ver Demo ao Vivo
              </Link>
            </div>
            
            <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-green-500" />
                Teste Grátis 14 dias
              </div>
              <div className="flex items-center">
                <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                Setup em 5 minutos
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-blue-500" />
                +1000 empresas confiam
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tudo que você precisa para capturar mais leads
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ferramentas poderosas e intuitivas para criar, testar e otimizar 
              suas páginas de captura com máxima eficiência.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                A/B Testing Inteligente
              </h3>
              <p className="text-gray-600">
                Teste diferentes versões automaticamente e descubra o que converte melhor. 
                Algoritmos inteligentes decidem o vencedor por você.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Landing Pages Otimizadas
              </h3>
              <p className="text-gray-600">
                Editor drag & drop com templates comprovados para alta conversão. 
                Responsive e otimizado para SEO automaticamente.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Analytics Avançado
              </h3>
              <p className="text-gray-600">
                Métricas em tempo real, funil de conversão detalhado e insights 
                actionáveis para otimizar continuamente seus resultados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pronto para 10x suas conversões?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Junte-se a milhares de empresas que já transformaram visitantes em clientes com LeadCaptain.
          </p>
          <Link 
            href="/register" 
            className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
          >
            Começar Agora - É Grátis
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">LeadCaptain</span>
              </div>
              <p className="text-gray-400">
                Transformando visitantes em clientes com tecnologia de ponta.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Funcionalidades</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Preços</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Demo</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Sobre</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contato</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Desenvolvido por</h4>
              <p className="text-gray-400 mb-2">Victor Cruz</p>
              <p className="text-gray-400 mb-2">Cruz Technology</p>
              <div className="flex space-x-4">
                <Link href="https://github.com/VictorNascimento06" className="text-gray-400 hover:text-white transition-colors">
                  GitHub
                </Link>
                <Link href="https://linkedin.com/in/victor-da-cruz-79ba4331a" className="text-gray-400 hover:text-white transition-colors">
                  LinkedIn
                </Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 LeadCaptain. Todos os direitos reservados. Desenvolvido por Cruz Technology.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}