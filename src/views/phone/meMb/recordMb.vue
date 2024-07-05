<template>
  <div class="promote">
    <div class="p_title" @click="handleClickFilter">
      <span class="p_title_select">{{ filterDesc }}</span>
      <img src="../../../assets/laboras/h5_icon_xl.svg" alt="logo">
    </div>
    <div v-show="isShowFilter" class="p_select">
      <span :class="recordType === 0 ? 'p_title_select' :''" @click="handleClickRecord(0)">{{ $t("message.smFreed.all") }}</span>
      <span :class="recordType === 1 ? 'p_title_select' :''" @click="handleClickRecord(1)">{{ $t("message.smFreed.casting") }}</span>
      <span :class="recordType === 2 ? 'p_title_select' :''" @click="handleClickRecord(2)">{{ $t("message.smFreed.sell") }}</span>
      <span :class="recordType === 3 ? 'p_title_select' :''" @click="handleClickRecord(3)">{{ $t("message.smFreed.buy") }}</span>
      <span :class="recordType === 4 ? 'p_title_select' :''" @click="handleClickRecord(4)">{{ $t("message.smFreed.delivery") }}</span>
      <span :class="recordType === 5 ? 'p_title_select' :''" @click="handleClickRecord(5)">{{ $t("message.smFreed.isTheDelivery") }}</span>
      <span :class="recordType === 6 ? 'p_title_select' :''" @click="handleClickRecord(6)">{{ $t("message.smFreed.destroy") }}</span>
      <!--<span :class="recordType === 7 ? 'p_title_select' :''" @click="handleClickRecord(7)">{{ $t("message.smFreed.beDestroyed") }}</span>-->
    </div>
    <div v-if="recordDataList.length <= 0" class="s_empty">{{ $t("message.holding.empty") }}</div>
    <div v-else class="p_contian">
      <div class="p_c_body" v-for="(item,index) in recordDataList" :key="index">
        <div class="p_c_b_left">
          <img :src="item.pic" alt="logo">
          <!--<img v-show="item.hotType === 1" class="hot" src="../../../assets/laboras/h5_icon_hot.png" alt="logo">-->
        </div>
        <div class="p_c_b_right">
          <div class="p_c_b_r_left">
            <span>{{ item.name }}</span>
            <span>{{ recordTypeDesc(item) }}</span>
          </div>
          <div class="p_c_b_r_right">
            <!--<span>{{  $t("message.smFreed.castingGAKA") }}  {{ item.frozengaka | roundingDecimals(4) }}</span>-->
            <span>{{ `${ parseFloat(item.usdtPrice) > 0 ? `+${item.usdtPrice}`  : item.usdtPrice  }` | roundingDecimals(4) }} ALAD</span>
          </div>
          <div class="p_c_b_r_time">{{ item.time }}</div>
        </div>
      </div>
    </div>
    <div v-show="showPapination" class="p_pagination">
      <pagination :params="paginatioParams" @changePage="changePage"></pagination>
    </div>
  </div>
</template>

<script>

import {chuDivision} from "@/utils/computing";
const settingConfig = require('../../../settings');
import { mapGetters } from 'vuex';
import {getHistoryRecordListData,getCustomerPromoteList} from '@/api/mark'

export default {
  name: "recordMb",
  data() {
    return {
      recordType:0,
      filterDesc:'',
      isShowFilter:false,
      showPapination:false,
      recordDataList:[],
      paginatioParams:{currentPage:1,perSize:10,totalSize:1,defaultTotalPage:5},
    };
  },
  created() {
    this.getCustomerPromoteList(true);
    this.filterDesc = this.recordTypeDesc({status:0});
    console.log('record page create');
  },
  mounted() {

  },
  destroyed() {

  },
  // 计算属性
  computed: {
    ...mapGetters(['isConnectWallet','walletAddress']),
  },
  // 监听属性改变
  watch:{
    isConnectWallet(val,oval) {
      if (val) {
        this.getCustomerPromoteList(true);
      }else {
        this.recordDataList = [];
        this.showPapination = false;
        this.paginatioParams = {currentPage:1,perSize:10,totalSize:1,defaultTotalPage:5};
      }
    }
  },
  // 方法
  methods: {
    // 操作类型
    recordTypeDesc(item) {
      // type： 0:全部数据，1: 铸造,2:出售,3:购买,4:交割,5:被交割,6:销毁,7:被销毁
      let freedDesc = this.$t("message.smFreed.all");
      if (item.status === 1) {
        freedDesc = this.$t("message.smFreed.casting");
      }else  if(item.status === 2) {
        freedDesc = this.$t("message.smFreed.sell");
      }else  if(item.status === 3) {
        freedDesc = this.$t("message.smFreed.buy");
      }else  if(item.status === 4) {
        freedDesc = this.$t("message.smFreed.delivery");
      }else  if(item.status === 5) {
        freedDesc = this.$t("message.smFreed.isTheDelivery");
      }else  if(item.status === 6) {
        freedDesc = this.$t("message.smFreed.destroy");
      }else  if(item.status === 7) {
        freedDesc = this.$t("message.smFreed.beDestroyed");
      }
      return freedDesc;
    },
    //
    handleClickFilter() {
      this.isShowFilter = !this.isShowFilter;
    },
    // 切换了类型
    handleClickRecord(index) {
      this.recordType = index;
      this.filterDesc = this.recordTypeDesc({status:index});
      this.isShowFilter = false;
      this.getCustomerPromoteList(true);
    },
    // 获取用户在持NFT数据
    async getCustomerPromoteList(isRefersh) {
      if(!this.isConnectWallet){
        return;
      }
      const dict = {};
      // type: 0:全部数据，1: 铸造,2:出售,3:购买,4:交割,5:被交割,6:销毁,7:被销毁
      dict['type'] = this.recordType;
      // 用户地址
      dict['address'] = this.walletAddress;
      // 当前第几页
      dict['page'] = isRefersh ? 1 : this.paginatioParams.currentPage;
      const that = this;
      const result = await getHistoryRecordListData(dict);
      if (result.status === 200) {
        that.recordDataList = [];
        that.showPapination = result.data.count > 0;
        that.paginatioParams.totalSize = result.data.count;
        if (isRefersh) {
          that.paginatioParams.currentPage = 1;
        }
        result.data.outData.forEach((item) => {
          const newStr = item.pic.indexOf("https");
          if (newStr === -1) {
            item.pic = `${settingConfig.ipfsNFTUrl + item.pic}`
          }
          //item.usdtPrice = chuDivision(item.usdtPrice,18);
        });
        this.recordDataList = result.data.outData;
      }else {
        that.$notify({message: result.data,duration: 2500,showClose:false,customClass:'notifyClass'});
      }
      console.log('记录列表',result);
    },
    // 修改页数
    changePage(params) {
      if (params.currentPage === 0) {
        return;
      }
      this.getCustomerPromoteList(false);
      console.log('修改页数params',params);
    },
  },
};
</script>

