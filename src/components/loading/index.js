import Vue from 'vue';
import LoadingVue from './loading.vue'

const Loading = {};
// install 是Vue官方提供的开发插件的key值
Loading.install = (Vue) => { 
  const vue = Vue;
  // 创建构造器
  const loadingClass = vue.extend(LoadingVue);
  // 实例化类
  const instance = new loadingClass();
  instance.$mount(document.createElement('div'));
  document.body.appendChild(instance.$el);
  const loadingConnect = {
    showLoading(){
      instance.showMask = true;
    },
    hiddenLoading(){
      instance.showMask = false;
    },
  }
  vue.prototype.$loading = loadingConnect;
}

export default Loading;
