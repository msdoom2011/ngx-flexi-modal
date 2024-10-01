// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      'quotes': ['error', 'single'],
      'newline-after-var': 'error',
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: '*', next: 'block' },
        { blankLine: 'always', prev: 'block', next: '*' },
      ],
      '@typescript-eslint/array-type': [
        'error',
        {
          default: 'generic',
        }
      ],
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'fm',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'fm',
          style: 'kebab-case',
        },
      ],
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'angle-bracket',
        }
      ],
      '@typescript-eslint/no-inferrable-types': [
        'error',
        {
          ignoreParameters: true,
          ignoreProperties: false
        }
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/consistent-indexed-object-style': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  }
);
