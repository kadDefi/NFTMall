import Vue from "vue";
import {chuDivision} from '@/utils/computing';
const settingConfig = require('../settings.js');
/**
 *  讲中间字符进行省略处理
 * @param {string} address
 * @param {length} reserve
 * @return {string}
 */
export function omitCharacters(address,reserve) {
  return address.substring(0,5) + '...' + address.substring(address.length - reserve);
}

/**
 * 将价格进行除10的18次方
 * @param  num
 * @param power
 */
export function tanferUnitData(num,power) {
  return chuDivision(num,power);
}

/**
 * 拼接图片绝对路径
 * @param  imageUrl
 */
export function concatenatePaths(imageUrl) {
  return `${settingConfig.ipfsNFTUrl + imageUrl}`;
}

/**
 * 保留小数点过滤器，尾数四舍五入
 * num 源数据
 * decimals 保留的小数位数
 */
 export const roundingDecimals = function(num,decimal) {
  // 截取当前数据到小数点后两位
  return parseFloat(num).toFixed(decimal);
}
/**
 * 保留小数点过滤器，尾数不四舍五入
 * num 源数据
 * decimals 保留的小数位数
 */
export const notRoundingDecimals = function (num, decimal) {
  let nums = num.toString();
  let index = nums.indexOf('.')
  if (index !== -1) {
    nums = nums.substring(0, decimal + index + 1)
  } else {
    nums = nums.substring(0)
  }
  return parseFloat(nums).toFixed(decimal);
}

/**
 * 对源数据截取decimals位小数，不进行四舍五入
 * num 源数据
 * decimals 保留的小数位数
 */
 export const noRoundingDecimals = (num, decimals) => {
  if (isNaN(num) || (!num && num !== 0)) {
    return '--'
  }
  // 默认为保留的小数点后两位
  let dec = decimals ? decimals : 2
  let tempNum = Number(num)
  let pointIndex = String(tempNum).indexOf('.') + 1 // 获取小数点的位置 + 1
  let pointCount = pointIndex ? String(tempNum).length - pointIndex : 0 // 获取小数点后的个数(需要保证有小数位)
  // 源数据为整数或者小数点后面小于decimals位的作补零处理
  if (pointIndex === 0 || pointCount <= dec) {
    let tempNumA = tempNum
    if (pointIndex === 0) {
      tempNumA = `${tempNumA}.`
      for (let index = 0; index < dec - pointCount; index++) {
        tempNumA = `${tempNumA}0`
      }
    } else {
      for (let index = 0; index < dec - pointCount; index++) {
        tempNumA = `${tempNumA}0`
      }
    }
    return tempNumA
  }
  let realVal = ''
  // 截取当前数据到小数点后decimals位
  realVal = `${String(tempNum).split('.')[0]}.${String(tempNum)
    .split('.')[1]
    .substring(0, dec)}`
  // 判断截取之后数据的数值是否为0
  if (realVal === '0') {
    realVal = 0
  }
  return realVal
}

// // 导出的是对象，可以直接通过 key 和 value 来获得过滤器的名和过滤器的方法
// Object.keys(filters).forEach((key) => {
//   // 定义全局过滤器、通过过滤器方法将外部的JS挂载到Vue上去
//   Vue.filter(key,filters[key]);
// });
