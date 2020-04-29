import {getRoutes,reloadRoutesOptions} from '@@/plugin-dynamic-route'
export function rootContainer(dom){
    const plugins = require('umi/_runtimePlugin');
    console.log(reloadRoutesOptions)
    if(reloadRoutesOptions.isModify){
        plugins.applyForEach('patchDynamicRoutes', { 
            initialValue: {
            routes:getRoutes(),
            ...reloadRoutesOptions,
            },
        });
    } 
    return dom;
}