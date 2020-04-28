/* eslint-disable */

import { IApi } from 'umi-types';
import { join } from 'path';
import assert from 'assert';
import joi from '@hapi/joi';
import routesToJSON from 'umi-build-dev/lib/routes/routesToJSON';
import stripJSONQuote from 'umi-build-dev/lib/routes/stripJSONQuote';

import { readFileSync } from 'fs';
import { js_beautify } from 'js-beautify';
import { Config } from '..';
import { utils } from 'umi';
const { Mustache, winPath } = utils;
const TEMPLATE_PATH = join(__dirname, 'template');
export default (api: IApi, config: Config) => {
  api.log.info("使用umi2的动态路由插件");
  const { dynamicRoutes } = api.config;

  if (!dynamicRoutes) {
    api.log.warn('请配置dynamicRoutes,否则plugin-dynamic-route将无效');
    return;
  }

  /**
   * ================配置类型校验约束类型==========================
   */
  api._registerConfig(() => {
    return () => {
      return {
        name: 'dynamicRoutes',
        validate(value) {
          const schema = joi.object({
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
          const { error } = schema.validate(value);
          if (error) {
            assert(false, error.message)
          }
        },
      };
    };
  });


  /**
   * =================生成动态路由配置文件==============
   */
  api.onGenerateFiles(async function () {
    api.log.info("更新动态路由中")
    const { dynamicRoutes } = api.config;
    let routesStr = '{';
    if (dynamicRoutes && dynamicRoutes.routes) {
      for (const key in dynamicRoutes.routes) {
        routesStr += `"${key}":${stripJSONQuote(routesToJSON(dynamicRoutes.routes[key], api))}`
      }
    }
    routesStr += '}';
    const dynamicRoutesTpl = readFileSync(join(TEMPLATE_PATH, 'dynamicRoutes.tpl'), 'utf-8');
    api.writeTmpFile(`${config.dirName}/dynamicRoutes.ts`, js_beautify(
      Mustache.render(dynamicRoutesTpl, {
        dynamicRoutes: routesStr,
        runtimePath: winPath(require.resolve('@umijs/runtime')),
      }),
    ));
  })

  /**
   * =================生成插件主逻辑代码=================
   */
  api.onGenerateFiles(function () {
    const updateTpl = readFileSync(join(TEMPLATE_PATH, 'index.tpl'), 'utf-8');
    api.writeTmpFile(`${config.dirName}/index.ts`, Mustache.render(updateTpl, {
      routeKey: dynamicRoutes.routeKey || 'routeKey',
      dynamicRoutesPath: winPath(`./${config.dirName}/dynamicRoutes`),
    }));
  });

  /**
   * =================生成导出代码=================
   */
  api.onGenerateFiles(function(){
     /**
      * ======在.umi生成导出函数===
      */
     const exportsTpl = readFileSync(join(TEMPLATE_PATH, 'exports.tpl'), 'utf-8');

     api.writeTmpFile(`${config.dirName}/exports.ts`,exportsTpl);
  });

  // 导出内容
  api.addUmiExports(() => [
    {
      exportAll: true,
      source: `./${config.dirName}/exports`,
    },
  ]);
  api.addEntryCode(`export {clientRender}`)
};
