import OpenAI from 'openai';
import { ILead, IMessage } from '../models';
import { logger } from '../utils/logger';

export class AIQualificationService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async qualifyLead(message: string, phone: string): Promise<{
    score: number;
    reason: string;
    intent: string;
    extractedData?: {
      name?: string;
      email?: string;
      company?: string;
    };
  }> {
    try {
      const prompt = `
Analise a seguinte mensagem de WhatsApp de um potencial lead e retorne uma qualificação estruturada:

Telefone: ${phone}
Mensagem: "${message}"

Critérios de qualificação (pontuação 1-10):
- Urgência mencionada (palavras como "urgente", "rápido", "preciso agora")
- Orçamento/investimento mencionado
- Necessidade específica clara
- Autoridade para decisão
- Timeline definido

Retorne APENAS um JSON válido com:
{
  "score": 1-10,
  "reason": "explicação da pontuação",
  "intent": "intenção detectada",
  "extractedData": {
    "name": "nome se mencionado",
    "email": "email se mencionado", 
    "company": "empresa se mencionada"
  }
}`;

      const response = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.2
      });

      const content = response.choices[0]?.message?.content?.trim() || '';
      
      try {
        const parsed = JSON.parse(content);
        return {
          score: Math.min(Math.max(parsed.score || 5, 1), 10),
          reason: parsed.reason || 'Análise automática',
          intent: parsed.intent || 'interesse_geral',
          extractedData: parsed.extractedData || {}
        };
      } catch (parseError) {
        logger.error('Error parsing AI response:', parseError);
        return {
          score: 5,
          reason: 'Erro na análise automática',
          intent: 'interesse_geral',
          extractedData: {}
        };
      }

    } catch (error) {
      logger.error('Error in AI qualification:', error);
      return {
        score: 5,
        reason: 'Erro na análise automática',
        intent: 'interesse_geral',
        extractedData: {}
      };
    }
  }

  async analyzeMessage(message: string, leadContext?: ILead): Promise<{
    sentiment: 'positive' | 'neutral' | 'negative';
    intent: string;
    entities: string[];
    confidence: number;
    suggestedResponse?: string;
  }> {
    try {
      const prompt = this.buildAnalysisPrompt(message, leadContext);
      
      const response = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.3
      });

      const analysis = this.parseAnalysisResponse(response.choices[0]?.message?.content || '');
      return analysis;

    } catch (error) {
      logger.error('Error analyzing message:', error);
      return {
        sentiment: 'neutral',
        intent: 'unknown',
        entities: [],
        confidence: 0
      };
    }
  }

  async qualifyExistingLead(lead: ILead, messages: IMessage[]): Promise<{
    score: number;
    temperature: 'cold' | 'warm' | 'hot';
    reasoning: string;
    nextActions: string[];
  }> {
    try {
      const prompt = this.buildQualificationPrompt(lead, messages);
      
      const response = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
        temperature: 0.2
      });

      const qualification = this.parseQualificationResponse(response.choices[0]?.message?.content || '');
      return qualification;

    } catch (error) {
      logger.error('Error qualifying lead:', error);
      return {
        score: 5,
        temperature: 'cold',
        reasoning: 'Error during analysis',
        nextActions: ['Manual review required']
      };
    }
  }

  async generateResponse(message: string, leadContext: ILead): Promise<string> {
    try {
      const prompt = this.buildResponsePrompt(message, leadContext);
      
      const response = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.7
      });

      return response.choices[0]?.message?.content?.trim() || 'Obrigado pelo contato! Em breve nossa equipe entrará em contato.';

    } catch (error) {
      logger.error('Error generating response:', error);
      return 'Obrigado pelo contato! Em breve nossa equipe entrará em contato.';
    }
  }

  private buildAnalysisPrompt(message: string, leadContext?: ILead): string {
    return `
Analise a seguinte mensagem de um lead e retorne uma análise estruturada:

Mensagem: "${message}"

${leadContext ? `Contexto do lead:
- Nome: ${leadContext.name || 'Não informado'}
- Empresa: ${leadContext.metadata?.company || 'Não informado'}
- Mensagens anteriores: ${leadContext.messages?.length || 0}
- Score atual: ${leadContext.score}/10
` : ''}

Retorne a análise no seguinte formato JSON:
{
  "sentiment": "positive|neutral|negative",
  "intent": "interesse_produto|pedido_informacao|reclamacao|agendamento|outros",
  "entities": ["entidades_identificadas"],
  "confidence": 0.85,
  "suggestedResponse": "resposta_sugerida"
}

Seja preciso e focado no contexto comercial B2B.`;
  }

  private buildQualificationPrompt(lead: ILead, messages: IMessage[]): string {
    const conversation = messages.map(m => 
      `${m.direction}: ${m.content}`
    ).join('\n');

    return `
Qualifique este lead baseado nas informações disponíveis:

LEAD INFO:
- Telefone: ${lead.phone}
- Nome: ${lead.name || 'Não informado'}
- Email: ${lead.email || 'Não informado'}
- Empresa: ${lead.metadata?.company || 'Não informado'}
- Posição: ${lead.metadata?.position || 'Não informado'}
- Orçamento: ${lead.metadata?.budget || 'Não informado'}
- Timeline: ${lead.metadata?.timeline || 'Não informado'}

CONVERSA:
${conversation}

CRITÉRIOS DE QUALIFICAÇÃO:
- Score 9-10: Lead com orçamento, autoridade, necessidade e urgência claros
- Score 7-8: Lead qualificado com interesse genuíno e potencial
- Score 5-6: Lead com interesse básico, precisa de nutrição
- Score 1-4: Lead frio ou sem potencial real

TEMPERATURAS:
- HOT: Pronto para comprar, tem budget e urgência
- WARM: Interessado, mas precisa de mais informações
- COLD: Interesse inicial ou apenas pesquisando

Retorne no formato JSON:
{
  "score": 8,
  "temperature": "warm",
  "reasoning": "Lead mostra interesse genuíno no produto, tem empresa estabelecida mas ainda está avaliando opções",
  "nextActions": ["Enviar proposta comercial", "Agendar demo", "Qualificar orçamento"]
}`;
  }

  private buildResponsePrompt(message: string, leadContext: ILead): string {
    return `
Você é um assistente de vendas especializado em qualificar leads B2B. 

Mensagem recebida: "${message}"

Contexto do lead:
- Nome: ${leadContext.name || 'Cliente'}
- Empresa: ${leadContext.metadata?.company || 'Não informado'}
- Score atual: ${leadContext.score}/10
- Status: ${leadContext.status}

INSTRUÇÕES:
1. Seja profissional mas amigável
2. Faça perguntas qualificadoras quando apropriado
3. Ofereça valor na resposta
4. Mantenha o tom consultivo, não vendedor
5. Use no máximo 2-3 frases
6. Se for primeira interação, se apresente brevemente

Empresa: ${process.env.BUSINESS_NAME || 'Nossa Empresa'}
Área: Soluções tecnológicas para empresas

Gere uma resposta personalizada:`;
  }

  private parseAnalysisResponse(response: string): any {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback parsing
      return {
        sentiment: 'neutral',
        intent: 'unknown',
        entities: [],
        confidence: 0.5
      };
    } catch (error) {
      logger.error('Error parsing analysis response:', error);
      return {
        sentiment: 'neutral',
        intent: 'unknown',
        entities: [],
        confidence: 0
      };
    }
  }

  private parseQualificationResponse(response: string): any {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        score: 5,
        temperature: 'cold',
        reasoning: 'Could not parse qualification',
        nextActions: ['Manual review required']
      };
    } catch (error) {
      logger.error('Error parsing qualification response:', error);
      return {
        score: 5,
        temperature: 'cold',
        reasoning: 'Error during parsing',
        nextActions: ['Manual review required']
      };
    }
  }
}