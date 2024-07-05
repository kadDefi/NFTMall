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
          <div class="mc_c_title marginTop9" :class="item.status === '0' || item.status === '8' ? 'marginTop10' : '' " >{{ $t("message.holding.OriginatingPrice") }}</div>
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
import { mapGetters } from 'vuex';
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
  watch:{

  },
  // 计算属性
  computed: {
    ...mapGetters(['isConnectWallet']),
  },
  // 方法集合
  methods: {
    handleClickItem(item){
      this.$emit("handleClickItem",item);
    },
  },
};
</script>

<style lang="scss" scoped>
.markCard {
  width: 100%;
  height: 100%;
  /deep/.el-row::before {
    content: none !important;
  }
  /deep/.el-row::after {
    content: none !important;
  }
  .mc_row {
    display: flex;
    flex-wrap: wrap;
    .mc_col {
      position: relative;
      width: 232px;
      height: 360px;
      margin-top: 10px;
      margin-left: 10px;
      border-radius: 10px;
      overflow: hidden;
      cursor: pointer;
      user-select: none;
      background-color: #2c2f53;
      &:nth-child(5n + 1) {
        margin-left: 0;
      }
      &:nth-child(1) {
        margin-top: 0;
      }
      &:nth-child(2) {
        margin-top: 0;
      }
      &:nth-child(3) {
        margin-top: 0;
      }
      &:nth-child(4) {
        margin-top: 0;
      }
      &:nth-child(5) {
        margin-top: 0;
      }
      .mc_c_img {
        width:232px;
        height: 232px;
        overflow: hidden;
        position: relative;
        img {
          width: 100%;
          height: 100%;
          border-radius: 10px;
        }
        .mc_c_bg {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          box-sizing: border-box;
          background-color: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          div {
            position: absolute;
            left: 26px;
            bottom: 10px;
            width: 180px;
            height: 40px;
            border-radius: 20px;
            background-color: #343650;
            font-family: PingFangSC,sans-serif;
            font-size: 14px;
            font-weight: 500;
            font-stretch: normal;
            font-style: normal;
            line-height: 40px;
            letter-spacing: normal;
            text-align: center;
            color: #fff;
          }
        }
        .mc_c_art {
          position: absolute;
          top: 10px;
          left: 10px;
          width: 30px;
          height: 30px;
        }
      }
      .mc_c_title {
        align-self: flex-start;
        margin-top: 10px;
        padding: 0 12px;
        font-size: 14px;
        line-height:20px;
        text-align: left;
        font-family: PingFangSC,sans-serif;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        color: var(--white);
      }
      .mc_c_desc {
        display: flex;
        align-items: center;
        margin-top: 6px;
        padding: 0 12px;
        img {
          width: 18px;
          height: 18px;
        }
        span {
          margin-left: 8px;
          font-size: 14px;
          line-height: 20px;
          word-break: break-all;
          text-align: left;
          font-family: PingFangSC,sans-serif;
          font-weight: 500;
          font-stretch: normal;
          font-style: normal;
          color: #ff953f;
        }
      }
      .mc_c_desc1 {
        margin-top: 5px;
      }
      .mc_c_i {
        width: 100%;
        margin-top: 8px;
        height: 1px;
        opacity: 0.22;
        background-color: var(--bgc08);
      }
      .marginTop9{
        margin-top: 6px;
      }
      .marginTop10 {
        margin-top: 15px;
      }
    }
  }
}
</style>
