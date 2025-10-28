const puppeteer = require('puppeteer');

async function createPropostaSimplesPDF() {
  console.log('📄 Gerando PDF - Proposta Comercial Simples (até R$ 5mil)...');
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background: #fff;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #4f46e5;
        }
        
        .logo {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: white;
            width: 80px;
            height: 80px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 24px;
            font-weight: bold;
        }
        
        .title {
            font-size: 2.5em;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 10px;
        }
        
        .subtitle {
            font-size: 1.2em;
            color: #7f8c8d;
            margin-bottom: 5px;
        }
        
        .price-highlight {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 12px 24px;
            border-radius: 50px;
            font-size: 1.1em;
            font-weight: 600;
            display: inline-block;
            margin-top: 10px;
        }
        
        .section {
            margin: 35px 0;
            padding: 25px;
            background: #f8fafc;
            border-radius: 12px;
            border-left: 5px solid #4f46e5;
        }
        
        .section h2 {
            color: #2c3e50;
            font-size: 1.5em;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
        }
        
        .section h2 .emoji {
            margin-right: 10px;
            font-size: 1.2em;
        }
        
        .features {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 20px 0;
        }
        
        .feature-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 12px;
        }
        
        .feature-icon {
            color: #10b981;
            font-weight: bold;
            margin-right: 10px;
            font-size: 1.1em;
        }
        
        .pricing-table {
            background: white;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .pricing-header {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 20px;
        }
        
        .price {
            font-size: 2.5em;
            font-weight: 700;
            margin-bottom: 5px;
        }
        
        .price-detail {
            font-size: 0.9em;
            opacity: 0.9;
        }
        
        .included-list {
            list-style: none;
            padding: 0;
        }
        
        .included-list li {
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            align-items: center;
        }
        
        .included-list li:last-child {
            border-bottom: none;
        }
        
        .check-icon {
            color: #10b981;
            font-weight: bold;
            margin-right: 10px;
        }
        
        .process {
            background: linear-gradient(135deg, #e8f4fd 0%, #f0f9ff 100%);
            padding: 25px;
            border-radius: 12px;
            margin: 25px 0;
        }
        
        .process h3 {
            color: #1e40af;
            margin-bottom: 20px;
            text-align: center;
            font-size: 1.3em;
        }
        
        .steps {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
        }
        
        .step {
            text-align: center;
            padding: 15px 10px;
        }
        
        .step-number {
            background: #1e40af;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 10px;
            font-weight: bold;
        }
        
        .step-text {
            font-size: 0.9em;
            color: #374151;
        }
        
        .cta {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            margin-top: 30px;
        }
        
        .cta h3 {
            font-size: 1.5em;
            margin-bottom: 15px;
        }
        
        .contact-info {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
            text-align: center;
        }
        
        .contact-item {
            margin: 8px 0;
            font-size: 1.0em;
            color: #374151;
            padding: 8px 15px;
            background: white;
            border-radius: 6px;
            border-left: 3px solid #10b981;
        }
        
        .guarantee {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
        }
        
        .guarantee h4 {
            color: #92400e;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">AI</div>
        <h1 class="title">Lead AI</h1>
        <p class="subtitle">Sistema de Qualificação Inteligente para WhatsApp</p>
        <div class="price-highlight">Versão Essencial - Até R$ 5.000</div>
    </div>

    <div class="section">
        <h2><span class="emoji">🎯</span>O Que Você Recebe</h2>
        <div class="features">
            <div>
                <div class="feature-item">
                    <span class="feature-icon">✅</span>
                    <span>Sistema de qualificação automática</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">✅</span>
                    <span>Integração WhatsApp Business</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">✅</span>
                    <span>Respostas automáticas personalizadas</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">✅</span>
                    <span>Score de leads (1-10)</span>
                </div>
            </div>
            <div>
                <div class="feature-item">
                    <span class="feature-icon">✅</span>
                    <span>Dashboard básico de gestão</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">✅</span>
                    <span>Notificações para leads quentes</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">✅</span>
                    <span>Configuração completa</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">✅</span>
                    <span>Treinamento e suporte inicial</span>
                </div>
            </div>
        </div>
    </div>

    <div class="pricing-table">
        <div class="pricing-header">
            <div class="price">R$ 4.500</div>
            <div class="price-detail">Implementação completa • Pagamento à vista</div>
        </div>
        
        <ul class="included-list">
            <li><span class="check-icon">✓</span> Desenvolvimento e configuração do sistema</li>
            <li><span class="check-icon">✓</span> Integração com seu WhatsApp Business</li>
            <li><span class="check-icon">✓</span> Personalização para seu negócio</li>
            <li><span class="check-icon">✓</span> Dashboard web responsivo</li>
            <li><span class="check-icon">✓</span> Treinamento da equipe (2h)</li>
            <li><span class="check-icon">✓</span> Suporte técnico inicial (30 dias)</li>
            <li><span class="check-icon">✓</span> Documentação completa</li>
            <li><span class="check-icon">✓</span> Hospedagem inicial (3 meses)</li>
        </ul>
    </div>

    <div class="process">
        <h3>🚀 Como Funciona o Processo</h3>
        <div class="steps">
            <div class="step">
                <div class="step-number">1</div>
                <div class="step-text">Reunião de briefing e análise</div>
            </div>
            <div class="step">
                <div class="step-number">2</div>
                <div class="step-text">Desenvolvimento personalizado</div>
            </div>
            <div class="step">
                <div class="step-number">3</div>
                <div class="step-text">Testes e configuração</div>
            </div>
            <div class="step">
                <div class="step-number">4</div>
                <div class="step-text">Entrega e treinamento</div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2><span class="emoji">📈</span>Resultados Esperados</h2>
        <div class="features">
            <div>
                <div class="feature-item">
                    <span class="feature-icon">🎯</span>
                    <span><strong>+40% conversão</strong> vs atendimento manual</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">⚡</span>
                    <span><strong>Resposta em segundos</strong> (24/7)</span>
                </div>
            </div>
            <div>
                <div class="feature-item">
                    <span class="feature-icon">💰</span>
                    <span><strong>ROI positivo</strong> em 30-60 dias</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">🔥</span>
                    <span><strong>Leads quentes</strong> identificados automaticamente</span>
                </div>
            </div>
        </div>
    </div>

    <div class="guarantee">
        <h4>🛡️ Garantia de Satisfação</h4>
        <p>Se em 30 dias você não estiver satisfeito com os resultados, devolvemos 100% do investimento.</p>
    </div>

    <div class="section">
        <h2><span class="emoji">⏰</span>Cronograma de Entrega</h2>
        <ul class="included-list">
            <li><span class="check-icon">📅</span> <strong>Semana 1:</strong> Análise e planejamento</li>
            <li><span class="check-icon">⚙️</span> <strong>Semana 2-3:</strong> Desenvolvimento e configuração</li>
            <li><span class="check-icon">🧪</span> <strong>Semana 4:</strong> Testes e ajustes finais</li>
            <li><span class="check-icon">🚀</span> <strong>Semana 5:</strong> Entrega e treinamento</li>
        </ul>
    </div>

    <div class="cta">
        <h3>Pronto para Revolucionar seu Atendimento?</h3>
        <p>Vamos agendar uma conversa para personalizar a solução para seu negócio!</p>
        
        <div class="contact-info">
            <div class="contact-item"><strong>WhatsApp:</strong> (21) 99939-7195</div>
            <div class="contact-item"><strong>Email:</strong> victor.dacruz@gmail.com</div>
            <div class="contact-item"><strong>LinkedIn:</strong> Victor Da Cruz</div>
            <div class="contact-item"><strong>Localização:</strong> Curitiba, PR</div>
        </div>
    </div>

    <div style="text-align: center; margin-top: 40px; color: #64748b; font-size: 0.9em;">
        <p>Lead AI - Sistema de Qualificação Inteligente | Desenvolvido por Victor Da Cruz</p>
        <p>Proposta válida por 15 dias • Valores em reais (BRL)</p>
    </div>
</body>
</html>
`;

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.setContent(htmlContent);
    
    // Aguardar renderização
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await page.pdf({
      path: './Proposta-Lead-AI-Simples.pdf',
      format: 'A4',
      printBackground: true,
      margin: {
        top: '15mm',
        right: '15mm',
        bottom: '15mm',
        left: '15mm'
      }
    });
    
    await browser.close();
    
    console.log('✅ PDF gerado: Proposta-Lead-AI-Simples.pdf');
    console.log('💰 Valor: R$ 4.500 (cliente até R$ 5mil)');
    console.log('📍 Localização:', require('path').resolve('./Proposta-Lead-AI-Simples.pdf'));
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

createPropostaSimplesPDF();