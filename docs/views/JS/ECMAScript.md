---
title: '关于 ECMAScrip'
date: 2020-09-30
tags:
- 'JavaScript基础'
- '学习笔记'
categories:
- 'JavaScript基础'
---

关于 ECMAScrip 和 ES6 详解

<!-- more -->

# 关于 ECMAScrip

## 概念

- ECMAScrip 也是一门编程语言
- ECMAScrip 只提供了最基本的语法(如函数的定义等)
- JavaScript 语言本身指的就是 ECMAScrip
- 2015年开始 ES 把持每年一个版本的迭代

## ES 2015 概述

- ES6 一般指 ES2015版本
- 在一些资料中 ES6 也指 ES2015 后的所有版本 (如 在 ES6 的async await 等[其实是ES2017的版本])

## ES 2015 let 与块级作用域

```js
// let
if(true){
  let foo = 'zce';
}
console.log(foo);//undefined

// var
if(true){
  var foo = 'zce';
}
console.log(foo);//zce
```

## ES 2015 const

### 定义

- 衡量
- 要设置初始值
- 不能改变的是内存指向,并非所有属性

## ES 2015 数组的解构

```js
const arr = [100,200,300];
const [foo,bar,baz] = arr;
console.log(foo,bar,baz)

const [,,baz] = arr;
console.log(baz)

const [foo,rest] = arr;
console.log(rest);

const [foo] = arr;
console.log(foo);

const [foo,bar,baz,more] = arr;
console.log(more);//undefined

const [foo,bar,baz,more = 'default value'] = arr;
console.log(more);//default value
```

## ES 2015 对象的解构

对象的解构是根据属性名去提取,而不是像数组一样用下标

```js
const obj = {name:'zhy',age:18};
const {name} = obj;
console.log(name);//zhy
---------
const obj = {name:'zhy',age:18};
const name = 'tom';
const {name:objName = 'jack'} = obj;
console.log(objName)
```
- 还有数组的同样操作

## ES 2015 模板字符串

- 支持直接换行
- 可以通过 ${} 去插入** 任何标准的JavaScript语句 **
- 可以设置带标签的模板字符串

## ES 2015 字符串拓展方法

- includes(xxx) 是否包含 xxx
- startsWith(xxx) 是否是以 xxx 为开头
- endsWith(xxx) 是否是以 xxx 为结尾

## ES 2015 函数形参新语法

- 设置默认值 (在形参后加入 = xxx)
- 剩余参数 直接在形参前加入 ... 该形参会代表从这个位置后的所有参数 (只能出现在最后一位,使用一次)
- 展开数组 如 console.log(...array)

## ES 2015 箭头函数

- 写法简洁
```js
function icn (number){
  return number + 1
};
// 二者等价
const icn = n => n + 1
```

- 不会改变 this 的指向
```js
const person = {
  name:'tom',
  sayHi:function(){
    console.log(this.name)
  }
}
person.sayHi();//tom

const person = {
  name:'tom',
  sayHi:() => {
    console.log(this.name)
  }
}
person.sayHi();//undefined

const person = {
  name:'tom',
  sayHi:() => {
    console.log(this.name)
  },
  sayHiAsync:function(){
    setTimeout(function(){
      console.log(this.name) //undefined
    },1000)
    setTimeout(()=>{
      console.log(this.name)//tom
    },1000)
  }
}
person.sayHi();//undefined
```

## ES 2015 对象字面量的增强

```js
const bar = '345'
const obj = {
  foo:123,
  // bar:bar, 等价于下面的
  bar,
  // method1:function(){
  //   console.log('method1')
  // },
  method1(){
    console.log('method1');
    console.log(this)
  },
  [1+1]:2,//表达式执行结果将会变为属性名
}
```

## ES 2015 Object.assign

```js
const source1 = {
  a:123,
  b:123
}

const target = {
  a:456,
  c:456
}

const result = Object.assign(target,source1);
console.log(target); //{a:123,c:456,b:123}
console.log(result === target);//true
```

## ES 2015 Proxy

```js
// Proxy 对象

const person = {
  name:'zhy',
  age:20
}

const personProxy = new Proxy(person,{
  get(target,property){
    console.log(target,property);
    return 100
  },
  set(){}
})
console.log(personProxy.name); //{name:zhy,age:20} name   100

const personProxy = new Proxy(person,{
  get(target,property){
    return property in target ? target[property] : 'default'
  },
  set(target,property,value){
    if(property === 'age'){
      if(!Number.isInteger(value)){
        throw new TypeError(`${value} is not an int`)
      }
    }
    target[property] = value
  }
})
```

## ES 2015 Reflect

- Reflect 内部封装了一系列对对象的底层操作
- 无法使用 new 关键字 是一个静态类
- 对 Proxy 处理对象的方法的默认实现
- 统一提供一套用于操作对象的API

```js
const obj = {
  foo:'123',
  bar:'456'
}

const proxy = new Proxy(obj,{
  get(target,property){
    console.log('watch logic~')
    return Reflect.get(target,property)
  }
})
```

## ES 2015 Class

### Class 的创建
```js
function Person(name){
  this.name = name;
}
Person.prototype.say = function(){
  console.log(`hi,my name is ${this.name}`);
}

class Person {
  constructor(name){//当前类型的构造函数
    this.name = name
  }

  say(){
    console.log(`hi,my name is ${this.name}`);
  }
}

const p = new Person('tom');
p.say()
```

### Class static

```js
class Person {
  constructor(name){//当前类型的构造函数
    this.name = name
  }

  say(){
    console.log(`hi,my name is ${this.name}`);
  }

  static create(name){ //静态方法this执行class 并不会指向某个实例对象
    return new Person(name)
  }
}

const tom = Person.create('tom')
tom.say();
```

### Class extends(继承)

```js
class Person {
  constructor(name){//当前类型的构造函数
    this.name = name
  }

  say(){
    console.log(`hi,my name is ${this.name}`);
  }
}

class Student extends Person{
  constructor(name,number){
    super(name);//指向父类
    this.number = number;
  }

  hello(){
    super.say();
    console.log(`my school number is ${this.number}`)
  }
}
```

## ES 2015 Map

- Map 对象键值对 key 可以是一个对象,可以是一个函数, 可以任何

## ES Symbol

- 主要作用就是为对象添加一个独一无二的属性标识符
- 一共定义了七种数据类型
- foo('string')方法 相同的字符串得到的Symbol相同,如果传入不是字符串,会转换为字符串
- 对象中的 Symbol 属性无法被循环,keys stringify等方法获取到[但是可以被Object.getOwnPropertySymbols获取到]

```js
const s = Symbol();
console.log(s);
console.log(typeof s);

const obj = {};
obj[Symbol()] = '123';
console.log(obj);

// a.js
const name = Symbol();
const person = {
  [name]:'zhy',
  say(){
    console.log(this[name])
  }
}

// b.js
person.say();
```

## ES for..of

- for...of 循环是一种数据统一遍历方式(但是 Object 会报错)
> ES 中能够表示有结构的数据类型越来越多
>> ES2015 提供了 lterable 接口,实现 lterable 接口就是for...of 的前提
- 通过js实现可迭代接口

```js
const obj = {
  [Symbol.iterator]:function(){
    return {
      next:function(){
        return {
          value:'zhy',
          done:true
        }
      }
    }
  }
}
```