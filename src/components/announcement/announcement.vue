<template>
  <div v-show="isShowAnnouncment" class="announcement">
    <div class="a_contnet">
      <div></div>
      <div class="a_c_text">{{ announmentData.content }}</div>
      <img src="../../assets/homes/icon_m_close.svg" alt="logo" @click="handleClickCloseAnnounment">
    </div>
  </div>
</template>

<script>

import { mapState,mapGetters } from 'vuex';
import { isStringEmpty } from '../../utils/validate.js';
import { chuDivision } from '../../utils/computing.js';
import { getAnnounmentListData } from '../../api/mark'

export default {
  data() {
    return {
      isEnglish:false,
      isShowAnnouncment:false,
      announmentData:'',
    }
  },
  // watch/event事件回调
  created() {
    this.isEnglish = window.localStorage.getItem("lang") !== "zh";
    this.getAnnounmentData();
  },
  mounted(){
    let routeName = this.$route.name;
    if (routeName == 'home') {
      this.isShowAnnouncment = true;
      this.getAnnounmentData();
    }else {
      this.isShowAnnouncment = false;
    }
  },
  destroyed() {

  },
  computed: {

	},
  // 监听方法
  watch: {
    // 监听路由变化
    $route(to,from) {
      let routeName = to.name;
      if (routeName == 'home') {
        this.isShowAnnouncment = true;
      }else {
        this.isShowAnnouncment = false;
      }
      console.log('router change name =',routeName);
    },
     // 监听语言的切换
    '$i18n.locale'(val,oval) {
      if(val === 'zh') {
         this.isEnglish = false;
       } else {
         this.isEnglish = true;
       }
       this.getAnnounmentData();
      console.log('监听语言发生变化');
    },
  },
  // 方法集合
  methods: {
    handleClickCloseAnnounment() {
      this.isShowAnnouncment = false;
    },
     // 获取公告
    async getAnnounmentData() {
      const dict = {};
      dict['language'] = this.isEnglish ? 'en' : 'ch';
      const result = await getAnnounmentListData(dict);
      console.log('annoument result =',result);
      if (result.status == 200) {
        if (!isStringEmpty(result.data)){
          this.announmentData = result.data;
          console.log('公告列表数据=',result.data);
        }
      }else {
        this.$notify({message: result.data,duration: 2500,showClose:false,customClass:'notifyClass'});
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  .announcement {
    width: 100vw;
    height: 60px;
    box-sizing: border-box;
    background: linear-gradient(to right,#941ea2,#049aa5);
    .a_contnet {
      height: 100%;
      margin: 0px 100px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .a_c_text {
        line-height: 23px;
        font-size: 14px;
        font-weight: 600;
        word-break: break-all;
        text-align: center;
        font-family: Poppins;
        font-stretch: normal;
        font-style: normal;
        color: var(--white);
        user-select: none;
      }
      img {
        width: 18px;
        height: 18px;
        cursor: pointer;
      }
    }
  }

</style>
