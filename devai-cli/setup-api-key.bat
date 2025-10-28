@echo off
echo 🔑 DevAI CLI - API Key Setup Guide
echo ==================================
echo.
echo 📋 Current Status:
node dist/index.js config show
echo.
echo 📝 Steps to configure:
echo 1. 🌐 Go to: https://platform.openai.com/api-keys
echo 2. 🔑 Create a new API key
echo 3. 📋 Copy the key (starts with sk-)
echo 4. ⚙️  Run: node dist/index.js config
echo 5. 🧪 Test: node dist/index.js test
echo.
echo 💡 Or edit .env file manually:
echo    OPENAI_API_KEY=sk-your-real-key-here
echo.
echo 🚀 After setup, try:
echo    node dist/index.js commit --help
echo    node dist/index.js review src/index.ts
echo.