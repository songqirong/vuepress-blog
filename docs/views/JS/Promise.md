---
title: '关于 Promise'
date: 2020-09-21
tags:
- 'JavaScript基础'
- '学习笔记'
categories:
- 'JavaScript基础'
---

关于 Promise 和手写 Promise

<!-- more -->

# 关于 Promise

## 概念

最先由CommonJS社区提出,在ES2015中被标准化,成为了语言规范

## 状态

- Pending: 等待中  
- Fulflled: 成功  => onFulfilled
- Rejected: 失败  => onRejected

从 Pending 改变后,就固定不变了. 不会从 Fulflled => Rejected || Rejected => Fulflled

## 基本用法

```js
const promise =  new Promise(function(resolve,reject){
  // 这里用于"兑现"承诺

  resolve(100);//承诺达成

  reject(new Error('promise rejected')) //承诺失败
});

promise.then(function(value){
  console.log('resolve',value)
},function(error){
  console.log('reject',error)
})

console.log('end'); //优先输出 end 再输出 promise 回调
```

## Promise AJAX 的应用

```js
// promise 方式的 ajax

function ajax(url){
  return new Promise(function(resolve,reject){
    var xhr = new XMLHttpRequest();
    xhr.open('GET',url);
    xhr.responseType = 'json';
    xhr.onload = function(){
      if(this.status === 200){
        resolve(this.response)
      }else{
        reject(new Error(this.statusText))
      }
    };
    xhr.send();
  })
}

ajax('xxxx').then(function(res){
  console.log(res)
},function(error){
  console.log(error)
})
```

## Promise 的链式调用

```js
var promise = ajax('xxx')
var promise2 = promise.then(function onFulfilled(value){
  console.log('onFulfilled',value)
},function onRejected(error){
  console.log('onRejected',error)
})

console.log(promise2) //Promise 对象
console.log(promise2 === promise); //false

```

- Promise 对象的 then 方法会返回一个全新的 Promise 对象
- 后面的 then 方法就是在为上一个 then 返回的 Promise 注册回调
- 前面的 then 方法中回调函数的返回值会作为后面 then 方法回调的参数
- 如果回调中返回的是 Promise , 那后面 then 方法的回调会等待它的结束

## Promise 静态方法

- Promise.resolve('foo')

```js
Promise.resolve('foo').then(value=>{
  console.log(value);//foo
})

new Promise((resolve,reject)=>{
  resolve('foo')
})

Promise.resolve({
  then:function(onFulfilled,onRejected){
    onFulfilled('foo')
  }
}).then(value=>{
  console.log(value);//foo
})
// 三者相等
```
- Promise.reject(new Error(foo))

- Promise.all

> 接收一个数组参数,数组里面全部都为 Promise 对象,在全部结束之后,将会触发 then ,当有一个失败, 会触发 catch

- Promise.race()

> race 传入 Promise 数组,以第一个结束的为主,第一个结束后,就会中断(不论走resolve/reject)