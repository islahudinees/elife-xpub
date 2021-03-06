module.exports = {
  displayName: 'component-elife-app',
  rootDir: '../',
  setupTestFrameworkScriptFile: '<rootDir>/config/jest-setup.server.js',
  testMatch: ['<rootDir>/server/**/*.test.js'],
  transform: {}, // turn off babel for server code
  transformIgnorePatterns: ['/node_modules/(?!@?pubsweet)'],
  testEnvironment: 'node',
}
