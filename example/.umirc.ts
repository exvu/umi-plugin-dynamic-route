import { defineConfig } from 'umi';
import { join } from 'path';

export default defineConfig({
  plugins: [join(__dirname, '..', require('../package.json').main || 'index.js')],
  dynamicRoutes: {},
  routes: [
    {
      path: '/',
      wrappers: [
        '@/wrappers/auth'
      ],
      component: '@/layouts/BlankLayout',
      routes: [
        { path: '/', component: '@/pages' },
        { path: 'test1', component: '@/pages/test1' },
        { path: 'test2', component: '@/pages/test2' },
      ]
    }
  ],
});
