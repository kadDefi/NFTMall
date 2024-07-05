import Vue from 'vue'
import VueI18n from "vue-i18n";
import messages from './lang';

Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: window.localStorage.getItem('lang')||'en',// 设置国际化地区
  messages, // 设置地区相关信息内容数据
  silentTranslationWarn: true,//去掉国际化警告
})
export default i18n
