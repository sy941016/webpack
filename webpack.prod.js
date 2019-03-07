//发布环境
//流程 生成dist 配置node启动dist

const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
process.env.NODE_ENV = 'production'
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devtool: 'source-map',
    plugins: [
        new UglifyJSPlugin({
            sourceMap: true
        }),
        new webpack.DefinePlugin({//代码优化，减少体积
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ]
});
