import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';

export const configCommand = new Command('config')
  .description('⚙️  Configure DevAI CLI settings')
  .action(async () => {
    console.log(chalk.blue('⚙️  DevAI Configuration Setup\n'));
    
    try {
      const { apiKey } = await inquirer.prompt([
        {
          type: 'password',
          name: 'apiKey',
          message: 'Enter your OpenAI API key:',
          validate: (input: string) => {
            if (!input.trim()) {
              return 'API key is required';
            }
            if (!input.startsWith('sk-')) {
              return 'Invalid API key format (should start with sk-)';
            }
            return true;
          },
        },
      ]);

      const { model } = await inquirer.prompt([
        {
          type: 'list',
          name: 'model',
          message: 'Choose OpenAI model:',
          choices: [
            { name: 'GPT-4 (Recommended)', value: 'gpt-4' },
            { name: 'GPT-4 Turbo', value: 'gpt-4-turbo-preview' },
            { name: 'GPT-3.5 Turbo (Faster)', value: 'gpt-3.5-turbo' },
          ],
          default: 'gpt-4',
        },
      ]);

      const { maxTokens } = await inquirer.prompt([
        {
          type: 'number',
          name: 'maxTokens',
          message: 'Maximum tokens per request:',
          default: 500,
          validate: (input: number) => {
            if (input < 50 || input > 2000) {
              return 'Tokens must be between 50 and 2000';
            }
            return true;
          },
        },
      ]);

      // Create .env file
      const envPath = join(process.cwd(), '.env');
      const envContent = `# DevAI CLI Configuration
OPENAI_API_KEY=${apiKey}
OPENAI_MODEL=${model}
OPENAI_MAX_TOKENS=${maxTokens}
`;

      writeFileSync(envPath, envContent);
      
      console.log(chalk.green('\n✅ Configuration saved successfully!'));
      console.log(chalk.gray(`Config saved to: ${envPath}`));
      console.log(chalk.blue('\n🚀 You can now use DevAI commands:'));
      console.log(chalk.gray('   devai commit     - Smart commit messages'));
      console.log(chalk.gray('   devai review     - AI code review'));
      console.log(chalk.gray('   devai docs       - Generate documentation'));
      
    } catch (error) {
      console.error(chalk.red(`💥 Configuration failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });

// Add subcommand to show current config
configCommand
  .command('show')
  .description('Show current configuration')
  .action(() => {
    const envPath = join(process.cwd(), '.env');
    
    if (!existsSync(envPath)) {
      console.log(chalk.yellow('⚠️  No configuration found. Run `devai config` to set up.'));
      return;
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const isValidKey = apiKey && apiKey !== 'sk-your-openai-api-key-here' && apiKey.startsWith('sk-');

    console.log(chalk.blue('📋 Current DevAI Configuration:'));
    console.log(chalk.gray('─'.repeat(40)));
    console.log(chalk.green(`OpenAI Model: ${process.env.OPENAI_MODEL || 'Not set'}`));
    console.log(chalk.green(`Max Tokens: ${process.env.OPENAI_MAX_TOKENS || 'Not set'}`));
    
    if (isValidKey) {
      console.log(chalk.green(`API Key: ✅ Configured`));
    } else {
      console.log(chalk.red(`API Key: ❌ Not configured (using example key)`));
      console.log(chalk.yellow('💡 Run `devai config` to set up your real OpenAI API key'));
    }
    
    console.log(chalk.gray(`Config file: ${envPath}`));
  });