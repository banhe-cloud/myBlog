const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
const HappyPack = require('happypack');
module.exports = merge(common, {
  mode: "production",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        include: path.resolve(__dirname, "src"),
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        include: path.resolve(__dirname, "src"),
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[hash].css",
      chunkFilename: "css/[name].[hash].css",
    }),
  ],
//   optimization: {
//       splitChunks: {
//           cacheGroups: {
//               commonjs: {
//                   chunks: 'initial',
//                   minChunks: 2,
//                   maxInitialRequests: 5,
//                   minSize: 0
//               },
//               vendor: {
//                   test: /node_modules/,
//                   chunks: 'initial',
//                   name: 'vendor',
//                   priority: 10,
//                   enforce: true
//               }
//           }
//       },
//       runtimeChunk: true
//   },
});
