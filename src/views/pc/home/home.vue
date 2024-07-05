<template>
  <div class="home">
    <div class="h_contian">
      <div class="h_c_market">
        <div class="h_c_wrapper">
          <div class="h_c_m_title">
            <span>{{ $t("message.home.aladdinNFT") }}  </span>
            <span>NFT</span>
          </div>
          <div :class="isEnglish ? 'h_c_m_desc1_en' :''" class="h_c_m_desc1">{{ $t("message.market.desc1") }}</div>
          <div :class="isEnglish ? 'h_c_m_desc2_en' :''" class="h_c_m_desc1 h_c_m_desc2">{{ $t("message.home.title") }}</div>
        </div>
      </div>
      <div class="h_c_treasures">
        <!--  <div class="h_c_t_wrapper">
          <div class="w_title">
            <img src="../../../assets/homes/icon_h_csnft.svg" alt="">
            <span>{{ $t("message.home.aladdinGenesis") }} </span>
            <span>NFT</span>
          </div>
        </div>-->
        <div class="h_c_t_treasures">
          <img class="h_c_t_t_icon1" src="../../../assets/homes/icon_pervous_s.svg" alt="logo" @click="handleClickNFTPervous">
          <div class="h_c_t_banner">
            <div class="swiper-container swiper-no-swiping" id="swiper-container1">
              <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(item, index) in dataList" :key="index">
                  <img :src="require(`../../../assets/banners/banner_pc_${isEnglish ? 'y' : 'z'}_${index}.png`)" alt="logo">
                 <!-- <div>{{ item.name }}</div>
                  <div>Genesis NFT</div>-->
                </div>
              </div>
            </div>
          </div>
          <img class="h_c_t_t_icon2" src="../../../assets/homes/icon_next_s.svg" alt="logo" @click="handleClickNFTNext">
        </div>
      </div>
      <div class="h_c_adventure">
        <div class="h_c_t_wrapper">
          <div class="w_title">
            <span>{{ $t("message.home.desc33") }}</span>
            <span>{{ $t("message.home.desc333") }}</span>
          </div>
          <div class="w_desc">{{ $t("message.home.Community")}}</div>
        </div>
        <div class="h_c_t_bottom">
          <img class="h_c_a_image" src="../../../assets/homes/icon_adventure.png" alt="logo">
          <div class="h_c_a_right">
            <div class="h_c_a_title">{{ $t("message.home.desc4") }}</div>
            <div class="h_c_a_desc">{{ $t("message.home.desc5") }}</div>
            <div class="h_c_a_contact">
              <div @click="handleClickContact(1)" @mouseover="handleMouseOver(1)">
                <div v-if="adventureOne" class="h_c_a_c_item">
                  <span>{{ $t("message.home.talegram1") }}</span>
                  <img src="../../../assets/homes/icon_select_talegram.svg" alt="logo">
                </div>
                <img v-else src="../../../assets/homes/icon_talegram.svg" alt="logo">
              </div>
              <div @click="handleClickContact(2)" @mouseover="handleMouseOver(2)">
                <div v-if="adventureTwo" class="h_c_a_c_item">
                  <span>{{ $t("message.home.medium1") }}</span>
                  <img src="../../../assets/homes/icon_select_medium.svg" alt="logo">
                </div>
                <img v-else src="../../../assets/homes/icon_medium.svg" alt="logo">
              </div>
              <div @click="handleClickContact(3)" @mouseover="handleMouseOver(3)">
                <div v-if="adventureThree" class="h_c_a_c_item">
                  <span>{{ $t("message.home.twitter1") }}</span>
                  <img src="../../../assets/homes/icon_select_twitter.svg" alt="logo">
                </div>
                <img v-else src="../../../assets/homes/icon_twitter.svg" alt="logo">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="h_c_hot">
        <div class="h_c_t_wrapper">
          <div class="w_title">
            <img src="../../../assets/homes/icon_h_hot.svg" alt="">
            <span>{{ $t("message.home.hotStore1") }}</span>
            <span>{{ $t("message.home.hotStore2") }}</span>
          </div>
        </div>
        <div class="h_c_t_treasures">
          <!--<img class="h_c_t_t_icon1" src="../../../assets/homes/icon_pervous_s.svg" alt="logo" @click="handleClickHotPervous">-->
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
          <!--<img class="h_c_t_t_icon2" src="../../../assets/homes/icon_next_s.svg" alt="logo" @click="handleClickHotNext">-->
        </div>
      </div>
      <div class="h_c_met">
        <div class="h_c_t_wrapper">
          <div class="w_title">
            <span>{{ $t("message.home.aladdinNFT") }}</span>
            <span>{{ $t("message.home.meet1") }}</span>
          </div>
          <div class="w_desc">{{  $t("message.home.meetDesc") }}</div>
        </div>
        <div class="w_meet"><img src="../../../assets/homes/icon_meet.png" alt=""></div>
      </div>
     <!-- <div class="h_c_meet">
        <div class="h_c_m_title">{{ $t("message.home.meet") }}</div>
        <div class="h_c_m_desc">{{ $t("message.home.meetDesc") }}</div>
        <div class="h_c_m_content">
          <div class="h_c_m_body" ref="wrapper">
            <div class="h_c_m_b_content">
              <div class="h_c_m_b_item" v-for="(item,index) in 16" :key="index">
                <div><img :src="require(`../../../assets/meets/icon_${index + 1}.svg`)" alt="logo"></div>
                <div><img :src="require(`../../../assets/meets/icon_${index + 1}_${index + 1}.svg`)" alt="logo"></div>
              </div>
            </div>
          </div>
        </div>
        <img class="h_c_m_icon" src="../../../assets/homes/icon_meet.svg" alt="logo">
      </div>-->
    </div>
    <zoon-footer></zoon-footer>
  </div>
