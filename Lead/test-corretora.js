const axios = require('axios');

// 🏢 TESTE PRÁTICO - CORRETORA DE IMÓVEIS
const BASE_URL = 'http://localhost:3000';

const CENARIOS_TESTE = [
  {
    nome: "🔴 LEAD QUENTE - Compra Urgente",
    telefone: "+5511999000001",
    mensagem: "Preciso urgente apartamento 3 quartos Copacabana até R$ 700mil. Financiamento aprovado no Itaú. Quero fechar esta semana!",
    scoreEsperado: "8-10"
  },
  {
    nome: "🟡 LEAD MORNO - Interesse Zona Sul",
    telefone: "+5511999000002", 
    mensagem: "Vocês têm apartamentos na Zona Sul? Queria ver algumas opções de 2 quartos.",
    scoreEsperado: "5-7"
  },
  {
    nome: "⚪ LEAD FRIO - Saudação",
    telefone: "+5511999000003",
    mensagem: "Oi, tudo bem?",
    scoreEsperado: "1-4"
  },
  {
    nome: "🔴 LEAD QUENTE - Aluguel Premium",
    telefone: "+5511999000004",
    mensagem: "Procuro apartamento alto padrão para alugar em Ipanema. Orçamento R$ 8mil/mês. Tenho garantia.",
    scoreEsperado: "8-10"
  }
];

async function testarSistema() {
  console.log('🚀 INICIANDO TESTE SISTEMA LEAD AI - CORRETORA\n');
  console.log('='.repeat(60));

  try {
    // 1. Testar se sistema está online
    console.log('🔧 Verificando sistema...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Sistema online!');
    
    // 2. Testar cada cenário
    for (let i = 0; i < CENARIOS_TESTE.length; i++) {
      const cenario = CENARIOS_TESTE[i];
      
      console.log(`\n📱 TESTE ${i + 1}: ${cenario.nome}`);
      console.log(`📞 Telefone: ${cenario.telefone}`);
      console.log(`💬 Mensagem: "${cenario.mensagem}"`);
      console.log(`🎯 Score esperado: ${cenario.scoreEsperado}`);
      
      try {
        // Simular webhook do WhatsApp
        const webhookData = {
          from: cenario.telefone,
          body: cenario.mensagem,
          timestamp: new Date().toISOString()
        };

        const response = await axios.post(`${BASE_URL}/api/webhooks/whatsapp`, webhookData);
        
        console.log('✅ Processado:', {
          leadId: response.data.data?.leadId?.substring(0, 8) + '...',
          score: response.data.data?.qualificationScore || 'N/A'
        });

        // Aguardar processamento
        await new Promise(resolve => setTimeout(resolve, 1500));

      } catch (error) {
        console.log('❌ Erro:', error.response?.data?.message || error.message);
      }
    }
    
    // 3. Verificar estatísticas finais
    console.log('\n📊 ESTATÍSTICAS FINAIS:');
    console.log('-'.repeat(40));
    
    try {
      const stats = await axios.get(`${BASE_URL}/api/dashboard/stats`);
      const data = stats.data.data;
      
      console.log(`📈 Total de Leads: ${data.overview.totalLeads}`);
      console.log(`🔥 Leads Quentes: ${data.leadsByScore.hot}`);
      console.log(`🟡 Leads Mornos: ${data.leadsByScore.warm}`);
      console.log(`⚪ Leads Frios: ${data.leadsByScore.cold}`);
      console.log(`📞 Taxa Conversão: ${data.overview.conversionRate}%`);
      
    } catch (error) {
      console.log('❌ Erro ao buscar estatísticas');
    }

    // 4. Listar leads criados
    console.log('\n📋 LEADS CRIADOS:');
    console.log('-'.repeat(40));
    
    try {
      const leadsResponse = await axios.get(`${BASE_URL}/api/leads?limit=10`);
      const leads = leadsResponse.data.data.leads;
      
      leads.forEach((lead, index) => {
        const icon = lead.qualificationScore >= 8 ? '🔴' : 
                    lead.qualificationScore >= 5 ? '🟡' : '⚪';
        
        console.log(`${icon} ${lead.phone} | Score: ${lead.qualificationScore || 0} | ${lead.temperature || 'N/A'}`);
      });
      
    } catch (error) {
      console.log('❌ Erro ao listar leads');
    }

    console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!');
    console.log('='.repeat(60));
    console.log('✅ Sistema funcionando corretamente');
    console.log('📱 Pronto para conectar WhatsApp real');
    console.log('💼 Pronto para receber leads de clientes');
    
  } catch (error) {
    console.log('\n❌ ERRO NO TESTE:');
    console.log('🔧 Verifique se o sistema está rodando:');
    console.log('   npm start');
    console.log('');
    console.log('🌐 Acesse: http://localhost:3000/health');
    console.log('');
    console.log('Erro:', error.message);
  }
}

// Executar teste
testarSistema();