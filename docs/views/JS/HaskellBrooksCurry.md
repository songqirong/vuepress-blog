---
title: '关于柯里化'
date: 2020-09-21
tags:
- 'JavaScript基础'
- '学习笔记'
categories:
- 'JavaScript基础'
---

关于"柯里化"概念和"实例"

<!-- more -->

# 关于柯里化

## 概念

- 当一个函数有多个参数的时候先传递一部分参数调用它(这部分参数以后永远不变)
- 然后返回一个新的函数接收剩余的参数,返回结果

## lodash中的柯里化函数

_.curry(func)

- 功能: 创建一个函数,该函数接收一个或多个 func 的参数,如果 func 所需要的参数都被提供则执行 func 并返回执行的结果.否则继续返回该函数,并等待接收的参数
- 参数: 需要柯里化的函数
- 返回值: 柯里化后的函数

## 手写curry

```js

function curry(func){
  return function curriedFn (...args){
    // 判断实参和形参的个数
    if(args.length < func.length){
      return function(){
        // 保存上一次传入的参数,加上此次传入的参数,再调用 curriedFn
        return curriedFn(...args.concat(Array.from(arguments)))
      }
    }
    return func(...args)
  }
}
```

## 总结

- 柯里化可以让我们给一个函数传递较少的参数得到一个已经记住了某些固定参数的新函数
- 这是一种对函数参数的'缓存'
- 让函数变得更灵活,让函数的粒度更小
- 可以把多元函数转换成一元函数,可以组合使用函数产生强大的功能