---
title: '学习webpack4.0'
date: 2020-10-24
tags:
- '学习笔记'
- '模块化'
- 'webpack'
categories:
- '模块化'
---

学习模块化的webpack4.0工具笔记

<!-- more -->

### 需求

- 新特性代码编译
- 模块化 JavaScript 打包
- 支持不同类型资源模块

### 使用方式

```js
yarn add webpack webpack-cli --dev

yarn webpack
```

### 简单使用

```js
// webpack.config.js
const path = require('path')
module.exports = {
  entry:"./src/main.js",//知道webpack打包入口路径
  output:{
    filename:"bundle.js",//输出文件名
    path:path.join(__dirname,'output'),//输出文件目录(要求绝对路径)
  }
}
```


工作模式:
- development
> 优化打包速度,增加调试需要的代码
- production
> 会自动压缩代码
- none
> 最原始状态打包 不做处理

可以在配置文件中设置

```js
// webpack.config.js
const path = require('path')
module.exports = {
  mode:"development",//打包模式
  entry:"./src/main.js",//知道webpack打包入口路径
  output:{
    filename:"bundle.js",//输出文件名
    path:path.join(__dirname,'output'),//输出文件目录(要求绝对路径)
  }
}
```

### 打包css

安装loader(加载器)
```js
yarn add css-loader --dev
yarn add style-loader --dev
```

```js
const path = require('path')
module.exports = {
  entry:"./src/main.css",//知道webpack打包入口路径
  output:{
    filename:"bundle.js",//输出文件名
    path:path.join(__dirname,'output'),//输出文件目录(要求绝对路径)
  },
  module:{
    rules:[
      {
        test:/.css$/,//正则表达式,用来匹配文件路径
        use:[
          'style-loader',//通过style-loader将css-loader转换为style注入
          'css-loader',
        ],//loader使用路径,从后向前执行
      }
    ]
  }
}
```

但是上述写法 entry 入口是css文件,正确做法还是通过js文件,在js文件中 import css文件

webpack希望我们在js中引入所有代码需要的资源

**JavaScript驱动整个前端应用**

- 逻辑合理,JS确实需要这些资源文件
- 确保上线资源不丢失,都是必要的

### 加载 静态资源

```js
const path = require('path')
module.exports = {
  entry:"./src/main.css",//知道webpack打包入口路径
  output:{
    filename:"bundle.js",//输出文件名
    path:path.join(__dirname,'output'),//输出文件目录(要求绝对路径)
    publicPath:'dist/',//打包后根目录文件夹
  },
  module:{
    rules:[
      {
        test:/.css$/,//正则表达式,用来匹配文件路径
        use:[
          'style-loader',//通过style-loader将css-loader转换为style注入
          'css-loader',
        ],//loader使用路径,从后向前执行
      },
      {
        test:/.png$/,
        use:'file-loader'
      }
    ]
  }
}
```

### 关于 dataUrl

可以将png,字体文件等转换为base64编码

```js
const path = require('path')
module.exports = {
  entry:"./src/main.css",//知道webpack打包入口路径
  output:{
    filename:"bundle.js",//输出文件名
    path:path.join(__dirname,'output'),//输出文件目录(要求绝对路径)
    publicPath:'dist/',//打包后根目录文件夹
  },
  module:{
    rules:[
      {
        test:/.png$/,
        use:{
          loader:'url-loader',
          options:{ //配置项
            limit:10 * 1024,//10kb以下文件转换为 dataurl,其他自动转换为file-loader形式
          }
        }
      },
    ]
  }
}
```


### 常用加载器类型

- 编译转换类(css-loader)
- 文件操作类型加载器(file-loader)
- 代码检查类(eslint-loader)

### webpack 与 ES6

**babel-loader**

通过babel-loader去转换es6的语法

需要依赖:
- babel-loader
- @babel/preset-env
```js
const path = require('path')
module.exports = {
  entry:"./src/main.css",//知道webpack打包入口路径
  output:{
    filename:"bundle.js",//输出文件名
    path:path.join(__dirname,'output'),//输出文件目录(要求绝对路径)
    publicPath:'dist/',//打包后根目录文件夹
  },
  module:{
    rules:[
      {
        test:/.js$/,
        use:{
          loader:'babel-loader',
          options:{
            presets:['@babel/preset-env']
          }
        }
      },
    ]
  }
}
```


### 打包html文件

```js
const path = require('path')
module.exports = {
  entry:"./src/main.css",//知道webpack打包入口路径
  output:{
    filename:"bundle.js",//输出文件名
    path:path.join(__dirname,'output'),//输出文件目录(要求绝对路径)
    publicPath:'dist/',//打包后根目录文件夹
  },
  module:{
    rules:[
      {
        test:/.html$/,
        use:{
          loader:'html-loader',
          options:{
            attrs:['img:src','a:href'],//针对a标签中静态资源打包处理
          }
        }
      }
    ]
  }
}
```


