---
title: '什么是函子'
date: 2020-09-21
tags:
- 'JavaScript基础'
- '学习笔记'
categories:
- 'JavaScript基础'
---

关于 函子 概念

<!-- more -->

# 什么是函子

## 概念

- 容器: 包含值和值的变形关系(这个变形关系就是函数)

- 函子: 是一个特殊的容器,通过一个普通的对象来实现,该对象具有map方法,map方法可以运行一个函数对值进行处理(变形关系)

## 手写函子

```js
class Container{
  // 避免在调用时一直看到new关键字,所以在class内部定义一个方法
  static of (value){
    return new Container(value)
  }

  constructor (value){
    this._value = value
  }

  map(fn){
    return Container.of((fn(this._value)))
  }
}

let r = Container.of(5)
  .map(x => x + 2)
  .map(x => x * x);
console.log(r) //49
```

## 总结

- 函数式编程的运算不直接操作值,而是由函子完成

- 函子就是一个实现了 map 契约的对象

- 我们可以吧函子想象成一个盒子,这个盒子里封装了一个值

- 想要处理盒子中的值,我们需要给盒子的 map 方法传递一个处理值的函数(纯函数),由这个函数来对值进行处理

- 最终 map 方法返回一个包含新值的盒子(函子)

## 延伸处理空值问题

```js
Container.of(null)//原期待传入字符串
  .map(x => x.toUpperCase())
// 会报错
```

### MayBe 函子
- 我们在编程的过程中可能会遇到很多错误,需要对这些错误做相应的处理
- MayBe 函子的作用就是可以对外部的空值情况做处理(空值副作用在允许的范围)

```js
// MayBe 函子
class MayBe {

  static of (value){
    return new MayBe(value)
  }

  constructor (value){
    this._value = value
  }

  map(fn){
    return this.isNothing() ? MayBe.of(null) : MayBe.of(fn(this._value))
  }

  isNothing(){
    return this._value === null || this._value === undefined
  }
}

// let r = MayBe.of(null)
//           .map(x => x.toUpperCase())

// console.log(r) //null

let r = MayBe.of('hello world')
  .map(x => x.toUpperCase())
  .map(x => null)
  .map(x => x.split(' '))
console.log(r) // null 
// 可以出现null 但是无法判断是哪个过程导致出现null
```

#### MayBe 函子总结

- 对函子的undefined && null 在调用fn之前先做判断

### Either 函子

- Either 两者中的任何一个,类似于if...else的处理

- 异常会让函数变得不纯, Either 函子可以用来做异常处理

```js
class Left{

  static of (value){
    return new Left(value)
  }

  constructor(value){
    this._value = value
  }

  map(fn){
    return this
  }
}

class Right {

  static of (value){
    return new Right(value)
  }

  constructor(value){
    this._value = value
  }

  map(fn){
    return Right.of(fn(this._value))
  }
}

// let r1 = Right.of(12).map( x => x + 2);
// let r2 = Left.of(12).map( x => x + 2);
// console.log(r1,r2)


function parseJSON(str){
  try{
    return Right.of(JSON.parse(str))
  }catch(e){
    return Left.of({error:e.message})
  }
}
// let r = parseJSON('{name:zs}');
let r = parseJSON('{"name":"zs"}')
          .map(x => x.name.toUpperCase());
console.log(r)
```

#### Either 函子总结

- 其实就是对函子做的处理增加try catch 捕捉 如果捕捉到错误,返回一个返回保存信息的函子

### IO 函子

- IO函子中的 _value 是一个函数,这里是把函数作为值来处理
- IO函子可以把不纯的动作存储到 _value 中,延迟执行这个不存的操作(惰性执行),包装当前的操作纯
- 把不纯的操作交给调用者来处理

```js
const fp = require('lodash/fp');
class IO {

  static of(value){
    return new IO(function(){
      return value
    })
  }

  constructor(fn){
    this._value = fn
  }

  map(fn){
    return new IO(fp.flowRight(fn,this._value))
  }
}

// 调用
let r = IO.of(process).map( p => p.execPath);
console.log(r._value());
```

### Task 函子

- 异步操作的函子

- 通过 folktale 库的 task 函数演示异步函子

```js
const fs = require('fs');
// folktale 中的task
const { task } = require('folktale/concurrency/task');
const { split } = require('lodash');
const {split,find} = require('lodash/fp')

function readFile(filename){
  return task(resolver => {
    fs.readFile(filename,'utf-8',(err,data)=>{
      if(err) resolver.reject(err);

      resolver.resolve(data);
    })
  })
}

readFile('package.json')
  .map(split('\n'))
  .map(find(x=> x.includes('version')))
  .run()
  .listen({
    onRekected:err=>{
      console.log(err)
    },
    onResolved:value=>{
      console.log(value)
    }
  })
```

### Pointed 函子

- Pointed 函子是实现了 of 方法的函子
- of 方法是为了避免使用 new 来创建对象,更深层的含义是 of 方法用来把值放到上下文 context (把值放到容器中,使用 map 来处理值)

### Monad 函子

- 解决IO函子多次调用,函子嵌套问题

```js
const fs = require('fs')
const fp = require('lodash/fp')

class IO {

  static of(value){
    return new IO(function(){
      return value
    })
  }

  constructor(fn){
    this._value = fn
  }

  map(fn){
    return new IO(fp.flowRight(fn,this._value))
  }

  join(){
    return tjos._value()
  }

  flatMap(fn){
    return this.map(fn).join()
  }
}


```

