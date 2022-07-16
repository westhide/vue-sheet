/// <reference types="vitest" />

import { defineConfig, splitVendorChunkPlugin } from "vite";
import { resolve } from "path";
import Vue from "@vitejs/plugin-vue";
import Layouts from "vite-plugin-vue-layouts";
import Pages from "vite-plugin-pages";
import VueJsx from "@vitejs/plugin-vue-jsx";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import AutoImport from "unplugin-auto-import/vite";
// import I18n from "@intlify/unplugin-vue-i18n/vite";
import Inspect from "vite-plugin-inspect";
import Compression from "vite-plugin-compression";
import { chunkSplitPlugin as ChunkSplit } from "vite-plugin-chunk-split";
import Imagemin from "vite-plugin-imagemin";
import Legacy from "@vitejs/plugin-legacy";

import Pkg from "./package.json";
import Banner from "vite-plugin-banner";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "~/": `${resolve(__dirname, "src")}/`,
    },
  },
  define: {
    // prune vitest code in production
    "import.meta.vitest": false,
  },
  plugins: [
    splitVendorChunkPlugin(),

    Vue({
      reactivityTransform: true,
    }),

    Layouts({ defaultLayout: "Default", exclude: ["./*/**.*"] }),
    Pages({
      extensions: ["vue", "tsx", "md"],
      exclude: ["**/components/*.{vue,tsx,md}"],
    }),

    VueJsx(),

    Components({
      dirs: ["src/components"],
      extensions: ["vue", "tsx"],
      deep: true,
      resolvers: [IconsResolver(), AntDesignVueResolver()],
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
    Icons({
      autoInstall: true,
    }),

    AutoImport({
      dirs: ["src/composables", "src/utils"],
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
      imports: [
        "vue",
        "vue/macros",
        "vue-router",
        "pinia",
        "@vueuse/core",
        "vue-i18n",
        "vitest",
        {
          "@vueuse/integrations/useNProgress": ["useNProgress"],
        },
        {
          "@vueuse/integrations/useChangeCase": ["useChangeCase"],
        },
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

    // I18n({
    //   include: resolve(__dirname, "src/locales/**"),
    // }),

    Inspect(),

    Compression(),

    ChunkSplit(),

    // image compression
    Imagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false,
      },
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        quality: 20,
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4,
      },
      svgo: {
        plugins: [
          {
            name: "removeViewBox",
          },
          {
            name: "removeEmptyAttrs",
            active: false,
          },
        ],
      },
    }),

    // TODO: [vite:build-html] Cannot destructure property 'renderBuiltUrl' of 'config.experimental' as it is undefined
    Legacy(),

    Banner(
      `/**\n * name: ${Pkg.name}\n * version: v${Pkg.version}\n * description: ${Pkg.description}\n * author: ${Pkg.author}\n * homepage: ${Pkg.homepage}\n */`
    ),
  ],
  // experimental: {},
  test: {
    include: [
      "**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "**/__tests__/**/*.{ts,tsx}",
    ],
    includeSource: ["src/**/*.{js,ts,tsx}"],
  },
});
