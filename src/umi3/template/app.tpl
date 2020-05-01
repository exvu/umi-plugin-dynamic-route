import { plugin } from '@@/core/plugin';
import {ApplyPluginsType,getRoutes,reloadRoutesOptions,useModel} from 'umi';
import lodash from 'lodash';
export function rootContainer(dom){
    console.log(reloadRoutesOptions)
   const routes = getRoutes();
    if(reloadRoutesOptions.isModify){ 
        plugin.applyPlugins({
            key: 'patchDynamicRoutes',
            type: ApplyPluginsType.event,
            args: { 
              routes,
                ...reloadRoutesOptions,
            },
        });
    }else{
      console.log("解决plugin-layout memo缓存问题")
      routes.splice(0,routes.length,...lodash.cloneDeep(routes))
    }
    return dom;
}
