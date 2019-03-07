// 设置 entry 和 output 配置，并且在其中引入这两个环境公用的全部插件
const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

//配置HtmlWebpackPlugin项
var getHtmlConfig = function (name, title) {
    return {
        template: 'src/view/' + name + '.html',
        filename: '' + name + '.html',
        title: title,
        inject: true,
        hash: true,
        chunks: [name]
    }
};

module.exports = {
    //这里应用程序开始执行,webpack 开始打包
    entry: {
        index: './src/js/index.js'  //入口文件
    },
    //webpack 如何输出结果的相关选项
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),//所有输出文件的目标路径
        publicPath: '' // 输出解析文件的目录
    },
    // 模块配置
    module: {
        rules: [
            {test: /.css$/, use: ['style-loader', 'css-loader']},
            {test: /.(jpg|png|gif|svg)$/, use: ['file-loader']},
            {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader" //将 JS 字符串生成为 style 节点
                }, {
                    loader: "css-loader" //将 CSS 转化成 CommonJS 模块
                }, {
                    loader: "sass-loader" //将 Sass 编译成 CSS
                }]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    //附加插件列表
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin(getHtmlConfig('index', 'index')),
        new HtmlWebpackPlugin(getHtmlConfig('paging/index_a', 'index_a')),
        new HtmlWebpackPlugin(getHtmlConfig('paging/index_b', 'index_b')),
        new HtmlWebpackPlugin(getHtmlConfig('paging/index_c', 'index_c')),
        new webpack.HotModuleReplacementPlugin(),    //引入热更新插件
        new webpack.ProvidePlugin({
           //自动加载模块，而不必到处 import 或 require
        })
    ]
};
