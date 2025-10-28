import chalk from 'chalk';
import { existsSync } from 'fs';
import { join } from 'path';

export interface EnvironmentConfig {
  openaiApiKey: string;
  openaiModel: string;
  maxTokens: number;
}

export async function checkEnvironment(): Promise<void> {
  const envPath = join(process.cwd(), '.env');
  
  if (!existsSync(envPath)) {
    console.log(chalk.yellow('⚠️  No .env file found!'));
    console.log(chalk.blue('📝 Please create a .env file with your OpenAI API key:'));
    console.log(chalk.gray('   OPENAI_API_KEY=your_api_key_here'));
    console.log(chalk.gray('   OPENAI_MODEL=gpt-4'));
    console.log(chalk.gray('   OPENAI_MAX_TOKENS=500'));
    console.log('');
  }

  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-your-openai-api-key-here') {
    console.log(chalk.red('❌ OPENAI_API_KEY not found or not configured'));
    console.log(chalk.blue('💡 Run: devai config'));
    console.log(chalk.gray('   Or edit your .env file with a valid OpenAI API key'));
    process.exit(1);
  }
}

export function getEnvironmentConfig(): EnvironmentConfig {
  return {
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    openaiModel: process.env.OPENAI_MODEL || 'gpt-4',
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '500')
  };
}