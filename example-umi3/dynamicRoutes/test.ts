export default [
  {
    path: './test1-1',
    key: 'test1-1',
    type: 'group',
    menu: {
      name: 'test1-1',
    },
    routes: [
      {
        path: './test2-1',
        key: 'test2-1',
        menu: {
          name: 'test2-1',
        },

        component: './test1',
      },
      {
        path: './test2-2',
        key: 'test2-2',

        menu: {
          name: 'test2-2',
        },
        component: '@/pages/test1',
      },
      {
        path: './test2-3',
        key: 'test2-3',
        menu: {
          name: 'test2-3',
        },
        component: '@/pages/test1',
      },
    ],
  },
  {
    path: './test1-2',
    key: 'test1-2',
    menu: {
      name: 'test1-2',
    },
    type: 'group',
    routes: [
      {
        path: './test2-1',
        key: 'test2-1',
        menu: {
          name: 'test2-1',
        },
        component: '@/pages/test1',
      },
      {
        path: './test2-2',
        key: 'test2-2',

        menu: {
          name: 'test2-2',
        },
        component: '@/pages/test1',
      },
      {
        path: './test2-3',
        key: 'test2-3',
        menu: {
          name: 'test2-3',
        },
        component: '@/pages/test1',
      },
    ],
  },
];
