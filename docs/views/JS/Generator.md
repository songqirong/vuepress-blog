---
title: '关于 Generator'
date: 2020-09-21
tags:
- 'JavaScript基础'
- '学习笔记'
categories:
- 'JavaScript基础'
---

关于 Generator

<!-- more -->

# 关于 Generator

## 概念

- 是 ES2015 的新语法

## 基本使用

```js
function * foo(){
  console.log('start');

  try {
    const res = yield 'foo';
    console.log(res)
  } catch (error) {
    console.log(error)
  }
}
const generator = foo();

const result =  generator.next();
console.log(result);

generator.next('bar');

generator.throw(new Error('Generator error'))
```

## Generator 配合 Promise 的异步方案

```js
function ajax(){
  return Promise()
  ...
}

function * main(){
  const users = yield ajax('xxx');
  console.log(users)
}

const g = main();

const result = g.next();

result.value.then(data => {
  const result2 = g.next(data);

  result2.value.then(data => {
    g.next(data)
  })
})
```

## 拓展

- 可以参考 **co** 库
- 此方法已经不常用了,了解一下总是可的