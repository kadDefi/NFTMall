
import BigNumber from "bignumber.js";

/*
  在标签中添加(也会禁止弹框层的滑动)
  1、@touchmove.prevent @mousewheel.prevent

  在点击事件中添加
  2、document.documentElement.style.overflowY = 'hidden'
     document.documentElement.style.overflowY = 'auto'

  3、let custom =function(e){e.preventDefault();};
     document.body.style.overflow='hidden';
     document.addEventListener("touchmove", custom,false);//禁止页面滑动

     let custom=function(e){e.preventDefault();};
     document.body.style.overflow='auto';//出现滚动条
     document.removeEventListener("touchmove", custom,false);
 */

/*
 // 动态的监听浏览器窗口的变化
    let that = this;
    window.onresize= () => {
      return (() => {
        window.screenWidth = document.body.clientWidth;
        that.screenWidth = window.screenWidth;
      })();
    }

    dynamicHeight(){
      if(this.screenWidth < 768){
        return this.isShowH5DropBox ? `${931 / 750 * 100}vw`: `${217 / 750 * 100}vw`;
      }
      return `${70}px`;
    },

    window.ethereum.enable().then(function (accounts) {
      console.log("用户授权连接钱包成功返回的地址 accounts = ", accounts[0]);
                if(chainID == '56'){
                   that.contentWallet = true;
                   that.addressValue = that.translateAddress(accounts[0]);
                }
    });

    // 监听,当路由发生变化的时候执行
watch:{
  $route(to,from){
    console.log(to.path);
  }
},
或者
// 监听,当路由发生变化的时候执行
watch: {
  $route: {
    handler: function(val, oldVal){
      console.log(val);
    },
    // 深度观察监听
    deep: true
  }
},
或者
// 监听,当路由发生变化的时候执行
watch: {
  '$route':'getPath'
},
methods: {
  getPath(){
    console.log(this.$route.path);
  }
}

// // 创建读取文件对象
// const reader = new FileReader();
// // 文件读取完成后 读取完成后，将结果赋值给img的src
// reader.onload = function() {
//   that.isUploadSuccess = true;
//   that.selectedIamgeUrl = reader.result;
// }
// // 文件读取失败
// reader.onerror = function(error) {
//   console.log('图片上传失败，请检查。');
// }
// // 发起异步请求，读取文件
// reader.readAsDataURL(file);
// console.log(' 文件添加、 上传、 失败');
*/

/**
 *  弹框时候是否允许底层滑动
 */
export function setupBottomlayerScroll(isAllow) {
  if(isAllow){
    document.documentElement.style.overflowY = 'auto';
  }else{
    document.documentElement.style.overflowY = 'hidden';
  }
}

/**
 * 判断当前设备是否是手机端
 */
 export function isMobile(){
  let moblie = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
  return moblie !== null;
}

/**
 *  字符串截取方法
 */
export function getCharactersLen(charStr, cutCount) {
  if (charStr == null || charStr == '') return '';
  var totalCount = 0;
  var newStr = '';
  for (var i = 0; i < charStr.length; i++) {
      var c = charStr.charCodeAt(i);
      if (c < 255 && c > 0) {
          totalCount++;
      } else {
          totalCount += 2;
      }
      if (totalCount >= cutCount) {
          newStr += charStr.charAt(i);
          break;
      }
      else {
          newStr += charStr.charAt(i);
      }
  }
  return newStr;
}　　

/**
 *  获取元素在数组中的下标
 */
 export function getObjectIndexAtArray(arr, obj) {
  let i = arr.length;
  while (i--) {
      if (arr[i] === obj) {
          return i;
      }
  }
  return -1;
}

/**
 * 删除数组中某个对象
 */
 export function removeObjectFromArray(_arr, _obj) {
  var length = _arr.length;
  for (var i = 0; i < length; i++) {
      if (JSON.stringify(_arr[i]) == JSON.stringify(_obj)) {
          if (i == 0) {
              _arr.shift(); //删除并返回数组的第一个元素
              return _arr;
          } else if (i == length - 1) {
              _arr.pop();  //删除并返回数组的最后一个元素
              return _arr;
          }else {
              _arr.splice(i, 1); //删除下标为i的元素
              return _arr;
          }
      }
  }
}
// 过度数据
export function overExtensibleListData(dataList){
  var copiedData = [];
  dataList.forEach(obj => {
    var newObj = {};
    for(let i in obj) {
      newObj[i] = obj[i];
    }
    copiedData.push(newObj);
  });
  return copiedData;
}

export function overExtensibleMapData(object){
  var newObj = {};
  for(let i in object) {
    newObj[i] = object[i];
  }
  return newObj;
}

//返回数组元素是否出现重复项（等于0：没有，大于0：有）
export function checkArrayElementRepeat(array){
  array.sort();  //数组排序
  var reNum = 0;  //返回结果
  //遍历整个数组对象
  for(var i=0;i<array.length;i++){
    //跳过最后一个元素的比较
    if (i + 1 == array.length) {
      continue;
    }
    // 判断相邻的元素是否相同
    if (array[i] == array[i + 1]) {
      reNum += 1;
    }
  }
   return reNum > 0 ? true : false;
}

export function convertStringToHex(value){
  return new BigNumber(`${value}`).toString(16);
}

export function sanitizeHex(hex) {
  hex = hex.substring(0, 2) === "0x" ? hex.substring(2) : hex;
  if (hex === "") {
    return "";
  }
  hex = hex.length % 2 !== 0 ? "0" + hex : hex;
  return "0x" + hex;
}

/**
 * dataurl: base64
 * filename: 设置文件名称
*/
export const dataURLtoFile = (dataurl, filename) => {
  let arr = dataurl.split(','),
  mime = arr[0].match(/:(.*?);/)[1],
  bstr = atob(arr[1]),
  n = bstr.length,
  u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {
    type: mime
  });
}

/**
 * 简单实现防抖方法
 * @param fn 要防抖的函数
 * @param delay 防抖的毫秒数
 * @returns {Function}
 */
export function simpleDebounce(fn, delay = 100) {
  let timer = null
  return function() {
    let args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
