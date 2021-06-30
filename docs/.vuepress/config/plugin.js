module.exports = {
  '@vuepress/pwa': {
    serviceWorker: true,
    updatePopup: {
        message: "发现新内容可用",
        buttonText: "刷新"
    }
  },
  '@vuepress/plugin-active-header-links':{},
  '@vuepress/plugin-nprogress':{},
  'flowchart': {

  },
  '@vuepress/medium-zoom': {
      selector: '.theme-reco-content:not(a) img',
      options:{
          background:'#fff',
      }
  },
  "dynamic-title":{
      showIcon: "/favicon.ico",
      showText: "(/≧▽≦/)欢迎回来！",
      hideIcon: "/favicon.ico",
      hideText: "(●—●)哦吼,不要走！",
      recoverTime: 2000
  },
  "vuepress-plugin-nuggets-style-copy":{
      copyText: "复制代码",
      tip: {
          content: "复制成功!"
      }
  },
  "@vuepress-reco/vuepress-plugin-kan-ban-niang":{
    theme: ['z16'],
      clean: true,
      messages: {
      },
      width: 240,
      height: 352
  }
}