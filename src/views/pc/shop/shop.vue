<template>
  <div class="shop">
    <div class="m_c_m_body">
      <div class="m_c_m_c_search">
        <input type="text" v-model="searchKeyword" :placeholder="searchPlaceHoder">
        <div @click="handleClickSearch"></div>
      </div>
      <div class="m_c_line"></div>
      <div class="m_c_m_contain"  @scroll="scrollEvent">
        <shop-cards :shopList="marketList" @handleClickItem="handleClickItem"></shop-cards>
      </div>
    </div>
    <zoon-footer></zoon-footer>
  </div>
</template>

<script>

const settingConfig = require('../../../settings.js');
import { mapGetters } from 'vuex';
import { isStringEmpty } from '@/utils/validate';
import { getShop } from '@/api/mark'
import shopCards from "@/components/shopCard/shopCard";

export default {
  name: "shop",
  components: {
    'shop-cards': shopCards,
  },
  data() {
    return {
      isEnglish: true,
      searchPlaceHoder: this.$t('message.labora.enterStoreName'),
      searchKeyword:'', // 关键字
      pageNum:1, // 分页
      moreLoading:false, // 是否是加载中
      noMore:false, // 是否没有数据了
      marketList:[],
    };
  },
  created() {
    this.isEnglish = window.localStorage.getItem("lang") !== "zh";
    this.getMarketNFTListData(true);
  },
  mounted() {
    //window.addEventListener('scroll', this.handleScroll, true);
  },
  destroyed() {
    //window.removeEventListener('scroll', this.handleScroll);
  },
  // 计算属性
  computed: {
    ...mapGetters(['isConnectWallet','walletAddress']),
  },
  // 监听属性改变
  watch:{
    searchKeyword(val, oval) {
      if (isStringEmpty(val)) {
        this.getMarketNFTListData(true);
      }
    },
    '$i18n.locale'(nval,oval) {
      this.isEnglish = nval !== 'zh';
      this.searchPlaceHoder = this.$t('message.labora.enterStoreName');
    },
    // 监听是否授权连接钱包
    isConnectWallet(val,oval) {},
  },
  // 方法
  methods: {
    // 获取市场NFT列表数据
    async getMarketNFTListData(isRefersh) {
      this.moreLoading = true;
      const that = this;
      const dict = {};
      dict['name'] = this.searchKeyword;
      dict['page'] = isRefersh ? 1 : this.pageNum; // 当前第几页
      dict['count'] = 16; // 当前第几页
      const result = await getShop(dict);
      if (result.status === 200) {
        result.data.result.forEach((item) => {
          if (isStringEmpty(item.coverPic)) {
            item.coverPic = '';
          } else {
            const newStr = item.coverPic.indexOf("https");
            if (newStr === -1) {
              item.coverPic = `${settingConfig.ipfsNFTUrl + item.coverPic}`
            }
          }
          if (isStringEmpty(item.picurl)) {
            item.picurl = '';
          } else {
            const newStr = item.picurl.indexOf("https");
            if (newStr === -1) {
              item.picurl = `${settingConfig.ipfsNFTUrl + item.picurl}`
            }
          }
        });
        if (isRefersh){
          that.marketList = result.data.result;
        }else {
          that.marketList.push(...result.data.result);
        }
        // 将状态机设置对应状态
        that.moreLoading = false;
        // 当我们取到的数据长度小于1页的数量时，就没有更多了数据了
        if (result.data.result.length < 16) {
          that.noMore = true;
        }
      }else {
        that.moreLoading = false;
        that.$notify({message: result.data,duration: 2500,showClose:false,customClass:'notifyClass'});
      }
      console.log('获取创世NFT列表',result);
    },
    scrollEvent(e) {
      // !this.moreLoading 没有在加载状态，触发加载更多时，把this.moreLoading置未true
      // !this.noMore 没有更多的状态为false，当我们取到的数据长度小于1页的数量时，就没有更多了数据了，把 this.noMore置为true，这样就不会触发无意义的加载更多了
      if(e.srcElement.scrollTop + e.srcElement.offsetHeight > e.srcElement.scrollHeight - 10 && !this.moreLoading && !this.noMore) {
        this.pageNum++;
        this.getMarketNFTListData(false);
        console.log('开始调用加载更多');
      }
    },
    // 搜索
    handleClickSearch() {
      if (isStringEmpty(this.searchKeyword)) {
        this.$notify({message: this.$t("message.market.searchMsg"),duration: 2500,showClose:false,customClass:'notifyClass'});
        return;
      }
      this.getMarketNFTListData(true);
    },
    // 跳转
    handleClickItem(item) {
      // 打开新页面
      const routeUrl = this.$router.resolve({path: '/creator',query:{ item:item.address,item1:this.isEnglish,item2: 'shop' }});
      window.open(routeUrl.href, '_blank');
    },
  },
};
</script>

<style lang="scss" scoped>

.shop {
  padding-top: 0.1px;
  background-color: #202136;
  .m_c_m_body {
    max-width: 1200px;
    margin: 30px auto 0;
    .m_c_m_c_search {
      display: flex;
      margin-left: auto;
      width: 320px;
      height: 50px;
      box-sizing: border-box;
      border-radius: 10px;
      border: solid 1px #4f5776;
      background-color: #202136;
      input {
        width: 80%;
        height: 100%;
        margin-left: 20px;
        border: 0; // 去除未选中状态边框
        outline: none; // 去除选中状态边框
        font-size: 16px;
        font-family: "PingFang SC",sans-serif;
        font-weight: normal;
        box-sizing: border-box;
        background-color: transparent;
        color: var(--white);
      }
      input::-webkit-input-placeholder {
        font-size: 16px;
        color: #4f5776;
      }
      input:-moz-placeholder {
        /* FF 4-18 */
        font-size: 16px;
        color: #4f5776;
      }
      input::-moz-placeholder {
        /* FF 19+ */
        font-size: 16px;
        color: #4f5776;
      }
      input:-ms-input-placeholder {
        /* IE 10+ */
        font-size: 16px;
        color: #4f5776;
      }
      input:-webkit-autofill {
        transition: background-color 5000s ease-in-out 0s; //背景颜色
      }
      div {
        margin-top: 8px;
        width: 34px;
        height: 34px;
        cursor: pointer;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-image: url("../../../assets/marks/icon_m_search.svg");
      }
    }
    .m_c_m_c_search:focus-within {
      border: solid 1px #72729b;
      div {
        background-image: url("../../../assets/marks/icon_m_search1.svg");
      }
    }
    .m_c_line {
      margin-top: 20px;
      height: 1px;
      background-color: #3f4455;
    }
    .m_c_m_contain {
      overflow-y: scroll;
      margin-top: 30px;
      height: 949px;
    }
  }
}

</style>

