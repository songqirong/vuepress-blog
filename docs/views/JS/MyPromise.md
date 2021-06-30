---
title: '手写 Promise'
date: 2020-09-22
tags:
- 'JavaScript基础'
- '学习笔记'
categories:
- 'JavaScript基础'
---

手写 Promise

<!-- more -->

# 手写 Promise

## 概念 && 基本使用方式

- Promise 就是一个类,在执行这个类的时候 需要传第一个执行器进去,执行器会立即执行

- Promise 中有三种状态 分别为成功 fulfilled 失败 rejected 等待 pending
  pending -> fulfilled
  pending -> rejected
  一旦状态确定就不可更改
- resolve 和 reject 函数是用来更改状态的
  resolve : fulfilled
  reject : rejected

- then 方法内部做的事情就是判断状态 如果状态是成功 就调用成功的回调函数,如果状态是失败 调用失败的回调函数 then 方法是被定义在原型对象当中的

- then 成功回调有一个参数, 表示成功之后的值, 失败回调有一个参数,表示失败的原因

```js
let promise = new Promise ((resolve,reject)=>{
  resolve('成功');
  reject('失败')
})
promise.then(()=>{},()=>{})
```

## 手写 Promise

### 实现最基本的 Promise

```js
const PEMDING = 'pending';//等待
const FULFILLED = 'fulfilled';//成功
const REJECTED = 'rejected';//失败

class MyPromise{

  constructor(execurot){
    execurot(this.resolve,this.reject);//立即执行的执行器
  }

  // promise 状态
  status = PEMDING;
  // 成功之后的值
  value = undefined;
  // 失败的原因
  reason = undefined;

  resolve = value => { //箭头函数是为了避免 this 指向出问题 要指向class
    // 如果状态不为pending 阻止程序向下执行
    if(this.status !== PEMDING) return;
    // 讲状态改为成功
    this.status = FULFILLED;
    // 保存成功之后的值
    this.value = value;
  }

  reject = reason => {
    // 如果状态不为pending 阻止程序向下执行
    if(this.status !== PEMDING) return;
    // 讲状态改为失败
    this.status = REJECTED;
    // 保存失败之后的原因
    this.reason = reason
  }

  then(successCallback,failCallback){
    // 判断状态
    if(this.status === FULFILLED){
      successCallback(this.value)
    }else if(this.status === REJECTED){
      failCallback(this.reason);
    }
  }
}
```

### 考虑异步情况

```js
const PEMDING = 'pending';//等待
const FULFILLED = 'fulfilled';//成功
const REJECTED = 'rejected';//失败

class MyPromise{

  constructor(execurot){
    execurot(this.resolve,this.reject);//立即执行的执行器
  }

  // promise 状态
  status = PEMDING;
  // 成功之后的值
  value = undefined;
  // 失败的原因
  reason = undefined;

  // 成功回调
  successCallback = undefined;
  // 失败回调
  failCallback = undefined;

  resolve = value => { //箭头函数是为了避免 this 指向出问题 要指向class
    // 如果状态不为pending 阻止程序向下执行
    if(this.status !== PEMDING) return;
    // 讲状态改为成功
    this.status = FULFILLED;
    // 保存成功之后的值
    this.value = value;
    // 判断成功回调是否存在
    this.successCallback && this.successCallback(this.value);
  }

  reject = reason => {
    // 如果状态不为pending 阻止程序向下执行
    if(this.status !== PEMDING) return;
    // 将状态改为失败
    this.status = REJECTED;
    // 保存失败之后的原因
    this.reason = reason
    // 判断失败回调是否存在
    this.failCallback && this.failCallback(this.reason);
  }

  then(successCallback,failCallback){
    // 判断状态
    if(this.status === FULFILLED){
      successCallback(this.value)
    }else if(this.status === REJECTED){
      failCallback(this.reason);
    }else{ //代表当前状态为等待状态
      this.successCallback = successCallback;
      this.failCallback = failCallback;
    }
  }
}
```

### 实现 then 方法多次调用添加多个处理函数

