import axios from 'axios';

// Script de teste para corretora de imóveis
const BASE_URL = 'http://localhost:3000';

interface TestScenario {
  name: string;
  phone: string;
  message: string;
  expectedScore: string;
  expectedResponse: string;
}

const TEST_SCENARIOS: TestScenario[] = [
  {
    name: "🔴 LEAD QUENTE - Compra Urgente",
    phone: "+5511999000001",
    message: "Preciso urgente apartamento 3 quartos Copacabana até R$ 700mil. Financiamento aprovado no Itaú. Quero fechar esta semana!",
    expectedScore: "8-10",
    expectedResponse: "Notificação imediata + resposta personalizada"
  },
  {
    name: "🟡 LEAD MORNO - Interesse Geral",
    phone: "+5511999000002", 
    message: "Vocês têm apartamentos na Zona Sul? Queria ver algumas opções.",
    expectedScore: "5-7",
    expectedResponse: "Resposta para qualificar melhor"
  },
  {
    name: "⚪ LEAD FRIO - Saudação",
    phone: "+5511999000003",
    message: "Oi, tudo bem?",
    expectedScore: "1-4", 
    expectedResponse: "Resposta de boas-vindas"
  },
  {
    name: "🔴 LEAD QUENTE - Aluguel Premium",
    phone: "+5511999000004",
    message: "Procuro apartamento alto padrão para alugar em Ipanema. Orçamento R$ 8mil/mês. Tenho garantia e quero alugar ainda este mês.",
    expectedScore: "8-10",
    expectedResponse: "Notificação urgente"
  },
  {
    name: "🟡 LEAD MORNO - Investimento", 
    phone: "+5511999000005",
    message: "Estou pensando em investir em um apartamento para alugar. Vocês têm consultoria de investimentos?",
    expectedScore: "5-7",
    expectedResponse: "Resposta consultiva"
  }
];

class CorretoraTestSuite {
  
  async testHealth(): Promise<void> {
    try {
      console.log('🔧 Testando Health Check...');
      const response = await axios.get(`${BASE_URL}/health`);
      console.log('✅ Sistema online:', response.data);
    } catch (error) {
      console.log('❌ Sistema offline:', error);
      throw error;
    }
  }

  async testWebhook(scenario: TestScenario): Promise<void> {
    console.log(`\n📱 Testando: ${scenario.name}`);
    console.log(`📞 Telefone: ${scenario.phone}`);
    console.log(`💬 Mensagem: "${scenario.message}"`);
    
    try {
      const webhookData = {
        from: scenario.phone,
        body: scenario.message,
        timestamp: new Date().toISOString()
      };

      const response = await axios.post(`${BASE_URL}/api/webhooks/whatsapp`, webhookData);
      
      console.log('✅ Webhook processado:', {
        leadId: response.data.data.leadId,
        score: response.data.data.qualificationScore,
        expected: scenario.expectedScore
      });

      // Aguardar processamento
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Buscar lead criado
      const leadResponse = await axios.get(`${BASE_URL}/api/leads`);
      const lead = leadResponse.data.data.leads.find((l: any) => l.phone === scenario.phone);
      
      if (lead) {
        console.log('📊 Lead qualificado:', {
          nome: lead.name,
          score: lead.qualificationScore,
          temperatura: lead.temperature,
          intencao: lead.detectedIntent,
          razao: lead.qualificationReason
        });
      }

    } catch (error: any) {
      console.log('❌ Erro no teste:', error.response?.data || error.message);
    }
  }

  async testDashboard(): Promise<void> {
    try {
      console.log('\n📊 Testando Dashboard...');
      const response = await axios.get(`${BASE_URL}/api/dashboard/stats`);
      
      console.log('✅ Estatísticas:', {
        totalLeads: response.data.data.overview.totalLeads,
        leadsHoje: response.data.data.overview.leadsToday,
        leadsQuentes: response.data.data.leadsByScore.hot,
        leadsMornos: response.data.data.leadsByScore.warm,
        leadsFrios: response.data.data.leadsByScore.cold,
        taxaConversao: response.data.data.overview.conversionRate
      });
    } catch (error: any) {
      console.log('❌ Erro dashboard:', error.response?.data || error.message);
    }
  }

  async testLeadsList(): Promise<void> {
    try {
      console.log('\n📋 Listando Leads...');
      const response = await axios.get(`${BASE_URL}/api/leads`);
      
      const leads = response.data.data.leads;
      console.log(`✅ Total de leads: ${leads.length}`);
      
      leads.forEach((lead: any, index: number) => {
        const icon = lead.qualificationScore >= 8 ? '🔴' : 
                    lead.qualificationScore >= 5 ? '🟡' : '⚪';
        
        console.log(`${icon} Lead ${index + 1}:`, {
          telefone: lead.phone,
          nome: lead.name || 'Não informado',
          score: lead.qualificationScore || 0,
          temperatura: lead.temperature,
          status: lead.status,
          criado: new Date(lead.createdAt).toLocaleString('pt-BR')
        });
      });
    } catch (error: any) {
      console.log('❌ Erro ao listar leads:', error.response?.data || error.message);
    }
  }

  async runFullTest(): Promise<void> {
    console.log('🚀 INICIANDO TESTE COMPLETO - CORRETORA DE IMÓVEIS\n');
    console.log('=' .repeat(60));

    try {
      // 1. Testar health
      await this.testHealth();
      
      // 2. Testar cada cenário
      for (const scenario of TEST_SCENARIOS) {
        await this.testWebhook(scenario);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Pausa entre testes
      }
      
      // 3. Testar dashboard
      await this.testDashboard();
      
      // 4. Listar todos os leads
      await this.testLeadsList();
      
      console.log('\n✅ TESTE COMPLETO FINALIZADO!');
      console.log('=' .repeat(60));
      console.log('🎯 Próximos passos:');
      console.log('1. Verificar notificações de email recebidas');
      console.log('2. Testar com WhatsApp real');
      console.log('3. Customizar respostas se necessário');
      console.log('4. Configurar equipe de vendas');

    } catch (error) {
      console.log('\n❌ ERRO NO TESTE:', error);
      console.log('🔧 Verifique se o sistema está rodando: npm start');
    }
  }
}

// Executar testes
const tester = new CorretoraTestSuite();

if (require.main === module) {
  tester.runFullTest();
}

export { CorretoraTestSuite, TEST_SCENARIOS };