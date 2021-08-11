---
title: mockjs的使用
date: 2021-04-25
categories:
 - 工具
tags:
 - 工具
sidebar: 'auto'
---
---
theme: channing-cyan
---
### 前言

Mock就是用一个虚拟的对象（Mock 对象）来创建以便测试的测试方法。

- 随着WEB技术的发展，前后端分离架构变得普遍起来，但是问题也随之而来，文档零散、不规范。并且经常碰到例如参数的新增、变动。这就导致了后端工程师需要耗费大量的时间维护接口文档
- 前端的开发工作依赖于后端提供的接口数据，但是后端接口往往没有那么快就可以开发完成。这就导致了前端在“等”数据。
- 上述的情况就会导致工作效率低下，沟通成本增加。接口管理平台的需求就日趋强烈
所以这也促进了mock的出现和发展



### 说说自己使用mock的变化
#### 1.原地模拟数据
直接在页面data里面声明或者外部文件声明然后引入
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca3df94e339a40378f46ad2c5208b352~tplv-k3u1fbpfcp-watermark.image)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7502ca8b1e844dc2be3c7ea4bc89192b~tplv-k3u1fbpfcp-watermark.image)

优点：这样相应页面就会有占位数据，有个直观的感觉

缺点：数据写死，不会变化，也不是从接口获取 后期待对接的工作量还是很高，而且前期成本也不低

#### 2.接口声明return数据

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/53e45729da444c3686c9cf60a8b9afcf~tplv-k3u1fbpfcp-watermark.image)
这里其实和第一种没什么区别，在接口定义的地方返回数据。只是起到占位的作用，非要和第一个对比，只是增加了接口简单声明，为后面对接少了一点点工作量，其实后面对接，还是有很多工作要做。

#### 3.使用mock.js
其实较早接触mock.js 最近才知道YApi
直接模拟相应接口返回，接口名也可以自定义，数据类型也可以自定义 随意改动等等好处
在下一步慢慢体会
直接使用引入mockjs然后使用
```
const ResultUtil = require('../_util/resultUtil');
const Mock = require('mockjs');
// 公告管理
const dataList = Mock.mock({
  'rows|12': [
    {
      demoId: '@id',
      demoTitle: '@ctitle(3,10)',
      demoCnte: '<h2 style="text-align: center;">公告</h2><p>测试测试，内容内容。</p>',
      'demoMan|1': ['张三', '李四'],
      demoTime: '@datetime',
      'demoStatusText|1': ['生效', '未生效'],
      'demoStatus|1': ['1', '2'],

      'demoRole|1': ['1', '2'],
      'demoRoleText|1': ['专家', '社会监督员'],
      'demoMethod|1': ['1', '2'],
      'demoMethodText|1': ['PC', '微信'],
      demoFileList: [
        {
          archiveFor: 'xls',
          archiveId: 107,
          archiveName: '任务管理病案审核专家意见模板.xls',
          bizId: 'ZJYY0001',
          cldArchiveId: '557',
          crteTime: 1606443355672,
          crterId: '0',
          crterName: '超级管理员',
          fileBase64: null,
          matId: '1303',
          rid: '557',
          updtTime: 1606443355672,
          valiFlag: null,
        },
      ],
    },
  ],
});
// 操作历史
const hisList = Mock.mock({
  'rows|32': [
    {
      hisId: '@id',
      hisResult: '@ctitle(3,40)',
      'hisName|1': ['张三', '李四'],
      hisTime: '@datetime',
      'hisTypeStatusText|1': ['生效', '未生效'],
      'hisTypeStatus|1': ['1', '2'],
      'opterRoleText|1': ['专家', '社会监督员'],
    },
  ],
});

module.exports = {
  // 查询列表
  'GET /demo/getList 500': ({ query }) => {
    const { pageNo = 1, pageSize = 10 } = query;
    const dataListItems = dataList.rows;
    const pageData = ResultUtil.pagination(pageNo, pageSize, dataListItems);
    return ResultUtil.pageSuccess(pageData, dataListItems.length);
  },
  // 查询详情
  'GET /demo/detail 500': ({ query }) => {
    const { demoId = '' } = query;
    const dataListItems = dataList.rows;
    const index = dataListItems.findIndex((item) => item.demoId === demoId);
    return ResultUtil.success(dataListItems[index !== -1 ? index : 0]);
  },
  //   查询历史记录
  'GET /demo/getHistory 500': ({ query }) => {
    const { pageNo = 1, pageSize = 10 } = query;
    const dataListItems = hisList.rows;
    const pageData = ResultUtil.pagination(pageNo, pageSize, dataListItems);
    return ResultUtil.pageSuccess(pageData, dataListItems.length);
  },
};

```
这样的话在项目中就可以像调用接口 然后去模拟随机生成数组，mockjs很强大 很多api我也没搞懂，具体详情官网奉上 [mock官方文档](http://mockjs.com/0.1/#) 和 [项目地址](https://github.com/nuysoft/Mock)


```

### 结束语

其实最近一直在练习 怎么取分享知识和写好文章。这两点我现在都做的不怎么好 也许是掌握不深 所以不知道怎样去表达知识点和分享精彩吸引人的内容。
如果能坚持写博客 记录一下自己使用的技术之类 对我来说也是一种进步 孰能生巧！

**点关注不迷路！你那么帅(漂亮)，都看到这了，动手点个赞鼓励一下作者吧，谢谢！**

`点赞，点赞，点赞！ 非常谢谢！`


### 参考链接
1. [mock官方文档](http://mockjs.com/0.1/#) 和 [项目地址](https://github.com/nuysoft/Mock)
1. [yapi官方文档](https://yapi.baidu.com/doc/documents/index.html) 和  [项目地址](https://github.com/ymfe/yapi)
1. [常见MOCK-SERVER对比](https://blog.csdn.net/u014340331/article/details/105093557)
1. [几个mock平台的个人感受](https://www.jianshu.com/p/15ebd51ea733)
1. [Mockito 简明教程](https://www.cnblogs.com/bodhitree/p/9456515.html)

` PS:别问我为什么把好链接放后面(放前面 你们还能看完我的文章嘛) 要是觉得不错，点个赞哦 `
