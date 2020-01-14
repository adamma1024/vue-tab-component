var path = require('path')
var utils = require('./utils')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
const VueLoaderPlugin = require('vue-loader/lib/plugin')


var webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  module: {
    rules: utils.styleLoaders({
      sourceMap: true
    })
  },
  devtool:'source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '',
    filename: 'vue-tabs.min.js',
    library: 'vueTabs',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  optimization:{
    minimize: true
  },
  plugins: [
    new VueLoaderPlugin()
  ]
})

module.exports = webpackConfig
