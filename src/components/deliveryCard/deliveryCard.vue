<template>
  <div class="markCard">
    <el-row class="mc_row">
      <el-col class="mc_col" v-for="(item, index) in marketList" :key="index">
        <div @click="handleClickCheck(item)">
          <img class="mc_hot" :src="require(`../../assets/newPhones/nLaboratory/icon_coin_${item.headType}.png`)" alt="">
          <div class="mc_c_img">
            <img :src="item.picurl" alt="logo">
            <div v-if="item.status === '5' " class="mc_c_bg">
              <div>{{ $t("message.stock.pendingDelivery") }}</div>
            </div>
            <div v-else-if="item.status === '6' " class="mc_c_bg">
              <div>{{ $t("message.stock.pendingReceipt") }}</div>
            </div>
          </div>
          <div class="mc_c_top">
            <div class="mc_c_title">{{ item.name }}</div>
          </div>
          <div class="mc_c_bottom">
            <div class="mc_c_price">
              <img src="../../assets/newPhones/universal/icon_usdt_coin.svg" alt="">
              <span>{{ item.castingprice  | noRoundingDecimals(2) }}</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: "deliveryCard",
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
    handleClickCheck(item) {
      this.$emit("handleClickCheck",item);
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
      height: 310px;
      margin-top: 10px;
      margin-left: 10px;
      border-radius: 10px;
      overflow: hidden;
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
      .mc_hot {
        position: absolute;
        top: 10px;
        left: 10px;
        width: 30px;
        height: 30px;
      }
      .mc_c_img {
        position: relative;
        width: 232px;
        height: 232px;
        box-sizing: border-box;
        user-select: none;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
        }
        .mc_c_bg {
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
      .mc_c_top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 10px;
        padding: 0 7px;
        .mc_c_title {
          overflow: hidden;
          align-self: flex-start;
          font-size: 14px;
          line-height: 20px;
          text-align: left;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-family: "PingFang SC",sans-serif;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          color: var(--white);
        }
        .mc_c_go {
          width: 20px;
          height: 20px;
          cursor: pointer;
          user-select: none;
          img {
            width: 100%;
            height: 100%;
            user-select: none;
          }
        }

      }
      .mc_c_bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 10px;
        padding: 0 7px;
        .mc_c_price {
          display: flex;
          align-items: center;
          img {
            width: 18px;
            height: 18px;
          }
          span {
            margin-left: 8px;
            font-family: "PingFang SC",sans-serif;
            font-size: 16px;
            font-weight: 600;
            font-stretch: normal;
            font-style: normal;
            line-height: normal;
            letter-spacing: normal;
            text-align: left;
            color: #ff953f;
          }
        }
        .mc_c_time {
          display: flex;
          align-items: center;
          img {
            width: 10px;
            height: 10px;
          }
          span {
            margin-left: 6px;
            font-family: "PingFang SC",sans-serif;
            font-size: 12px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: normal;
            letter-spacing: normal;
            text-align: left;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