### 手写一个loader加载器

手写一个 markdown-loader

```js
// webpack.config.js
const path = require('path')
module.exports = {
  entry:"./src/main.css",//知道webpack打包入口路径
  output:{
    filename:"bundle.js",//输出文件名
    path:path.join(__dirname,'output'),//输出文件目录(要求绝对路径)
    publicPath:'dist/',//打包后根目录文件夹
  },
  module:{
    rules:[
      {
        test:/.md$/,
        use:{
          loader:[
            'html-loader',
            './markdown-loader',//相对路径
          ]
        }
      }
    ]
  }
}
```
```js
// markdown-loader.js
const marked = require('marked');//引入marked,处理markdown代码

module.exports = source => {
  // console.log(source);
  // return 'console.log("hello ~")';//返回的一定要是一段JavaScript代码

  const html = marked(source);
  // return `module.exports = ${JSON.stringify(html)}` //通过json转义为字符串,用来保证不会出现问题
  // return `export default = ${JSON.stringify(html)}`

  // 返回html字符串交给下一个loader处理
  return html
}
```

### webpack 插件

- 自动清除输出目录的插件
> 使用 clean-webpack-plugin
```js
const path = require('path')
const {cleanWebpackPlugin} = require('clean-webpack-plugin')
module.exports = {
  entry:"./src/main.css",//知道webpack打包入口路径
  output:{
    filename:"bundle.js",//输出文件名
    path:path.join(__dirname,'output'),//输出文件目录(要求绝对路径)
    publicPath:'dist/',//打包后根目录文件夹
  },
  plugins:[
    new cleanWebpackPlugin(),
  ]
}
```

- 通过 webpack 输出 html 文件
> 使用 html-webpack-plugin
```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry:"./src/main.css",//知道webpack打包入口路径
  output:{
    filename:"bundle.js",//输出文件名
    path:path.join(__dirname,'output'),//输出文件目录(要求绝对路径)
    // publicPath:'dist/',//打包后根目录文件夹 //因为html也通过插件生成 所以不需要再通过这个属性配置
  },
  plugins:[
    // 生成index.html
    new HtmlWebpackPlugin({ //对html文件配置
      title:'webpack Plugin Sample',
      meta:{
        viewport:'width=device-width'
      },
      template:'./src/index.html',//指定模板文件渲染index
    }),
    // 用于生成about.html
    new HtmlWebpackPlugin({
      filename:'about.html'
    })
  ]
}
```

- 通过 webpack 拷贝 静态资源文件(public)
> 使用 copy-webpack-plugin

```js
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
module.exports = {
  entry:"./src/main.css",//知道webpack打包入口路径
  output:{
    filename:"bundle.js",//输出文件名
    path:path.join(__dirname,'output'),//输出文件目录(要求绝对路径)
    publicPath:'dist/',//打包后根目录文件夹
  },
  plugins:[
    new CopyWebpackPlugin([
      'public',//将public下所有文件输出到dist目录
    ])
  ]
}
```

### 开发一个插件

Plugin 通过钩子机制实现

webpack在打包的每个环节都加上了钩子函数,所以可以通过插件形式,执行任务

webpack对插件要求:
- 一个函数或者是一个包含 apply 方法的对象

```js
class Myplugin{
  apply(compiler){
    console.log('Myplugin 启动');

    // 第一个参数是方法名称
    compiler.hook.emit.tap('Myplugin',compilation=>{
      // compilation => 可以理解为此次打包的上下文
      // compilation.assets 资源文件对象
      for (const name in compilation.assets){
        // console.log(name) //资源文件名称
        // console.log(compilation.assets[name].source());//获取资源文件内容
        if(name.endsWith('.js')){//判断是否以 .js 为结尾
          const contents = compilation.assets[name].source();
          const withoutComments = contents.replace(/\/\*\*+\*\//g,'')
          compilation.assets.name = {
            source: () => withoutComments,
            size:() => withoutComments.length
          }
        }
      }
    })
  }
}
```

### webpack watch 模式

方法 1:
- 可以直接在保存后运行 webpack 
```js
// 命令
yarn webpack --watch
```
- 通过 browser-sync 插件将文件变化后热更新直接渲染到浏览器
```js
browser-sync dist --files "**/*"
```
方法 2:

**Webpack Dev Server**

安装插件后,可以直接 yarn webpack-dev-server

打包后不会直接输出到磁盘当中,会放在内存当中,减少磁盘读写速度


