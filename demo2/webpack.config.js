const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');//替换html
const CleanWebpackPlugin = require('clean-webpack-plugin');//清理dist中无用文件
const webpack = require('webpack');

module.exports = {
    entry: {
        app: './src/index.js',
        // print: './src/print.js'
    },
    devtool: 'inline-source-map',//编译后的代码映射回原始源代码，找错
    devServer: {
        contentBase: './dist',//webpack-dev-server
        hot: true
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'Output Management'
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'//publicPath 会在服务器脚本用到，以确保文件资源能够在 http://localhost:3000 下正确访问
    },
    mode: "production"
};