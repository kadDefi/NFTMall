<template>
  <div class="markCard">
    <el-row class="mc_row">
      <el-col v-for="(item, index) in marketList" :key="index" class="mc_col">
        <div @click="handleClickOpen(item)">
          <div class="mc_c_img"><img alt="logo" :src="item.picurl"></div>
          <img class="mc_hot" :src="require(`../../assets/newPhones/nLaboratory/icon_coin_${item.headType}.png`)" alt="">
        </div>
        <div class="mc_c_title">{{ item.nftName }}</div>
        <div class="mc_c_desc">
          <img src="../../assets/newPhones/universal/icon_usdt_coin.svg" alt="">
          <span>{{ item.sellprice  | noRoundingDecimals(2) }}</span>
        </div>
        <div class="mc_c_buy">
          <div class="mc_c_b_left">
            <img alt="logo" src="../../assets/newPhones/nMarket/icon_m_sz.svg">
            <span>{{ countdownTimeList[index] }}</span>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import {mapGetters} from 'vuex';
import {timeFromNow} from '@/utils/computing'

export default {
  name: "creatorCard",
  props: ["marketList", "typeName"],
  data() {
    return {
      isEnglish: false,
      timingTimer: null, // 定时器
      countdownTimeList: [],// 倒计时数据数组
    };
  },
  created() {
    this.isEnglish = window.localStorage.getItem("lang") !== "zh";
    if (this.marketList.length > 0) {
      const that = this;
      this.marketList.forEach((item, index, array) => {
        const timeString = timeFromNow(true, item.updateTime);
        that.countdownTimeList.splice(index, 1, timeString);
      });
      this.startOpenTimerCountdown();
    }
    console.log('creat markCard card');
  },
  mounted() {

  },
  destroyed() {
    if (this.timingTimer) {
      clearInterval(this.timingTimer);
      this.timingTimer = null;
      console.log('退出页面关闭定时器');
    }
  },
  watch: {
    '$i18n.locale'(nval, oval) {
      if (nval === 'zh') {
        this.isEnglish = false;
      } else {
        this.isEnglish = true;
      }
      console.log('监听到语言的切换');
    },
    marketList(val, oval) {
      if (val.length > 0) {
        const that = this;
        val.forEach((item, index, array) => {
          const timeString = timeFromNow(true, item.updateTime);
          that.countdownTimeList.splice(index, 1, timeString);
        });
        this.startOpenTimerCountdown();
      }
      console.log('数据发生改变');
    }
  },
  // 计算属性
  computed: {
    ...mapGetters(['isConnectWallet']),
  },
  // 方法集合
  methods: {
    handleClickOpen(item) {
      if (this.typeName === 'shop') {
        this.$router.push({ path: '/nShopDetail', query: { item: item.id, item1: this.isEnglish }});
      } else {
        this.$router.push({ path: '/nftdetialMb', query: { item: item.tokenid, item1: this.isEnglish }});
      }
    },
    handleViewOnlyMethod(item) {
      this.$emit("handleViewOnlyMethod", item);
    },
    // 开启定时器
    startOpenTimerCountdown() {
      if (this.timingTimer) {
        clearInterval(this.timingTimer);
        this.timingTimer = null;
        console.log('关闭定时器，重新开启');
      }
      // 开启定时器
      const that = this;
      this.timingTimer = setInterval(() => {
        that.marketList.forEach((item, index, array) => {
          const timeString = timeFromNow(true, item.updateTime);
          that.countdownTimeList.splice(index, 1, timeString);
        });
      }, 60000);
    },
  },
};
</script>

<style lang="scss" scoped>
.markCard {
  @include size(100%, 100%);
  /deep/ .el-row::before {
    content: none !important;
  }
  /deep/ .el-row::after {
    content: none !important;
  }
  .mc_row {
    width: vw(690);
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    .mc_col {
      position: relative;
      width: vw(335);
      height: vw(493);
      margin-top: vw(20);
      margin-left: vw(20);
      border-radius: vw(10);
      background-color: #272746;
      overflow: hidden;
      &:nth-child(2n + 1) {
        margin-left: 0;
      }
      &:nth-child(1) {
        margin-top: 0;
      }
      &:nth-child(2) {
        margin-top: 0;
      }
      .mc_c_img {
        width: vw(335);
        height: vw(335);
        img {
          width: 100%;
          height: 100%;
        }
      }
      .mc_hot {
        position: absolute;
        top: vw(10);
        left: 0;
        width: vw(60);
        height: vw(60);
      }
      .mc_c_title {
        align-self: flex-start;
        margin-top: vw(15);
        padding: vw(0) vw(12);
        font-size: vw(24);
        line-height: vw(27);
        text-align: left;
        font-family: PingFangSC, sans-serif;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        color: var(--white);
      }
      .mc_c_desc {
        display: flex;
        align-items: center;
        margin-top: vw(20);
        padding: vw(0) vw(12);
        img {
          width: vw(34);
          height: vw(34);
        }
        span {
          margin-left: vw(20);
          font-size: vw(28);
          line-height: vw(30);
          word-break: break-all;
          text-align: left;
          font-family: PingFangSC, sans-serif;
          font-weight: bold;
          font-stretch: normal;
          font-style: normal;
          color: #ff953f;
        }
      }
      .mc_c_i {
        width: 100%;
        margin-top: vw(14);
        height: 1px;
        opacity: 0.22;
        background-color: var(--bgc08);
      }
      .mc_c_buy {
        margin-top: vw(17);
        padding: 0 vw(12);
        display: flex;
        justify-content: space-between;
        align-items: center;
        .mc_c_b_left {
          display: flex;
          align-items: center;
          img {
            width: vw(20);
            height: vw(20);
          }
          span {
            margin-left: vw(10);
            font-size: vw(20);
            line-height: vw(23);
            font-family: PingFangSC, sans-serif;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            color: var(--white);
          }
        }

      }
      .mc_c_b_right {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        top: vw(249);
        left: 0;
        right: 0;
        margin: 0 auto;
        position: absolute;
        width: vw(292);
        height: vw(50);
        cursor: pointer;
        backdrop-filter: saturate(180%) blur(20px);
        background-color: rgba(255, 255, 255, 0.1);
        div {
          font-family: Ubuntu;
          font-size: vw(24);
          font-weight: bold;
          color: white;
          line-height: vw(50);
        }
        img {
          width: vw(32);
          height: vw(15);
          margin-left: vw(10);
          margin-right: vw(13);
        }
      }
    }
  }
}
</style>
