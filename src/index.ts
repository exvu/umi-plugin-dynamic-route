/* eslint-disable */
import umi2 from './umi2';
import umi3 from './umi3';
export interface Config {
  dirName: string,
}
const DIR_NAME = 'plugin-dynamic-route';
export default (api) => {
  const config = {
    dirName: DIR_NAME,
  }
  console.log("版本", process.env.UMI_VERSION)
  switch (parseInt(process.env.UMI_VERSION)) {
    case 3:
      return umi3(api, config);
    case 2:
      return umi2(api, config);
    default:
      throw new Error("暂时支持umi2,umi3");
  }
};
