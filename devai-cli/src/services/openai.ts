import OpenAI from 'openai';
import { getEnvironmentConfig } from '../utils/env-check';

export class OpenAIService {
  private client: OpenAI;
  private config: ReturnType<typeof getEnvironmentConfig>;

  constructor() {
    this.config = getEnvironmentConfig();
    this.client = new OpenAI({
      apiKey: this.config.openaiApiKey,
    });
  }

  async generateCommitMessage(gitDiff: string): Promise<string> {
    try {
      const prompt = `
Analyze this git diff and generate a concise, descriptive commit message following conventional commits format.

Git diff:
${gitDiff}

Rules:
- Use conventional commits format: type(scope): description
- Types: feat, fix, docs, style, refactor, test, chore
- Keep under 50 characters for the subject
- Be specific about what changed
- Use imperative mood

Example: "feat(auth): add JWT token validation"

Commit message:`;

      const response = await this.client.chat.completions.create({
        model: this.config.openaiModel,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: this.config.maxTokens,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content?.trim() || 'feat: update code';
    } catch (error) {
      throw new Error(`OpenAI API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async reviewCode(code: string, filePath: string): Promise<string> {
    try {
      const prompt = `
Please review this code and provide constructive feedback focusing on:
1. Code quality and best practices
2. Potential bugs or issues
3. Performance improvements
4. Security concerns
5. Maintainability suggestions

File: ${filePath}
Code:
${code}

Provide a structured review with specific suggestions:`;

      const response = await this.client.chat.completions.create({
        model: this.config.openaiModel,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.3,
      });

      return response.choices[0]?.message?.content?.trim() || 'No review available';
    } catch (error) {
      throw new Error(`OpenAI API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generateDocumentation(code: string, fileName: string): Promise<string> {
    try {
      const prompt = `
Generate comprehensive documentation for this code:

File: ${fileName}
Code:
${code}

Please provide:
1. Clear description of what the code does
2. Function/class documentation with JSDoc format
3. Usage examples
4. Parameter descriptions
5. Return value descriptions

Documentation:`;

      const response = await this.client.chat.completions.create({
        model: this.config.openaiModel,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.4,
      });

      return response.choices[0]?.message?.content?.trim() || 'No documentation generated';
    } catch (error) {
      throw new Error(`OpenAI API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}