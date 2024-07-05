<template>
  <div class="header">
    <div class="content">
      <a class="navLeft">
        <img src="../../assets/newPhones/universal/icon_open_left.svg" alt="logo" @click="handleOpenLeft"/>
        <img src="../../assets/newPhones/universal/icon_alad_logo.svg" alt="logo"/>
      </a>
      <!--  <div class="navRight">
         &lt;!&ndash; <el-dropdown trigger="click" @command="handleDropdownCommand">
            <div class="h_w_language">
              <img :src="isEnglish ? require('../../assets/universal/h_yw.png') : require('../../assets/universal/h_zw.png')" alt="logo" class="h_w_l_gq">
              &lt;!&ndash; <img alt="logo" class="h_w_l_zsq" src="../../assets/images/headers/h_drown.png"> &ndash;&gt;
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command='en'><img alt="logo" class="el-dropdown-item-img" src="../../assets/universal/h_yw.png"></el-dropdown-item>
              <el-dropdown-item command='zh'><img alt="logo" class="el-dropdown-item-img" src="../../assets/universal/h_zw.png"></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>&ndash;&gt;
          <div v-if="isConnectWallet">
            <div class="nr_right_dk" @click="handleWallOperate">{{ walletAddress | omitCharacters(7) }}</div>
          </div>
          <div v-else>
            <div class="nr_right_lj" @click="handleWallOperate">{{ $t('message.mallSideBar.nConnect') }}</div>
          </div>
        </div>-->
    </div>
    <!-- 连接钱包提示框 -->
    <div class="mask" v-show="showConnectMaks" @touchmove.prevent @mousewheel.prevent>
      <div class="connect">
        <div class="m_c_title">{{ $t("message.mallHeader.connect") }}</div>
        <div class="m_c_line"></div>
        <div class="m_c_item" @click="handleMetamaskConnect">
          <img src="../../assets/universal/icon_metamask.svg" alt="logo">
          <span>Metamask</span>
        </div>
        <div class="m_c_item m_c_marginTop" @click="handleWalletConnect">
          <img src="../../assets/universal/icon_walletConnect.svg" alt="logo">
          <span>WalletConnect</span>
        </div>
        <img class="mask_close" src="../../assets/newPhones/nLaboratory/icon_qb_close.svg" alt="logo" @click="handleDisWallOperate">
      </div>
    </div>
    <!-- 断开钱包链接提示框 -->
    <div class="mask" v-show="showDisconnectMaks" @touchmove.prevent @mousewheel.prevent>
      <div class="disconnect">
        <div class="m_dis_title">{{ $t("message.mallHeader.connected") }}</div>
        <div class="m_dis_line"></div>
        <div class="m_dis_item">
          <span>{{ $t("message.mallHeader.Address") }}:</span>
          <span>{{ walletAddress }}</span>
        </div>
        <div class="m_dis_item m_dis_itemTop">
          <span>ALAD:</span>
          <span>{{ aladBalance | noRoundingDecimals(2) }}</span>
        </div>
        <div class="m_dis_item m_dis_itemTop">
          <span>BUSD:</span>
          <span>{{ busdBalance | noRoundingDecimals(2) }}</span>
        </div>
        <div class="m_dis_confirm" @click="handleConfirmDisconnect">{{ $t('message.mallHeader.disconnect') }}</div>
        <img class="mask_close" src="../../assets/newPhones/nLaboratory/icon_qb_close.svg" alt="logo" @click="handleDisWallOperate">
      </div>
    </div>
  </div>
</template>

<script>
import {isMobile} from '@/utils/utils';
import {isStringEmpty} from '@/utils/validate';
import {chuDivision} from '@/utils/computing';

import Web3 from "web3";
import contractObject from '../../decentralizedApi/inits.js'
import WalletConnect from '@walletconnect/client'
import QRCodeModal from '@walletconnect/qrcode-modal'

const settingConfig = require('../../settings.js');

