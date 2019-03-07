//webpack-dev-server  localhost:8080默认，可自定义
//开发环境

const merge = require('webpack-merge');//使用webpack-merge区分生成环境和开发环境
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    //虚拟服务器
    devServer: {
        //使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为index.html
        historyApiFallback: {
            rewrites: [
                { from: '/a', to: '/a.html'},
                { from: '/b', to: '/b.html'},
                { from: '/c', to: '/c.html'},
            ]
        },
        contentBase: './dist',//内容路径
        host:'localhost',   //服务器的ip地址
        port:3002,  //端口
        open:true,  //自动打开页面
        hot:true,   //开启热更新
    }
});
