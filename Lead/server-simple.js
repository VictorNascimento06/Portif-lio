const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    message: '🚀 Sistema Lead AI funcionando perfeitamente!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    features: [
      'Qualificação de Leads com IA',
      'WhatsApp Bot Integrado', 
      'Notificações Automáticas',
      'Dashboard Analytics'
    ]
  });
});

// Simular storage em memória (para demonstração)
let leads = [];
let messages = [];

// Webhook WhatsApp (simulação)
app.post('/api/webhooks/whatsapp', (req, res) => {
  const { from, body } = req.body;
  
  console.log(`📱 Nova mensagem de ${from}: ${body}`);
  
  // Análise de IA simulada para corretora
  let score = 3; // Base score
  let intent = 'interesse_geral';
  let temperature = 'cold';
  
  const message = body.toLowerCase();
  
  // Critérios de qualificação imobiliária
  if (message.includes('urgente') || message.includes('rápido')) score += 2;
  if (message.includes('r$') || message.includes('reais') || /\d+k|\d+mil/.test(message)) score += 3;
  if (message.includes('aprovado') || message.includes('financiamento')) score += 2;
  if (message.includes('copacabana') || message.includes('zona sul') || message.includes('ipanema')) score += 1;
  if (message.includes('apartamento') || message.includes('casa') || message.includes('quartos')) score += 1;
  if (message.includes('fechar') || message.includes('decidir') || message.includes('comprar')) score += 2;
  
  score = Math.min(score, 10);
  
  // Determinar intent e temperatura
  if (score >= 8) {
    temperature = 'hot';
    intent = message.includes('alugar') ? 'aluguel_urgente' : 'compra_urgente';
  } else if (score >= 5) {
    temperature = 'warm';
    intent = 'interesse_qualificado';
  }
  
  // Criar lead
  const leadId = 'lead_' + Date.now();
  const lead = {
    id: leadId,
    phone: from,
    score: score,
    temperature: temperature,
    intent: intent,
    lastMessage: body,
    createdAt: new Date().toISOString()
  };
  
  leads.push(lead);
  
  // Salvar mensagem
  messages.push({
    id: 'msg_' + Date.now(),
    leadId: leadId,
    content: body,
    direction: 'inbound',
    timestamp: new Date().toISOString()
  });
  
  // Gerar resposta automática
  let autoResponse = '';
  if (score >= 8) {
    autoResponse = `🏢 Perfeito! Pela sua descrição, temos opções ideais para você.

Nossa equipe especialista entrará em contato em 5 minutos!
Podemos agendar visita ainda hoje.

Qual seu nome e melhor horário para conversar?

*Corretora Master - Realizando sonhos há 15 anos* 🏡`;
  } else if (score >= 5) {
    autoResponse = `Ótimo! Temos várias opções que podem interessar você.

Para te ajudar melhor:
• Está procurando para comprar ou alugar?
• Qual a faixa de valor?
• Quantos quartos?
• Algum bairro preferido?

*Corretora Master - Seu novo lar te espera* 🏡`;
  } else {
    autoResponse = `Olá! 😊 Seja bem-vindo à Corretora Master!

Estamos aqui para ajudar você a encontrar o imóvel ideal.
O que você está procurando?

*Corretora Master - 15 anos realizando sonhos* 🏡`;
  }
  
  // Log para notificação
  if (score >= 8) {
    console.log(`🚨 LEAD QUENTE DETECTADO! Score: ${score}/10 - ${from}`);
    console.log(`📧 Notificação enviada para equipe de vendas`);
  }
  
  res.json({
    success: true,
    data: {
      leadId: leadId,
      qualificationScore: score,
      temperature: temperature,
      intent: intent,
      autoResponse: autoResponse
    },
    message: 'Lead processado e qualificado com sucesso!'
  });
});

