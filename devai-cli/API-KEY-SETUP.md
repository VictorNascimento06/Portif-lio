# 🔑 Como Configurar sua API Key da OpenAI

## 📝 Passo a Passo

### 1. Criar API Key na OpenAI
1. Acesse [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Faça login ou crie uma conta
3. Clique em "Create new secret key"
4. Dê um nome para sua chave (ex: "DevAI CLI")
5. **COPIE** a chave imediatamente (ela só aparece uma vez!)

### 2. Configurar no Projeto

**Opção 1: Editar arquivo .env manualmente**
```env
# Abra o arquivo .env e substitua:
OPENAI_API_KEY=sk-sua-chave-real-aqui
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=500
```

**Opção 2: Usar comando interativo**
```bash
# Execute o configurador
node dist/index.js config
```

### 3. Testar a Configuração
```bash
# Verificar se está configurado
node dist/index.js config show

# Testar um comando (sem fazer commit real)
node dist/index.js commit --dry-run
```

## ⚠️ Segurança

- ✅ **NUNCA** compartilhe sua API key
- ✅ API key fica apenas no arquivo `.env` local
- ✅ `.env` está no `.gitignore` (não vai para GitHub)
- ✅ Use variáveis de ambiente em produção

## 💰 Custos

- **GPT-4**: ~$0.03 por 1K tokens de input
- **GPT-3.5-turbo**: ~$0.001 por 1K tokens (mais barato)
- Para teste: poucos centavos por comando
- Você pode começar com GPT-3.5-turbo

## 🚨 Se der erro

**"API key invalid"**:
- Verifique se copiou a chave completa
- Chave deve começar com `sk-`
- Sem espaços antes/depois

**"Rate limit exceeded"**:
- Aguarde alguns segundos
- Tente novamente

**"Insufficient quota"**:
- Adicione créditos na conta OpenAI
- Ou use GPT-3.5-turbo (mais barato)

---

🎯 **Depois de configurar, teste com:**
```bash
node dist/index.js commit --help
```