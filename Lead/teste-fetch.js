// Teste usando fetch nativo do Node.js
console.log('🧪 TESTANDO SISTEMA LEAD AI - CORRETORA');
console.log('========================================\n');

async function testarMensagem(telefone, mensagem, descricao) {
  try {
    console.log(`📱 ${descricao}`);
    console.log(`De: ${telefone}`);
    console.log(`Mensagem: "${mensagem}"`);
    console.log('---');

    const response = await fetch('http://localhost:3000/api/webhooks/whatsapp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: telefone,
        body: mensagem
      })
    });

    const result = await response.json();
    const { data } = result;
    
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

async function verificarStats() {
  try {
    console.log('📊 VERIFICANDO ESTATÍSTICAS DO SISTEMA');
    console.log('======================================');
    
    const response = await fetch('http://localhost:3000/api/dashboard/stats');
    const result = await response.json();
    const stats = result.data;
    
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

  // Ver estatísticas finais
  await verificarStats();
}

// Executar todos os testes
executarTestes().then(() => {
  console.log('\n✅ TODOS OS TESTES CONCLUÍDOS!');
  console.log('\n💡 O sistema está qualificando leads automaticamente!');
  console.log('🌐 Sistema: http://localhost:3000');
  console.log('📊 Dashboard: http://localhost:3000/api/dashboard/stats');
  console.log('📋 Leads: http://localhost:3000/api/leads');
}).catch(console.error);