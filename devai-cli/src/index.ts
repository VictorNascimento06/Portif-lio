#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { config } from 'dotenv';
import { smartCommitCommand } from './commands/smart-commit';
import { codeReviewCommand } from './commands/code-review';
import { docsCommand } from './commands/docs';
import { configCommand } from './commands/config';
import { testCommand } from './commands/test';
import { demoCommand } from './commands/demo';
import { checkEnvironment } from './utils/env-check';

// Load environment variables
config();

const program = new Command();

// CLI Configuration
program
  .name('devai')
  .description('🤖 AI-powered developer assistant CLI tool')
  .version('1.0.0');

// Art banner
const banner = `
${chalk.cyan('╔══════════════════════════════════════╗')}
${chalk.cyan('║')}        ${chalk.bold.yellow('🤖 DevAI CLI v1.0.0')}        ${chalk.cyan('║')}
${chalk.cyan('║')}     ${chalk.gray('AI-Powered Developer Assistant')}    ${chalk.cyan('║')}
${chalk.cyan('╚══════════════════════════════════════╝')}
`;

console.log(banner);

// Add hook only for commands that need environment check
const commandsNeedingEnv = ['commit', 'c', 'review', 'r', 'docs', 'd', 'test'];

program.hook('preAction', async (thisCommand) => {
  const commandName = thisCommand.name();
  if (commandsNeedingEnv.includes(commandName)) {
    await checkEnvironment();
  }
});

// Register commands
program.addCommand(smartCommitCommand);
program.addCommand(codeReviewCommand);
program.addCommand(docsCommand);
program.addCommand(configCommand);
program.addCommand(testCommand);
program.addCommand(demoCommand);

// Global error handler
process.on('uncaughtException', (error: Error) => {
  console.error(chalk.red('💥 Unexpected error:'), error.message);
  process.exit(1);
});

process.on('unhandledRejection', (error: any) => {
  console.error(chalk.red('💥 Unhandled promise rejection:'), error);
  process.exit(1);
});

// Parse command line arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}