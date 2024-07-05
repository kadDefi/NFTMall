<template>
  <div class="home">
    <div class="h_contian">
      <div class="h_c_top">
        <div class="h_c_n_title">{{ $t("message.home.aladdinNFT") }}</div>
       <!-- <div class="h_c_n_content">
          <img src="../../../assets/newPhones/nHome/icon_tool.svg" alt="">
          <span>{{ $t("message.home.aladdinGenesisNFT") }}</span>
        </div>-->
        <div class="h_c_n_nft">
          <div class="h_c_t_banner">
            <div class="swiper-container" id="swiper-container1">
              <div class="swiper-wrapper">
                <div v-for="(item, index) in dataList" :key="index" class="swiper-slide">
                  <img :src="require(`../../../assets/banners/banner_${isEnglish ? 'y' : 'z'}_${index}.png`)" alt="logo">
                 <!-- <div>{{ item.name }}</div>
                  <div>Genesis NFT</div>-->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="h_c_hot">
        <div class="h_c_n_content">
          <img src="../../../assets/newPhones/nHome/icon_hot.svg" alt="">
          <span>{{ $t("message.home.hotStore") }}</span>
        </div>
        <div class="h_c_n_hot">
          <div class="h_c_t_banner">
            <div class="swiper-container" id="swiper-container2">
              <div class="swiper-wrapper">
                <div v-for="(item, index) in hotList" :key="index" class="swiper-slide">
                  <img class="nft_img" :src="isStringEmpty(item.coverPic)?require('../../../assets/newPhones/nCreator/icon_c_bg1.png'):item.coverPic" alt="logo">
                  <van-image class="header_img" fit="cover" :src="isStringEmpty(item.picurl)?require('../../../assets/newPhones/nMarket/icon_header_logo.png'):item.picurl" alt="logo" round></van-image>
                  <div>{{ item.name }}</div>
                  <div>#{{ item.number }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="h_c_market">
        <div class="h_c_m_title">{{ $t("message.home.desc3") }}</div>
        <div class="h_c_m_subTitle">{{ $t("message.home.Community") }}</div>
        <div class="h_c_m_content">
          <div>{{ $t("message.home.desc4") }}</div>
        </div>
        <div class="h_c_m_sj">
          <img src="../../../assets/newPhones/nHome/icon_sj1.png" alt="" @click="handleClickContact(1)">
          <img src="../../../assets/newPhones/nHome/icon_sj2.png" alt="" @click="handleClickContact(2)">
          <img src="../../../assets/newPhones/nHome/icon_sj3.png" alt="" @click="handleClickContact(3)">
        </div>
      </div>
      <div class="h_c_dealers">
        <div class="h_c_m_title">{{ $t("message.home.meet") }}</div>
        <div class="h_c_m_subTitle">{{ $t("message.home.meetDesc") }}</div>
        <div class="h_c_m_content"><img src="../../../assets/newPhones/nHome/icon_h_dealers.png" alt=""></div>
      </div>
      <div class="h_c_aboutUs">
        <div class="h_c_a_title">{{ $t("message.mallFooter.company") }}</div>
        <div class="h_c_a_flex">
          <div class="h_c_a_f_item" @click="handleCompay(1)">ALAD</div>
          <div class="h_c_a_f_item" @click="handleCompay(2)">Rainbow Nasie</div>
          <div class="h_c_a_f_item" @click="handleCompay(3)">Guard the Planet</div>
          <div class="h_c_a_f_item" @click="handleCompay(4)">ORA</div>
        </div>
      </div>
      <div class="h_c_logo"><img src="../../../assets/newPhones/nHome/icon_h_alad_logo.svg" alt=""></div>
      <!-- <div class="h_c_market">
         <div class="h_c_m_title">{{ $t("message.home.title") }}</div>
         <div class="h_c_m_market" @click="handleClickMarket">{{ $t("message.home.discoverTitle") }}</div>
       </div>
       <div class="h_c_treasures">
         <div class="h_c_t_title">{{ $t("message.home.desc1") }}</div>
         <div class="h_c_t_market" @click="handleClickTreasures">{{ $t("message.home.desc2") }}</div>
         <div class="h_c_t_treasures">
           <div class="h_c_t_banner">
             <div class="swiper-container">
               <div class="swiper-wrapper">
                 <div v-for="(item, index) in dataList" :key="index" class="swiper-slide">
                   <img :src="item.pic" alt="logo">
                   <div>{{ item.name }}</div>
                   <div>Genesis NFT</div>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>
       <div class="h_c_adventure">
         <img alt="logo" class="h_c_a_image" src="../../../assets/homes/h5_icon_adventure.png">
         <div class="h_c_a_right">
           <div class="h_c_a_title">{{ $t("message.home.desc3") }}</div>
           <div class="h_c_a_desc">{{ $t("message.home.desc4") }}</div>
           <div class="h_c_a_contact">
             <div @click="handleClickContact(1)" @mouseover="handleMouseOver(1)">
               <div v-if="adventureOne" class="h_c_a_c_item">
                 <span>{{ $t("message.home.talegram1") }}</span>
                 <img alt="logo" src="../../../assets/homes/icon_select_talegram.svg">
               </div>
               <img v-else alt="logo" src="../../../assets/homes/icon_talegram.svg">
             </div>
             <div @click="handleClickContact(2)" @mouseover="handleMouseOver(2)">
               <div v-if="adventureTwo" class="h_c_a_c_item">
                 <span>{{ $t("message.home.medium1") }}</span>
                 <img alt="logo" src="../../../assets/homes/icon_select_medium.svg">
               </div>
               <img v-else alt="logo" src="../../../assets/homes/icon_medium.svg">
             </div>
             <div @click="handleClickContact(3)" @mouseover="handleMouseOver(3)">
               <div v-if="adventureThree" class="h_c_a_c_item">
                 <span>{{ $t("message.home.twitter1") }}</span>
                 <img alt="logo" src="../../../assets/homes/icon_select_twitter.svg">
               </div>
               <img v-else alt="logo" src="../../../assets/homes/icon_twitter.svg">
             </div>
           </div>
         </div>
       </div>
       <div class="h_c_meet">
         <div class="h_c_m_title">{{ $t("message.home.meet") }}</div>
         <div class="h_c_m_desc">{{ $t("message.home.meetDesc") }}</div>
         <div class="h_c_m_content">
           <div ref="wrapper" class="h_c_m_body">
             <div class="h_c_m_b_content">
               <div v-for="(item,index) in 16" :key="index" class="h_c_m_b_item">
                 <div><img :src="require(`../../../assets/meets/icon_${index + 1}.svg`)" alt="logo"></div>
                 <div><img :src="require(`../../../assets/meets/icon_${index + 1}_${index + 1}.svg`)" alt="logo"></div>
               </div>
             </div>
           </div>
         </div>
       </div>
       <div class="h_c_help">
         <div class="h_c_h_title">HELP</div>
         <div class="h_c_h_flex">
           <div class="h_c_h_f_item" @click="handleHelp(1)">{{ $t("message.mallFooter.emailUs") }}</div>
           <div class="h_c_h_f_item" @click="handleHelp(2)">{{ $t("message.mallFooter.fileDownload") }}</div>
           <div class="h_c_h_f_item" @click="handleHelp(3)">{{ $t("message.mallFooter.guide") }}</div>
         </div>
       </div>-->
    </div>
  </div>
