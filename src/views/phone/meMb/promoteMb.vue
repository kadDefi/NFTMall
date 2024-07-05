<template>
  <div class="promote">
    <div class="p_c_title">{{ $t("message.wallet.IntroducingCaster") }}</div>
    <div v-if="promoteDataList.length <= 0" class="s_empty">{{ $t("message.holding.empty") }}</div>
    <div v-else class="p_contian">
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
const settingConfig = require('../../../settings.js');
import {mapGetters} from 'vuex';
import {getCustomerPromoteList} from '@/api/mark'

export default {
  name: "promote",
  data() {
    return {
      showPapination: false,
      promoteDataList: [],
      paginatioParams: { currentPage: 1, perSize: 10, totalSize: 1, defaultTotalPage: 5 },
    };
  },
  created() {
    this.getCustomerPromoteList();
    console.log('promoteMb page create');
  },
  mounted() {

  },
  destroyed() {

  },
  // 计算属性
  computed: {
    ...mapGetters(['isConnectWallet', 'walletAddress']),
  },
  // 监听属性改变
  watch: {
    isConnectWallet(val, oval) {
      if (val) {
        this.getCustomerPromoteList();
      }
    }
  },
  // 方法
  methods: {
    // 获取用户在持NFT数据
    async getCustomerPromoteList() {
      if (!this.isConnectWallet) {
        return;
      }
      const dict = {};
      dict['address'] = this.walletAddress; // 用户地址
      dict['page'] = this.paginatioParams.currentPage; // 当前第几页
      const that = this;
      const result = await getCustomerPromoteList(dict);
      if (result.status === 200) {
        that.showPapination = result.data.count > 0;
        that.paginatioParams.totalSize = result.data.count;
        result.data.result.forEach((item,index) => {
          item.address = item.address.toLowerCase();
        });
        that.promoteDataList = result.data.result;
      } else {
        that.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
      }
      console.log('推广列表', result);
    },
    // 修改页数
    changePage(params) {
      if (params.currentPage === 0) {
        return;
      }
      this.getCustomerPromoteList();
      console.log('修改页数params', params);
    },
  },
};
</script>

<style lang="scss" scoped>

.promote {
  padding-top: 0.1px;
  margin: 0 auto;
  //min-height: vw(600);
  padding-bottom: vw(150);
  .p_c_title {
    margin-top: vw(50);
    line-height: vw(34);
    font-size: vw(30);
    font-family: Ubuntu-Bold,sans-serif;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    color: var(--white);
  }
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
    width: vw(690);
    margin: vw(40) auto 0px;
    border: solid 1px var(--bgc19);
    //.p_c_text {
    //  height: vw(82);
    //  line-height: vw(82);
    //  font-size: vw(24);
    //  font-family: Ubuntu,sans-serif;
    //  font-weight: normal;
    //  font-stretch: normal;
    //  font-style: normal;
    //  color: var(--white);
    //  border-top: solid 1px var(--bgc19);
    //  background-color: var(--bgc20);
    //}
    .p_c_text {
      height: vw(82);
      border-top: solid 1px var(--bgc19);
      background-color: var(--bgc20);
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        width: vw(600);
        line-height: vw(82);
        font-size: vw(24);
        text-align: left;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        font-family: Poppins,sans-serif;
        color: var(--bgc18);
      }
      img {
        margin-right: vw(8);
        width: vw(30);
        height: vw(40);
      }
    }
    .p_c_text1 {
      background-color: transparent;
    }
  }
  .p_pagination {
    height: vw(40);
    margin: vw(40) auto 0;
  }
}

</style>
