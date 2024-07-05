<template>
  <div class="markCard">
    <el-row class="mc_row">
      <el-col class="mc_col" v-for="(item, index) in shopList" :key="index">
        <div @click="handleClickItem(item)">
          <div class="mc_c_img">
            <img :src="isStringEmpty(item.coverPic)?require('../../assets/newPhones/nCreator/icon_c_bg1.png'):item.coverPic" alt="">
          </div>
          <van-image fit="cover" :src="isStringEmpty(item.picurl)?require('../../assets/newPhones/universal/icon_header_logo.png'):item.picurl" round/>
          <div class="mc_c_name text-ellipsis">{{ item.name }}</div>
          <div class="mc_c_num">#{{ item.number }}</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import {mapGetters} from 'vuex';
import {isStringEmpty} from '@/utils/validate'

export default {
  name: "shopCard",
  props: ["shopList"],
  data() {
    return {};
  },
  created() {

  },
  mounted() {

  },
  watch: {},
  // 计算属性
  computed: {
    ...mapGetters(['isConnectWallet','walletAddress']),
  },
  // 方法集合
  methods: {
    isStringEmpty,
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
      width: 285px;
      height: 303px;
      margin-top: 20px;
      margin-left: 20px;
      border-radius: 10px;
      background-color: #2c2f53;
      overflow: hidden;
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
        width: 285px;
        height: 171px;
        position: relative;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
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
            font-family: PingFangSC, sans-serif;
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
      .van-image {
        width: 80px;
        height: 80px;
        border: 5px solid white;
        margin-top: -40px;
      }
      .mc_c_name {
        margin-top: 10px;
        font-family: PingFangSC, sans-serif;
        font-size: 16px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: center;
        color: white;
      }
      .mc_c_num {
        margin-top: 10px;
        font-family: PingFangSC-Regular, sans-serif;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: center;
        color: #72729b;
      }
    }
  }
}
</style>
