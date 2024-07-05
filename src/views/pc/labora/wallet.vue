<template>
  <div class="wallet">
    <div class="w_top">
      <div class="w_t_item">
        <span>ALAD {{ $t("message.wallet.Circulation") }}</span>
        <span>{{ walletData.cir | roundingDecimals(4) }} ｜ {{ walletData.ret }}%</span>
      </div>
      <div class="w_t_item">
        <span>{{ $t("message.wallet.freeze") }} $</span>
        <span>{{ walletData.freezePrice | roundingDecimals(4) }}</span>
      </div>
<!--      <div class="w_t_item">-->
<!--       <span>{{ $t("message.wallet.platformHold") }} </span>-->
<!--       <span>{{ walletData.platformAladValue | roundingDecimals(4) }}</span>-->
<!--     </div>-->
<!--     <div class="w_t_item">-->
<!--       <span>{{ $t("message.wallet.totalFreeze") }} </span>-->
<!--       <span>{{ walletData.platformGakaValue | roundingDecimals(4) }}</span>-->
<!--     </div>-->
    </div>
    <div class="w_bottom">
      <div class="w_b_title">{{ $t("message.wallet.BALANCE") }}</div>
      <div class="w_b_subTitle">
        <span>{{ $t("message.wallet.CurrencyName") }}</span>
        <span>{{ $t("message.wallet.FreezeQuantity") }}</span>
        <span>{{ $t("message.wallet.QuantityAvailable") }}</span>
        <span></span>
      </div>
      <div style="marginTop:15px;border:0.5px solid var(--bgc17)"></div>
      <div class="w_b_alad">
        <span>ALAD</span>
        <span>{{ walletData.frozen | roundingDecimals(4) }}</span>
        <span>{{ walletData.withdrawAmount | roundingDecimals(4) }}</span>
         <span @click="handleClickExtract(1)">{{ $t("message.wallet.Extract") }}</span>
      </div>
      <!--<div style="marginTop:5px;border:0.5px solid var(&#45;&#45;bgc17)"></div>
      <div class="w_b_alad">
        <span>GAKA</span>
        <span>{{ walletData.gaka | roundingDecimals(4) }}</span>
        <span></span>
        <span @click="handleClickExtract(2)"></span>
      </div>-->
    </div>
  </div>
</template>

<script>

const settingConfig = require('../../../settings.js');
import { mapGetters } from 'vuex';
import { isStringEmpty } from '@/utils/validate';
import { chuDivision } from '@/utils/computing';
import { getCustomerWalletList } from '@/api/mark'
import BigNumber from '../../../decentralizedApi/bignumber.js'

