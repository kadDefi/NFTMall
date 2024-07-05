import Vue from 'vue';
import DialogMsgVue from './dialogMsg.vue'

const DialogMsg = {};
// install 是Vue官方提供的开发插件的key值
DialogMsg.install = (Vue) => {
  const vue = Vue;
  // 创建构造器
  const msgClass = vue.extend(DialogMsgVue);
  // 实例化类
  const instance = new msgClass();
  instance.$mount(document.createElement('div'));
  document.body.appendChild(instance.$el);
  const msgConnect = {
    showMessage(message){
      let isEnglish = true;
      if (window.localStorage.getItem("lang") === "zh") {
        isEnglish = false;
      }
      instance.isEnglish = isEnglish;
      instance.showMask = true;
      instance.textMsg = message;
    },
  }
  vue.prototype.$dialogMsg = msgConnect;
}

export default DialogMsg;

