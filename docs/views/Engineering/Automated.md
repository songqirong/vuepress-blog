---
title: '关于自动化构建'
date: 2020-10-11
tags:
- '学习笔记'
- '脚手架'
categories:
- '脚手架'
---

关于自动化构建的定义和概念

<!-- more -->

## 自动化用处

- 可以将 sass -> css  es6 -> es5 等等

## 用 npm script 方式包装命令(简单实现自动化)

```json
// package.json
{
  "script":{
    "build":"sass scss/main.scss css/style.css --watch",
    "preserver":"yarn build", //执行serve前自动执行
    "serve":"browser-sync . --files\"css/*.css\"", // files* 代码监听了css下文件变化,自动渲染到浏览器当中
    "start":"run-p build server"  //需要安装 npm-run-all 依赖 可以同时执行两个命令 不会造成阻塞
  }
}
```

## 自动化工具

- grunt
> 1. 因为依赖临时文件,所以构建速度较慢
- gulp
> 1. 解决了grunt中速度较慢的问题
> 2. 默认支持同时进行多个任务
- fls
> 1. 百度前端团队开发
> 2. 类似捆绑套餐
> 3. 更适合初学者

## Grunt

- 初学 grunt

```js
// gruntfile.js
// 用于 Grunt 的入口文件
// 用于定义一些需要 Grunt 自动执行的任务
// 需要导出一个函数
// 此函数接受一个 grunt 形参,内部提供一些创建任务时可以用到的 API

module.exports = grunt => {
  grunt.registerTask('foo',()=>{
    console.log('hello grunt~')
  })

  grunt.registerTask('bar','任务描述',()=>{
    console.log('other grunt~')
  })

  // grunt.registerTask('default',()=>{
  //   console.log('default grunt~')
  // })

  grunt.registerTask('default',['foo','bar']);//依次执行 foo bar 任务

  grunt.registerTask('async-task',()=>{
    setTimeout(()=>{
      console.log('async-task')
    },1000)
  })

  // 上述代码 console.log 不会被执行
  // 应该采用下面代码

  grunt.registerTask('async-task',function(){
    const done = this.async();
    setTimeout(()=>{
      console.log('async-task');
      done();
    },1000)
  })
  // 在 grunt 中 异步操作不被识别 需要利用 api 才能正常执行异步操作
}
```

- 关于 grunt 中失败的情况

```js
module.exports = grunt => {

  grunt.registerTask('bad',()=>{
    console.log('bad grunt~');
    return false;
  })

  grunt.registerTask('foo',()=>{
    console.log('foo grunt~')
  })

  grunt.registerTask('bar','任务描述',()=>{
    console.log('bar grunt~')
  })

  grunt.registerTask('default',['foo','bad','bar'])
  // yarn grunt default 
  // 执行会失败,中断
  // yarn grunt default --force
  // 不会中断执行

  // 异步任务失败
  grunt.registerTask('bad-async',function(){
    const done = this.async();
    setTimeout(()=>{
      console.log('bad-async grunt');
      done(false)
    },1000)
  })
}
```

### Grunt的配置方法

```js
module.exports = grunt => {

  grunt.initConfig({
    foo:{
      bar:123
    }
  })

  grunt.registerTask('foo',()=>{
    console.log(grunt.config('foo.bar'))
  })
}
```

### Grunt的多目标任务

```js
module.exports = grunt => {
  grunt.initConfig({
    build:{
      // option 会成为配置选项 而不是目标
      option:{
        foo:'bar'
      },
      css:{
        // 单独配置选项
        option:{
          foo:'baz'
        }
      },
      js:'2'
    }
  })
  // 多目标模式,可以让任务根据配置形成多个子任务
  grunt.registerMultiTask('build',function(){
    console.log(this.options());
    console.log(`target:${this.target},data:${this.data}`)
  })
}
```

### Grunt插件的使用

- grunt-contrib-clean
```js
module.exports = grunt => {

  grunt.initConfig({
    clean:{
      temp:'temp/app.js',
      text:'temp/*.text',
      // 所有文件删除
      // temp:'temp/**',
    }
  })
  
  grunt.loadNpmTasks('grunt-contrib-clean');
}
```

### Grunt常用插件

- sass

sass -> css

