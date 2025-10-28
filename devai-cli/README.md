# 🤖 DevAI CLI

<div align="center">

[![npm version](https://badge.fury.io/js/devai-cli.svg)](https://badge.fury.io/js/devai-cli)
[![CI/CD Pipeline](https://github.com/yourusername/devai-cli/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/yourusername/devai-cli/actions/workflows/ci-cd.yml)
[![codecov](https://codecov.io/gh/yourusername/devai-cli/branch/main/graph/badge.svg)](https://codecov.io/gh/yourusername/devai-cli)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat&logo=openai&logoColor=white)](https://openai.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**AI-powered developer assistant that supercharges your coding workflow**

*Generate smart commits • Review code automatically • Create documentation instantly*

</div>

---

## ✨ Features

### 🧠 **Smart Commit Messages**
Analyze your git diff and generate conventional commit messages automatically
- 📝 Follows conventional commits format
- 🎯 Context-aware and descriptive
- ⚡ Instant generation from staged changes

### 🔍 **AI Code Review**
Get intelligent code analysis and improvement suggestions
- 🐛 Bug detection and security issues
- 📈 Performance optimization hints
- 🏗️ Architecture and best practices advice

### 📚 **Auto Documentation**
Generate comprehensive documentation for your code
- 📖 JSDoc comments and API documentation
- 📋 README generation for projects
- 💡 Usage examples and explanations

---

## 🚀 Installation

```bash
# Install globally via npm
npm install -g devai-cli

# Or using yarn
yarn global add devai-cli

# Or using pnpm
pnpm add -g devai-cli
```

## ⚙️ Quick Setup

1. **Get your OpenAI API key** from [OpenAI Platform](https://platform.openai.com/api-keys)

2. **Configure DevAI**:
   ```bash
   devai config
   ```

3. **You're ready to go!** 🎉

---

## 🎯 Usage

### Smart Commits

```bash
# Stage your changes
git add .

# Generate AI-powered commit message
devai commit

# Auto-commit with AI message
devai commit --auto

# Commit and push in one command
devai commit --auto --push

# Preview message without committing
devai commit --dry-run
```

**Example output:**
```
🎯 Generated commit message:
   "feat(auth): add JWT token validation with expiry check"

✅ Use this commit message? (Y/n)
```

### Code Review

```bash
# Review specific files
devai review src/utils/helper.ts src/components/Button.tsx

# Review all code files in project
devai review --all

# Review staged files only
devai review --staged
```

**Example output:**
```
📋 Review for src/utils/helper.ts:
──────────────────────────────────────────────────

🔍 Code Quality Analysis:
• Consider using 'const' instead of 'let' for immutable variables
• Add error handling for edge cases in calculateTotal()
• The function could benefit from TypeScript strict typing

🐛 Potential Issues:
• Possible null reference in line 15
• Missing input validation

📈 Performance Suggestions:
• Use array.reduce() instead of manual loop for better readability
• Consider memoization for expensive calculations

🛡️ Security Notes:
• No immediate security concerns detected
──────────────────────────────────────────────────
```

### Documentation Generation

```bash
# Generate docs for a specific file
devai docs src/services/api.ts

# Save documentation to file
devai docs src/services/api.ts --output docs/api.md

# Generate project README (coming soon)
devai docs --readme
```

### Configuration Management

```bash
# Setup or update configuration
devai config

# View current settings
devai config show
```

---

## 📖 Commands Reference

| Command | Alias | Description |
|---------|-------|-------------|
| `devai commit` | `devai c` | Generate smart commit messages |
| `devai review` | `devai r` | AI-powered code review |
| `devai docs` | `devai d` | Generate documentation |
| `devai config` | - | Configure settings |

### Commit Options

| Option | Description |
|--------|-------------|
| `-a, --auto` | Auto-commit with generated message |
| `-p, --push` | Push after committing |
| `--dry-run` | Show message without committing |

### Review Options

| Option | Description |
|--------|-------------|
| `--all` | Review all code files |
| `--staged` | Review only staged files |

### Docs Options

| Option | Description |
|--------|-------------|
| `--output <path>` | Save to specific file |
| `--readme` | Generate project README |

---

## 🛠️ Configuration

DevAI uses a `.env` file for configuration:

```env
# Required: Your OpenAI API key
OPENAI_API_KEY=sk-your-api-key-here

# Optional: Model selection (default: gpt-4)
OPENAI_MODEL=gpt-4

# Optional: Max tokens per request (default: 500)
OPENAI_MAX_TOKENS=500
```

### Supported Models

- `gpt-4` (Recommended) - Best quality, slower
- `gpt-4-turbo-preview` - Fast GPT-4 variant
- `gpt-3.5-turbo` - Faster, good quality

---

## 🌟 Examples

### Real-world Usage

```bash
# Typical development workflow
git add src/components/LoginForm.tsx
devai commit --auto --push

# Code review before merge
devai review src/components/ --all

# Generate docs for new API
devai docs src/api/users.ts --output docs/users-api.md
```

### Integration with Git Hooks

Add to your `.git/hooks/pre-commit`:

```bash
#!/bin/sh
# Auto-review staged files before commit
devai review --staged
```

---

## 🏗️ Development

### Prerequisites

- Node.js 16+ 
- npm or yarn
- OpenAI API key

### Setup

```bash
# Clone repository
git clone https://github.com/yourusername/devai-cli.git
cd devai-cli

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your OpenAI API key

# Run in development
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

### Project Structure

```
devai-cli/
├── src/
│   ├── commands/          # CLI commands
│   ├── services/          # Business logic
│   ├── utils/             # Helper functions
│   └── index.ts           # Entry point
├── tests/                 # Test files
├── docs/                  # Documentation
└── dist/                  # Built output
```

---

## 🤝 Contributing

We love contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests
4. **Run the test suite**: `npm test`
5. **Commit your changes**: `git commit -m 'feat: add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines

- ✅ Write tests for new features
- ✅ Follow TypeScript best practices
- ✅ Use conventional commit messages
- ✅ Update documentation
- ✅ Ensure CI passes

---

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a complete list of changes.

---

## 🔒 Security

- API keys are stored locally and never transmitted except to OpenAI
- No code is stored or transmitted beyond OpenAI's API
- All communication uses HTTPS
- We follow security best practices

Report security issues to: security@yourdomain.com

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) for providing the AI capabilities
- [Commander.js](https://github.com/tj/commander.js/) for CLI framework
- [Chalk](https://github.com/chalk/chalk) for beautiful terminal output
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js/) for interactive prompts

---

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/devai-cli?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/devai-cli?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/devai-cli)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/devai-cli)

---

<div align="center">

**Made with ❤️ by developers, for developers**

[🌟 Star this project](https://github.com/yourusername/devai-cli) | [🐛 Report Bug](https://github.com/yourusername/devai-cli/issues) | [💡 Request Feature](https://github.com/yourusername/devai-cli/issues)

</div>