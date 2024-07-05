<template>
  <div class="stock">
    <div v-if="stockDataList.length <= 0" class="s_empty">{{ $t("message.holding.empty") }}</div>
    <div v-else class="s_contian">
      <!--style="min-height: 100vh"-->
      <van-pull-refresh v-model="isRefresh" @refresh="onRefresh">
        <van-list v-model="isLoadMoring" :finished="isFinisedLoadMoring" :finished-text="$t('message.alertMsg.loadFinisedMsg')" :immediate-check="false" @load="onLoadMore">
          <stock-card :marketList="stockDataList" @handleClickCheck="handleClickCheck"></stock-card>
        </van-list>
      </van-pull-refresh>
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
import {mapGetters} from 'vuex';
import {cancelOrder, getCustomerNFTList} from '@/api/mark'
import stockCardMb from '../../../components/stockCardMb/stockCardMb.vue';

export default {
  name: "stock",
  components: { 'stock-card': stockCardMb },
  data() {
    return {
      countdTimer: null, // 定时器
      showSaleMaks: false,
      isRefresh: false,// 是否刷新中
      isLoadMoring: false, // 加载更多
      isFinisedLoadMoring: false, // 结束加载更是
      selectedItem: '', // 选择的Item
      needAladPrice: 0, // 折合需要多少ALAD
      pageSize: 1, // 当前的页码
      stockDataList: [],
      //showPapination: false,
      //paginatioParams: { currentPage: 1, perSize: 8, totalSize: 1, defaultTotalPage: 5 },
    };
  },
  created() {
    this.getCustomerNFTList(true);
    console.log('stock page create');
  },
  mounted() {

  },
  destroyed() {

  },
  // 计算属性
  computed: {
    ...mapGetters(['isConnectWallet', 'walletAddress', 'connectWalletType']),
  },
  // 监听属性改变
  watch: {
    isConnectWallet(val, oval) {
      this.showSaleMaks = false;
      if (val) {
        this.getCustomerNFTList(true);
      } else {
        this.stockDataList = [];
      }
    }
  },
  // 方法
  methods: {
    // 下拉刷新回调
    onRefresh() {
      this.isFinisedLoadMoring = false;
      this.getCustomerNFTList(true);
    },
    // 上拉加载更多
    onLoadMore() {
      this.getCustomerNFTList(false);
    },
    // 获取用户在售NFT数据
    async getCustomerNFTList(isRefresh) {
      if (!this.isConnectWallet) {
        return;
      }
      const dict = {};
      dict['status'] = '1'; // 1: 在售 2: 在持 3:待交割
      dict['address'] = this.walletAddress; // 用户地址
      dict['page'] = isRefresh ? 1 : this.pageSize; // 当前第几页
      const that = this;
      const result = await getCustomerNFTList(dict);
      if (result.status === 200) {
        console.log('result =',result);
        result.data.result.forEach((item) => {
          const newStr = item.picurl.indexOf("https");
          if (newStr === -1) {
            item.picurl = `${settingConfig.ipfsNFTUrl + item.picurl}`
          }
        });
        // 当获取数据完成后开始处理控件状态
        if (isRefresh) {
          that.isRefresh = false;
          that.pageSize = 2;
          that.stockDataList = [];
          console.log('下拉刷新');
        } else {
          that.isLoadMoring = false;
          this.pageSize++;
          console.log('上拉加载更多');
        }
        // 当返回的数据是空的时候则表示已经加载完毕
        if (result.data.result.length < 8) {
          that.isFinisedLoadMoring = true;
        }
        that.stockDataList = that.stockDataList.concat(result.data.result);
        console.log(`在售列表数据=`, that.stockDataList);
      } else {
        if (isRefresh) {
          that.isRefresh = false;
        } else {
          that.isLoadMoring = false;
        }
        that.isLoadMoring = false;
        that.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
      }
    },
    // 查看在售
    handleClickCheck(item) {
      // 0 待审核 1 已上架  8 待上架
      this.selectedItem = item;
      this.showSaleMaks = !this.showSaleMaks;
      this.openTimer();
    },
    // 撤回
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
    openTimer() {
      const that = this;
      this.closeTimer();
      this.countdTimer = setInterval(() => {
        that.$decentralized.getAladPrice(that.selectedItem.sellprice, (result) => {
          that.needAladPrice = result;
          console.log(`${that.selectedItem.sellprice}USDT需要${result}ALAD购买`);
        });
      }, 2000);
    },
    // 关闭定时器
    closeTimer() {
      if (this.countdTimer) {
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
  flex: 1;
  overflow-y: auto;
  width: 100vw;
  padding-top: 0.1px;
  padding-bottom: vw(10);
  background-color: #3d3f60;
  .s_empty {
    margin: vw(370) auto 0;
    padding-top: vw(200);
    width: vw(312);
    height: vw(240);
    line-height: vw(46);
    font-size: vw(28);
    font-weight: normal;
    font-stretch: normal;
    font-family: PingFangSC, sans-serif;
    color: #c5c8d9;
    box-sizing: border-box;
    background-size: contain;
    background-repeat: no-repeat;
    background-image: url('../../../assets/newPhones/nLaboratory/h5_icon_empty.png');
  }
  .s_contian {
    width: vw(690);
    margin: vw(20) auto 0;
  }
  .s_pagination {
    height: vw(40);
    margin: vw(40) auto 0;
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
      position: relative;
      width: vw(586);
      height: vw(532);
      border-radius: vw(20);
      background-color: #2e2f48;;
      .m_p_title {
        margin-top: vw(25);
        line-height: vw(49);
        font-size: vw(30);
        font-family: PingFangSC, sans-serif;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        color: var(--white);
      }
      .m_p_line {
        margin-top: vw(26);
        height: 1px;
        opacity: 0.34;
        background-color: #3d3d58;
      }
      .m_p_contain {
        display: flex;
        height: vw(280);
        .m_p_c_left {
          padding-left: vw(53);
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          .m_p_c_l_text {
            line-height: vw(31);
            font-size: vw(28);
            font-weight: 500;
            text-align: left;
            font-family: PingFangSC, sans-serif;
            font-stretch: normal;
            font-style: normal;
            color: var(--white);
          }
          .m_p_c_middle {
            display: flex;
            align-items: center;
            .m_p_c_m_desc {
              display: none;
              div {
                margin-left: vw(20);
                line-height: vw(40);
                font-size: vw(28);
                font-weight: 500;
                word-break: break-all;
                text-align: left;
                font-family: PingFangSC, sans-serif;
                font-stretch: normal;
                font-style: normal;
                color: var(--white);
              }
            }
            img {
              width: vw(106);
              height: vw(106);
              border-radius: vw(8);
            }
          }
        }
        .m_p_c_right {
          flex: 1;
          padding-right: vw(50);
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          div {
            line-height: vw(31);
            font-size: vw(28);
            font-weight: 500;
            text-align: right;
            font-family: PingFangSC, sans-serif;
            font-stretch: normal;
            font-style: normal;
            color: var(--white);
          }
          .m_p_c_usdt {
            align-self: flex-end;
            display: flex;
            align-items: center;
            span {
              line-height: vw(30);
              font-size: vw(28);
              font-weight: 500;
              text-align: right;
              font-family: Ubuntu, sans-serif;
              font-stretch: normal;
              font-style: normal;
              color: #994cf0;
            }
            img {
              margin-left: vw(20);
              width: vw(44);
              height: vw(44);
            }
          }
        }
      }
      .m_p_line1 {
        height: 1px;
        opacity: 0.34;
        background-color: #3d3d58;
      }
      .m_p_Btn {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: vw(20) auto 0;
        div {
          width: vw(236);
          height: vw(94);
          line-height: vw(94);
          font-size: vw(28);
          font-weight: 500;
          cursor: pointer;
          user-select: none;
          font-family: PingFangSC, sans-serif;
          font-stretch: normal;
          font-style: normal;
          background-size: contain;
          background-repeat: no-repeat;
          background-image: url('../../../assets/newPhones/nLaboratory/h5_icon_l_takeBack.png');
          color: var(--white);
          &:last-child {
            margin-left: vw(10);
            background-size: contain;
            background-repeat: no-repeat;
            background-image: url('../../../assets/newPhones/nLaboratory/h5_icon_l_cancle.png');
          }

        }
        .m_p_review {
          width: vw(220);
          height: vw(80);
          background-image: url('../../../assets/newPhones/nLaboratory/h5_icon_token_review_bg.png');
        }
      }
    }
  }
}

</style>