```js
const PEMDING = 'pending';//等待
const FULFILLED = 'fulfilled';//成功
const REJECTED = 'rejected';//失败

class MyPromise{

  constructor(execurot){
    execurot(this.resolve,this.reject);//立即执行的执行器
  }

  // promise 状态
  status = PEMDING;
  // 成功之后的值
  value = undefined;
  // 失败的原因
  reason = undefined;

  // 成功回调
  successCallback = [];
  // 失败回调
  failCallback = [];

  resolve = value => { //箭头函数是为了避免 this 指向出问题 要指向class
    // 如果状态不为pending 阻止程序向下执行
    if(this.status !== PEMDING) return;
    // 讲状态改为成功
    this.status = FULFILLED;
    // 保存成功之后的值
    this.value = value;
    // 判断成功回调是否存在
    // this.successCallback && this.successCallback(this.value);
    while(this.successCallback.length) this.successCallback.shift()(this.value);
  }

  reject = reason => {
    // 如果状态不为pending 阻止程序向下执行
    if(this.status !== PEMDING) return;
    // 讲状态改为失败
    this.status = REJECTED;
    // 保存失败之后的原因
    this.reason = reason
    // 判断失败回调是否存在
    // this.failCallback && this.failCallback(this.reason);
    while(this.failCallback.length) this.failCallback.shift()(this.reason);
  }

  then(successCallback,failCallback){
    // 判断状态
    if(this.status === FULFILLED){
      successCallback(this.value)
    }else if(this.status === REJECTED){
      failCallback(this.reason);
    }else{ //代表当前状态为等待状态
      this.successCallback.push(successCallback)
      this.failCallback.push(failCallback);
    }
  }
}
```

### 实现 Promise 的链式调用

```js
const PEMDING = 'pending';//等待
const FULFILLED = 'fulfilled';//成功
const REJECTED = 'rejected';//失败

class MyPromise{

  constructor(execurot){
    execurot(this.resolve,this.reject);//立即执行的执行器
  }

  // promise 状态
  status = PEMDING;
  // 成功之后的值
  value = undefined;
  // 失败的原因
  reason = undefined;

  // 成功回调
  successCallback = [];
  // 失败回调
  failCallback = [];

  resolve = value => { //箭头函数是为了避免 this 指向出问题 要指向class
    // 如果状态不为pending 阻止程序向下执行
    if(this.status !== PEMDING) return;
    // 讲状态改为成功
    this.status = FULFILLED;
    // 保存成功之后的值
    this.value = value;
    // 判断成功回调是否存在
    // this.successCallback && this.successCallback(this.value);
    while(this.successCallback.length) this.successCallback.shift()(this.value);
  }

  reject = reason => {
    // 如果状态不为pending 阻止程序向下执行
    if(this.status !== PEMDING) return;
    // 讲状态改为失败
    this.status = REJECTED;
    // 保存失败之后的原因
    this.reason = reason
    // 判断失败回调是否存在
    // this.failCallback && this.failCallback(this.reason);
    while(this.failCallback.length) this.failCallback.shift()(this.reason);
  }

  then(successCallback,failCallback){
    let promise2 = new MyPromise((resolve,reject)=>{
      // 判断状态
      if(this.status === FULFILLED){
        let x = successCallback(this.value);
        // 判断 x 的值是普调值还是promise对象
        // 如果是普调值 直接调用resolve
        // 如果是promise对象 查看promise对象返回的结果
        // 再根据promise对象返回的结果 决定调用resolve 还是调用reject
        resolvePromise(x,resolve,reject);
      }else if(this.status === REJECTED){
        failCallback(this.reason);
      }else{ //代表当前状态为等待状态
        this.successCallback.push(successCallback);
        this.failCallback.push(failCallback);
      };
    });
    return promise2;
  }

  resolvePromise(x,resolve,reject){
    if(x instanceof MyPromise){
      // promise对象
      // x.then((value)=>{
      //   resolve(value)
      // },(reason)=>{
      //   reject(reason)
      // })
      x.then(resolve,reject)
    }else{
      // 普调值
      resolve(x);
    }
  }
}
```

### 捕获错误

