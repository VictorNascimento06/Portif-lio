import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LeadCaptain - Sistema de Captura de Leads',
  description: 'Transforme visitantes em clientes com nosso sistema avançado de captura de leads e A/B testing automático.',
  keywords: 'leads, marketing, ab testing, analytics, conversão, vendas',
  authors: [{ name: 'Victor Cruz', url: 'https://github.com/VictorNascimento06' }],
  creator: 'Cruz Technology',
  publisher: 'Cruz Technology',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://leadcaptain.vercel.app',
    title: 'LeadCaptain - Sistema de Captura de Leads',
    description: 'Transforme visitantes em clientes com nosso sistema avançado de captura de leads e A/B testing automático.',
    siteName: 'LeadCaptain',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LeadCaptain - Sistema de Captura de Leads',
    description: 'Transforme visitantes em clientes com nosso sistema avançado de captura de leads e A/B testing automático.',
    creator: '@victorcruz',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  )
}