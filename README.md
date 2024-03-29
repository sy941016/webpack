#### Webpack
##### 原理
1. 初始化：启动构建，读取与合并配置参数，加载 Plugin，实例化 Compiler
2. 编译：从 Entry 出发，针对每个 Module 调用对应的 Loader 去翻译文件的内容，再找到该 Module 依赖的 Module，递归地进行编译处理
3. 输出：将编译后的 Module 组合成 Chunk，将 Chunk 转换成文件，输出到文件系统中

```js
{
    mode, // 模式
    entry, // 入口
    output, // 输出
    module: {
      rules: [], // loader
    },
    plugins, // 插件
    resolve, // 解析模块的规则
    devServer, // 开发环境下配置
    optimization, // 生产环境下配置
    externals  // 指定代码中不用打包的模块
}
```

##### source map  
将编译、打包、压缩后的代码映射回源代码的过程  

##### Loders  
+ style-loader css-loader  sass-loader  
CSS
+  babel-loader  
将es5 + 转 es5   
+ thread-loader  
编译花费时间较长时使用(配置options的workers - 启动进程个数)
+ IMG
```
//图片<10kb时，将其转为base64放在js中（可以减少网络请求数） 
{
	test: /\.(png|jpe?g|gif|svg?)$/,
	type: 'asset',
	parser: {
		dataUrlCondition: {
			maxSize: 10 * 1024
		}
	},
	generator: {
		filename: 'img/[hash:10][ext][query]'
	}
}
```

##### plugins插件
###### HTML
+ html-webpack-plugin(创建 HTML 文件，用于服务器访问)  
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
###### CSS
+ mini-css-extract-plugin(将 CSS 提取到单独的文件中，为每个包含 CSS 的 JS 文件创建一个 CSS 文件，并支持 CSS 和 SourceMaps 的按需加载)  
```
plugins:[
   new MiniCssExtractPlugin({
       //解析文件名
       filename: '',     
       chunkFilename: '' //未被列在entry中的(异步加载)
   })
]
module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
},
```
+ css-minimizer-webpack-plugin(使用 cssnano 优化和压缩 CSS)
```
optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
    ],
}
```
###### JS
+ terser-webpack-plugin(在生产环境下会默认开启js压缩，使用TerserWebpackPlugin)
```
// 也可自定义配置
optimization: {
    minimizer: [
      new TerserPlugin({
        ...
      }),
    ],
}
```
###### OTHER
+ ProvidePlugin  自动加载模块
```
plugins:[
   new webpack.ProvidePlugin({
       identifier: 'module1'
   })
]
```
+ compression-webpack-plugin(开启gzip压缩)  
```
plugins: [new CompressionPlugin()]
```

+ webpack-dev-server  
提供了web 服务器  
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
环境配置抽离  
```
let { smart } = require('webpack-merge');

smart(base,{
    mode: 'production'
})
```
##### 优化
###### Code Splitting  
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
    // page1和page2都引用loadsh，配置optimization后，loadsh被单独提取到一个bundle，否则会生成两份
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
       // 未列在 entry 中，却又需被打包出来的文件名
       // 懒加载的代码
       chunkFilename: '[name].[chunkhash:5].chunk.js'
    }
}
```
###### Tree Shaking 
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
###### Scope Hoisting  
将所有模块的代码按照引用顺序放在一个函数作用域里，通过适当的重命名防止变量名冲突  
==减少函数声明代码和内存开销==
```
// production默认开启
module.exports = {
    ...
    plugins: [
    // 开启 Scope Hoisting 功能
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
}
```
###### DLL
dll（动态链接库）：使用dll对公共库进行提前打包，可大大提升构建速度。公共库一般情况下不会有改动，这些模块只需要编译一次即可，所以可提前打包好。在主程序后续构建时如果检测到该公共库已通过dll打包了，就不再对其编译而是直接从动态链接库中获取  
实现dll打包需要以下三步：  
1. 抽取公共库，打包到一个或多个动态链接库中
2. 将打包好的动态链接库在页面中引入
3. 主程序使用了动态链接库中的公共库时，直接去动态链接库中获取

```
// webpack.dll.js
module.exports = {
    entry: {
        // 把 vue 相关模块的放到一个单独的动态链接库
        vendor: ['vue', 'axios'],
        // 其他模块放到另一个动态链接库
        other: ['lodash'],
    },
    output: {
        // 输出的动态链接库名，[name] 代表当前动态链接库的名称（"vendor"和"other"）
        filename: '[name].dll.js',
        // 输出的文件到dist/dll下
        path: path.resolve(__dirname, 'dist', "dll"),
        // 动态链接库别名，例如 vendor => _dll_vendor
        library: '_dll_[name]',
    },
    plugins: [
        //  生成mainfest.json后缀文件。告诉webpack哪些库不参与后续的打包，已经通过dll事先打包好了
        new webpack.DllPlugin({
            // 动态链接库的库名，需和 output.library 中保持一致
            // 例如 vendor.manifest.json 中就有 "name": "_dll_vendor"
            name: '_dll_[name]',
            // manifest.json 文件输出时的文件名
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
        new webpack.DllReferencePlugin({
            // manifest文件告诉webpack哪些库已经通过dll事先打包好了，后续构建直接去动态链接库里获取
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
默认值为'production'
###### 2. loader 和 plugin 的区别  
+ Loader 本质就是一个函数，在该函数中对接收到的内容进行转换，返回转换后的结果。
因为 Webpack 只认识 JavaScript，所以 Loader 就成了翻译官，对其他类型的资源进行转译的预处理工作。
+ Plugin 是插件，==基于事件流框架 Tapable==，插件可以扩展 Webpack 的功能，在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果
+ Loader 在 module.rules 中配置，作为模块的解析规则，类型为数组。每一项都是一个 Object，内部包含了 test(类型文件)、loader、options (参数)等属性
+ Plugin 在 plugins 中单独配置，类型为数组，每一项是一个 compiler 实例(compilation)，参数通过构造函数传入

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
+ 插件需在其原型上绑定apply方法，才能访问 compiler 实例
+ 传给每个插件的 compiler 和 compilation对象是同一个引用，若在一个插件中修改它们的属性，会影响后续插件
+ 使用合适的生命周期钩子完成想要的功能,例如
   + emit: 输出 asset 到 output 目录之前执行(emit 事件是修改 Webpack 输出资源的最后时机)
   + watch-run: 在监听模式下，一个新的 compilation 触发之后，但在 compilation 实际开始之前执行 (当依赖的文件发生变化时会触发)
+ 异步事件需在插件处理完后调用回调函数通知 Webpack 进入下一个流程，不然会卡住
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
