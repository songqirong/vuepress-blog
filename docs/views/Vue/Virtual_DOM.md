---
title: 'Virtual DOM的实现原理'
date: 2020-11-05
# 永久链接
# permalink: '/hello-world'
# 文章访问密码
# keys: '123'
# 是否发布文章
# publish: true
# 置顶: 降序，可以按照 1, 2, 3, ... 来降低置顶文章的排列优先级
# sticky: 1
# sidebar: false
# sidebarDepth: 2
# isTimeLine: false
# isShowComment: true
tags:
- 学习笔记
- vue
categories:
- 'vue'
---

学习 Vue 虚拟DOM,为什么使用虚拟DOM

<!-- more -->

## 为什么使用Virtual DOM

- 手动操作DOM比较麻烦,还需要考虑浏览器兼容性问题,虽然有jQuery等库简化DOM操作,但是随着项目的复杂DOM操作复杂提升
- 为了简化DOM的复杂操作于是出现各种MVVM框架,MVVM框架解决了跟踪状态变化的问题,于是Virtual DOM出现了
- Virtual DOM的好处是当状态改变时不需要立即更新DOM,只需要创建一个虚拟树来描述DOM,Virtual DOM内部将弄清楚如果有效的更新DOM
- 参考 github 上 virtual-dom 的描述
> - 虚拟DOM可以维护程序的状态,跟踪上一次的状态
> - 通过比较前后两次状态的差异更新真实DOM

## Virtual DOM库
- Snabbdom
> - Vue2.x 内部使用 Virtual DOM 就是改造的 snabbdom
> - 大约200SLOC
> - 通过模块可扩展
> - 源码使用 TS 开发
> - 最快的 Virtual DOM 之一

- Virtual-DOM


## h 函数

- h() 函数介绍 
  1. 在使用 Vue 的时候见过 h() 函数
  ```js
  new Vue({
    router,
    store,
    render: h => h(App) }).$mount('#app')
  })
  ```
  2. h() 函数最早见于 hyperscript，使用 JavaScript 创建超文本
  3. Snabbdom 中的 h() 函数不是用来创建超文本，而是创建 VNode


## 部分核心代码解析

