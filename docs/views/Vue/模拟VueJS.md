---
title: '学习模拟Vue.js响应式原理'
date: 2020-11-01
tags:
- 学习笔记
- vue
categories:
- 'vue'
---

学习 Vue 响应式原理,简单实现 Vue 响应式原理

<!-- more -->

## 数据响应式的核心原理

### Vue2.x

- [Vue 2.x深入响应式原理](https://cn.vuejs.org/v2/guide/reactivity.html)

- [MDN - Object.defineProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

- 浏览器兼容 IE8 以上(不兼容 IE8)

```js
// 模拟 Vue 中的 data 选项 
let data = {
  msg: 'hello'
}
// 模拟 Vue 的实例 let vm = {}
// 数据劫持:当访问或者设置 vm 中的成员的时候，做一些干预操作
Object.defineProperty(vm, 'msg', {
  // 可枚举(可遍历)
  enumerable: true,
  // 可配置(可以使用 delete 删除，可以通过 defineProperty 重新定义) configurable: true,
  // 当获取值的时候执行 
  get() {
    console.log('get: ', data.msg)
    return data.msg
  },
  // 当设置值的时候执行 
  set(newValue) {
  }
})
console.log('set: ', newValue)
if (newValue === data.msg) {
  return
}
data.msg = newValue
// 数据更改，更新 DOM 的值 document.querySelector('#app').textContent = data.msg
// 测试
vm.msg = 'Hello World'
console.log(vm.msg)
```

### Vue 3.x

- [MDN - Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

- 直接监听对象，而非属性。

- ES 6中新增，IE 不支持，性能由浏览器优化

```js
// 模拟 Vue 中的 data 选项 
let data = {
  msg: 'hello',
  count: 0
}
// 模拟 Vue 实例
let vm = new Proxy(data, {
  // 当访问 vm 的成员会执行 
  get(target, key) {
    console.log('get, key: ', key, target[key])
    return target[key]
  },
  // 当设置 vm 的成员会执行
  set(target, key, newValue) {
    console.log('set, key: ', key, newValue)
    if (target[key] === newValue) {
      return
    }
    target[key] = newValue
    document.querySelector('#app').textContent = target[key]
  }
})
// 测试
vm.msg = 'Hello World' 
console.log(vm.msg)
```

## Vue 发布订阅模式

- 发布/订阅模式由统一调度中心调用,因此发布者和订阅者不需要知道对方的存在

手写一个发布订阅模式

```js
class EventEmitter{

  constructor(){
    // {click:[fn1,fn2],change:[fn]}
    this.subs = Object.create(null)
  }

  // 注册事件
  $on(eventType,handler){
    this.subs[eventType] ? this.subs[eventType].push(handler) : this.subs[eventType] = [handler]
  }

  // 触发事件
  $emit(eventType){
    if(this.subs[eventType]){
      this.subs[eventType].forEach(handler=>{
        handler()
      })
    }
  }
}

let em = new EventEmitter();
em.$on('click',()=>{
  console.log(1)
})
em.$on('click',()=>{
  console.log(2)
})
em.$emit('click')
```

## Vue 观察者模式

- **观察者模式**是由具体目标调度的,比如当事件触发,Dep就会去调用观察者的方法,所以观察者模式的订阅者与发布者之间是存在依赖的

手写一个观察者模式

```js
// 发布者
class Dep {
  constructor(){
    // 记录所有的订阅者
    this.subs = []
  }

  addSub(sub){
    if(sub && sub.update){
      this.subs.push(sub)
    }
  }

  notify(){
    this.subs.forEach(sub=>{
      sub.update()
    })
  }
}

// 观察者-(订阅者)
class Watcher{
  update(){
    console.log('update')
  }
}

let dep = new Dep
let watcher = new Watcher()

dep.addSub(watcher)

dep.notify()
```

## Observer

### 功能

- 负责把 data 选项中的属性转换成响应式数据

- data 中的某个属性也是对象，把该属性转换成响应式数据 数据变化发送通知

### 实现

```js
class Vue{
  constructor(options){
    // 1. 通过属性保存选项的数据
    this.$options = options || {}
    this.$data = options.data || {}
    this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el
    // 2. 把data中的成员转换成 getter 和 setter,注入到vue实例中
    this._proxyData(this.$data)
    // 3. 调用 observer 对象,监听数据的表达式
    new Observer(this.$data)
    // 4. 调用 compoler 对象,解析指令和差距表达式
  }

  _proxyData(data){
    // 遍历data中的所有属性
    Object.keys(data).forEach(key => {
      // 把data的属性注入到vue实例中
      Object.defineProperty(this,key,{
        enumerable:true,
        configurable:true,
        get(){
          return data[key]
        },
        set(newValue){
          if(newValue === data[key]){
            return
          }
          data[key] = newValue
        }
      })
    })
  }
}


class Observer{

  constructor(data){
    this.walk(data)
  }

  walk(data){
    // 1. 判断data是否是对象
    if(Object.prototype.toString.call(data) !== '[object Object]'){
      return
    }
    // 2. 遍历data对象的所有属性
    Object.keys(data).forEach(key => {
      this.defineReactive(data,key,data[key])
    })
  }

  defineReactive(obj,key,val){
    let self = this
    this.walk(val)
    Object.defineProperty(obj,key,{
      enumerable:true,
      configurable:true,
      get(){
        return val
      },
      set(newValue){
        if(newValue === val){
          return
        }
        val = newValue
        self.walk(newValue)
      }
    })
  }
}
```

## Compiler

- 负责编译模板,解析指令/插值表达式
- 负责页面的首次渲染
- 当数据变化后重新渲染视图

```js
const { keys } = require("./docs/.vuepress/config/nav")

class Vue{
  constructor(options){
    // 1. 通过属性保存选项的数据
    this.$options = options || {}
    this.$data = options.data || {}
    this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el
    // 2. 把data中的成员转换成 getter 和 setter,注入到vue实例中
    this._proxyData(this.$data)
    // 3. 调用 observer 对象,监听数据的表达式
    new Observer(this.$data)
    // 4. 调用 compoler 对象,解析指令和差距表达式
    new Compiler(this)
  }

  _proxyData(data){
    // 遍历data中的所有属性
    Object.keys(data).forEach(key => {
      // 把data的属性注入到vue实例中
      Object.defineProperty(this,key,{
        enumerable:true,
        configurable:true,
        get(){
          return data[key]
        },
        set(newValue){
          if(newValue === data[key]){
            return
          }
          data[key] = newValue
        }
      })
    })
  }
}


class Observer{

  constructor(data){
    this.walk(data)
  }

  walk(data){
    // 1. 判断data是否是对象
    if(Object.prototype.toString.call(data) !== '[object Object]'){
      return
    }
    // 2. 遍历data对象的所有属性
    Object.keys(data).forEach(key => {
      this.defineReactive(data,key,data[key])
    })
  }

  defineReactive(obj,key,val){
    let self = this
    this.walk(val)
    Object.defineProperty(obj,key,{
      enumerable:true,
      configurable:true,
      get(){
        return val
      },
      set(newValue){
        if(newValue === val){
          return
        }
        val = newValue
        self.walk(newValue)
      }
    })
  }
}

class Compiler{
  constructor(vm){
    this.el = vm.$el
    this.vm = vm
    this.compile(this.el)
  }

  // 编译模板,处理文本节点和元素节点
  compile(el){
    let childNodes = el.childNodes
    Array.from(childNodes).forEach(node => {
      if(this.isTextNode(node)){
        this.compileText(node)
      }else if(this.isElementNode(node)){
        this.compileElement(node)
      }

      // 判断node节点,是否有字节点,如果有字节点,要递归调用compile
      if(node.childNodes && node.childNodes.lentth){
        this.compile(node)
      }
    })
  }

  // 编译元素节点,处理指令
  compileElement(node){
    // 遍历所有属性节点
    Array.from(node.attributes).forEach(attr=>{
      // 判断是否是指令
      let attrName = attr.attrName
      if(this.isDirective(attrName)){
        // v-text -> text
        attrName = attrName.substr(2)
        let key = attr.value
        this.update(node,key,attrName)
      }
    })
  }

  update(node,key,attrName){
    let updateFn = this[attrName+'Update']
    updateFn && updateFn(node,this.vm[key])
  }

  // 处理 v-text 指令
  textUpdater(node,value){
    node.textContent = value
  }

  modelUpdater(node,value){
    node.value = value
  }

  // 编译文本节点,处理插值表达式
  compileText(node){
    // {{ msg }}
    let reg = /\{\{\(.+?)}\}/
    let value = node.textContent
    if(reg.test(value)){
      let key = RegExp.$1.trim()
      node.textContent = value.replace(reg,this.vm[key])
    }
  }

  // 判断元素属性是否是指令
  isDirective(attrName){
    return attrName.statrsWith('v-')
  }

  // 判断节点是否是文本节点
  isTextNode(node){
    return node.nodeType === 3
  }

  // 判断节点是否是元素节点
  isElementNode(node){
    return node.nodeType === 1
  }
}
```

## Dep

- 收集依赖,添加观察者
- 通知所有观察者

```js
const { keys } = require("./docs/.vuepress/config/nav")

class Vue{
  constructor(options){
    // 1. 通过属性保存选项的数据
    this.$options = options || {}
    this.$data = options.data || {}
    this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el
    // 2. 把data中的成员转换成 getter 和 setter,注入到vue实例中
    this._proxyData(this.$data)
    // 3. 调用 observer 对象,监听数据的表达式
    new Observer(this.$data)
    // 4. 调用 compoler 对象,解析指令和差距表达式
    new Compiler(this)
  }

  _proxyData(data){
    // 遍历data中的所有属性
    Object.keys(data).forEach(key => {
      // 把data的属性注入到vue实例中
      Object.defineProperty(this,key,{
        enumerable:true,
        configurable:true,
        get(){
          return data[key]
        },
        set(newValue){
          if(newValue === data[key]){
            return
          }
          data[key] = newValue
        }
      })
    })
  }
}


class Observer{

  constructor(data){
    this.walk(data)
  }

  walk(data){
    // 1. 判断data是否是对象
    if(Object.prototype.toString.call(data) !== '[object Object]'){
      return
    }
    // 2. 遍历data对象的所有属性
    Object.keys(data).forEach(key => {
      this.defineReactive(data,key,data[key])
    })
  }

  defineReactive(obj,key,val){
    let self = this
    // 负责收集依赖,并发送通知
    let dep = new Dep()
    // 如果val是对象,把val内部的属性转换为响应式数据
    this.walk(val)
    Object.defineProperty(obj,key,{
      enumerable:true,
      configurable:true,
      get(){
        // 收集依赖
        Dep.target && dep.addSub(Dep.target)
        return val
      },
      set(newValue){
        if(newValue === val){
          return
        }
        val = newValue
        self.walk(newValue)
        // 发送通知
        dep.notify()
      }
    })
  }
}

class Compiler{
  constructor(vm){
    this.el = vm.$el
    this.vm = vm
    this.compile(this.el)
  }

  // 编译模板,处理文本节点和元素节点
  compile(el){
    let childNodes = el.childNodes
    Array.from(childNodes).forEach(node => {
      if(this.isTextNode(node)){
        this.compileText(node)
      }else if(this.isElementNode(node)){
        this.compileElement(node)
      }

      // 判断node节点,是否有字节点,如果有字节点,要递归调用compile
      if(node.childNodes && node.childNodes.lentth){
        this.compile(node)
      }
    })
  }

  // 编译元素节点,处理指令
  compileElement(node){
    // 遍历所有属性节点
    Array.from(node.attributes).forEach(attr=>{
      // 判断是否是指令
      let attrName = attr.attrName
      if(this.isDirective(attrName)){
        // v-text -> text
        attrName = attrName.substr(2)
        let key = attr.value
        this.update(node,key,attrName)
      }
    })
  }

  update(node,key,attrName){
    let updateFn = this[attrName+'Update']
    updateFn && updateFn(node,this.vm[key])
  }

  // 处理 v-text 指令
  textUpdater(node,value){
    node.textContent = value
  }

  modelUpdater(node,value){
    node.value = value
  }

  // 编译文本节点,处理插值表达式
  compileText(node){
    // {{ msg }}
    let reg = /\{\{\(.+?)}\}/
    let value = node.textContent
    if(reg.test(value)){
      let key = RegExp.$1.trim()
      node.textContent = value.replace(reg,this.vm[key])
    }
  }

  // 判断元素属性是否是指令
  isDirective(attrName){
    return attrName.statrsWith('v-')
  }

  // 判断节点是否是文本节点
  isTextNode(node){
    return node.nodeType === 3
  }

  // 判断节点是否是元素节点
  isElementNode(node){
    return node.nodeType === 1
  }
}


class Dep{
  constructor(){
    // 存储所有的观察者
    this.subs = []
  }
  // 添加观察者
  addSub(sub){
    if(sub && sub.update){
      this.subs.push(sub)
    }
  }
  // 发送通知
  notify(){
    this.subs.forEach(sub=>{
      sub.update()
    })
  }
}
```

## Watcher

- 当数据变化触发依赖,dep通知所有的watcher实例更新视图
- 自身实例化的时候往dep对象中添加自己


## 完整JavaScript
```js
// class Vue {
//   constructor (options) {
//     // 1. 通过属性保存选项的数据
//     this.$options = options || {}
//     this.$data = options.data || {}
//     this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el
//     // 2. 把data中的成员转换成getter和setter，注入到vue实例中
//     this._proxyData(this.$data)
//     // 3. 调用observer对象，监听数据的变化
//     new Observer(this.$data)
//     // 4. 调用compiler对象，解析指令和差值表达式
//     new Compiler(this)
//   }
//   _proxyData (data) {
//     // 遍历data中的所有属性
//     Object.keys(data).forEach(key => {
//       // 把data的属性注入到vue实例中
//       Object.defineProperty(this, key, {
//         enumerable: true,
//         configurable: true,
//         get () {
//           return data[key]
//         },
//         set (newValue) {
//           if (newValue === data[key]) {
//             return
//           }
//           data[key] = newValue
//         }
//       })
//     })
//   }
// }


class Vue{
  constructor(options){
    // 1. 通过属性保存选项的数据
    this.$options = options || {}
    this.$data = options.data || {}
    this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el
    // 2. 把data中的成员转换成 getter 和 setter,注入到vue实例中
    this._proxyData(this.$data)
    // 3. 调用 observer 对象,监听数据的表达式
    new Observer(this.$data)
    // 4. 调用 compoler 对象,解析指令和差距表达式
    new Compiler(this)
  }

  _proxyData(data){
    // 遍历data中的所有属性
    Object.keys(data).forEach(key => {
      // 把data的属性注入到vue实例中
      Object.defineProperty(this,key,{
        enumerable:true,
        configurable:true,
        get(){
          return data[key]
        },
        set(newValue){
          if(newValue === data[key]){
            return
          }
          data[key] = newValue
        }
      })
    })
  }
}


class Observer{

  constructor(data){
    this.walk(data)
  }

  walk(data){
    // 1. 判断data是否是对象
    if(Object.prototype.toString.call(data) !== '[object Object]'){
      return
    }
    // 2. 遍历data对象的所有属性
    Object.keys(data).forEach(key => {
      this.defineReactive(data,key,data[key])
    })
  }

  defineReactive(obj,key,val){
    let self = this
    // 负责收集依赖,并发送通知
    let dep = new Dep()
    // 如果val是对象,把val内部的属性转换为响应式数据
    this.walk(val)
    Object.defineProperty(obj,key,{
      enumerable:true,
      configurable:true,
      get(){
        // 收集依赖
        Dep.target && dep.addSub(Dep.target)
        return val
      },
      set(newValue){
        if(newValue === val){
          return
        }
        val = newValue
        self.walk(newValue)
        // 发送通知
        dep.notify()
      }
    })
  }
}

class Compiler{
  constructor(vm){
    this.el = vm.$el
    this.vm = vm
    this.compile(this.el)
  }

  // 编译模板,处理文本节点和元素节点
  compile(el){
    let childNodes = el.childNodes
    Array.from(childNodes).forEach(node => {
      if(this.isTextNode(node)){
        this.compileText(node)
      }else if(this.isElementNode(node)){
        this.compileElement(node)
      }

      // 判断node节点,是否有字节点,如果有字节点,要递归调用compile
      if(node.childNodes && node.childNodes.length){
        this.compile(node)
      }
    })
  }

  // 编译元素节点,处理指令
  compileElement(node){
    // 遍历所有属性节点
    Array.from(node.attributes).forEach(attr=>{
      // 判断是否是指令
      let attrName = attr.name
      if(this.isDirective(attrName)){
        // v-text -> text
        attrName = attrName.substr(2)
        let key = attr.value
        this.update(node,key,attrName)
      }
    })
  }

  update(node,key,attrName){
    let updateFn = this[attrName+'Updater']
    updateFn && updateFn.call(this,node,this.vm[key],key)
  }

  // 处理 v-text 指令
  textUpdater(node,value,key){
    node.textContent = value
    new Watcher(this.vm,key,(newValue)=>{
      node.textContent = newValue
    })
  }

  modelUpdater(node,value,key){
    node.value = value
    new Watcher(this.vm,key,(newValue)=>{
      node.value = newValue
    })
    // 双向绑定
    node.addEventListener('input',()=>{
      this.vm[key] = node.value
    })
  }

  // 编译文本节点,处理插值表达式
  compileText(node){
    // {{ msg }}
    let reg = /\{\{(.+?)\}\}/
    let value = node.textContent
    if(reg.test(value)){
      let key = RegExp.$1.trim()
      node.textContent = value.replace(reg,this.vm[key])

      // 创建watcher对象
      new Watcher(this.vm,key,(newValue)=>{
        node.textContent = newValue
      })
    }
  }

  // 判断元素属性是否是指令
  isDirective(attrName){
    return attrName.startsWith('v-')
  }

  // 判断节点是否是文本节点
  isTextNode(node){
    return node.nodeType === 3
  }

  // 判断节点是否是元素节点
  isElementNode(node){
    return node.nodeType === 1
  }
}


class Dep{
  constructor(){
    // 存储所有的观察者
    this.subs = []
  }
  // 添加观察者
  addSub(sub){
    if(sub && sub.update){
      this.subs.push(sub)
    }
  }
  // 发送通知
  notify(){
    this.subs.forEach(sub=>{
      sub.update()
    })
  }
}

class Watcher{
  constructor(vm,key,cb){
    this.vm = vm
    // data中的属性名称
    this.key = key
    // 回调函数负责更新视图
    this.cb = cb

    // 把watcher对象记录到Dep类的静态属性target中
     = this
    // 触发get方法,在get方法中会调用addSub

    this.oldValue = vm[key]

    Dep.target = null
  }

  // 当数据发生变化的时候更新视图
  update(){
    let newValue = this.vm[this.key]
    if(this.oldValue === newValue){
      return
    }
    this.cb(newValue)
  }
}
```