export default {
  name: "wallet",
  data() {
    return {
      countdTimer:null, // 定时器
      walletData:{
        sell:0,
        buy:0,
        frozen:0,
        pending:0,
        gaka:0,
        cir:0,
        ret:0,
        freezePrice:0, // 冻结价值
        withdrawAmount:0,
        platformAladValue:0,
        platformGakaValue:0,
      },
    };
  },
  created() {
    this.getALADExtractAmount();
    this.getALADCirculation();
    this.getCustomerWalletList();
    console.log('hold page create');
  },
  mounted() {

  },
  destroyed() {

  },
  // 计算属性
  computed: {
    ...mapGetters(['isConnectWallet','walletAddress','connectWalletType']),
  },
  // 监听属性改变
  watch:{
    isConnectWallet(val,oval) {
      if (val) {
        this.openTimer();
      }else {
        this.closeTimer();
        this.walletData = {sell:0,buy:0,frozen:0,pending:0,gaka:0,cir:0,ret:0,freezePrice:0,withdrawAmount:0,platformAladValue:0,platformGakaValue:0}
      }
    }
  },
  // 方法
  methods: {
    // 获取钱包数据
    async getCustomerWalletList() {
     if(!this.isConnectWallet){
        return;
      }
      const that = this;
      const dict = {address:this.walletAddress};
      const result = await getCustomerWalletList(dict);
      if (result.status === 200) {
        that.walletData.platformAladValue =  isStringEmpty(result.data.platformAladValue) ? 0 : result.data.platformAladValue;
        that.walletData.platformGakaValue =  isStringEmpty(result.data.platformGakaValue) ? 0 : result.data.platformGakaValue;
        that.walletData.sell =  isStringEmpty(result.data.sell) ? 0 : result.data.sell;
        that.walletData.buy = isStringEmpty(result.data.buy) ? 0 : result.data.buy;
        that.walletData.gaka = isStringEmpty(result.data.gaka) ? 0 : result.data.gaka;
      }else {
        that.$notify({message: result.data,duration: 2500,showClose:false,customClass:'notifyClass'});
      }
      console.log('钱包数据',result);
    },
    // 获取ALAD的可提取量
    async getALADExtractAmount() {
      if(!this.isConnectWallet){
        return;
      }
      try {
        const that = this;
        const dict = {};
        dict['address'] = this.walletAddress;
        const result = await this.$decentralized.getALADExtractBlanace(dict);
        const ocToUsdtData = await this.$decentralized.getNeedUSDTWithALAD();
        const msUtils = Math.pow(10,18);
        const ret = new BigNumber(ocToUsdtData[1]);
        if(result) {
          that.walletData.withdrawAmount = chuDivision(result._pendingAmount,18);
          that.walletData.frozen = chuDivision(result._freeze,18);
          that.walletData.freezePrice = (parseFloat(that.walletData.frozen) / parseFloat(ret.dividedBy(msUtils))).toFixed(4);
        }
      } catch (error) {
        this.$notify({message: error.message,duration: 2500,showClose:false,customClass:'notifyClass'});
        console.log('Error message: ', error)
      }
    },
    // 获取ALAD的流通量
    async getALADCirculation() {
      if(!this.isConnectWallet){
        return;
      }
      try {
        const that = this;
        const result = await this.$decentralized.aladCirculation();
        if(result) {
          that.walletData.cir = chuDivision(result.cir,18);
          that.walletData.ret = result.ret / 100;
        }
      } catch (error) {
        this.$notify({message: error.message,duration: 2500,showClose:false,customClass:'notifyClass'});
        console.log('Error message: ', error)
      }
    },
    // 提取
    async handleClickExtract(index) {
      if (index == 1) {
        console.log('this.withdrawAmount',this.withdrawAmount);
        if(!this.isConnectWallet){
          return;
        } else if (parseFloat(this.withdrawAmount) <= 0) {
           this.$notify({message: this.$t("message.wallet.avaliableMsg"),duration: 2500,showClose:false,customClass:'notifyClass'});
           return;
        }
        try {
          const that = this;
          const dict = {address:that.walletAddress};
          that.$loading.showLoading();
          const result = await that.$decentralized.aladWidth(dict,that.connectWalletType);
          if (result) {
             that.$loading.hiddenLoading();
          }
        } catch (error) {
          that.$loading.hiddenLoading();
          this.$notify({message: error.message,duration: 2500,showClose:false,customClass:'notifyClass'});
          console.log('Error message: ', error)
        }
        console.log('extract alad');
      }
    },
    // 开启定时器
   openTimer(){
      let that = this;
      this.closeTimer();
      this.countdTimer = setInterval(() => {
        that.getALADCirculation();
        that.getCustomerWalletList();
        that.getALADExtractAmount();
      }, 2000);
    },
    // 关闭定时器
    closeTimer(){
      if(this.countdTimer){
        clearInterval(this.countdTimer);
        this.countdTimer = null;
        console.log('关闭头部组件定时器');
      }
    },
  },
};
</script>

<style lang="scss" scoped>

.wallet {
  max-width: 1200px;
  height: 700px;
  padding-top: 0.1px;
  margin: 0px auto;
  .w_top {
    height: 125px;
    margin: 50px auto 0px;
    display: flex;
    justify-content: space-between;
    .w_t_item {
      width: 580px;
      height: 100%;
      border-radius: 2px;
      border: solid 1.5px var(--bgc17);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      span {
        padding: 0 30px;
        line-height: 29px;
        font-size: 16px;
        font-weight: 600;
        word-break: normal;
        font-family: Poppins;
        font-stretch: normal;
        font-style: normal;
        user-select: none;
        color: var(--white);
        &:last-child {
          color: var(--bgc18);
        }
      }
    }
  }
  .w_bottom {
    height: 253px;
    margin: 65px auto 0px;
    border-radius: 2px;
    border: solid 1.5px var(--bgc17);
    box-sizing: border-box;
    .w_b_title {
      margin-top: 28px;
      line-height: 60px;
      font-size: 36px;
      font-weight: 600;
      text-align: center;
      font-family: Poppins;
      font-stretch: normal;
      font-style: normal;
      user-select: none;
      color: var(--white);
    }
    .w_b_subTitle {
      margin-top: 20px;
      display: flex;
      span {
        flex: 1;
        line-height: 29px;
        font-size: 18px;
        font-weight: 600;
        font-family: Poppins;
        font-stretch: normal;
        font-style: normal;
        user-select: none;
        color: var(--white);
      }
    }
    .w_b_line {
      width: 100%;
      height: 1px;
      margin-top: 20px;
      background-color: var(--bgc17);
    }
    .w_b_alad {
      height: 87px;
      display: flex;
      align-items: center;
      span {
        flex: 1;
        line-height: 37px;
        font-size: 20px;
        font-weight: 600;
        font-family: Poppins;
        font-stretch: normal;
        font-style: normal;
        user-select: none;
        color: var(--bgc18);
        &:last-child {
          color: var(--white);
          cursor: pointer;
          text-decoration: underline;
          text-decoration-color: var(--white);
          text-decoration-style: solid;
          text-underline-offset: 2px;
        }
      }

    }
  }
}

</style>
