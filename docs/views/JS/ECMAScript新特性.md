---
title: '关于 ECMAScrip'
date: 2020-09-30
tags:
- 'JavaScript基础'
- '学习笔记'
categories:
- 'JavaScript基础'
---
# 一、ECMAScript介绍
ECMAScript只提供了最基本的语法，不能用于实际的功能开发，而我们所使用的javaScript就是ECMAScript的一个语法标准, 在它的基础上做出了拓展。在应用于web服务时，ECMAScript和Web APIs（BOM和DOM）共同构成js的语法标准。而在nodejs中,ECMAScript和Node APIs（fs、net、etc.）共同构成js的语法标准。ECMAScript大致分为两个阶段,ESMAScript 2015之前与之后，ECMAScript2015后的版本统称为ES6,这篇文章的主要讲的就是ES6

 # 二、新特性
### 1、 块级作用域（let const)

let、const不具备变量提升，在变量未声明之前不能使用

let、const 声明的变量只在当前块级作用域有效

let与const的区别： let声明的变量可以被改变， const 声明的变量不可被改变，而复合类型中，const声明的变量存放的则是指向堆空间中复合类型存放的地址，所以变量的属性是可以被改变的

建议： 不使用var, 尽量用const, 配合使用let
### 2、解构赋值

数组的解构赋值(依次赋值， 可以设置默认值)


```js
const arr = ['张三', '男'];
const [ name, sex ] = arr;
const [ , sex1 ] = arr;
console.log(name, sex) // 张三 男
console.log(sex1) // 男
```
对象的解构赋值（可以对对象的属性进行重命名，可以设置默认值）

```js
const obj = { name: '张三', sex: '男' }
const { name, sex: sex1, age = 18 } = obj;
console.log(name, sex1, age) // 张三 男 18
```
### 3、模版字符串（可以在字符串中插入变量，也可以用函数进行处理）


```js
 const [name, sex] = ['zhangsan', true];
 console.log(`${name} is ${sex}`); //  zhangsan is true
 // 带标签的模版字符串
 console.log`${name} is ${sex}`
```

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e9b4c60622448df8bd130381d5eb8a0~tplv-k3u1fbpfcp-watermark.image)


这就相当于直接当作参数传入了函数,所以我们可以自定义模版字符串的处理器来实现输出不同的结果

```js
// 定义处理函数
const [name, sex] = ['zhangsan', true];
const strDeal = (args, name, sex) => `${name} is ${sex ? 'man' : 'woman'}` 
console.log(strDeal`${name} is ${sex}`)
```


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a7ac6b3262a46a8b6559a742497d2a8~tplv-k3u1fbpfcp-watermark.image)

### 4、字符串的拓展方法

```js
    const str = 'zhangsan is man';
    // startsWith方法(判断字符串以什么开头)
    str.startsWith('zhang'); // true
    // endsWith(判断字符串以什么结尾)
    str.endsWith('n'); // true
    // includes(判断字符串是否包括某个字符串)
    str.includes('is'); // true
    
    // padEnd padStart方法
    指定长度以及填充（主要用来对齐）

```

### 5、函数参数默认值

```js
 const defaultArg = (arg1 = 'hello') => { console.log(arg1) };
 console.log( defaultArg()); // hello
 console.log( defaultArg('hi')); // hi
```

### 6、展开运算符(常用于数组合并和对象合并或更新)

```js
// 函数调用中的应用（可以明显感觉到更便捷了）
const arr = [1, 2 ,3]; 
// es6之前
console.log(arr[0], arr[1], arr[2]);
console.log.apply(console, arr);
// es6
console.log(...arr);
```


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4863f0ee806c4f97879c719c8f5ee8d6~tplv-k3u1fbpfcp-watermark.image)

### 7、箭头函数
简化了函数的定义，且不会改变this的指向

### 8、对象字面量的增强

```js
 const bar = '345';
 const obj = {
     foo: 123,
     // 如果属性名和变量名相同，则直接写入即可
     bar,
     // 方法申明区别
     // es5
     method1: function(){}
     // es6
     method1(){}
     // 计算属性名可以直接添加
     [Math.random()]: '123'
 }
 console.log(obj)
```
### 对象拓展方法

```js
 // assign方法（用于对象属性的合并和属性值更新）
 // Object.assign(target, source1, ...)
 const source1 = { a: 123, b: 123 };
 const target = { a: 456, c: 456 };
 const result = Object.assign(target, source1); // { a: 456, b: 123, c: 456 } 相同属性覆盖，不同属性增加
 console.log(target === result); // true 两个对象是同一个
 
 // is方法
 console.log(0 == false); // true
 console.log(0 === false); // false 数据类型不同
 
 // 有时候触及一些数学的数据运算三等可能就会有问题，所以就提出了Object.is()方法来解决这种问题
 console.log(NaN === NaN); // false
 console.log(+0 === -0); // true
 
 console.log(Object.is(NaN, NaN)); // true
 console.log(Object.is(+0, -0)); // false
 
 // entries方法
把对象转化为二维数组，可以使用for of遍历
`new Map(Object.entries(obj))` // 对象转化为map类型
// fromEntries方法
把二维数组转换为对象
// getOwnPropertyDescriptors方法
获取描述对象属性
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88dcfbf39be84186b9ec17e9e464c04f~tplv-k3u1fbpfcp-watermark.image)

### 9、Proxy 代理
用来监听属性的读写
es5 主要用Object.defineProperty(target, property, desc) (典型应用 vue2)
es6 则提出了对象代理处理器来监听 (典型应用 vue3)


```js
const person = {
    name: 'zhangsan',
    age: 18
};
const personProxy = new Proxy(person, {
 get(target, property){
     console.log(target, property, 'get')
     return property in target ? target[property] : 'default'
 },
 set(target, property, value){
     console.log(target, property, value, 'set')
     // 进行一些处理
     if(property === 'age'){
         if(!Number.isInteger(value))throw new TypeError(`${value} is not an int`);
     }
     target[property] = value
 }
})
personProxy.age = 100 // 正常赋值
personProxy.age = 1.2 // 报错
console.log(personProxy.name) // zhangsan
console.log(personProxy.say) // default

