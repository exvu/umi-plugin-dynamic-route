import { getDynamicRoutes, findRouteByKey,useModel } from 'umi';
export function patchDynamicRoutes({ routes, ...options }) {
    console.log("执行patchDynamicRoutes");
    const targetRoute = findRouteByKey(routes, 'home', 'routeKey1');
    if (targetRoute) {
        const dynamicRoutes = getDynamicRoutes('test')
        console.log(dynamicRoutes)

        if (targetRoute.route && dynamicRoutes) {
            targetRoute.route.routes.splice(targetRoute.route.routes.length - 1, 0, ...dynamicRoutes)
            console.error("替换路由成功", routes)
        } else {
            console.error("未找到动态路由", dynamicRoutes)
        }

    } else {
        console.error("未找到目标路由")
    }
}