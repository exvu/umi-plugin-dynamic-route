import React from 'react';
import styles from './index.less';
import { Link } from 'umi';
import { updateRoute, reloadRoutes, getDynamicRoutes } from 'umi';

export default ({ ...props }) => {
  console.log(props)
  return (
    <div>
      <h1 className={styles.title}>当前页面{props.location.pathname}</h1>
      <div style={{ padding: 30 }}>
        <a
          onClick={() => {
            //获取完整路由
            updateRoute("home", ({ route }, sourceRoutes) => {
              const routes = getDynamicRoutes('test')
              if (route.children && routes) {
                route.children.push(...routes)
              } else {
                console.error("未找到动态路由或目标路由")
              }
              console.log(route.children)
            });

            //更新路由
            reloadRoutes();
          }}
        >
          加载动态路由
        </a>
        {/* <a
          onClick={() => {

            //获取完整路由
            updateRoute("home",({route},sourceRoutes)=>{
              if(route.routes){
                route.routes.push({
                  path: '/' + md5(Math.random()),
                  component: dynamic({
                    loader: () => import('@/pages/test3'),
                  }),
                })
              }
            });
            
            //更新路由
            reloadRoutes();
          }}
        >
          随机产生地址添加test3界面并重新render
        </a> */}
      </div>
    </div>
  );
};