</template>

<script>

import {isStringEmpty} from '@/utils/validate'
import 'swiper/css/swiper.css';
import Swiper from 'swiper';
import {mapGetters} from 'vuex';
import {getGenesisNFT, getHotShop} from '@/api/mark'
import BScroll from 'better-scroll';
import zoonFooter from '@/components/zoonFooter/zoonFooter.vue';

const settingConfig = require('../../../settings.js');

export default {
  components: {
    zoonFooter,
    BScroll,
  },
  name: "nHome",
  data() {
    return {
      isEnglish: false,
      adventureOne: true,
      adventureTwo: false,
      adventureThree: false,
      isShowDownload: false,
      bannerIndex: 0,
      bScroll: '',
      mySwiper: '',
      dataList: ['','','',''],
      hotList: [],
    };
  },
  created() {
    this.isEnglish = window.localStorage.getItem("lang") !== "zh";
    //this.getGenesisNFT();
    this.getHotShop();
  },
  mounted() {
    //this.initBScroll();
    this.initSlideSwiper1();
    this.initSlideSwiper2();
  },
  destroyed() {

  },
  // 计算属性
  computed: {
    ...mapGetters(['isConnectWallet', 'walletAddress']),
  },
  // 监听属性改变
  watch: {
    // 监听语言的切换
    '$i18n.locale'(val, oval) {
      if (val === 'zh') {
        this.isEnglish = false;
      } else {
        this.isEnglish = true;
      }
      console.log('监听语言发生变化');
    },
  },
  // 方法
  methods: {
    isStringEmpty,
    // 获取用户在持NFT数据
    async getGenesisNFT() {
      const that = this;
      const result = await getGenesisNFT();
      if (result.status === 200) {
        result.data.forEach(element => {
          const newStr = element.pic.indexOf("https");
          if (newStr === -1) {
            element.pic = `${settingConfig.ipfsNFTUrl + element.pic}`
          }
        });
        that.dataList = result.data;
      } else {
        that.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
      }
      console.log('获取创世NFT列表', result);
    },
    async getHotShop() {
      const that = this;
      let result = await getHotShop();
      console.log('getHotShop =', result)
      if (result.status === 200) {
        result.data.forEach(element => {
          if (isStringEmpty(element.coverPic)) {
            element.coverPic = '';
          } else {
            const newStr = element.coverPic.indexOf("https");
            if (newStr === -1) {
              element.coverPic = `${settingConfig.ipfsNFTUrl + element.coverPic}`
            }
          }
          if (isStringEmpty(element.picurl)) {
            element.picurl = '';
          } else {
            const newStr = element.picurl.indexOf("https");
            if (newStr === -1) {
              element.picurl = `${settingConfig.ipfsNFTUrl + element.picurl}`
            }
          }
        });
        that.hotList = result.data;
      } else {
        that.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
      }

    },
    initBScroll() {
      this.bScroll = new BScroll(this.$refs.wrapper, {
        scrollX: true,
        bounce: false,
        probeType: 3
      });
    },
    initSlideSwiper1() {
      this.mySwiper = new Swiper('#swiper-container1', {
        direction: 'horizontal', //滑动方向，可设置水平(horizontal)或垂直(vertical)。
        loop: false, // 设置为true 则开启loop模式
        speed: 1000, // 切换速度
        autoplay: {
          delay:3000,
          stopOnLastSlide:false,
          disableOnInteraction:false,
        }, // 自动切换时间
        initialSlide: 0,//默认第二个
        observer: true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents: true,//修改swiper的父元素时，自动初始化swiper
        slidesPerView: 'auto', // 设置slider容器能够同时显示的slides数量(carousel模式)。类型：number or auto
        centeredSlides: false, // 设定为true时，active slide会居中，而不是默认状态下的居左。
        spaceBetween: 0, // 在slide之间设置距离（单位px）。
        loopAdditionaSlider: 0, // loop模式下会在slides前后复制若干个slide,，前后复制的个数不会大于原总个数。
      });
    },
    initSlideSwiper2() {
      this.mySwiper = new Swiper('#swiper-container2', {
        direction: 'horizontal', //滑动方向，可设置水平(horizontal)或垂直(vertical)。
        loop: false, // 设置为true 则开启loop模式
        autoplay: false, // 自动切换时间
        speed: 500, // 切换速度
        initialSlide: 0,//默认第二个
        observer: true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents: true,//修改swiper的父元素时，自动初始化swiper
        slidesPerView: 'auto', // 设置slider容器能够同时显示的slides数量(carousel模式)。类型：number or auto
        centeredSlides: false, // 设定为true时，active slide会居中，而不是默认状态下的居左。
        spaceBetween: 20, // 在slide之间设置距离（单位px）。
        loopAdditionaSlider: 0, // loop模式下会在slides前后复制若干个slide,，前后复制的个数不会大于原总个数。
      });
    },
    handleClickContact(index) {
      let openUrl = settingConfig.telegramUrl;
      if (index === 2) {
        openUrl = settingConfig.mediumUrl;
      } else if (index === 3) {
        openUrl = settingConfig.twitterUrl;
      }
      window.open(openUrl);
      console.log('获取联系方式index = ', index);
    },
    handleCompay(index) {
      let openUrl = settingConfig.aladUrl;
      if (index === 2) {
        openUrl = settingConfig.rainbowNasieUrl;
      } else if (index === 3) {
        this.$notify({ message: this.$t("message.alertMsg.stayTuned"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      } else if (index === 4) {
        openUrl = settingConfig.oraUrl;
      }
      window.open(openUrl);
      console.log('company index =', index);
    },
    handleHelp(index) {
      if (index === 1) {
        let copyText = 'aladdinmeta@gmail.com';
        // navigator clipboard 需要https等安全上下文
        if (navigator.clipboard && window.isSecureContext) {
          // navigator clipboard 向剪贴板写文本
          navigator.clipboard.writeText(copyText);
          this.$notify({ message: this.$t("message.alertMsg.copySuccess"), duration: 3000, showClose: false, customClass: 'notifyClass' });
        } else {
          // 创建text area
          let textArea = document.createElement("textarea");
          textArea.value = copyText;
          textArea.style.position = "absolute";
          textArea.style.opacity = 0;
          textArea.style.left = "-999999px";
          textArea.style.top = "-999999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          this.$notify({ message: this.$t("message.alertMsg.copySuccess"), duration: 3000, showClose: false, customClass: 'notifyClass' });
          document.body.removeChild(textArea);
        }
      } else if (index === 2) {
        this.isShowDownload = true;
      } else if (index === 3) {
        const openUrl = settingConfig.guideUrl;
        window.open(openUrl);
      }
      console.log('help index =', index);
    },
    handleClickDownLoadFile(index) {
      let list = ['Aladdin_Global_CN.pdf', 'Aladdin_Magic_CN.pdf'];
      let listName = ["Aladdin Marketing Version_CN.pdf", "Global Supply and Demand Circular Economy Agreement_CN.pdf"];
      if (this.isEnglish) {
        list = ['Aladdin_Global_EN.pdf', 'Aladdin_Magic_EN.pdf'];
        listName = ["Aladdin Marketing Version_EN.pdf", "Global Supply and Demand Circular Economy Agreement_EN.pdf"];
      }
      if (index === 0) {
        let a = document.createElement('a');
        a.href = './static/' + list[index];
        a.download = listName[index];
        a.click();

      } else if (index === 1) {
        let a = document.createElement('a');
        a.href = './static/' + list[index];
        a.download = listName[index];
        a.click();
      }
    },
  },
};
</script>

<style lang="scss" scoped>

.home {
  padding-top: 0.1px;
  box-sizing: border-box;
  padding-bottom: vw(100);
  background-color: #202136;
  .h_contian {
    padding-top: 0.1px;
    .h_c_top {
      height: vw(528);
      padding-top: 0.1px;
      box-sizing: border-box;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-image: url('../../../assets/newPhones/nHome/icon_top_bg.svg');
      .h_c_n_title {
        margin-top: vw(160);
        padding-left: vw(30);
        line-height: vw(79);
        font-size: vw(60);
        text-align: left;
        word-break: normal;
        font-family: MicrosoftYaqiHei, sans-serif;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        user-select: none;
        color: var(--white);
      }
      .h_c_n_content {
        display: flex;
        align-items: center;
        margin-top: vw(56);
        padding-left: vw(30);
        img {
          width: vw(48);
          height: vw(48);
        }
        span {
          margin-left: vw(12);
          line-height: vw(45);
          font-size: vw(32);
          font-weight: 600;
          font-stretch: normal;
          font-style: normal;
          letter-spacing: normal;
          text-align: left;
          font-family: PingFangSC, sans-serif;
          color: #fff;
        }
      }
      .h_c_n_nft {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: vw(80) auto 0;
        height: vw(345);
        .h_c_t_banner {
          margin: 0 auto;
          width: vw(690);
          height: 100%;
          .swiper-container {
            //padding-left: vw(30);
            width: 100%;
            height: 100%;
            overflow: hidden;
            .swiper-slide {
              width: 100% !important;
              box-sizing: border-box;
              display: flex;
              display: -webkit-box;
              display: -ms-flexbox;
              display: -webkit-flex;
              flex-direction: column;
              -webkit-box-pack: center;
              -ms-flex-pack: center;
              -webkit-justify-content: center;
              justify-content: flex-start;
              -webkit-box-align: start;
              -ms-flex-align: start;
              -webkit-align-items: flex-start;
              align-items: center;
              background-size: cover;
              background-repeat: no-repeat;
              background-position: center center;
              transition: all .2s ease;
              img {
                width: 100%;
                height: 100%;
                border-radius: vw(8);
              }
            }
          }
        }
      }
    }
    .h_c_hot {
      margin-top: vw(280);
      .h_c_n_content {
        display: flex;
        align-items: center;
        margin-top: vw(56);
        padding-left: vw(30);
        img {
          width: vw(48);
          height: vw(48);
        }
        span {
          margin-left: vw(12);
          line-height: vw(45);
          font-size: vw(32);
          font-weight: 600;
          font-stretch: normal;
          font-style: normal;
          letter-spacing: normal;
          text-align: left;
          font-family: PingFangSC, sans-serif;
          color: #fff;
        }
      }
      .h_c_n_hot {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: vw(40) auto 0;
        height: vw(480);
        .h_c_t_banner {
          width: 100vw;
          height: 100%;
          .swiper-container {
            padding-left: vw(30);
            height: 100%;
            overflow: hidden;
            .swiper-slide {
              overflow: hidden;
              width: vw(474) !important;
              border-radius: vw(20);
              box-sizing: border-box;
              display: flex;
              display: -webkit-box;
              display: -ms-flexbox;
              display: -webkit-flex;
              flex-direction: column;
              -webkit-box-pack: center;
              -ms-flex-pack: center;
              -webkit-justify-content: center;
              justify-content: flex-start;
              -webkit-box-align: start;
              -ms-flex-align: start;
              -webkit-align-items: flex-start;
              align-items: center;
              background-size: cover;
              background-repeat: no-repeat;
              background-position: center center;
              transition: all .2s ease;
              background-color: #2a2c46;
              .nft_img {
                width: vw(474);
                height: vw(316);
                object-fit: cover;
              }
              .header_img {
                position: absolute;
                top: vw(200);
                left: calc(50% - 55 / 750 * 100vw);
                width: vw(110);
                height: vw(110);
                border: vw(5) solid white;
              }
              div {
                //align-self: flex-start;
                margin-top: vw(45);
                font-size: vw(32);
                line-height: vw(45);
                font-family: Ubuntu, sans-serif;
                font-weight: 500;
                font-stretch: normal;
                font-style: normal;
                color: var(--white);
                &:last-child {
                  margin-top: vw(10);
                  font-size: vw(26);
                  line-height: vw(37);
                  color: #72729b;
                }
              }
            }
          }
        }
      }
    }
    .h_c_market {
      margin: vw(92) auto 0;
      padding: 0 vw(30);
      .h_c_m_title {
        line-height: vw(45);
        font-size: vw(32);
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: normal;
        text-align: left;
        font-family: PingFangSC, sans-serif;
        color: #fff;
      }
      .h_c_m_subTitle {
        margin-top: vw(10);
        line-height: vw(33);
        font-size: vw(24);
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: normal;
        text-align: left;
        font-family: PingFangSC, sans-serif;
        color: #72729b;
      }
      .h_c_m_content {
        padding-top: 0.1px;
        margin-top: vw(30);
        width: vw(690);
        height: vw(446);
        box-sizing: border-box;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-image: url('../../../assets/newPhones/nHome/icon_h_sq.png');
        div {
          margin-top: vw(274);
          padding: 0 vw(9);
          line-height: vw(41);
          font-size: vw(24);
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          letter-spacing: normal;
          text-align: left;
          font-family: PingFangSC, sans-serif;
          color: #b3b3ba;
        }
      }
      .h_c_m_sj {
        display: flex;
        align-items: center;
        margin-top: vw(20);
        img {
          margin-left: vw(30);
          width: vw(60);
          height: vw(60);
          cursor: pointer;
          user-select: none;
          &:first-child {
            margin-left: vw(0);
          }
        }
      }
    }
    .h_c_dealers {
      margin: vw(92) auto 0;
      padding: 0 vw(30);
      .h_c_m_title {
        line-height: vw(45);
        font-size: vw(32);
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: normal;
        text-align: left;
        font-family: PingFangSC, sans-serif;
        color: #fff;
      }
      .h_c_m_subTitle {
        margin-top: vw(10);
        width: vw(528);
        line-height: vw(33);
        font-size: vw(24);
        word-break: normal;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: normal;
        text-align: left;
        font-family: PingFangSC, sans-serif;
        color: #72729b;
      }
      .h_c_m_content {
        margin: vw(30) auto 0;
        width: vw(690);
        height: vw(423);
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .h_c_aboutUs {
      margin: vw(50) auto 0;
      padding: 0 vw(30);
      .h_c_a_title {
        font-size: vw(32);
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: left;
        font-family: Montserrat, sans-serif;
        color: var(--white);
      }
      .h_c_a_flex {
        margin-top: vw(30);
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .h_c_a_f_item {
          width: vw(335);
          height: vw(100);
          line-height: vw(100);
          font-size: vw(28);
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          font-family: Ubuntu, sans-serif;
          letter-spacing: normal;
          text-align: center;
          color: var(--white);
          border-radius: vw(10);
          background-color: #27273f;
        }
        :nth-child(3) {
          margin-top: vw(20);
        }
        :nth-child(4) {
          margin-top: vw(20);
        }
      }
    }
    .h_c_logo {
      margin: vw(70) auto 0;
      width: vw(266);
      height: vw(100);
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}

</style>