<style lang="scss" scoped>

.promote {
  padding-top: 0.1px;
  padding-bottom: vw(150);
  margin: 0 auto;
  position: relative;
  width: vw(690);
  //min-height: vw(1600);
  .s_empty {
    margin: vw(200) auto 0;
    padding-top: vw(164);
    width: vw(534);
    height: vw(248);
    line-height: vw(46);
    font-size: vw(28);
    font-weight: 600;
    font-stretch: normal;
    font-family: Poppins;
    color: #666;
    box-sizing: border-box;
    background-size: contain;
    background-repeat: no-repeat;
    background-image: url('../../../assets/universal/h5_icon_empty.svg');
  }
  .p_title {
    height: vw(82);
    margin-top: vw(30);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    user-select: none;
    box-sizing: border-box;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    //background-image: url("../../../assets/laboras/h5_icon_r_select.svg");
    span {
      line-height: vw(82);
      font-size: vw(26);
      font-weight:normal;
      text-align: center;
      color: var(--primary);
      font-family: Poppins,sans-serif;
    }
    img {
      margin-left: vw(30);
      width: vw(22);
      height: vw(14);
    }
  }
  .p_select {
    width: vw(690);
    height: vw(490);
    position: absolute;
    top: vw(112);
    left: 0;
    z-index: 1;
    cursor: pointer;
    user-select: none;
    box-sizing: border-box;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    //background-image: url("../../../assets/laboras/h5_icon_bk.svg");
    display: flex;
    flex-direction: column;
    align-items: center;
    span {
      line-height: vw(70);
      font-size: vw(26);
      font-weight: normal;
      text-align: center;
      color: var(--white);
      cursor: pointer;
      user-select: none;
      font-family: Poppins,sans-serif;
    }
    .p_title_select {
      color: var(--primary);
    }
  }
  .p_contian {
    //height: vw(1200);
    margin: vw(30) auto 0;
    .p_c_body {
      height: vw(130);
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: solid 1px #414141;
      .p_c_b_left {
        position: relative;
        width: vw(80);
        height: vw(80);
        img {
          width: 100%;
          height: 100%;
          //border-radius: vw(10);
        }
        .hot {
          position: absolute;
          top: 0;
          left: -2px;
          width: vw(28);
          height: vw(28);
        }
      }
      .p_c_b_right {
        width: vw(590);
        .p_c_b_r_left {
          display: flex;
          justify-content: space-between;
          align-items: center;
          span {
            line-height: vw(27);
            font-size: vw(24);
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            font-family: Ubuntu,sans-serif;
            color: #fff;
            &:first-child {
              width: vw(400);
              overflow: hidden;
              text-align: left;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
        .p_c_b_r_right {
          margin-top: vw(10);
          display: flex;
          justify-content: space-between;
          align-items: center;
          span {
            line-height: vw(27);
            font-size: vw(24);
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            font-family: Ubuntu,sans-serif;
            color: var(--primary);
          }
        }
        .p_c_b_r_time {
          margin-top: vw(10);
          line-height: vw(27);
          font-size: vw(24);
          text-align: left;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          font-family: Ubuntu,sans-serif;
          color: #fff;
        }
      }
    }
  }
  .p_pagination {
    height: vw(44);
    margin: vw(60) auto 0;
  }
}

</style>



