<template>
  <div class="nLp">
    <div class="n_market_top"></div>
    <div class="n_market_content">
      <div class="h_c_top">
        <div class="h_c_title">{{ $t('message.mallSideBar.soonText6') }}</div>
        <div class="h_c_store" @click="handleApplyStore">
          <img :src="require('../../../assets/newPhones/nLpMining/icon_m_'+(shopStatus+1)+'.svg')" alt="">
          <span :style="{color: colorText[shopStatus]}">{{ shopStatusText[shopStatus] }}</span>
        </div>
      </div>
      <div class="lp" :style="{backgroundImage:selectedIndex<3?'url('+require('../../../assets/newPhones/nLpMining/icon_m_bg.svg')+')':''}">
        <!--<div class="m_dis_title">{{ $t("message.smOption.LPMining") }}</div>-->
        <div class="m_dis_tab">
          <div v-for="index in 5" class="m_dis_tab_item" @click="handleClickTab(index)">
            <img
              :src="require('../../../assets/newPhones/nLpMining/img_lp_'+index+(selectedIndex===index?'_xz':'')+'.png')"
              alt="image">
            <span :style="{color:selectedIndex===index?'#ff8c2f':'#ffffff'}">{{
                $t("message.smOption.tabName" + index)
              }}</span>
          </div>
        </div>
        <div class="m_dis_pledge">{{ $t("message.smOption.TotalValue") }}(USDT) ≈
          ${{ isConnectWallet ? lpData.platformToUSDT : '--' }}
        </div>
        <div class="m_dis_coin">
          <img src="../../../assets/laboras/icon_lp_hh.svg" alt="logo">
          <span>BUSD/ALAD</span>
        </div>
        <div class="m_dis_line"></div>
        <div class="m_dis_content">
          <div class="m_dis_apr">
            <span>{{ isConnectWallet ? `${lpData.lpARP}%` : '--' }}</span>
            <span>{{ $t("message.smOption.APR") }}</span>
          </div>
          <div class="m_dis_apr">
            <span>ALAD</span>
            <span>{{ $t("message.smOption.Earn") }}</span>
          </div>
        </div>
        <div class="m_dis_bottom">
          <div class="m_dis_left">
            <div class="m_dis_text">
              <span>{{ $t("message.smOption.Harvests") }}(ALAD)</span>
              <span>{{ isConnectWallet ? lpData.userWithdrawNum : '--' }}</span>
            </div>
            <div class="m_dis_text">
              <span>{{ $t("message.smOption.Staked") }}(LP)</span>
              <span> {{ isConnectWallet ? lpData.userStakeNum : '--' }}</span>
            </div>
            <div class="m_dis_text" v-if="selectedIndex>2">
              <span>{{ $t("message.smOption.Completed") }}</span>
              <span> {{ isConnectWallet ? lpData.userCompletedNum : '--' }}</span>
            </div>
            <div class="m_dis_text">
              <span>{{ $t("message.smOption.LPStakeWorth") }}$</span>
              <span> {{ isConnectWallet ? lpData.userStakeToUSDT : '--' }}</span>
            </div>
          </div>
          <div class="m_dis_right">
            <div class="m_dis_button" @click="handleHarvestPotionResponse">
              <span>{{ inputRightOptionalStatu(1) }}</span>
              <!--<img src="../../../assets/laboras/icon_lp_bt_go.svg" alt="logo">-->
            </div>
            <div class="m_dis_button" @click="handleLPStakedResponse">
              <span>{{ inputRightOptionalStatu(3) }}</span>
              <!--<img src="../../../assets/laboras/icon_lp_bt_go.svg" alt="logo">-->
            </div>
            <div class="m_dis_button" @click="handleHarvestLPStake">
              <span>{{ inputRightOptionalStatu(2) }}</span>
              <!--<img src="../../../assets/laboras/icon_lp_bt_go.svg" alt="logo">-->
            </div>
          </div>
        </div>
        <div class="lp_record" v-if="selectedIndex>2">
          <div class="lp_record_title">{{ $t('message.smOption.pledgeList') }}</div>
          <div class="lp_record_list_title">
            <div class="lp_record_list_title_left">{{ $t('message.smOption.StakeAmountLP') }}</div>
            <div class="lp_record_list_title_right">{{ $t('message.smOption.NumberOfRemainingBlocks') }}</div>
          </div>
          <div class="lp_record_list">
            <div class="lp_record_list_item" v-for="(item,index) in recordList" :key="index">
              <div class="lp_record_list_item_left">{{ item.amount }}</div>
              <div class="lp_record_list_item_right">{{ item.blockNumber }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 质押功能 -->
    <div class="mask" v-show="showStakeMaks" @touchmove.prevent @mousewheel.prevent>
      <div class="markContent">
        <div class="mark_title">{{ $t("message.smOption.StakeLP") }}</div>
        <div class="left_line">-</div>
        <div class="mark_state">
          <div class="mark_state_topCell">
            <span>{{ $t("message.smOption.Input") }}</span>
            <span>{{ $t("message.smOption.Balance") }}:{{ lpBalace }}</span>
          </div>
          <div class="mark_state_bottomCell">
            <input type="number" v-model="stakeLPInputNum" @keyup="chageStakeBtnTextMsg" placeholder="0.00">
            <div class="mark_bottomCell_right">
              <div class="mark_max" @click="handleStateMaxCoin()">{{ $t("message.smOption.MAXs") }}</div>
              <div class="mark_type">
                <!-- <img src="../../assets/images/frams/f_icon_bnb.png" alt="logo"> -->
                <span>BUSD/ALAD</span>
              </div>
            </div>
          </div>
        </div>
        <div class="left_line">-</div>
        <div class="mark_liquidity" @click="handleAddLiquidityStake">{{ $t("message.smOption.LiquidityStake") }}</div>
        <div class="mark_btn" @click="handleConfirmStateCoin">{{ stakeBtnText }}</div>
        <!--        <div class="mark_harvest">-->
        <!--          <div class="mark_withdraw">-->
        <!--            <span class="Withdraw-LP-000">{{ $t("message.smOption.WithdrawLP") }} (<span>{{ lpData.userStakeNum }}</span>)</span>-->
        <!--          </div>-->
        <!--          <div class="mark_harvestBtn" @click="handleHarvestLPStake">{{ $t("message.smOption.Harvest") }}</div>-->
        <!--        </div>-->
        <img class="markClose" src="../../../assets/universal/icon_qb_close.svg" alt="logo" @click="handleCloseMask">
      </div>
    </div>
    <!-- 是否上架 -->
    <div class="mask" v-show="showSaleToMarketMaks" @touchmove.prevent @mousewheel.prevent>
      <div class="m_sale">
        <div class="m_s_desc">{{ $t("message.smOption.ApplyStoreMsg") }}?</div>
        <div class="m_s_btn">
          <div @click="showSaleToMarketMaks=!showSaleToMarketMaks">{{ $t("message.stock.No") }}</div>
          <div @click="handleClickApply">{{ $t("message.stock.Yes") }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {mapGetters} from 'vuex';
import settingConfig from '@/settings'
import {isStringEmpty} from '@/utils/validate'
import {applySeller, checkWithdraw, getCustomerInfoData, getShopStatus} from "@/api/mark";
import {chuDivision, keepAFewDecimalPlaces, keepFormatDecimalDecimalPlaces} from "@/utils/computing";
import {MaxUint256} from "@ethersproject/constants";

export default {
  name: "nLpMining",
  data() {
    return {
      recordList: [],
      selectedIndex: 1,
      isEnglish: false,
      showStakeMaks: false,
      countdTimer: null, // 定时器
      stakeBtnText: '', // 质押按钮文本状态
      lpBalace: 0, // lp的余额
      stakeLPInputNum: '', // 质押LP输入框输入的数量
      lpChefContractApporveNum: 0, // LPErc20合约授权地址
      lpData: {
        platformToUSDT: 0,
        userStakeToUSDT: 0,
        lpARP: 0,
        userWithdrawNum: 0,
        userStakeNum: 0,
        userCompletedNum: 0,
      },
      shopStatusText: [this.$t("message.smOption.ApplyStore0"), this.$t("message.smOption.ApplyStore1"), this.$t("message.smOption.ApplyStore2"), this.$t("message.smOption.ApplyStore3")],
      colorText: ['#898989', '#ffffff', '#ff953f', '#ff000000'],
      shopStatus: 0,
      // 是否上架待上架的NFT
      showSaleToMarketMaks: false,
    };
  },
  created() {
    this.isEnglish = window.localStorage.getItem("lang") !== "zh";
    this.getChefAllowance();
    this.getLPBalance();
    this.getPoolInfo();
    this.getPageInfo();
    this.getShopStatus();
    if (this.isConnectWallet) {
      this.openTimer();
    }
  },
  mounted() {

  },
  destroyed() {
    this.closeTimer();
  },
  // 计算属性
  computed: {
    ...mapGetters(['isConnectWallet', 'walletAddress', 'isBindSuperAddress', 'connectWalletType']),
  },
  // 监听属性改变
  watch: {
    // 监听语言的切换
    '$i18n.locale'(val, oval) {
      this.isEnglish = val !== 'zh';
      this.shopStatusText = [this.$t("message.smOption.ApplyStore0"), this.$t("message.smOption.ApplyStore1"), this.$t("message.smOption.ApplyStore2"), this.$t("message.smOption.ApplyStore3")];
    },
    isConnectWallet(val, oval) {
      if (!val) {
        this.closeTimer();
      } else {
        this.getChefAllowance();
        this.getLPBalance();
        this.getPoolInfo();
        this.getPageInfo();
        this.getShopStatus();
        this.openTimer();
      }
    },
  },
  // 方法
  methods: {
    async handleClickApply() {
      if (!this.isConnectWallet)
        return
      const dict = {};
      dict['address'] = this.walletAddress;
      let result = await applySeller(dict);
      if (result.status === 200) {
        this.getShopStatus();
        this.showSaleToMarketMaks = false;
      } else {
        this.$notify({
          message: result.data,
          duration: 2500,
          showClose: false,
          customClass: 'notifyClass'
        });
      }
      console.log('applySeller =', result, dict)
    },
    handleClickTab(index) {
      if (this.selectedIndex === index)
        return
      this.selectedIndex = index;
      this.getChefAllowance();
      this.getLPBalance();
      this.getPoolInfo();
      this.getPageInfo();
      if (this.isConnectWallet) {
        this.openTimer();
      }
    },
    async getShopStatus() {
      if (!this.isConnectWallet)
        return
      try {
        let amount = await this.$decentralized.getUserDepositAmount(this.walletAddress);
        const dict = {};
        dict['address'] = this.walletAddress;
        dict['amount'] = chuDivision(amount, 18);
        let result = await getShopStatus(dict);
        if (result.status === 200) {
          this.shopStatus = parseInt(result.data)
        }
      } catch (e) {
        console.log('error =', e.message)
      }
    },
    //
    async handleApplyStore() {
      if (this.shopStatus === 1) {
        this.showSaleToMarketMaks = true;
      }
    },
    // 设置按钮状态
    inputRightOptionalStatu(type) {
      let msgText;
      if (!this.isConnectWallet) {
        msgText = this.$t("message.casting.Connect");
      } else {
        if (type === 1) {
          msgText = this.$t("message.smOption.Harvest");
        } else if (type === 2) {
          msgText = this.$t("message.smOption.WithdrawLP");
        } else if (type === 3) {
          msgText = this.$t("message.smOption.LPStakeds");
        }
      }
      return msgText;
    },
    // 设置质押按钮的状态
    chageStakeBtnTextMsg() {
      let msgText;
      if (this.lpChefContractApporveNum === 0) {
        msgText = this.$t("message.smOption.Approve");
      } else if (parseInt(this.stakeLPInputNum) > this.lpChefContractApporveNum) {
        msgText = this.$t("message.smOption.Approve");
      } else if (!isStringEmpty(this.stakeLPInputNum)) {
        msgText = this.$t("message.smOption.Confirm");
      } else {
        msgText = `${this.$t("message.smOption.Enter")} ${'LP'} ${this.$t("message.smOption.Amount")}`;
      }
      this.stakeBtnText = msgText;
    },
    // 获取chef可扣余额
    async getChefAllowance() {
      if (!this.isConnectWallet) {
        return;
      }
      try {
        const that = this;
        const result = await this.$decentralized.getChefAllowance(this.walletAddress, this.selectedIndex);
        if (result) {
          that.lpChefContractApporveNum = parseFloat(result);
          that.chageStakeBtnTextMsg();
          console.log('chef合约剩余可扣量=', that.lpChefContractApporveNum);
        }
      } catch (error) {
        console.log('Error message: ', error)
      }
    },
    // 授权Chef数量
    async approveChefContract() {
      try {
        const that = this;
        that.$loading.showLoading();
        const result = await this.$decentralized.approveChefContract(this.walletAddress, this.connectWalletType, this.selectedIndex);
        if (result) {
          that.$loading.hiddenLoading();
          that.lpChefContractApporveNum = parseFloat(MaxUint256.toString());
          that.chageStakeBtnTextMsg();
          console.log('gaka合约剩余可扣量=', that.lpChefContractApporveNum);
        }
      } catch (error) {
        this.$loading.hiddenLoading();
        this.$notify({ message: error.message, duration: 2500, showClose: false, customClass: 'notifyClass' });
        console.log('Error message: ', error)
      }
    },
    // 获取数据
    async getDataInfo() {
      if (!this.isConnectWallet) {
        return;
      }
      try {
        const that = this;
        const dict = {};
        dict['address'] = that.walletAddress;
        const userWithdrawNum = await that.$decentralized.getUserCanWithdrawNum(dict);
        const userStakeNum = await that.$decentralized.getUserStakeLPNum(dict);
        const totalStakeNum = await that.$decentralized.getTotalStakeLPNum(dict);
        const result = await that.$decentralized.getLPStakeRelatedData(userStakeNum.amount, totalStakeNum);
        result['userWithdrawNum'] = keepAFewDecimalPlaces(chuDivision(userWithdrawNum, 18), 4);
        result['userStakeNum'] = keepAFewDecimalPlaces(chuDivision(userStakeNum.amount, 18), 4);
        result['userStakeToUSDT'] = keepAFewDecimalPlaces(result.userStakeToUSDT, 4);
        result['platformToUSDT'] = keepAFewDecimalPlaces(result.platformToUSDT, 4);
        result['lpARP'] = 0;
        that.lpData = result;
        console.log('lp data =', result);
      } catch (error) {
        this.$notify({ message: error.message, duration: 2500, showClose: false, customClass: 'notifyClass' });
        console.log('Error message: ', error)
      }
    },
    async getPoolInfo() {
      if (!this.isConnectWallet) {
        return
      }
      if (this.selectedIndex === 1) {
        this.getDataInfo();
      } else {
        try {
          let dataInfo = await this.$decentralized.getPoolInfo(this.walletAddress, this.selectedIndex);
          let result = {};
          result['userWithdrawNum'] = keepAFewDecimalPlaces(chuDivision(dataInfo.harvest, 18), 4);
          result['userStakeNum'] = keepAFewDecimalPlaces(chuDivision(dataInfo.stakedLp, 18), 4);
          result['userStakeToUSDT'] = keepAFewDecimalPlaces(chuDivision(dataInfo.stakedValue, 18), 4);
          result['platformToUSDT'] = keepAFewDecimalPlaces(chuDivision(dataInfo.lpValue, 18), 4);
          result['userCompletedNum'] = keepAFewDecimalPlaces(chuDivision(dataInfo.successLp, 18), 4);
          result['lpARP'] = keepAFewDecimalPlaces(dataInfo.apr / 100, 2);
          this.lpData = result;
          console.log('lp data =', result);
        } catch (error) {
          this.$notify({ message: error.message, duration: 2500, showClose: false, customClass: 'notifyClass' });
          console.log('Error message: ', error)
        }
      }
    },
    async getPageInfo() {
      if (!this.isConnectWallet || this.selectedIndex < 3) {
        return
      }
      try {
        let dataInfo = await this.$decentralized.getUserDeposit(this.walletAddress, this.selectedIndex);
        const blockNumber = await contractObject.getInitGlobalWeb3().eth.getBlockNumber();
        this.recordList = dataInfo.retUserDeposit.map(item => {
          let tempItem = {};
          tempItem.amount = keepAFewDecimalPlaces(chuDivision(item.amount, 18), 4);
          console.log('blocknumber =', item.blockNumber, dataInfo._intervalBlock, blockNumber)
          let blockNumber1 = parseFloat(item.blockNumber) + parseFloat(dataInfo._intervalBlock) - blockNumber;
          tempItem.blockNumber = blockNumber1 >= 0 ? blockNumber1 : 0;
          return tempItem;
        });
      } catch (e) {
        console.log(e)
      }
    },
    // 获取LP的余额
    async getLPBalance() {
      if (!this.isConnectWallet) {
        return;
      }
      try {
        const that = this;
        const dict = {};
        dict['address'] = that.walletAddress;
        const result = await that.$decentralized.getLPBalance(dict);
        that.lpBalace = keepFormatDecimalDecimalPlaces(chuDivision(result, 18), 4);
        console.log('lp balance =', that.lpBalace);
      } catch (error) {
        this.$notify({ message: error.message, duration: 2500, showClose: false, customClass: 'notifyClass' });
        console.log('Error message: ', error)
      }
    },
    // 提取ALAD
    async handleHarvestPotionResponse() {
      if (!this.isConnectWallet) {
        this.$notify({
          message: this.$t("message.casting.connectWallet"),
          duration: 2500,
          showClose: false,
          customClass: 'notifyClass'
        });
        return;
      } else if (this.lpData.userWithdrawNum <= 0) {
        this.$notify({
          message: this.$t("message.alertMsg.harvestLPALADMsg"),
          duration: 2500,
          showClose: false,
          customClass: 'notifyClass'
        });
        return;
      }
      try {
        const that = this;
        const dict = {};
        dict['address'] = that.walletAddress;
        that.$loading.showLoading();
        const result = await that.$decentralized.depositLPStakeAwardALAD(dict, this.connectWalletType, this.selectedIndex);
        that.$loading.hiddenLoading();
      } catch (error) {
        this.$loading.hiddenLoading();
        this.$notify({ message: error.message, duration: 2500, showClose: false, customClass: 'notifyClass' });
        console.log('Error message: ', error)
      }
      console.log('提取ALAD');
    },
    // LP质押
    handleLPStakedResponse() {
      if (!this.isConnectWallet) {
        this.$notify({
          message: this.$t("message.casting.connectWallet"),
          duration: 2500,
          showClose: false,
          customClass: 'notifyClass'
        });
        return;
      }
      this.showStakeMaks = true;
    },
    // 添加流动性
    handleAddLiquidityStake() {
      const url = settingConfig.lpUrl;
      window.open(url);
      console.log('添加流动性');
    },
    // 提取已经质押的LP
    async handleHarvestLPStake() {
      if (!this.isConnectWallet) {
        this.$notify({
          message: this.$t("message.casting.connectWallet"),
          duration: 2500,
          showClose: false,
          customClass: 'notifyClass'
        });
        return;
      }
      if (this.selectedIndex === 1) {
        this.withdrawStakeLP();
      } else {
        const checkDict = {};
        checkDict['sender'] = this.walletAddress;
        let result = await checkWithdraw(checkDict);
        console.log('checkWithdraw =', result);
        if (result.status === 200) {
          let amount = await this.$decentralized.getUserDepositAmount(this.walletAddress);
          let lp = this.selectedIndex < 3 ? this.lpData.userStakeNum : this.lpData.userCompletedNum;
          console.log('lp =', lp)
          if (lp === 0) {
            this.$notify({
              message: this.$t("message.alertMsg.harvestLPMsg"),
              duration: 2500,
              showClose: false,
              customClass: 'notifyClass'
            });
            return;
          }
          if (result.data.flag === 0) {
            let acc = chuDivision(amount, 18) - parseFloat(result.data.value);
            console.log('acc =', acc)
            if (lp > acc) {
              this.$notify({
                message: this.$t("message.alertMsg.notHarvestLPMsg"),
                duration: 2500,
                showClose: false,
                customClass: 'notifyClass'
              });
              return;
            }
          }
          this.withdrawStakeLP();
          console.log('提取已经质押');
        }
      }
    },
    async withdrawStakeLP() {
      try {
        const that = this;
        const dict = {};
        dict['address'] = that.walletAddress;
        if (this.selectedIndex === 1) {
          const userStakeNum = await that.$decentralized.getUserStakeLPNum(dict);
          dict['amount'] = userStakeNum.amount;
        } else {
          dict['amount'] = 0;
        }
        that.$loading.showLoading();
        const result = await that.$decentralized.withdrawStakeLPNum(dict, this.connectWalletType, this.selectedIndex);
        that.$loading.hiddenLoading();
      } catch (error) {
        this.$loading.hiddenLoading();
        this.$notify({ message: error.message, duration: 2500, showClose: false, customClass: 'notifyClass' });
        console.log('Error message: ', error)
      }
    },
    // 确定质押最大LP
    handleStateMaxCoin() {
      this.stakeLPInputNum = this.lpBalace;
      this.chageStakeBtnTextMsg();
    },
    // 确定质押LP挖矿
    async handleConfirmStateCoin() {
      if (parseFloat(this.lpChefContractApporveNum) === 0 || this.lpChefContractApporveNum < parseFloat(this.stakeLPInputNum)) {
        await this.approveChefContract();
        return;
      } else if (parseFloat(this.stakeLPInputNum) <= 0 || isStringEmpty(this.stakeLPInputNum)) {
        this.$notify({
          message: this.$t("message.alertMsg.contentLPEmpty"),
          duration: 2500,
          showClose: false,
          customClass: 'notifyClass'
        });
        return;
      } else if (parseFloat(this.lpBalace) < parseFloat(this.stakeLPInputNum)) {
        this.$notify({
          message: this.$t("message.alertMsg.insufficientBalance"),
          duration: 2500,
          showClose: false,
          customClass: 'notifyClass'
        });
        return;
      }
      try {
        const that = this;
        const dict = {};
        dict['address'] = that.walletAddress;
        dict['amount'] = that.stakeLPInputNum;
        that.$loading.showLoading();
        const result = await that.$decentralized.depositStakeLPALAD(dict, this.connectWalletType, this.selectedIndex);
        that.$loading.hiddenLoading();
        that.stakeLPInputNum = '';
        that.showStakeMaks = false;
      } catch (error) {
        this.$loading.hiddenLoading();
        this.$notify({ message: error.message, duration: 2500, showClose: false, customClass: 'notifyClass' });
        console.log('Error message: ', error)
      }
      console.log('确定质押');
    },
    // 关闭LP质押弹框
    handleCloseMask() {
      this.stakeLPInputNum = '';
      this.showStakeMaks = false;
    },
    // 开启定时器
    openTimer() {
      const that = this;
      this.closeTimer();
      this.countdTimer = setInterval(() => {
        that.getLPBalance();
        that.getChefAllowance();
        that.getPoolInfo();
        that.getPageInfo();
        that.getShopStatus();
      }, 3000);
    },
    // 关闭定时器
    closeTimer() {
      if (this.countdTimer) {
        clearInterval(this.countdTimer);
        this.countdTimer = null;
        console.log('关闭NFT详情定时器');
      }
    },
  },
}
</script>

<style lang="scss" scoped>

.nLp {
  position: relative;
  padding-top: 0.1px;
  box-sizing: border-box;
  padding-bottom: vw(100);
  background-color: #202136;
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
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100vw;
    height: auto;
    .h_c_top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: vw(140);
      padding: 0 vw(30);
      .h_c_title {
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
      .h_c_store {
        display: flex;
        flex-direction: column;
        align-items: center;
        img {
          width: vw(60);
          height: vw(60);
        }
        span {
          margin-top: vw(15);
          font-size: vw(24);
          font-weight: 600;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          text-align: center;
          font-family: PingFangSC, sans-serif;
          color: #898989;
          -webkit-background-clip: text;
          background-image: linear-gradient(to bottom, #bb98f2, #ce92f7 46%, #60d0f7);
        }
      }
    }
    .lp {
      margin: 0 auto;
      padding-top: 0.1px;
      width: 100%;
      height: vw(1337);
      box-sizing: border-box;
      background-size: contain;
      background-repeat: no-repeat;
      .m_dis_tab {
        display: flex;
        justify-content: space-between;
        margin: vw(53) vw(40) 0;
        .m_dis_tab_item {
          display: flex;
          flex-direction: column;
          img {
            width: vw(90);
            height: vw(162);
          }
          span {
            margin-top: vw(8);
            font-family: PingFangSC-Regular, sans-serif;
            font-size: vw(28);
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: normal;
            letter-spacing: normal;
            text-align: center;
            color: white;
          }
        }
      }
      .m_dis_title {
        margin-top: vw(27);
        line-height: vw(84);
        font-size: vw(60);
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: normal;
        text-align: center;
        font-family: PingFangSC, sans-serif;
        color: var(--white);
      }
      .m_dis_coin {
        display: flex;
        margin-top: vw(20);
        margin-left: vw(93);
        margin-right: vw(93);
        justify-content: space-between;
        align-items: center;
        img {
          width: vw(160);
          height: vw(80);
        }
        span {
          font-size: vw(28);
          font-weight: 500;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          text-align: left;
          font-family: PingFangSC, sans-serif;
          color: var(--white);
        }
      }
      .m_dis_pledge {
        margin-top: vw(28);
        font-size: vw(26);
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: center;
        font-family: PingFangSC-Regular, sans-serif;
        color: #4b4b79;
      }
      .m_dis_line {
        margin: vw(20) auto 0;
        width: vw(690);
        height: 0;
        opacity: 0.14;
        border-bottom: #ffffff 1px dashed;
      }
      .m_dis_content {
        margin: vw(30) auto 0;
        width: vw(650);
        height: vw(140);
        border-radius: vw(20);
        background-color: #363652;
        display: flex;
        justify-content: space-between;

        .m_dis_apr {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          span {
            font-family: PingFangSC, sans-serif;
            font-size: vw(28);
            font-weight: 500;
            font-stretch: normal;
            font-style: normal;
            line-height: normal;
            letter-spacing: normal;
            text-align: left;
            color: #ff953f;

            &:last-child {
              margin-top: vw(10);
              font-size: vw(20);
              color: var(--white);
            }
          }
        }
      }
      .m_dis_bottom {
        margin-top: vw(30);
        padding: 0 vw(51);
        display: flex;
        justify-content: space-between;
        .m_dis_left {
          .m_dis_text {
            display: flex;
            flex-direction: column;
            margin-top: vw(30);
            span {
              font-family: PingFangSC, sans-serif;
              font-size: vw(24);
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              line-height: normal;
              letter-spacing: normal;
              text-align: left;
              color: var(--white);
              &:last-child {
                margin-top: vw(10);
                font-size: vw(32);
                font-weight: 600;
                color: #ff953f;
              }
            }
            &:first-child {
              margin-top: 0;
            }
          }
        }
        .m_dis_right {
          .m_dis_button {
            margin-top: vw(58);
            width: vw(200);
            height: vw(60);
            object-fit: contain;
            border-radius: vw(10);
            background-image: linear-gradient(82deg, #f109b4 0%, #622fe3 101%);
            display: flex;
            justify-content: center;
            align-items: center;

            span {
              font-family: PingFangSC, sans-serif;
              font-size: vw(28);
              font-weight: 500;
              font-stretch: normal;
              font-style: normal;
              line-height: normal;
              letter-spacing: normal;
              text-align: left;
              color: var(--white);
            }

            /*img {
              width: vw(14);
              height: vw(18);
              margin-left: vw(14);
              object-fit: contain;
            }*/
            &:first-child {
              margin-top: vw(14);
            }
          }
        }
      }
      .lp_record {
        margin-top: vw(50);
        .lp_record_title {
          font-family: PingFangSC-Semibold, sans-serif;
          font-size: vw(32);
          font-weight: 600;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          text-align: center;
          color: white;
        }

        .lp_record_list_title {
          margin: vw(40) vw(51) 0;
          display: flex;
          justify-content: space-between;

          .lp_record_list_title_left {
            font-family: PingFangSC, sans-serif;
            font-size: vw(24);
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: normal;
            letter-spacing: normal;
            text-align: left;
            color: white;
          }

          .lp_record_list_title_right {
            font-family: PingFangSC, sans-serif;
            font-size: vw(24);
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: normal;
            letter-spacing: normal;
            text-align: right;
            color: white;
          }
        }

        .lp_record_list {
          margin: vw(20) vw(51) 0;
          min-height: vw(200);

          .lp_record_list_item {
            display: flex;
            justify-content: space-between;

            .lp_record_list_item_left {
              font-family: PingFangSC, sans-serif;
              font-size: vw(24);
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              line-height: normal;
              letter-spacing: normal;
              text-align: left;
              color: white;
            }

            .lp_record_list_item_right {
              font-family: PingFangSC, sans-serif;
              font-size: vw(24);
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              line-height: normal;
              letter-spacing: normal;
              text-align: right;
              color: white;
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
    .m_sale {
      width: vw(500);
      height: vw(320);
      border-radius: vw(20);
      background-color: #2e2f48;
      .m_s_desc {
        margin: vw(85) vw(50) 0;
        line-height: vw(33);
        font-size: vw(32);
        font-weight: 500;
        font-family: PingFangSC, sans-serif;
        font-stretch: normal;
        font-style: normal;
        color: var(--white);
      }
      .m_s_btn {
        margin: vw(50) auto 0;
        display: flex;
        justify-content: space-between;
        width: vw(472);
        div {
          width: vw(236);
          height: vw(94);
          line-height: vw(94);
          font-size: vw(28);
          font-weight: 500;
          user-select: none;
          cursor: pointer;
          color: #fff;
          font-family: PingFangSC, sans-serif;
          background-size: 100% 100%;
          background-repeat: no-repeat;
          background-image: url('../../../assets/newPhones/nLaboratory/h5_icon_l_cancle.png');
          &:last-child {
            background-image: url('../../../assets/newPhones/nLaboratory/h5_icon_l_takeBack.png');
          }
        }
      }
    }
    .markContent {
      position: relative;
      width: vw(690);
      height: vw(580);
      border-radius: vw(20);
      background-color: #27273f;

      .mark_title {
        margin-top: vw(27);
        line-height: vw(45);
        font-size: vw(32);
        text-align: center;
        font-family: PingFangSC, sans-serif;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        color: var(--white);
      }

      .left_line {
        width: 100%;
        height: 1px;
        margin-top: vw(25);
        background-color: #3d3d58;
      }

      .mark_state {
        //width: 100vw;
        margin: vw(40) auto 0;
        padding: 0 vw(40);
        //height: vw(190);
        overflow: hidden;
        background-color: transparent;

        .mark_state_topCell {
          //margin: vw(40) vw(35) 0 vw(53);
          display: flex;
          justify-content: space-between;
          align-items: center;

          span {
            line-height: vw(40);
            font-size: vw(28);
            font-weight: normal;
            font-family: PingFangSC, sans-serif;
            color: var(--white);

            &:last-child {
              height: vw(28);
              line-height: vw(28);
            }
          }
        }

        .mark_state_bottomCell {
          margin-top: vw(36);
          display: flex;
          justify-content: space-between;
          align-items: center;

          input {
            width: vw(200);
            height: vw(60);
            border: 0; // 去除未选中状态边框
            outline: none; // 去除选中状态边框
            color: var(--white);
            font-size: vw(28);
            font-weight: bold;
            font-family: PingFangSC, sans-serif;
            font-stretch: normal;
            font-style: normal;
            box-sizing: border-box;
            background-color: transparent;
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
            font-size: vw(32);
          }

          input:-moz-placeholder {
            /* FF 4-18 */
            color: #373752;
            font-size: vw(32);
          }

          input::-moz-placeholder {
            /* FF 19+ */
            color: #373752;
            font-size: vw(32);
          }

          input:-ms-input-placeholder {
            /* IE 10+ */
            color: #373752;
            font-size: vw(32);
          }

          input:-webkit-autofill {
            transition: background-color 5000s ease-in-out 0s; //背景颜色
          }

          .mark_bottomCell_right {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .mark_max {
              width: vw(110);
              height: vw(50);
              line-height: vw(46);
              font-size: vw(26);
              font-weight: normal;
              font-family: PingFangSC, sans-serif;
              text-align: center;
              color: #ff953f;
              user-select: none;
              cursor: pointer;
              border-radius: vw(10);
              border: solid vw(2) #ff953f;
              background-color: #27273f;
              box-sizing: border-box;
            }

            .mark_type {
              span {
                margin-left: vw(20);
                line-height: vw(40);
                font-size: vw(28);
                font-weight: 500;
                font-family: PingFangSC, sans-serif;
                color: var(--white);
              }
            }
          }
        }
      }

      .mark_liquidity {
        width: vw(456);
        height: vw(94);
        margin: vw(40) auto 0;
        line-height: vw(94);
        font-size: vw(28);
        font-weight: 500;
        font-family: PingFangSC, sans-serif;
        font-stretch: normal;
        font-style: normal;
        box-sizing: border-box;
        user-select: none;
        cursor: pointer;
        color: var(--white);
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-image: url('../../../assets/newPhones/nWish/icon_wish_cancle.svg');
      }

      .mark_btn {
        width: vw(456);
        height: vw(94);
        margin: vw(20) auto 0;
        line-height: vw(94);
        font-size: vw(28);
        font-weight: 500;
        cursor: pointer;
        user-select: none;
        font-family: PingFangSC, sans-serif;
        color: var(--white);
        box-sizing: border-box;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-image: url('../../../assets/newPhones/nWish/icon_wish_confrin.svg');
      }

      .mark_harvest {
        height: vw(31);
        margin: vw(60) vw(38) 0;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .mark_withdraw {
          span {
            height: vw(31);
            line-height: vw(31);
            font-size: vw(28);
            font-weight: normal;
            font-family: PingFangSC, sans-serif;
            color: var(--white);

            span {
              color: var(--primary);
            }
          }

        }

        .mark_harvestBtn {
          height: vw(31);
          line-height: vw(31);
          font-size: vw(28);
          font-weight: normal;
          font-family: PingFangSC, sans-serif;
          color: var(--primary);
          user-select: none;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 1px;
          text-decoration-color: var(--primary);
          -webkit-tap-highlight-color: transparent;
        }
      }

      .markClose {
        width: vw(40);
        height: vw(40);
        top: vw(27);
        right: vw(22);
        position: absolute;
        cursor: pointer;
      }
    }
  }
}

</style>
