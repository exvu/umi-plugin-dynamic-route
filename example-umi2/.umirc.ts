import { IConfig } from 'umi-types';
import { join } from 'path';
import  dynamicRoutes from './dynamicRoutes/index'
// ref: https://umijs.org/config/
const config: IConfig = {
  treeShaking: true,
  routes: [
    {
      path: '/',
      routeKey1: "home",
      component:'../layouts/index',
      routes: [
        {
          path: '/', component: './index',
          menu: {
            name: '首页',
          },
        },
        {
          path: 'demo1', component: './test1',
          menu: {
            name: 'demo1',
          },
         
        },
        {
          path: 'demo2', component: './test1',
          menu: {
            name: 'demo2',
          },
        
        },
      ]
    }
  ],
  dynamicRoutes:{
    routeKey:'routeKey1',
    routes:dynamicRoutes
  },
  plugins: [
    [
      join(__dirname, '..', require('../package.json').main || 'index.js')
    ],
    ['umi-plugin-react', {
      antd: false,
      dva: false,
      dynamicImport: false,
      title: 'example-umi2',
      dll: false,

      routes: {
        exclude: [
          /components\//,
        ],
      },
    }],
  ],
}

export default config;