```js

// 主要对比function
function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
  // 因为 vnode 和 oldVnode 是相同的 vnode，所以我们可以复用 oldVnode.elm。
  const elm = vnode.elm = oldVnode.elm
  let oldCh = oldVnode.children
  let ch = vnode.children

  // 如果 oldVnode 和 vnode 是完全相同，说明无需更新，直接返回。
  if (oldVnode === vnode) return

  // 调用 update hook
  if (vnode.data) {
    for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
  }

  // 判断是否为文本节点,在snabbdom中text文本节点和children子节点并不共存
  if (vnode.text === undefined) {
    // 比较 old children 和 new children，并更新
    if (oldCh && ch) {
      if (oldCh !== ch) {
        // 核心逻辑（最复杂的地方）：怎么比较新旧 children 并更新，对应上面的数组比较
        updateChildren(elm, oldCh, ch, insertedVnodeQueue)
      }
    }
    // 添加新 children
    else if (ch) {
      // 首先删除原来的 text
      if (oldVnode.text) api.setTextContent(elm, '')
      // 然后添加新 dom（对 ch 中每个 vnode 递归创建 dom 并插入到 elm）
      addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
    }
    // 相反地，如果原来有 children 而现在没有，那么我们要删除 children。
    else if (oldCh) {
      removeVnodes(elm, oldCh, 0, oldCh.length - 1);
    }
    // 最后，如果 oldVnode 有 text，删除。
    else if (oldVnode.text) {
      api.setTextContent(elm, '');
    }
  }
  // 否则 （vnode 有 text），只要 text 不等，更新 dom 的 text。
  else if (oldVnode.text !== vnode.text) {
    api.setTextContent(elm, vnode.text)
  }
}

function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
  let oldStartIdx = 0, newStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let oldStartVnode = oldCh[0]
  let oldEndVnode = oldCh[oldEndIdx]
  let newEndIdx = newCh.length - 1
  let newStartVnode = newCh[0]
  let newEndVnode = newCh[newEndIdx]
  let oldKeyToIdx
  let idxInOld
  let elmToMove
  let before

  // 遍历 oldCh 和 newCh 来比较和更新(也就是关于对比虚拟DOM的diff实现)
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 一 首先检查 4 种情况，保证 oldStart/oldEnd/newStart/newEnd
    // 这 4 个 vnode 非空，左侧的 vnode 为空就右移下标，右侧的 vnode 为空就左移 下标。
    if (oldStartVnode == null) {
      oldStartVnode = oldCh[++oldStartIdx]
    } else if (oldEndVnode == null) {
      oldEndVnode = oldCh[--oldEndIdx]
    } else if (newStartVnode == null) {
      newStartVnode = newCh[++newStartIdx]
    } else if (newEndVnode == null) {
      newEndVnode = newCh[--newEndIdx]
    }
    /**
     * 二 然后 oldStartVnode/oldEndVnode/newStartVnode/newEndVnode 两两比较，
     * 对有相同 vnode 的 4 种情况执行对应的 patch 逻辑。
     * - 如果同 start 或同 end 的两个 vnode 是相同的（情况 1 和 2），
     *   说明不用移动实际 dom，直接更新 dom 属性／children 即可；
     * - 如果 start 和 end 两个 vnode 相同（情况 3 和 4），
     *   那说明发生了 vnode 的移动，同理我们也要移动 dom。
     */
    // 1. 如果 oldStartVnode 和 newStartVnode 相同（key相同），执行 patch
    else if (isSameVnode(oldStartVnode, newStartVnode)) {
      // 不需要移动 dom
      patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    }
    // 2. 如果 oldEndVnode 和 newEndVnode 相同，执行 patch
    else if (isSameVnode(oldEndVnode, newEndVnode)) {
      // 不需要移动 dom
      patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    }
    // 3. 如果 oldStartVnode 和 newEndVnode 相同，执行 patch
    else if (isSameVnode(oldStartVnode, newEndVnode)) {
      patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)
      // 把获得更新后的 (oldStartVnode/newEndVnode) 的 dom 右移，移动到
      // oldEndVnode 对应的 dom 的右边。为什么这么右移？
      // （1）oldStartVnode 和 newEndVnode 相同，显然是 vnode 右移了。
      // （2）若 while 循环刚开始，那移到 oldEndVnode.elm 右边就是最右边，是合理的；
      // （3）若循环不是刚开始，因为比较过程是两头向中间，那么两头的 dom 的位置已经是
      //     合理的了，移动到 oldEndVnode.elm 右边是正确的位置；
      // （4）记住，oldVnode 和 vnode 是相同的才 patch，且 oldVnode 自己对应的 dom
      //     总是已经存在的，vnode 的 dom 是不存在的，直接复用 oldVnode 对应的 dom。
      api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm))
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
    }
    // 4. 如果 oldEndVnode 和 newStartVnode 相同，执行 patch
    else if (isSameVnode(oldEndVnode, newStartVnode)) {
      patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)
      // 这里是左移更新后的 dom，原因参考上面的右移。
      api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    }

    // 三 最后一种情况：4 个 vnode 都不相同，那么我们就要
    // 1. 从 oldCh 数组建立 key --> index 的 map。
    // 2. 只处理 newStartVnode （简化逻辑，有循环我们最终还是会处理到所有 vnode），
    //    以它的 key 从上面的 map 里拿到 index；
    // 3. 如果 index 存在，那么说明有对应的 old vnode，patch 就好了；
    // 4. 如果 index 不存在，那么说明 newStartVnode 是全新的 vnode，直接
    //    创建对应的 dom 并插入。
    else {
      // 如果 oldKeyToIdx 不存在，创建 old children 中 vnode 的 key 到 index 的
      // 映射，方便我们之后通过 key 去拿下标。
      if (oldKeyToIdx === undefined) {
        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
      }
      // 尝试通过 newStartVnode 的 key 去拿下标
      idxInOld = oldKeyToIdx[newStartVnode.key]
      // 下标不存在，说明 newStartVnode 是全新的 vnode。
      if (idxInOld == null) {
        // 那么为 newStartVnode 创建 dom 并插入到 oldStartVnode.elm 的前面。
        api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm)
        newStartVnode = newCh[++newStartIdx]
      }
      // 下标存在，说明 old children 中有相同 key 的 vnode，
      else {
        elmToMove = oldCh[idxInOld]
        // 如果 type 不同，没办法，只能创建新 dom；
        if (elmToMove.type !== newStartVnode.type) {
          api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm)
        }
        // type 相同（且key相同），那么说明是相同的 vnode，执行 patch。
        else {
          patchVnode(elmToMove, newStartVnode, insertedVnodeQueue)
          oldCh[idxInOld] = undefined
          api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm)
        }
        newStartVnode = newCh[++newStartIdx]
      }
    }
  }

  // 上面的循环结束后（循环条件有两个），处理可能的未处理到的 vnode。
  // 如果是 new vnodes 里有未处理的（oldStartIdx > oldEndIdx
  // 说明 old vnodes 先处理完毕）
  if (oldStartIdx > oldEndIdx) {
    before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm
    addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
  }
  // 相反，如果 old vnodes 有未处理的，删除 （为处理 vnodes 对应的） 多余的 dom。
  else if (newStartIdx > newEndIdx) {
    removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
  }
}
```