</template>

<script>

const settingConfig = require('../../../settings.js');
import 'swiper/css/swiper.css';
import Swiper from 'swiper';
import { mapGetters } from 'vuex';
import { isStringEmpty } from '@/utils/validate';
import { getGenesisNFT, getHotShop } from '@/api/mark'
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
      adventureOne:true,
      adventureTwo:false,
      adventureThree:false,
      bScroll:'',
      swipeerIndex1:0,
      swipeerIndex2:0,
      mySwiper1:'',
      mySwiper2:'',
      dataList:['','','',''],
      hotList: [],
    };
  },
  created() {
    // 国际化
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
    ...mapGetters(['isConnectWallet','walletAddress']),
  },
  // 监听属性改变
  watch:{
    // 监听语言的切换
    '$i18n.locale'(val,oval) {
      this.isEnglish = val !== 'zh';
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
      }else {
        that.$notify({message: result.data,duration: 2500,showClose:false,customClass:'notifyClass'});
      }
      console.log('获取创世NFT列表',result);
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
        bounce:false,
        probeType: 3
      });
    },
    initSlideSwiper1() {
      let that = this;
      this.mySwiper1 = new Swiper('#swiper-container1', {
        direction: 'horizontal',
        loop: false,
        speed: 1000,
        autoplay: {
          delay:3000,
          stopOnLastSlide:false,
          disableOnInteraction:false,
        }, // 自动切换时间
        initialSlide :0,//默认第几个
        observer:true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents:true,//修改swiper的父元素时，自动初始化swiper
        slidesPerView: 'auto',// 设置slider容器能够同时显示的slides数量(carousel模式)。类型：number or auto
        centeredSlides: false, // 设定为true时，active slide会居中，而不是默认状态下的居左。
        spaceBetween:0, // 在slide之间设置距离（单位px）。
        loopAdditionaSlider: 0, // loop模式下会在slides前后复制若干个slide,，前后复制的个数不会大于原总个数。
        on:{
           click: ()=> {// 通过$refs获取对应的swiper对象
					   /*const index = that.mySwiper1.clickedIndex;
             that.swipeerIndex1 = index;
             console.log('that.swipeerIndex1 = ',index);*/
				   },
           slideChangeTransitionEnd: function(){
             that.swipeerIndex1 = that.mySwiper1.realIndex;
             //console.log('that.swipeerIndex1 = ',that.swipeerIndex1);
           },
         },
      });
    },
    initSlideSwiper2() {
      let that = this;
      this.mySwiper2 = new Swiper('#swiper-container2', {
        direction: 'horizontal', //滑动方向，可设置水平(horizontal)或垂直(vertical)。
        loop: false, // 设置为true 则开启loop模式
        autoplay: false, // 自动切换时间
        speed: 1000, // 切换速度
        initialSlide :0,//默认第二个
        observer:true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents:true,//修改swiper的父元素时，自动初始化swiper
        slidesPerView: 'auto',// 设置slider容器能够同时显示的slides数量(carousel模式)。类型：number or auto
        centeredSlides: false, // 设定为true时，active slide会居中，而不是默认状态下的居左。
        spaceBetween:15, // 在slide之间设置距离（单位px）。
        loopAdditionaSlider: 0, // loop模式下会在slides前后复制若干个slide,，前后复制的个数不会大于原总个数。
        on:{
          click: ()=> {// 通过$refs获取对应的swiper对象
            const index = that.mySwiper2.clickedIndex;
            that.swipeerIndex2 = index;
            console.log('that.swipeerIndex2 = ',index);
          }
        },
      });
    },
    // NFT
    handleClickNFTPervous() {
      this.mySwiper1.slidePrev();
    },
    handleClickNFTNext() {
      this.mySwiper1.slideNext();
     /* if(this.swipeerIndex1 === this.dataList.length - 1){
        return;
      }*/
     /* debugger
      const index = this.mySwiper1.activeIndex;
      console.log('index = ',index);*/
      /*this.swipeerIndex1++;
      console.log('this.swipeerIndex1 = ',this.swipeerIndex1);
      this.mySwiper1.slideTo(this.swipeerIndex1,1000,true);
      console.log('click next');*/
    },
    // HOT
    handleClickHotPervous() {
      if(this.swipeerIndex2 === 0){
        return;
      }
      this.swipeerIndex2--;
      this.mySwiper2.slideTo(this.swipeerIndex2,1000,true);
      console.log('click pervous');
    },
    handleClickHotNext() {
      if(this.swipeerIndex2 === this.dataList.length - 1){
        return;
      }
      this.swipeerIndex2++;
      this.mySwiper2.slideTo(this.swipeerIndex2,1000,true);
      console.log('click next');
    },

    handleMouseOver(index) {
      if (index === 1) {
        this.adventureOne = true;
        this.adventureTwo = false;
        this.adventureThree = false;
      }else if (index === 2) {
        this.adventureOne = false;
        this.adventureTwo = true;
        this.adventureThree = false;
      }else if (index === 3) {
        this.adventureOne = false;
        this.adventureTwo = false;
        this.adventureThree = true;
      }
      console.log('鼠标移入index =',index);
    },
    handleClickContact(index) {
      let openUrl = settingConfig.telegramUrl;
     if(index === 2) {
       openUrl = settingConfig.mediumUrl;
     }else if(index === 3) {
       openUrl = settingConfig.twitterUrl;
     }
     window.open(openUrl);
      console.log('获取联系方式index = ',index);
    },
    handleClickMarket() {
      this.$eventBus.$emit("checkNFTDetailJump",1);
    },
    handleClickTreasures() {
      this.$eventBus.$emit("checkNFTDetailJump",2);
    },
    isStringEmpty(url) {
      return isStringEmpty(url);
    }
  },
};
</script>