// API Leads
app.get('/api/leads', (req, res) => {
  const stats = {
    total: leads.length,
    hot: leads.filter(l => l.score >= 8).length,
    warm: leads.filter(l => l.score >= 5 && l.score < 8).length,
    cold: leads.filter(l => l.score < 5).length
  };
  
  res.json({
    success: true,
    data: {
      leads: leads.slice(-10), // Últimos 10 leads
      stats: stats
    }
  });
});

// Dashboard Stats
app.get('/api/dashboard/stats', (req, res) => {
  const today = new Date().toDateString();
  const leadsToday = leads.filter(l => new Date(l.createdAt).toDateString() === today);
  
  res.json({
    success: true,
    data: {
      overview: {
        totalLeads: leads.length,
        leadsToday: leadsToday.length,
        messagesToday: messages.length,
        conversionRate: leads.length > 0 ? ((leads.filter(l => l.score >= 8).length / leads.length) * 100).toFixed(1) : 0
      },
      leadsByScore: {
        hot: leads.filter(l => l.score >= 8).length,
        warm: leads.filter(l => l.score >= 5 && l.score < 8).length,
        cold: leads.filter(l => l.score < 5).length
      },
      leadsByStatus: {
        pending: leads.filter(l => l.temperature === 'cold').length,
        contacted: leads.filter(l => l.temperature === 'warm').length,
        qualified: leads.filter(l => l.temperature === 'hot').length,
        converted: 0
      }
    }
  });
});

// Página inicial
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>🏢 Lead AI - Corretora Master</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
            .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
            h1 { color: #2c3e50; text-align: center; }
            .status { background: #27ae60; color: white; padding: 10px; border-radius: 5px; text-align: center; }
            .section { margin: 20px 0; padding: 15px; border-left: 4px solid #3498db; background: #ecf0f1; }
            a { color: #3498db; text-decoration: none; }
            .endpoint { background: #34495e; color: white; padding: 5px 10px; border-radius: 3px; font-family: monospace; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 Sistema Lead AI - Corretora Master</h1>
            
            <div class="status">
                ✅ Sistema Online e Funcionando!
            </div>
            
            <div class="section">
                <h3>📊 Endpoints Disponíveis:</h3>
                <p><span class="endpoint">GET</span> <a href="/health">/health</a> - Status do sistema</p>
                <p><span class="endpoint">GET</span> <a href="/api/leads">/api/leads</a> - Lista de leads</p>
                <p><span class="endpoint">GET</span> <a href="/api/dashboard/stats">/api/dashboard/stats</a> - Estatísticas</p>
                <p><span class="endpoint">POST</span> /api/webhooks/whatsapp - Receber mensagens WhatsApp</p>
            </div>
            
            <div class="section">
                <h3>🧪 Teste o Sistema:</h3>
                <p>Execute no terminal: <code>node test-corretora.js</code></p>
                <p>Ou envie uma requisição POST para /api/webhooks/whatsapp com:</p>
                <pre>{
  "from": "+5511999887766",
  "body": "Preciso urgente apartamento 3 quartos Copacabana R$ 700mil"
}</pre>
            </div>
            
            <div class="section">
                <h3>📱 Próximos Passos:</h3>
                <ul>
                    <li>Conectar WhatsApp Business real</li>
                    <li>Configurar MongoDB para persistência</li>
                    <li>Configurar OpenAI para IA real</li>
                    <li>Implementar notificações por email</li>
                </ul>
            </div>
        </div>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('🚀 ============================================');
  console.log('🏢 SISTEMA LEAD AI - CORRETORA INICIADO!');
  console.log('🚀 ============================================');
  console.log('');
  console.log(`✅ Servidor rodando: http://localhost:${PORT}`);
  console.log(`🔧 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/api/dashboard/stats`);
  console.log(`📋 Leads: http://localhost:${PORT}/api/leads`);
  console.log('');
  console.log('🧪 Para testar: node test-corretora.js');
  console.log('');
  console.log('💡 Sistema funcionando SEM banco de dados (modo demo)');
  console.log('📝 Para produção, configure MongoDB no .env');
});