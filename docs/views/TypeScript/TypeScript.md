---
title: '关于 TypeScript'
date: 2020-10-01
# 永久链接
# permalink: '/hello-world'
# 文章访问密码
# keys: '123'
# 是否发布文章
# publish: true
# 置顶: 降序，可以按照 1, 2, 3, ... 来降低置顶文章的排列优先级
# sticky: 1
# sidebar: false
# sidebarDepth: 2
# isTimeLine: false
# isShowComment: true
tags:
- 学习笔记
- TypeScript基础
categories:
- 'TypeScript'
---

关于 TypeScript 的一些基本概念

<!-- more -->
# 关于 TypeScript 

## 关于强类型与弱类型(对比)

- 强类型 
> 语言层面限制函数的实参类型必须与形参类型相同<br/>
> 优势
>> - 错误更早暴露
>> - 代码更智能
>> - 重构更牢靠
>> - 减少不必要的类型判断

- 弱类型
> 允许任意的数据隐式类型转换

- **变量允许随时改变的特点,不是强弱类型的差异**

## 静态类型与动态类型(对比)

- 静态类型
> 一个变量声明时他的类型就是明确的<br/>
> 在声明过后不允许被修改

- 动态类型
> 在运行阶段明确变量类型<br/>
> 且变量类型随时可以改变<br/>
>  **变量是没有类型的,变量当中存放的值是有类型的**

## 缺点

- 语言本身多了很多概念(学习成本增加)
> 但是 TypeScript 属于[渐进式] 就算不知道新语法也可以用原来 JavaScript 的方式去写

- 项目初期,TypeScript 会增加一些成本
> 相对于大型项目 **利大于弊**

## 使用

- yarn add typescript --dev 

- yarn tsc xxx.ts
> 会生成同名 js 可以直接使用

## 配置

- yarn tsc --init

在项目下会多出 tsconfig.json 文件

> - target 输出的js会按照哪个标准的es 默认值 es5
> - module 输出的代码根据什么方式模块化
> - outDir 输出js所在的文件夹
> - rooDir ts源代码所在文件夹
> - spirceMap 开启源代码映射
> - strict 是否开启严格模式
> - lib 指定使用的标准库(默认标准库为 DOM )
> - ...

## 原始类型

- string : 只能存放字符串
- number : 只能存放数字
- boolean : 只能存放布尔值

> string | number | boolean 在非严格模式可以为空(null)

- viod : 可以是 null 和 undefined 严格模式下只能是 undefined
- null : null
- undefined : undefined
- symbol : Symbol()
> symbol 在 target 设置为 es5 时,会报错

## 显示中文错误消息

yarn tsc --locale zh-CN
> 不建议使用,不利于查找相关资料

## Object 类型

- 泛指所有的非原始对象类型(如数组,函数)

## enum 枚举

- 转换为js后会生成双向键值对,不会被编译删除
- 如果加声明前加入 const 编译后会被移除 只保留值

## 函数类型

- 参数前加 ? 可以转为可选参数

```ts
function fun1(a:number,?b:number) :string{
  return 'fun1'
}

const fun2:(a:number,b:number) => string = function(a:number,b:number) :string{
  return 'fun2'
}
```

> 具体特性可以回顾 掘金 **阿宝哥** 的两篇文章<br/>


- [1.2W字 | 了不起的 TypeScript 入门教程](https://juejin.im/post/6844904182843965453) <br/>
- [一份不可多得的 TS 学习指南（1.8W字](https://juejin.im/post/6872111128135073806)