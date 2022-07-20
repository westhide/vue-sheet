module.exports = {
  // TODO: prune after pr merge https://github.com/antfu/unplugin-auto-import/pull/235
  overrides: [
    {
      files: "src/utils/*.ts",
      options: {
        trailingComma: "none",
      },
    },
  ],
};
