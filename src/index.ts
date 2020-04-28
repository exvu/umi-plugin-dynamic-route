/* eslint-disable */

import { IApi } from 'umi';
import { join } from 'path';
import umi2 from './umi2';
import umi3 from './umi3';
export interface Config{
  dirName:string,
}
const DIR_NAME = 'plugin-dynamic-route';
export default (api: IApi) => {
  const config = {
    dirName:DIR_NAME,
  }
  if(process.env.UMI_VERSION>3){
    umi3(api,config);
  }else{
    umi2(api as any,config);
  }
};
