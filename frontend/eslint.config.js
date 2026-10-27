// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    // Nos testes, describe/test/expect são criados pelo Jest
    files: ['**/__tests__/**/*.js'],
    languageOptions: {
      globals: { describe: 'readonly', test: 'readonly', expect: 'readonly' },
    },
  },
]);
