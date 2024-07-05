<template>
  <div class="promote">
    <div v-if="promoteDataList.length <= 0" class="s_empty">{{ $t("message.holding.empty") }}</div>
    <div v-else class="p_contian">
      <div class="p_c_title">{{ $t("message.wallet.IntroducingCaster") }}</div>
      <div v-for="(item,index) in promoteDataList" :key="index" class="p_c_text" :class="index %2 !== 0 ? 'p_c_text1' : ''">
        <img :src="require(`../../../assets/laboras/icon_l_level_${item.level}.svg`)" alt="logo">
        <span>{{ item.address }}</span>
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
import { getCustomerPromoteList } from '@/api/mark'
export default {
  name: "promote",
  data() {
    return {
      showPapination:false,
      promoteDataList:[],
      paginatioParams:{currentPage:1,perSize:10,totalSize:1,defaultTotalPage:5},
    };
  },
  created() {
    this.getCustomerPromoteList();
    console.log('hold page create');
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
        this.promoteDataList = [];
        this.showPapination = false;
        this.paginatioParams = {currentPage:1,perSize:10,totalSize:1,defaultTotalPage:5};
      }
    }
  },
  // 方法
  methods: {
    // 获取用户推广数据
    async getCustomerPromoteList() {
     if(!this.isConnectWallet){
        return;
      }
      const dict = {};
      dict['address'] = this.walletAddress;
      dict['page'] = this.paginatioParams.currentPage;
      const that = this;
      const result = await getCustomerPromoteList(dict);
      if (result.status === 200) {
        that.promoteDataList = [];
        that.showPapination = result.data.count > 0;
        that.paginatioParams.totalSize = result.data.count;
        result.data.result.forEach((item,index) => {
          item.address = item.address.toLowerCase();
        });
        that.promoteDataList = result.data.result;
      }else {
        that.$notify({message: result.data,duration: 2500,showClose:false,customClass:'notifyClass'});
      }
      console.log('推广列表',result);
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
  max-width: 1200px;
  height: 1000px;
  padding-top: 0.1px;
  margin: 0 auto;
  .s_empty {
    margin: 150px auto 0;
    padding-top: 144px;
    width: 534px;
    height: 248px;
    line-height: 32px;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-family: Poppins;
    color: #666;
    box-sizing: border-box;
    background-size: contain;
    background-repeat: no-repeat;
    background-image: url('../../../assets/universal/icon_empty.svg');
  }
  .p_contian {
    margin: 50px auto 0;
    height: 770px;
    border: solid 1px var(--bgc19);
    .p_c_title {
      height: 70px;
      line-height: 70px;
      font-size: 16px;
      font-family: Poppins,sans-serif;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      color: var(--white);
    }
    .p_c_text {
      height: 70px;
      border-top: solid 1px var(--bgc19);
      background-color: var(--bgc20);
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        width: 450px;
        line-height: 70px;
        font-size: 16px;
        text-align: left;
        font-family: Poppins,sans-serif;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        color: var(--bgc18);
      }
      img {
        margin-right: 30px;
        width: 40px;
        height: 40px;
      }
    }
    .p_c_text1 {
      background-color: transparent;
    }
  }
  .p_pagination {
    height: 40px;
    margin: 60px auto 0;
  }
}

</style>