```js
const PEMDING = 'pending';//等待
const FULFILLED = 'fulfilled';//成功
const REJECTED = 'rejected';//失败

class MyPromise{

  constructor(execurot){
    try {
      execurot(this.resolve,this.reject);//立即执行的执行器
    } catch (error) {
      this.reject(error)      
    }
  }

  // promise 状态
  status = PEMDING;
  // 成功之后的值
  value = undefined;
  // 失败的原因
  reason = undefined;

  // 成功回调
  successCallback = [];
  // 失败回调
  failCallback = [];

  resolve = value => { //箭头函数是为了避免 this 指向出问题 要指向class
    // 如果状态不为pending 阻止程序向下执行
    if(this.status !== PEMDING) return;
    // 讲状态改为成功
    this.status = FULFILLED;
    // 保存成功之后的值
    this.value = value;
    // 判断成功回调是否存在
    // this.successCallback && this.successCallback(this.value);
    while(this.successCallback.length) this.successCallback.shift()();
  }

  reject = reason => {
    // 如果状态不为pending 阻止程序向下执行
    if(this.status !== PEMDING) return;
    // 讲状态改为失败
    this.status = REJECTED;
    // 保存失败之后的原因
    this.reason = reason
    // 判断失败回调是否存在
    // this.failCallback && this.failCallback(this.reason);
    while(this.failCallback.length) this.failCallback.shift()(this.reason);
  }

  then(successCallback,failCallback){
    let promise2 = new MyPromise((resolve,reject)=>{
      // 判断状态
      if(this.status === FULFILLED){
        // 防止promise2未生成 所以通过setTimeout改为异步代码
        setTimeout(()=>{
          try {
            let x = successCallback(this.value);
            // 判断 x 的值是普调值还是promise对象
            // 如果是普调值 直接调用resolve
            // 如果是promise对象 查看promise对象返回的结果
            // 再根据promise对象返回的结果 决定调用resolve 还是调用reject
            resolvePromise(promise2,x,resolve,reject);
          } catch (error) {
            reject(error)
          }
        },0)
      }else if(this.status === REJECTED){
        setTimeout(()=>{
          try {
            let x = successCallback(this.value);
            // 判断 x 的值是普调值还是promise对象
            // 如果是普调值 直接调用resolve
            // 如果是promise对象 查看promise对象返回的结果
            // 再根据promise对象返回的结果 决定调用resolve 还是调用reject
            failCallback(promise2,x,resolve,reject);
          } catch (error) {
            reject(error)
          }
        },0)
      }else{ //代表当前状态为等待状态
        this.successCallback.push(()=>{
          setTimeout(()=>{
            try {
              let x = successCallback(this.value);
              // 判断 x 的值是普调值还是promise对象
              // 如果是普调值 直接调用resolve
              // 如果是promise对象 查看promise对象返回的结果
              // 再根据promise对象返回的结果 决定调用resolve 还是调用reject
              failCallback(promise2,x,resolve,reject);
            } catch (error) {
              reject(error)
            }
          },0)
        })
        this.failCallback.push(()=>{
          failCallback();
        });
      };
    });
    return promise2;
  }

  resolvePromise(promise2,x,resolve,reject){
    if(promise2 === x){
      return reject(new TypeError('xxxxx'));
    }
    if(x instanceof MyPromise){
      // promise对象
      // x.then(value=>{resolve(value)},(reason)=>{reject(reason)})
      x.then(resolve,reject)
    }else{
      // 普调值
      resolve(x);
    }
  }
}
```

### 将 then 方法的参数变成可选参数

