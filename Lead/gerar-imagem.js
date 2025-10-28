const puppeteer = require('puppeteer');

async function createPostImage() {
  console.log('🎨 Gerando imagem para post do LinkedIn...');
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            width: 1200px;
            height: 630px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }
        
        .container {
            background: white;
            border-radius: 20px;
            padding: 60px;
            max-width: 1000px;
            box-shadow: 0 30px 60px rgba(0,0,0,0.3);
            position: relative;
            z-index: 2;
        }
        
        .header {
            display: flex;
            align-items: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #3498db;
            padding-bottom: 20px;
        }
        
        .robot-icon {
            font-size: 60px;
            margin-right: 20px;
        }
        
        .title {
            font-size: 48px;
            font-weight: bold;
            color: #2c3e50;
            margin: 0;
        }
        
        .subtitle {
            font-size: 24px;
            color: #7f8c8d;
            margin: 5px 0 0 0;
        }
        
        .content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 30px;
        }
        
        .section {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 15px;
            border-left: 5px solid #3498db;
        }
        
        .section h3 {
            font-size: 24px;
            color: #2c3e50;
            margin: 0 0 15px 0;
            display: flex;
            align-items: center;
        }
        
        .section h3 .emoji {
            margin-right: 10px;
            font-size: 28px;
        }
        
        .feature {
            font-size: 18px;
            color: #34495e;
            margin: 10px 0;
            display: flex;
            align-items: center;
        }
        
        .feature .check {
            color: #27ae60;
            font-weight: bold;
            margin-right: 10px;
            font-size: 20px;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin: 30px 0;
        }
        
        .stat {
            text-align: center;
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
            padding: 20px 15px;
            border-radius: 15px;
            box-shadow: 0 10px 20px rgba(52, 152, 219, 0.3);
        }
        
        .stat-number {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .stat-label {
            font-size: 14px;
            opacity: 0.9;
        }
        
        .cta {
            text-align: center;
            font-size: 28px;
            font-weight: bold;
            color: #e74c3c;
            margin-top: 20px;
        }
        
        .background-pattern {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.1;
            z-index: 1;
            background-image: 
                radial-gradient(circle at 25% 25%, #fff 2px, transparent 2px),
                radial-gradient(circle at 75% 75%, #fff 2px, transparent 2px);
            background-size: 50px 50px;
        }
        
        .floating-elements {
            position: absolute;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 1;
        }
        
        .float-item {
            position: absolute;
            color: rgba(255,255,255,0.1);
            font-size: 40px;
            animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }
    </style>
</head>
<body>
    <div class="background-pattern"></div>
    
    <div class="floating-elements">
        <div class="float-item" style="top: 10%; left: 5%;">💬</div>
        <div class="float-item" style="top: 20%; right: 8%;">📱</div>
        <div class="float-item" style="bottom: 15%; left: 10%;">⚡</div>
        <div class="float-item" style="bottom: 25%; right: 15%;">🎯</div>
    </div>
    
    <div class="container">
        <div class="header">
            <div class="robot-icon">🤖</div>
            <div>
                <h1 class="title">Lead AI</h1>
                <p class="subtitle">Sistema de Qualificação Inteligente</p>
            </div>
        </div>
        
        <div class="content">
            <div class="section">
                <h3><span class="emoji">🎯</span>Como Funciona</h3>
                <div class="feature"><span class="check">•</span>Cliente manda mensagem</div>
                <div class="feature"><span class="check">•</span>IA analisa e classifica</div>
                <div class="feature"><span class="check">•</span>Resposta automática</div>
                <div class="feature"><span class="check">•</span>Equipe notificada</div>
            </div>
            
            <div class="section">
                <h3><span class="emoji">📈</span>Benefícios</h3>
                <div class="feature"><span class="check">✅</span>Resposta em segundos (24/7)</div>
                <div class="feature"><span class="check">✅</span>Leads qualificados</div>
                <div class="feature"><span class="check">✅</span>ROI comprovado</div>
                <div class="feature"><span class="check">✅</span>+40% conversão</div>
            </div>
        </div>
        
        <div class="stats">
            <div class="stat">
                <div class="stat-number">+40%</div>
                <div class="stat-label">Conversão</div>
            </div>
            <div class="stat">
                <div class="stat-number">24/7</div>
                <div class="stat-label">Disponível</div>
            </div>
            <div class="stat">
                <div class="stat-number">5min</div>
                <div class="stat-label">Resposta</div>
            </div>
            <div class="stat">
                <div class="stat-number">1-10</div>
                <div class="stat-label">Score IA</div>
            </div>
        </div>
        
        <div class="cta">
            🚀 Transforme conversas em vendas automaticamente!
        </div>
    </div>
</body>
</html>
`;

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Configurar viewport para formato de post LinkedIn
    await page.setViewport({ width: 1200, height: 630 });
    await page.setContent(htmlContent);
    
    // Aguardar renderização
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Capturar screenshot
    await page.screenshot({
      path: './Lead-AI-Post-LinkedIn.png',
      type: 'png',
      fullPage: false
    });
    
    await browser.close();
    
    console.log('✅ Imagem gerada com sucesso: Lead-AI-Post-LinkedIn.png');
    console.log('📐 Formato: 1200x630px (otimizado para LinkedIn)');
    console.log('📍 Localização:', require('path').resolve('./Lead-AI-Post-LinkedIn.png'));
    
  } catch (error) {
    console.error('❌ Erro ao gerar imagem:', error.message);
  }
}

createPostImage();