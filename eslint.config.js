// @ts-check

import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import astroPlugin from 'eslint-plugin-astro';
import importXPlugin from 'eslint-plugin-import-x';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

const ignoresConfig = tsEslint.config({ ignores: ['dist/', 'src/env.d.ts', 'src/assets/vendors/'] });

const filesConfig = tsEslint.config({ files: ['**/*.{js,ts}'] });

const languageOptionsConfig = tsEslint.config({
  languageOptions: {
    parser: tsEslint.parser,
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: globals.browser,
  },
});

const unusedImportsPluginConfig = tsEslint.config({
  plugins: {
    'unused-imports': unusedImportsPlugin,
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
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
  },
});

const importXPluginConfig = tsEslint.config(
  importXPlugin.flatConfigs.recommended,
  importXPlugin.flatConfigs.typescript,
  {
    rules: {
      'import-x/no-named-as-default-member': 'off',
      'import-x/no-unresolved': [
        'error',
        {
          ignore: ['astro:*'],
        },
      ],
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
    settings: {
      'import-x/resolver': {
        typescript: {
          alwaysTryTypes: true,
          typescript: true,
          node: true,
        },
      },
    },
  },
);

const astroPluginConfig = tsEslint.config(...astroPlugin.configs.recommended, {
  rules: {},
});

export default tsEslint.config(
  ...ignoresConfig,
  ...filesConfig,
  ...languageOptionsConfig,
  eslint.configs.recommended,
  ...tsEslint.configs.strict,
  ...unusedImportsPluginConfig,
  ...importXPluginConfig,
  ...astroPluginConfig,
  prettier,
  {
    rules: {
      'no-console': 'warn',
    },
  },
);
