<template>
  <div class="wish">
    <div class="w_container">
      <!--<div class="w_c_w_aladIcon"><img :src="require(`../../../assets/wish/icon_alad_${ isFinishWish ? 'select' : 'nomal'}.svg`)" alt=""></div>-->
      <div class="w_c_w_input">
        <input type="number" v-model="inputNumber" @keyup="changeInputStatus" :placeholder="placeholderDesc1 + ':' + getCustomerALADNumber(aladBalance)">
        <div @click="handleMaxAlad">{{ $t("message.smWish.desc11") }}</div>
      </div>
      <div class="w_c_w_btn" @click="handleWishSuccess">{{ wishBtnText }}</div>
      <div class="w_c_w_contianer">{{ $t("message.smWish.desc1") }}</div>
      <!--<div class="w_c_w_alad"><img src="../../../assets/wish/h5_wish_alad.svg" alt=""></div>-->
    </div>
    <!-- 支付成功的弹框 -->
    <div class="mask" v-show="wishSuccessMaks" @touchmove.prevent @mousewheel.prevent>
      <div class="m_success">
        <div class="m_b_title">{{ $t("message.smWish.desc3") }}</div>
        <div class="m_b_icon"><img src="../../../assets/newPhones/nWish/icon_wish_success.png" alt="log"></div>
        <div class="m_b_amount">
          <span>{{ $t("message.smWish.desc4") }}：</span>
          <span>{{ wishData.burnAmount | roundingDecimals(4) }}</span>
        </div>
        <div class="m_b_amount m_b_amount1">
          <span>{{ $t("message.smWish.desc5") }}：</span>
          <span>{{ wishData.frozenAmount | roundingDecimals(4) }}</span>
        </div>
        <img class="mask_close" src="../../../assets/newPhones/nLaboratory/icon_qb_close.svg" alt="logo" @click="hanleClickCloseMaks()">
      </div>
    </div>
    <!-- 提示弹框 -->
    <div class="mask" v-show="wishTipMaks" @touchmove.prevent @mousewheel.prevent>
      <div class="m_tipClose">
        <div class="m_t_title">{{ $t("message.smWish.desc13") }}</div>
        <div class="m_t_divLine"></div>
        <div class="m_t_desc">{{ $t("message.smWish.desc14") }}</div>
        <div class="m_t_goBack" @click="handleGoBackClick">
          <span>{{ $t("message.smWish.desc15") }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {getCustomerInfoData, getCustomerSatisfyWish} from "@/api/mark";
import {mapGetters} from 'vuex';
import {MaxUint256} from "@ethersproject/constants";
import {isStringEmpty} from '@/utils/validate';
import {keepFormatDecimalDecimalPlaces} from "@/utils/computing";

const settingConfig = require('../../../settings.js');

export default {
  name: "nWish",
  data() {
    return {
      isEnglish: false,
      wishTipMaks: false,
      isFinishWish: false,
      wishSuccessMaks: false,
      placeholderDesc1: this.$t("message.smWish.desc6"),
      aladApproveNum: 0, // 授权市场合约扣ALAD数量
      wishBtnText: '',// 许愿按钮文本
      inputNumber: '', // 输入框
      wishData: {
        burnAmount: 0,
        frozenAmount: 0,
      }
    };
  },
  created() {
    this.isEnglish = window.localStorage.getItem("lang") !== "zh";
    this.changeInputStatus();
    this.changeMakeWishBtnText();
    this.getALADAllowance();
    this.getCustomerInfoData();
  },
  mounted() {

  },
  destroyed() {

  },
  // 计算属性
  computed: {
    ...mapGetters(['isConnectWallet', 'walletAddress', 'connectWalletType', 'isBindSuperAddress', 'aladBalance']),
  },
  // 监听属性改变
  watch: {
    isConnectWallet(val, oval) {
      if (val) {
        this.getALADAllowance();
        this.getCustomerInfoData();
      }
    },
    // 监听语言的切换
    '$i18n.locale'(nval, oval) {
      this.isEnglish = nval !== 'zh';
      this.placeholderDesc1 = this.$t("message.smWish.desc6");
      this.changeMakeWishBtnText();
      console.log('监听到语言的切换');
    },
  },
  // 方法
  methods: {
    // 监听输入状态
    changeInputStatus() {
      this.isFinishWish = !isStringEmpty(this.inputNumber);
    },
    // 许愿按钮文本状态
    changeMakeWishBtnText() {
      let wishBtnText = this.$t("message.smWish.desc2");
      if (this.aladApproveNum === 0) {
        wishBtnText = this.$t("message.casting.Approve");
      } else if (this.aladApproveNum < parseFloat(this.inputNumber)) {
        wishBtnText = this.$t("message.casting.Approve");
      }
      this.wishBtnText = wishBtnText;
    },
    // 获取阿拉丁数据
    getCustomerALADNumber(aladBalance) {
      return keepFormatDecimalDecimalPlaces(aladBalance, 4);
    },
    // 获取用户是否绑定上级
    async getCustomerInfoData() {
      if (!this.isConnectWallet) {
        return;
      }
      const dict = {};
      dict['type'] = 1;
      dict['address'] = this.walletAddress;
      const that = this;
      const result = await getCustomerInfoData(dict);
      if (result.status === 200) {
        // 判断用户是否绑定了上级地址
        const data = result.data;
        const isBindSuperAddress = data.superadd !== "0x0000000000000000000000000000000000000000";
        // 将用户是否绑定上级地址进行存储
        that.$store.dispatch('wallet/setBindSuperAddress', isBindSuperAddress);
        console.log('获取绑定的上级地址', data.superadd);
      } else {
        this.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
      }
    },
    // 获取market_add合约可扣ALAD数量
    async getALADAllowance() {
      if (!this.isConnectWallet) {
        return;
      }
      try {
        const that = this;
        const result = await this.$decentralized.getCanBuckledALADAllowance(this.walletAddress);
        if (result) {
          that.aladApproveNum = parseFloat(result);
          that.changeMakeWishBtnText();
          console.log('市场合约可扣ALAD量=', that.aladApproveNum);
        }
      } catch (error) {
        console.log('Error message: ', error)
      }
    },
    // 授权market_add合约扣ALAD
    async approveALADContract() {
      if (!this.isConnectWallet) {
        return;
      }
      try {
        const that = this;
        this.$loading.showLoading();
        const result = await this.$decentralized.approveALADContract(this.walletAddress, this.connectWalletType);
        if (result) {
          that.$loading.hiddenLoading();
          that.aladApproveNum = parseFloat(MaxUint256.toString());
          that.changeMakeWishBtnText();
          console.log('授权市场合约扣ALADs数量=', that.aladApproveNum);
        }
      } catch (error) {
        this.$loading.hiddenLoading();
        this.$notify({ message: error.message, duration: 2500, showClose: false, customClass: 'notifyClass' });
        console.log('Error message: ', error)
      }
    },
    // 输入账号有的全部ALAD
    handleMaxAlad() {
      this.inputNumber = keepFormatDecimalDecimalPlaces(this.aladBalance, 4);
      this.changeInputStatus();
    },
    // 许愿
    async handleWishSuccess() {
      if (!this.isConnectWallet) {
        this.$notify({ message: this.$t("message.casting.connectWallet"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      } else if (this.aladApproveNum < parseFloat(this.inputNumber)) {
        this.approveALADContract();
        return;
      } else if (isStringEmpty(this.inputNumber) || this.inputNumber <= 0) {
        this.$notify({ message: this.$t("message.smWish.desc7"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      } else if (!this.isBindSuperAddress) {
        this.$notify({ message: this.$t("message.smWish.desc8"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      }
      // else if (checkAuditTime("14:29", "14:30")) {
      //   this.$notify({ message: this.$t("message.smWish.desc12"), duration: 2500, showClose: false, customClass: 'notifyClass' });
      //   return;
      // }
      try {
        const that = this;
        const result = await getCustomerSatisfyWish();
        if (result.status === 200) {
          if (result.data === 1) {
            that.$notify({ message: that.$t("message.smWish.desc12"), duration: 2500, showClose: false, customClass: 'notifyClass' });
            return;
          }
          this.$loading.showLoading();
          const dict = { address: this.walletAddress, amount: this.inputNumber };
          const result1 = await this.$decentralized.wishDepositToken(dict, this.connectWalletType);
          if (result1) {
            that.$loading.hiddenLoading();
            that.wishData.burnAmount = that.inputNumber;
            that.wishData.frozenAmount = that.inputNumber * 5;
            that.wishSuccessMaks = true;
          }
        }
      } catch (error) {
        this.$loading.hiddenLoading();
        this.$notify({ message: error.message, duration: 2500, showClose: false, customClass: 'notifyClass' });
        console.log('Error message: ', error)
      }
    },
    // 关闭弹框
    hanleClickCloseMaks() {
      this.inputNumber = '';
      this.wishData.burnAmount = 0;
      this.wishData.frozenAmount = 0;
      this.wishSuccessMaks = false;
    },
    // 复制
    handleClickCopy() {
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
        textArea.style.opacity = '0';
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
    // 返回
    handleGoBackClick() {
      this.$router.go(-1);
      /*const that = this;
      setTimeout(() => {
        that.$eventBus.$emit("goBackWish");
      },500);*/
    },
  },
}
</script>

<style lang="scss" scoped>
.wish {
  padding-top: 0.1px;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-image: url('../../../assets/newPhones/nWish/icon_wish_bg.png');
  .w_container {
    margin: vw(190) auto 0;
    padding: 0 vw(30);
    .w_c_w_input {
      display: flex;
      align-items: center;
      width: 100%;
      height: vw(100);
      border-radius: vw(10);
      border: solid 1px #4f5776;
      background-color: #1b1b33;
      input {
        flex: 1;
        width: 100%;
        height: 100%;
        padding-left: vw(33);
        border: 0; // 去除未选中状态边框
        outline: none; // 去除选中状态边框
        font-size: vw(26);
        text-align: left;
        font-family: Montserrat, sans-serif;
        font-weight: normal;
        box-sizing: border-box;
        background-color: transparent;
        color: var(--white);
      }
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
      }
      /* 火狐 */
      input[type="number"] {
        -moz-appearance: textfield;
      }
      input::-webkit-input-placeholder {
        color: #373752;
        font-size: vw(26);
      }
      input:-moz-placeholder {
        /* FF 4-18 */
        color: #373752;
        font-size: vw(26);
      }
      input::-moz-placeholder {
        /* FF 19+ */
        color: #373752;
        font-size: vw(26);
      }
      input:-ms-input-placeholder {
        /* IE 10+ */
        color: #373752;
        font-size: vw(26);
      }
      input:-webkit-autofill {
        transition: background-color 5000s ease-in-out 0s; //背景颜色
      }
      div {
        margin-left: vw(20);
        margin-right: vw(20);
        line-height: vw(30);
        font-size: vw(26);
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        user-select: none;
        cursor: pointer;
        font-family: Ubuntu, sans-serif;
        color: #ff953f;
      }
    }
    .w_c_w_btn {
      width: 100%;
      height: vw(100);
      margin-top: vw(26);
      line-height: vw(100);
      font-size: vw(32);
      font-weight: 600;
      cursor: pointer;
      user-select: none;
      box-sizing: border-box;
      font-stretch: normal;
      font-style: normal;
      color: #fff;
      font-family: PingFangSC, sans-serif;
      border-radius: vw(10);
      background-image: linear-gradient(94deg, #f109b4 -5%, #622fe3 107%);
    }
    .w_c_w_contianer {
      margin: vw(40) auto 0;
      line-height: vw(58);
      font-size: vw(42);
      font-weight: 900;
      text-align: center;
      font-family: AlibabaPuHuiTi, sans-serif;
      font-stretch: normal;
      font-style: normal;
      color: #ff953f;
      //box-sizing: border-box;
      //background-size: 100% 100%;
      //background-repeat: no-repeat;
      //background-image: url('../../../assets/wish/h5_icon_wish_bg.svg');
    }

    .w_c_w_aladIcon {
      width: vw(260);
      height: vw(226);
      margin: 0 auto;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .w_c_w_alad {
      width: 100%;
      height: vw(680);
      margin-top: vw(-100);
      img {
        width: 100%;
        height: 100%;
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
    .m_success {
      position: relative;
      width: vw(586);
      height: vw(566);
      border-radius: vw(20);
      background-color: #2e2f48;
      .m_b_title {
        margin-top: vw(25);
        line-height: vw(50);
        font-size: vw(30);
        font-family: PingFangSC, sans-serif;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        color: var(--white);
      }
      .m_b_icon {
        margin: vw(40) auto 0;
        width: vw(355);
        height: vw(250);
        img {
          width: 100%;
          height: 100%;
        }
      }
      .m_b_amount {
        margin: vw(72) vw(30) 0;
        span {
          line-height: vw(37);
          font-size: vw(22);
          font-weight: 500;
          word-break: normal;
          font-stretch: normal;
          font-style: normal;
          color: #fff;
          font-family: Poppins, sans-serif;
          &:last-child {
            color: var(--primary);
          }
        }
      }
      .m_b_amount1 {
        margin-top: vw(17);
      }
      .mask_close {
        width: vw(40);
        height: vw(40);
        top: vw(30);
        right: vw(30);
        position: absolute;
        cursor: pointer;
      }
    }
    .m_tipClose {
      width: vw(586);
      margin: 0 auto;
      padding: vw(26) vw(24) vw(50);
      border-radius: vw(20);
      background-color: var(--bgc03);
      .m_t_title {
        line-height: vw(42);
        font-size: vw(30);
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        text-align: center;
        font-family: Poppins, sans-serif;
        color: #fff;
      }
      .m_t_divLine {
        margin-top: vw(32);
        width: 100%;
        height: 1px;
        background-color: #707070;
      }
      .m_t_desc {
        margin-top: vw(40);
        line-height: vw(46);
        font-size: vw(26);
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        word-break: normal;
        text-align: center;
        font-family: Poppins, sans-serif;
        color: #b9b9b9;
      }
      .m_t_goBack {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: vw(60) auto 0;
        width: vw(400);
        height: vw(80);
        line-height: vw(80);
        font-size: vw(28);
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        font-family: PingFangSC,sans-serif;
        color: #fff;
        border-radius: vw(10);
        box-shadow: 0 0 10px 0 rgba(123, 40, 219, 0.6);
        background-image: linear-gradient(84deg, #f109b4 -1%, #622fe3 102%);
      }
    }
  }
}

</style>

