<template>
  <div class="order-card">
    <el-row class="mc_row">
      <el-col class="mc_col"
              v-for="(item, index) in marketList" :key="index">
        <div class="mc_c_body">
          <div class="mc_c_img">
            <img :src="item.picurl" alt="logo">
          </div>
          <div class="mc_c_title">
            {{ item.name }}
          </div>
          <div class="mc_c_value">
            x{{ item.count }}
          </div>
          <div class="mc_c_line"></div>
          <div class="mc_c_type">
            {{ getTypeText(item.status) }}
          </div>
          <div class="mc_c_line"></div>
          <div class="mc_c_div">
            <div class="mc_c_button" @click="handleClickItem(item)">
              <span>{{ getButtonText(item) }}</span>
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
  name: "orderCard",
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
.order-card {
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
      width: 1147px;
      height: 160px;
      padding: 25px 0;
      margin-bottom: 20px;
      border-radius: 10px;
      background-color: #272746;
      &:last-child {
        margin-bottom: 0;
      }
      .mc_c_body {
        display: flex;
        align-items: center;
        .mc_c_img {
          margin-left: 22px;
          width: 110px;
          height: 110px;
          box-sizing: border-box;
          border-radius: 10px;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .mc_c_title {
          width: 320px;
          margin-left: 20px;
          font-family: PingFangSC, sans-serif;
          font-size: 16px;
          font-weight: 500;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          text-align: left;
          color: var(--white);
        }
        .mc_c_value {
          width: 180px;
          margin-left: 20px;
          margin-right: 40px;
          font-family: PingFangSC-Semibold, sans-serif;
          font-size: 16px;
          font-weight: 600;
          font-stretch: normal;
          font-style: normal;
          line-height: 2.13;
          letter-spacing: normal;
          text-align: right;
          color: #ff953f;
        }
        .mc_c_line {
          width: 0;
          height: 114px;
          border: 1px dashed #707070;
        }
        .mc_c_type {
          width: 215px;
          font-family: PingFangSC-Regular, sans-serif;
          font-size: 16px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 2.13;
          letter-spacing: normal;
          text-align: center;
          color: #9a55dc;
        }
        .mc_c_div {
          width: 216px;
          display: flex;
          justify-content: center;
          .mc_c_button {
            min-width: 140px;
            height: 50px;
            padding: 0 10px;
            object-fit: contain;
            border-radius: 10px;
            box-shadow: 0 0 10px 0 rgba(123, 40, 219, 0.6);
            background-image: linear-gradient(82deg, #f109b4 0%, #622fe3 101%);
            cursor: pointer;
            span {
              font-family: PingFangSC, sans-serif;
              font-size: 16px;
              font-weight: 500;
              font-stretch: normal;
              font-style: normal;
              line-height: 50px;
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
</style>