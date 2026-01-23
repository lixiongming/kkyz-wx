import path from "path";
import fs from "fs-extra";
import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

import h5ProdEffectPlugin from "uni-vite-plugin-h5-prod-effect";

import { plugins as postcssPlugins } from "./postcss.config.ts";

// import uniReadPagesV3Plugin from "./infrastructure/utils/uni-read-pages-v3.ts";

// import uniHot from "uni-pages-hot-modules";

// import { replacePreprocess } from "./common.js";

// 安装条件编译命令，安装之后，uniapp就会支持exec hotJs的条件编译
// uniHot.setupHotJs();

// replacePreprocess();

// const pages = require("./pages.js");

export default defineConfig({
  root: __dirname,
  // base:'./',
  plugins: [
    uni(),
    h5ProdEffectPlugin(),
    // uniHot.createHotVitePlugin(),
    // uniReadPagesV3Plugin({
    //   pagesJson: pages,
    //   includes: ["path", "aliasPath", "name", "meta"],
    // }),
  ],
  build: {
    //发布时删除 console
    // minify: 'terser',
    // terserOptions: {
    // 	compress: {
    // 		drop_console: true,
    // 	},
    // },
  },
  // server: {
  //   port: 20000,
  //   disableHostCheck: true,
  //   proxy: {
  //     "/api": {
  //       target: "https://meta-api.mdd3.cn",
  //       changeOrigin: true,
  //       secure: false,
  //       ws: false,
  //     },
  //     "/uploadfile": {
  //       target: "https://metacdn.mdd3.cn",
  //       changeOrigin: true,
  //       secure: false,
  //       ws: false,
  //     },
  //   },
  // },
  css: {
    postcss: {
      // plugins: postcssPlugins,
    },
  },
});