export default {
  name: "zoonHeaderMb",
  data() {
    return {
      topNavKey: 0,
      isIphone: false,
      showConnectMaks: false, // 显示连接弹框
      showDisconnectMaks: false, // 显示断开连接弹框
      navItemDistanceLeftStyle: 0,
      countdTimer: null,
      // connectWalletType: null, // 1 metamske、2 walletConnect
      aladBalance: 0,
      busdBalance: 0,
    }
  },
  // watch/event事件回调
  async created() {
    // 判断是否是手机
    this.isIphone = isMobile();
    // 初始化合约
    this.init_web3_contractObject();
    // 判断是否存在小狐狸浏览器钱包
    if (typeof window.ethereum !== 'undefined') {
      this.getConnectWallet();
      console.log('存在window.ethereum对象');
    }
    // 监听跳转到实验室
    const that = this;
    this.$eventBus.$on('buyNFTSuccessJump', () => {
      that.handleChangeNavItemMethod(2);
    });
    // 监听跳转到详情页面
    this.$eventBus.$on('checkNFTDetailJump', () => {
      that.topNavKey = 1;
      // that.handleGetNavItemStyle(1);
      sessionStorage.setItem("topNFTMallNavKey", 1);
    });
    // 监听到侧边栏操作连接钱包或者断开钱包
    this.$eventBus.$on('listenSideBarConnectWallet', (item) => {
      that.handleWallOperate();
    });
  },
  mounted() {

  },
  destroyed() {

  },
  computed: {
    connectWalletType: {
      get() {
        return this.$store.getters.connectWalletType;
      },
      set(val) {
        this.$store.dispatch('wallet/setConnectWalletType', val);
      }
    },
    isConnectWallet: {
      get() {
        return this.$store.getters.isConnectWallet;
      },
      set(val) {
        this.$store.dispatch('wallet/setConnectWallet', val);
      }
    },
    walletAddress: {
      get() {
        return this.$store.getters.walletAddress;
      },
      set(val) {
        this.$store.dispatch('wallet/setWalletAddress', val);
      }
    },
  },
  // 监听方法
  watch: {
    // 监听是否授权连接钱包
    isConnectWallet(val, oval) {
      this.$store.dispatch('wallet/setConnectWallet', val);
      if (!val) {
        this.closeTimer();
      } else {
        this.openTimer();
      }
      console.log('钱包已经', val ? '连接' : '断开');
    },
  },
  // 方法集合
  methods: {
    handleOpenLeft() {
      this.$emit('listenOpen');
    },
    // 连接钱包弹框
    handleWallOperate() {
      if (this.isConnectWallet) {
        this.showDisconnectMaks = true;
      } else {
        this.showConnectMaks = true;
      }
    },
    // 关闭钱包操作弹框
    handleDisWallOperate() {
      if (this.isConnectWallet) {
        this.showDisconnectMaks = false;
      } else {
        this.showConnectMaks = false;
      }
    },
    // 确认断开钱包连接
    handleConfirmDisconnect() {
      if (this.connectWalletType === '2') {
        this.killSession();
      }
      this.walletAddress = '';
      this.connectWalletType = '';
      this.isConnectWallet = false;
      this.showDisconnectMaks = false;
    },
    // 查询浏览器连接小狐狸钱包信息
    getConnectWallet() {
      let that = this;
      let connectTimeout = setTimeout(() => {
        const networkID = window.ethereum.networkVersion;
        if (networkID === settingConfig.chainID) {
          let address = window.ethereum.selectedAddress;
          if (!isStringEmpty(address)) {
            that.connectWalletType = '1';
            that.isConnectWallet = true;
            that.walletAddress = address;
            that.monitorWallectSwitched();
          }
        }
        clearTimeout(connectTimeout);
      }, 500);
    },
    // 主动触发metamske连接
    async handleMetamaskConnect() {
      let web3Provider;
      // if (!Web3.givenProvider) {
      //   this.$notify({ message: this.$t("message.alertMsg.MetaMaskPlugin"), duration: 2500, showClose: false, customClass: 'notifyClass' });
      //   return;
      // }
      if (typeof window.ethereum !== 'undefined') {
        web3Provider = window.ethereum;
      } else if (typeof window.web3 !== 'undefined') { // 老版 MetaMask Legacy dapp browsers...
        web3Provider = window.web3.currentProvider;
      }
      try {
        // 当窗口存在window.ethereum对象时候立刻进行Web3初始化
        //this.init_web3_contractObject(new Web3(web3Provider));
        const that = this;
        const networkID = window.ethereum.networkVersion;
        console.log("window ethereum network id = ", networkID);
        if (networkID === settingConfig.chainID) {
          const accounts = await web3Provider.request({ method: 'eth_requestAccounts' });
          console.log("用户授权连接钱包成功返回的地址 accounts = ", accounts[0]);
          if (networkID === settingConfig.chainID) {
            that.showConnectMaks = false;
            that.isConnectWallet = true;
            that.connectWalletType = '1';
            that.walletAddress = accounts[0];
            that.monitorWallectSwitched();
          }
        }
      } catch (error) { // 用户不授权时
        console.log("error", error);
      }
    },
    // 小狐狸钱包监听用户是否切换钱包或者网络
    monitorWallectSwitched() {
      //this.init_web3_contractObject(new Web3(window.ethereum));
      let that = this;
      ethereum.on("chainChanged", function(chainId) {
        const idNum = Web3.utils.hexToNumberString(chainId);
        if (idNum !== settingConfig.chainID) {// 判断网络ID是否跟配置的网络ID相等
          that.walletAddress = '';
          that.connectWalletType = '';
          that.isConnectWallet = false;
        } else { // 获取小狐狸当前登录钱包地址
          let address = window.ethereum.selectedAddress;
          if (!isStringEmpty(address)) {
            that.walletAddress = address;
            that.connectWalletType = '1';
            that.isConnectWallet = true;
          }
        }
      });
      // 监听如果更改账户，则重新登录
      ethereum.on("accountsChanged", function(accounts) {
        that.walletAddress = '';
        that.connectWalletType = '';
        that.isConnectWallet = false;
        console.log("账户发生修改,需要重新授权登录");
      });
      ethereum.on('disconnect', function(error) {
        that.walletAddress = '';
        that.connectWalletType = '';
        that.isConnectWallet = false;
        console.log("账户已经断开链接,需要重新授权登录");
      });
    },
    // wallectConnect连接
    async handleWalletConnect() {
      const that = this;
      const connector = new WalletConnect({ bridge: settingConfig.walletConnectBridge, qrcodeModal: QRCodeModal });
      that.walletConnector = connector;
      if (!connector.connected) {
        await connector.createSession();
      }
      that.subscribeToEvents();
    },
    // 添加事件订阅
    subscribeToEvents() {
      const connector = this.walletConnector;
      if (!connector) {
        return;
      }
      // 监听连接事件
      connector.on("connect", (error, payload) => {
        console.log(`connector.on("connect")`);
        if (error) {
          throw error;
        }
        const { chainId, accounts } = payload.params[0];
        this.onConnect(accounts, chainId);
      });
      // 监听更新事件
      connector.on("session_update", async (error, payload) => {
        console.log(`connector.on("session_update")`);
        if (error) {
          throw error;
        }
        const { chainId, accounts } = payload.params[0];
        this.onSessionUpdate(accounts, chainId);
      });
      // 监听断开事件
      connector.on("disconnect", (error, payload) => {
        console.log(`connector.on("disconnect")`);
        if (error) {
          throw error;
        }
        this.onDisconnect();
      });
      if (connector.connected) { // 判断是否是已经连接成功了
        const { chainId, accounts } = connector;
        const address = accounts[0];
        this.onSessionUpdate(accounts, chainId);
      }
      this.walletConnector = connector;
    },
    // 连接
    onConnect(accounts, chainId) {
      if (chainId !== parseInt(settingConfig.chainID)) {
        this.killSession();
        console.log(`请切换到${settingConfig.chainID}网络`);
        return;
      }
      this.showConnectMaks = false;
      this.isConnectWallet = true;
      this.connectWalletType = '2';
      this.walletAddress = accounts[0];
      // 保存wallectConnector作为全局对象
      contractObject.initGlobalWalletConenctor(this.walletConnector);
    },
    // 更新
    onSessionUpdate(accounts, chainId) {
      if (chainId !== parseInt(settingConfig.chainID)) {
        this.killSession();
        console.log(`请切换到${settingConfig.chainID}网络`);
        return;
      }
      this.showConnectMaks = false;
      this.isConnectWallet = true;
      this.connectWalletType = '2';
      this.walletAddress = accounts[0];
      // 保存wallectConnector作为全局对象
      contractObject.initGlobalWalletConenctor(this.walletConnector);
    },
    // 断开
    onDisconnect() {
      this.resetApp();
    },
    // 断开WalletConnect连接
    killSession() {
      const connector = this.walletConnector;
      if (connector) {
        connector.killSession();
      }
    },
    // 设置页面连接数据
    resetApp() {
      this.isConnectWallet = false;
      this.connectWalletType = '';
      this.walletAddress = '';
      // 保存wallectConnector作为全局对象
      contractObject.initGlobalWalletConenctor(null);
    },
    // 初始化合约对象并进行各种合约对象的初始化
    init_web3_contractObject() {
      contractObject.initWithContractObjec();
    },
    // 获取BUSD的余额
    async getCurrenAddressBUSDBalance() {
      const that = this;
      const dict = { address: this.walletAddress }
      try {
        const result = await this.$decentralized.getGAKABlanace(dict);
        that.busdBalance = chuDivision(result, 18);
        console.log('usdt的余额=', that.busdBalance);
      } catch (error) {
        //this.$notify({ message: error.message, duration: 2500, showClose: false, customClass: 'notifyClass' });
        console.log('Error message: ', error.message)
      }
    },
    // 获取ALAD余额
    async getCurrenAddressALADBalance() {
      const that = this;
      const dict = { address: this.walletAddress }
      try {
        const result = await this.$decentralized.getALADBlanace(dict);
        that.aladBalance = chuDivision(result, 18);
        that.$store.dispatch('wallet/setAladBalance', that.aladBalance);
        console.log('alad的余额=', that.aladBalance);
      } catch (error) {
        //this.$notify({ message: error.message, duration: 2500, showClose: false, customClass: 'notifyClass' });
        console.log('Error message: ', error.message)
      }
    },
    // 开启定时器
    openTimer() {
      let that = this;
      this.closeTimer();
      this.countdTimer = setInterval(() => {
        that.getCurrenAddressALADBalance();
        that.getCurrenAddressBUSDBalance();
      }, 6000);
    },
    // 关闭定时器
    closeTimer() {
      if (this.countdTimer) {
        clearInterval(this.countdTimer);
        this.countdTimer = null;
        console.log('关闭头部组件定时器');
      }
    },

  },
}
</script>