```js
module.exports = {
  entry:"./src/main.css",//知道webpack打包入口路径
  output:{
    filename:"bundle.js",//输出文件名
    path:path.join(__dirname,'output'),//输出文件目录(要求绝对路径)
    publicPath:'dist/',//打包后根目录文件夹
  },
  // Webpack Dev Serve 配置选项
  devServer:{
    contentBase:['./public'],//静态资源路径
    proxy:{//代理配置
      '/api':{//什么开头的地址配置到 xx地址
        // http://loaclhost:8080/api/users => https://api.github.com/api/users
        target:'https://api.github.com',
        pathRewite:{
          // http://loaclhost:8080/api/users => https://api.github.com/users
          '^/api':''
        },
        // 不能使用 localhost:8080 作为请求 github 的主机名
        changeOrigin:true,
      }
    }
  },
}
```

### webpack 配置 source Map

```js
module.exports = {
  entry:"./src/main.css",//知道webpack打包入口路径
  output:{
    filename:"bundle.js",//输出文件名
    path:path.join(__dirname,'output'),//输出文件目录(要求绝对路径)
    publicPath:'dist/',//打包后根目录文件夹
  },
  devtool:'source-map',
}
```

### webpack HMR

对热更新刷新页面的另一种选择,刷新页面会导致状态消失,所以采用HMR保留状态.

- 开启HMR

继承在 webpack-dev-server 当中

```js
const webpack = require('webpack')
const path = require('path')
module.exports = {
  entry:"./src/main.css",//知道webpack打包入口路径
  output:{
    filename:"bundle.js",//输出文件名
    path:path.join(__dirname,'output'),//输出文件目录(要求绝对路径)
    publicPath:'dist/',//打包后根目录文件夹
  },
  devtool:'source-map',
  // Webpack Dev Serve 配置选项
  devServer:{
    hot:true,//开启 HMR
  },
  plugins:[
    new webpack.HotModuleReplacementPlugin(),//开启HMR需要的插件
  ]
}
```

但是js更新还是会刷新页面,需要手动处理

### webpack tree shaking

删除无用代码

> 会在生产模式自动开启

在开发环境配置
```js
module.exports = {
  entry:"./src/main.css",//知道webpack打包入口路径
  output:{
    filename:"bundle.js",//输出文件名
    path:path.join(__dirname,'output'),//输出文件目录(要求绝对路径)
    publicPath:'dist/',//打包后根目录文件夹
  },
  optimization:{ //代码压缩功能配置
    usedExports:true,//只导出外部使用了的成员
    minimize:true,//压缩代码,删除未引用代码
    concarenateModules:true,//合并模块代码
    sideEffects:true,//没有用到的模块是否有副作用 是否可以清除
  }
}
```
- usedExports 理解为标记枯树枝
- minimize 摇动大树,使其掉落

- concarenateModules 尽可能将所有的模块输出到一个函数中
> 也被称作为 scope Hoisting
- sideEffects 没有用到的模块是否有副作用 是否可以清除
> 引入css就算是副作用的一种,光引入,没使用

### webpack 代码分割

- 多入口打包
> 1. 在 entry 中配置多入口文件
```js
module.exports = {
  entry:{
    index:"./src/index.js",
    about:"./src/about.js"
  },
  output:'[name].bundle.js'
}
```
> 2. 在HtmlWebpackPlugin配置中配置相应的js文件
```js
module.exports = {
  plugins:[
    // 生成index.html
    new HtmlWebpackPlugin({ //对html文件配置
      title:'webpack Plugin Sample',
      meta:{
        viewport:'width=device-width'
      },
      template:'./src/index.html',//指定模板文件渲染index
      chunks:['index']
    }),
    new HtmlWebpackPlugin({ //对html文件配置
      title:'webpack Plugin Sample',
      meta:{
        viewport:'width=device-width'
      },
      template:'./src/about.html',//指定模板文件渲染index
      chunks:['about']
    }),
  ]
}
```
> 3. 上述操作会将公共模块打包两遍,所以还需要抽离公共模块
```js
module.exports = {
  optimization:{
    splitChunks:{
      chunks:'all',//将所有公共模块打包
    }
  }
}
```
- 动态导入

只需要操作 ESM 动态导入,webpack会自动操作分包处理
如
```js
if(xx == 'xx'){
  import ('../xx').then(({default:xx})=>{
    xxx
  })
}
```