```js
const PEMDING = 'pending';//等待
const FULFILLED = 'fulfilled';//成功
const REJECTED = 'rejected';//失败

class MyPromise{

  constructor(execurot){
    try {
      execurot(this.resolve,this.reject);//立即执行的执行器
    } catch (error) {
      this.reject(error)      
    }
  }

  // promise 状态
  status = PEMDING;
  // 成功之后的值
  value = undefined;
  // 失败的原因
  reason = undefined;

  // 成功回调
  successCallback = [];
  // 失败回调
  failCallback = [];

  resolve = value => { //箭头函数是为了避免 this 指向出问题 要指向class
    // 如果状态不为pending 阻止程序向下执行
    if(this.status !== PEMDING) return;
    // 讲状态改为成功
    this.status = FULFILLED;
    // 保存成功之后的值
    this.value = value;
    // 判断成功回调是否存在
    // this.successCallback && this.successCallback(this.value);
    while(this.successCallback.length) this.successCallback.shift()();
  }

  reject = reason => {
    // 如果状态不为pending 阻止程序向下执行
    if(this.status !== PEMDING) return;
    // 讲状态改为失败
    this.status = REJECTED;
    // 保存失败之后的原因
    this.reason = reason
    // 判断失败回调是否存在
    // this.failCallback && this.failCallback(this.reason);
    while(this.failCallback.length) this.failCallback.shift()(this.reason);
  }

  then(successCallback,failCallback){
    successCallback = successCallback ? successCallback : value => value
    failCallback = failCallback ? failCallback : reason => {throw reason}
    let promise2 = new MyPromise((resolve,reject)=>{
      // 判断状态
      if(this.status === FULFILLED){
        // 防止promise2未生成 所以通过setTimeout改为异步代码
        setTimeout(()=>{
          try {
            let x = successCallback(this.value);
            // 判断 x 的值是普调值还是promise对象
            // 如果是普调值 直接调用resolve
            // 如果是promise对象 查看promise对象返回的结果
            // 再根据promise对象返回的结果 决定调用resolve 还是调用reject
            resolvePromise(promise2,x,resolve,reject);
          } catch (error) {
            reject(error)
          }
        },0)
      }else if(this.status === REJECTED){
        setTimeout(()=>{
          try {
            let x = successCallback(this.value);
            // 判断 x 的值是普调值还是promise对象
            // 如果是普调值 直接调用resolve
            // 如果是promise对象 查看promise对象返回的结果
            // 再根据promise对象返回的结果 决定调用resolve 还是调用reject
            failCallback(promise2,x,resolve,reject);
          } catch (error) {
            reject(error)
          }
        },0)
      }else{ //代表当前状态为等待状态
        this.successCallback.push(()=>{
          setTimeout(()=>{
            try {
              let x = successCallback(this.value);
              // 判断 x 的值是普调值还是promise对象
              // 如果是普调值 直接调用resolve
              // 如果是promise对象 查看promise对象返回的结果
              // 再根据promise对象返回的结果 决定调用resolve 还是调用reject
              failCallback(promise2,x,resolve,reject);
            } catch (error) {
              reject(error)
            }
          },0)
        })
        this.failCallback.push(()=>{
          failCallback();
        });
      };
    });
    return promise2;
  }

  resolvePromise(promise2,x,resolve,reject){
    if(promise2 === x){
      return reject(new TypeError('xxxxx'));
    }
    if(x instanceof MyPromise){
      // promise对象
      // x.then(value=>{resolve(value)},(reason)=>{reject(reason)})
      x.then(resolve,reject)
    }else{
      // 普调值
      resolve(x);
    }
  }
}
```

### Promise.all 方法的实现