```

### 10、reflect
Reflect对象  静态方法，不能通过new reflect（）调用，
Reflect对象的成员方法与proxy处理对象的默认实现，
统一了对象的操作方式。

```js
 const person = {
     name: 'zhangsan',
     age: 18
 };
 // 用法替换
 'name' in person => Reflect.has(person, 'name');
 delete obj.name => Reflect.deleteProperty(person, 'name');
 Object.keys(obj) => Reflect.ownkeys(person);
 ...
```
ECMAScript官方希望以后经过一段时间过渡后慢慢能规范写法，也就是前面的方法在以后会被废弃掉

### 11、 Promise
解决了传统异步编程中回调函数嵌套过深的问题

### 12、class类

```js
// es5
function Person(name){
    this.name = name
}
Person.prototype.say = function(){
    console.log(`hi,my name is ${name}`)
}

// es6
class Person{
    constructor(name){
        this.name = name;
    }
    say(){
        console.log(`hi,my name is ${this.name}`)
    }
    // 静态关键字 static
    // 注： 静态方法的this不会指向实例，而是指向类型
    static create(name){
        console.log(this, 'this');
        return new Person(name);
    }
}
const tom = Person.create('tom');
tom.say(); 
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6103f79755f4f92b9fb2c90f4da9e6e~tplv-k3u1fbpfcp-watermark.image)

##### 12-1、类的继承

```js
class Person{
    constructor(name){
        this.name = name;
    }
    say(){
        console.log(`hi,my name is ${this.name}`)
    }
}

class Student extends Person{
    constructor(name, grade){
        super(name)
        this.grade = grade;
    }
    hello(){
        super.say();
        console.log(`hello, my grade is ${this.grade}`)
    }
}

(new Student('zhangsan', 100)).hello();
```

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c2cca10a9c2440e9a3dbbc2ded3b345~tplv-k3u1fbpfcp-watermark.image)


### 13、 Set数据结构
  

```js
const mySet = new Set();
mySet.add(1).add(2).add(3).add(4); // 链式结构，{ 1, 2, 3, 4 }
mySet.forEach(i => console.log(i)) // 1,2,3,4
for(let i of mySet){ console.log(i) } // 1,2,3,4
console.log(mySet.size) // 获取长度 4
console.log(mySet.has(3)) // true
console.log(mySet.delete(3)) // true 删除
console.log(mySet) // { 1, 2, 4 }
s.clear() // 清除
// 数组去重
const arr = [1, 3, 1];
Array.from(new Set(arr)); 或者 [...new Set(arr)] // [1, 3] 

```

### 14、map数据结构(真正意义上的键值对，键不会转化为string类型)

```js
const myMap = new Map();
const tom = {name: 'tom'};
myMap.set(tom, 90);
myMap.has(); // 判断是否有
myMap.delete(); // 删除
myMap.get(); // 读取
myMap.clear; // 清空
myMap.forEach((value, key) => { console.log(value, key) })// 遍历
```

### 15、Symbol  新增基本数据类型(可以用于对象的键，主要用于解决标识冲突（唯一性）)
能创建唯一的值，不会出现冲突，主要用于创建对象的私有属性（应用场景）

### 16、for ...of
可以随时终止循环

```js
const arr = [100, 200, 300, 400]
for (const item of arr){
    if(item > 100) { 
        console.log(item);
        break; 
    }
} // 100 ,200
// 遍历map结构
const myMap = new Map();
myMap.set('tom', 18)
for (const [key, value] of myMap){
       console.log(key, value)
} // tom 18
```

### 17、 Iterable 可迭代接口

所有的基本类型都可以实现toString方法，是因为他们都实现了某种标准。那object无法实现for of遍历就是因为没有实现Iterable接口

```js
// 实现对象的可迭代接口
const obj = {
    store: [ 'foo', 'bar', 'baz' ],
    [Symbol.iterator]: function(){
        let index = 0;
        const self = this; // 保存this指向
        return {
            next: function(){
                const res = {
                    value: self.store[index],
                    done: index > self.store.length
                }
                index++;
                return res;
            }
        }
    }
}
for(const item of obj){
    console.log(item);
}
```

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d018fb38635146c68a8906ae72fc1615~tplv-k3u1fbpfcp-watermark.image)

### 18、生成器函数

生成器函数一般配合yield关键字来使用，在async、await函数出来之前常被用于解决回调地狱的问题；
```js
// 实现对象的可迭代接口
const obj = {
    store: [ 'foo', 'bar', 'baz' ],
    [Symbol.iterator]: function* (){
        for (let item of this.store){
            return item
        }
    }
}
for(const item of obj){
    console.log(item);
}
```

### 19、 Math方法拓展

```js
    // es5              // es6
    Math.pow(2, 10) => 2 ** 10
```

### 20、 数组方法拓展

```js
// includes()方法
es5的indexOf方法并不能查找数组中的NaN
```

### 21、装饰器
通过修饰的方法对所在组件或者函数进行方法或属性的拓展

### 22、async、await
解决异步编程问题