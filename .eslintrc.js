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
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/lines-between-class-members": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "arrow-parens": "off",
    "class-methods-use-this": "off",
    "import/prefer-default-export": "off",
    "no-console": "off",
    "no-plusplus": "off",
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  ignorePatterns: ['.eslintrc.js']
};
