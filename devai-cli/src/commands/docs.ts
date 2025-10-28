import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { readFileSync, writeFileSync } from 'fs';
import { OpenAIService } from '../services/openai';

export const docsCommand = new Command('docs')
  .alias('d')
  .description('📚 Generate AI-powered documentation')
  .argument('[file]', 'File to generate documentation for')
  .option('--output <path>', 'Output file path')
  .option('--readme', 'Generate README.md for the project')
  .action(async (file: string, options) => {
    const openaiService = new OpenAIService();
    
    try {
      if (options.readme) {
        console.log(chalk.blue('📝 Generating README.md...'));
        // This would analyze the project structure and generate a README
        console.log(chalk.yellow('⚠️  README generation not yet implemented'));
        return;
      }

      if (!file) {
        console.log(chalk.yellow('⚠️  No file specified'));
        console.log(chalk.blue('💡 Usage: devai docs <file> [--output <path>]'));
        return;
      }

      const spinner = ora(`📖 Generating documentation for ${file}...`).start();
      
      try {
        const code = readFileSync(file, 'utf-8');
        
        if (code.trim().length === 0) {
          spinner.fail('File is empty');
          return;
        }

        const documentation = await openaiService.generateDocumentation(code, file);
        spinner.succeed('Documentation generated!');

        console.log(chalk.green(`\n📚 Documentation for ${chalk.bold(file)}:`));
        console.log(chalk.gray('─'.repeat(60)));
        console.log(documentation);
        console.log(chalk.gray('─'.repeat(60)));

        // Save to output file if specified
        if (options.output) {
          writeFileSync(options.output, documentation);
          console.log(chalk.green(`\n💾 Documentation saved to ${options.output}`));
        }
        
      } catch (error) {
        spinner.fail('Failed to generate documentation');
        console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
      
    } catch (error) {
      console.error(chalk.red(`💥 Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });