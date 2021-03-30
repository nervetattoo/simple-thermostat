module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  preset: 'ts-jest',
  transform: {
    '^.+\\.(j|t)s?$': 'ts-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!(lit-html))'],
  runner: 'jest-electron/runner',
  testEnvironment: 'jest-electron/environment',
  globals: {
    'ts-jest': {
      tsconfig: {
        // allow js in typescript
        allowJs: true,
        rootDir: './',
      },
    },
  },
}
