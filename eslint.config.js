// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier/flat';
import astroPlugin from 'eslint-plugin-astro';
import importXPlugin from 'eslint-plugin-import-x';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

const ignoresConfig = defineConfig({ ignores: ['dist/', '.astro/', 'src/env.d.ts'] });

const filesConfig = defineConfig({ files: ['**/*.{js,ts}'] });

const languageOptionsConfig = defineConfig({
  languageOptions: {
    parser: tsEslint.parser,
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: globals.browser,
  },
});

const unusedImportsPluginConfig = defineConfig({
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

const importXPluginConfig = defineConfig([
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
]);

const astroPluginConfig = defineConfig([
  ...astroPlugin.configs.recommended,
  {
    rules: {},
  },
]);

export default defineConfig(
  ignoresConfig,
  filesConfig,
  languageOptionsConfig,
  eslint.configs.recommended,
  ...tsEslint.configs.strict,
  unusedImportsPluginConfig,
  ...importXPluginConfig,
  ...astroPluginConfig,
  prettier,
  {
    rules: {
      'no-console': 'warn',
      'no-undef': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
);
