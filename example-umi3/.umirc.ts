import { defineConfig } from 'umi';
import { join } from 'path';
import * as dynamicRoutes from './dynamicRoutes/index'
export default defineConfig({
  plugins: [join(__dirname, '..', require('../package.json').main || 'index.js')],
  dynamicRoutes: {
    routeKey: "routeKey1",
    routes: dynamicRoutes
  },
  layout: {
    name: 'test',
    locale: true,
  },
  routes: [
    {
      path: '/',
      wrappers: [
        '@/wrappers/auth'
      ],
      menu: {
        name: '主页', // 兼容此写法
      },
      component: '@/layouts/BlankLayout',
      routeKey1: "home",
      routes: [
        {
          path: '/', component: '@/pages',
          menu: {
            name: 'index', // 兼容此写法
          },
        },
        {
          path: 'demo1', component: '@/pages/test1',
          menu: {
            name: 'demo', // 兼容此写法
          },
        },
        {
          path: 'demo2', component: '@/pages/test1',
          menu: {
            name: 'demo2', // 兼容此写法
          },
        },
      ]
    }
  ],
});
