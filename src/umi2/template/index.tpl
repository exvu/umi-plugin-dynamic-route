

import { clientRender } from '../umi';
import {
  IRoute,
} from 'umi-types';

interface Route extends Omit<IRoute,'component'|'routes'>{
  component?: any;
  routes?: Route[];
}

//动态路由更新回调集合
const patchRoutesCallback = [];
//更新路由
const reloadRoutes = ()=>{
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
function patchRoutes(key: string, callback: (route: TargetRoute, routes: Route[]) => any) {
  patchRoutesCallback.push({
    key,
    callback,
  });
}
// 获取基础路由
const getRoutes = ():Route => require('../router').routes;

//获取动态路由
function getDynamicRoutes(key?: string):Route|null {
  const routes = require('./dynamicRoutes').routes;
  if (key == null) {
    return routes;
  }
  return routes[key];
}

const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { 
  initialValue(sourceRoutes){
    for(const item of patchRoutesCallback){
        const targetRoutes = findRouteByKey(sourceRoutes, item.key,'{{{routeKey}}}');
          if (targetRoutes == null) {
          throw new Error("目标路由不存在");
        }
        item.callback(targetRoutes, sourceRoutes);
    }
    return sourceRoutes;
  } 
});

export {
  patchRoutes,
  getRoutes,
  reloadRoutes,
  findRouteByKey,
  getDynamicRoutes
}
