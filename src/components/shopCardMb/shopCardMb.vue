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
import {mapGetters, mapState} from 'vuex';
import {isStringEmpty} from '@/utils/validate'

export default {
  name: "shopCardMb",
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
      width: vw(335);
      height: vw(382);
      margin-top: vw(30);
      margin-left: vw(20);
      border-radius: vw(20);
      background-color: #272746;
      overflow: hidden;
      &:nth-child(2n + 1) {
        margin-left: 0;
      }
      .mc_c_img {
        width: vw(335);
        height: vw(201);
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
        width: vw(110);
        height: vw(110);
        border: vw(5) solid white;
        margin-top: vw(-55);
      }
      .mc_c_name {
        margin-top: vw(10);
        font-family: PingFangSC, sans-serif;
        font-size: vw(26);
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: center;
        color: white;
      }
      .mc_c_num {
        margin-top: vw(20);
        font-family: PingFangSC-Regular, sans-serif;
        font-size: vw(24);
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
