// 为此环境添加了推荐的 devtool（强大的 source map）和简单的 devServer

const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    devServer: {//虚拟服务器
        contentBase: './dist'
    }
});