<template>
  <div class="labora">
    <div class="n_market_top"></div>
    <div class="n_market_content">
      <div class="h_c_title">{{ $t('message.mallSideBar.soonText5') }}</div>
      <div class="l_wrapper">
        <div class="l_features" ref="wrapper">
          <div class="l_features_wraper">
            <div v-for="(item,index) in featuresList" :key="index" class="l_f_wapper">
              <router-link :to="item.path">
                <div :class="featuresIndex === index ? 'l_f_titles' : ''" class="l_f_title" @click="handleClickFeature(index)">{{ item.name }}</div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <route-view></route-view>
    </div>
  </div>
</template>

<script>

import {mapGetters} from 'vuex';
import {getObjectIndexAtArray, simpleDebounce} from '@/utils/utils';
import RouteView from "@/layout/RouterView.vue";
import BScroll from "better-scroll";

export default {
  name: "laboratoryMb",
  components: { RouteView },
  data() {
    return {
      showBindMaks: false,
      showModifyNickMaks: false,
      bScroll: '',
      featuresIndex: 0,
      bindSuperiorAddress: '',
      modifyNickName: '',
      featuresList: [{ name: this.$t("message.labora.stock"), path: '/laboratoryMb/stockMb' }, { name: this.$t("message.labora.holding"), path: '/laboratoryMb/holdMb' }, { name: this.$t("message.labora.delivery"), path: '/laboratoryMb/deliveryMb' }, { name: this.$t("message.labora.shopOrder"), path: '/laboratoryMb/shopOrderMb' }],
      imgList: [require('../../../assets/laboras/icon_stock.svg'), require('../../../assets/laboras/icon_holding.svg'), require('../../../assets/laboras/icon_delivery.svg')],
      imgSelectedList: [require('../../../assets/laboras/icon_stock_x.svg'), require('../../../assets/laboras/icon_holding_x.svg'), require('../../../assets/laboras/icon_delivery_x.svg')],
    };
  },
  created() {
    this.bottomIsShow = true;
  },
  mounted() {
    this.initBScroll();
    // 刷新页面时候记录上次浏览的页面
    // let nextKeyStorage = sessionStorage.getItem("mbFeaturesNavKey");
    // if (nextKeyStorage !== null) {
    //   this.featuresIndex = parseInt(nextKeyStorage);
    // }
  },
  destroyed() {

  },
  // 计算属性
  computed: {
    ...mapGetters(['isConnectWallet']),
  },
  // 监听属性改变
  watch: {
    // 监听路由变化
    $route(to, from) {
      const routeList = ['stockMb', 'holdMb', 'deliveryMb', 'shopOrderMb'];
      let routeName = to.name;
      let routeIndex = getObjectIndexAtArray(routeList, routeName);
      this.featuresIndex = routeIndex;
      sessionStorage.setItem("mbFeaturesNavKey", routeIndex);
      console.log('labora page router chainge');
    },
    // 监听语言的切换
    '$i18n.locale'(val, oval) {
      this.featuresList = [{ name: this.$t("message.labora.stock"), path: '/laboratoryMb/stockMb' }, { name: this.$t("message.labora.holding"), path: '/laboratoryMb/holdMb' }, { name: this.$t("message.labora.delivery"), path: '/laboratoryMb/deliveryMb' }, { name: this.$t("message.labora.shopOrder"), path: '/laboratoryMb/shopOrderMb' }];
      // let navIndex = sessionStorage.getItem("topNFTMallNavKey");
      // this.handleGetNavItemStyle(navIndex);
      // 当切换中英文时候进行bscroll内容刷新(进行防抖操作)
      const that = this;
      simpleDebounce(function() {
        if (that.bScroll) {
          that.bScroll.refresh();
        }
        console.log('更新b-scroll的内容区域大小');
      }, 1000)();
    },
    isConnectWallet(val, oval) {

    }
  },
  // 方法
  methods: {
    initBScroll() {
      this.bScroll = new BScroll(this.$refs.wrapper, {
        scrollX: true,
        bounce: false,
        probeType: 2,
        click: true,
      });
    },
    // 切换
    handleClickFeature(index) {
      this.featuresIndex = index;
      sessionStorage.setItem("mbFeaturesNavKey", index);
    },
  },
};
</script>

<style lang="scss" scoped>

