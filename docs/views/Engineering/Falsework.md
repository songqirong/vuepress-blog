---
title: '关于脚手架'
date: 2020-10-10
tags:
- '学习笔记'
- '脚手架'
categories:
- '脚手架'
---

关于自建脚手架的定义和自建脚手架的写法

<!-- more -->

# 关于脚手架

## 常用脚手架工具

- create-react-app
- vue-cli
- angular-cli

根据信息创建对应的项目基础结构

- yeoman

通用性项目脚手架,根据一套模板生成对应项目结构

- plop

创建特定类型文件
> 如创建一个组件/模块所需要的文件

## 关于 Yeoman

### 安装

- 在全局范围安装 yo
```js
npm i yo -g
```

- 安装对应的 generator
```js
npm i generator-node -g
```

- 通过 yo 运行 generator
```js
mkidr my-module
yo node
```

[Yeoman 相关模块联系代码](https://github.com/wenfeihuazha/EngineeringCode/tree/master/Yeoman)

## 关于 Plop

- 用于创建项目中同类型的文件

### 使用

- 将 plop 模块作为项目开发依赖安装
- 在项目根目录下创建一个plopfile.js文件
- 在plopfile.js文件中定义脚手架任务
- 编写用于生成特定类文件的模板
- 通过plop提供的CLI运行脚手架任务

[Plop 相关模块联系代码](https://github.com/wenfeihuazha/EngineeringCode/tree/master/Plop)
