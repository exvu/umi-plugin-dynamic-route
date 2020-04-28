# @exvu/umi-plugin-dynamic-route

实现动态路由.

## 安装

```bash
# or yarn
$ npm install @exvu/umi-plugin-dynamic-route --save-dev
$ yarn add @exvu/umi-plugin-dynamic-route -D
```

## Usage

需要两个步骤开始.

### 1. 配置 .umirc.ts

```ts
export default defineConfig({
  dynamicRoutes: {
    routeKey:"routeKey1",//指定路由查询的搜索键
    routes:{}//各个模块的动态路由
  },
  routes: [
    {
      path: '/',
      wrappers: [
        '@/wrappers/auth'
      ],
      component: '@/layouts/BlankLayout',
      routeKey1:"home",
      routes: [
      ]
    }
  ],
});
```

### 2. 在项目中使用


#### demo1 更新基础路由中指定节点的路由
```ts
import { 
  modifyRoute,reloadRoutes,dynamic } from 'umi';

 //替换routeKey1=='home'的路由
modifyRoute("home",({route},sourceRoutes)=>{
  if(route.routes){
    route.routes.push({
      path: '/' + Math.random(),
      component: dynamic({
        loader: () => import('@/pages/moduleA'),
      }),
      routes:getDynamicRoutes("moduleA"),
    })
  }
});

//更新路由
reloadRoutes();
```

#### demo2 手动处理路由
```ts
import { 
  modifyRoute,reloadRoutes,dynamic } from 'umi';

 //获取路由
const routes = getRoutes()
//修改路由
routes[0].routes.push({
  path: '/' + Math.random(),
  component: dynamic({
    loader: () => import('@/pages/test3'),
  }),
})

//更新路由
reloadRoutes(routes);
```

### 配置文档

<h3>dynamicRoutes配置参数</h3>  

|属性|默认值|描述|
|:-:|:-:|:--------:|
|**`routeKey`**|routeKey|指定路由查询的搜索键
|**`routes`**|{}|各个模块的动态路由


<h3>函数文档</h3>  

|函数|描述|
|:-:|:-:|:--------:|
|**`reloadRoutes(routes?:Route[])`**|重新加载路由，使修改的路由生效，当传递routes，根据传递的进行渲染，否则使用内部的route渲染
|**`modifyRoute(key:string,callback: (route: TargetRoute, routes: Route[]) => any)`**|更新指定键的路由
|**`getRoutes`**|获取umi的路由配置
|**`getDynamicRoutes(key?:string)`**|获取动态路由,若传递key就获取指定模块的动态路由,否则获取全部的动态路由配置
|**`findRouteByKey(routes: Route[],key: string,routeKey:string)`**|根据键查询路由

完整例子请看 in [./example](https://github.com/exvu/umi-plugin-dynamic-route/tree/master/example)

## LICENSE

MIT
