---
title: '函子的认识'
date: 2021-08-24
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
- JavaScript基础
categories:
- JavaScript基础
---
### 一、什么是函子？

1、容器：包含值和值关系的变形关系（这个变形关系就是容器）

2、函子：是一个特殊的容器，通过一个普通的对象来实现，该对象有map方法，map方法可以运行一个函数对值进行处理（变形关系）

### 二、函子的作用

在函数式编程中把副作用控制到可控的范围内，也可以用来异常处理和异步操作

### 三、函子的基本编程


```js
    class Container{
        // 创建一个静态方法,用来给函子赋值
        static of(value){
            return new Container(value)
        }
        constructor(value){
            this._value = value; 
        }
        // 对外公布方法，传入函数对值进行处理
        map(fn){
            // 返回一个新的函子，可以链式调用 
            return Container.of(fn(this._value))
        }
    }
```

### 四、常见的函子
1、MayBe函子(其实就是对一些副作用的控制，也就是增加是否超出预料之外的传值的处理，比如空值)
```js
    class MayBe{
        // 创建一个静态方法,用来给函子赋值
        static of(value){
            return new MayBe(value)
        }
        constructor(value){
            this._value = value; 
        }
        // 空值判断方法
        isNothing(value){
            return this._value === null || this._value === undefined;
        }
        // 对外公布方法，传入函数对值进行处理
        map(fn){
            // 返回一个新的函子，可以链式调用 
            return this.isNothing() ? Maybe.of(null) : MayBe.of(fn(this._value))
        }
    }
    
```
2、Either函子（处理异常的函子,通俗来讲就是创建两个函子，捕获函子的异常情况）

```js
    // 错误的处理函子 
    class MyError{
         // 创建一个静态方法,用来给函子赋值
        static of(value){
            return new MyError(value)
        }
        constructor(value){
            this._value = value; 
        }
        // 对外公布方法，传入函数对值进行处理
        map(fn){
            // 返回一个新的函子，可以链式调用 
            return MyError.of(this._value)
        }
    }
    // 正确的处理函子
    class Right{
         // 创建一个静态方法,用来给函子赋值
        static of(value){
            return new Right(value)
        }
        constructor(value){
            this._value = value; 
        }
        // 对外公布方法，传入函数对值进行处理
        map(fn){
            // 返回一个新的函子，可以链式调用 
            return Right.of(fn(this._value))
        }
    }
    // 函子调用
    function parseJSON(str){
        try{
            return Right.of(JSON.parse(str))
        } catch (e){
            return MyError.of({ error: e.message })
        }
    }
    
    // 创建错误的json对象
    console.log(parseJSON('{ name: zs }').map(x => x.toUpperCase()));
    console.log(parseJSON('{ "name": "zs" }').map(x => x.name.toUpperCase()));
    
```
这是上面函数的运行结果

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/10d3c152d34540a3946c426003b0e661~tplv-k3u1fbpfcp-watermark.image)
3、IO函子（函子的_value是一个函数，把所有的处理函数通过函数组合结合起来，不纯的操作交给调用者，一切运行结果由调用者来承担，类似甩锅行为）

```js
// 引入lodash的fp模块, fp模块里的函数默认都是柯里化之后的函数
const fp = require('lodash/fp');
class IO{
  // 创建一个静态方法,用来给函子赋值
    static of(value){
        return new IO(function(){
            return value
        })
    }
    constructor(fn){
        this._value = fn; 
    }
    // 对外公布方法，传入函数对值进行处理
    map(fn){
        // 通过函数组合把函数组合起来返回一个新的函子，可以链式调用 
        return new IO(fp.flowRight(fn, this._value))
    }
}
```
4、Task函子（处理异步任务）

```js
const { task } = require('folktale/concurrency/task');
const fs = require('fs');
const { split, find } = require('lodash/fp');
function readFile(filename){
    // 返回task函子 
    return task(resolver => {
        fs.readFile(filename, 'utf-8', (err, data) => {
            if(err) resolver.reject(err);
            resolver.resolve(data);
        })
    })
}

// 读取文件
readFile('package.json').map(split('\n')).map(find(x => x.find(x.includes(version)))).run().listen({
    onRejected: err => {
        console.log(err)
    },
    onResolved: value => {
        console.log(value)
    }
})

```
5、Pointed函子（实现了of静态方法的函子，主要用来避免new关键字来实例对象）

6、Monad(单子)函子(解决函子嵌套问题的函子 )

// IO函子嵌套的问题
```js
    const fp = require('lodash/fp');
    class IO{
      // 创建一个静态方法,用来给函子赋值
        static of(value){
            return new IO(function(){
                return value
            })
        }
        constructor(fn){
            this._value = fn; 
        }
        // 对外公布方法，传入函数对值进行处理
        map(fn){
            // 通过函数组合把函数组合起来返回一个新的函子，可以链式调用 
            return new IO(fp.flowRight(fn, this._value))
        }
        // 扁平化map方法的函子,在
        join(){
            return this._value();
        }
        flatMap(fn){
            return this.map(fn).join()
        }
    }
    const readFile = function(filename){
        return IO.of(function(){
            return fs.readFileSync(filenam, 'utf-8')
        })
    }
    const print = function(x){
        return IO.of(function(){
            console.log(x);
            return x;
        })
    }
    const cat = fp.flowRight(print, readFile);// IO(IO(x))
    // 调用
    let r = cat('package.json')._value()._value();
    // 使用单子函子调用(只需要调用实现功能即可，不需关心函子内部的实现)，可读性更高
    readFile('package.json').flatMap(print).join();
    /* 执行过程大概是这样的 (主要注意函子的this._value的变化)
    执行readfile时： 返回一个包含读取文件函数的函子
    执行flatmap时： 
    1、先执行map: 把读取文件的结果传递到print函数中，返回一个函子包含着print函数
    2、执行join方法: 执行print方法，返回print函数包裹的函子
    执行join时：把函子中的函数的执行结果返回出来
    
    注释： map方法一般处理普通函数，flatMap一般处理返回函子的函数
    */
    
```




### 五、总结
```
1、函数式编程的运算不会直接操作值，而是由函子完成

2、函子就是一个实现了map契约的对象

3、我们可以把函子想象成一个盒子，这个盒子里封装了一个值

4、想要处理盒子中的值，我们需要给盒子的map方法传递一个处理值的函数（纯函数），由这个函数对值进行处理

5、最终map方法返回一个包含新值的函子
```