import { defineConfig } from 'umi';
import { join } from 'path';

export default defineConfig({
  plugins: [join(__dirname, '..', require('../package.json').main || 'index.js')],
  dynamicRoutes: {
    routeKey:"routeKey1",
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
        { path: '/', component: '@/pages' },
        { path: 'test1', component: '@/pages/test1' },
        { path: 'test2', component: '@/pages/test2' },
      ]
    }
  ],
});
