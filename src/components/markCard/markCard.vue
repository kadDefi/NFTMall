<template>
  <div class="markCard">
    <el-row class="mc_row">
      <el-col class="mc_col" v-for="(item, index) in marketList" :key="index">
        <img class="mc_hot" :src="require(`../../assets/newPhones/nLaboratory/icon_coin_${item.headType}.png`)" alt="">
        <!-- <router-link target="_blank" :to="{path:'/nftdetial',query:{item: item.tokenid,item1:true,item2:isEnglish}}"> -->
        <div class="mc_c_img"><img :src="item.picurl" alt="logo" @click="handleClickCollectionNFT(item)"></div>
        <!-- </router-link>   -->
        <div class="mc_c_top">
          <div class="mc_c_title">{{ item.name }}</div>
          <div class="mc_c_go" @click="handleClickCollectionNFT(item)"><img src="../../assets/newPhones/nMarket/icon_m_buy.svg" alt=""></div>
        </div>
        <div class="mc_c_bottom">
          <div class="mc_c_price">
            <img src="../../assets/newPhones/universal/icon_usdt_coin.svg" alt="">
            <span>{{ item.sellprice  | noRoundingDecimals(2) }}</span>
          </div>
          <div class="mc_c_time">
            <img src="../../assets/newPhones/nMarket/icon_m_sz.svg" alt="logo">
            <span>{{ countdownTimeList[index] }}</span>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';
import { timeFromNow } from '@/utils/computing'

export default {
  name: "markCard",
  props: ["marketList"],
  data() {
    return {
      isEnglish:false,
      timingTimer:null, // 定时器
      countdownTimeList:[],// 倒计时数据数组
    };
  },
  created() {
    this.isEnglish = window.localStorage.getItem("lang") !== "zh";
    if (this.marketList.length > 0 ){
      const that = this;
      this.marketList.forEach((item,index,array) => {
        const timeString = timeFromNow(true,item.updateTime);
        that.countdownTimeList.splice(index,1,timeString);
      });
      this.startOpenTimerCountdown();
    }
    console.log('creat markCard card');
  },
  mounted() {
  },
  destroyed() {
    if(this.timingTimer){
      clearInterval(this.timingTimer);
      this.timingTimer = null;
      console.log('退出页面关闭定时器');
    }
  },
  watch:{
    '$i18n.locale'(nval,oval) {
       if(nval === 'zh') {
         this.isEnglish = false;
       } else {
         this.isEnglish = true;
       }
       console.log('监听到语言的切换');
    },
    marketList(val,oval) {
      if (val.length > 0 ){
        const that = this;
        val.forEach((item,index,array) => {
          const timeString = timeFromNow(true,item.updateTime);
          that.countdownTimeList.splice(index,1,timeString);
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
    // 点击回调
    handleViewOnlyMethod(item){
      this.$emit("handleViewOnlyMethod",item);
    },
    // 跳转详情页面
    handleClickCollectionNFT(item) {
      if(!this.isConnectWallet) {
        this.$notify({message: this.$t("message.casting.connectWallet"),duration: 2500,showClose:false,customClass:'notifyClass'});
        return;
      }
      // item = ID  item1 = 是否是商店商品
      const routeUrl = this.$router.resolve({path: '/nftdetial',query:{item: item.tokenid,item1:false}});
      window.open(routeUrl.href, '_blank');
    },
    // 开启定时器
    startOpenTimerCountdown(){
      if(this.timingTimer){
        clearInterval(this.timingTimer);
        this.timingTimer = null;
        console.log('关闭定时器，重新开启');
      }
      // 开启定时器
      const that = this;
      this.timingTimer = setInterval(() => {
        that.marketList.forEach((item,index,array) => {
          const timeString = timeFromNow(true,item.updateTime);
          that.countdownTimeList.splice(index,1,timeString);
        });
      }, 60000);
    },
  },
};
</script>

<style lang="scss" scoped>
.markCard {
  width: 100%;
  height: 100%;
  ::v-deep.el-row::before {
    content: none !important;
  }
  ::v-deep.el-row::after {
    content: none !important;
  }

  .mc_row {
    display: flex;
    flex-wrap: wrap;
    .mc_col {
      position: relative;
      width: 214px;
      height: 290px;
      margin-top: 20px;
      margin-left: 8px;
      border-radius: 10px;
      overflow: hidden;
      background-color: #2c2f53;
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
      .mc_hot {
        position: absolute;
        top: 10px;
        left: 10px;
        width: 30px;
        height: 30px;
      }
      .mc_c_img {
        width: 214px;
        height: 214px;
        box-sizing: border-box;
        user-select: none;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
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
