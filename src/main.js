import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './fonts/myFont.css'
import 'normalize.css/normalize.css' // 消除各浏览器差异
import 'element-ui/lib/theme-chalk/index.css'
import "./styles/index.scss"

import qs from 'qs'
import i18n from './i18n/i18n'
import ElementUI from 'element-ui'
import VueCookies from 'vue-cookies'
import ElementLocale from 'element-ui/lib/locale'
import VueAwesomeSwiper from 'vue-awesome-swiper';

import zoonHeader from './components/zoonHeader/index'
import zoonHeaderMb from './components/zoonHeaderMb/index'
import zoonFooter from './components/zoonFooter/index'
import pagination from './components/pagination/index'
import bottomBar from './components/bottomBar/index'
import announcements from './components/announcement/index'

import EventBus from './utils/bus.js'
import DecentralizedApi from './decentralizedApi/decentralizedApi.js'

import Loading from './components/loading/index.js'
import DialogMsg from './components/dialogmsg/index.js'
import VueCropper from 'vue-cropper'
import Vconsole from "vconsole";
import * as filters from './filters/globalFilters' // global filters

import Vant from 'vant';
import {NavBar, Popup, Tabbar, TabbarItem} from 'vant';
import 'vant/lib/index.css';

Vue.config.productionTip = false;
// 挂载到原型上当成属性调用
Vue.prototype.$QS = qs;
Vue.prototype.$eventBus = EventBus;
Vue.prototype.$decentralized = DecentralizedApi;

// 国际化
ElementLocale.i18n((key, value) =>
  i18n.t(key, value)
);

// 全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 开发环境使用，生产环境自动取消
if (process.env.NODE_ENV === "development") {
    new Vconsole();
}

// 全局引入插件或者组件
Vue.use(ElementUI);
Vue.use(zoonHeader);
Vue.use(zoonHeaderMb);
Vue.use(zoonFooter);
Vue.use(announcements);
Vue.use(pagination);
Vue.use(bottomBar);
Vue.use(VueCookies);
Vue.use(DialogMsg);
Vue.use(Loading);
Vue.use(VueAwesomeSwiper);
Vue.use(Vant);
Vue.use(VueCropper)
/**
 vue.prototype 和 vue.use()的区别
 1、不是为了vue写的插件(插件内要处理)不支持Vue.use()加载方式
 2、非vue官方库不支持new Vue()方式
 3、每一个vue组件都是Vue的实例，所以组件内this可以拿到Vue.prototype上添加的属性和方法。
 4、Vue的插件是一个对象,插件对象必须有install字段.install字段是一个函数.初始化插件对象需要通过Vue.use()

 安装vue.js插件，如果插件是一个对象，必须提供install方法
 如果插件是一个函数，它会被作为install方法。install调用时，会将vue作为参数传入

 总结：组件是是Vue的实例，this可以拿到Vue.prototype上添加的属性和方法
 插件是一个对象,插件对象必须有install字段.install字段是一个函数.初始化插件对象需要通过Vue.use()
 */

// // 路由守卫
// router.beforeEach((to, from, next) => {
//   debugger
//   if(from.name === 'extract'){
//     if(Utils.isMobile()){
//       next('/castpoolMb')
//     }else{
//       next('/castpool')
//     }
//   }
// })

//页面跳转滚动条归零
// router.afterEach((to, from, next) => {
//   window.scrollTo(0, 0)
// })
// 创建和挂载根实例。(比如通过 router 配置参数注入路由、从而让整个应用都有路由功能）
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