<style lang="scss" scoped>

.home {
  width: 100vw;
  box-sizing: border-box;
  background-color: #202139;
  .h_contian {
    padding-top: 0.1px;
    .h_c_market {
      width: 100vw;
      height: calc(580 / 1920 * 100vw);
      max-height: 580px;
      padding-top: 0.1px;
      box-sizing: border-box;
      background-size: 100% 100%;  //只支持IE9+
      background-repeat: no-repeat;
      background-image: url('../../../assets/homes/icon_top_bg.svg');
      .h_c_wrapper {
        margin: 0 auto;
        padding-top: 0.1px;
        max-width: 1200px;
        height: 100%;
        .h_c_m_title {
          margin-top: 167px;
          text-align: left;
          span {
            line-height: 112px;
            font-size: 80px;
            font-weight: 600;
            word-break: normal;
            font-family: "PingFang SC",sans-serif;
            font-stretch: normal;
            font-style: normal;
            user-select: none;
            color: var(--white);
            &:last-child {
              color: var(--primary);
            }
          }
        }
        .h_c_m_desc1 {
          max-width: 600px;
          margin-top: 19px;
          line-height: 60px;
          font-size: 36px;
          text-align: left;
          font-weight: normal;
          word-break: normal;
          font-family: "PingFang SC",sans-serif;
          font-stretch: normal;
          font-style: normal;
          user-select: none;
          color: var(--white);
        }
        .h_c_m_desc2 {
          margin-top: 18px;
          line-height: 28px;
          font-size: 20px;
          color: #68698d;
        }
        .h_c_m_desc1_en {
          line-height: 40px;
        }
        .h_c_m_desc2_en {
          line-height: 30px;
        }
      }
      .h_c_m_market {
        width: 242px;
        height: 48px;
        margin: 40px auto 0;
        font-size: 16px;
        font-stretch: normal;
        line-height: 48px;
        font-family: "PingFang SC",sans-serif;
        font-weight: bold;
        font-style: normal;
        user-select: none;
        cursor: pointer;
        box-sizing: border-box;
        background-size: contain;
        background-repeat: no-repeat;
        //background-image: url('../../../assets/homes/icon_top_mark.svg');
        color: var(--white);
      }
    }
    .h_c_treasures {
      margin-top: 80px;
      .h_c_t_wrapper {
        margin: 0 auto;
        max-width: 1200px;
        .w_title {
          display: flex;
          align-items: center;
          img {
            width: 48px;
            height: 48px;
          }
          span {
            margin-left: 20px;
            line-height: 45px;
            font-size: 32px;
            font-weight: 500;
            word-break: normal;
            font-family: "PingFang SC",sans-serif;
            font-stretch: normal;
            font-style: normal;
            user-select: none;
            color: var(--white);
            &:nth-child(3) {
              margin-left: 0;
              color:#ff953f;
            }
          }
        }
      }
      .h_c_t_treasures {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 1200px;
        height: 600px;
        margin: 0 auto;
        .h_c_t_banner {
          width: 1200px;
          height: 100%;
          .swiper-container {
             position: relative;
             width: 100%;
             height: 100%;
             overflow: hidden;
            .swiper-slide {
              width: 100% !important;
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
              //border-radius: 20px;
              box-sizing: border-box;
              //border: solid 1px #f19a52;
              //background-color: #202136;
              img {
                width: 100%;
                height: 100%;
              }
            }
          }
        }
        .h_c_t_t_icon1 {
          position: absolute;
          top: calc(50% - 26/1920 * 100vw);
          left: -26px;
          z-index: 999;
          width: 52px;
          height: 52px;
        }
        .h_c_t_t_icon2 {
          position: absolute;
          top: calc(50% - 26/1920 * 100vw);
          right: -26px;
          z-index: 999;
          width: 52px;
          height: 52px;
        }
      }
    }
    .h_c_adventure {
      margin:80px auto 0;
      max-width: 1200px;
      .h_c_t_wrapper {
        .w_title {
          text-align: left;
          span {
            line-height: 45px;
            font-size: 32px;
            font-weight: 500;
            word-break: normal;
            font-family: "PingFang SC",sans-serif;
            font-stretch: normal;
            font-style: normal;
            user-select: none;
            color: var(--white);
            &:nth-child(2) {
              color:#ff953f;
            }
          }
        }
        .w_desc {
          line-height: 33px;
          font-size: 24px;
          font-weight: normal;
          word-break: normal;
          text-align: left;
          font-family: "PingFang SC",sans-serif;
          font-stretch: normal;
          font-style: normal;
          user-select: none;
          color: #6c6dab;
        }
      }
      .h_c_t_bottom {
        display: flex;
        align-items: center;
        margin-top: 18px;
        .h_c_a_image {
          width: 366px;
          height: 375px;
        }
        .h_c_a_right {
          margin-left: 150px;
          .h_c_a_title {
            width: 440px;
            line-height: 28px;
            font-size: 20px;
            text-align: left;
            word-break: normal;
            font-family: "PingFang SC",sans-serif;
            font-weight: 500;
            font-stretch: normal;
            font-style: normal;
            user-select: none;
            color: var(--white);
          }
          .h_c_a_desc {
            width: 577px;
            margin-top: 20px;
            line-height: 26px;
            font-size: 16px;
            text-align: left;
            word-break: normal;
            font-family: "PingFang SC",sans-serif;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            user-select: none;
            color: #6c6dab;
          }
          .h_c_a_contact {
            margin-top: 20px;
            display: flex;
            align-items: center;
            .h_c_a_c_item {
              width: 210px;
              height: 48px;
              margin-right: 30px;
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
                line-height: 48px;
                font-size: 16px;
                font-family: "PingFang SC",sans-serif;
                font-weight: bold;
                font-stretch: normal;
                font-style: normal;
                user-select: none;
                color: var(--white);
              }
              img {
                width: 32px;
                height: 28px;
                margin-left: 10px;
                margin-right: 0;
              }
            }
            img {
              margin-right: 30px;
              width: 48px;
              height: 48px;
            }
          }
        }
      }
    }
    .h_c_hot {
      margin-top: 90px;
      .h_c_t_wrapper {
        margin: 0 auto;
        max-width: 1200px;
        .w_title {
          display: flex;
          align-items: center;
          img {
            width: 48px;
            height: 48px;
          }
          span {
            margin-left: 20px;
            line-height: 45px;
            font-size: 32px;
            font-weight: 500;
            word-break: normal;
            font-family: "PingFang SC",sans-serif;
            font-stretch: normal;
            font-style: normal;
            user-select: none;
            color:#ff953f;
            &:nth-child(3) {
              margin-left: 0;
              color: var(--white);
            }
          }
        }
      }
      .h_c_t_treasures {
        position: relative;
        width: 1240px;
        height: 370px;
        margin: 40px auto 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .h_c_t_banner {
          width: 1200px;
          height: 100%;
          .swiper-container {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
            .swiper-slide {
              overflow: hidden;
              width: 390px!important;
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
              border-radius: 20px;
              box-sizing: border-box;
              background-color: #2a2c46;
              .nft_img {
                width: 100%;
                height: 234px;
                object-fit: cover;
              }
              .header_img {
                position: absolute;
                top: 150px;
                left: calc(50% - 35 / 1920 * 100vw);
                width: 70px;
                height: 70px;
              }
              div {
                margin-top: 45px;
                font-size: 20px;
                line-height: 28px;
                font-family: "PingFang SC",sans-serif;
                font-weight: 500;
                font-stretch: normal;
                font-style: normal;
                color: var(--white);
                &:last-child {
                  margin-top: 10px;
                  font-size: 16px;
                  line-height: 22px;
                  color: #72729b;
                }
              }
            }
          }
        }
        .h_c_t_t_icon1 {
          position: absolute;
          top: calc(50% - 26/1920 * 100vw);
          left: -26px;
          z-index: 999;
          width: 52px;
          height: 52px;
        }
        .h_c_t_t_icon2 {
          position: absolute;
          top: calc(50% - 26/1920 * 100vw);
          right: 12px;
          z-index: 999;
          width: 52px;
          height: 52px;
        }
      }
    }
    .h_c_met {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin: 75px auto 0;
      max-width: 1200px;
      .h_c_t_wrapper {
        width: 320px;
        .w_title {
          text-align: left;
          span {
            line-height: 45px;
            font-size: 32px;
            font-weight: 500;
            word-break: normal;
            font-family: "PingFang SC",sans-serif;
            font-stretch: normal;
            font-style: normal;
            user-select: none;
            color: var(--white);
            &:nth-child(2) {
              color:#ff953f;
            }
          }
        }
        .w_desc {
          margin-top: 20px;
          line-height: 23px;
          font-size: 16px;
          font-weight: normal;
          word-break: normal;
          text-align: left;
          font-family: "PingFang SC",sans-serif;
          font-stretch: normal;
          font-style: normal;
          user-select: none;
          color: #6c6dab;
        }
      }
      .w_meet img {
        width: 824px;
        height: 638px;
      }
    }
    .h_c_meet {
      margin: 150px auto 0px;
      position: relative;
      .h_c_m_title {
        width: 600px;
        margin: 0px auto;
        line-height: 66px;
        font-size: 40px;
        text-align: center;
        word-break: normal;
        font-family: Montserrat;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        user-select: none;
        color: var(--white);
      }
      .h_c_m_desc {
        width: 680px;
        margin: 5px auto 0px;
        line-height: 30px;
        font-size: 16px;
        text-align: center;
        word-break: normal;
        font-family: Montserrat;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        user-select: none;
        color: var(--white);
      }
      .h_c_m_content {
        height: 765px;
        width: 100vw;
        margin-top: 60px;
        .h_c_m_body {
          height: 670px;
          width: 100%;
          white-space: nowrap;
          .h_c_m_b_content {
            height:670px;;
            //display: inline-block;
            display: inline-flex;
            .h_c_m_b_item {
              display: inline-block;
              width: 200px;
              height: 520px;
              margin-right: 20px;
              div {
                img {
                  width: 200px;
                  height: 200px;
                }
                &:last-child {
                  margin-top: 120px;
                }
              }
              &:nth-of-type(even) {
                margin-top: 50px;
              }
              &:nth-of-type(5n + 0) {
                margin-top: 120px;
              }
            }
          }
        }
      }
      .h_c_m_icon {
        width: 278px;
        height: 288px;
        position: absolute;
        bottom: 0;
        right: 0;
      }
    }
  }
}
.swiper-container .swiper-slide:not(.swiper-slide-active) {
  transform: scale(1);
}
.swiper-container .swiper-slide.swiper-slide-prev {
  border-radius: 0;
  transform-origin: left center;
}
.swiper-container .swiper-slide.swiper-slide-next {
  transform-origin: right center;
}



</style>
