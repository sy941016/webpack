// 设置 entry 和 output 配置，并且在其中引入这两个环境公用的全部插件
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

var getHtmlConfig = function (name, title) {
    return {
        template: 'src/' + name + '.html',
        filename: '' + name + '.html',
        title: title,
        inject: true,
        hash: true,
        chunks: [name]
    }
};


module.exports = {
    entry: {
        index: './src/js/index.js'
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin(getHtmlConfig('index', 'demo3'))
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {test: /.css$/, use: ['style-loader', 'css-loader']},
            {test: /.(jpg|png|gif|svg)$/, use: ['url-loader?limit=8192&name=./[name].[ext]']},
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