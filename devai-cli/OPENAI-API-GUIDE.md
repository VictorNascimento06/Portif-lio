# 🔑 Guia Completo: Como Obter sua API Key da OpenAI

## 📍 Passo 1: Acessar o Site
1. Vá para: **https://platform.openai.com**
2. Clique em **"Log in"** no canto superior direito
3. Se não tem conta, clique em **"Sign up"** para criar

## 👤 Passo 2: Fazer Login/Criar Conta
- Use seu email e senha
- Ou conecte com Google/Microsoft
- Confirme seu email se for primeira vez

## 🔑 Passo 3: Acessar API Keys
1. Após o login, você verá o dashboard
2. No menu lateral esquerdo, procure por **"API keys"** 
3. Ou vá diretamente para: **https://platform.openai.com/api-keys**

## ➕ Passo 4: Criar Nova Chave
1. Clique no botão **"Create new secret key"** (botão verde/azul)
2. Dê um nome para sua chave (ex: "DevAI CLI", "Meu Projeto")
3. Escolha as permissões (deixe padrão por enquanto)
4. Clique em **"Create secret key"**

## 📋 Passo 5: COPIAR a Chave
⚠️ **IMPORTANTE**: A chave aparece apenas UMA VEZ!

1. Uma janela popup aparecerá com sua chave
2. A chave começa com `sk-`
3. Clique no ícone de **"Copy"** para copiar
4. **GUARDE** a chave em lugar seguro

## 🔧 Passo 6: Configurar no DevAI
Agora cole a chave no projeto:

**Método 1 - Comando Interativo:**
```bash
node dist/index.js config
# Cole sua chave quando perguntado
```

**Método 2 - Editar .env:**
```bash
# Abra o arquivo .env e substitua:
OPENAI_API_KEY=sk-sua-chave-copiada-aqui
```

## 🧪 Passo 7: Testar
```bash
# Verificar configuração
node dist/index.js config show

# Testar conexão
node dist/index.js test
```

---

## 🎯 Visual do Site (o que você vai ver):

### Dashboard Principal
```
┌─────────────────────────────────────┐
│ OpenAI Platform                     │
├─────────────────────────────────────┤
│ 📊 Overview                         │
│ 🔑 API keys          ← CLIQUE AQUI  │
│ 💳 Usage                            │
│ 🏢 Organization                     │
│ ⚙️  Settings                        │
└─────────────────────────────────────┘
```

### Página API Keys
```
┌─────────────────────────────────────┐
│ API keys                            │
├─────────────────────────────────────┤
│ [+ Create new secret key] ← CLIQUE  │
├─────────────────────────────────────┤
│ Suas chaves existentes (se houver)  │
│ sk-proj-abc...xyz    [Copy] [Del]   │
└─────────────────────────────────────┘
```

### Popup de Nova Chave
```
┌─────────────────────────────────────┐
│ Create new secret key               │
├─────────────────────────────────────┤
│ Name: [DevAI CLI            ]       │
│ Permissions: [All ▼]                │
│                                     │
│ [Cancel]  [Create secret key]       │
└─────────────────────────────────────┘
```

### Chave Criada (COPIE AGORA!)
```
┌─────────────────────────────────────┐
│ Your new secret key                 │
├─────────────────────────────────────┤
│ sk-proj-abc123def456ghi789...       │
│ [📋 Copy]                           │
│                                     │
│ ⚠️  Save this key! You won't see    │
│    it again after closing.         │
│                                     │
│ [Done]                              │
└─────────────────────────────────────┘
```

---

## 💰 Sobre Custos

### 🆓 Créditos Gratuitos
- Novos usuários recebem créditos gratuitos
- Suficiente para testar o DevAI CLI

### 💸 Custos por Uso
- **GPT-4**: ~$0.03 por 1K tokens
- **GPT-3.5-turbo**: ~$0.001 por 1K tokens
- Um comando típico: 100-300 tokens
- **Custo por comando**: $0.003 - $0.01 (menos de 1 centavo!)

### 🎯 Para Economizar
1. Comece com **GPT-3.5-turbo** (mais barato)
2. Use `--dry-run` para testar sem gastar
3. Configure `OPENAI_MAX_TOKENS=200` para respostas menores

---

## ❓ Problemas Comuns

**"Não vejo API keys no menu"**
- Certifique-se que fez login
- Vá direto para: platform.openai.com/api-keys

**"Create key está desabilitado"**
- Verifique se confirmou seu email
- Talvez precise adicionar método de pagamento

**"Chave não funciona"**
- Certifique-se que copiou completa (começa com sk-)
- Não deve ter espaços antes/depois
- Teste com: `node dist/index.js test`

---

## 🚀 Depois de Configurar

```bash
# 1. Verificar se funcionou
node dist/index.js config show

# 2. Testar conexão
node dist/index.js test

# 3. Usar de verdade!
git add .
node dist/index.js commit --dry-run
```

**🎉 Pronto! Seu DevAI CLI estará funcionando!**