<style lang="scss" scoped>
.header {
  position: relative;
  height: 100%;
  user-select: none;
  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
  background-color: #303360;
  .content {
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: vw(30);
    padding-right: vw(30);
    .navLeft {
      display: flex;
      align-items: center;
      width: vw(160);
      height: vw(60);
      img {
        width: vw(40);
        height: vw(40);
        &:last-child {
          margin-left: vw(30);
          width: 100%;
          height: 100%;
        }
      }
    }
    .navRight {
      /* display: flex;
       align-items: center;
       img {
         width: vw(44);
         height: vw(44);
         margin-right: 20px;
         user-select: none;
         cursor: pointer;
       }*/
      .nr_right_dk {
        width: vw(240);
        height: vw(50);
        line-height: vw(50);
        font-size: vw(20);
        font-weight: bold;
        text-align: center;
        font-family: Ubuntu, sans-serif;
        box-sizing: border-box;
        cursor: pointer;
        user-select: none;
        color: var(--white);
        border-radius: vw(6.3);
        background-image: linear-gradient(to bottom, #a34fd4, #621091);
      }
      .nr_right_lj {
        padding: 0 vw(30);
        height: vw(50);
        line-height: vw(50);
        font-size: vw(22);
        font-family: navRight, sans-serif;
        font-weight: normal;
        text-align: center;
        border-radius: vw(10);
        box-sizing: border-box;
        cursor: pointer;
        user-select: none;
        color: var(--white);
        background-color: var(--bgc001);
        -webkit-tap-highlight-color: transparent;
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
    .connect {
      position: relative;
      width: vw(586);
      height: vw(372);
      border-radius: vw(20);
      background-color: #27273f;
      .m_c_title {
        margin-top: vw(34);
        line-height: normal;
        font-size: vw(32);
        font-family: PingFangSC, sans-serif;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        color: var(--white);
      }
      .m_c_line {
        width: vw(583);
        margin-top: vw(21.5);
        height: 0;
        border-bottom: 2px dashed #3d3d58;
      }
      .m_c_item {
        width: vw(522);
        height: vw(80);
        padding: 0 vw(30);
        margin: vw(39.5) auto 0;
        border-radius: vw(10);
        background-color: #343660;
        cursor: pointer;
        user-select: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        img {
          width: vw(48);
          height: vw(48);
        }
        span {
          line-height: vw(31);
          font-size: vw(28);
          font-weight: 500;
          font-family: PingFangSC, sans-serif;
          font-stretch: normal;
          font-style: normal;
          color: var(--white);
        }
      }
      .m_c_marginTop {
        margin-top: vw(30);
      }
      .mask_close {
        width: vw(44);
        height: vw(44);
        top: vw(35);
        right: vw(20);
        position: absolute;
        cursor: pointer;
      }
    }
    .disconnect {
      position: relative;
      width: vw(586);
      height: vw(505);
      border-radius: vw(20);
      background-color: #27273f;
      .m_dis_title {
        margin-top: vw(34);
        line-height: normal;
        font-size: vw(32);
        font-family: PingFangSC, sans-serif;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        color: var(--white);
      }
      .m_dis_line {
        width: 583px;
        margin-top: vw(21.5);
        height: 0;
        border-bottom: 2px dashed #3d3d58;
      }
      .m_dis_item {
        padding: 0 vw(25);
        margin: vw(29.5) auto 0;
        user-select: none;
        display: flex;
        span {
          min-width: vw(82);
          font-size: vw(28);
          font-weight: 500;
          font-family: PingFangSC, sans-serif;
          font-stretch: normal;
          font-style: normal;
          text-align: left;
          color: var(--white);
          &:last-child {
            word-break: break-all;
            text-align: left;
            margin-left: vw(36);
            font-weight: normal;
            color: #d0d0d0;
          }
        }
      }
      .m_dis_itemTop {
        margin-top: vw(33);
      }
      .m_dis_confirm {
        width: vw(400);
        height: vw(80);
        margin: vw(40) auto 0;
        font-size: vw(28);
        font-weight: 500;
        line-height: vw(80);
        cursor: pointer;
        user-select: none;
        font-family: PingFangSC, sans-serif;
        color: var(--white);
        box-sizing: border-box;
        background-size: contain;
        background-repeat: no-repeat;
        border-radius: vw(10);
        box-shadow: 0 0 vw(10) 0 rgba(123, 40, 219, 0.6);
        background-image: linear-gradient(84deg, #f109b4 -1%, #622fe3 102%);
      }
      .mask_close {
        width: vw(44);
        height: vw(44);
        top: vw(35);
        right: vw(20);
        position: absolute;
        cursor: pointer;
      }
    }
  }
}
.el-dropdown-item-img {
  width: vw(44);
  height: vw(44);
  user-select: none;
  cursor: pointer;
}

</style>
