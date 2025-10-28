$uri = "http://localhost:3000/api/webhooks/whatsapp"
$headers = @{
    "Content-Type" = "application/json"
}
$body = @{
    from = "+5521999397195"
    body = "Oi! Estou procurando apartamento 3 quartos Copacabana até R$ 700mil. Pode me ajudar?"
} | ConvertTo-Json

Write-Host "🧪 TESTANDO SEU WHATSAPP" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green
Write-Host "📱 Número: +5521999397195" -ForegroundColor Yellow
Write-Host "💬 Mensagem: Apartamento 3 quartos Copacabana R$ 700mil" -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $uri -Method Post -Headers $headers -Body $body
    
    Write-Host "✅ SUCESSO! Lead qualificado:" -ForegroundColor Green
    Write-Host "🔥 Score: $($response.data.qualificationScore)/10" -ForegroundColor Red
    Write-Host "🌡️ Temperatura: $($response.data.temperature)" -ForegroundColor Cyan
    Write-Host "🎯 Intenção: $($response.data.intent)" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "🤖 RESPOSTA AUTOMÁTICA:" -ForegroundColor Blue
    Write-Host $response.data.autoResponse -ForegroundColor White
    
} catch {
    Write-Host "❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔍 Para ver todos os leads:" -ForegroundColor Cyan
Write-Host "🌐 http://localhost:3000/api/leads" -ForegroundColor White