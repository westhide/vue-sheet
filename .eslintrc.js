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
    "plugin:@intlify/vue-i18n/recommended",
    // "airbnb-base",
    "prettier",
    "plugin:prettier/recommended",
    "eslint-config-prettier",
  ],
  rules: {
    "@typescript-eslint/no-non-null-assertion": "off",
    // TODO: prune after pr merge https://github.com/antfu/unplugin-auto-import/pull/235
    "comma-dangle": [
      "error",
      {
        arrays: "ignore",
        objects: "ignore",
        imports: "never",
        exports: "ignore",
        functions: "ignore",
      },
    ],
    "vue/multi-word-component-names": "off",
    "vue/no-setup-props-destructure": "off",
  },
  settings: {
    "vue-i18n": {
      localeDir: "src/locales/*.{json,json5,yaml,yml}",
      messageSyntaxVersion: "^9",
    },
  },
};
