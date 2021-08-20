const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const  AddAssetWebpackHtmlPlugin = require("add-asset-html-webpack-plugin")
const webpack = require("webpack");
const HappyPack = require('happypack');
module.exports = {
  entry: ['react-hot-loader/patch',"babel-polyfill", "./src/index.js"],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif)$/,
        // use: ["file-loader"],
        use: ['happypack/loader?id=image'],
        include: path.resolve(__dirname, 'src'),
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        // use: ["file-loader"],
        use: ['happypack/loader?id=image'],
        include: path.resolve(__dirname, 'src'),
      },
      

    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "public/index.html",
      filename: "index.html",
    }),

    new HappyPack({
        // id 标识符，要和 rules 中指定的 id 对应起来
        id: 'babel',
        // 需要使用的 loader，用法和 rules 中 Loader 配置一样
        // 可以直接是字符串，也可以是对象形式
        loaders: ['babel-loader?cacheDirectory']
    }),


    
   

    // new webpack.DllReferencePlugin({
    //     context: __dirname,
    //     manifest: require('./dll/react.manifest.json')
    // }),
    // // 将某个文件打包出去，并在html中自动引入该资源
    // new AddAssetWebpackHtmlPlugin({
    //     filepath:path.join(__dirname,'dll/react.dll.js')
    // })


     /****   使用HappyPack实例化    *****/
     new HappyPack({
        // 用唯一的标识符id来代表当前的HappyPack 处理一类特定的文件
        id: 'babel',
        // 如何处理.js文件，用法和Loader配置是一样的
        loaders: ['babel-loader']
      }),
      new HappyPack({
        id: 'image',
        loaders:["file-loader"]
      }),
  ],

};