### webpack css 按需加载

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
  entry:"./src/main.css",//知道webpack打包入口路径
  output:{
    filename:"bundle.js",//输出文件名
    path:path.join(__dirname,'output'),//输出文件目录(要求绝对路径)
    publicPath:'dist/',//打包后根目录文件夹
  },
  plugins:[
    new MiniCssExtractPlugin(),//使用这个就不需要使用style-loader,会将css生成.css文件,但是生成的.css文件未被压缩
    new OptimizeCssAssetsWebpackPlugin(),//压缩生成的.css文件,可以将他写到  optimization/minizer 数组下
  ],
  optimization:{
    minimize:[
      new OptimizeCssAssetsWebpackPlugin(),//这样只有打包的时候有效,但是js压缩插件会失效,所以还需要写js压缩
      new TerserWebpackPlugin(),//开启js压缩
    ]
  }
}
```


### 完整demo

```js
const webpack = require('webpack')
const path = require('path')
const {cleanWebpackPlugin} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
// 删除 build.js 内的注释
class Myplugin{
  apply(compiler){
    console.log('Myplugin 启动');

    // 第一个参数是方法名称
    compiler.hook.emit.tap('Myplugin',compilation=>{
      // compilation => 可以理解为此次打包的上下文
      // compilation.assets 资源文件对象
      for (const name in compilation.assets){
        // console.log(name) //资源文件名称
        // console.log(compilation.assets[name].source());//获取资源文件内容
        if(name.endsWith('.js')){//判断是否以 .js 为结尾
          const contents = compilation.assets[name].source();
          const withoutComments = contents.replace(/\/\*\*+\*\//g,'')
          compilation.assets.name = {
            source: () => withoutComments,
            size:() => withoutComments.length
          }
        }
      }
    })
  }
}

module.exports = {
  entry:"./src/main.css",//知道webpack打包入口路径
  output:{
    filename:"bundle.js",//输出文件名
    path:path.join(__dirname,'output'),//输出文件目录(要求绝对路径)
    publicPath:'dist/',//打包后根目录文件夹
  },
  devtool:'source-map',
  // Webpack Dev Serve 配置选项
  devServer:{
    hot:true,//开启 HMR
    contentBase:['./public'],//静态资源路径
    proxy:{//代理配置
      '/api':{//什么开头的地址配置到 xx地址
        // http://loaclhost:8080/api/users => https://api.github.com/api/users
        target:'https://api.github.com',
        pathRewite:{
          // http://loaclhost:8080/api/users => https://api.github.com/users
          '^/api':''
        },
        // 不能使用 localhost:8080 作为请求 github 的主机名
        changeOrigin:true,
      }
    }
  },
  module:{
    rules:[
      {
        test:/.js$/,
        use:{
          loader:'babel-loader',
          options:{
            presets:['@babel/preset-env']
          }
        }
      },
      {
        test:/.css$/,//正则表达式,用来匹配文件路径
        use:[
          'style-loader',//通过style-loader将css-loader转换为style注入
          'css-loader',
        ],//loader使用路径,从后向前执行
      },
      {
        test:/.png$/,
        use:'file-loader'
      },
      {
        test:/.png$/,
        use:{
          loader:'url-loader',
          options:{ //配置项
            limit:10 * 1024,//10kb以下文件转换为 dataurl,其他自动转换为file-loader形式
          }
        }
      },
      {
        test:/.html$/,
        use:{
          loader:'html-loader',
          options:{
            attrs:['img:src','a:href'],//针对a标签中静态资源打包处理
          }
        }
      },
      {
        test:/.md$/,
        use:{
          loader:[
            'html-loader',
            './markdown-loader',//相对路径
          ]
        }
      }
    ]
  },
  plugins:[
    new cleanWebpackPlugin(),
    // 生成index.html
    new HtmlWebpackPlugin({ //对html文件配置
      title:'webpack Plugin Sample',
      meta:{
        viewport:'width=device-width'
      },
      template:'./src/index.html',//指定模板文件渲染index
    }),
    // 用于生成about.html
    new HtmlWebpackPlugin({
      filename:'about.html'
    }),
    // 开发过程中一般不会使用,所以在 devServer 中配置
    new CopyWebpackPlugin([
      'public',//将public下所有文件输出到dist目录
    ]),
    new Myplugin(),
    new webpack.HotModuleReplacementPlugin(),//开启HMR需要的插件
    new webpack.DefinePlugin({
      API_BASE_URL:"'http://api.example/com'",//变量会挂载到 env.API_BASE_URL
    }),
    new MiniCssExtractPlugin(),//使用这个就不需要使用style-loader,会将css生成.css文件
    new OptimizeCssAssetsWebpackPlugin(),//压缩生成的.css文件,可以将他写到  optimization/minizer 数组下
  ],
  optimization:{ //代码压缩功能配置
    usedExports:true,//只导出外部使用了的成员
    // minimize:true,//压缩代码,删除未引用代码
    minimize:[
      new TerserWebpackPlugin(),//开启js压缩
      new OptimizeCssAssetsWebpackPlugin(),//这样只有打包的时候有效,但是js压缩插件会失效,所以还需要写js压缩
    ],
    concarenateModules:true,//合并模块代码
    sideEffects:true,//没有用到的模块是否有副作用 是否可以清除
    splitChunks:{
      chunks:'all',//将所有公共模块打包
    }
  }
}

```