<template>
  <div class="wish">
    <div class="w_container">
      <div class="w_c_w_contianer">
        <div>{{ $t("message.smWish.desc9") }}</div>
        <div>{{ $t("message.smWish.desc10") }}</div>
      </div>
      <div class="w_c_alador"><img src="../../../assets/wish/icon_w_alader.png" alt=""></div>
      <div class="w_c_wrap">
        <div class="w_c_w_aladIcon"><img :src="require(`../../../assets/wish/icon_alad_${ isFinishWish ? 'select' : 'nomal'}.png`)" alt=""></div>
        <div class="w_c_w_input">
          <input type="number" v-model="inputNumber" @keyup="changeInputStatus" :placeholder="placeholderDesc1 + ':' + getCustomerALADNumber(aladBalance)">
          <div @click="handleMaxAlad">{{ $t("message.smWish.desc11") }}</div>
        </div>
        <div class="w_c_w_btn" @click="handleWishSuccess">{{ wishBtnText }}</div>
      </div>
    </div>
    <!--<div class="w_info">
      <img class="n_i_icon" src="../../../assets/nfts/icon_info_right.svg" alt="logo">
      <div class="m_c_copy">
        <span>{{ $t("message.market.desc1") }}</span>
        <span>{{ $t("message.market.desc2") }}</span>
        <span>{{ $t("message.market.desc3") }}</span>
        <div class="m_c_c_bottom">
          <span>aladdinmeta@gmail.com</span>
          <div @click="handleClickCopy">{{ $t("message.market.copy") }}</div>
        </div>
      </div>
    </div>-->
    <div class="w_footer"> © 2022 COMPASS Club. All rights reserved. </div>
    <!-- 支付成功的弹框 -->
    <div class="mask" v-show="wishSuccessMaks" @touchmove.prevent @mousewheel.prevent>
      <div class="m_success">
        <div class="m_b_title">{{ $t("message.smWish.desc2") }}</div>
        <div class="m_b_line"></div>
        <div class="m_b_icon"><img src="../../../assets/wish/icon_wish_success.png" alt="log"></div>
        <div class="m_b_amount">
          <span>{{ $t("message.smWish.desc4") }}：</span>
          <span>{{ wishData.burnAmount | roundingDecimals(4) }}</span>
        </div>
        <div class="m_b_amount m_b_amount1">
          <span>{{ $t("message.smWish.desc5") }}：</span>
          <span>{{ wishData.frozenAmount | roundingDecimals(4) }}</span>
        </div>
        <img class="mask_close" src="../../../assets/universal/icon_qb_close.svg" alt="logo" @click="hanleClickCloseMaks()">
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
          <img src="../../../assets/nfts/icon_n_go.svg" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {getCustomerInfoData, getCustomerSatisfyWish} from "@/api/mark";
const settingConfig = require('../../../settings.js');
import { mapGetters } from 'vuex';
import { MaxUint256 } from "@ethersproject/constants";
import { isStringEmpty } from '@/utils/validate';
import { keepFormatDecimalDecimalPlaces,checkAuditTime } from "@/utils/computing";

