const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require("webpack");
const path = require("path");
const HappyPack = require("happypack");
module.exports = merge(common, {
  mode: "development",
  //   devtool: "inline-source-map",
  resolve: {},

  module: {
    rules: [
      {
        test: /\.scss$/,
        // use: ["style-loader", "css-loader", "sass-loader"],
        use: "happypack/loader?id=scss",
        include: path.resolve(__dirname, "src"),
      },
      {
        test: /\.css$/,
        //   use: ["style-loader", "css-loader"]
        use: "happypack/loader?id=css",
        include: path.resolve(__dirname, "src"),
      },
      {
        test: /\.js?$/,
        use: ["happypack/loader?id=jsx"],
        // use: {
        //   loader: "babel-loader",
        //   options: {
        //     presets: ["@babel/react", "@babel/preset-env"],
        //   },
        // },
        include: path.resolve(__dirname, "src"),
      },
    ],
  },
  devServer: {

    proxy: {
      "/api": {
        target: "https://banhe-cloud.vip",
        // target: "http://m.ys7.com",
        secure: false,
        changeOrigin: true,
        pathRewrite: { "^/api": "" },
      },
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HappyPack({
      id: "css", //
      use: ["style-loader", "css-loader"],
    }),
    new HappyPack({
      id: "scss", //
      use: ["style-loader", "css-loader", "sass-loader"],
    }),

    new HappyPack({
      id: "jsx", //
      use: [
        {
          //use是一个数组，这里写原先在rules的use里的loader配置
          loader: "babel-loader",
          options: {
            presets: ["@babel/react", "@babel/env"],
          },
        },
        {
          loader: "eslint-loader",
          options: {
            // 这里的配置项参数将会被传递到 eslint 的 CLIEngine
            formatter: require("eslint-friendly-formatter"), // 指定错误报告的格式规范
          },
        },
      ],
    }),
  ],
});
