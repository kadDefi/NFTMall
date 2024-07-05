<template>
  <div class="home">
    <div class="h_contian">
      <div class="h_c_market">
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
        <!--<img alt="logo" class="h_c_a_image" src="../../../assets/homes/h5_icon_adventure.png">-->
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
               <!-- <div><img :src="require(`../../../assets/meets/icon_${index + 1}.svg`)" alt="logo"></div>
                <div><img :src="require(`../../../assets/meets/icon_${index + 1}_${index + 1}.svg`)" alt="logo"></div>-->
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="h_c_aboutUs">
        <div class="h_c_a_title">{{ $t("message.mallFooter.company") }}</div>
        <div class="h_c_a_flex">
          <div class="h_c_a_f_item" @click="handleCompay(1)">ALAD</div>
          <div class="h_c_a_f_item" @click="handleCompay(2)">Rainbow Nasie</div>
          <div class="h_c_a_f_item" @click="handleCompay(3)">Guard the Planet</div>
          <div class="h_c_a_f_item" @click="handleCompay(4)">GAKA</div>
        </div>
      </div>
      <div class="h_c_help">
        <div class="h_c_h_title">HELP</div>
        <div class="h_c_h_flex">
          <div class="h_c_h_f_item" @click="handleHelp(1)">{{ $t("message.mallFooter.emailUs") }}</div>
          <div class="h_c_h_f_item" @click="handleHelp(2)">{{ $t("message.mallFooter.fileDownload") }}</div>
          <div class="h_c_h_f_item" @click="handleHelp(3)">{{ $t("message.mallFooter.guide") }}</div>
        </div>
      </div>
    </div>
    <!-- 下载文件 -->
    <div class="mask" v-show="isShowDownload" @touchmove.prevent @mousewheel.prevent>
      <div class="m_download">
        <div class="m_c_title">{{ $t("message.mallFooter.fileDownload") }}</div>
        <div class="m_c_item" @click="handleClickDownLoadFile(0)">Aladdin Marketing Version</div>
        <div class="m_c_item m_c_item1" @click="handleClickDownLoadFile(1)">Global Supply and Demand Circular Economy Agreement</div>
        <img class="mask_close" src="../../../assets/universal/icon_qb_close.svg" alt="logo" @click="isShowDownload = !isShowDownload">
      </div>
    </div>
  </div>
</template>

<script>
const settingConfig = require('../../../settings.js');
import 'swiper/css/swiper.css';
import Swiper from 'swiper';
import {mapGetters} from 'vuex';
import {getGenesisNFT} from '@/api/mark'
import BScroll from 'better-scroll';
import zoonFooter from '@/components/zoonFooter/zoonFooter.vue';

