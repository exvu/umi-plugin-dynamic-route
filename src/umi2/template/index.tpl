

import { clientRender } from '../umi';
import {
  IRoute,
} from 'umi-types';

interface Route extends Omit<IRoute,'component'|'routes'>{
  component?: any;
  routes?: Route[];
}
interface ReloadRoutesOptions{
  isModify:boolean,
  [index:string]:any
}
//动态路由更新回调集合
let reloadRoutesOptions:ReloadRoutesOptions = {
  isModify:false,
};
//更新路由
const reloadRoutes = (options:object={})=>{
  reloadRoutesOptions = {
    ...options,
    isModify:true,
  };
  const plugins = require('umi/_runtimePlugin');
  plugins.applyForEach('patchDynamicRoutes', { 
    initialValue: {
      routes:getRoutes(),
      ...reloadRoutesOptions,
    },
  });
  clientRender();
};
/**
 * 根据key获取指定路由
 */
function findRouteByKey(
  routes: Route[],
  key: string,
  routeKey:string
): null | { route: any; index: string; parent: any } {
  for (const index in routes) {
    const route = routes[index];
    if (route[routeKey] === key) {
      return {
        route,
        index,
        parent: routes,
      };
    }
    if (isArray(route.routes)) {
      const data = findRouteByKey(route.routes, key,routeKey);
      if (data) {
        return data;
      }
    }
  }
  return null;
}

function isArray(o:any) {
  return Object.prototype.toString.call(o) == '[object Array]';
}
interface TargetRoute{
  parent:Route|null,
  index:number,
  route:Route
}
function modifyRoutes(callback: (options: ReloadRoutesOptions) => void) {
  callback({
    ...reloadRoutesOptions,
    dynamicRoutes:getDynamicRoutes(),
  })
}
// 获取基础路由
const getRoutes = ():Route => require('../router').routes;

//获取动态路由
function getDynamicRoutes(key?: string):Route|null {
  const routes = getRoutes();
  const { route } = findRouteByKey(routes, `dynamicRoutes_${key}`, '{{{routeKey}}}') || {};
  if (!route || !route.routes) {
    return null;
  }
  return route.routes;
}

export {
  modifyRoutes,
  getRoutes,
  reloadRoutes,
  findRouteByKey,
  getDynamicRoutes
}
