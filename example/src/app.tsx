let route = null;
export function patchRoutes({ routes }: any) {
  console.log(route);
  if (route) {
    routes[0].routes.push(route);
  }
}
let init = false;
export function render(oldRender: Function) {
  /**
   * umi2-umi3.0.7都是通过重新render实现添加路由的功能
   */
  window.appRender = (routes = null) => {
    route = routes;
    // 存放权限路由
    oldRender();
  };
  window.appRender();
}
