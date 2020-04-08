import React from 'react';

class Layout extends React.Component {
  componentDidMount() {
    console.log('layout挂载成功', this.props);
  }
  componentWillUnmount() {
    console.log('layout卸载成功');
  }
  render() {
    return (
      <div>
        {React.cloneElement(this.props.children, {
          routes: this.props.route.routes,
        })}
      </div>
    );
  }
}
export default Layout;
