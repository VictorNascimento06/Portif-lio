import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { readFileSync } from 'fs';
import { glob } from 'glob';
import { OpenAIService } from '../services/openai';

export const codeReviewCommand = new Command('review')
  .alias('r')
  .description('🔍 AI-powered code review and suggestions')
  .argument('[files...]', 'Files to review (supports glob patterns)')
  .option('--all', 'Review all code files in the project')
  .option('--staged', 'Review only staged files')
  .action(async (files: string[], options) => {
    const openaiService = new OpenAIService();
    
    try {
      let filesToReview: string[] = [];

      if (options.all) {
        // Review common code file extensions
        const patterns = [
          '**/*.{js,ts,jsx,tsx}',
          '**/*.{py,java,cpp,c,cs}',
          '**/*.{php,rb,go,rs}'
        ];
        
        for (const pattern of patterns) {
          const matches = await glob(pattern, { ignore: ['node_modules/**', 'dist/**', 'build/**'] });
          filesToReview.push(...matches);
        }
      } else if (options.staged) {
        // Get staged files (would need git integration)
        console.log(chalk.yellow('⚠️  Staged files review not yet implemented'));
        return;
      } else if (files.length > 0) {
        // Use provided files
        filesToReview = files;
      } else {
        console.log(chalk.yellow('⚠️  No files specified for review'));
        console.log(chalk.blue('💡 Usage: devai review <files> or --all'));
        return;
      }

      if (filesToReview.length === 0) {
        console.log(chalk.yellow('⚠️  No code files found to review'));
        return;
      }

      console.log(chalk.blue(`🔍 Reviewing ${filesToReview.length} file(s)...\n`));

      for (const filePath of filesToReview) {
        const spinner = ora(`Reviewing ${filePath}...`).start();
        
        try {
          const code = readFileSync(filePath, 'utf-8');
          
          if (code.trim().length === 0) {
            spinner.info(`Skipped ${filePath} (empty file)`);
            continue;
          }

          const review = await openaiService.reviewCode(code, filePath);
          spinner.succeed(`Reviewed ${filePath}`);

          console.log(chalk.green(`\n📋 Review for ${chalk.bold(filePath)}:`));
          console.log(chalk.gray('─'.repeat(50)));
          console.log(review);
          console.log(chalk.gray('─'.repeat(50)));
          console.log('');
          
        } catch (error) {
          spinner.fail(`Failed to review ${filePath}`);
          console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      }

      console.log(chalk.green('✨ Code review complete!'));
      
    } catch (error) {
      console.error(chalk.red(`💥 Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });