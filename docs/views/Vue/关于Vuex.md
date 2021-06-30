---
title: '关于 Vuex'
date: 2020-12-26
tags:
- 学习笔记
- vue
categories:
- 'vue'
---

学习 Vuex 相关知识点

<!-- more -->

## 回顾组件通信方式


### 父组件给子组件传值

- 子组件中通过 props 接受数据
- 父组件中给子组件通过相应属性传值

### 子组件给父组件传值

- 在子组件中通过 this.$emit('事件名','事件参数')
- 在父组件调用子组件时增加 v-on:事件名='处理事件方法'(该方法自带参数,为子组件传递参数)

### 不相关组件传值

- 需要通过eventBus实现
- eventBus其实就是实例化一个Vue实例,通过同一个实例,实现不同组件传值

### 通过ref获取子组件

- 在普通 HTML 标签上使用 ref ,获取到的是DOM
- 在组件标签上使用 ref ,获取到的组件实例

不推荐使用 ref 方法

## 什么是 Vuex

- Vuex 是专门为 Vue.js 设计的状态管理库
- Vuex 采用集中式的方式存储需要共享的状态
- Vuex 的作用是进行状态管理,解决复杂组件通信,数据共享
- Vuex 集成到了 devTools 中,提供了 time-travel 时光旅行历史回滚功能

## 什么情况下使用 Vuex

- 非必要的情况下不要使用 Vuex
- 大型的单页应用程序
  - 多个视图依赖于同一状态
  - 来自不同视图的行为需要变更同一状态

## Vuex 核心状态

- Store
- State
  - 可以通过 mapState 将 state 熟悉里面的值绑定到组件的 compute 中
  - 可以通过传入数组的方式导入 && 传入对象的方式设置别名
- Getter
  - 可以理解为是组件中的 compute 组件
  - 也可以通过 mapGetter 导入到组件中的 compute 中
  - 也可以以数组和对象的两种方式去处理
- Mutation
  - 可以使用 mapMutation 导入到组件的 methods 中
  - 通过 Mutation 去更新 state 中的数据
- Action
  - 可以使用 mapAction 导入到组件的 methods 中
  - 是异步的操作,具体修改 state 还是需要在内部调用 Mutation
- Module 
  - 可以独立出一个个单独模块,然后在通过 module 引用
  - 可以在导出模块时开启 namespaced 命名空间,这样在调用的时候,模块中的属性会自动加上所属模块名