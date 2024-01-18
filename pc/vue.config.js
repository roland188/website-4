const CompressionPlugin = require("compression-webpack-plugin");
const path = require("path");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const NYSEO = process.argv[3];
let templateCss = `@import "~@/assets/skin/_bgga.scss";`;
if (NYSEO === "--template=bet88") {
  templateCss = `@import "~@/assets/skin/_bet88.scss";`;
} else if (NYSEO === "--template=jun88") {
  templateCss = `@import "~@/assets/skin/_jun88.scss";`;
} else if (NYSEO === "--template=kubet") {
  templateCss = `@import "~@/assets/skin/_kubet.scss";`;
} else if (NYSEO === "--template=xoc88") {
  templateCss = `@import "~@/assets/skin/_xoc88.scss";`;
}
// console.log(NYSEO,"NYSEO",process.argv)
module.exports = {
  parallel: false,
  transpileDependencies: [],
  css: {
    extract: false,
    sourceMap: true,
    loaderOptions: {
      scss: {
        additionalData: templateCss,
      },
    },
  },
  chainWebpack: (config) => {
    config.optimization.minimizer("terser").tap((args) => {
      args[0].terserOptions.compress.drop_console = true;
      return args;
    });
    if (process.env.NODE_ENV !== "production") return;
    // config
    // .plugin('webpack-bundle-analyzer')
    // .use(BundleAnalyzerPlugin)
    config.optimization.minimize(true);
    config.optimization.splitChunks({
      chunks: "all",
    });
    config.optimization.splitChunks({
      //chunks————>决定要提取那些模块
      //默认async,  提取异步加载的模块【异步：通过import('xxx')或require(['xxx'],() =>{})加载的模块】
      //initial， 提取同步加载和异步加载模块，若xxx在项目组异步加载也同步加载了，那么会被提取两次，打包到不同文件中【同步：import xxx 或 require('xxx')加载的模块】
      //all,  不管异步加载还是同步加载的模块都提取出来，打包到一个文件中
      chunks: "initial",
      //minSize————>提取模块的最小值
      //30000为默认值，压缩前模块大小超过此字节大小的才会提取
      minSize: 30000,
      //maxSize————>提取文件最大值
      //0为默认，打包生成的文件最大值，超过即分割
      maxSize: 0, //不限制大小
      //minChunks————>最小提取次数
      //要提取的模块最少被引入的次数，未达到不提取
      minChunks: 2,
      //maxAsyncRequests————>最大异步加载次数，默认为6
      maxAsyncRequests: 6,
      //maxInitialRequests————>打包的入口文件加载时，还能同时加载的js文件数量(包括入口文件)
      maxInitialRequests: 4,

      //优先级：maxInitialRequests / maxAsyncRequests <maxSize<minSize。

      //automaticNameDelimiter————>打包生成的js文件名的分割符
      //automaticNameDelimiter:"~",//默认
      //name————>打包生成的js文件的名称

      /*
       * === cacheGroups ===
       * 配置提取模块的方案。除了以下特有选项，其它选项均与外面一致，有以自己为主，没有应用外部配置
       *
       * test。 匹配要提取的模块的资源路径或名称。值是正则或函数。
       *
       * priority。 方案的优先级，值越大表示提取模块时优先采用此方案。默认值为0
       *
       * reuseExistingChunk。 true/false。为true时，如果当前要提取的模块，在已经在打包生成的js文件中存在，则将重用该模块，而不是把当前要提取的模块打包生成新的js文件。
       *
       * enforce。 true/false。为true时，忽略minSize，minChunks，maxAsyncRequests和maxInitialRequests外面选项
       *
       */
      cacheGroups: {
        common: {
          //抽取所有入口页面都需要的公共chunk
          name: "chunk-common",
          chunks: "initial",
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0,
          priority: 1,
          reuseExistingChunk: true,
          enforce: true,
        },
        vendors: {
          name: `chunk-vendors`,
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: "initial",
        },
        icons: {
          minChunks: 1,
          name: "chunk-icons",
          priority: 4,
          test: /[\\/]src[\\/]style[\\/]font/,
        },
        vueUI: {
          name: `vueUI`,
          test: /[\\/]node_modules[\\/]vue[\\/]/,
          priority: 4,
          chunks: "all",
          reuseExistingChunk: true,
          enforce: true,
        },
        element: {
          name: "elementUI",
          test: /[\\/]node_modules[\\/]element-ui[\\/]/,
          chunks: "all",
          priority: 3,
          reuseExistingChunk: true,
          enforce: true,
        },
      },
    });
  },
  configureWebpack: (config) => {
    config.entry.app = ["babel-polyfill", "./src/main.js"];
    if (process.env.NODE_ENV === "production") {
      return {
        plugins: [
          new CompressionPlugin({
            test: /\.js$|\.html$|\.css$|\.jpg$|\.jpeg$|\.png/, // 需要压缩的文件类型
            threshold: 10240, // 归档需要进行压缩的文件大小最小值，我这个是10K以上的进行压缩
            deleteOriginalAssets: false, // 是否删除原文件
          }),
        ],
      };
    }
  },
};
