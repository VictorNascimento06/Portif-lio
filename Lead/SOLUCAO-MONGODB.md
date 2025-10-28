# 🔧 SOLUÇÃO RÁPIDA - MongoDB não conectado

## 📋 **Problema identificado:**
O sistema está tentando conectar ao MongoDB local que não está instalado/rodando.

## ⚡ **SOLUÇÕES:**

### **Opção 1: MongoDB Local (Recomendado para desenvolvimento)**
1. Baixar MongoDB: https://www.mongodb.com/try/download/community
2. Instalar e iniciar serviço
3. Reiniciar sistema: `npm start`

### **Opção 2: MongoDB Atlas (Cloud - Mais fácil)**
1. Criar conta grátis: https://cloud.mongodb.com
2. Criar cluster gratuito
3. Obter string de conexão
4. Atualizar .env:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lead-ai
```

### **Opção 3: Sistema sem banco (Para teste imediato)**
Vou criar versão que funciona sem MongoDB para você testar agora:

```javascript
// Versão simplificada para teste sem MongoDB
const express = require('express');
const app = express();

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    message: 'Sistema Lead AI funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Teste de lead
app.post('/api/webhooks/whatsapp', (req, res) => {
  const { from, body } = req.body;
  
  // Simular análise de IA
  let score = 5;
  if (body.includes('urgente')) score += 2;
  if (body.includes('R$')) score += 2;
  if (body.includes('aprovado')) score += 1;
  
  res.json({
    success: true,
    data: {
      leadId: 'test-' + Date.now(),
      qualificationScore: Math.min(score, 10),
      message: 'Lead processado com sucesso!'
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Sistema Lead AI rodando em http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
});
```

Quer que eu:
1. **Configure MongoDB Atlas** (cloud, grátis)
2. **Instale MongoDB local** 
3. **Crie versão simplificada** para teste imediato?