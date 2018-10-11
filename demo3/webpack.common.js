// 设置 entry 和 output 配置，并且在其中引入这两个环境公用的全部插件
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dev = false;
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
    entry: {
        index: './src/js/index.js',
        index_a: './src/js/index.js',
        index_b: './src/js/index.js',
        index_c: './src/js/index.js'
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin(getHtmlConfig('index', 'index')),
        new HtmlWebpackPlugin(getHtmlConfig('paging/index_a', 'index_a')),
        new HtmlWebpackPlugin(getHtmlConfig('paging/index_b', 'index_b')),
        new HtmlWebpackPlugin(getHtmlConfig('paging/index_c', 'index_c'))
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '' // 输出解析文件的目录，url 相对于 HTML 页面
    },
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
    }
};