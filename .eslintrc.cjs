/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution")

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-recommended",
    "eslint:recommended",
    "prettier/prettier",
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
};
