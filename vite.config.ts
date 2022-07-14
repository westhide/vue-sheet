import { defineConfig } from "vite";
import { resolve } from "path";
import Vue from "@vitejs/plugin-vue";
import VueJsx from "@vitejs/plugin-vue-jsx";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import AutoImport from "unplugin-auto-import/vite";
import Inspect from "vite-plugin-inspect";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "~/": `${resolve(__dirname, "src")}/`,
    },
  },
  plugins: [
    Vue({
      reactivityTransform: true,
    }),

    VueJsx(),

    Components({
      dirs: ["src/components"],
      extensions: ["vue", "tsx"],
      deep: true,
      resolvers: [AntDesignVueResolver()],
      dts: "src/components.d.ts",
      directoryAsNamespace: false,
      globalNamespaces: [],
      directives: true,
      // importPathTransform: (v) => v,
      allowOverrides: false,
      include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/],
      exclude: [
        /[\\/]node_modules[\\/]/,
        /[\\/]\.git[\\/]/,
        /[\\/]\.nuxt[\\/]/,
      ],
    }),

    AutoImport({
      dirs: ["src/composable", "src/utils"],
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
      imports: [
        "vue",
        "vue/macros",
        {
          lodash: [
            "cloneDeep",
            "defaultsDeep",
            "isEmpty",
            ["remove", "arrayRemove"],
            ["pull", "arrayPull"],
          ],
        },
        {
          nanoid: ["nanoid"],
        },
      ],
      dts: "src/auto-imports.d.ts",
    }),

    Inspect(),
  ],
});
