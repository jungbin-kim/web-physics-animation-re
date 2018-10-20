const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
   mode: 'development',
   devtool: 'eval-source-map',
   devServer: {
       host: "0.0.0.0",
       port: 8887,
       headers: {'Access-Control-Allow-Origin': '*'},
   }
});