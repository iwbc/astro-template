module.exports = {
  root: true,

  env: {
    browser: true,
    es2021: true,
    node: true,
    jquery: true,
  },

  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:astro/recommended'],

  plugins: ['@typescript-eslint', 'import', 'unused-imports'],

  parser: '@typescript-eslint/parser',

  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },

  rules: {
    'no-console': 'warn',
    'no-constant-condition': [
      'error',
      {
        checkLoops: false,
      },
    ],
    'no-restricted-imports': 'off',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/no-unused-vars': 'off', // for unused-imports/no-unused-vars
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    'import/no-unresolved': [
      'error',
      {
        ignore: ['astro:*'],
      },
    ],
    'import/no-named-as-default-member': 'off',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
  },

  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        typescript: true,
        node: true,
      },
    },
  },

  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
      rules: {},
    },
  ],
};