```js
const sass = require('sass')
module.exports = grunt => {

  grunt.initConfig({
    sass:{
      option:{
        implementation:sass,
        sourceMap:true,//生成sourceMap文件
      },
      main:{
        files:{
          'dist/css/main.css':'src/scss/main.scss'
        }
      }
    }
  })

  grunt.loadNpmTasks('grunt-sass');
}
```

- babel

es6 -> es5

```js
const loadGruntTasks = require('load-grunt-task')

module.exports = grunt => {

  grunt.initConfig({
    babel:{
      option:{
        presets:['@babel/preset-env']
      },
      main:{
        files:{
          "dist/js/app.js":'src/js/app.js'
        }
      }
    }
  })

  loadGruntTasks(grunt)//自动加载所有 grunt 插件中的任务
}
```

- wathc

> grunt-contrib-watch

监视变化

```js
const loadGruntTasks = require('load-grunt-task')
module.exports = grunt => {

  grunt.initConfig({
    watch:{
      js:{
        files:["src/js/*.js"],
        tasks:['babel']
      },
      css:{
        files:['scr/scss/*.scss'],
        tasks:['sass']
      }
    }
  })

  loadGruntTasks(grunt)//自动加载所有 grunt 插件中的任务

  grunt.registerTask('default',['sass','babel','watch'])
}
```


## Gulp

- 简单使用

```js
// 文件名 gulpfile.js
// gulp 的入口文件

exports.foo = done => {
  console.log('foo task working~');
  done() //标记任务完成
}

exports.default = done => {
  console.log('default task working~')
  done()
}

// 老版本使用 4.0 以前
gulp.task('bar',done => {
  console.log('bar working~')
  done();
})
```

- 组合任务

```js
const { series, parallel } = require('gulp')

const task1 = done => {
  setTimeout(() => {
    console.log('task1 working~')
    done()
  }, 1000)
}

const task2 = done => {
  setTimeout(() => {
    console.log('task2 working~')
    done()
  }, 1000)  
}

const task3 = done => {
  setTimeout(() => {
    console.log('task3 working~')
    done()
  }, 1000)  
}

// 让多个任务按照顺序依次执行
exports.foo = series(task1, task2, task3)

// 让多个任务同时执行
exports.bar = parallel(task1, task2, task3)

```

- 异步任务

```js
const fs = require('fs')

exports.callback = done => {
  console.log('callback task')
  done()
}

exports.callback_error = done => {
  console.log('callback task')
  done(new Error('task failed'))
}

exports.promise = () => {
  console.log('promise task')
  return Promise.resolve()
}

exports.promise_error = () => {
  console.log('promise task')
  return Promise.reject(new Error('task failed'))
}

const timeout = time => {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

exports.async = async () => {
  await timeout(1000)
  console.log('async task')
}

exports.stream = () => {
  const read = fs.createReadStream('package.json')
  const write = fs.createWriteStream('a.txt')
  read.pipe(write)
  return read
}

exports.stream = done => {
  const read = fs.createReadStream('package.lock')
  const write = fs.createWriteStream('a.txt')
  read.pipe(write)
  read.on('end', () => {
    done()
  })
}

```

- 核心工作原理

```js
const fs = require('fs')
const { Transform } = require('stream')

exports.default = () => {
  // 文件读取流
  const readStream = fs.createReadStream('normalize.css')

  // 文件写入流
  const writeStream = fs.createWriteStream('normalize.min.css')

  // 文件转换流
  const transformStream = new Transform({
    transform: (chunk, encoding, callback) => {
      // 核心转换过程
      // chunk => 读取流中读取到的内容
      const input = chunk.toString()
      const output = input.replace(/\s+/g, '').replace(/\/\*.+?\*\//g, '')
      callback(null, output)
    }
  })

  // 把读取出来的文件流导入到写入的文件流
  const read =  readStream
    .pipe(transformStream) // 转换
    .pipe(writeStream) // 写入
  
  return read
}

```

- 文件操作 API

```js
const { src,dest } = require('gulp');
const cleanCss = require('gulp-clean-css')
const rename = require('gulp-rename');

exports.default = () => {
  return src('src/normalize.css')
    .pipe(cleanCss()) //压缩css插件
    .pipe(rename({extname:'.min.css'}))
    .pipe(dest('dist'))
}
```

