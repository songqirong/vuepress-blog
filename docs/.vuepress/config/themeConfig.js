const nav = require('./nav');
// const sidebar = require('./sidebar');
module.exports = {
  mode: 'light',
  type: 'blog',
  subSidebar: 'auto',
  smoothScroll: true, // 启用页面滚动效果
  lastUpdated: '上次更新时间', // string | boolean 仅在该页面后续提交更改时更新。
  author: '邕谷孜',
  authorAvatar: '/avatar.jpg',
  searchMaxSuggestions: 10,
  // 项目开始时间
  startYear: '2020',
  nav,
  search: true, // 搜索栏的展示
  valineConfig: {
    appId: 'xt4YxgLcLNToqEO6YtQccL8C-gzGzoHsz',
    appKey: 'gguD9ylcsDjPrh7DhFUlzOUe',
    recordIP:true,
    placeholder:'填写邮箱地址可以及时收到回复噢...',
    visitor:true,
  },
  // 博客设置
  blogConfig: {
    category: {
        location: 2, // 在导航栏菜单中所占的位置，默认2
        text: '目录索引' // 默认 “分类”
    },
    tag: {
        location: 3, // 在导航栏菜单中所占的位置，默认3
        text: '标签索引' // 默认 “标签”
    }
  },
  friendLink: [
    {
      title: "vuepress-theme-reco",
      desc: "A simple and beautiful vuepress Blog & Doc theme.",
      avatar: "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
      link: "https://vuepress-theme-reco.recoluan.com"
    }
  ],
  sidebar: 'auto', // 自动生成一个仅仅包含了当前页面标题（headers）链接的侧边栏
  // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
  repo: 'songqirong/vuepress-blog/tree/master',
  // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
  // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
  //  repoLabel: '查看源码',
  //  // 以下为可选的编辑链接选项
  //  // 假如你的文档仓库和项目本身不在一个仓库：
  //  docsRepo: 'vuejs/vuepress',
  //  // 假如文档不是放在仓库的根目录下：
  //  docsDir: 'docs',
  //  // 假如文档放在一个特定的分支下：
  //  docsBranch: 'master',
  // 默认是 false, 设置为 true 来启用
  //  editLinks: true,
  //  // 默认为 "Edit this page"
  //  editLinkText: '帮助我们改善此页面！'
  record: '赣ICP备2021005743号',
  recordLink: 'http://www.beian.gov.cn/',
  cyberSecurityRecord: '赣公网安备 2021005743号',
  cyberSecurityLink: 'http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=2021005743',
}