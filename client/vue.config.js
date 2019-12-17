const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');

module.exports = {
  "configureWebpack": {
    "devServer": {
      "historyApiFallback": true
    },
    "plugins": [
      new BundleAnalyzerPlugin(),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],
  },
  "transpileDependencies": [
    "vuetify"
  ]
}