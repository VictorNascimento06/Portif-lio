// Configuração específica para corretora de imóveis
export const REAL_ESTATE_PROMPTS = {
  qualification: `
Você é um especialista em qualificação de leads para corretora de imóveis.
Analise esta mensagem e pontue de 1-10 baseado em:

CRITÉRIOS IMOBILIÁRIOS:
- Orçamento mencionado (+3 pontos)
- Localização específica (+2 pontos)
- Urgência/prazo (+2 pontos)
- Tipo de imóvel definido (+1 ponto)
- Financiamento aprovado (+2 pontos)

PALAVRAS-CHAVE QUENTES:
- "urgente", "preciso agora", "esta semana" = +2 pontos
- "aprovado", "financiamento ok", "dinheiro na mão" = +3 pontos
- "quero fechar", "decidir rápido" = +2 pontos
- Valores específicos (ex: "R$ 500mil") = +3 pontos

LOCALIZAÇÃO VALORIZADA:
- Zona Sul, Barra, Leblon, Copacabana = +1 ponto
- Bairros específicos = +1 ponto

RETURN formato JSON:
{
  "score": 1-10,
  "reason": "explicação detalhada",
  "intent": "compra_urgente|aluguel|informacao|venda",
  "extractedData": {
    "budget": "valor extraído",
    "location": "bairro/região",
    "propertyType": "tipo do imóvel",
    "urgency": "baixa|media|alta",
    "financing": "sim|nao|aprovado"
  }
}
`,

  responses: {
    hot_lead: `
🏢 Excelente! Pela sua descrição, temos opções perfeitas para você.

Para agilizar seu atendimento:
• Nosso consultor especialista entrará em contato em 5 minutos
• Podemos agendar visita ainda hoje
• Temos imóveis pré-aprovados para financiamento

Qual seu nome e melhor horário para conversar?

*Corretora Master - Realizando sonhos há 15 anos* 🏡
`,

    warm_lead: `
Ótimo! Temos várias opções que podem interessar você.

Para te ajudar melhor, me conta:
• Está procurando para comprar ou alugar?
• Qual a faixa de valor?
• Quantos quartos?
• Algum bairro preferido?

*Corretora Master - Seu novo lar te espera* 🏡
`,

    cold_lead: `
Olá! 😊 

Seja bem-vindo à Corretora Master!

Estamos aqui para ajudar você a encontrar o imóvel ideal. 
Pode me contar o que está procurando?

*Corretora Master - 15 anos realizando sonhos* 🏡
`
  }
};

// Configuração específica para analytics imobiliários
export const REAL_ESTATE_ANALYTICS = {
  conversion_goals: {
    hot_to_visit: 80,      // 80% leads quentes → visita agendada
    visit_to_proposal: 60, // 60% visitas → proposta
    proposal_to_sale: 30   // 30% propostas → venda
  },
  
  lead_value: {
    hot_lead: 2500,   // Valor médio lead quente
    warm_lead: 800,   // Valor médio lead morno  
    cold_lead: 200    // Valor médio lead frio
  },

  response_times: {
    hot_lead: 300,    // 5 minutos máximo
    warm_lead: 1800,  // 30 minutos máximo
    cold_lead: 3600   // 1 hora máximo
  }
};