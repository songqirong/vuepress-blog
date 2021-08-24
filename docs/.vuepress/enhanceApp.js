// import postMixin from 'vuepress-theme-reco/mixins';
// export default ({router}) => {
//    // 将跳转的路径进行decodeURIComponent转换成正常的中文路径，这样路由就可以匹配上了，但是重新跳转之后，浏览器又会将url进行一次encode，也就是说，再次跳转的时候还是会经过 decodePath !== to.path 这个判断条件，一直重复下去，直到栈溢出
//     let pre_path = null; // 解决堆栈溢出
//     router.beforeEach((to, from, next) => {
//       console.log(to)
//         // 解决非ASCII文件名的路由，防止404
//       const decodePath = decodeURIComponent(to.path);  
//       if(decodePath !== to.path && decodePath !== pre_path){
//         pre_path = decodePath;
//         next(Object.assign({}, to, {
//           fullPath: decodeURIComponent(to.fullPath),
//           path: decodePath
//         }))
//       } else {
//         pre_path = to.path !== '/' ? decodePath : '/';
//         next();
//       }     
//     })
// };