//webpack-dev-server  localhost:8080默认，可自定义
//开发环境

const merge = require('webpack-merge');//使用webpack-merge区分生成环境和开发环境
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    devServer: {//虚拟服务器
        contentBase: './dist',
        host:'localhost',   //服务器的ip地址
        port:1573,  //端口
        open:true,  //自动打开页面，
        hot:true,   //开启热更新
    }
});
