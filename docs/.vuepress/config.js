const themeConfig = require('./config/themeConfig');
const plugins = require('./config/plugin');
module.exports = {
  title: "Sqr's Blog", // 网站的标题，它将会被用作所有页面标题的前缀，同时，默认主题下，它将显示在导航栏（navbar）上。
  description: '邕谷孜の博客', // 网站的描述，它将会以 <meta> 标签渲染到当前页面的 HTML 中。
  head: [ // 额外的需要被注入到当前页面的 HTML <head>
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }],
    ["meta", { name: "author", content: "yongguzi" }],
    ['script', { src: '/assets/js/jq3.5.1.js'}, ``],
    ['script', { src: '/assets/js/mouse.js'}, ``]
  ],
  port: 8093, // 指定 dev server 的端口。
  dest: 'dist', // 指定 vuepress build 的输出目录。如果传入的是相对路径，则会基于 process.cwd() 进行解析。
  shouldPrefetch: () => true, // 一个函数，用来控制对于哪些文件，是需要生成 <link rel="prefetch"> 资源提示的
  cache: false, // VuePress 默认使用了 cache-loader (opens new window)来大大地加快 webpack 的编译速度。
  // extraWatchFiles: ['.vuepress/*'], // 指定额外的需要被监听的文件。
  theme: 'reco',
  themeConfig,
  markdown: {
    lineNumbers: true,  // 是否在每个代码块的左侧显示行号。
  },
  plugins,
}