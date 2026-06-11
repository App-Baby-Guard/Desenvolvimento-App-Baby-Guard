/** @type {import('jest').Config} */
try {
  const { ModuleMocker } = require('jest-mock');
  if (ModuleMocker && !ModuleMocker.prototype.clearMocksOnScope) {
    ModuleMocker.prototype.clearMocksOnScope = function (scope) {
      if (!scope) return;
      for (const key of Object.keys(scope)) {
        const value = scope[key];
        if (value != null && (typeof value === 'object' || typeof value === 'function') && '_isMockFunction' in value && this.isMockFunction(value) && typeof value.mockClear === 'function') {
          value.mockClear();
        }
      }
    };
  }
} catch (e) {
  // Ignore
}

module.exports = {
  preset: 'jest-expo',
  testEnvironment: './custom-node-env.js',
  setupFilesAfterEnv: [],
  setupFiles: ['./jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      {
        presets: ['expo/internal/babel-preset'],
      },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(' +
      'react-native' +
      '|@react-native' +
      '|@react-navigation' +
      '|expo(-.*)?' +
      '|@expo(-.*)?' +
      '|react-native-paper' +
      '|react-native-safe-area-context' +
      '|react-native-screens' +
      '|react-native-gesture-handler' +
      '|react-native-reanimated' +
      '|@react-native-async-storage' +
      '|react-native-toast-message' +
      '|react-native-chart-kit' +
      ')/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/testes/**/*.test.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  moduleNameMapper: {
    '^test-renderer$': '<rootDir>/mock-test-renderer.js',
    '^test-renderer/package\\.json$': '<rootDir>/mock-test-renderer-package.json',
    '\\.(png|jpg|jpeg|gif|svg|ttf|otf|woff|woff2|eot)$':
      '<rootDir>/__mocks__/fileMock.js',
  },
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react',
      },
    },
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/testes/**',
  ],
};
