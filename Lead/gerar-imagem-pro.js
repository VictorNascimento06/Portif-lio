const puppeteer = require('puppeteer');

async function createProfessionalImage() {
  console.log('🎨 Gerando imagem PROFISSIONAL para LinkedIn...');
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            width: 1200px;
            height: 630px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }
        
        .background-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(circle at 20% 80%, rgba(120,119,198,0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(120,119,198,0.2) 0%, transparent 50%);
        }
        
        .main-container {
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            padding: 50px;
            width: 1100px;
            height: 530px;
            box-shadow: 
                0 32px 64px rgba(0,0,0,0.2),
                0 0 0 1px rgba(255,255,255,0.1),
                inset 0 1px 0 rgba(255,255,255,0.8);
            position: relative;
            z-index: 10;
        }
        
        .header-section {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 40px;
            padding-bottom: 25px;
            border-bottom: 2px solid #e2e8f0;
        }
        
        .brand-area {
            display: flex;
            align-items: center;
        }
        
        .logo-container {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 20px;
            box-shadow: 0 8px 24px rgba(79,70,229,0.3);
        }
        
        .logo-icon {
            font-size: 36px;
            color: white;
            font-weight: bold;
        }
        
        .title-group {
            flex: 1;
        }
        
        .main-title {
            font-size: 48px;
            font-weight: 800;
            color: #1e293b;
            line-height: 1.1;
            margin-bottom: 8px;
            background: linear-gradient(135deg, #1e293b 0%, #4f46e5 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .subtitle {
            font-size: 20px;
            font-weight: 500;
            color: #64748b;
            letter-spacing: 0.5px;
        }
        
        .ai-badge {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 12px 24px;
            border-radius: 50px;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 4px 12px rgba(16,185,129,0.3);
        }
        
        .content-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 35px;
        }
        
        .info-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 30px;
            position: relative;
            overflow: hidden;
        }
        
        .info-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
        }
        
        .card-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .card-icon {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            font-size: 16px;
        }
        
        .process-icon {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
        }
        
        .results-icon {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
        }
        
        .card-title {
            font-size: 22px;
            font-weight: 700;
            color: #1e293b;
        }
        
        .feature-list {
            list-style: none;
        }
        
        .feature-item {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            font-size: 16px;
            color: #475569;
        }
        
        .feature-bullet {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            font-size: 12px;
            color: white;
            font-weight: bold;
        }
        
        .metrics-section {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 35px;
        }
        
        .metric-card {
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            color: white;
            padding: 24px 20px;
            border-radius: 16px;
            text-align: center;
            box-shadow: 0 8px 24px rgba(30,41,59,0.2);
            position: relative;
            overflow: hidden;
        }
        
        .metric-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, #4f46e5 0%, #7c3aed 50%, #10b981 100%);
        }
        
        .metric-number {
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 8px;
            background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .metric-label {
            font-size: 13px;
            font-weight: 500;
            opacity: 0.9;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .cta-section {
            text-align: center;
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: white;
            padding: 25px;
            border-radius: 16px;
            box-shadow: 0 8px 24px rgba(79,70,229,0.3);
        }
        
        .cta-text {
            font-size: 24px;
            font-weight: 700;
            letter-spacing: 0.5px;
        }
        
        .floating-shapes {
            position: absolute;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        }
        
        .shape {
            position: absolute;
            border-radius: 50%;
            background: rgba(255,255,255,0.1);
            animation: float 8s ease-in-out infinite;
        }
        
        .shape:nth-child(1) {
            width: 60px;
            height: 60px;
            top: 10%;
            left: 5%;
            animation-delay: 0s;
        }
        
        .shape:nth-child(2) {
            width: 40px;
            height: 40px;
            top: 20%;
            right: 8%;
            animation-delay: 2s;
        }
        
        .shape:nth-child(3) {
            width: 80px;
            height: 80px;
            bottom: 15%;
            left: 8%;
            animation-delay: 4s;
        }
        
        .shape:nth-child(4) {
            width: 50px;
            height: 50px;
            bottom: 25%;
            right: 12%;
            animation-delay: 6s;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
        }
    </style>
</head>
<body>
    <div class="background-overlay"></div>
    
    <div class="floating-shapes">
        <div class="shape"></div>
        <div class="shape"></div>
        <div class="shape"></div>
        <div class="shape"></div>
    </div>
    
    <div class="main-container">
        <div class="header-section">
            <div class="brand-area">
                <div class="logo-container">
                    <div class="logo-icon">AI</div>
                </div>
                <div class="title-group">
                    <h1 class="main-title">Lead AI</h1>
                    <p class="subtitle">Sistema de Qualificação Inteligente</p>
                </div>
            </div>
        </div>
        
        <div class="content-grid">
            <div class="info-card">
                <div class="card-header">
                    <div class="card-icon process-icon">⚡</div>
                    <h3 class="card-title">Como Funciona</h3>
                </div>
                <ul class="feature-list">
                    <li class="feature-item">
                        <div class="feature-bullet">1</div>
                        Cliente envia mensagem WhatsApp
                    </li>
                    <li class="feature-item">
                        <div class="feature-bullet">2</div>
                        IA analisa e classifica automaticamente
                    </li>
                    <li class="feature-item">
                        <div class="feature-bullet">3</div>
                        Resposta personalizada instantânea
                    </li>
                    <li class="feature-item">
                        <div class="feature-bullet">4</div>
                        Equipe notificada sobre leads quentes
                    </li>
                </ul>
            </div>
            
            <div class="info-card">
                <div class="card-header">
                    <div class="card-icon results-icon">📈</div>
                    <h3 class="card-title">Resultados Comprovados</h3>
                </div>
                <ul class="feature-list">
                    <li class="feature-item">
                        <div class="feature-bullet">✓</div>
                        Resposta em segundos (24/7)
                    </li>
                    <li class="feature-item">
                        <div class="feature-bullet">✓</div>
                        Leads qualificados automaticamente
                    </li>
                    <li class="feature-item">
                        <div class="feature-bullet">✓</div>
                        Equipe focada em oportunidades reais
                    </li>
                    <li class="feature-item">
                        <div class="feature-bullet">✓</div>
                        ROI comprovado em 30 dias
                    </li>
                </ul>
            </div>
        </div>
        
        <div class="metrics-section">
            <div class="metric-card">
                <div class="metric-number">+40%</div>
                <div class="metric-label">Conversão</div>
            </div>
            <div class="metric-card">
                <div class="metric-number">24/7</div>
                <div class="metric-label">Disponível</div>
            </div>
            <div class="metric-card">
                <div class="metric-number">5min</div>
                <div class="metric-label">Resposta</div>
            </div>
            <div class="metric-card">
                <div class="metric-number">1-10</div>
                <div class="metric-label">Score IA</div>
            </div>
        </div>
        
        <div class="cta-section">
            <div class="cta-text">🚀 Transforme conversas em vendas automaticamente</div>
        </div>
    </div>
</body>
</html>
`;

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.setViewport({ width: 1200, height: 630 });
    await page.setContent(htmlContent);
    
    // Aguardar renderização completa
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    await page.screenshot({
      path: './Lead-AI-Professional.png',
      type: 'png',
      fullPage: false
    });
    
    await browser.close();
    
    console.log('✅ Imagem PROFISSIONAL gerada: Lead-AI-Professional.png');
    console.log('🎨 Design: Corporativo, moderno e elegante');
    console.log('📐 Formato: 1200x630px (otimizado LinkedIn)');
    console.log('📍 Localização:', require('path').resolve('./Lead-AI-Professional.png'));
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

createProfessionalImage();