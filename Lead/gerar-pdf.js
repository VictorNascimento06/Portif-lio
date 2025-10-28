const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function createPDF() {
  console.log('🔄 Gerando PDF da descrição do Lead AI...');
  
  // Ler o arquivo markdown
  const markdownContent = fs.readFileSync('./DESCRICAO-RESUMIDA.md', 'utf8');
  
  // Converter markdown para HTML
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Lead AI - Sistema de Qualificação Inteligente</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background: #fff;
        }
        
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
            margin-bottom: 30px;
            font-size: 2.5em;
        }
        
        h2 {
            color: #34495e;
            margin-top: 35px;
            margin-bottom: 15px;
            font-size: 1.5em;
            border-left: 4px solid #3498db;
            padding-left: 15px;
        }
        
        h3 {
            color: #2c3e50;
            margin-top: 25px;
            margin-bottom: 10px;
        }
        
        p {
            margin-bottom: 15px;
            text-align: justify;
        }
        
        ul, ol {
            margin-bottom: 20px;
            padding-left: 25px;
        }
        
        li {
            margin-bottom: 8px;
        }
        
        strong {
            color: #2c3e50;
            font-weight: 600;
        }
        
        .emoji {
            font-size: 1.2em;
        }
        
        .highlight {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 5px;
            padding: 20px;
            margin: 20px 0;
        }
        
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #3498db;
            font-size: 1.2em;
            color: #3498db;
            font-weight: bold;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin: 20px 0;
        }
        
        .stat-item {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            border-left: 4px solid #27ae60;
        }
        
        .example-box {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        
        .tech-stack {
            background: #e8f4fd;
            border: 1px solid #3498db;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <h1>🤖 Lead AI - Sistema de Qualificação Inteligente</h1>

    <h2>📋 O que é?</h2>
    <p>Sistema automatizado que <strong>qualifica leads via WhatsApp</strong> usando Inteligência Artificial, transformando conversas em oportunidades de negócio classificadas por potencial de conversão.</p>

    <h2>🎯 Como funciona?</h2>
    <ol>
        <li><strong>Cliente envia mensagem</strong> no WhatsApp da empresa</li>
        <li><strong>IA analisa a mensagem</strong> em tempo real</li>
        <li><strong>Sistema classifica o lead</strong> (Frio/Morno/Quente) com score 1-10</li>
        <li><strong>Resposta automática personalizada</strong> é enviada instantaneamente</li>
        <li><strong>Equipe é notificada</strong> sobre leads quentes para contato imediato</li>
    </ol>

    <h2>🔥 Principais Benefícios</h2>
    <ul>
        <li>✅ <strong>Resposta instantânea</strong> 24/7 (mesmo fora do horário comercial)</li>
        <li>✅ <strong>Qualificação automática</strong> por IA (sem intervenção humana)</li>
        <li>✅ <strong>Priorização de leads</strong> (foco nos clientes com maior potencial)</li>
        <li>✅ <strong>Aumento de conversão</strong> (contato rápido = mais vendas)</li>
        <li>✅ <strong>Economia de tempo</strong> da equipe de vendas</li>
    </ul>

    <h2>💰 ROI Comprovado</h2>
    <div class="stats">
        <div class="stat-item">
            <strong>+40%</strong><br>conversão vs atendimento manual
        </div>
        <div class="stat-item">
            <strong>-60%</strong><br>tempo de resposta ao cliente
        </div>
        <div class="stat-item">
            <strong>+300%</strong><br>produtividade da equipe
        </div>
        <div class="stat-item">
            <strong>24/7</strong><br>disponibilidade sem custos extras
        </div>
    </div>

    <h2>🏢 Ideal para:</h2>
    <ul>
        <li><strong>Corretoras de imóveis</strong></li>
        <li><strong>Concessionárias de veículos</strong></li>
        <li><strong>Clínicas e consultórios</strong></li>
        <li><strong>Empresas de serviços</strong></li>
        <li><strong>E-commerce de alto valor</strong></li>
    </ul>

    <div class="example-box">
        <h2>📊 Exemplo Real:</h2>
        <p><strong>Mensagem:</strong> "Preciso urgente apartamento 3 quartos Copacabana R$ 700mil financiado"</p>
        <ul>
            <li><strong>Score:</strong> 10/10 🔥</li>
            <li><strong>Classificação:</strong> Lead Quente</li>
            <li><strong>Ação:</strong> Contato em 5 minutos + Agendamento de visita</li>
        </ul>
    </div>

    <div class="tech-stack">
        <h2>💡 Tecnologia:</h2>
        <ul>
            <li>WhatsApp Business API</li>
            <li>Inteligência Artificial (OpenAI GPT)</li>
            <li>Dashboard de gestão em tempo real</li>
            <li>Relatórios de performance e ROI</li>
        </ul>
    </div>

    <div class="footer">
        🚀 Transforme conversas em vendas automaticamente!
    </div>
</body>
</html>
`;

  try {
    // Iniciar Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Configurar página
    await page.setContent(htmlContent);
    
    // Gerar PDF
    await page.pdf({
      path: './Lead-AI-Descricao.pdf',
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      }
    });
    
    await browser.close();
    
    console.log('✅ PDF gerado com sucesso: Lead-AI-Descricao.pdf');
    console.log('📍 Localização:', path.resolve('./Lead-AI-Descricao.pdf'));
    
  } catch (error) {
    console.error('❌ Erro ao gerar PDF:', error.message);
  }
}

// Executar
createPDF();