```js
const { reject } = require("lodash");

const PEMDING = 'pending';//等待
const FULFILLED = 'fulfilled';//成功
const REJECTED = 'rejected';//失败

class MyPromise{

  constructor(execurot){
    try {
      execurot(this.resolve,this.reject);//立即执行的执行器
    } catch (error) {
      this.reject(error)      
    }
  }

  // promise 状态
  status = PEMDING;
  // 成功之后的值
  value = undefined;
  // 失败的原因
  reason = undefined;

  // 成功回调
  successCallback = [];
  // 失败回调
  failCallback = [];

  resolve = value => { //箭头函数是为了避免 this 指向出问题 要指向class
    // 如果状态不为pending 阻止程序向下执行
    if(this.status !== PEMDING) return;
    // 讲状态改为成功
    this.status = FULFILLED;
    // 保存成功之后的值
    this.value = value;
    // 判断成功回调是否存在
    // this.successCallback && this.successCallback(this.value);
    while(this.successCallback.length) this.successCallback.shift()();
  }

  reject = reason => {
    // 如果状态不为pending 阻止程序向下执行
    if(this.status !== PEMDING) return;
    // 讲状态改为失败
    this.status = REJECTED;
    // 保存失败之后的原因
    this.reason = reason
    // 判断失败回调是否存在
    // this.failCallback && this.failCallback(this.reason);
    while(this.failCallback.length) this.failCallback.shift()(this.reason);
  }

  then(successCallback,failCallback){
    successCallback = successCallback ? successCallback : value => value
    failCallback = failCallback ? failCallback : reason => {throw reason}
    let promise2 = new MyPromise((resolve,reject)=>{
      // 判断状态
      if(this.status === FULFILLED){
        // 防止promise2未生成 所以通过setTimeout改为异步代码
        setTimeout(()=>{
          try {
            let x = successCallback(this.value);
            // 判断 x 的值是普调值还是promise对象
            // 如果是普调值 直接调用resolve
            // 如果是promise对象 查看promise对象返回的结果
            // 再根据promise对象返回的结果 决定调用resolve 还是调用reject
            resolvePromise(promise2,x,resolve,reject);
          } catch (error) {
            reject(error)
          }
        },0)
      }else if(this.status === REJECTED){
        setTimeout(()=>{
          try {
            let x = successCallback(this.value);
            // 判断 x 的值是普调值还是promise对象
            // 如果是普调值 直接调用resolve
            // 如果是promise对象 查看promise对象返回的结果
            // 再根据promise对象返回的结果 决定调用resolve 还是调用reject
            failCallback(promise2,x,resolve,reject);
          } catch (error) {
            reject(error)
          }
        },0)
      }else{ //代表当前状态为等待状态
        this.successCallback.push(()=>{
          setTimeout(()=>{
            try {
              let x = successCallback(this.value);
              // 判断 x 的值是普调值还是promise对象
              // 如果是普调值 直接调用resolve
              // 如果是promise对象 查看promise对象返回的结果
              // 再根据promise对象返回的结果 决定调用resolve 还是调用reject
              failCallback(promise2,x,resolve,reject);
            } catch (error) {
              reject(error)
            }
          },0)
        })
        this.failCallback.push(()=>{
          failCallback();
        });
      };
    });
    return promise2;
  }

  resolvePromise(promise2,x,resolve,reject){
    if(promise2 === x){
      return reject(new TypeError('xxxxx'));
    }
    if(x instanceof MyPromise){
      // promise对象
      // x.then(value=>{resolve(value)},(reason)=>{reject(reason)})
      x.then(resolve,reject)
    }else{
      // 普调值
      resolve(x);
    }
  }

  static all(array){
    let result = [];
    let index = 0;
    return new MyPromise((resolve,reject)=>{
      function addData(key,value){
        result[key] = value;
        index++
        if(index === array.length){
          resolve(result)
        }
      }
      for(let i = 0; i < array.length; i++){
        let current = array[i];
        if(current instanceof MyPromise){//是否为Promise对象
          current.then(value=>addData(i,value),reason => reject(reason))
        }else{//普通值
          addData(i,array[i]);
        }
      }
    })
  }
}
```


## Promise.resolve 方法的实现

