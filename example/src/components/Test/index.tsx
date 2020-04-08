import React from 'react';
import styles from './index.less';
import { Link } from 'umi';

import { getRoutes, updateRoutes, dynamic } from 'umi';

export default ({ title, routes }) => {
  return (
    <div>
      <h1 className={styles.title}>{title}</h1>
      <div style={{ padding: 30 }}>
        {routes.map((item) => (
          <div key={item.path}>
            <Link to={item.path}>点击跳转到 {item.path}</Link>
          </div>
        ))}
        <a
          onClick={() => {

            //获取路由
            const routes = getRoutes()
            console.log(routes);
            //修改路由
            routes[0].routes.push({
              path: '/' + Math.random(),
              component: dynamic({
                loader: () => import('@/pages/test3'),
              }),
            })

            //更新路由
            updateRoutes(routes);

          }}
        >
          添加test3路由并重新render
        </a>
      </div>
    </div>
  );
};
