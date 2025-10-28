// Teste específico para WhatsApp real
const testUrl = 'http://localhost:3000/api/webhooks/whatsapp';

// Simular mensagem do seu WhatsApp
const testMessage = {
  from: '+5521999397195', // Seu número
  body: 'Oi! Estou procurando um apartamento de 3 quartos em Copacabana, orçamento até R$ 700 mil. Pode me ajudar?'
};

console.log('🧪 TESTE REAL - SEU WHATSAPP');
console.log('========================================');
console.log(`📱 De: ${testMessage.from}`);
console.log(`💬 Mensagem: "${testMessage.body}"`);
console.log('');

// Usar PowerShell para fazer a requisição
const { spawn } = require('child_process');

const powershellCommand = `
$headers = @{'Content-Type' = 'application/json'}
$body = @{
    from = '${testMessage.from}'
    body = '${testMessage.body}'
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri '${testUrl}' -Method Post -Headers $headers -Body $body
    Write-Host "✅ SUCESSO! Resposta do sistema:"
    Write-Host ($response | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "❌ Erro: $($_.Exception.Message)"
}
`;

const ps = spawn('powershell', ['-Command', powershellCommand], {
  stdio: 'inherit'
});

ps.on('close', (code) => {
  console.log('\n🔍 Para ver os leads qualificados:');
  console.log('🌐 http://localhost:3000/api/leads');
  console.log('📊 http://localhost:3000/api/dashboard/stats');
  console.log('\n💡 Sistema funcionando! Agora você pode conectar o WhatsApp real.');
});