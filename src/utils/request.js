import axios from 'axios'
import Vue from 'vue'

const settingConfig = require('../settings.js');

// const BASE_URL = process.env.VUE_APP_API_URL // 第二节配置的url 可以读取 一定要VUE_APP_A为前缀

// console.log(process.env)
// 环境的切换
/*第一层if判断生产环境和开发环境*/
// if (process.env.NODE_ENV === 'production') {
//   /*第二层if，根据.env文件中的VUE_APP_MODE判断是生产环境还是测试环境*/
//   if (process.env.VUE_APP_MODE === 'pro') {
//     //production 生产环境
//     axios.defaults.baseURL = '' //路径
//   } else {
//     //     //test 测试环境
//     axios.defaults.baseURL = '' //路径
//   }
// } else {
//   //   dev 开发环境
//   axios.defaults.baseURL = '/api' //路径
// }

// 环境的切换
if (process.env.NODE_ENV === 'development') {// 开发环
  axios.defaults.baseURL = settingConfig.baseOneURL;  //'/api';
} else if (process.env.NODE_ENV === 'production') {// 正式环境
  axios.defaults.baseURL = settingConfig.baseOneURL;
} else { // 测试环境
  axios.defaults.baseURL = settingConfig.baseOneURL;
}
// 创建axios实例
const http = axios.create({
  // baseURL:"http://192.168.0.190:9010",
  timeout: 30000, // 请求超时时间
})
// function startLoading() {
//   // 开始加载
//   // Loading.service({});
// }

// function endLoading() {
//   // 结束加载
//   // Vue.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
//   //   loadingInstance.close();
//   // });
// }

// 添加request拦截器
// http.interceptors.request.use(
//   (config) => {
//     let token=localStorage.getItem("token")
//     console.log(token)
//     if(token){
//     config.headers.token=token
//     }
//     return config
//   },
//   (error) => {
//     Promise.reject(error)
//   },
// )
// 添加respone拦截器
http.interceptors.response.use((response) => {
  if (response.status != 200) {
      console.log(Vue)
      return Promise.reject(response)
  }
  if (response.data.code == 401) {
      localStorage.clear()
  }
  return Promise.resolve(response.data)
  },(error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.log(401)
          break
        case 403:
          console.log(403)
          break
        case 404:
          console.log(404)
          break
        case 500:
          console.log(500)
          break
      }
    }
    // Message.error('请求失败!')
    return Promise.reject(error.response)
  },
)

function get(url, params = {}) {
  return http({
    url,
    method: 'GET',
    headers: {},
    params,
  })
}

//封装post请求
function post(url, data = {}) {
  return http({
    url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', //application/x-www-form-urlencoded  application/json;charset=UTF-8
    },
    data,
  })
}

// delete请求
function deletes (url) {
  return http({
    url,
    method: 'DELETE',
  })
}

// get请求
function put (url, params = {}) {
  return http({
    url,
    method: 'PUT',
    params,
  })
}

export default {
  get,
  put,
  post,
  deletes,
}