module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // TODO: cssnano uninstall
    // ...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {}),
  },
};
