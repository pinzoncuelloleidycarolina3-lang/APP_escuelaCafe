const js = require("@eslint/js");
const prettier = require("eslint-plugin-prettier");
const prettierConfig = require("eslint-config-prettier");

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        require: "readonly",
        module: "writable",
        process: "readonly",
        __dirname: "readonly",
        console: "readonly",
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": "warn",
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },
  prettierConfig,
];
