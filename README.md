### Webpack
#### 原理
1. 初始化：启动构建，读取与合并配置参数，加载 Plugin，实例化 Compiler
2. 编译：从 Entry 出发，针对每个 Module 调用对应的 Loader 去翻译文件的内容，再找到该 Module 依赖的 Module，递归地进行编译处理
3. 输出：将编译后的 Module 组合成 Chunk，将 Chunk 转换成文件，输出到文件系统中

```
{
    mode,
    entry,
    output,
    rules,
    plugins,
    resolve, // 解析模块的规则
    devServer, // 开发环境下配置
    optimization, // 生产环境下配置
    externals  // 指定代码中不用打包的模块
}
```

#### 安装
   + npm init -y   
   + npm install webpack webpack-cli -D

##### source map  
将编译、打包、压缩后的代码映射回源代码的过程  

##### Loders  
将规则放在 ==oneOf== 属性中，则一旦匹配到某个规则后，就停止匹配了
```
{
    //  以下loader一种文件只会匹配一个 
    oneOf: [
        // 不能有两个配置处理同一种类型文件，如果有，另外一个规则要放到外面
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: "babel-loader",
                },
            ],
        },
        {
            test: /\.css$/,
            use: [
                "style-loader",
                "css-loader",
            ],
        },
    ],
}
```
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
+ cache-loader 缓存
+ thread-loader
```
// 编译花费时间较长时才需要使用 thread-loader
{
    loader: "thread-loader",
    options: {
        workers: 2, // 启动进程个数，默认是电脑cpu核数-1
    },
},
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

##### Code Splitting  
将代码打包生成多个bundle,实现按需加载或并行加载多个bundle  
==减少首次访问白屏时间，按需加载==  

```
module.exports = {
  mode: 'development',
  entry: {
    page1: './src/page1.js',
    page2: './src/page2.js'
  },
  output: {
    // 列在 entry 中，打包后输出的文件的名称
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
}
```
+ 公共提取
```
module.exports = {
    ...
    // page1和page2都import了loadsh，配置optimization后，loadsh代码被单独提取到一个bundle，否则会生成两份
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    },
}
```
+ 动态加载
```
module.exports = {
    output: {
       ...
       // 添加chundkFilename
       // 未列在 entry 中，却又需要被打包出来的文件的名称
       // 懒加载的代码
       chunkFilename: '[name].[chunkhash:5].chunk.js'
    }
}
```
##### Tree Shaking 
静态分析程序流，判断那些模块和变量未被使用或引用，然后删除对应代码  
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
// 强制标识该包模块无副作用，只要没有被引用，整个模块/包就会被完整移除
// package.json
{
    "sideEffects": false,
    //"sideEffect": ["./src/common/polyfill.js"]
}
```
##### Scope Hoisting  
将所有模块的代码按照引用顺序放在一个函数作用域里，然后适当的重命名一些变量防止变量名冲突  
==减少函数声明代码和内存开销==
```
// 设置 mode: 'production' 是默认开启的
module.exports = {
    ...
    plugins: [
    // 开启 Scope Hoisting 功能
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
}
```
##### DLL
dll（动态链接库）：使用dll技术对公共库进行提前打包，可大大提升构建速度。公共库一般情况下是不会有改动的，所以这些模块只需要编译一次就可以了，并且可以提前打包好。在主程序后续构建时如果检测到该公共库已经通过dll打包了，就不再对其编译而是直接从动态链接库中获取  
实现dll打包需要以下三步：  
1. 抽取公共库，打包到一个或多个动态链接库中。
2. 将打包好的动态链接库在页面中引入。
3. 主程序使用了动态链接库中的公共库时，不能被打包入bundle，应该直接去动态链接库中获取。

