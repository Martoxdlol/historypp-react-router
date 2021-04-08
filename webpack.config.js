var path = require('path')
var webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
 entry: {
   "historypp-react-router": './src/historypp-react-router.js',
 },
 mode: 'production',
 target: ['web', 'es5'],
 output: {
   path: path.resolve(__dirname, 'dist'),
   filename: '[name].js',
   libraryTarget: 'umd',
 },
 plugins: [new MiniCssExtractPlugin({
   filename: 'app.css'
 })],
 externals: {
   'react': 'commonjs2 react',
   'react-dom': 'commonjs2 react-dom',
 },
 module: {
   rules: [
     { test: /\.js/, use: 'babel-loader' },
     {
       test: /\.css$/i,
       use: [{
         loader: MiniCssExtractPlugin.loader,
         options: {
           publicPath: path.join(__dirname, 'dist'),
         },
       }, 'css-loader'],
       sideEffects: true,
     },
   ]
 },
 stats: {
     colors: true
 },
}
