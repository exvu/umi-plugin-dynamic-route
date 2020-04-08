/* eslint-disable */

import { IApi, utils } from 'umi';
import { join } from 'path';
import { readFileSync } from 'fs';
import { js_beautify } from 'js-beautify';
import { Route } from '@umijs/core';
const DIR = 'plugin-dynamic-route';
const TEMPLATE_PATH = join(__dirname, 'template');
const { Mustache, winPath } = utils;
export default (api: IApi) => {
  const { dynamicRoutes } = api.userConfig;
  if (!dynamicRoutes) {
    api.logger.warn('请配置dynamicRoutes,否则plugin-dynamic-route将无效');
    return;
  }

  api.describe({
    key: 'dynamicRoutes',
    config: {
      schema(joi) {
        return joi.object();
      },
      default: {},
      onChange: api.ConfigChangeType.regenerateTmpFiles,
    },
    enableBy: api.EnableBy.config,
  });
  api.onGenerateFiles({
    fn: async function () {
      /**
       * ======在.umi生成函数===
       */
      const updateTpl = readFileSync(join(TEMPLATE_PATH, 'update.tpl'), 'utf-8');

      api.writeTmpFile({
        path: `${DIR}/update.ts`,
        content: Mustache.render(updateTpl, {
          runtimePath: winPath(require.resolve('@umijs/runtime')),
          renderPath: winPath(require.resolve('@umijs/renderer-react/dist/index.js')),
        }),
      });
      /**
       * ======在.umi生成导出函数===
       */
      const exportsTpl = readFileSync(join(TEMPLATE_PATH, 'exports.tpl'), 'utf-8');

      api.writeTmpFile({
        path: `${DIR}/exports.ts`,
        content: Mustache.render(exportsTpl, {}),
      });

      /**
       * ======在.umi生成动态路由===
       */
      const coreRoute = new Route();
      let routeText = '{';
      for (const key in dynamicRoutes) {
        routeText +=
          `${key}:` +
          coreRoute.getJSON({
            routes: await coreRoute.getRoutes({
              config: {
                ...api.config,
                routes: dynamicRoutes[key],
              },
              root: api.paths.absPagesPath!,
            }),
            config: api.config,
            cwd: api.cwd,
          }) +
          ',';
      }
      routeText += '}';
      const dynamicRoutesTpl = readFileSync(join(TEMPLATE_PATH, 'dynamicRoutes.tpl'), 'utf-8');
      api.writeTmpFile({
        path: `${DIR}/dynamicRoutes.ts`,
        content: js_beautify(
          Mustache.render(dynamicRoutesTpl, {
            dynamicRoutes: routeText,
            runtimePath: winPath(require.resolve('@umijs/runtime')),
          }),
        ),
      });
    },
  });
  // 导出内容
  api.addUmiExports(() => [
    {
      exportAll: true,
      source: `../${DIR}/exports`,
    },
  ]);
};
