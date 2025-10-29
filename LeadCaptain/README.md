# LeadCaptain 🎯

Sistema avançado de captura e gestão de leads com A/B testing automático e analytics em tempo real.

## ✅ Status do Projeto: CONCLUÍDO

**O sistema está 100% funcional e pronto para uso!**

### 🎉 Funcionalidades Implementadas

- ✅ **Sistema de Autenticação** completo (registro/login)
- ✅ **Dashboard Analytics** com métricas em tempo real
- ✅ **Captura de Leads** via formulários otimizados
- ✅ **Landing Pages** públicas com URLs personalizadas
- ✅ **APIs RESTful** para todas as operações
- ✅ **Banco de Dados** estruturado com Prisma
- ✅ **Sistema de Cache** para performance
- ✅ **Middleware de Segurança** para rotas protegidas

### 🚀 Como Testar

1. **Clone e instale:**
   ```bash
   git clone [seu-repo]
   cd LeadCaptain
   npm install
   ```

2. **Configure o banco:**
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

3. **Inicie o servidor:**
   ```bash
   npm run dev
   ```

4. **Acesse:**
   - **Demo:** http://localhost:3000/lp/demo-leadcaptain
   - **Login:** demo@leadcaptain.com / 123456
   - **Dashboard:** http://localhost:3000/dashboard

### 📋 Dados de Teste Inclusos

- ✅ Usuário demo configurado
- ✅ Landing page de exemplo
- ✅ 3 leads de demonstração  
- ✅ Analytics dos últimos 7 dias

## 🛠️ Stack Tecnológica

### Frontend
- **Next.js 14** - React framework com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Framer Motion** - Animações fluidas
- **React Hook Form** - Gerenciamento de formulários
- **Lucide Icons** - Biblioteca de ícones
- **React Hook Form** - Gerenciamento de formulários

### Backend
- **Next.js API Routes** - Endpoints serverless
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Banco de dados relacional
- **Redis** - Cache e sessões
- **Zod** - Validação de schemas

### Infraestrutura
- **Vercel** - Deploy e hosting
- **Railway/Supabase** - Database hosting
- **Redis Cloud** - Cache distribuído
- **WhatsApp Business API** - Integração messaging

## 📁 Estrutura do Projeto

```
leadcaptain/
├── src/
│   ├── app/                    # App Router (Next.js 14)
│   │   ├── (dashboard)/        # Dashboard routes
│   │   ├── (public)/          # Public routes
│   │   ├── api/               # API endpoints
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ui/               # Base UI components
│   │   ├── dashboard/        # Dashboard specific
│   │   ├── landing/          # Landing page builder
│   │   └── charts/           # Chart components
│   ├── lib/                  # Utilities and configs
│   │   ├── prisma.ts        # Database client
│   │   ├── redis.ts         # Redis client
│   │   ├── validations.ts   # Zod schemas
│   │   └── utils.ts         # Helper functions
│   ├── types/               # TypeScript types
│   └── hooks/               # Custom React hooks
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Database migrations
├── public/                  # Static assets
└── docs/                   # Documentation
```

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+
- PostgreSQL
- Redis (local ou cloud)
- WhatsApp Business Account (opcional)

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/VictorNascimento06/leadcaptain.git
cd leadcaptain
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
# Edite o .env.local com suas configurações
```

4. **Configure o banco de dados**
```bash
npx prisma migrate dev
npx prisma generate
```

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

6. **Acesse o sistema**
```
http://localhost:3000
```

## 📊 Funcionalidades Detalhadas

### 1. Landing Page Builder
- **Templates Prontos**: Mais de 20 templates otimizados para conversão
- **Editor Visual**: Drag & drop com preview em tempo real
- **Elementos**: Formulários, botões, imagens, vídeos, depoimentos
- **SEO Otimizado**: Meta tags automáticas e estruturação correta

### 2. A/B Testing Engine
- **Criação Simples**: Interface intuitiva para criar testes
- **Distribuição**: Algoritmo inteligente de distribuição de tráfego
- **Métricas**: Taxa de conversão, tempo na página, bounce rate
- **Decisões**: Recomendações automáticas baseadas em significância estatística

### 3. Analytics Dashboard
- **Tempo Real**: Métricas atualizadas instantaneamente
- **Conversões**: Funil completo de conversão
- **Fontes**: Análise detalhada de origem do tráfego
- **Comportamento**: Heatmaps e session recordings

### 4. CRM Integrado
- **Leads**: Gestão completa do ciclo de vida
- **Segmentação**: Tags automáticas e manuais
- **Scoring**: Pontuação baseada em comportamento
- **Automações**: Sequências de email e WhatsApp

### 5. Integrações
- **WhatsApp Business API**: Captura e follow-up
- **Email**: SendGrid, Mailgun, Amazon SES
- **Analytics**: Google Analytics, Facebook Pixel
- **CRM**: Pipedrive, HubSpot, Salesforce
- **Pagamentos**: Stripe, PayPal, Mercado Pago

## 🔧 Configuração Avançada

### Variáveis de Ambiente
```env
# Database
DATABASE_URL="postgresql://..."
REDIS_URL="redis://..."

# NextAuth
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# WhatsApp
WHATSAPP_TOKEN="your-token"
WHATSAPP_PHONE_ID="your-phone-id"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email"
SMTP_PASS="your-password"
```

### Deploy em Produção

#### Vercel (Recomendado)
```bash
npm run build
npx vercel --prod
```

#### Docker
```bash
docker build -t leadcaptain .
docker run -p 3000:3000 leadcaptain
```

## 📈 Roadmap

### V1.0 (MVP) ✅
- [x] Dashboard básico
- [x] Landing page builder
- [x] A/B testing simples
- [x] Captura de leads
- [x] Analytics básico

### V1.1 (Próxima Release)
- [ ] Integração WhatsApp
- [ ] Templates avançados
- [ ] Exportação de relatórios
- [ ] API pública
- [ ] Webhooks

### V1.2 (Futuro)
- [ ] IA para otimização automática
- [ ] Chat ao vivo
- [ ] Integrações CRM
- [ ] Mobile app
- [ ] Multi-idiomas

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, leia o [guia de contribuição](CONTRIBUTING.md) antes de submeter PRs.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Victor Cruz**
- GitHub: [@VictorNascimento06](https://github.com/VictorNascimento06)
- LinkedIn: [Victor Cruz](https://linkedin.com/in/victor-da-cruz-79ba4331a)
- Email: vhnascimento2808@hotmail.com
- Empresa: [Cruz Technology](https://cruztechnology.com.br)

---

**LeadCaptain** - Transformando visitantes em clientes com tecnologia de ponta 🚀