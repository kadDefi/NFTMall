<template>
  <div class="promote">
    <div v-if="freedDataList.length <= 0" class="s_empty">{{ $t("message.holding.empty") }}</div>
    <div v-else class="p_contian">
<!--      <div class="p_c_title">-->
<!--        <span>{{ $t("message.smFreed.typesOf") }}</span>-->
<!--        <span>{{ $t("message.smFreed.quantity") }}</span>-->
<!--        <span>{{ $t("message.smFreed.time") }}</span>-->
<!--      </div>-->
      <div class="p_c_text" v-for="(item,index) in freedDataList" :key="index">
        <div class="p_c_item">
          <span>{{ freedTypeDesc(1,item) }}</span>
          <span>{{ freedTypeDesc(2,item) }}</span>
        </div>
        <div class="p_c_item">
          <span>{{ item.days }}</span>
          <span class="p_c_item_amount">{{ item.amount | tanferUnitData(18) | notRoundingDecimals(4) }}</span>
        </div>
      </div>
    </div>
    <div v-show="showPapination" class="p_pagination">
      <pagination :params="paginatioParams" @changePage="changePage"></pagination>
    </div>
  </div>
</template>

<script>
const settingConfig = require('../../../settings');
import { mapGetters } from 'vuex';
import { getUserReleaseListData } from '@/api/mark'
export default {
  name: "freedMb",
  data() {
    return {
      showPapination:false,
      freedDataList:[],
      paginatioParams:{currentPage:1,perSize:10,totalSize:1,defaultTotalPage:5},
    };
  },
  created() {
    this.getCustomerPromoteList();
    console.log('freedMb page create');
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
        this.getCustomerPromoteList();
      }else {
        this.freedDataList = [];
        this.showPapination = false;
        this.paginatioParams = {currentPage:1,perSize:10,totalSize:1,defaultTotalPage:5};
      }
    }
  },
  // 方法
  methods: {
    // 释放类型
    freedTypeDesc(index,item) {
      let freedDesc = this.$t("message.smFreed.dynamicSF");
      if (index === 1) {
        // type： 1: 动态加速    2:级别加速    3: 推广奖励
        if (item.type === 2) {
          freedDesc = this.$t("message.smFreed.levelSF");
        }else  if(item.type === 3) {
          freedDesc = this.$t("message.smFreed.promotionSF");
        }
      }else  if (index === 2) {
        // status： 0: 未释放   1:已经释放
        freedDesc = this.$t("message.smFreed.pendingRelease");
        if (item.status === 1) {
          freedDesc = this.$t("message.smFreed.released");
        }
      }
      return freedDesc;
    },
    // 获取用户在持NFT数据
    async getCustomerPromoteList() {
      if(!this.isConnectWallet){
        return;
      }
      const dict = {};
      dict['address'] = this.walletAddress; // 用户地址
      dict['page'] = this.paginatioParams.currentPage; // 当前第几页
      const that = this;
      const result = await getUserReleaseListData(dict);
      if (result.status === 200) {
        that.freedDataList = [];
        that.showPapination = result.data.count > 0;
        that.paginatioParams.totalSize = result.data.count;
        that.freedDataList = result.data.outData;
      }else {
        that.$notify({message: result.data,duration: 2500,showClose:false,customClass:'notifyClass'});
      }
      console.log('释放列表',result);
    },
    // 修改页数
    changePage(params) {
      if (params.currentPage === 0) {
        return;
      }
      this.getCustomerPromoteList();
      console.log('修改页数params',params);
    },
  },
};
</script>

<style lang="scss" scoped>

.promote {
  //min-height: vw(1200);
  //height: 1000px;
  padding-top: 0.1px;
  padding-bottom: vw(150);
  margin: 0 auto;
  width: vw(690);
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
  .p_contian {
    margin-top: vw(30);
    //box-sizing: border-box;
    //border: solid 1px var(--bgc17);
    //.p_c_title {
    //  height: vw(82);
    //  display: flex;
    //  span {
    //    flex: 1;
    //    line-height: vw(82);
    //    font-size: vw(24);
    //    font-weight: normal;
    //    text-align: center;
    //    font-family: Ubuntu,sans-serif;
    //    color: var(--white);
    //  }
    //}
    .p_c_text {
      height: vw(90);
      border-bottom: solid 1px #414141;
      .p_c_item {
        margin-top: vw(15);
        display: flex;
        justify-content: space-between;
        span {
          line-height: vw(27);
          font-size: vw(24);
          font-weight: normal;
          font-family: Ubuntu,sans-serif;
          color: #fff;
        }
        .p_c_item_amount {
          color: var(--primary);
        }
      }
    }
  }
  .p_pagination {
    height: vw(40);
    margin: vw(40) auto 0;
  }
}

</style>