```js
const { reject } = require("lodash");

const PEMDING = 'pending';//等待
const FULFILLED = 'fulfilled';//成功
const REJECTED = 'rejected';//失败

class MyPromise{

  constructor(execurot){
    try {
      execurot(this.resolve,this.reject);//立即执行的执行器
    } catch (error) {
      this.reject(error)      
    }
  }

  // promise 状态
  status = PEMDING;
  // 成功之后的值
  value = undefined;
  // 失败的原因
  reason = undefined;

  // 成功回调
  successCallback = [];
  // 失败回调
  failCallback = [];

  resolve = value => { //箭头函数是为了避免 this 指向出问题 要指向class
    // 如果状态不为pending 阻止程序向下执行
    if(this.status !== PEMDING) return;
    // 讲状态改为成功
    this.status = FULFILLED;
    // 保存成功之后的值
    this.value = value;
    // 判断成功回调是否存在
    // this.successCallback && this.successCallback(this.value);
    while(this.successCallback.length) this.successCallback.shift()();
  }

  reject = reason => {
    // 如果状态不为pending 阻止程序向下执行
    if(this.status !== PEMDING) return;
    // 讲状态改为失败
    this.status = REJECTED;
    // 保存失败之后的原因
    this.reason = reason
    // 判断失败回调是否存在
    // this.failCallback && this.failCallback(this.reason);
    while(this.failCallback.length) this.failCallback.shift()(this.reason);
  }

  then(successCallback,failCallback){
    successCallback = successCallback ? successCallback : value => value
    failCallback = failCallback ? failCallback : reason => {throw reason}
    let promise2 = new MyPromise((resolve,reject)=>{
      // 判断状态
      if(this.status === FULFILLED){
        // 防止promise2未生成 所以通过setTimeout改为异步代码
        setTimeout(()=>{
          try {
            let x = successCallback(this.value);
            // 判断 x 的值是普调值还是promise对象
            // 如果是普调值 直接调用resolve
            // 如果是promise对象 查看promise对象返回的结果
            // 再根据promise对象返回的结果 决定调用resolve 还是调用reject
            resolvePromise(promise2,x,resolve,reject);
          } catch (error) {
            reject(error)
          }
        },0)
      }else if(this.status === REJECTED){
        setTimeout(()=>{
          try {
            let x = successCallback(this.value);
            // 判断 x 的值是普调值还是promise对象
            // 如果是普调值 直接调用resolve
            // 如果是promise对象 查看promise对象返回的结果
            // 再根据promise对象返回的结果 决定调用resolve 还是调用reject
            failCallback(promise2,x,resolve,reject);
          } catch (error) {
            reject(error)
          }
        },0)
      }else{ //代表当前状态为等待状态
        this.successCallback.push(()=>{
          setTimeout(()=>{
            try {
              let x = successCallback(this.value);
              // 判断 x 的值是普调值还是promise对象
              // 如果是普调值 直接调用resolve
              // 如果是promise对象 查看promise对象返回的结果
              // 再根据promise对象返回的结果 决定调用resolve 还是调用reject
              failCallback(promise2,x,resolve,reject);
            } catch (error) {
              reject(error)
            }
          },0)
        })
        this.failCallback.push(()=>{
          failCallback();
        });
      };
    });
    return promise2;
  }

  resolvePromise(promise2,x,resolve,reject){
    if(promise2 === x){
      return reject(new TypeError('xxxxx'));
    }
    if(x instanceof MyPromise){
      // promise对象
      // x.then(value=>{resolve(value)},(reason)=>{reject(reason)})
      x.then(resolve,reject)
    }else{
      // 普调值
      resolve(x);
    }
  }

  static all(array){
    let result = [];
    let index = 0;
    return new MyPromise((resolve,reject)=>{
      function addData(key,value){
        result[key] = value;
        index++
        if(index === array.length){
          resolve(result)
        }
      }
      for(let i = 0; i < array.length; i++){
        let current = array[i];
        if(current instanceof MyPromise){//是否为Promise对象
          current.then(value=>addData(i,value),reason => reject(reason))
        }else{//普通值
          addData(i,array[i]);
        }
      }
    })
  }

  static resolve(value){
    if(value instanceof MyPromise) return value;
    return new MyPromise(resolve => resolve(value));
  }
}
```

### finally 方法的实现

