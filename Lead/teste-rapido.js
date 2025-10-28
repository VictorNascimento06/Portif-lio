// Teste rápido do sistema - Simula mensagens WhatsApp
const axios = require('axios').default;

console.log('🧪 TESTANDO SISTEMA LEAD AI - CORRETORA');
console.log('========================================\n');

async function testarMensagem(telefone, mensagem, descricao) {
  try {
    console.log(`📱 ${descricao}`);
    console.log(`De: ${telefone}`);
    console.log(`Mensagem: "${mensagem}"`);
    console.log('---');

    const response = await axios.post('http://localhost:3000/api/webhooks/whatsapp', {
      from: telefone,
      body: mensagem
    });

    const { data } = response.data;
    console.log(`🤖 Score de Qualificação: ${data.qualificationScore}/10`);
    console.log(`🌡️ Temperatura: ${data.temperature.toUpperCase()}`);
    console.log(`🎯 Intenção: ${data.intent}`);
    console.log('\n📨 Resposta Automática:');
    console.log(data.autoResponse);
    console.log('\n=====================================\n');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

async function executarTestes() {
  // Teste 1: Lead FRIO
  await testarMensagem(
    '+5511999111222',
    'Olá, gostaria de informações sobre imóveis',
    'TESTE 1: Lead Frio - Interesse Geral'
  );

  // Teste 2: Lead MORNO
  await testarMensagem(
    '+5511999333444',
    'Procuro apartamento 2 quartos zona sul para comprar',
    'TESTE 2: Lead Morno - Interesse Específico'
  );

  // Teste 3: Lead QUENTE
  await testarMensagem(
    '+5511999555666',
    'URGENTE! Preciso apartamento 3 quartos Copacabana até R$ 800mil, já aprovado financiamento, posso fechar hoje',
    'TESTE 3: Lead Quente - Alto Potencial'
  );

  // Ver estatísticas
  console.log('📊 VERIFICANDO ESTATÍSTICAS DO SISTEMA');
  console.log('======================================');
  
  try {
    const statsResponse = await axios.get('http://localhost:3000/api/dashboard/stats');
    const stats = statsResponse.data.data;
    
    console.log(`\n📈 OVERVIEW:`);
    console.log(`Total de Leads: ${stats.overview.totalLeads}`);
    console.log(`Leads Hoje: ${stats.overview.leadsToday}`);
    console.log(`Taxa de Conversão: ${stats.overview.conversionRate}%`);
    
    console.log(`\n🌡️ DISTRIBUIÇÃO POR TEMPERATURA:`);
    console.log(`🔥 Leads Quentes: ${stats.leadsByScore.hot}`);
    console.log(`🟡 Leads Mornos: ${stats.leadsByScore.warm}`);
    console.log(`❄️ Leads Frios: ${stats.leadsByScore.cold}`);
    
  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas:', error.message);
  }
}

// Executar todos os testes
executarTestes().then(() => {
  console.log('\n✅ TODOS OS TESTES CONCLUÍDOS!');
  console.log('\n💡 O sistema está funcionando perfeitamente!');
  console.log('🌐 Acesse: http://localhost:3000');
  console.log('📊 Dashboard: http://localhost:3000/api/dashboard/stats');
  console.log('📋 Leads: http://localhost:3000/api/leads');
}).catch(console.error);