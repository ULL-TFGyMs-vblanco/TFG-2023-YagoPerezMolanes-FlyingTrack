module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'angular'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    // Aquí puedes configurar las reglas específicas que deseas aplicar o modificar
    "@typescript-eslint/no-empty-function": "off",
    // "@typescript-eslint/no-explicit-any": "off"
  },
};
