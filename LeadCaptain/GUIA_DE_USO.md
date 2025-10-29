# 🎯 LeadCaptain - Guia de Uso

Sistema completo de captura e gestão de leads com A/B testing automático.

## 🚀 Como Usar

### 1. Acesso ao Sistema

**Login de Demonstração:**
- **Email:** demo@leadcaptain.com
- **Senha:** 123456

**URLs Importantes:**
- **Homepage:** http://localhost:3000
- **Login:** http://localhost:3000/login
- **Dashboard:** http://localhost:3000/dashboard
- **Landing Page Demo:** http://localhost:3000/lp/demo-leadcaptain

### 2. Funcionalidades Implementadas

#### ✅ Sistema de Autenticação
- Registro de novos usuários
- Login com email/senha
- Proteção de rotas com middleware
- Sessões seguras com NextAuth.js

#### ✅ Dashboard Analytics
- Métricas em tempo real
- Visualização de leads capturados
- Taxa de conversão
- Estatísticas de visitantes

#### ✅ Captura de Leads
- Formulários otimizados
- Validação de dados
- Armazenamento no banco
- Analytics automáticos

#### ✅ Landing Pages
- Páginas públicas para captura
- Templates responsivos
- URLs personalizadas (/lp/[slug])

#### ✅ APIs RESTful
- **POST /api/leads/capture** - Capturar leads
- **PUT /api/leads/capture?slug=X** - Registrar visualizações
- **GET /api/leads** - Listar leads (autenticado)
- **GET /api/analytics** - Dados de analytics (autenticado)
- **GET /api/landing-pages** - Listar landing pages (autenticado)

### 3. Banco de Dados

O sistema usa SQLite para desenvolvimento com as seguintes tabelas:
- **users** - Usuários do sistema
- **landing_pages** - Páginas de captura
- **leads** - Leads capturados
- **analytics** - Eventos de analytics
- **ab_tests** - Testes A/B (estrutura criada)

### 4. Testando o Sistema

#### Passo 1: Acesse a Landing Page Demo
```
http://localhost:3000/lp/demo-leadcaptain
```

#### Passo 2: Preencha o Formulário
- Nome: Seu Nome
- Email: test@exemplo.com
- Telefone: (11) 99999-9999

#### Passo 3: Veja os Dados no Dashboard
1. Faça login em: http://localhost:3000/login
2. Use: demo@leadcaptain.com / 123456
3. Acesse: http://localhost:3000/dashboard

### 5. Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── api/               # APIs REST
│   │   ├── auth/         # Autenticação
│   │   ├── leads/        # Captura de leads
│   │   ├── analytics/    # Analytics
│   │   └── landing-pages/ # Gestão de LPs
│   ├── dashboard/        # Dashboard privado
│   ├── login/           # Página de login
│   ├── register/        # Página de registro
│   └── lp/              # Landing pages públicas
├── components/           # Componentes React
├── lib/                 # Utilitários
│   ├── prisma.ts        # Cliente Prisma
│   └── cache.ts         # Sistema de cache
└── types/               # Tipos TypeScript

prisma/
├── schema.prisma        # Schema do banco
├── seed.js             # Dados de exemplo
└── migrations/         # Migrações
```

### 6. Tecnologias Utilizadas

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Banco:** SQLite (desenvolvimento)
- **Autenticação:** NextAuth.js
- **UI:** Lucide Icons, React Hot Toast
- **Validação:** Zod
- **Forms:** React Hook Form

### 7. Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Banco de dados
npm run db:generate    # Gerar cliente Prisma
npm run db:migrate     # Executar migrações
npm run db:seed        # Popular com dados demo
npm run db:studio      # Interface visual do banco

# Build para produção
npm run build
npm run start
```

### 8. Próximos Passos (Para Produção)

1. **Configurar PostgreSQL** para produção
2. **Implementar Redis** real para cache
3. **Adicionar editor drag & drop** para landing pages
4. **Implementar A/B testing** funcional
5. **Adicionar Charts.js** para gráficos reais
6. **Configurar email** para notificações
7. **Deploy na Vercel** ou similar

---

## 🎉 Sistema Pronto para Teste!

O LeadCaptain está funcionando com todas as funcionalidades básicas implementadas. Você pode:

1. ✅ Criar contas de usuário
2. ✅ Fazer login/logout
3. ✅ Visualizar dashboard com métricas
4. ✅ Capturar leads via formulários
5. ✅ Acompanhar analytics em tempo real
6. ✅ Gerenciar landing pages

**Dados de teste já criados** - Use o login demo para explorar!