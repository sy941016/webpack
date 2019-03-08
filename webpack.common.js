// 设置 entry 和 output 配置，并且在其中引入这两个环境公用的全部插件
const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');//清理dist
const HtmlWebpackPlugin = require('html-webpack-plugin');//创建html
const MiniCssExtractPlugin = require('mini-css-extract-plugin');//单独打包css

const devMode = process.env.NODE_ENV !== 'production'  //非生产环境标识

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
    //webpack开始打包
    entry: {
        index: './src/js/index.js'  //入口文件
    },
    //webpack输出结果的相关选项
    output: {
        filename: devMode ? 'js/[name].js' : 'js/[name].[hash].js',
        path: path.resolve(__dirname, 'dist/static'),//所有输出文件的目标路径
        publicPath: '' // 输出解析文件的目录
    },
    // 模块配置
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    // 'postcss-loader',
                    'sass-loader',
                ],
            },
            {test: /.(jpg|png|gif|svg)$/,
                use: {
                    loader:'file-loader',
                    options: {
                       limit:1200,
                        outputPath: 'img/',   //输出路径
                        publicPath: '../img', //生产环境--输出路径
                    }
                }
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
            //自动加载模块
            $: 'jquery',
            jQuery: 'jquery'
        }),
        //打包css
        new MiniCssExtractPlugin({
            filename: devMode ? 'css/[name].css' : 'css/[name].[hash].css',
            chunkFilename: devMode ? 'css/[name].css' : 'css/[name].[hash].css',
        })
    ]
};
