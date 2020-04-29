import 'antd/dist/antd.css';
import { modifyRoutes, getDynamicRoutes, findRouteByKey } from 'umi';
import { IRoute } from 'umi-types';
export function patchRoutes(routes: IRoute[]) {
    console.log(1);
    modifyRoutes(({ isModify, ...options }) => {
        console.log(!isModify ? "没有修改路由" : "修改了路由");
        if (isModify) {
            const targetRoute = findRouteByKey(routes, 'home', 'routeKey1');
            if (targetRoute) {
                const dynamicRoutes = getDynamicRoutes('test')
                if (targetRoute.route && dynamicRoutes) {
                    targetRoute.route.routes.push(...routes)
                    console.error("替换路由成功")
                } else {
                    console.error("未找到动态路由", dynamicRoutes)
                }

            } else {
                console.error("未找到目标路由")
            }
        }
    })
}
export function render(oldRender) {
    oldRender();
    // setTimeout(() => {
    //     oldRender()
    // }, 4000)
}