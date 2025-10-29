#!/bin/bash

# LeadCaptain Setup Script
echo "🎯 Configurando LeadCaptain..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale Node.js 18+ primeiro."
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if ! npx semver -r ">=$REQUIRED_VERSION" "$NODE_VERSION" &> /dev/null; then
    echo "❌ Node.js versão $REQUIRED_VERSION ou superior é necessária. Versão atual: $NODE_VERSION"
    exit 1
fi

echo "✅ Node.js $NODE_VERSION detectado"

# Install dependencies
echo "📦 Instalando dependências..."
npm install

# Copy environment file
if [ ! -f .env.local ]; then
    echo "🔧 Criando arquivo de configuração..."
    cp .env.example .env.local
    echo "📝 Edite o arquivo .env.local com suas configurações"
fi

# Setup database (if needed)
if [ -f prisma/schema.prisma ]; then
    echo "🗄️ Configurando banco de dados..."
    npx prisma generate
    # Uncomment the next line if you want to run migrations automatically
    # npx prisma migrate dev --name init
fi

echo ""
echo "🎉 Setup concluído com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure as variáveis no arquivo .env.local"
echo "2. Execute: npm run dev"
echo "3. Acesse: http://localhost:3000"
echo ""
echo "📚 Documentação: ./README.md"
echo "🚀 Desenvolvido por Cruz Technology"