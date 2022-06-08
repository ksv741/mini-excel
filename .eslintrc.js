module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'airbnb/base',
    'airbnb-typescript/base',
  ],
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "no-console": "off",
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  ignorePatterns: ['.eslintrc.js']
};
