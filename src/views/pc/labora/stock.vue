<template>
  <div class="stock">
    <div v-if="stockDataList.length <= 0" class="s_empty">{{ $t("message.holding.empty") }}</div>
    <div v-else class="s_contian" @scroll="scrollEvent">
      <stock-card :marketList="stockDataList" @handleClickCheck="handleClickCheck"></stock-card>
    </div>
    <!-- 取消在售弹框 -->
    <div class="mask" v-show="showSaleMaks" @touchmove.prevent @mousewheel.prevent>
      <div class="m_pay">
        <div class="m_p_title">{{ $t("message.stock.cancelSale") }}</div>
        <div class="m_p_line"></div>
        <div class="m_p_contain">
          <div class="m_p_c_left">
            <div class="m_p_c_l_text">{{ $t("message.stock.Items") }}</div>
            <div class="m_p_c_middle">
              <img :src="selectedItem.picurl" alt="logo">
              <div class="m_p_c_m_desc">
                <div>{{ selectedItem.userName }}</div>
                <div>{{ selectedItem.nftName }}</div>
              </div>
            </div>
            <div class="m_p_c_l_text">{{ $t("message.stock.folded") }}</div>
          </div>
          <div class="m_p_c_right">
            <div>{{ $t("message.stock.Price") }}</div>
            <div class="m_p_c_usdt">
              <span>{{ selectedItem.sellprice | roundingDecimals(4) }}</span>
              <img src="../../../assets/newPhones/universal/icon_usdt_coin.svg" alt="">
            </div>
            <div class="m_p_c_usdt">
              <span>{{ needAladPrice | roundingDecimals(4) }}</span>
              <img src="../../../assets/newPhones/universal/icon_alad_coin.svg" alt="">
            </div>
          </div>
        </div>
        <div class="m_p_line1"></div>
        <div class="m_p_Btn">
          <div :class="selectedItem.type === 0 ? 'm_p_review' : ''" @click="handleClickGoToTakeBack">{{ $t("message.stock.TakeBack") }}</div>
          <div @click="handleClickGoToCancle">{{ $t("message.stock.Cancel") }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

const settingConfig = require('../../../settings.js');
import { mapGetters } from 'vuex';
import {cancelOrder, getCustomerNFTList} from '@/api/mark'
import stockCard from '../../../components/stockCard/stockCard.vue';

export default {
  name: "stock",
  components: {'stock-card':stockCard},
  data() {
    return {
      showSaleMaks:false,
      selectedItem:'', // 选择的Item
      stockDataList:[],
      countdTimer:null, // 定时器
      needAladPrice:0, // 折合需要多少ALAD
      pageNum:1, // 分页
      moreLoading:false, // 是否是加载中
      noMore:false, // 是否没有数据了
    };
  },
  created() {
    this.getCustomerNFTList(true);
  },
  mounted() {

  },
  destroyed() {
     this.closeTimer();
  },
  // 计算属性
  computed: {
    ...mapGetters(['isConnectWallet','walletAddress','connectWalletType']),
  },
  // 监听属性改变
  watch:{
    isConnectWallet(val,oval) {
      if (val) {
        this.getCustomerNFTList();
      }else {
        this.stockDataList = [];
      }
    }
  },
  // 方法
  methods: {
    // 滚动事件
    scrollEvent(e) {
      // !this.moreLoading 没有在加载状态，触发加载更多时，把this.moreLoading置未true
      // !this.noMore 没有更多的状态为false，当我们取到的数据长度小于1页的数量时，就没有更多了数据了，把 this.noMore置为true，这样就不会触发无意义的加载更多了
      const ele = e.srcElement ? e.srcElement : e.target;
      if(ele.scrollTop + ele.offsetHeight > ele.scrollHeight - 10 && !this.moreLoading && !this.noMore) {
        this.getCustomerNFTList(false);
        console.log('开始调用在售加载更多接口');
      }
    },
    // 获取用户在售NFT数据
    async getCustomerNFTList(isRefersh) {
     if(!this.isConnectWallet){
        return;
      }
      this.moreLoading = true;
      if (isRefersh) {
        this.pageNum = 1;
        this.noMore = false;
      }else {
        this.pageNum++;
      }
      const dict = {};
      dict['status'] = '1'; // 1: 在售 2: 在持 3:待交割
      dict['address'] = this.walletAddress; // 用户地址
      dict['page'] = this.pageNum; // 当前第几页
      dict['count'] = 20;
     const that = this;
      const result = await getCustomerNFTList(dict);
      if (result.status === 200) {
        result.data.result.forEach((item) => {
          const newStr = item.picurl.indexOf("https");
          if (newStr === -1) {
            item.picurl = `${settingConfig.ipfsNFTUrl + item.picurl}`
          }
        });
        if (isRefersh){
          that.stockDataList = result.data.result;
        }else {
          that.stockDataList.push(...result.data.result);
        }
        // 将状态机设置对应状态
        that.moreLoading = false;
        // 当我们取到的数据长度小于1页的数量时，就没有更多了数据了
        if (result.data.result.length < 20) {
          that.noMore = true;
        }
      }else {
        that.moreLoading = false;
        that.$notify({message: result.data,duration: 2500,showClose:false,customClass:'notifyClass'});
      }
      console.log('在售NFT列表',result);
    },
    // 查看在售
    handleClickCheck(item) {
     // 0 待审核 1 已上架  8 待上架
      this.selectedItem = item;
      this.showSaleMaks = !this.showSaleMaks;
      this.openTimer();
    },
    // 撤回上级的普通商品/NFT商品/店铺商品
    async handleClickGoToTakeBack() {
      // 撤销商店地址类型商品
      if (this.selectedItem.headType === 3) {
        try {
          const that = this;
          const marketData = {};
          marketData['sender'] = this.walletAddress;
          marketData['orderid'] = this.selectedItem.tokenid;
          const signDict = await this.$decentralized.getApproveSignShopOnShelfGood(marketData);
          const marketsData = {};
          marketsData['sender'] = this.walletAddress.toLowerCase();
          marketsData['orderid'] = this.selectedItem.tokenid;
          marketsData['time'] = signDict.time;
          marketsData['sign'] = signDict.signature;
          this.$loading.showLoading();
          const result = await cancelOrder(marketsData);
          if (result.status === 200) {
            // 更新NFT列表数据
            setTimeout(() => {
              that.$loading.hiddenLoading();
              that.handleClickGoToCancle();
              that.getCustomerNFTList(true);
            }, 2000);
          }else  {
            this.$loading.hiddenLoading();
            this.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
          }
        } catch (error) {
          this.$loading.hiddenLoading();
          this.$notify({ message: error.message, duration: 2500, showClose: false, customClass: 'notifyClass' });
          console.log('Error message: ', error)
        }
      } else {
        try {
          const that = this;
          this.$loading.showLoading();
          const dict = { address: this.walletAddress, tokenID: this.selectedItem.tokenid }
          const result = await this.$decentralized.cancelOrder(dict, this.connectWalletType);
          if (result) {
            // 更新NFT列表数据
            setTimeout(() => {
              that.$loading.hiddenLoading();
              that.handleClickGoToCancle();
              that.getCustomerNFTList(true);
            }, 4000);
          }
        } catch (error) {
          this.$loading.hiddenLoading();
          this.$notify({ message: error.message, duration: 2500, showClose: false, customClass: 'notifyClass' });
          console.log('Error message: ', error)
        }
      }
    },
    // 取消弹框
    handleClickGoToCancle() {
      this.selectedItem = '';
      this.needAladPrice = 0;
      this.showSaleMaks = false;
      this.closeTimer();
    },
    // 开启定时器
    openTimer(){
      const that = this;
      this.closeTimer();
      this.countdTimer = setInterval(() => {
        that.$decentralized.getAladPrice(that.selectedItem.sellprice,(result) => {
          that.needAladPrice = result;
          console.log(`${that.selectedItem.sellprice}USDT需要${result}ALAD购买`);
        });
      }, 2000);
    },
    // 关闭定时器
    closeTimer(){
      if(this.countdTimer){
        clearInterval(this.countdTimer);
        this.countdTimer = null;
        console.log('关闭在持有页面定时器');
      }
    },
  },
};
</script>

<style lang="scss" scoped>

.stock {
  max-width: 1200px;
  padding-top: 0.1px;
  margin: 0 auto;
  height: 950px;
  .s_empty {
    margin: 100px auto 0;
    padding-top: 150px;
    width: 172px;
    height: 180px;
    line-height: 28px;
    font-size: 20px;
    font-weight: normal;
    font-stretch: normal;
    font-family: "PingFang SC",sans-serif;
    color: #c5c8d9;
    box-sizing: border-box;
    background-size: contain;
    background-repeat: no-repeat;
    background-image: url('../../../assets/universal/icon_empty.svg');
  }
  .s_contian {
    width: 1200px;
    height: 950px;
    margin: 20px auto 0;
    overflow-y: scroll;
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
    .m_pay {
      position:relative;
      width: 500px;
      height: 380px;
      border-radius: 20px;
      background-color: #2e2f48;
      .m_p_title {
        margin-top: 15px;
        line-height: 28px;
        font-size: 20px;
        font-family: "PingFang SC",sans-serif;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        color: var(--white);
      }
      .m_p_line {
        margin-top: 15px;
        height: 0;
        opacity: 0.24;
        border-bottom: dashed 1px #707070;
      }
      .m_p_contain {
        display: flex;
        .m_p_c_left {
          padding-left: 40px;
          flex: 1;
          display: flex;
          flex-direction: column;
          .m_p_c_l_text {
            margin-top: 20px;
            line-height: 22px;
            font-size: 16px;
            font-weight: 500;
            text-align: left;
            font-family: "PingFang SC",sans-serif;
            font-stretch: normal;
            font-style: normal;
            color: var(--white);
          }
          .m_p_c_middle {
            margin-top: 20px;
            display: flex;
            align-items: center;
            img {
              width: 105px;
              height: 105px;
              border-radius: 8px;
            }
            .m_p_c_m_desc {
              div {
                margin-left: 20px;
                line-height: 26px;
                font-size: 16px;
                font-weight: 500;
                word-break: break-all;
                text-align: left;
                font-family: "PingFang SC",sans-serif;
                font-stretch: normal;
                font-style: normal;
                color: var(--white);
              }
            }
          }
        }
        .m_p_c_right {
          flex: 1;
          padding-right: 40px;
          display: flex;
          flex-direction: column;
          div {
            margin-top: 20px;
            line-height: 22px;
            font-size: 16px;
            font-weight: 500;
            text-align: right;
            font-family: PingFangSC, sans-serif;
            font-stretch: normal;
            font-style: normal;
            color: var(--white);
          }
          .m_p_c_usdt {
            margin-top: 60px;
            align-self: flex-end;
            display: flex;
            align-items: center;
            span {
              line-height: 22px;
              font-size: 16px;
              font-weight: 500;
              text-align: right;
              font-family: Ubuntu, sans-serif;
              font-stretch: normal;
              font-style: normal;
              color: #ff953f;
            }
            img {
              margin-left: 11px;
              width: 22px;
              height: 22px;
            }
          }
        }
      }
      .m_p_line1 {
        margin-top: 15px;
        height: 0;
        opacity: 0.24;
        border-bottom: dashed 1px #707070;
      }
      .m_p_Btn {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 15px auto 0;
        div {
          width: 156px;
          height: 64px;
          line-height: 64px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          user-select: none;
          font-family: "PingFang SC",sans-serif;
          font-stretch: normal;
          font-style: normal;
          background-size: contain;
          background-repeat: no-repeat;
          background-image: url('../../../assets/laboras/icon_l_takeBack.svg');
          color: var(--white);
          &:last-child {
            width: 156px;
            margin-left: 14px;
            background-size: contain;
            background-repeat: no-repeat;
            background-image: url('../../../assets/laboras/icon_n_cancle.svg');
          }
        }
        .m_p_review {
           color: var(--bgc09);
           background-image: url('../../../assets/laboras/icon_token_review_bg.svg');
        }
      }
    }
  }
}

</style>
