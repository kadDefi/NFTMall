<template>
  <div class="hotCard">
    <el-row class="mc_row">
      <el-col class="mc_col" v-for="(item, index) in marketList" :key="index">
        <div @click="handleClickItem(item)">
          <div class="mc_c_img">
            <img :src="item.picurl" alt="logo">
            <div v-if="item.status == 5 " class="mc_c_bg">
              <div>{{ $t("message.stock.pendingDelivery") }}</div>
            </div>
            <!--<div v-else-if="item.status == 1 " class="mc_c_bg">
              <div>{{ $t("message.stock.orderCompleted") }}</div>
            </div>-->
          </div>
          <div class="mc_c_title">{{ item.nftName }}</div>
          <div class="mc_c_desc mc_c_desc1">
            <span>{{ item.usdtPrice | roundingDecimals(2) }} USDT</span>
            <span>x{{item.count }}</span>
          </div>
          <div class="mc_c_i"></div>
          <div class="mc_c_title">{{ $t("message.holding.totalPrice") }}</div>
          <div class="mc_c_desc">
            <span>{{ item.totalValue | roundingDecimals(4) }} ALAD</span>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: "hotCardMb",
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
.hotCard {
  width: 100%;
  height: 100%;
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
      min-height: vw(500);
      margin-top: vw(20);
      margin-left: vw(20);
      padding: 0px vw(20);
      border: vw(1) solid #707070;
      border-radius: vw(20);
      background-color: var(--bgc07);
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
        position: relative;
        width: vw(292);
        height: vw(292);
        margin-top: vw(27);
        box-sizing: border-box;
        border-radius: vw(16);
        border: solid 1px var(--bgc08);
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
        .mc_c_bg {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          box-sizing: border-box;
          //border-radius: 11px;
          background-color: var(--bgc23);
          display: flex;
          align-items: center;
          justify-content: center;
          div {
            width: vw(194);
            height: vw(50);
            font-size: vw(24);
            font-weight: 500;
            line-height: vw(50);
            font-stretch: normal;
            font-style: normal;
            font-family: Poppins,sans-serif;
            box-sizing: border-box;
            background-size: contain;
            background-repeat: no-repeat;
            //background-image: url('../../assets/laboras/h5_icon_order_bg.svg');
            color: var(--white);
          }
        }
        .mc_c_art {
          position: absolute;
          top: 0;
          left: vw(10);
          width: vw(44);
          height: vw(48);
          z-index: 9;
        }
      }
      .mc_c_title {
        overflow: hidden;
        align-self: flex-start;
        margin-top: vw(19);
        font-size: vw(24);
        line-height: vw(27);
        text-align: left;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-family: Montserrat,sans-serif;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        color: var(--white);
      }
      .marginTop9{
        margin-top: vw(9);
      }
      .mc_c_desc {
        margin-top: vw(3);
        margin-bottom: vw(20);
        word-break: break-all;
        text-align: left;
        span {
          font-size: vw(26);
          line-height: vw(31);
          word-break: break-all;
          text-align: left;
          font-family: Montserrat,sans-serif;
          font-weight: bold;
          font-stretch: normal;
          font-style: normal;
          color: var(--primary);
          overflow-x: hidden;
        }
      }
      .mc_c_desc1 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        span {
          font-size: vw(26);
          line-height: vw(31);
          word-break: break-all;
          text-align: left;
          font-family: Montserrat,sans-serif;
          font-weight: bold;
          font-stretch: normal;
          font-style: normal;
          color: var(--primary);
          &:last-child {
            line-height: vw(27);
            font-size: vw(24);
            font-weight: 500;
            color: var(--white);
          }
        }
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