export default {
  components: {
    zoonFooter,
    BScroll,
  },
  name: "home",
  data() {
    return {
      isEnglish:false,
      adventureOne: true,
      adventureTwo: false,
      adventureThree: false,
      isShowDownload:false,
      bannerIndex: 0,
      bScroll: '',
      mySwiper: '',
      dataList: [],
    };
  },
  created() {
    this.isEnglish = window.localStorage.getItem("lang") !== "zh";
    this.getGenesisNFT();
  },
  mounted() {
    this.initBScroll();
    this.initSlideSwiper();
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
    '$i18n.locale'(val,oval) {
      if(val === 'zh') {
        this.isEnglish = false;
      } else {
        this.isEnglish = true;
      }
      console.log('监听语言发生变化');
    },
  },
  // 方法
  methods: {
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
    initBScroll() {
      this.bScroll = new BScroll(this.$refs.wrapper, {
        scrollX: true,
        bounce: false,
        probeType: 3
      });
    },
    initSlideSwiper() {
      let that = this;
      this.mySwiper = new Swiper('.swiper-container', {
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
    handleMouseOver(index) {
      if (index === 1) {
        this.adventureOne = true;
        this.adventureTwo = false;
        this.adventureThree = false;
      } else if (index === 2) {
        this.adventureOne = false;
        this.adventureTwo = true;
        this.adventureThree = false;
      } else if (index === 3) {
        this.adventureOne = false;
        this.adventureTwo = false;
        this.adventureThree = true;
      }
      console.log('鼠标移入index =', index);
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
    handleClickMarket() {
      this.$router.push('/marketMb')
      // this.$eventBus.$emit("checkNFTDetailJump");
    },
    handleClickTreasures() {
      this.$router.push('/castingMb')
      // this.$eventBus.$emit("checkNFTDetailJump");
    },
    handleCompay(index) {
      let openUrl = settingConfig.aladUrl;
      if (index === 2) {
        openUrl = settingConfig.rainbowNasieUrl;
      } else if (index === 3 || index === 4) {
        this.$notify({ message: this.$t("message.alertMsg.stayTuned"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
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
  width: 100vw;
  box-sizing: border-box;
  background-position: top;
  background-attachment: fixed;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  //background-image: url('../../../assets/homes/icon_home_bg.jpg');
  padding-bottom: vw(100);
  .h_contian {
    padding-top: 0.1px;
    .h_c_market {
      height: vw(640);
      padding-top: 0.1px;
      box-sizing: border-box;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      //background-image: url('../../../assets/homes/h5_icon_top_bg.svg');
      .h_c_m_title {
        width: vw(600);
        margin: vw(17) auto 0px;
        line-height: vw(56);
        font-size: vw(40);
        word-break: normal;
        font-family: Montserrat;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        user-select: none;
        color: var(--white);
      }
      .h_c_m_market {
        width: vw(364);
        height: vw(60);
        margin: vw(32) auto 0px;
        font-size: vw(28);
        line-height: vw(60);
        font-family: Poppins;
        font-weight: bold;
        font-style: normal;
        user-select: none;
        cursor: pointer;
        box-sizing: border-box;
        object-fit: contain;
        border-radius: 10px;
        background-image: linear-gradient(to bottom, #6929af, #3b2999);
        color: var(--white);
      }
    }
    .h_c_treasures {
      .h_c_t_title {
        margin: vw(80) auto 0px;
        font-size: vw(40);
        word-break: normal;
        font-family: Montserrat;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        white-space: pre-wrap;
        text-align: center;
        user-select: none;
        color: var(--white);
      }
      .h_c_t_market {
        width: vw(364);
        height: vw(60);
        margin: vw(41) auto 0px;
        font-size: vw(28);
        line-height: vw(60);
        font-family: "PingFang SC",sans-serif;;
        font-weight: bold;
        font-style: normal;
        user-select: none;
        cursor: pointer;
        box-sizing: border-box;
        object-fit: contain;
        border-radius: 10px;
        background-image: linear-gradient(to bottom, #6929af, #3b2999);
        color: var(--white);
      }
      .h_c_t_treasures {
        width: 100vw;
        height: vw(384);
        margin: vw(82) auto 0px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .h_c_t_banner {
          width: 100vw;
          height: 100%;
          .swiper-container {
            width: 100%;
            height: 100%;
            overflow: hidden;
            .swiper-slide {
              width: vw(310) !important;
              border: vw(1) solid #707070;
              border-radius: vw(20);
              box-shadow: 0 vw(2) vw(30) 0 var(--bgc25);
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
              background-color: var(--bgc24);
              img {
                margin-top: vw(30);
                width: vw(254);
                height: vw(254);
              }
              div {
                align-self: flex-start;
                margin-top: vw(10);
                margin-left: vw(28);
                font-size: vw(28);
                line-height: vw(31);
                font-family: "PingFang SC",sans-serif;;
                font-weight: normal;
                font-stretch: normal;
                font-style: normal;
                color: var(--white);
                &:last-child {
                  margin-top: vw(6);
                  font-size: vw(28);
                  line-height: vw(31);
                  color: var(--bgc26);
                }
              }
            }
          }
        }
      }
    }
    .h_c_adventure {
      width: 100vw;
      margin: vw(80) auto 0px;
      height: vw(554);
      position: relative;
      .h_c_a_image {
        width: vw(484);
        height: vw(554);
        position: absolute;
        top: 0;
        left: vw(70);
        z-index: 0;
      }
      .h_c_a_right {
        position: absolute;
        top: 0;
        left: vw(140);
        z-index: 1;
        .h_c_a_title {
          margin-top: vw(75);
          line-height: vw(49);
          font-size: vw(40);
          text-align: left;
          word-break: normal;
          font-family: "PingFang SC",sans-serif;
          font-weight: bold;
          font-stretch: normal;
          font-style: normal;
          user-select: none;
          color: var(--white);
        }
        .h_c_a_desc {
          width: vw(564);
          margin-top: vw(30);
          line-height: vw(40);
          font-size: vw(26);
          text-align: left;
          opacity: 0.8;
          word-break: break-word;
          font-family: "PingFang SC",sans-serif;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          user-select: none;
          color: var(--white);
        }
        .h_c_a_contact {
          margin-top: vw(16);
          display: flex;
          align-items: center;
          .h_c_a_c_item {
            width: vw(210);
            height: vw(48);
            margin-right: vw(30);
            cursor: pointer;
            user-select: none;
            box-sizing: border-box;
            background-size: contain;
            background-repeat: no-repeat;
            background-image: url('../../../assets/homes/icon_adventure_bg.svg');
            display: flex;
            justify-content: center;
            align-items: center;
            span {
              line-height: vw(48);
              font-size: vw(16);
              font-family: Poppins;
              font-weight: bold;
              font-stretch: normal;
              font-style: normal;
              user-select: none;
              color: var(--white);
            }
            img {
              width: vw(32);
              height: vw(28);
              margin-left: vw(10);
              margin-right: 0px;
            }
          }
          img {
            margin-right: vw(30);
            width: vw(48);
            height: vw(48);
          }
        }
      }
    }
    .h_c_meet {
      margin: vw(40) auto 0px;
      position: relative;
      .h_c_m_title {
        margin: 0px auto;
        line-height: vw(66);
        font-size: vw(40);
        text-align: center;
        word-break: normal;
        font-family: Montserrat-Bold;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        user-select: none;
        color: var(--white);
      }
      .h_c_m_desc {
        width: vw(574);
        margin: vw(20) auto 0px;
        opacity: 0.8;
        font-family: Ubuntu;
        font-size: vw(30);
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        word-break: break-word;
        line-height: 1.13;
        letter-spacing: normal;
        text-align: center;
        color: var(--white);
      }
      .h_c_m_content {
        height: auto;
        width: 100vw;
        margin-top: vw(33);
        .h_c_m_body {
          width: 100%;
          white-space: nowrap;
          .h_c_m_b_content {
            height: 100%;
            //display: inline-block;
            display: inline-flex;
            .h_c_m_b_item {
              display: inline-block;
              width: vw(140);
              margin-right: vw(20);
              div {
                img {
                  width: vw(140);
                  height: vw(140);
                }
                &:last-child {
                  margin-top: vw(20);
                }
              }
              &:nth-of-type(even) {
                margin-top: vw(35);
              }
            }
          }
        }
      }
    }
    .h_c_aboutUs {
      margin: vw(40) auto 0px;
      .h_c_a_title {
        font-family: Montserrat;
        font-size: vw(36);
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: center;
        color: var(--white);
      }
      .h_c_a_flex {
        margin-top: vw(50);
        padding: 0 vw(80);
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        .h_c_a_f_item {
          width: vw(240);
          height: vw(64);
          background-size: contain;
          background-repeat: no-repeat;
          //background-image: url("../../../assets/homes/bg_home_aboutus_item.svg");
          font-family: Ubuntu;
          font-size: vw(28);
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: vw(64);
          letter-spacing: normal;
          text-align: center;
          color: var(--white);
        }
        :nth-child(3) {
          margin-top: vw(40);
        }
        :nth-child(4) {
          margin-top: vw(40);
        }
      }
    }
    .h_c_help {
      margin: vw(70) auto vw(80);
      .h_c_h_title {
        font-family: Montserrat;
        font-size: vw(36);
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: center;
        color: var(--white);
      }
      .h_c_h_flex {
        margin-top: vw(50);
        padding: 0 vw(80);
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        .h_c_h_f_item {
          width: vw(240);
          height: vw(64);
          background-size: contain;
          background-repeat: no-repeat;
          //background-image: url("../../../assets/homes/bg_home_help_item.svg");
          font-family: Ubuntu;
          font-size: vw(28);
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: vw(64);
          letter-spacing: normal;
          text-align: center;
          color: var(--white);
        }
        :nth-child(3) {
          margin-top: vw(40);
          justify-self: center;
        }
      }
    }
  }
  .mask {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    transition: all 0.3s;
    background-color: var(--bgc02);
    .m_download {
      position:relative;
      width: vw(690);
      height: vw(440);
      border-radius: vw(20);
      background-color: var(--bgc03);
      .m_c_title {
        margin: vw(30) auto 0;
        line-height: vw(50);
        font-size: vw(30);
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        color: #fff;
        font-family: Poppins,sans-serif;
      }
      .m_c_item {
        margin: vw(50) auto 0;
        width: vw(570);
        height: vw(100);
        font-size: vw(28);
        line-height: vw(100);
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        font-family: Poppins;
        text-align: center;
        user-select: none;
        cursor: pointer;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        //background-image: url('../../../assets/homes/icon_down_bg.svg');
        color: #fff;
      }
      .m_c_item1 {
        line-height: vw(45);
      }
      .mask_close {
        width: vw(40);
        height: vw(40);
        top: vw(20);
        right: vw(15);
        position: absolute;
        cursor: pointer;
      }
    }
  }
}

//.swiper-container .swiper-slide:not(.swiper-slide-active) {
//  transform: scale(.85);
//}
//

//.swiper-container .swiper-slide.swiper-slide-prev {
//  border-radius: 0px;
//  transform-origin: left center;
//}
//
//.swiper-container .swiper-slide.swiper-slide-next {
//  transform-origin: right center;
//}


</style>
