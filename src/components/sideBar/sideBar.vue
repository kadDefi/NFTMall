<template>
  <div class="sidebar">
    <div class="sidebar_top">
      <div class="sidebar_top_logo">
        <van-image :src="require('../../assets/newPhones/universal/icon_alad_logo.svg')" class="logo_text"/>
        <van-image :src="require('../../assets/newPhones/universal/icon_open_right.svg')" class="left_back" @click="handleCloseLeft"/>
      </div>
      <div class="sidebar_top_address">
        <van-image class="sidebar_left" :src="avatarUrl===''?require('../../assets/newPhones/universal/icon_header_logo.png'):avatarUrl" round/>
        <div class="sidebar_right">
          <div class="sidebar_right_top">
            <span>{{ customerName === '' ? '#' + creatorNumber : customerName }}</span>
          </div>
          <div class="sidebar_right_bottom" @click="handleWalletConnect">{{ isConnectWallet ? omitCharacters(walletAddress, 7) : $t('message.mallSideBar.nConnect') }}</div>
        </div>
      </div>
      <div :class="isBindSuperAddress?'sidebar_top_bind sidebar_top_bind_not':'sidebar_top_bind'" @click="handleBindAddress">
        <span>{{ isBindSuperAddress ? $t('message.mallSideBar.recommendedAddress') + ':' + omitCharacters(superAdd) : $t('message.mallSideBar.bindRecommendedAddress') }}</span>
      </div>
    </div>
    <div class="sidebar_content">
      <div class="sidebar_alad">
        <div class="sidebar_coming_soon_list">
          <div v-for="index in 8" class="sidebar_coming_soon_item" @click="handleOMCLink(index)">
            <van-image class="coming_soon_item_img" :src="require('../../assets/newPhones/universal/icon_soon_item'+index+'.svg')"/>
            <span class="coming_soon_item_text">{{ $t('message.mallSideBar.soonText' + index) }}</span>
          </div>
        </div>
        <div class="sidebar_buy">
          <div class="sidebar_buy_price">
            <van-image class="coin_logo" :src="require('../../assets/newPhones/universal/icon_coin_alad.svg')" round/>
            <span class="price_text">${{ sideBar.aladPrice }}</span>
            <div class="buy_img" @click="handleBuyAlad">{{ $t('message.mallSideBar.buy') }}</div>
          </div>
          <div class="sidebar_pending">
            <span class="sidebar_pending_title">ALAD {{ $t('message.wallet.Circulation') }}</span>
            <span class="sidebar_pending_amount"><span>{{ sideBar.cir }} | </span>{{ sideBar.ret }}%</span>
          </div>
          <div class="sidebar_pending">
            <span class="sidebar_pending_title">ALAD {{ $t('message.wallet.FreezeQuantity') }}</span>
            <span class="sidebar_pending_amount"><span>{{ sideBar.freezeQuantity }}</span>≈${{ sideBar.freezeValue }}</span>
          </div>
          <div class="sidebar_pending">
            <span class="sidebar_pending_title">{{ $t('message.mallSideBar.pending') }}</span>
            <span class="sidebar_pending_amount">{{ sideBar.aladPending }}</span>
          </div>
          <div class="sidebar_buy_button" @click="handleHarvest">{{ $t('message.mallSideBar.extractALAD') }}</div>
        </div>
      </div>
      <div class="sidebar_line"></div>
      <div class="sidebar_airdrop" v-if="false">
        <span class="airdrop-text"><span>{{ $t("message.labora.aridrop") }}:</span>{{ sideBar.aridropAmount  | roundingDecimals(2) }}</span>
        <div class="airdrop-draw" @click="handleClickAridrop"><span>{{ $t('message.mallSideBar.extract') }}</span></div>
      </div>
      <div class="sidebar_line"></div>
      <div class="sidebar_setting">
        <div class="sidebar_setting_language">
          <span>{{ $t('message.mallSideBar.language') }}</span>
          <img :src="require('../../assets/newPhones/universal/btn_lang_'+(isEnglish?'en':'ch')+'.svg')" alt="language" @click="handleLanguage">
        </div>
      </div>
      <div class="sidebar_line"></div>
      <div class="sidebar_contact_us">
        <img src="../../assets/newPhones/universal/icon_left_tg.svg" alt="tg" @click="handleContact(0)">
        <img src="../../assets/newPhones/universal/icon_left_tw.svg" alt="tw" @click="handleContact(1)">
        <img src="../../assets/newPhones/universal/icon_left_m.svg" alt="m" @click="handleContact(2)">
      </div>
      <div class="sidebar_bottom">
        <div class="sidebar_bottom_content">
          <div class="bottom_item" @click="handleBottom(0)">
            <img src="../../assets/newPhones/universal/icon_left_email.svg" alt="email">
            <span>{{ $t('message.mallSideBar.emailContact') }}</span>
          </div>
          <div class="bottom_item" @click="handleBottom(2)">
            <img src="../../assets/newPhones/universal/icon_left_download.svg" alt="download">
            <span>{{ $t('message.mallSideBar.downloadFile') }}</span>
          </div>
          <div class="bottom_item" @click="handleBottom(1)">
            <img src="../../assets/newPhones/universal/icon_left_guide.svg" alt="guide">
            <span>{{ $t('message.mallSideBar.guide') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {isMobile} from '@/utils/utils'
import {mapGetters} from 'vuex'
import settingConfig from '@/settings'
import {getCustomerInfoData, getReleaseRate} from '@/api/mark'
import {isStringEmpty} from '@/utils/validate'
import {chuDivision, keepFormatDecimalDecimalPlaces} from '@/utils/computing'
import BigNumber from '@/decentralizedApi/bignumber'

export default {
  name: "sideBar",
  props: ['isOff'],
  data() {
    return {
      isIphone: false,
      isEnglish: false,
      creatorNumber: '--', // 创建的第几个用户
      superAdd: '--',// 父级地址
      customerName: '',// 用户名称
      temaLevel: 0, // 等级
      avatarUrl: '',// 头像
      sideBar: {
        aladPrice: 0, // ora价格
        aladPending: 0, // 待领取
        cir: 0,
        ret: 0,
        freezeQuantity: 0,
        freezeValue: 0,
        aridropAmount: 0,
      },
    };
  },
  created() {
    // 是否是手机
    this.isIphone = isMobile();
    // 国际化
    this.isEnglish = localStorage.getItem("lang") !== "zh";
    this.getUserInfo();
    this.pendingProfit();
    this.getAirdropInfoData();
    this.handleTimerPrice();
    let that = this;
    this.$eventBus.$on('setBindAddress', function() {
      that.getUserInfo();
    })
  },
  beforeDestroy() {
    window.clearInterval(this.timerPrice);
  },
  computed: {
    ...mapGetters(['isConnectWallet', 'walletAddress', 'isBindSuperAddress', 'connectWalletType']),
  },
  watch: {
    isConnectWallet(val, oval) {
      if (val) {
        this.getUserInfo();
      }
    },
  },
  methods: {
    handleBindAddress() {
      if (this.isBindSuperAddress)
        return
      this.$emit('listenBindAddress');
    },
    // 关闭侧边栏
    handleCloseLeft() {
      this.$emit('listenClose');
    },
    // 切换路由
    handleOMCLink(index) {
      switch (index) {
        case 1:
          this.$router.push('/nHome');
          break;
        case 2:
          sessionStorage.setItem("mbMarketNavKey", '1');
          this.$router.push('/nMarket');
          break
        case 3:
          this.$router.push('/nShop');
          break
        case 4:
          this.$router.push('/castingMb');
          break
        case 5:
          this.$router.push('/laboratoryMb');
          break
        case 6:
          this.$router.push('/nLpMining');
          break
        case 7:
          this.$router.push('/nWish');
          break
        case 8:
          this.$router.push('/nCenter');
          break
      }
      this.handleCloseLeft();
    },
    // 断开或者连接钱包
    handleWalletConnect() {
      this.$emit('listenClose');
      this.$eventBus.$emit('listenSideBarConnectWallet')
    },
    // 切换语言
    handleLanguage() {
      this.isEnglish = !this.isEnglish;
      let lang = this.isEnglish ? 'en' : 'zh';
      this.$i18n.locale = lang;
      localStorage.setItem("lang", lang);
      console.log('选择切换的语言是=', lang);
    },
    // 购买ALAD
    handleBuyAlad() {
      let url = settingConfig.buyUrl;
      window.open(url);
    },
    // 提取空投
    async handleClickAridrop() {
      if (!this.isConnectWallet) {
        this.$notify({ message: this.$t("message.casting.connectWallet"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      } else if (this.sideBar.aridropAmount <= 0) {
        this.$notify({ message: this.$t("message.labora.airdropMsg"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      }
      try {
        const that = this;
        const dict = {};
        dict['address'] = that.walletAddress;
        that.$loading.showLoading();
        const result = await that.$decentralized.extractAirdrop(dict, this.connectWalletType);
        that.$loading.hiddenLoading();
        that.getAirdropInfoData();
      } catch (error) {
        this.$loading.hiddenLoading();
        this.$notify({ message: error.message, duration: 2500, showClose: false, customClass: 'notifyClass' });
        console.log('Error message: ', error)
      }
    },
    // 获取空投比种的数量
    async getAirdropInfoData() {
      if (!this.isConnectWallet) {
        return;
      }
      try {
        const that = this;
        const dict = {};
        dict['address'] = that.walletAddress;
        const result = await that.$decentralized.getAirdropInfoData(dict);
        this.sideBar.aridropAmount = chuDivision(result, 18);
      } catch (error) {
        this.$notify({ message: error.message, duration: 2500, showClose: false, customClass: 'notifyClass' });
        console.log('Error message: ', error)
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
        this.getAirdropInfoData();
      }, 4000);
    },
    handleContact(index) {
      let url = '';
      if (index === 0) {
        url = settingConfig.telegramUrl;
      } else if (index === 1) {
        url = settingConfig.twitterUrl;
      } else {
        url = settingConfig.mediumUrl;
      }
      window.open(url);
    },
    handleBottom(index) {
      if (index === 0) {
        this.copyData();
      } else if (index === 1) {
        let url = this.isEnglish ? settingConfig.guideUrlEN : settingConfig.guideUrlCN;
        window.open(url);
      } else {
        this.$emit('listenDownload');
      }
    },
    async getUserInfo() {
      // 0 修改昵称  1 获取列表数据
      if (!this.isConnectWallet) {
        return;
      }
      const dict = {};
      dict['type'] = 1;
      dict['address'] = this.walletAddress;
      const result = await getCustomerInfoData(dict);
      if (result.status === 200) {
        // 判断用户是否绑定了上级地址
        const data = result.data;
        const isBindSuperAddress = data.superadd !== "0x0000000000000000000000000000000000000000";
        // 将用户是否绑定上级地址进行存储
        this.$store.dispatch('wallet/setBindSuperAddress', isBindSuperAddress);
        sessionStorage.setItem('shopStatus', data.shopStatus);
        this.temaLevel = data.level;
        this.superAdd = data.superadd;
        //this.avatarUrl = isStringEmpty(data.picurl) ? '' : `${settingConfig.ipfsNFTUrl + data.picurl}`;
        this.customerName = isStringEmpty(data.name) ? '' : data.name;
        this.creatorNumber = isStringEmpty(data.number) ? '--' : data.number;
        if (isStringEmpty(data.picurl)) {
          this.avatarUrl = '';
        } else {
          const newStr = data.picurl.indexOf("https");
          if (newStr === -1) {
            this.avatarUrl = `${settingConfig.ipfsNFTUrl + data.picurl}`
          } else {
            this.avatarUrl = data.picurl;
          }
        }
        console.log('result data = ', data);
      } else {
        this.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
      }
    },
    copyData() {
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
    },
    omitCharacters(address, reserve = 7) {
      const newAddress = address.substring(0, 5) + '...' + address.substring(address.length - reserve);
      return newAddress;
    },
  },
}
</script>

<style lang="scss" scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  //overflow: hidden;
  background-color: #2c2f53;
  width: 442px;
  min-height: 100vh;
  .sidebar_top {
    background-color: #27273f;
    height: vw(307);
    padding-top: 0.1px;
    padding-left: vw(30);
    padding-right: vw(10);
    .sidebar_top_logo {
      margin-top: vw(14);
      display: flex;
      align-items: center;
      justify-content: space-between;
      .logo_text {
        width: vw(160);
        height: vw(60);
      }
      .left_back {
        width: vw(40);
        height: vw(40);
        cursor: pointer;
      }
    }
    .sidebar_top_address {
      display: flex;
      align-items: center;
      margin-top: vw(43);
      .sidebar_left {
        width: vw(100);
        height: vw(100);
        border: vw(5) solid white;
      }
      .sidebar_right {
        margin-left: vw(10);
        .sidebar_right_top {
          display: flex;
          align-items: center;
          span {
            line-height: vw(40);
            font-size: vw(28);
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            letter-spacing: normal;
            font-family: PingFangSC-Regular, sans-serif;
            color: white;
          }
          img {
            margin-left: vw(10);
            width: vw(40);
            height: vw(40);
          }
        }
        .sidebar_right_bottom {
          margin-top: vw(8);
          width: vw(260);
          height: vw(50);
          line-height: vw(50);
          font-size: vw(24);
          font-weight: 600;
          font-family: PingFangSC, sans-serif;
          text-align: center;
          border-radius: vw(4);
          box-shadow: 0 0 20px 0 rgba(123, 40, 219, 0.6);
          background-image: linear-gradient(85deg, #f109b4 -1%, #622fe3 102%);
          color: #fff;
        }
      }
    }
    .sidebar_top_bind {
      width: vw(370);
      height: vw(50);
      margin: vw(20) 0;
      border-radius: 10px;
      border: solid 1px #ff953f;
      span {
        font-family: PingFangSC-Regular, sans-serif;
        font-size: vw(20);
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: vw(50);
        letter-spacing: normal;
        text-align: center;
        color: #ff953f;
      }
    }
    .sidebar_top_bind_not {
      border: solid 1px #ffffff;
      span {
        color: #ffffff;
      }
    }
  }
  .sidebar_content {
    //overflow: auto;
    //max-height: 100%;
    .sidebar_line {
      width: 100%;
      height: vw(2);
      background-color: #3d3d58;
    }
    .sidebar_alad {
      .sidebar_coming_soon_list {
        .sidebar_coming_soon_item {
          padding: 0 vw(30);
          height: vw(100);
          display: flex;
          align-items: center;
          border-bottom: vw(2) solid #3d3d58;
          .coming_soon_item_img {
            width: vw(48);
            height: vw(48);
          }
          .coming_soon_item_text {
            margin-left: vw(20);
            font-size: vw(26);
            font-weight: normal;
            text-align: left;
            font-family: PingFangSC, sans-serif;
            color: #fff;
          }
          &:first-child {
            margin-top: 0;
          }
        }
      }
      .sidebar_buy {
        padding-top: vw(50);
        padding-bottom: vw(50);
        .sidebar_buy_price {
          display: flex;
          justify-content: center;
          align-items: center;
          .coin_logo {
            width: vw(50);
            height: vw(50);
          }
          .price_text {
            margin-left: vw(40);
            font-family: PingFangSC-Semibold, sans-serif;
            font-size: vw(32);
            font-weight: 600;
            text-align: center;
            color: #fff;
          }
          .buy_img {
            margin-left: vw(40);
            width: vw(110);
            height: vw(44);
            font-size: vw(28);
            font-weight: 600;
            line-height: vw(44);
            text-align: center;
            font-family: PingFangSC, sans-serif;
            color: #fff;
            box-sizing: border-box;
            border-radius: vw(8);
            box-shadow: 0 0 20px 0 rgba(123, 40, 219, 0.6);
            background-image: linear-gradient(85deg, #f109b4 -1%, #622fe3 102%);
          }
          .buy_ora_img {
            margin-left: 30px;
            width: 80px;
            height: 60px;
            color: #412f01;
            //background-image: url("../../assets/img/bg_left_buy_ora.png");
          }
        }
        .sidebar_pending {
          margin-top: vw(20);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .sidebar_pending_title {
            line-height: vw(33);
            font-size: vw(24);
            font-weight: 600;
            opacity: 0.61;
            text-align: center;
            font-family: PingFangSC-Semibold, sans-serif;
            color: #ffe7cb;
          }
          .sidebar_pending_amount {
            span {
              color: #9b42f4;
            }
            margin-top: vw(15);
            font-size: vw(30);
            font-weight: 500;
            line-height: vw(36);
            text-align: center;
            font-family: DIN, sans-serif;
            color: #ff953f;
          }
        }
        .sidebar_buy_button {
          margin: vw(30) auto 0;
          width: vw(340);
          height: vw(80);
          line-height: vw(80);
          font-size: vw(30);
          font-weight: 600;
          text-align: center;
          font-family: PingFangSC-Semibold, sans-serif;
          color: white;
          border-radius: vw(10);
          box-shadow: 0 0 20px 0 rgba(123, 40, 219, 0.6);
          background-image: linear-gradient(85deg, #f109b4 -1%, #622fe3 102%);
        }
      }
    }
    .sidebar_airdrop {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 vw(30);
      height: vw(110);
      .airdrop-text {
        font-family: PingFangSC, sans-serif;
        font-size: vw(28);
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: right;
        color: #ff953f;
        span {
          color: white;
        }
      }
      .airdrop-draw {
        width: vw(120);
        height: vw(44);
        object-fit: contain;
        border-radius: vw(8);
        box-shadow: 0 0 10px 0 rgba(123, 40, 219, 0.6);
        background-image: linear-gradient(80deg, #f109b4 0%, #622fe3 100%);
        span {
          font-family: PingFangSC-Semibold, sans-serif;
          font-size: vw(22);
          font-weight: 600;
          font-stretch: normal;
          font-style: normal;
          line-height: vw(44);
          letter-spacing: normal;
          text-align: left;
          color: #fff;
        }
      }
    }
    .sidebar_setting {
      padding-top: 0.1px;
      margin: vw(30) 0;
      .sidebar_setting_language {
        display: flex;
        padding: 0 vw(30);
        justify-content: space-between;
        align-items: center;
        span {
          line-height: vw(40);
          font-family: PingFangSC, sans-serif;
          font-size: vw(28);
          font-weight: 500;
          text-align: left;
          color: white;
        }
        img {
          width: vw(120);
          height: vw(44);
        }
      }
    }
    .sidebar_contact_us {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 130px;
      img {
        width: vw(50);
        height: vw(50);
        margin-right: vw(30);
        &:last-child {
          margin-right: 0;
        }
      }
    }
    .sidebar_bottom {
      display: flex;
      align-items: center;
      padding-bottom: vw(50);
      .sidebar_bottom_content {
        width: 100%;
        display: flex;
        flex-direction: column;
        .bottom_item {
          display: flex;
          align-items: center;
          flex: 1;
          margin-top: vw(36);
          img {
            margin-left: vw(30);
            width: vw(36);
            height: vw(36);
          }
          span {
            margin-left: vw(30);
            font-family: PingFangSC-Regular, sans-serif;
            font-size: vw(24);
            font-weight: normal;
            text-align: left;
            color: #fff;
          }
          &:first-child {
            margin-top: 0;
          }
        }
      }
    }
  }
}


</style>

