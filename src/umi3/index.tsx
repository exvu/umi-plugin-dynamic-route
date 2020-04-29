/* eslint-disable */

import { IApi, utils } from 'umi';
import { join } from 'path';
import { readFileSync } from 'fs';
import { js_beautify } from 'js-beautify';
import { Route } from '@umijs/core';
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
          rootElement: api.config.mountElementId,
          defaultTitle: api.config.title,
          dynamicRoutesPath: winPath(`./${config.dirName}/dynamicRoutes`),
          runtimePath: winPath(require.resolve('@umijs/runtime')),
          renderPath: winPath(require.resolve('@umijs/renderer-react/dist/index.js')),
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
  /**
   * ======在.umi生成动态路由===
   */
  api.onGenerateFiles({
    fn: async function () {
      const route = new Route();
      const dynamicRoutes = api.userConfig.dynamicRoutes.routes;
      const newDynamicRoutes = {};
      if (dynamicRoutes == null) {
        return null;
      }
      for (const key in dynamicRoutes) {
        newDynamicRoutes[key] = await route.getRoutes({
          config: {
            ...api.config,
            routes: dynamicRoutes[key],
          },
          root: api.paths.absPagesPath!,
        });
      }
      let routeText = '{';
      for (const key in dynamicRoutes || {}) {
        routeText +=
          `${key}:` +
          new Route().getJSON({
            routes: dynamicRoutes[key],
            config: api.config,
            cwd: api.cwd,
          }) +
          ',';
      }
      routeText += '}';
      const dynamicRoutesTpl = readFileSync(join(TEMPLATE_PATH, 'dynamicRoutes.tpl'), 'utf-8');
      api.writeTmpFile({
        path: `${config.dirName}/dynamicRoutes.ts`,
        content: js_beautify(
          Mustache.render(dynamicRoutesTpl, {
            dynamicRoutes: routeText,
            runtimePath: winPath(require.resolve('@umijs/runtime')),
          }),
        ),
      });
    }
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
};
