<template>
  <div class="orderCard">
    <el-row class="mc_row">
      <el-col class="mc_col"
              v-for="(item, index) in marketList" :key="index">
        <div class="mc_c_body">
          <div class="mc_c_img">
            <img :src="item.picurl" alt="logo">
          </div>
          <div class="mc_c_content">
            <div class="mc_c_top">
              <div class="mc_c_title multi-ellipsis--l2">{{ item.name }}</div>
              <div class="mc_c_type">{{ getTypeText(item.status) }}</div>
            </div>
            <div class="mc_c_bottom">
              <div class="mc_c_quantity">x{{ item.count }}</div>
              <div class="mc_c_button" @click="handleClickItem(item)"><span>{{ getButtonText(item) }}</span></div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: "orderCardMb",
  props: ["marketList"],
  data() {
    return {
      typeText: '',
      buttonText: '',
    };
  },
  created() {

  },
  mounted() {

  },
  watch: {},
  // 计算属性
  computed: {
    ...mapGetters(['isConnectWallet']),
  },
  // 方法集合
  methods: {
    getTypeText(status) {
      let typeText;
      if (status === 5) {
        typeText = this.$t('message.holding.Tobedelivered');
      } else if (status === 6) {
        typeText = this.$t('message.holding.Shipped');
      } else {
        typeText = this.$t('message.holding.Completed');
      }
      return typeText;
    },
    getButtonText(item) {
      let typeText;
      if (item.status === 5) {
        typeText = item.type === 0 ? this.$t('message.holding.Ship') : this.$t('message.holding.contactTheMerchant');
      } else if (item.status === 6) {
        typeText = item.type === 0 ? this.$t('message.holding.modifyOrderNumber') : this.$t('message.holding.viewLogistics');
      } else {
        typeText = this.$t('message.holding.viewLogistics');
      }
      return typeText;
    },
    handleClickItem(item) {
      this.$emit("handleClickItem", item);
    },
  },
};
</script>

<style lang="scss" scoped>
.orderCard {
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
      width: vw(750);
      height: vw(200);
      padding: vw(20) vw(20);
      margin-bottom: vw(16);
      border-radius: vw(10);
      background-color: #272746;
      &:last-child {
        margin-bottom: 0;
      }
      .mc_c_body {
        display: flex;
        .mc_c_img {
          position: relative;
          width: vw(160);
          height: vw(160);
          box-sizing: border-box;
          border-radius: vw(10);
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
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
        .mc_c_content {
          margin-left: vw(20);
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .mc_c_top {
            display: flex;
            justify-content: space-between;
            .mc_c_title {
              max-width: vw(338);
              font-family: PingFangSC-Semibold, sans-serif;
              font-size: vw(26);
              font-weight: 600;
              font-stretch: normal;
              font-style: normal;
              line-height: normal;
              letter-spacing: normal;
              text-align: left;
              color: white;
            }
            .mc_c_type {
              font-family: PingFangSC-Regular, sans-serif;
              font-size: vw(26);
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              line-height: normal;
              letter-spacing: normal;
              text-align: left;
              color: #9a55dc;
            }
          }
          .mc_c_bottom {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            .mc_c_quantity {
              font-family: PingFangSC-Regular, sans-serif;
              font-size: vw(28);
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              line-height: normal;
              letter-spacing: normal;
              text-align: left;
              color: #ff953f;
            }
            .mc_c_button {
              min-width: vw(200);
              height: vw(60);
              padding: 0 vw(10);
              object-fit: contain;
              border-radius: vw(10);
              box-shadow: 0 0 vw(10) 0 rgba(123, 40, 219, 0.6);
              background-image: linear-gradient(82deg, #f109b4 0%, #622fe3 101%);
              span {
                font-family: PingFangSC, sans-serif;
                font-size: vw(24);
                font-weight: 500;
                font-stretch: normal;
                font-style: normal;
                line-height: vw(60);
                letter-spacing: normal;
                text-align: center;
                color: #fff;
              }
            }
          }
        }
      }
    }
  }
}
</style>