export default {
  name: "wish",
  data() {
    return {
      isEnglish:false,
      wishTipMaks:false,
      isFinishWish:false,
      wishSuccessMaks:false,
      placeholderDesc1: this.$t("message.smWish.desc6"),
      aladApproveNum:0, // 授权市场合约扣ALAD数量
      wishBtnText:'',// 许愿按钮文本
      inputNumber:'', // 输入框
      wishData: {
        burnAmount:0,
        frozenAmount:0,
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
    ...mapGetters(['isConnectWallet','walletAddress','connectWalletType','isBindSuperAddress','aladBalance']),
  },
  // 监听属性改变
  watch:{
    isConnectWallet(val,oval) {
      if (val) {
        this.getALADAllowance();
        this.getCustomerInfoData();
      }
    },
    // 监听语言的切换
    '$i18n.locale'(nval,oval) {
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
      if(this.aladApproveNum === 0) {
        wishBtnText = this.$t("message.casting.Approve");
      }else if(this.aladApproveNum < parseFloat(this.inputNumber)) {
        wishBtnText = this.$t("message.casting.Approve");
      }
      this.wishBtnText = wishBtnText;
    },
    // 获取阿拉丁数据
    getCustomerALADNumber(aladBalance) {
      return keepFormatDecimalDecimalPlaces(aladBalance,4);
    },
    // 获取用户是否绑定上级
    async getCustomerInfoData() {
      if(!this.isConnectWallet){
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
        that.$store.dispatch('wallet/setBindSuperAddress',isBindSuperAddress);
        console.log('获取绑定的上级地址',data.superadd);
      }else {
        this.$notify({message: result.data,duration: 2500,showClose:false,customClass:'notifyClass'});
      }
    },
    // 获取market_add合约可扣ALAD数量
    async getALADAllowance() {
      if(!this.isConnectWallet){
        return;
      }
      try {
        const that = this;
        const result = await this.$decentralized.getCanBuckledALADAllowance(this.walletAddress);
        if(result) {
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
      if(!this.isConnectWallet){
        return;
      }
      try {
        const that = this;
        this.$loading.showLoading();
        const result = await this.$decentralized.approveALADContract(this.walletAddress,this.connectWalletType);
        if(result) {
          that.$loading.hiddenLoading();
          that.aladApproveNum = parseFloat(MaxUint256.toString());
          that.changeMakeWishBtnText();
          console.log('授权市场合约扣ALADs数量=',that.aladApproveNum);
        }
      } catch (error) {
        this.$loading.hiddenLoading();
        this.$notify({message: error.message,duration: 2500,showClose:false,customClass:'notifyClass'});
        console.log('Error message: ', error)
      }
    },
    // 输入账号有的全部ALAD
    handleMaxAlad() {
      this.inputNumber = keepFormatDecimalDecimalPlaces(this.aladBalance,4);
      this.changeInputStatus();
    },
    // 许愿
    async handleWishSuccess() {
      if (!this.isConnectWallet) {
        this.$notify({message: this.$t("message.casting.connectWallet"),duration: 2500,showClose:false,customClass:'notifyClass'});
        return;
      } else  if (this.aladApproveNum < parseFloat(this.inputNumber)) {
        this.approveALADContract();
        return;
      } else if(isStringEmpty(this.inputNumber) || this.inputNumber <= 0) {
        this.$notify({message: this.$t("message.smWish.desc7"),duration: 2500,showClose:false,customClass:'notifyClass'});
        return;
      }else  if (!this.isBindSuperAddress) {
        this.$notify({message: this.$t("message.smWish.desc8"),duration: 2500,showClose:false,customClass:'notifyClass'});
        return;
      }
      // else  if (checkAuditTime("14:29", "14:30")) {
      //   this.$notify({message: this.$t("message.smWish.desc12"),duration: 2500,showClose:false,customClass:'notifyClass'});
      //   return;
      // }
      try {
        const that = this;
        const result = await getCustomerSatisfyWish();
        if(result.status === 200) {
          if (result.data === 1) {
            that.$notify({message: that.$t("message.smWish.desc12"),duration: 2500,showClose:false,customClass:'notifyClass'});
            return;
          }
          this.$loading.showLoading();
          const dict = {address:this.walletAddress,amount:this.inputNumber};
          const result1 = await this.$decentralized.wishDepositToken(dict,this.connectWalletType);
          if(result1) {
            that.$loading.hiddenLoading();
            that.wishData.burnAmount =  that.inputNumber;
            that.wishData.frozenAmount =  that.inputNumber * 5;
            that.wishSuccessMaks = true;
          }
        }
      } catch (error) {
        this.$loading.hiddenLoading();
        this.$notify({message: error.message,duration: 2500,showClose:false,customClass:'notifyClass'});
        console.log('Error message: ', error)
      }
    },
    // 关闭弹框
    hanleClickCloseMaks() {
      this.inputNumber = '';
      this.wishData.burnAmount = 0;
      this.wishData.frozenAmount =  0;
      this.wishSuccessMaks = false;
    },
    // 复制
    handleClickCopy() {
      let copyText = 'aladdinmeta@gmail.com';
      // navigator clipboard 需要https等安全上下文
      if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard 向剪贴板写文本
        navigator.clipboard.writeText(copyText);
        this.$notify({message: this.$t("message.alertMsg.copySuccess"),duration: 3000,showClose:false,customClass:'notifyClass'});
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
        this.$notify({message: this.$t("message.alertMsg.copySuccess"),duration: 3000,showClose:false,customClass:'notifyClass'});
        document.body.removeChild(textArea);
      }
    },
    // 返回
    handleGoBackClick() {
      this.$router.go(-1);
    },
  },
}
</script>

<style lang="scss" scoped>
.wish {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  box-sizing: border-box;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: top;
  background-image: url('../../../assets/wish/icon_wish_bg.png');
  .w_container {
    position: relative;
    margin: 0 auto;
    padding-top: 0.1px;
    width: 1200px;
    .w_c_w_contianer {
      margin: 106px auto 0;
      div {
        line-height: 55px;
        font-size: 40px;
        font-weight: 900;
        text-align: center;
        word-break: normal;
        font-family: AlibabaPuHuiTi,sans-serif;
        font-stretch: normal;
        font-style: normal;
        color: #ff953f;
      }
    }
    .w_c_alador {
      position: absolute;
      top: 174px;
      left: 80px;
      img {
        width: 580px;
        height: 710px;
      }
    }
    .w_c_wrap {
      position: absolute;
      top: 180px;
      right: 120px;
      width: 400px;
      .w_c_w_aladIcon img {
        width: 215px;
        height: 174px;
      }
      .w_c_w_input {
        display: flex;
        align-items: center;
        width: 400px;
        height: 50px;
        margin: 30px 0 0 auto;
        border-radius: 4px;
        border: solid 1px #4f5776;
        background-color: #1b1b33;
        input {
          padding-left: 10px;
          width: 85%;
          height: 100%;
          border: 0; // 去除未选中状态边框
          outline: none; // 去除选中状态边框
          font-size: 16px;
          font-family: Montserrat,sans-serif;
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
          color: #666;
          font-size: 14px;
        }
        input:-moz-placeholder {
          /* FF 4-18 */
          color: #666;
          font-size: 14px;
        }
        input::-moz-placeholder {
          /* FF 19+ */
          color: #666;
          font-size: 14px;
        }
        input:-ms-input-placeholder {
          /* IE 10+ */
          color: #666;
          font-size: 14px;
        }
        input:-webkit-autofill {
          transition: background-color 5000s ease-in-out 0s; //背景颜色
        }
        div {
          margin-left: 10px;
          margin-right: 10px;
          line-height: 20px;
          font-size: 14px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          user-select: none;
          cursor: pointer;
          font-family: Ubuntu,sans-serif;
          color: #ff953f;
        }
      }
      .w_c_w_btn {
        width: 400px;
        height: 50px;
        margin: 20px 0 0 auto;
        line-height: 50px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        user-select: none;
        box-sizing: border-box;
        font-stretch: normal;
        font-style: normal;
        color: #fff;
        font-family: Poppins,sans-serif;
        border-radius: 10px;
        background-image: linear-gradient(92deg, #f109b4 -4%, #622fe3 100%);
      }
    }
  }
  .w_footer {
      margin-top: auto;
      height: 108px;
      line-height: 108px;
      font-size: 16px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      font-family: "PingFang SC",sans-serif;
      background-size: cover;
      background-repeat: no-repeat;
      background-image: url('../../../assets/wish/icon_n_footer_bg.svg');
      color: var(--white);
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
      position:relative;
      width: 500px;
      height: 340px;
      border-radius: 20px;
      background-color: #2e2f48;
      .m_b_title {
        margin-top: 16px;
        line-height: 28px;
        font-size: 20px;
        font-family: "PingFang SC",sans-serif;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        color: var(--white);
      }
      .m_b_line {
        margin-top: 15px;
        width: 100%;
        height: 0;
        border-bottom: dashed 1px #707070;
      }
      .m_b_icon {
        margin: 19px auto 0;
        width: 220px;
        height: 154px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .m_b_amount {
        margin: 20px auto 0;
        span {
          line-height: 22px;
          font-size: 16px;
          font-weight: 500;
          font-stretch: normal;
          font-style: normal;
          color: #fff;
          font-family: Poppins,sans-serif;
          &:last-child {
            color:#ff953f;;
          }
        }
      }
      .m_b_amount1 {
        margin-top: 10px;
      }
      .mask_close {
        width: 24px;
        height: 24px;
        top: 20px;
        right: 20px;
        position: absolute;
        cursor: pointer;
      }
    }
    .m_tipClose {
      width: 480px;
      margin: 0 auto;
      padding: 30px 40px 42px;
      border-radius: 20px;
      background-color: var(--bgc03);
      .m_t_title {
        line-height: 33px;
        font-size: 24px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        text-align: center;
        font-family: Poppins,sans-serif;
        color: #fff;
      }
      .m_t_divLine {
        margin-top: 34px;
        width: 100%;
        height: 1px;
        background-color: #707070;
      }
      .m_t_desc {
        margin-top: 30px;
        line-height: 40px;
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        word-break: normal;
        text-align: center;
        font-family: Poppins,sans-serif;
        color: #b9b9b9;
      }
      .m_t_goBack {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 30px auto 0;
        width: 245px;
        height: 48px;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        //background-image: url('../../../assets/wish/icon_goback_bg.svg');
        span {
          line-height: 22px;
          font-size: 16px;
          font-weight: 500;
          font-stretch: normal;
          font-style: normal;
          font-family: Poppins;
          color: #fff;
        }
        img {
          width: 22px;
          height: 22px;
          margin-left: 20px;
        }
      }
    }
  }
}

</style>
