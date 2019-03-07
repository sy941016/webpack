// 设置 entry 和 output 配置，并且在其中引入这两个环境公用的全部插件
const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');//单独打包css？？？


const devMode = process.env.NODE_ENV !== 'production'

//配置HtmlWebpackPlugin项
var getHtmlConfig = function (name, title) {
    return {
        template: 'src/view/' + name + '.html',
        filename: (devMode ? '' : '../') + name + '.html',
        title: title,
        inject: true,
        hash: true,
        minify: {
            removeComments: !devMode,    //移除HTML中的注释
            collapseWhitespace: !devMode    //删除空白符与换行符
        },
        // chunks: [name]
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
        path: path.resolve(__dirname, 'dist/static'),//所有输出文件的目标路径
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
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }, {
                    loader: "sass-loader"
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
        new HtmlWebpackPlugin(getHtmlConfig('index', '主页')),
        new HtmlWebpackPlugin(getHtmlConfig('a', 'a页面')),
        new HtmlWebpackPlugin(getHtmlConfig('b', 'b页面')),
        new HtmlWebpackPlugin(getHtmlConfig('c', 'c页面')),
        new webpack.HotModuleReplacementPlugin(),    //引入热更新插件
        new webpack.ProvidePlugin({
            //自动加载模块，而不必到处 import 或 require
            $: 'jquery',
            jQuery: 'jquery'
        })
    ]
};
