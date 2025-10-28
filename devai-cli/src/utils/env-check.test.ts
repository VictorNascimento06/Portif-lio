import { checkEnvironment, getEnvironmentConfig } from '../utils/env-check';

describe('Environment Check', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('getEnvironmentConfig', () => {
    it('should return default config when env vars are not set', () => {
      delete process.env.OPENAI_API_KEY;
      delete process.env.OPENAI_MODEL;
      delete process.env.OPENAI_MAX_TOKENS;

      const config = getEnvironmentConfig();

      expect(config).toEqual({
        openaiApiKey: '',
        openaiModel: 'gpt-4',
        maxTokens: 500
      });
    });

    it('should use environment variables when set', () => {
      process.env.OPENAI_API_KEY = 'test-key';
      process.env.OPENAI_MODEL = 'gpt-3.5-turbo';
      process.env.OPENAI_MAX_TOKENS = '1000';

      const config = getEnvironmentConfig();

      expect(config).toEqual({
        openaiApiKey: 'test-key',
        openaiModel: 'gpt-3.5-turbo',
        maxTokens: 1000
      });
    });

    it('should handle invalid max tokens', () => {
      process.env.OPENAI_MAX_TOKENS = 'invalid';

      const config = getEnvironmentConfig();

      expect(config.maxTokens).toBeNaN();
    });
  });

  describe('checkEnvironment', () => {
    // Mock console methods
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const processExitSpy = jest.spyOn(process, 'exit').mockImplementation((code?: number) => {
      throw new Error(`Process exit called with code ${code}`);
    });

    afterEach(() => {
      consoleSpy.mockClear();
      processExitSpy.mockClear();
    });

    it('should exit when OPENAI_API_KEY is not set', async () => {
      delete process.env.OPENAI_API_KEY;

      await expect(checkEnvironment()).rejects.toThrow('Process exit called with code 1');
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it('should not exit when OPENAI_API_KEY is set', async () => {
      process.env.OPENAI_API_KEY = 'test-key';

      await expect(checkEnvironment()).resolves.toBeUndefined();
      expect(processExitSpy).not.toHaveBeenCalled();
    });
  });
});