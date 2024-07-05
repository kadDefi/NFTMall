<template>
  <div class="markCard">
    <el-row class="mc_row">
      <el-col class="mc_col" v-for="(item, index) in marketList" :key="index">
        <div @click="handleClickItem(item)">
          <div class="mc_c_img">
            <img :src="item.picurl" alt="logo">
            <img class="mc_c_art" :src="require(`../../assets/newPhones/nLaboratory/icon_coin_${item.headType}.png`)" alt="">
            <div v-if="item.headType === 1 && item.type === 0 && item.status === '2' " class="mc_c_bg">
              <div>{{ $t("message.labora.delivery") }}</div>
            </div>
            <div v-else-if="item.status === '0' " class="mc_c_bg">
              <div>{{ $t("message.stock.underReview") }}</div>
            </div>
            <div v-else-if="item.status === '5' " class="mc_c_bg">
              <div>{{ $t("message.stock.pendingDelivery") }}</div>
            </div>
            <div v-else-if="item.status === '6' " class="mc_c_bg">
              <div>{{ $t("message.stock.pendingReceipt") }}</div>
            </div>
            <div v-else-if="item.status === '8' " class="mc_c_bg">
              <div>{{ $t("message.stock.toBeReleased") }}</div>
            </div>
          </div>
          <div class="mc_c_title">{{ item.nftName }}</div>
          <div v-if="item.status === '0' || item.status === '8' " class="mc_c_desc1"></div>
          <div v-else class="mc_c_desc">
            <img src="../../assets/newPhones/universal/icon_alad_coin.svg" alt="">
            <span>{{ item.aladprice | roundingDecimals(4) }}</span>
          </div>
          <div class="mc_c_i"></div>
          <div class="mc_c_title marginTop9">{{ $t("message.holding.OriginatingPrice") }}</div>
          <div class="mc_c_desc">
            <img src="../../assets/newPhones/universal/icon_usdt_coin.svg" alt="">
            <span>{{ item.castingprice | roundingDecimals(2) }}</span>
            <!--  + {{ item.frozengaka | roundingDecimals(2) }} GAKA-->
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {mapState} from 'vuex';

export default {
  name: "holdCard",
  props: ["marketList"],
  data() {
    return {
    };
  },
  created() {

  },
  mounted() {

  },
  watch: {},
  // 计算属性
  computed: {
    ...mapState(['isConnectWallet']),
  },
  // 方法集合
  methods: {
    handleClickItem(item) {
      this.$emit("handleClickItem", item);
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
    display: flex;
    flex-wrap: wrap;
    .mc_col {
      position: relative;
      width: vw(335);
      height: vw(540);
      margin-top: vw(20);
      margin-left: vw(20);
      border-radius: vw(10);
      background-color: #272746;
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
        overflow: hidden;
        position: relative;
        img {
          width: 100%;
          height: 100%;
          border-radius: vw(10);
        }
        .mc_c_bg {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          box-sizing: border-box;
          background-color: var(--bgc23);
          display: flex;
          align-items: center;
          justify-content: center;
          div {
            width: vw(260);
            height: vw(60);
            font-size: vw(24);
            font-weight: 500;
            line-height: vw(60);
            font-stretch: normal;
            font-style: normal;
            font-family: PingFangSC,sans-serif;
            background-color: #343650;
            border-radius: vw(30);
            color: var(--white);
          }
        }
        .mc_c_art {
          position: absolute;
          top: vw(10);
          left: 0;
          width: vw(60);
          height: vw(60);
        }
      }
      .mc_c_title {
        align-self: flex-start;
        margin-top: vw(15);
        padding: vw(0) vw(12);
        font-size: vw(24);
        line-height: vw(27);
        text-align: left;
        font-family: PingFangSC,sans-serif;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        color: var(--white);
      }
      .marginTop9{
        margin-top: vw(12);
      }
      .mc_c_desc {
        display: flex;
        align-items: center;
        margin-top: vw(15);
        padding: vw(0) vw(12);
        img {
          width: vw(34);
          height: vw(34);
        }
        span {
          margin-left: vw(10);
          font-size: vw(28);
          line-height: vw(30);
          word-break: break-all;
          text-align: left;
          font-family: PingFangSC,sans-serif;
          font-weight: 600;
          font-stretch: normal;
          font-style: normal;
          color: #ff953f;
        }
      }
      .mc_c_desc1 {
        margin-top: vw(20);
      }
      .mc_c_i {
        width: 100%;
        margin-top: vw(10);
        height: vw(1);
        opacity: 0.22;
        background-color: var(--bgc08);
      }
    }
  }
}
</style>
