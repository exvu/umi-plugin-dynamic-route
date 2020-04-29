# @exvu/umi-plugin-dynamic-route

实现umi2,umi3动态路由。

### 实现原理
通过修改routes对象，再触发render使界面刷新，让新路由生效。

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
      //umi2 umi3 配置雷同
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
### 12. 配置 app.ts

```ts
import { getDynamicRoutes, findRouteByKey } from 'umi';

export function patchDynamicRoutes({  routes, test,...options }) {
    //test 通过reloadRoutes传递的自定义参数
    
    console.log("执行patchDynamicRoutes");
    //根据key快速定位到指定节点。
    const targetRoute = findRouteByKey(routes, 'home', 'routeKey1');
    if (targetRoute) {
        //获取某个模块的路由
        const dynamicRoutes = getDynamicRoutes('test')
        if (targetRoute.route && dynamicRoutes) {
            //更新路由逻辑
            targetRoute.route.routes.splice(targetRoute.route.routes.length - 1, 0, ...dynamicRoutes)
            console.error("替换路由成功", routes)
        } else {
            console.error("未找到动态路由", dynamicRoutes)
        }

    } else {
        console.error("未找到目标路由")
    }
}
```

### 3. 在项目中使用


#### 请求更新路由（项目任意位置调用） 可以在reloadRoutes将自定义参数传递给app.ts的patchDynamicRoutes
```ts
import { patchRoutes,reloadRoutes,dynamic } from 'umi';
//更新路由
reloadRoutes({
  test:'自定义字段'
});
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
|**`reloadRoutes(option?:Option[])`**|请求重新路由，在更新路由之前会触发patchDynamicRoutes修改路由|
|**`getRoutes`**|获取umi的路由配置|
|**`getDynamicRoutes(key?:string)`**|获取动态路由,若传递key就获取指定模块的动态路由,否则获取全部的动态路由配置|
|**`findRouteByKey(routes: Route[],key: string,routeKey:string)`**|根据键查询路由|

<h3>运行时配置</h3>  

|函数|描述|
|:-:|:-:|:--------:|
|**`patchDynamicRoutes(option?:Option[])`**|修改动态配置路由

umi2完整例子请看 in [./example-umi2](https://github.com/exvu/umi-plugin-dynamic-route/tree/master/example-umi2)
umi3完整例子请看 in [./example-umi3](https://github.com/exvu/umi-plugin-dynamic-route/tree/master/example-umi3)

## LICENSE

MIT
