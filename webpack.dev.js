//webpack-dev-server  localhost:8080默认，可自定义
//开发环境

const merge = require('webpack-merge');//使用webpack-merge区分生成环境和开发环境
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    //虚拟服务器
    devServer: {
        //使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
        historyApiFallback: {
            rewrites: [
                { from: '/paging/index_a', to: '/paging/index_a.html'},
                { from: '/paging/index_b', to: '/paging/index_b.html'},
                { from: '/paging/index_c', to: '/paging/index_c.html'},
            ]
        },
        contentBase: './dist',
        host:'localhost',   //服务器的ip地址
        port:1573,  //端口
        open:true,  //自动打开页面
        hot:true,   //开启热更新
    }
});
