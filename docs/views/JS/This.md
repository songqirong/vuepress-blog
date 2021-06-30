---
title: '关于 this'
date: 2020-10-13
sticky: 1
tags:
- 博文
- JavaScript基础
categories:
- 博文
---

对于 JavaScript 中的 this,你是否还有困惑呢?

<!-- more -->

工作经验比较久的前端,应该都记得当初被 jQuery 支配的恐怖.经常需要在函数开头定义一个 that/vm/self 来代指 this.

所以衍生出很多情况下 this 的指向自己都看不懂的情况.针对于此,想着有时间做份整理.好好研究一下 this 指向.

## 前提

在 **严格模式** 下, this 的指向永远都是 undefined.

## 普通函数中的 this

我们写几个例子来分析

```js
function test(name) {
    console.log(name)
    console.log(this)
}
test('Tom')  //this 指向 window

var obj = {
  a:1,
  func:function(name){
    console.log(name)
    console.log(this) // this 指向 obj
  }
}
obj.func('Jerry')
```

咦?写完上述例子我发现虽然是一样的函数写法,但是他们的 this 指向是不同的.那我们再来试试另一种方式

```js
var obj = {
  a:1,
  func:function(){
    console.log(this) 
  }
}
var func2 = obj.func;
func2(); // this 指向 Window

function func3 (){
  console.log(this)
};

var obj2 = {
  a:2,
  func3:func3,
}

obj2.func3(); // this 指向 obj2

```

这个时候我心中有一个猜测~

**this的指向与谁去调用它有关,指向调用的父级**

我的推测原因如下:

- 直接声明函数时 func() => window.func() 所以指向 window

- 声明在对象中时 obj.func() 指向 obj 对象

抱着这个结论,我们再来看下在 setTimeout/setInterval 中的 this

## setTimeout/setInterval 中的 this

举个栗子

```js
var obj1 = {
  a:'xiaoming',//这个变量是为了在输出obj1的时候不要只有一个func,虽然也可,但是俺们觉得没啥辨识度
  func:function(){
    setTimeout(function(){
      console.log(this)
    },0)
  }
}
obj1.func(); // this 指向 window
```

咦?这个结论是不是和上述我说的总结不太一样呢?

其实**不是的**,因为 setTimeout 函数是 window 自带的函数之一,所以当我们写 setTimeout 其实等价于 window.setTimeout,所以指向window,这一点毛病也没有 🐶

所以,我觉得 我总结的 没毛病🐶(狗头保命)

**其实还有其他的方法可以更改this指向,如call,bind,apply等**

>等有空了,我再写上述相关的文章

>> 你问我啥时候有空?恩...谁知道呢🐶

## 箭头函数中的 this

在 ES6 的大版本更新中,官方终于解决了 this 调用的问题,推出了一种新的函数写法. **箭头函数**
在箭头函数中没有**this**的绑定. 可以看一个 MDN 上的示例

``` js
'use strict';
var obj = {
  a: 10
};

Object.defineProperty(obj, "b", {
  get: () => {
    console.log(this.a, typeof this.a, this);
    return this.a+10; 
   // 代表全局对象 'Window', 因此 'this.a' 返回 'undefined'
  }
});

obj.b; // undefined   "undefined"   Window {postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, frames: Window, …}

```

在上述示例中,第一个 this.a 为 undefined 为什么呢?

我们先根据定义分析,因为箭头函数中没有 this ,他就会去父级找 this . 但是在父级中只剩下 window,所以 this 指向了 window.

那么是这样么?我们大胆假设,小心求证

```js
var a = 1;
var obj = {
  a:2,
  func1:function(){
    console.log(this.a);
  },
  func2:()=>{
    console.log(this.a)
  }
};

obj.func1();// 2
obj.func2();// 1

```

我们发现,果不其然在箭头函数的使用中,不会产生 this 变量. 沿用了父级的 this. 那可能有人会问?就算沿用了父级的 this ,就一定是输出 window 么?

其实我们可以把 obj.func2() 理解为 window.obj.fun2() 这两者是等价的,因为我们的 obj 变量,其实是暴露在 window 上的

再举个栗子

```js
var a = 0;
var obj = {
  a:1,
  func1:function(){
    console.log(this.a);
  },
  func2:()=>{
    console.log(this.a)
  },
  obj2:{ //没错,就是套娃
    a:2,
    func1:function(){
      console.log(this.a);
    },
    func2:()=>{
      console.log(this.a);
    }
  },
  obj3:function(){
    return {
      a:3,
      func1:function(){
        console.log(this.a);
      },
      func2:()=>{
        console.log(this.a);
      }
    }
  }
}

obj.func1(); //1
obj.func2(); //0
obj.obj2.func1(); //2
obj.obj2.func2(); //0
obj.obj3().func1(); //3
obj.obj3().func2(); //1
```

在上述栗子中, fun1 的答案都是指向了当前对象的 a, func2 的答案却不是.这个就涉及到刚刚说的

this 是由普通函数生成的,当找不到的时候,就会在往上寻找,直至查找到 window.

所以关于箭头函数,我们可以用一句广告语来形容.

**我们不生产 this ,我们只是 this 的搬运工**

关于箭头函数,我们总结一下它与普通函数的区别

- 更短的函数(写法更短,更简洁)

- 没有单独的 this (不生成 this ,只是 this 的搬运工)

- 不绑定 arguments(但是在 ES6 中提供了参数新语法 ... )

关于 ES6 的更详细更新,可以查看我的另一篇学习笔记~ [点击此处](./ECMAScript)

好了,本篇文章到此结束.如果有错误,可以在评论中指出.

小菜鸡一枚,如有错误多多见谅