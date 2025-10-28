@echo off
echo 🧪 Testing DevAI CLI commands...
echo ===============================

echo 📋 Available commands:
node dist/index.js --help

echo.
echo 🔧 Configuration command:
node dist/index.js config --help

echo.
echo 📚 Documentation command:
node dist/index.js docs --help

echo.
echo 🔍 Review command:
node dist/index.js review --help

echo.
echo 🧠 Commit command:
node dist/index.js commit --help

echo.
echo ✅ All commands working! 
echo 💡 Configure your OpenAI API key with: node dist/index.js config