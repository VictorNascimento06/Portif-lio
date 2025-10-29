import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Middleware adicional pode ser adicionado aqui
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Verificar se o usuário está autenticado para rotas protegidas
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          return !!token
        }
        if (req.nextUrl.pathname.startsWith('/landing-builder')) {
          return !!token
        }
        if (req.nextUrl.pathname.startsWith('/api/') && 
            !req.nextUrl.pathname.startsWith('/api/auth') &&
            !req.nextUrl.pathname.startsWith('/api/leads/capture')) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/landing-builder/:path*',
    '/api/leads/:path*',
    '/api/analytics/:path*',
    '/api/ab-tests/:path*'
  ]
}