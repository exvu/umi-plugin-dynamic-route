import 'antd/dist/antd.css';
import { getDynamicRoutes, findRouteByKey } from 'umi';
export function patchDynamicRoutes({ isModify, routes, ...options }) {
    console.log("执行patchDynamicRoutes");
    console.log(!isModify ? "没有修改路由" : "修改了路由");
    if (isModify) {
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
}
export function patchRoutes(routes) {
    console.log(routes);
}