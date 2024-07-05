<template>
  <div class="labora">
    <div class="l_bg">
      <van-image class="l_img" :src="isAvatarStringEmpty(coverUrl) ? require(`../../../assets/newPhones/nCreator/icon_c_pc_bg_${isEnglish ? 'y' : 'z'}.png`) : coverUrl"  fit="cover"></van-image>
      <div class="l_div">
        <div class="l_wrapper">
          <div class="l_left">
            <div class="n_t_header">
              <van-image :src="isAvatarStringEmpty(avatarUrl) ? require('../../../assets/newPhones/nMarket/icon_header_logo.png') : avatarUrl" fit="cover"></van-image>
              <div class="n_t_level"><img :src="require(`../../../assets/laboras/icon_l_level_${temaLevel}.svg`)" alt=""></div>
            </div>
            <div class="n_t_content">
              <div class="l_nickName">{{ isConnectWallet ? customerName : '--' }}</div>
              <div class="l_creator">{{ $t("message.labora.creatorNo") }}: #{{ isConnectWallet ? creatorNumber : '--' }}</div>
            </div>
          </div>
          <div class="l_right">
            <div class="sidebar_pending">
              <span class="sidebar_pending_amount"><span>{{ sideBar.cir }} | </span>{{ sideBar.ret }}%</span>
              <span class="sidebar_pending_title">ALAD {{ $t('message.wallet.Circulation') }}</span>
            </div>
            <div class="sidebar_pending">
              <span class="sidebar_pending_amount"><span>{{ sideBar.freezeQuantity }}</span>≈${{ sideBar.freezeValue }}</span>
              <span class="sidebar_pending_title">ALAD {{ $t('message.wallet.FreezeQuantity') }}</span>
            </div>
            <div class="sidebar_pending">
              <span class="sidebar_pending_amount"><span>{{ $t('message.mallSideBar.pending')  }} </span>{{ sideBar.aladPending }}</span>
              <div class="sidebar_buy_button" @click="handleHarvest">{{ $t('message.mallSideBar.extractALAD') }}</div>
            </div>
          </div>
        </div>
      </div>
      <img class="l_shadow" src="../../../assets/laboras/icon_shadow_bg.png" alt="">
      <van-uploader v-if="isSpecialSeller" class="l_uploader" :after-read="afterReadCover">
        <div class="l_d_right">
          <img src="../../../assets/newPhones/nCreator/icon_c_photo.svg" alt="">
          <span>{{ $t('message.center.changeCover') }}</span>
        </div>
      </van-uploader>
    </div>
    <div class="l_features">
      <div class="l_f_wapper" v-for="(item,index) in featuresList" :key="index">
        <router-link :to="item.path">
          <div class="l_f_title" :class="featuresIndex === index ? 'l_f_titles' : ''" @click="handleClickFeature(index)">{{ item.name }} </div>
        </router-link>
      </div>
    </div>
    <!--<div class="l_line"></div>-->
    <route-view></route-view>
    <div class="n_footer"> © 2022 COMPASS Club. All rights reserved. </div>
  </div>
</template>

<script>

const settingConfig = require('../../../settings.js');
import { mapGetters } from 'vuex';
import { isStringEmpty } from '@/utils/validate';
import {getCustomerInfoData, getReleaseRate, publishCover, uploadAvatar} from '@/api/mark'
import { isMobile,getObjectIndexAtArray } from '@/utils/utils';
import RouteView from "@/layout/RouterView.vue";
import {chuDivision, keepFormatDecimalDecimalPlaces} from '@/utils/computing';
import BigNumber from "@/decentralizedApi/bignumber";
import { create as ipfsHttpClient } from 'ipfs-http-client';

