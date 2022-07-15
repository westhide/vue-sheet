module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  extends: [
    "plugin:vue/vue3-recommended",
    "plugin:@typescript-eslint/recommended",
    // "airbnb-base",
    "prettier",
    "plugin:prettier/recommended",
    "eslint-config-prettier",
  ],
  rules: {
    "@typescript-eslint/no-non-null-assertion": "off",
    "vue/multi-word-component-names": "off",
    "vue/no-setup-props-destructure": "off",
  },
};
