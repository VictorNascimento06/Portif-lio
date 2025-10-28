import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { OpenAIService } from '../services/openai';

export const testCommand = new Command('test')
  .description('🧪 Test OpenAI API connection')
  .action(async () => {
    console.log(chalk.blue('🧪 Testing OpenAI API connection...\n'));
    
    const spinner = ora('Connecting to OpenAI API...').start();
    
    try {
      const openaiService = new OpenAIService();
      
      // Test with a simple prompt
      const testDiff = `
diff --git a/test.js b/test.js
new file mode 100644
index 0000000..83db48f
--- /dev/null
+++ b/test.js
@@ -0,0 +1,3 @@
+function hello() {
+  console.log('Hello, World!');
+}
      `;
      
      const result = await openaiService.generateCommitMessage(testDiff);
      
      spinner.succeed('API connection successful!');
      
      console.log(chalk.green('\n✅ Test Results:'));
      console.log(chalk.gray('─'.repeat(40)));
      console.log(chalk.white(`Generated message: "${result}"`));
      console.log(chalk.gray('─'.repeat(40)));
      console.log(chalk.blue('\n🎉 Your DevAI CLI is ready to use!'));
      console.log(chalk.gray('Try: devai commit --dry-run'));
      
    } catch (error) {
      spinner.fail('API connection failed');
      
      console.log(chalk.red('\n❌ Error Details:'));
      console.log(chalk.gray('─'.repeat(40)));
      console.log(chalk.red(error instanceof Error ? error.message : 'Unknown error'));
      console.log(chalk.gray('─'.repeat(40)));
      
      console.log(chalk.yellow('\n🔧 Troubleshooting:'));
      console.log(chalk.gray('1. Check if your API key is valid'));
      console.log(chalk.gray('2. Verify you have OpenAI credits'));
      console.log(chalk.gray('3. Try: devai config'));
      console.log(chalk.gray('4. Check network connection'));
    }
  });