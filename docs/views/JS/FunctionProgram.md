---
title: '函数式编程'
date: 2020-09-21
tags:
- 'JavaScript基础'
- '学习笔记'
categories:
- 'JavaScript基础'
---

关于 函数式编程 概念

<!-- more -->

# 函数式编程

函数式编程是一种编程范式,除了函数式编程,还有面向过程编程,面向对象编程等等

- 面向对象编程:
> 把现实世界中的失误抽象成程序视界中的类和对象,通过封装,继承,和多态来演示事务事件的联系

- 函数式编程:
> 函数式编程值得并不是程序中 function 在我的理解中,函数式编程就像是数学公式,y=sin(x),如果x固定 那么得到的结果也一定是固定的

## 总结

函数式编程用来描述函数之间的映射

## 举例

```js
// 非函数式编程
let a = 1;
let b = 2;
let c = a + b;
console.log(c);

//函数式

function add(a,b){
  return a + b;
}
let c = add(1,2);
console.log(c)
```