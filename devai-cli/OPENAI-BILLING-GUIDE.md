# 💳 Como Adicionar Créditos na OpenAI

## 🚨 Erro 429: "Exceeded quota"
Este erro significa que você precisa adicionar créditos na sua conta OpenAI.

## 💰 Como Resolver

### 1️⃣ Acessar Billing
1. Vá para: **https://platform.openai.com/account/billing**
2. Ou no site da OpenAI:
   - Menu lateral → **"Billing"** ou **"Usage"**

### 2️⃣ Adicionar Método de Pagamento
1. Clique em **"Payment methods"**
2. Adicione um cartão de crédito/débito
3. Valores mínimos: geralmente $5 ou $10

### 3️⃣ Adicionar Créditos
1. Clique em **"Add credits"** ou **"Add payment"**
2. Escolha o valor (recomendo $5 para começar)
3. Confirme o pagamento

## 💸 Quanto Vai Custar?

### 📊 Preços Reais (GPT-3.5-turbo)
- **Input**: $0.0015 por 1K tokens
- **Output**: $0.002 por 1K tokens
- **Um comando típico**: 100-300 tokens
- **Custo por comando**: $0.0003 - $0.001 (menos de 0.1 centavo!)

### 🧮 Calculadora Prática
Com $5 de créditos você consegue fazer:
- **~5.000 a 15.000 comandos** do DevAI CLI
- Mais de suficiente para testar e usar bastante!

## 🎯 Alternativas Gratuitas

### 🔄 Outras APIs (Futuro)
Posso ajudar a adicionar suporte para:
- **Google Gemini** (tem tier gratuito)
- **Anthropic Claude** 
- **Ollama** (local, totalmente grátis)

### 🏠 Executar Local
- **Ollama**: Roda modelos no seu PC
- **GPT4All**: Interface simples
- **LM Studio**: Fácil de usar

## 🚀 Depois de Adicionar Créditos

```bash
# Aguarde alguns minutos e teste:
node dist/index.js test

# Se funcionar, você verá:
✅ API connection successful!
Generated message: "feat: add hello world function"
```

## 💡 Dicas para Economizar

### 1️⃣ Use GPT-3.5-turbo (já configurado)
- 10x mais barato que GPT-4
- Qualidade excelente para código

### 2️⃣ Reduza tokens
```env
# No arquivo .env:
OPENAI_MAX_TOKENS=200  # Menos tokens = mais barato
```

### 3️⃣ Use --dry-run para testar
```bash
# Não gasta créditos:
node dist/index.js commit --dry-run
```

## 🎯 Links Úteis
- **Billing**: https://platform.openai.com/account/billing
- **Usage**: https://platform.openai.com/account/usage
- **Pricing**: https://openai.com/pricing

---

## 🤔 Vale a Pena?

**Para desenvolver:**
- ✅ $5 dura meses de uso
- ✅ Economiza muito tempo
- ✅ Melhora qualidade do código
- ✅ Aprende boas práticas

**Para o portfólio:**
- ✅ Projeto impressionante
- ✅ Tecnologia moderna
- ✅ Demonstra habilidades

**Minha recomendação**: Vale muito a pena! 🚀