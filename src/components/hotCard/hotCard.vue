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
  name: "hotCard",
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
  @include size(100%, 100%);
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
      @include size(254px, 380px);
      margin-top: 40px;
      margin-left: 20px;
      padding: 0 15px;
      border-radius: 16px;
      background-color: var(--bgc07);
      cursor: pointer;
      user-select: none;
      &:nth-child(4n + 1) {
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
      .mc_c_img {
        position: relative;
        width: 224px;
        height: 224px;
        margin-top: 13px;
        box-sizing: border-box;
        border-radius: 11px;
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
            width: 138px;
            height: 24px;
            font-size: 14px;
            font-weight: 500;
            line-height: 24px;
            font-stretch: normal;
            font-style: normal;
            font-family: Poppins,sans-serif;
            box-sizing: border-box;
            background-size: contain;
            background-repeat: no-repeat;
            //background-image: url('../../assets/laboras/icon_order_bg.svg');
            color: var(--white);
          }
        }
        .mc_c_art {
          position: absolute;
          top: 0;
          left: 10px;
          width: 44px;
          height: 48px;
          z-index: 9;
        }
      }
      .mc_c_title {
        overflow: hidden;
        align-self: flex-start;
        margin-top: 12px;
        font-size: 15px;
        line-height: 18px;
        text-align: left;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-family: Montserrat,sans-serif;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        color: var(--white);
      }
      .mc_c_desc {
        margin-top: 4px;
        word-break: break-all;
        text-align: left;
        span {
          font-size: 14px;
          line-height: 22px;
          word-break: break-all;
          text-align: left;
          font-family: Montserrat,sans-serif;
          font-weight: bold;
          font-stretch: normal;
          font-style: normal;
          color: var(--primary);
        }
      }
      .mc_c_desc1 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        span {
          font-size: 14px;
          line-height: 22px;
          word-break: break-all;
          text-align: left;
          font-family: Montserrat,sans-serif;
          font-weight: bold;
          font-stretch: normal;
          font-style: normal;
          color: var(--primary);
          &:last-child {
            line-height: 18px;
            font-weight: 500;
            color: var(--white);
          }
        }
      }
      .mc_c_i {
        width: 100%;
        margin-top: 10px;
        height: 1px;
        opacity: 0.22;
        background-color: var(--bgc08);
      }
    }
  }
}
</style>
