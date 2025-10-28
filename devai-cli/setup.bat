@echo off
echo 🤖 DevAI CLI - Quick Start Setup
echo ================================

echo 📦 Installing project dependencies...
call npm install

echo 🏗️  Building the project...
call npm run build

echo ⚙️  Setting up environment...
if not exist .env (
    copy .env.example .env
    echo 📝 Please edit .env file and add your OpenAI API key
    echo.
)

echo ✅ Setup complete!
echo.
echo 🚀 Next steps:
echo 1. Edit .env file with your OpenAI API key
echo 2. Run: npm run dev
echo 3. Test: node dist/index.js --help
echo.
echo Happy coding! 🎉