```js
const { reject } = require("lodash");

const PEMDING = 'pending';//等待
const FULFILLED = 'fulfilled';//成功
const REJECTED = 'rejected';//失败

class MyPromise{

  constructor(execurot){
    try {
      execurot(this.resolve,this.reject);//立即执行的执行器
    } catch (error) {
      this.reject(error)      
    }
  }

  // promise 状态
  status = PEMDING;
  // 成功之后的值
  value = undefined;
  // 失败的原因
  reason = undefined;

  // 成功回调
  successCallback = [];
  // 失败回调
  failCallback = [];

  resolve = value => { //箭头函数是为了避免 this 指向出问题 要指向class
    // 如果状态不为pending 阻止程序向下执行
    if(this.status !== PEMDING) return;
    // 讲状态改为成功
    this.status = FULFILLED;
    // 保存成功之后的值
    this.value = value;
    // 判断成功回调是否存在
    // this.successCallback && this.successCallback(this.value);
    while(this.successCallback.length) this.successCallback.shift()();
  }

  reject = reason => {
    // 如果状态不为pending 阻止程序向下执行
    if(this.status !== PEMDING) return;
    // 讲状态改为失败
    this.status = REJECTED;
    // 保存失败之后的原因
    this.reason = reason
    // 判断失败回调是否存在
    // this.failCallback && this.failCallback(this.reason);
    while(this.failCallback.length) this.failCallback.shift()(this.reason);
  }

  then(successCallback,failCallback){
    successCallback = successCallback ? successCallback : value => value
    failCallback = failCallback ? failCallback : reason => {throw reason}
    let promise2 = new MyPromise((resolve,reject)=>{
      // 判断状态
      if(this.status === FULFILLED){
        // 防止promise2未生成 所以通过setTimeout改为异步代码
        setTimeout(()=>{
          try {
            let x = successCallback(this.value);
            // 判断 x 的值是普调值还是promise对象
            // 如果是普调值 直接调用resolve
            // 如果是promise对象 查看promise对象返回的结果
            // 再根据promise对象返回的结果 决定调用resolve 还是调用reject
            resolvePromise(promise2,x,resolve,reject);
          } catch (error) {
            reject(error)
          }
        },0)
      }else if(this.status === REJECTED){
        setTimeout(()=>{
          try {
            let x = successCallback(this.value);
            // 判断 x 的值是普调值还是promise对象
            // 如果是普调值 直接调用resolve
            // 如果是promise对象 查看promise对象返回的结果
            // 再根据promise对象返回的结果 决定调用resolve 还是调用reject
            failCallback(promise2,x,resolve,reject);
          } catch (error) {
            reject(error)
          }
        },0)
      }else{ //代表当前状态为等待状态
        this.successCallback.push(()=>{
          setTimeout(()=>{
            try {
              let x = successCallback(this.value);
              // 判断 x 的值是普调值还是promise对象
              // 如果是普调值 直接调用resolve
              // 如果是promise对象 查看promise对象返回的结果
              // 再根据promise对象返回的结果 决定调用resolve 还是调用reject
              failCallback(promise2,x,resolve,reject);
            } catch (error) {
              reject(error)
            }
          },0)
        })
        this.failCallback.push(()=>{
          failCallback();
        });
      };
    });
    return promise2;
  }

  resolvePromise(promise2,x,resolve,reject){
    if(promise2 === x){
      return reject(new TypeError('xxxxx'));
    }
    if(x instanceof MyPromise){
      // promise对象
      // x.then(value=>{resolve(value)},(reason)=>{reject(reason)})
      x.then(resolve,reject)
    }else{
      // 普调值
      resolve(x);
    }
  }

  finally(callback){
    return this.then(value=>{
      return MyPromise.resolve(callback()).then(()=>value)
    },(reason)=>{
      return MyPromise.resolve(callback()).then(()=>{throw reason})
    })
  }

  static all(array){
    let result = [];
    let index = 0;
    return new MyPromise((resolve,reject)=>{
      function addData(key,value){
        result[key] = value;
        index++
        if(index === array.length){
          resolve(result)
        }
      }
      for(let i = 0; i < array.length; i++){
        let current = array[i];
        if(current instanceof MyPromise){//是否为Promise对象
          current.then(value=>addData(i,value),reason => reject(reason))
        }else{//普通值
          addData(i,array[i]);
        }
      }
    })
  }

  static resolve(value){
    if(value instanceof MyPromise) return value;
    return new MyPromise(resolve => resolve(value));
  }
}
```

### catch 方法的实现

