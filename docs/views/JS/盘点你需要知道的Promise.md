---
title: '盘点你需要知道的Promise'
date: 2020-11-21
# 永久链接
# permalink: '/hello-world'
# 文章访问密码
# keys: '123'
# 是否发布文章
# publish: true
# 置顶: 降序，可以按照 1, 2, 3, ... 来降低置顶文章的排列优先级
sticky: 1
# sidebar: false
# sidebarDepth: 2
# isTimeLine: false
# isShowComment: true
tags:
- 博文
- JavaScript基础
categories:
- 博文
---

本篇文章适合刚接触前端 || 对Promise不是很了解的同学

<!-- more -->

## 前提

先说说写这篇文章的原因,最近身边有一些刚毕业的做前端的朋友,因为不了解Promise,所以写出来的代码有时候会非常的乱,但是又不清楚Promise是如何使用的,官方的文档明显不太适合这些基础不好的朋友,所以我就想着做一份整理

## 介绍

关于 Promise 你需要知道的几个点(其实在我之前两遍文章中都有)

- Promise 是ES2015中的新语法,也就是常说的ES6语法,所以在使用过程中,如果没有用 webpack 等打包工具,需要注意兼容性的问题
- Promise 最好是和 async && await 搭配使用
- 本篇文章只会讲述简单是使用和一些基本的概念,深入不会再去写,如果有兴趣可以再看看我的手写 Promise

## 开始

### 状态

首先 Promise 对象拥有三个状态 
- pending 也就是等待中
- fulfilled 成功状态 
  - 在Promise立执行函数中执行了 resolve ,会将状态改为成功
  - resolve 中是可以传递参数的
- rejected 失败 
  - 在Promise立执行函数中执行了 reject ,会将状态改为失败
  - reject 中也是可以传递参数的

### 回调

首先我们了解一下 Promise.then(func,func) 这里传入了两个func,因为是正确优先,所以第一个函数自然就是 fulfilled 状态的函数, 第二个函数是 rejected 状态的函数.(细心的朋友可能会发现我用了一个词,正确优先,为什么要额外指出这点呢?因为在 Node.js 中,你会发现很多是错误优先的,所以额外提一嘴)

### 简单使用

我们在使用Promise的过程中,是先像 Promise 传入一个function

比如:

```js
var p = new Promise(function(resolve, reject){
  console.log(1)
  setTimeout(()=>{console.log(2);resolve()},0)
})
p.then(()=>{console.log(3);},()=>{console.log(4);});
console.log(5)
```

建议看到这里先简单思考一下你觉得会输出什么?为什么?(可以先思考1分钟)

思考完了,我们先不直接公布答案,我先说一下思路.

- 首先, Promise 传入的function是一个立执行函数,代表内部的代码会立刻执行,所以就会先输出 **1**

- 但是内部的2,因为setTimeout的原因被放到了**宏任务**中,注意,这里引入了一个新概念,宏任务.这篇文章不多做讲解,有兴趣可以查一下,所以我们往下执行,发现有一个p.then() 这里的代码会立刻执行么? 答案是不会的,因为 .then 会放到 **微任务**当中,这里又有了一个新术语,微任务,它和宏任务的相关的,有兴趣可以去深入一下.那我们再往下走, 接下里就是一个,平平无奇的 console 了,所以第二个输出的,自然就是 **5**

- 按照上面第二步的分析,我们主任务执行完了,理论上来说应该去查找微任务的内容,但是因为 Promise的状态还没从pending改变,所以我们的 .then 中的任务无法执行,这样看的话,第三步输出的就是 **2**

- 在 Promise 状态改变之后,执行 then 中的函数,自然就会输出 **3**

- 问题来了?最后一个输出的真的是 4 么?如果不是的话,为什么呢? 有的人可能会说,因为我的状态是 fulfilled 的,不会执行 rejected 状态的回调,这句话是对的,但是如果我这样写呢?

```js
var p = new Promise(function(resolve, reject){
  console.log(1)
  setTimeout(()=>{console.log(2);resolve();reject()},0)
})
p.then(()=>{console.log(3);},()=>{console.log(4);});
console.log(5)
```
我在resolve后又执行了一次 reject() ,状态会被改为rejected么?

答案是不会的,这里又引入一个新的概念,**Promise的状态修改只会被修改一次**,所以在修改为 fulfilled 后,就不会被修改了.

## 结合 async 的使用

关于 async 和 await 这两个语法糖介绍我就不多说了,细究起来又是一篇可以水的文章,可以自己先百度,有需要我考虑再水一篇hhhh

```js
var p = async ()=>{
  return new Promise(function(resolve, reject){
    console.log(1);
    setTimeout(function(){
      resolve(2);
    },1000)
  })
}
var a = await p();
console.log(a);
console.log(3)
```

请先思考一分钟,这个会输出什么?为什么?

好了 接下里我们开始分析这个代码

- 首先我们关于 p 变量,我们会输出一个 Promise 对象,与之前的写法不同的是上方写了 async 和在使用的时候加了 await 我希望你自己先去了解了这个语法, 之前说过 Promise内部是一个立执行函数,所以第一个输出的就是 1
- 通过 await 语法糖,我们会等待 Promise 状态修改后,才会执行下面的代码,所以第二个输出的是 2 
- 第三个,自然就是平平无奇的 console.log() 了, 所以自然也是 平平无奇的 3 啦

诶 讲完了例子,聪明的朋友应该可以发现我们可以在什么情况去使用Promise和async了.

最常见的场景之一应该就是我们像后端发送请求的时候,我们把请求写到立执行函数中,再把得到的data放到resolve中,我们在使用 a 变量的时候,是不是就是直接得到了请求的数据呢? 这样是不是就可以避免回调地狱的诞生了呢?

好了,这篇文章到此为止.

如果还有问题,可以留言和我一起讨论哦.