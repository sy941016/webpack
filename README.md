#### Webpack
##### 安装
   + npm init -y
   + npm install webpack webpack-cli -D

##### source map 追踪错误和警告  
devtool: 'inline-source-map'   --非生产环境  
devtool: 'source-map'          --生产环境

##### Loders
+ css  
npm install -D style-loader css-loader
+ 文件  
npm install -D file-loader
```
rules:[
   {
    test: /.(jpg|png|gif|svg)$/,
    use: {
        loader:'file-loader',
        options: {
            limit:1200,
            outputPath: 'img/',   //输出路径
            publicPath: '../img', //生产环境--输出路径
        }
    }
  }
]
```
+ 将es5 + 转译为 es5   
npm install -D babel-loader babel-core babel-preset-env webpack
+ html-withimg-loader(图片打包,路径处理,html的include功能)  
npm install html-withimg-loader
```
#include("./common/header.html")
```
```
rules:[
    {
       test: /\.html$/,
       use: ['html-withimg-loader']
    }
]
```
+ npm install -D vue-loder
```
rules:[
   {
    test: /\.vue$/,
    use: ['vue-loader']
   }
]

...

plugins: [
    new VueLoaderPlugin()
]
```

##### plugins插件
+ html-webpack-plugin(创建 HTML 文件，用于服务器访问)  
npm install -D html-webpack-plugin  
html--title :  <%= htmlWebpackPlugin.options.title%>
```
let getHtmlConfig = function (name,title) {
    return {
        template: '' + name + '.html', //本地模板位置
        filename: '' + name + '.html',  //输出模板
        inject: true,
        title:title,
        hash: true,
        minify: {
            removeComments: !devMode,    //移除HTML中的注释
            collapseWhitespace: !devMode    //删除空白符与换行符
        }
    }
};

...

plugins:[
   new HtmlWebpackPlugin(getHtmlConfig())
]
```
+ clean-webpack-plugin(清理 dist 文件夹)    
npm install clean-webpack-plugin --save-dev
+ ProvidePlugin  自动加载模块，而不必模块import或require
```
plugins:[
   new webpack.ProvidePlugin({
       identifier: 'module1'
   })
]
```
+ mini-css-extract-plugin(单独打包css)  
npm install mini-css-extract-plugin —D
```
plugins:[
   new MiniCssExtractPlugin({
       //解析文件名
       filename: '',     
       chunkFilename: '' //未被列在entry中的(如：异步加载的)
   })
]
```
+ 开启gzip压缩  
npm install compression-webpack-plugin -D
```
plugins: [new CompressionPlugin()]
```

###### 开发
+ webpack-dev-server  
提供了web 服务器  
npm install -D webpack-dev-server
```
devServer: {
    // 重定向
    historyApiFallback: {
        rewrites: [
            { from: '/indexA', to: '/indexB.html'}
        ]
    },
    contentBase: './dist', //打包路径
    host:'localhost',   //服务器的ip地址
    port:1573,  //端口
    open:true,  //自动打开页面
    hot:true,   //开启热更新
}
```

##### webpack-merge  
配置抽离  
npm install -D webpack-merge
```
let { smart } = require('webpack-merge');

smart(base,{
    mode: 'production'
})
```

##### code-splitting  
将代码打包生成多个bundle,实现按需加载或并行加载多个bundle.  
==减少首次访问白屏时间，上线必要的文件==
+ 多entry方式
```
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    page1: './src/page1.js',
    page2: './src/page2.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```
+ 公共提取
```
const path = require('path');

  module.exports = {
    mode: 'development',
    entry: {
     page1: './src/page1.js',
     page2: './src/page2.js'
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    // page1和page2都import了loadsh，配置optimization后，loadsh代码被单独提取到一个bundle，否则会生成两份
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    }
  };
```
##### Tree-shaking   
去除那些引用的但却没有使用的代码
+ uglifyjs-webpack-plugin
```
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')

module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new UglifyJSPlugin()
  ]
}
```
+ sideEffects
```
// package.json
{
    "sideEffects": false,
    //"sideEffect": ["./src/common/polyfill.js"]
}
```

********************
###### process.env.NODE_ENV
没有设置mode，process.env.NODE_ENV的默认值为'production'
###### loader 和 plugin 的区别  
loader单纯做编译的操作，plugin 是一个扩展器，webpack 的打包过程中，它并不直接操作文件，而是订阅 webpack 的声明周期，执行更广泛的操作