```js
const { reject } = require("lodash");

const PEMDING = 'pending';//等待
const FULFILLED = 'fulfilled';//成功
const REJECTED = 'rejected';//失败

class MyPromise{

  constructor(execurot){
    try {
      execurot(this.resolve,this.reject);//立即执行的执行器
    } catch (error) {
      this.reject(error)      
    }
  }

  // promise 状态
  status = PEMDING;
  // 成功之后的值
  value = undefined;
  // 失败的原因
  reason = undefined;

  // 成功回调
  successCallback = [];
  // 失败回调
  failCallback = [];

  resolve = value => { //箭头函数是为了避免 this 指向出问题 要指向class
    // 如果状态不为pending 阻止程序向下执行
    if(this.status !== PEMDING) return;
    // 讲状态改为成功
    this.status = FULFILLED;
    // 保存成功之后的值
    this.value = value;
    // 判断成功回调是否存在
    // this.successCallback && this.successCallback(this.value);
    while(this.successCallback.length) this.successCallback.shift()();
  }

  reject = reason => {
    // 如果状态不为pending 阻止程序向下执行
    if(this.status !== PEMDING) return;
    // 讲状态改为失败
    this.status = REJECTED;
    // 保存失败之后的原因
    this.reason = reason
    // 判断失败回调是否存在
    // this.failCallback && this.failCallback(this.reason);
    while(this.failCallback.length) this.failCallback.shift()(this.reason);
  }

  then(successCallback,failCallback){
    successCallback = successCallback ? successCallback : value => value
    failCallback = failCallback ? failCallback : reason => {throw reason}
    let promise2 = new MyPromise((resolve,reject)=>{
      // 判断状态
      if(this.status === FULFILLED){
        // 防止promise2未生成 所以通过setTimeout改为异步代码
        setTimeout(()=>{
          try {
            let x = successCallback(this.value);
            // 判断 x 的值是普调值还是promise对象
            // 如果是普调值 直接调用resolve
            // 如果是promise对象 查看promise对象返回的结果
            // 再根据promise对象返回的结果 决定调用resolve 还是调用reject
            resolvePromise(promise2,x,resolve,reject);
          } catch (error) {
            reject(error)
          }
        },0)
      }else if(this.status === REJECTED){
        setTimeout(()=>{
          try {
            let x = successCallback(this.value);
            // 判断 x 的值是普调值还是promise对象
            // 如果是普调值 直接调用resolve
            // 如果是promise对象 查看promise对象返回的结果
            // 再根据promise对象返回的结果 决定调用resolve 还是调用reject
            failCallback(promise2,x,resolve,reject);
          } catch (error) {
            reject(error)
          }
        },0)
      }else{ //代表当前状态为等待状态
        this.successCallback.push(()=>{
          setTimeout(()=>{
            try {
              let x = successCallback(this.value);
              // 判断 x 的值是普调值还是promise对象
              // 如果是普调值 直接调用resolve
              // 如果是promise对象 查看promise对象返回的结果
              // 再根据promise对象返回的结果 决定调用resolve 还是调用reject
              failCallback(promise2,x,resolve,reject);
            } catch (error) {
              reject(error)
            }
          },0)
        })
        this.failCallback.push(()=>{
          failCallback();
        });
      };
    });
    return promise2;
  }

  resolvePromise(promise2,x,resolve,reject){
    if(promise2 === x){
      return reject(new TypeError('xxxxx'));
    }
    if(x instanceof MyPromise){
      // promise对象
      // x.then(value=>{resolve(value)},(reason)=>{reject(reason)})
      x.then(resolve,reject)
    }else{
      // 普调值
      resolve(x);
    }
  }

  finally(callback){
    return this.then(value=>{
      return MyPromise.resolve(callback()).then(()=>value)
    },(reason)=>{
      return MyPromise.resolve(callback()).then(()=>{throw reason})
    })
  }

  catch(failCallback){
    return this.then(undefined,failCallback)
  }

  static all(array){
    let result = [];
    let index = 0;
    return new MyPromise((resolve,reject)=>{
      function addData(key,value){
        result[key] = value;
        index++
        if(index === array.length){
          resolve(result)
        }
      }
      for(let i = 0; i < array.length; i++){
        let current = array[i];
        if(current instanceof MyPromise){//是否为Promise对象
          current.then(value=>addData(i,value),reason => reject(reason))
        }else{//普通值
          addData(i,array[i]);
        }
      }
    })
  }

  static resolve(value){
    if(value instanceof MyPromise) return value;
    return new MyPromise(resolve => resolve(value));
  }
  
}
```

