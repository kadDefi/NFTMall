import BigNumber from '../decentralizedApi/bignumber.js'

// 通用算法(除)
export function chuDivision(data,power){
  let msUtils = Math.pow(10,power);
  let ret = new BigNumber(data);
  return parseFloat(ret.dividedBy(msUtils));
}

// 乘
export function chenDivision(data,power){
  let msUtils = Math.pow(10,power);
  let ret = new BigNumber(data);
  return parseFloat(ret * (msUtils));
}

// 保留小数点后几位(四舍五入的写法)
export function keepAFewDecimalPlaces(data,decima) {
  let orgialValue = parseFloat(data);
  return parseFloat(orgialValue.toFixed(decima));
}

// 保留小数点后几位(不四舍五入的写法)
export  function keepFormatDecimalDecimalPlaces(num, decimal) {
    num = num.toString()
    let index = num.indexOf('.')
    if (index !== -1) {
        num = num.substring(0, decimal + index + 1)
    } else {
        num = num.substring(0)
    }
    return parseFloat(num).toFixed(decimal)
}

// 将小数科学计数法的数值转化为小数数值
export function tranferDecimalScientificNotationValue(num){
  var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
  return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
}

// 将科学计数法数值转为正常可阅读数值
export function tranferPositiveScientificNotationValue(num) {
  //这边最好判断一下是否溢出
  if (!isFinite(num)) {
    return "MAX";
  }
  // 先把num转为字符串，这种效率比num.toString()要高
  let nStr = transferNumToString("" + num);
  return nStr;
}

// 将数字转为字符串
export function transferNumToString(numStr) {
  //这边看下你那边有没有指定格式，可能没有+，所以后面改成('E')就好了
  let temp = numStr.toUpperCase().split('E+')
  if (!temp[1]) {
      return numStr;
  }
  //这边我之前有试过乘法，但是返回之后，它又给转回科学计数法了
  let tempNumStr = "1";
  for (let i = 0; i < parseInt(temp[1]); i++) {
      tempNumStr += "0";
  }
  return tempNumStr;
}

// 将科学计数法数值转为字符串
export function scientificNotationToString(param) {
  let strParam = String(param)
  let flag = /e/.test(strParam)
  if (!flag) return param
  // 指数符号 true: 正，false: 负
  let sysbol = true
  if (/e-/.test(strParam)) {
    sysbol = false
  }
  // 指数
  let index = Number(strParam.match(/\d+$/)[0])
  // 基数
  let basis = strParam.match(/^[\d\.]+/)[0].replace(/\./, '')
  if (sysbol) {
    return basis.padEnd(index + 1, 0)
  } else {
    return basis.padStart(index + basis.length, 0).replace(/^0/, '0.')
  }
}

// 时间戳转换方法
export function timestampFormatDate(timeStamp) {
  var date = new Date(parseInt(timeStamp)*1000);
  var YY = date.getFullYear() + '-';
  var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
  var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  return YY + MM + DD +" "+hh + mm + ss;
}


// 计算两个时间之间的时间差 多少天时分秒
export function intervalTime(startTime,endTime) {
  // var timestamp=new Date().getTime(); //计算当前时间戳
  var timestamp = (Date.parse(new Date()))/1000;//计算当前时间戳 (毫秒级)
   var date1 = ""; //开始时间
  if(timestamp<startTime){
      date1=startTime;
  }else{
      date1 = timestamp; //开始时间
  }
  var date2 = endTime; //结束时间
  // var date3 = date2.getTime() - date1.getTime(); //时间差的毫秒数
  var date3 =  (date2- date1)*1000; //时间差的毫秒数
  //计算出相差天数
  var days = Math.floor(date3 / (24 * 3600 * 1000));
  //计算出小时数
  var leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000));
  //计算相差分钟数
  var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000));
  //计算相差秒数
  var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
  var seconds = Math.round(leave3 / 1000);
  console.log(days + "天 " + hours + "小时 ")
  // return   days + "天 " + hours + "小时 " + minutes + " 分钟" + seconds + " 秒"
  return   days + "天 " + hours + "小时 "
}

// 获取当前时间戳(毫秒级别)
export function getCurrentTime() {
  return new Date().getTime();
}

// 倒计时
export function timeCountDown(isHaveUnit,endTimestamp) {
  var timeString = '';
  // 获取当前时间
  var nowtime = new Date();
  nowtime = parseInt(getCurrentTime()/1000);
  endTimestamp = endTimestamp;
  // 时间差
  var lefttime = parseInt(endTimestamp - nowtime);
  var d = parseInt(lefttime / (24*60*60))
  var h = parseInt(lefttime / (60 * 60) % 24);
  var m = parseInt(lefttime / 60 % 60);
  var s = parseInt(lefttime % 60);
  d = addZero(d)
  h = addZero(h);
  m = addZero(m);
  s = addZero(s);
  if(isHaveUnit){
    timeString = `${d}d:${h}h:${m}mins`; //${d}d:${h}h:${m}mins:${s}s
  }else{
    timeString = `${d}:${h}:${m}:${s}`;
  }
  return timeString;
}

// 某个时间距离现在的距离
export function timeFromNow(isHaveUnit,startTime) {
  var timeString = '';
  // 获取当前时间
  var nowtime = new Date();
  nowtime = getCurrentTime()/1000;
  // 时间差
  var lefttime = parseInt(nowtime - startTime);
  var d = parseInt(lefttime / (24*60*60))
  var h = parseInt(lefttime / (60 * 60) % 24);
  var m = parseInt(lefttime / 60 % 60);
  var s = parseInt(lefttime % 60);
  d = addZero(d)
  h = addZero(h);
  m = addZero(m);
  s = addZero(s);
  if(isHaveUnit){
    timeString = `${d}d:${h}h:${m}m`;
  }else{
    timeString = `${d}:${h}:${m}:${s}`;
  }
  return timeString;
}

export function addZero(i){
  return i < 10 ? "0" + i: i + "";
}


export function checkAuditTime(beginTime, endTime) {
  let nowDate = new Date();
  let beginDate = new Date(nowDate);
  let endDate = new Date(nowDate);

  let beginIndex = beginTime.lastIndexOf("\:");
  let beginHour = beginTime.substring(0, beginIndex);
  let beginMinue = beginTime.substring(beginIndex + 1, beginTime.length);
  beginDate.setHours(beginHour, beginMinue, 0, 0);

  let endIndex = endTime.lastIndexOf("\:");
  let endHour = endTime.substring(0, endIndex);
  let endMinue = endTime.substring(endIndex + 1, endTime.length);
  endDate.setHours(endHour, endMinue, 0, 0);
  if (nowDate.getTime() - beginDate.getTime() >= 0 && nowDate.getTime() <= endDate.getTime()) {
    return true;
  } else {
    return false;
  }
}

