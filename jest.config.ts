import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

export default config;
