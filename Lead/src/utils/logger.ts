interface LogLevel {
  INFO: 'info';
  WARN: 'warn';
  ERROR: 'error';
  DEBUG: 'debug';
}

class Logger {
  private logLevel: LogLevel = {
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error',
    DEBUG: 'debug'
  };

  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private formatMessage(level: string, message: string, ...args: any[]): string {
    const timestamp = this.getTimestamp();
    const formattedArgs = args.length > 0 ? ` ${JSON.stringify(args)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${formattedArgs}`;
  }

  info(message: string, ...args: any[]): void {
    const formatted = this.formatMessage(this.logLevel.INFO, message, ...args);
    console.log(`\x1b[36m${formatted}\x1b[0m`); // Cyan
  }

  warn(message: string, ...args: any[]): void {
    const formatted = this.formatMessage(this.logLevel.WARN, message, ...args);
    console.warn(`\x1b[33m${formatted}\x1b[0m`); // Yellow
  }

  error(message: string, ...args: any[]): void {
    const formatted = this.formatMessage(this.logLevel.ERROR, message, ...args);
    console.error(`\x1b[31m${formatted}\x1b[0m`); // Red
  }

  debug(message: string, ...args: any[]): void {
    if (process.env.NODE_ENV === 'development') {
      const formatted = this.formatMessage(this.logLevel.DEBUG, message, ...args);
      console.log(`\x1b[90m${formatted}\x1b[0m`); // Gray
    }
  }

  success(message: string, ...args: any[]): void {
    const formatted = this.formatMessage('SUCCESS', message, ...args);
    console.log(`\x1b[32m${formatted}\x1b[0m`); // Green
  }
}

export const logger = new Logger();