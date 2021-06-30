---
title: '关于闭包'
date: 2020-09-21
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
- 'JavaScript基础'
- '学习笔记'
categories:
- 'JavaScript基础'
---

关于闭包的定义

<!-- more -->

# 关于闭包

## 概念

闭包:函数和其周围的状态(词法环境)的引用捆绑在一起形成闭包
- 可以在另一个作用域中调用一个函数的内部函数并访问到该函数的作用域中的成员

```js
//once
function once(fn){
  let done = false;
  return function(){
    if(!done){
      done = true;
      return fn.apply(this,arguments)
    }
  }
}
let pay = once(function(money){
  console.log(`支付:${money}RMB`)
})
// 只会执行一次
pay(5)
pay(5)
pay(5)
```

- 闭包的本质:函数在执行的时候会放到一个执行栈上当函数执行完毕之后会从执行栈上一处,但是堆上的作用域成员因为被外部引用不能释放,因此内部函数依然可以访问外部函数的成员

> 如上方的 done 因为要判断是否执行过,所以done不会被释放