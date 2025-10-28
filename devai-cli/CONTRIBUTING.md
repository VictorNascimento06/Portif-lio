# Contributing to DevAI CLI

First off, thank you for considering contributing to DevAI CLI! 🎉

It's people like you that make DevAI CLI such a great tool for the developer community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Commit Messages](#commit-messages)

## 🤝 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Pledge

- Be welcoming and inclusive
- Be respectful of differing viewpoints
- Focus on what is best for the community
- Show empathy towards other community members

## 🛠️ How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues as you might find that you don't need to create one.

**Great Bug Report Template:**
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Run command '...'
2. See error

**Expected behavior**
What you expected to happen.

**Environment:**
- OS: [e.g. macOS, Linux, Windows]
- Node.js version: [e.g. 18.17.0]
- DevAI CLI version: [e.g. 1.0.0]

**Additional context**
Add any other context about the problem here.
```

### 💡 Suggesting Features

Feature requests are welcome! Please provide:

- **Clear description** of the feature
- **Use case** - why would this be useful?
- **Implementation ideas** (if any)
- **Examples** of how it would work

### 🔧 Code Contributions

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Add** tests if applicable
5. **Update** documentation
6. **Submit** a pull request

## 🚀 Development Setup

### Prerequisites

- Node.js 16+
- npm or yarn
- OpenAI API key for testing

### Setup Steps

```bash
# 1. Fork and clone the repository
git clone https://github.com/yourusername/devai-cli.git
cd devai-cli

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Add your OpenAI API key to .env

# 4. Run in development mode
npm run dev

# 5. Run tests
npm test

# 6. Build the project
npm run build
```

### Project Structure

```
devai-cli/
├── src/
│   ├── commands/          # CLI command implementations
│   │   ├── smart-commit.ts
│   │   ├── code-review.ts
│   │   ├── docs.ts
│   │   └── config.ts
│   ├── services/          # Business logic
│   │   └── openai.ts
│   ├── utils/             # Helper functions
│   │   └── env-check.ts
│   └── index.ts           # Main entry point
├── tests/                 # Test files
├── .github/workflows/     # CI/CD configuration
└── dist/                  # Build output
```

## 📝 Pull Request Process

1. **Update** the README.md if needed
2. **Update** the version numbers following [SemVer](http://semver.org/)
3. **Update** CHANGELOG.md with details of changes
4. **Ensure** all tests pass and coverage remains high
5. **Request** review from maintainers

### PR Checklist

- [ ] Tests added/updated for new functionality
- [ ] Documentation updated (if applicable)
- [ ] CHANGELOG.md updated
- [ ] All CI checks passing
- [ ] Code follows style guidelines
- [ ] Commit messages follow conventional format

## 🎨 Style Guidelines

### TypeScript Guidelines

- Use **strict TypeScript** configuration
- Prefer **interfaces** over types for object shapes
- Use **explicit return types** for functions
- Follow **ESLint** configuration

### Code Style

```typescript
// ✅ Good
interface UserConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
}

function processConfig(config: UserConfig): boolean {
  // Implementation
  return true;
}

// ❌ Avoid
function processConfig(config: any) {
  // Implementation
}
```

### File Organization

- One class/interface per file
- Group related utilities
- Export from index files
- Use descriptive file names

## 📝 Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(commit): add auto-push option
fix(review): handle empty files gracefully
docs(readme): add installation instructions
test(openai): add service unit tests
```

## 🧪 Testing Guidelines

### Writing Tests

- **Unit tests** for individual functions
- **Integration tests** for command flows
- **Mock external dependencies** (OpenAI API)
- **Test error conditions** and edge cases

### Test Structure

```typescript
describe('FeatureName', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  it('should handle normal case', () => {
    // Test implementation
  });

  it('should handle error case', () => {
    // Error test
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- openai.test.ts
```

## 📚 Documentation Guidelines

### Code Documentation

- **JSDoc comments** for public APIs
- **Inline comments** for complex logic
- **README updates** for new features
- **Example usage** in documentation

### Documentation Style

```typescript
/**
 * Generates commit messages using OpenAI API
 * @param gitDiff - The git diff content to analyze
 * @returns Promise resolving to commit message
 * @throws {Error} When API request fails
 * @example
 * ```typescript
 * const message = await generateCommitMessage(diff);
 * console.log(message); // "feat(auth): add login validation"
 * ```
 */
async function generateCommitMessage(gitDiff: string): Promise<string> {
  // Implementation
}
```

## 🔒 Security Guidelines

- **Never commit** API keys or secrets
- **Validate all inputs** from users
- **Use environment variables** for configuration
- **Follow least privilege** principle
- **Report security issues** privately

## 🎯 Performance Guidelines

- **Minimize API calls** to OpenAI
- **Cache results** when appropriate
- **Handle rate limiting** gracefully
- **Optimize file operations**
- **Use streaming** for large outputs

## 🆘 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and ideas
- **Discord**: [Join our community] (coming soon)
- **Email**: maintainers@devai-cli.com

## 🎉 Recognition

Contributors will be:

- **Listed** in our README
- **Mentioned** in release notes
- **Invited** to our contributor Discord
- **Given credit** in commit messages

Thank you for contributing! 🙏