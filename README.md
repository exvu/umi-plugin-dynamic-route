# umi-plugin-dynamic-route

实现动态路由.

## 安装

```bash
# or yarn
$ npm install umi-plugin-dynamic-route --save
```

## Usage

需要两个步骤开始.

### 1. 配置 .umirc.js

```js
export default {
  plugins: [['umi-plugin-dynamic-route', options]],
  //暂存的路由配置，会自动组装component 通过getDynamicRoutes获取组装后的数据
  dynamicRoutes:{},
};
```

### 2. 在项目中使用

```js
import { getRoutes, updateRoutes, getDynamicRoutes } from 'umi';


export default () => {
    //获取路由配置
    const routes = getRoutes();
    //获取暂存的动态路由配置
    const routes = getDynamicRoutes();
    //更新路由
    updateRoutes(routess);
};
```

完整例子请看 in [./example](https://github.com/exvu/umi-plugin-dynamic-route/tree/master/example)

## LICENSE

MIT
