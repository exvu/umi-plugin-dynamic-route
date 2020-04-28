import React from 'react';
import styles from './index.css';
import { Layout, Menu, Breadcrumb } from 'antd';
import { Link } from 'umi';
const { Header, Content, Sider } = Layout;

function buildMenu(routes: any) {

  return routes.map(item => {
    if(!item.path){
      return null;
    }
    if (item.routes) {
      return (
        <Menu.SubMenu title={item.menu?.name||item._title}>
          {buildMenu(item.routes)}
        </Menu.SubMenu>
      );
    }
    return (
      <Menu.Item title={item.menu?.name||item._title}>
        <Link to={item.path}>{item.menu?.name||item._title}</Link>
      </Menu.Item>
    )
  })
}
const BasicLayout: React.FC = props => {
  const { route: { routes } } = props;
  return (
    <Layout style={{ height: '100%' }}>
      <Header className="header">
        <div className="logo" />
        <h2 style={{ color: '#fff' }}>动态路由</h2>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            {buildMenu(routes)}
          </Menu>
        </Sider>
        <Layout >
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            {props.children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
