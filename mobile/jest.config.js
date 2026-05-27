/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
  collectCoverageFrom: [
    'hooks/**/*.{ts,tsx}',
    'services/**/*.ts',
    'utils/**/*.ts',
    'components/**/*.{ts,tsx}',
  ],
};
