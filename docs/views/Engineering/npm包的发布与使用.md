---
title: 'npm包的发布与使用'
date: 2021-09-13
tags:
- '学习笔记'
- '模块化'
categories:
- '模块化'
---

关于npm包的发布使用
<!-- more -->

## 一、注册npm账号并进行邮箱验证
 
只有邮箱验证后才能正常发布包，不验证邮箱会导致403报错（手机端的邮箱目前暂不支持，用pc端登录邮箱后再点击链接进行验证）

## 二、包的编写

注：这里我们只做一个简单的工具包

1、先创建一个文件夹

`mkdir npmtest`

2、 进入文件夹

`cd npmtest`

3、初始化npm,生成package.json

`npm init -y`

4、登录npm账号

`npm login`


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/92fa1afef998466ea78f6bb4a41b86a9~tplv-k3u1fbpfcp-watermark.image?)

5、登录成功后编写方法

package.json里我们可以看到入口文件是index.js,所以我们可以在项目根目录下新建index.js来编写你所需要发布上去的方法


```js

// 深拷贝
export const cloneDeep = (target) => {
  const map = new Map();
  function clone(target){
    // 判断是否是引用对象
    if(target instanceof Object && target !== null){
      /*
      * 判断是否是数组的四种js方法
      * Array.isArray(target)
      * target.constructor === Array
      * Object.prototype.toString.call(target) === 'object Array'
      * target instanceof Array
      */
      const cloneTarget = Array.isArray(target) ? [] : {};

      // 解决循环引用的问题
      if(map.has(target)){
        return map.get(target);
      }
      map.set(target, cloneTarget);
      for(let key in target){
        cloneTarget[key] = clone(target[key]);
      };
      return cloneTarget;
    } else {
      return target;
    }
  }
  return clone(target);
}
```
6、 一切就绪后我们就可以发布了

`npm publish`

## 三、常用发布包的命令

```js
npm unpublish npmtest // 撤销已发布的包
npm unpublish npmtest@1.0.2 // 撤销发布包的版本号
npm version patch // 自动自增版本号
```


