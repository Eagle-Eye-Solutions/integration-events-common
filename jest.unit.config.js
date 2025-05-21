/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
  testPathIgnorePatterns: ['<rootDir>/build/.*'],
  roots: [
    '<rootDir>/src',
    '<rootDir>/test/unit',
    '<rootDir>/examples/generic-connector/test/unit',
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '<rootDir>/examples/generic-connector/src/**/*.ts',
  ],
  coverageDirectory: '<rootDir>/coverage/unit',
};
