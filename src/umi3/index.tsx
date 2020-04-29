/* eslint-disable */

import { IApi, utils } from 'umi';
import { join } from 'path';
import lodash from 'lodash';
import { readFileSync } from 'fs';
import { Config } from '..';
const TEMPLATE_PATH = join(__dirname, 'template');
const { Mustache, winPath } = utils;
export default (api: IApi, config: Config) => {
  api.logger.info("使用umi3的动态路由插件");
  const { dynamicRoutes } = api.userConfig;
  if (!dynamicRoutes) {
    api.logger.warn('请配置dynamicRoutes,否则plugin-dynamic-route将无效');
    return;
  }

  /**
   * 约定配置的类型
   */
  api.describe({
    key: 'dynamicRoutes',
    config: {
      schema(joi) {
        return joi.object({
          routeKey: joi.string(),
          routes: joi.object().pattern(/^[a-zA-Z0-9]+$/, joi.array().items(
            joi.object({
              path: joi.string().description('Any valid URL path'),
              component: joi
                .alternatives(joi.string(), joi.function())
                .description(
                  'A React component to render only when the location matches.',
                ),
              wrappers: joi.array().items(joi.string()),
              redirect: joi.string().description('navigate to a new location'),
              exact: joi
                .boolean()
                .description(
                  'When true, the active class/style will only be applied if the location is matched exactly.',
                ),
              routes: joi.array().items(joi.link('...')),
            }).unknown()
          ))
        });
      },
      default: {},
      onChange: api.ConfigChangeType.regenerateTmpFiles,
    },
    enableBy: api.EnableBy.config,

  });
  /**
      * ======在.umi生成函数===
      */
  api.onGenerateFiles({
    fn() {
      const updateTpl = readFileSync(join(TEMPLATE_PATH, 'index.tpl'), 'utf-8');

      api.writeTmpFile({
        path: `${config.dirName}/index.ts`,
        content: Mustache.render(updateTpl, {
          routeKey: dynamicRoutes.routeKey || 'routeKey',
          runtimePath: winPath(require.resolve('@umijs/runtime'))
        }),
      });
    },
  });
  /**
   * ======在.umi生成导出函数===
   */
  api.onGenerateFiles({
    fn() {

      const exportsTpl = readFileSync(join(TEMPLATE_PATH, 'exports.tpl'), 'utf-8');

      api.writeTmpFile({
        path: `${config.dirName}/exports.ts`,
        content: Mustache.render(exportsTpl, {}),
      });

    }
  })
  api.modifyRoutes((routes) => {
    routes = lodash.cloneDeep(routes);
    if (dynamicRoutes && dynamicRoutes.routes) {
      const newDynamicRoutes = [];
      for (const key in dynamicRoutes.routes) {
        newDynamicRoutes.push({
          path: "/",
          name: key,
          [dynamicRoutes.routeKey]: `dynamicRoutes_${key}`,
          routes: dynamicRoutes.routes[key]
        })
      }
      routes.push({
        path: '/_dynamicRoutes',
        name: "临时挂载动态路由",
        [dynamicRoutes.routeKey]: 'dynamicRoutes',
        routes: newDynamicRoutes
      })
    }

    return routes;
  })

  // 导出内容
  api.addUmiExports(() => [
    {
      exportAll: true,
      source: `../${config.dirName}/exports`,
    },
  ]);
  api.addEntryCode(() => [
    `export {
       getClientRender as clientRender
    }`
  ]);
  api.addRuntimePluginKey(() => ([
    'patchDynamicRoutes'
  ]))

};
