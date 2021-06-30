---
title: '学习Rollup && Parcel'
date: 2020-10-26
tags:
- '学习笔记'
- '模块化'
- 'Rollup'
categories:
- '模块化'
---

学习模块化的Rollup工具笔记

<!-- more -->

## Rollup 代码实现

```js
//rollup.config.js
import json from 'rollup-plugin-json'//加载json
import resolve from 'rollup-plugin-node-resolve'//直接在js中引入npm包
import commonjs from 'rollup-plugin-commonjs'//可以在js中导入 CommonJS 规则的依赖
export default {
  // input: 'src/index.js',//入口文件
  // 多入口打包
  input:{//多入口打包也不能用iife模式
    foo:'src/foo.js',
    index:'src/index.js'
  },
  output: {
    // file: 'dist/bundle.js',//输出文件
    // format: 'iife'//输出格式,iife输出自执行函数
    // 代码拆分的情况下,不能用iife要用amd输出也不能指定某个文件
    dir:'dist',
    format:'amd'
  },
  plugins:[
    json(),
    resolve(),
    commonjs(),
  ]
}
```

优势:

- 输出结果更加扁平
- 自动移除未引用代码
- 打包结果依然完全可读

缺点:

- 加载非 ESM 的第三方模块比较复杂
- 模块最终都被打包到一个函数中,无法实现 HMR
- 浏览器环境中,带啊拆分功能依赖 AMD 库

如果我们正在开发应用程序,roolup就不是很合适

但是如果开发一个框架或者类库,就比较合适


webpack 大而全/rollup 小而美

## Parcel

非常简单.建议直接看文档.

- 完成零配置(自动安装插件)
- 构建速度快


生态不如webpack,社区生态还是比不上webpack