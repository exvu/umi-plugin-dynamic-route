

import { plugin } from '../core/plugin';
import { history } from '../core/history';
import { ApplyPluginsType } from '{{{ runtimePath }}}';
import { renderClient } from '{{{ renderPath }}}';


let cacheRoutes = [];

const updateRoutes = (routes) => {
  cacheRoutes = routes;
  return plugin.applyPlugins({
    key: 'render',
    type: ApplyPluginsType.modify,
    initialValue: () => {
      console.log("路由已更新")
      return renderClient({
        // @ts-ignore
        routes,
        plugin,
        history,
        rootElement: '{{{ rootElement }}}',
        defaultTitle: '{{{ defaultTitle }}}',
      });
    },
    args:{},
  });
};
const getRoutes = () =>  require('../core/routes').routes;
function getDynamicRoutes(key:any){
  const routes = require('./dynamicRoutes').routes;
  return routes[key];
}
export {updateRoutes,getRoutes,getDynamicRoutes}
