//使用webpack-merge区分生成环境和开发环境
//webpack-dev-server  localhost:8080默认，可自定义
//开发环境

const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    devServer: {//虚拟服务器
        contentBase: './dist'
    }
});
