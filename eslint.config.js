// eslint.config.js
import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
  {
    ignores: ['eslint.config.js', 'node_modules', 'dist'],
  },
  js.configs.recommended,
  prettierConfig,
  {
    languageOptions: {
        globals: globals.node,
        ecmaVersion: 2021,
        sourceType: 'commonjs',
    },
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'no-console': 'off',
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
];