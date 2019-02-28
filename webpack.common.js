// 设置 entry 和 output 配置，并且在其中引入这两个环境公用的全部插件
const path = require('path');
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
        index: './src/js/index.js',
        index_a: './src/js/index.js',
        index_b: './src/js/index.js',
        index_c: './src/js/index.js'
    },
    //webpack 如何输出结果的相关选项
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '' // 输出解析文件的目录，url 相对于 HTML 页面
    },
    // 模块配置
    module: {
        rules: [
            {test: /.css$/, use: ['style-loader', 'css-loader']},
            {test: /.(jpg|png|gif|svg)$/, use: ['file-loader']},
            {test: /.less$/, use: ['style-loader', 'css-loader', 'less-loader']},
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
        new HtmlWebpackPlugin(getHtmlConfig('paging/index_c', 'index_c'))
    ]
};
