
/**
 *  判断字符是否为空的方法
 * @param {string} param
 * @returns {Boolean}
 */
export function isStringEmpty(param) {
  let str = param;
  if (typeof param == "string") {
    str = param.trim();
  }
  if (typeof str == "undefined" || str == null || str === ""){
      return true;
  } else {
   return false;
  }
}

// 判断当前对象是否为空
export function isObjectEmpty(object) {
  return Object.keys(object).length === 0;
}
/**
 * 验证手机号
 * @param {string | Number} mobile
 * @returns {Boolean}
 */
export function validMobile(mobile) {
  const str = '' + mobile
  const reg = /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[0-9])[0-9]{8}$/
  return reg.test(str)
}

/**
 * 验证邮箱
 * @param {String} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
  return reg.test(email)
}
