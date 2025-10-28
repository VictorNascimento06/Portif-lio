import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import simpleGit from 'simple-git';
import { OpenAIService } from '../services/openai';

export const smartCommitCommand = new Command('commit')
  .alias('c')
  .description('🧠 Generate AI-powered commit messages from git diff')
  .option('-a, --auto', 'Automatically commit with AI-generated message')
  .option('-p, --push', 'Push changes after commit')
  .option('--dry-run', 'Show generated message without committing')
  .action(async (options) => {
    const git = simpleGit();
    const openaiService = new OpenAIService();
    
    try {
      // Check if we're in a git repository
      const isRepo = await git.checkIsRepo();
      if (!isRepo) {
        console.log(chalk.red('❌ Not a git repository. Run `git init` first.'));
        return;
      }

      // Check for staged changes
      const status = await git.status();
      if (status.staged.length === 0) {
        console.log(chalk.yellow('⚠️  No staged changes found.'));
        console.log(chalk.blue('💡 Stage your changes with: git add <files>'));
        return;
      }

      console.log(chalk.blue(`📋 Found ${status.staged.length} staged file(s):`));
      status.staged.forEach(file => {
        console.log(chalk.gray(`   • ${file}`));
      });
      console.log('');

      // Get git diff
      const spinner = ora('🤖 Analyzing changes with AI...').start();
      const diff = await git.diff(['--staged']);
      
      if (!diff.trim()) {
        spinner.fail('No changes to analyze');
        return;
      }

      // Generate commit message
      let commitMessage: string;
      try {
        commitMessage = await openaiService.generateCommitMessage(diff);
        spinner.succeed('AI analysis complete!');
      } catch (error) {
        spinner.fail('Failed to generate commit message');
        console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
        return;
      }

      console.log(chalk.green('🎯 Generated commit message:'));
      console.log(chalk.white(`   "${commitMessage}"`));
      console.log('');

      // Dry run mode
      if (options.dryRun) {
        console.log(chalk.blue('🔍 Dry run complete - no changes made'));
        return;
      }

      // Auto commit or ask for confirmation
      let shouldCommit = options.auto;
      
      if (!shouldCommit) {
        const { confirm } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirm',
            message: 'Use this commit message?',
            default: true,
          },
        ]);
        shouldCommit = confirm;
      }

      if (!shouldCommit) {
        const { customMessage } = await inquirer.prompt([
          {
            type: 'input',
            name: 'customMessage',
            message: 'Enter your custom commit message:',
            default: commitMessage,
          },
        ]);
        commitMessage = customMessage;
      }

      // Commit the changes
      const commitSpinner = ora('📝 Committing changes...').start();
      try {
        await git.commit(commitMessage);
        commitSpinner.succeed(`Committed: ${commitMessage}`);
      } catch (error) {
        commitSpinner.fail('Failed to commit changes');
        console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
        return;
      }

      // Push if requested
      if (options.push) {
        const pushSpinner = ora('🚀 Pushing to remote...').start();
        try {
          await git.push();
          pushSpinner.succeed('Changes pushed successfully!');
        } catch (error) {
          pushSpinner.fail('Failed to push changes');
          console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      }

      console.log(chalk.green('✨ All done!'));
      
    } catch (error) {
      console.error(chalk.red(`💥 Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });