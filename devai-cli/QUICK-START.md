# 🚀 DevAI CLI - Quick Start

## ⚡ Instalação Rápida (Windows)

```batch
# 1. Execute o script de setup
setup.bat

# 2. Configure sua API key do OpenAI
# Edite o arquivo .env e coloque sua chave da OpenAI
```

## 🔑 Configurando API Key

1. **Obtenha sua API key**: [OpenAI Platform](https://platform.openai.com/api-keys)
2. **Edite o arquivo `.env`**:
   ```env
   OPENAI_API_KEY=sk-sua-chave-aqui
   OPENAI_MODEL=gpt-4
   OPENAI_MAX_TOKENS=500
   ```

## 🧪 Testando

```batch
# Teste todos os comandos
test-commands.bat

# Ou teste manualmente
node dist/index.js --help
node dist/index.js config
```

## 📝 Comandos Principais

| Comando | Descrição |
|---------|-----------|
| `devai config` | Configurar API key |
| `devai commit` | Gerar commits inteligentes |
| `devai review arquivo.js` | Revisar código |
| `devai docs arquivo.js` | Gerar documentação |

## 🔧 Desenvolvimento

```batch
# Modo desenvolvimento
npm run dev

# Build
npm run build

# Testes
npm test
```

## ❓ Problemas Comuns

**Erro "API key not found"**:
- Verifique se editou o arquivo `.env`
- Execute `devai config` para configurar

**Comando não encontrado**:
- Execute `npm run build` primeiro
- Use `node dist/index.js` em vez de só `devai`

**Erros de TypeScript**:
- Execute `npm install` novamente
- Verifique se Node.js está atualizado (16+)

---

🎉 **Projeto pronto para impressionar no GitHub!**