export default {
  name: "labora",
  components: { RouteView },
  data() {
    return {
      isEnglish:false,
      isSpecialSeller: false, // 是否是店铺类
      featuresIndex:0, // 第几个子视图
      creatorNumber:'--', // 创建的第几个用户
      customerName:'--',// 用户名称
      temaLevel:0, // 等级
      avatarUrl:'',// 头像
      coverUrl: '',//封面
      timerPrice:null,// 定时器
      ipfsClient: null, // IPFS对象
      sideBar: {
        aladPending: 0, // 待领取
        cir: 0,
        ret: 0,
        freezeQuantity: 0,
        freezeValue: 0,
      },
      featuresList:[{name:this.$t("message.labora.casting"),path:'/labora/casting'},{name:this.$t("message.labora.stock"),path:'/labora/stock'},{name:this.$t("message.labora.holding"),path:'/labora/hold'},
        {name:this.$t("message.labora.delivery"),path:'/labora/delivery'},{name:this.$t("message.labora.shopOrder"),path:'/labora/shopOrder'},{name:this.$t("message.mallSideBar.soonText8"),path:'/labora/record'}],
    };
  },
  created() {
    this.isEnglish = localStorage.getItem("lang") !== "zh";
    this.pendingProfit();
    this.getCustomerInfoData(1);
    this.isConnectWallet && this.handleTimerPrice();
    // 创建IPF客户端对象
    const ipfsNode = settingConfig.ipfsNode;
    this.ipfsClient = ipfsHttpClient(ipfsNode);
    // 监听头部修改昵称或者头像后刷新数据
    const that = this;
    this.$eventBus.$on('modifyCustomerInfoMonitor', () => {
      that.getCustomerInfoData(1);
    });
  },
  mounted() {
    const routeList = ['casting', 'stock', 'hold', 'delivery', 'shopOrder', 'record'];
    let routeName = this.$route.name;
    let routeIndex = getObjectIndexAtArray(routeList, routeName);
    this.featuresIndex = routeIndex;
  },
  destroyed() {

  },
  // 计算属性
  computed: {
    ...mapGetters(['isConnectWallet','walletAddress','connectWalletType']),
  },
  // 监听属性改变
  watch:{
    // 监听路由变化
    $route(to,from) {
      const routeList = ['casting','stock','hold','delivery','shopOrder','record'];
      let routeName = to.name;
      let routeIndex = getObjectIndexAtArray(routeList,routeName);
      this.featuresIndex = routeIndex;
      console.log('labora page router chainge');
    },
     // 监听语言的切换
    '$i18n.locale'(val,oval) {
      this.isEnglish = val !== 'zh';
      this.featuresList = [{name: this.$t("message.labora.casting"), path: '/labora/casting'},{name: this.$t("message.labora.stock"), path: '/labora/stock'}, {name: this.$t("message.labora.holding"), path: '/labora/hold'},
        {name: this.$t("message.labora.delivery"), path: '/labora/delivery'}, {name: this.$t("message.labora.shopOrder"), path: '/labora/shopOrder'}, {name: this.$t("message.mallSideBar.soonText8"), path: '/labora/record'}];
    },
    // 监听是否连接钱包
    isConnectWallet(val,oval) {
      if (val) {
        this.pendingProfit();
        this.getCustomerInfoData(1);
        this.handleTimerPrice()
      }
    },
  },
  // 方法
  methods: {
    // 判断头像是否是空的
    isAvatarStringEmpty(avatar) {
      return isStringEmpty(avatar);
    },
    // 切换tab页面
    handleClickFeature(index) {
      this.featuresIndex = index;
    },
    // 获取用户上传的背景图事件
    async afterReadCover(file) {
      try {
        const added = await this.ipfsClient.add(file.file, { progress: (prog) => console.log(`received: ${prog}`) });
        await this.uploadCover(added);
      } catch (e) {

      }
    },
    // 上传更新背景图头像
    async uploadCover(added) {
      const uploadDict = {};
      uploadDict['sender'] = this.walletAddress;
      uploadDict['pics'] = added.path;
      const result = await publishCover(uploadDict);
      if (result.status === 200) {
        this.coverUrl = `${settingConfig.ipfsNFTUrl + added.path}`;
      } else {
        this.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
      }
    },
    // 获取用户名称
    async getCustomerInfoData(type) {
      // 0 修改昵称  1 获取列表数据
      if(!this.isConnectWallet){
        return;
      }
      const dict = {};
      dict['type'] = type;
      dict['address'] = this.walletAddress;
      if (type === 0) {
        dict['name'] = this.modifyNickName;
      }
      const result = await getCustomerInfoData(dict);
      if (result.status === 200) {
        if (type === 0) {
          this.customerName = this.modifyNickName;
          this.handlClickColseModifyName();
          this.$notify({message: this.$t("message.labora.modifySuccess"),duration: 2500,showClose:false,customClass:'notifyClass'});
        }else if (type === 1) {
           // 判断用户是否绑定了上级地址
           const data = result.data;
           this.temaLevel = data.level;
           this.customerName = isStringEmpty(data.name) ? '' : data.name;
           this.creatorNumber = isStringEmpty(data.number) ? '--' : data.number;
           this.isSpecialSeller = parseInt(data.shopStatus) === 1;
           sessionStorage.setItem('shopStatus', data.shopStatus);
           if (isStringEmpty(data.picurl)) {
             this.avatarUrl = '';
           }else  {
             const newStr = data.picurl.indexOf("https");
             if (newStr === -1) {
               this.avatarUrl = `${settingConfig.ipfsNFTUrl + data.picurl}`
             }else  {
               this.avatarUrl = data.picurl;
             }
           }
          if (isStringEmpty(result.data.coverPic)) {
            this.coverUrl = '';
          } else {
            const newStr = result.data.coverPic.indexOf("https");
            if (newStr === -1) {
              this.coverUrl = `${settingConfig.ipfsNFTUrl + result.data.coverPic}`
            } else {
              this.coverUrl = result.data.coverPic;
            }
          }
          console.log('实验室头部获取用户信息数据=',data);
        }
      }else {
        this.$notify({message: result.data,duration: 2500,showClose:false,customClass:'notifyClass'});
      }
    },
    // 获取ALAD相关数据
    async pendingProfit() {
      if (!this.isConnectWallet) {
        return;
      }
      // ALAD总流通量
      const cirResult = await this.$decentralized.aladCirculation();
      if (cirResult) {
        this.sideBar.cir = keepFormatDecimalDecimalPlaces(chuDivision(cirResult.cir, 18), 2);
      }
      // ALAD流通量占比
      const retResult = await getReleaseRate();
      if (retResult.status === 200) {
        this.sideBar.ret = keepFormatDecimalDecimalPlaces(retResult.data / 10, 2);
      }
      const dict = {};
      dict['address'] = this.walletAddress;
      const result = await this.$decentralized.getALADExtractBlanace(dict);
      const ocToUsdtData = await this.$decentralized.getSingleAladPrice();
      const usdtToOcData = await this.$decentralized.getNeedUSDTWithALAD();
      const msUtils = Math.pow(10, 18);
      const aladRet = new BigNumber(ocToUsdtData[1]);
      const ret = new BigNumber(usdtToOcData[1]);
      this.sideBar.aladPrice = keepFormatDecimalDecimalPlaces(aladRet.dividedBy(msUtils), 2);
      if (result) {
        this.sideBar.aladPending = keepFormatDecimalDecimalPlaces(chuDivision(result._pendingAmount, 18), 2);
        this.sideBar.freezeQuantity = keepFormatDecimalDecimalPlaces(chuDivision(result._freeze, 18), 2);
        this.sideBar.freezeValue = keepFormatDecimalDecimalPlaces(chuDivision(parseFloat(result._freeze) / parseFloat(ret.dividedBy(msUtils)), 18), 2);
      }
      console.log('获取ALAD相关数据 =',this.sideBar);
    },
    // 提取ALAD
    async handleHarvest() {
      console.log('aladPending =', this.sideBar.aladPending);
      if (!this.isConnectWallet) {
        return;
      } else if (parseFloat(this.sideBar.aladPending) <= 0) {
        this.$notify({ message: this.$t("message.wallet.avaliableMsg"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      }
      try {
        const dict = { address: this.walletAddress };
        this.$loading.showLoading();
        const result = await this.$decentralized.aladWidth(dict, this.connectWalletType);
        if (result) {
          this.$loading.hiddenLoading();
        }
      } catch (error) {
        this.$loading.hiddenLoading();
        this.$notify({ message: error.message, duration: 2500, showClose: false, customClass: 'notifyClass' });
        console.log('Error message: ', error)
      }
    },
    // 开启定时器
    handleTimerPrice() {
      window.clearTimeout(this.timerPrice);
      this.timerPrice = setInterval(async () => {
        this.pendingProfit();
      }, 10000);
    },
  },
};
</script>

<style lang="scss" scoped>

.labora {
  padding-top: 0.1px;
  position: relative;
  box-sizing: border-box;
  background-color: #202136;
  .l_bg {
    position: relative;
    margin: 0 auto;
    width: 1400px;
    height: 560px;
    box-sizing: border-box;
    .l_img {
      width: 100%;
      height: 100%;
    }
    .l_div {
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 2;
      width: 100%;
      height: 140px;
      .l_wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        max-width: 1200px;
        margin: 0 auto;
        .l_left {
          display: flex;
          align-items: center;
          .n_t_header {
            position: relative;
            width: 140px;
            height: 140px;
            .van-image {
              width: 100%;
              height: 100%;
              border: 5px solid white;
              border-radius: 70px;
              overflow: hidden;
            }
            .n_t_level {
              position: absolute;
              bottom: 0;
              right: 0;
              width: 40px;
              height: 40px;
              img {
                width: 100%;
                height: 100%;
              }
            }
          }
          .n_t_content {
            text-align: left;
            margin-left: 14px;
            .l_nickName {
              line-height: 48px;
              font-size: 32px;
              font-weight: 600;
              font-stretch: normal;
              font-style: normal;
              font-family: PingFangSC, sans-serif;
              user-select: none;
              color: var(--white);
            }
            .l_creator {
              margin: 15px auto 0;
              font-size: 16px;
              line-height: 22px;
              font-family: PingFangSC, sans-serif;
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              color: #72729b;
            }
          }
        }
        .l_right {
          display: flex;
          align-items: center;
          .sidebar_pending {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-left: 40px;
            .sidebar_pending_amount {
              font-size: 16px;
              font-weight: 500;
              line-height: 28px;
              text-align: center;
              font-family: "PingFang SC", sans-serif;
              color: #ff953f;
              span {
                color: #fff;
              }
            }
            .sidebar_pending_title {
              margin-top: 20px;
              line-height: 22px;
              font-size: 14px;
              font-weight: normal;
              text-align: center;
              font-family: PingFangSC-Semibold, sans-serif;
              color: #8080c9;
            }
            .sidebar_buy_button {
              margin-top: 20px;
              width: 100px;
              height: 30px;
              line-height: 30px;
              font-size: 14px;
              font-weight: 500;
              text-align: center;
              font-family: "PingFang SC", sans-serif;
              color: white;
              user-select: none;
              cursor: pointer;
              border-radius: 15px;
              box-shadow: 0 0 10px 0 rgba(123, 40, 219, 0.6);
              background-image: linear-gradient(82deg, #f109b4 0%, #622fe3 101%);
            }
          }
        }
      }
    }
    .l_shadow {
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 1;
      width: 1400px;
      height: 560px;
    }
    .l_uploader {
      position: absolute;
      bottom: 155px;
      right: 100px;
      z-index: 2;
      width: 60px;
      height: 65px;
      cursor: pointer;
      user-select: none;
      .l_d_right {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 100%;
        img {
          width: 32px;
          height: 32px;
        }
        span {
          margin-top: 5px;
          line-height: 22px;
          font-size: 16px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          font-family: PingFangSC, sans-serif;
          user-select: none;
          color: var(--white);
        }
      }
    }
  }
  .l_features {
    display: flex;
    justify-content:center;
    margin: 40px auto 0;
    max-width: 1200px;
    height: 40px;
    border-radius: 20px;
    border: solid 1px #72729b;
    background-color: #33334b;
    .l_f_wapper {
      margin-left: 114px;
      .l_f_title {
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        font-weight: 500;
        font-family: "PingFang SC",sans-serif;
        font-stretch: normal;
        font-style: normal;
        color: var(--white);
        &:first-child {
          margin-left: 0;
        }
      }
      .l_f_titles {
        color: #ff953f;
      }
      &:first-child {
        margin-left: 0;
      }
    }
  }
  .n_footer {
    margin-top: 80px;
    height: 108px;
    line-height: 108px;
    font-size: 16px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    font-family: PingFang SC,sans-serif;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url('../../../assets/wish/icon_n_footer_bg.svg');
    color: var(--white);
  }
}

</style>
