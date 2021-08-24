export default ({router}) => {
    router.beforeEach((to, from, next) => {
        // 解决非ASCII文件名的路由，防止404
      const decodePath = decodeURIComponent(to.path);  
      if(decodePath !== to.path){
        next(Object.assign({}, to, {
          fullPath: decodeURIComponent(to.fullPath),
          path: decodePath
        }))
      } else {
        next();
      }     
    })
};