```
// webpack.dll.js
module.exports = {
    // JS 执行入口文件
    entry: {
        // 把 vue 相关模块的放到一个单独的动态链接库
        vendor: ['vue', 'axios'],
        // 其他模块放到另一个动态链接库
        other: ['jquery', 'lodash'],
    },
    output: {
        // 输出的动态链接库的文件名称，[name] 代表当前动态链接库的名称（"vendor"和"other"）
        filename: '[name].dll.js',
        // 输出的文件都放到 dist 目录下的dll文件夹中
        path: path.resolve(__dirname, 'dist', "dll"),
        // 存放动态链接库的向外暴露的变量名，例如对应 vendor 来说就是 _dll_vendor
        library: '_dll_[name]',
    },
    plugins: [
        //  打包生成一个mainfest.json文件。告诉webpack哪些库不参与后续的打包，已经通过dll事先打包好了。
        new webpack.DllPlugin({
            // 动态链接库的库名，需要和 output.library 中保持一致
            // 该字段的值也就是输出的 manifest.json 文件 中 name 字段的值
            // 例如 vendor.manifest.json 中就有 "name": "_dll_vendor"
            name: '_dll_[name]',
            // 描述动态链接库的 manifest.json 文件输出时的文件名称
            path: path.join(__dirname, 'dist', "dll", '[name].manifest.json'),
        }),
    ],
};
```
```
// webpack.config.js
module.exports = {
    mode: "production",
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html"
        }),
        // 告诉 Webpack 使用了哪些动态链接库
        new webpack.DllReferencePlugin({
            // manifest文件告诉webpack哪些库已经通过dll事先打包好了，后续构建直接去动态链接库里获取。
            manifest: path.resolve(__dirname, "dist", "./dll/vendor.manifest.json"),
        }),
        new webpack.DllReferencePlugin({
            manifest: path.resolve(__dirname, "dist", "./dll/other.manifest.json"),
        }),
    ],
}
```

********************
###### 1. process.env.NODE_ENV
process.env.NODE_ENV的默认值为'production'
###### 2. loader 和 plugin 的区别  
+ Loader 本质就是一个函数，在该函数中对接收到的内容进行转换，返回转换后的结果。
因为 Webpack 只认识 JavaScript，所以 Loader 就成了翻译官，对其他类型的资源进行转译的预处理工作。
+ Plugin 是插件，==基于事件流框架 Tapable==，插件可以扩展 Webpack 的功能，在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果
+ Loader 在 module.rules 中配置，作为模块的解析规则，类型为数组。每一项都是一个 Object，内部包含了 test(类型文件)、loader、options (参数)等属性
+ Plugin 在 plugins 中单独配置，类型为数组，每一项是一个 Plugin 的实例，参数都通过构造函数传入

###### 3. 如何写一个loader  
开发一个loader时，要尽量使它的职责单一
```
module.exports = function (source) {
    // Webpack5.0开始，不在需要使用工具获取option了
    // 获取到webpack.config.js中配置的options
    let options = this.getOptions();
    let result = source;
    // 默认单行和多行注释都删除
    const defaultOption = {
        oneLine: true,
        multiline: true,
    }
    options = Object.assign({}, defaultOption, options);
    if (options.oneLine) {
        // 去除单行注释
        result = result.replace(/\/\/.*/g, "")
    }
    if (options.multiline) {
        // 去除多行注释
        result = result.replace(/\/\*.*?\*\//g, "")
    }
    // loader必须要有输出，否则Webpack构建报错
    return result
}
```

###### 4. 如何写一个plugin
+ ==compiler== 暴露了和 Webpack 整个生命周期相关的钩子
+ ==compilation== 暴露了与模块和依赖有关的粒度更小的事件钩子
+ 插件需要在其原型上绑定apply方法，才能访问 compiler 实例
+ 传给每个插件的 compiler 和 compilation对象都是同一个引用，若在一个插件中修改了它们身上的属性，会影响后面的插件
+ 找出合适的事件点去完成想要的功能
   + emit 事件发生时，可以读取到最终输出的资源、代码块、模块及其依赖，并进行修改(emit 事件是修改 Webpack 输出资源的最后时机)
   + watch-run 当依赖的文件发生变化时会触发
+ 异步的事件需要在插件处理完任务时调用回调函数通知 Webpack 进入下一个流程，不然会卡住
```
const pluginName = 'sy';
module.exports = class sy {
    apply(compiler){
        compiler.hooks.run.tap(pluginName, compilation=>{
           console.log('webpack构建过程开始'); 
        });
    }
}
```
###### 5. HMR
1. WDS与浏览器之间维护了一个Websocket，当本地资源发生变化时，WDS 向浏览器推送更新，并带上构建时的hash，让客户端与上一次资源进行对比
2. 客户端对比出差异后会向 WDS 发起 Ajax 请求来获取更改内容
