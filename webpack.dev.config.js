var path = require('path');
var webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
 entry: './test/index.js',
 mode: 'development',
 target: ['web', 'es5'],
 output: {
   path: path.resolve(__dirname, 'build'),
   filename: 'app.bundle.js'
 },
 plugins: [new MiniCssExtractPlugin({
   filename: 'app.css'
 })],
 module: {
   rules: [
     { test: /\.js/, use: 'babel-loader' },
     {
       test: /\.css$/i,
       use: [{
         loader: MiniCssExtractPlugin.loader,
         options: {
           publicPath: path.join(__dirname, 'build'),
         },
       }, 'css-loader'],
       sideEffects: true,
     },
   ]
 },
 stats: {
     colors: true
 },
 devtool: 'source-map',
   devServer: {
    contentBase: path.join(__dirname, 'test/build'),
    compress: true,
    port: 9000,
    host: '0.0.0.0',
    disableHostCheck: true,
    historyApiFallback: true,
  },
};
