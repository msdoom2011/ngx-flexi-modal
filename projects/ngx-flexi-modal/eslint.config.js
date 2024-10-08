// @ts-check
const tseslint = require("typescript-eslint");
const rootConfig = require("../../eslint.config.js");

module.exports = tseslint.config(
  ...rootConfig,
  {
    files: ["**/*.ts"],
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "fm",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "fm",
          style: "kebab-case",
        },
      ],
      '@typescript-eslint/no-unused-expressions': [
        "error",
        {
          "allowTernary": true
        }
      ],
    },
  },
  {
    files: ["**/*.html"],
    rules: {},
  }
);
