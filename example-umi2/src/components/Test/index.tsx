import React from 'react';
import styles from './index.less';
import {  reloadRoutes } from 'umi';

export default ({ ...props }) => {
  return (
    <div>
      <h1 className={styles.title}>当前页面{props.location.pathname}</h1>
      <div style={{ padding: 30 }}>
        <a
          onClick={() => {
            //更新路由
            reloadRoutes({
              test:"自定义"
            });
          }}
        >
          加载动态路由
        </a>
      </div>
    </div>
  );
};
