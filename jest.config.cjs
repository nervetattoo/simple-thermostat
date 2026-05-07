module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': [
      'ts-jest',
      {
        tsconfig: {
          allowJs: true,
          module: 'commonjs',
          target: 'es2021',
          esModuleInterop: true,
          experimentalDecorators: true,
          useDefineForClassFields: false,
        },
        diagnostics: { warnOnly: true },
      },
    ],
  },
  transformIgnorePatterns: ['/node_modules/(?!(lit|@lit|lit-html|lit-element))'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/src/test/__mocks__/styleMock.js',
  },
  testEnvironment: 'jest-environment-jsdom',
}