.labora {
  position: relative;
  padding-top: 0.1px;
  width: 100vw;
  box-sizing: border-box;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  .n_market_top {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100vw;
    height: vw(528);
    box-sizing: border-box;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url('../../../assets/newPhones/nHome/icon_top_bg.svg');
  }
  .n_market_content {
    display: flex;
    flex-direction: column;
    //overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100vw;
    height: 100vh;
    //background-color: #3d3f60;
    .h_c_title {
      padding: vw(150) vw(30) vw(20);
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
      //background-color: #303360;
    }
    .l_wrapper {
      padding: 0 vw(30);
      width: 100%;
      height: vw(100);
      //background-color: #303360;
      .l_features {
        width: 100%;
        height: vw(100);
        white-space: nowrap;
        .l_features_wraper {
          margin-top: vw(20);
          height: vw(80);
          display: inline-flex;
          .l_f_wapper {
            margin-right: vw(15);
            height: vw(80);
            &:last-child {
              margin-right: 0;
            }
            .l_f_title {
              width: vw(162);
              height: vw(80);
              line-height: vw(80);
              font-size: vw(24);
              font-weight: 500;
              font-stretch: normal;
              font-style: normal;
              letter-spacing: normal;
              text-align: center;
              font-family: PingFangSC, sans-serif;
              border-top-left-radius: vw(20);
              border-top-right-radius: vw(20);
              color: #45459b;
              background-color: #23243e;
            }
            .l_f_titles {
              color: #fff;
              background-color: #3d3f60;
            }
          }
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
    .disconnect {
      position: relative;
      width: 586px;
      height: 352px;
      padding: 0 50px;
      border-radius: 20px;
      background-color: var(--bgc03);
      .m_dis_title {
        margin-top: 65px;
        line-height: 40px;
        font-size: 24px;
        text-align: left;
        font-family: Poppins, sans-serif;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        color: var(--white);
      }
      .m_dis_input {
        margin-top: 26px;
        height: 60px;
        border-radius: 10px;
        background-color: var(--bgc16);
        input {
          width: 90%;
          height: 100%;
          border: 0; // 去除未选中状态边框
          outline: none; // 去除选中状态边框
          font-size: 16px;
          font-family: Montserrat, sans-serif;
          font-weight: normal;
          box-sizing: border-box;
          background-color: transparent;
          color: var(--white);
        }
        input::-webkit-input-placeholder {
          color: var(--white);
          font-size: 14px;
        }
        input:-moz-placeholder {
          /* FF 4-18 */
          color: var(--white);
          font-size: 14px;
        }
        input::-moz-placeholder {
          /* FF 19+ */
          color: var(--white);
          font-size: 14px;
        }
        input:-ms-input-placeholder {
          /* IE 10+ */
          color: var(--white);
          font-size: 14px;
        }
        input:-webkit-autofill {
          transition: background-color 5000s ease-in-out 0s; //背景颜色
        }
      }
      .m_dis_prompt {
        margin-top: 20px;
        display: flex;
        align-items: center;
        i {
          width: 4px;
          height: 4px;
          border-radius: 2px;
          background-color: var(--white);
        }
        span {
          margin-left: 10px;
          font-size: 14px;
          font-family: Poppins, sans-serif;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          color: var(--white);
        }
      }
      .m_dis_confirm {
        width: 244px;
        height: 48px;
        margin: 30px auto 0;
        cursor: pointer;
        user-select: none;
        box-sizing: border-box;
        background-size: contain;
        background-repeat: no-repeat;
        background-image: url('../../../assets/universal/icon_disConnect.svg');
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          margin-left: 40px;
          font-size: 16px;
          font-weight: 500;
          line-height: 50px;
          font-family: Poppins, sans-serif;
          color: var(--white);
        }
        img {
          width: 22px;
          height: 22px;
          margin-left: 34px;
        }
      }
      .mask_close {
        width: 33px;
        height: 33px;
        top: 20px;
        right: 20px;
        position: absolute;
        cursor: pointer;
      }
    }
    .modifyNick {
      position: relative;
      width: 586px;
      height: 352px;
      padding: 0 50px;
      border-radius: 20px;
      background-color: var(--bgc03);
      .m_dis_title {
        margin-top: 65px;
        line-height: 40px;
        font-size: 24px;
        text-align: left;
        font-family: Poppins, sans-serif;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        color: var(--white);
      }
      .m_dis_input {
        margin-top: 26px;
        height: 60px;
        border-radius: 10px;
        background-color: var(--bgc16);
        input {
          width: 90%;
          height: 100%;
          border: 0; // 去除未选中状态边框
          outline: none; // 去除选中状态边框
          font-size: 16px;
          font-family: Montserrat, sans-serif;
          font-weight: normal;
          box-sizing: border-box;
          background-color: transparent;
          color: var(--white);
        }
        input::-webkit-input-placeholder {
          color: var(--white);
          font-size: 14px;
        }
        input:-moz-placeholder {
          /* FF 4-18 */
          color: var(--white);
          font-size: 14px;
        }
        input::-moz-placeholder {
          /* FF 19+ */
          color: var(--white);
          font-size: 14px;
        }
        input:-ms-input-placeholder {
          /* IE 10+ */
          color: var(--white);
          font-size: 14px;
        }
        input:-webkit-autofill {
          transition: background-color 5000s ease-in-out 0s; //背景颜色
        }
      }
      .m_dis_confirm {
        width: 244px;
        height: 48px;
        margin: 30px auto 0;
        cursor: pointer;
        user-select: none;
        box-sizing: border-box;
        background-size: contain;
        background-repeat: no-repeat;
        background-image: url('../../../assets/universal/icon_disConnect.svg');
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          margin-left: 40px;
          font-size: 16px;
          font-weight: 500;
          line-height: 50px;
          font-family: Poppins, sans-serif;
          color: var(--white);
        }
        img {
          width: 22px;
          height: 22px;
          margin-left: 34px;
        }
      }
      .mask_close {
        width: 33px;
        height: 33px;
        top: 20px;
        right: 20px;
        position: absolute;
        cursor: pointer;
      }
    }
  }
}

</style>
