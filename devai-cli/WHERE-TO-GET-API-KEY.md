# 🎯 RESUMO RÁPIDO: Onde Pegar a API Key

## 📍 Links Diretos
- **Site principal**: https://platform.openai.com
- **Página de API Keys**: https://platform.openai.com/api-keys

## 🔍 Navegação no Site

### 1️⃣ Após Login, procure no MENU LATERAL:
```
Home
Playground
◄━━ API keys ◄━━ CLIQUE AQUI!
Usage
Billing
```

### 2️⃣ Na página API keys:
```
🔑 API keys
┌─────────────────────────────┐
│ [+ Create new secret key]   │ ◄━━ CLIQUE AQUI!
└─────────────────────────────┘
```

### 3️⃣ Preencha o formulário:
```
Name: [DevAI CLI]
Permissions: [All] (deixe padrão)
[Create secret key] ◄━━ CLIQUE!
```

### 4️⃣ COPIE a chave:
```
Your new secret key:
sk-proj-abc123def456... [📋 Copy] ◄━━ COPIE!
⚠️ Só aparece uma vez!
```

---

## 🚀 Depois de Copiar a Chave:

```bash
# Cole aqui:
node dist/index.js config

# Ou edite o arquivo .env:
OPENAI_API_KEY=sk-sua-chave-aqui
```

## 🧪 Teste se Funcionou:
```bash
node dist/index.js test
```

**🎉 Se aparecer "API connection successful", está pronto!**

---

## 💡 Dica Importante:
- A chave começa sempre com `sk-`
- Copie TODA a chave (é bem longa)
- Não compartilhe com ninguém!
- Se perder, crie uma nova

## 💰 É Grátis?
- Sim! Novos usuários ganham créditos grátis
- Um comando custa menos de 1 centavo
- Créditos grátis duram muito tempo para testes