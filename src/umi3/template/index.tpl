

import { plugin } from '../core/plugin';
import { ApplyPluginsType, } from '{{{ runtimePath }}}';
import {clientRender} from '../umi';
import lodash from 'lodash'
import {
  IRoute,
} from '@umijs/core';

interface Route extends Omit<IRoute,'component'|'routes'>{
  component?: any;
  routes?: Route[];
}
interface ReloadRoutesOptions{
  isModify:boolean;
  [index:string]:any
}
//动态路由更新回调集合
export let reloadRoutesOptions:ReloadRoutesOptions = {
  isModify:false
};
//更新路由
const reloadRoutes = (options:object={})=>{
  reloadRoutesOptions = {
    ...options,
    isModify:true
  };
  clientRender({ hot: true })();
};
/**
 * 根据key获取指定路由
 */
function findRouteByKey(
  routes: Route[],
  key: string,
  routeKey:string='{{{routeKey}}}'
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
// 获取基础路由
const getRoutes = ():Route => require('../core/routes').routes;

//获取动态路由
function getDynamicRoutes(key?: string):Route|null {
  const routes = getRoutes();
  const { route } = findRouteByKey(routes, `dynamicRoutes_${key}`) || {};
  if (!route || !route.routes) {
    return null;
  }
  return route.routes;
}

export {
  getRoutes,
  reloadRoutes,
  findRouteByKey,
  getDynamicRoutes
}
