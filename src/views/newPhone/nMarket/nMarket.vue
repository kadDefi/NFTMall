<template>
  <div class="nMarket">
    <div class="n_market_top"></div>
    <div class="n_market_content">
      <div class="h_c_title">{{ $t('message.mallSideBar.soonText2') }}</div>
      <div class="n_c_top">
        <div :class="marketMBNFTType === 1 ? 'select_div' : ''" @click="handleSwitchMarket(1)">
          <img :src="require(`../../../assets/newPhones/nMarket/icon_order_${ marketMBNFTType === 1 ? 'select' : 'normal' }.svg`)" alt="">
          <span>{{ $t('message.market.commodity') }}</span>
        </div>
        <div :class="marketMBNFTType === 2 ? 'select_div' : ''" @click="handleSwitchMarket(2)">
          <img :src="require(`../../../assets/newPhones/nMarket/icon_art_${ marketMBNFTType === 2 ? 'select' : 'normal' }.svg`)" alt="">
          <span>{{ $t('message.market.artwork') }}</span>
        </div>
      </div>
      <div class="n_c_content">
        <div v-if="!isShowSearch" class="n_c_wrapper">
          <div class="n_c_search" @click="handleSwitchSearch">
            <img src="../../../assets/newPhones/nMarket/icon_noram_search.svg" alt="">
          </div>
          <div class="n_c_price">
            <div class="n_c_p_contain" @click="handleClickSelectPrice">
              <span class="m_c_m_s_span">{{ filterPrice === 0 ? $t("message.market.lowPrice") : $t("message.market.HightPrice") }}</span>
              <img class="m_c_m_s_img" src="../../../assets/newPhones/nMarket/icon_m_down.svg" alt="logo">
            </div>
            <div v-show="isShowPrice" class="m_c_m_s_list">
              <ul>
                <li v-for="(item,index) in chooseList" :key="index" @click="handleClickSelectItem(item)">{{ item === 0 ? $t("message.market.lowPrice") : $t("message.market.HightPrice") }}</li>
              </ul>
            </div>
          </div>
          <div class="n_c_search" @click="showPopup">
            <img src="../../../assets/newPhones/nMarket/icon_m_sort.svg" alt="">
          </div>
        </div>
        <div v-else class="n_s_wrapper">
          <div class="n_c_w_search" @click="handleSwitchSearch">
            <img src="../../../assets/newPhones/nMarket/icon_m_back.svg" alt="">
          </div>
          <div class="m_c_m_c_search">
            <input type="text" v-model="searchKeyword" :placeholder="searchPlaceHoder">
            <img :src="require(`../../../assets/newPhones/nMarket/icon_${ isEmptySearchkeyword ? 'noram' : 'select'}_search.svg`)" @click="handleClickSearch" alt="search"/>
          </div>
        </div>
      </div>
      <div v-if="marketList.length <= 0" class="list-empty" @click="onRefresh">{{ $t("message.holding.empty") }}</div>
      <van-pull-refresh v-else v-model="refreshing" @refresh="onRefresh">
        <van-list v-model="loading" :finished="finished" :finished-text="$t('message.alertMsg.loadFinisedMsg')" :immediate-check="false" @load="onLoadMore">
          <mark-card :marketList="marketList" :nftType="marketMBNFTType" @listenClickItem="handleViewOnlyMethod"></mark-card>
        </van-list>
      </van-pull-refresh>

    </div>
    <van-popup v-model="show" round position="bottom">
      <div class="p_top">
        <div class="p_line"></div>
        <div class="p_content">
          <div class="p_c_tip">
            <div>{{ $t("message.market.MinPrice") }}</div>
            <div>{{ $t("message.market.MaxPrice") }}</div>
          </div>
          <div class="p_c_price">
            <div><input type="number" v-model="searchMinPrice" :placeholder="searchMinPlaceHoder"></div>
            <div><input type="number" v-model="searchMaxPrice" :placeholder="searchMaxPlaceHoder"></div>
          </div>
        </div>
      </div>
      <div class="p_filter">
        <div class="p_f_left">
          <div class="p_f_left_wrapper">
            <div v-for="(item,index) in sortList" :key="index" class="p_f_one_classification" :class="classificationOneIndex===index ? 'p_f_one_select_classification' : ''" @click="handleSelectClassification(index)">
              <span>{{ isEnglish ? item.typeen : item.typech }}</span>
            </div>
          </div>
        </div>
        <div class="p_f_right">
          <div class="p_f_right_wrapper">
            <div v-for="(subItem,index) in subSortList" :key="index" :class="subItem.isSelected ? 'p_f_two_select_classification' : ''" class="p_f_two_classification" @click="handleClickSelectFilterSort(subItem)">
              <span>{{ isEnglish ? subItem.typeen : subItem.typech }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="p_bottom">
        <div class="p_b_reset" @click="handleClickFilter(2)">{{ $t("message.market.ResetFilter") }}</div>
        <div class="p_b_filter" @click="handleClickFilter(1)">{{ $t("message.market.Filter") }}</div>
      </div>
    </van-popup>
  </div>
</template>

<script>

import {mapGetters} from 'vuex';
import markCard from '../../../components/markCardMb/markCardMb.vue';
import {getCastingNFTClassification, getMarketNFTListData} from '@/api/mark'
import {isStringEmpty} from '@/utils/validate'
import settingConfig from '@/settings'

export default {
  name: "nMarket",
  components: {
    'mark-card': markCard,
  },
  data() {
    return {
      show: false,
      isEnglish: false,
      isShowPrice: false,
      isShowCoin: false,
      isShowSearch: false,
      showPapination: false,
      searchPlaceHoder: this.$t("message.market.searchNFT"),
      searchMinPlaceHoder: '0.00',
      searchMaxPlaceHoder: '0.00',
      chooseList: [0, 1],
      filterPrice: 0, // 0 从低到高  1 从高到低
      searchKeyword: '', // 关键字
      searchMinPrice: '', // 最低价
      searchMaxPrice: '', // 最高价
      marketMBNFTType: 1,  // 1 常规类NFT  2 艺术类NFT
      classificationOneIndex: 0, // 默认选中的一级分类
      classificationTwoIndex: 0, // 默认选中的二级分类
      sortList: [], // 分类列表
      subSortList: [],
      marketList: [],

      refreshing: false,// 是否刷新中
      loading: false, // 加载更多
      finished: false, // 结束加载更是
      pageSize: 1, // 当前的页码
    };
  },
  created() {
    this.isEnglish = window.localStorage.getItem("lang") !== "zh";
    // this.onRefresh();
    // this.getCastingNFTClassification();
  },
  mounted() {
    let nextKeyStorage = sessionStorage.getItem("mbMarketNavKey");
    if (nextKeyStorage !== null) {
      this.marketMBNFTType = parseInt(nextKeyStorage)
      console.log('nextKeyStorage =', nextKeyStorage)
    }
    this.onRefresh();
    this.getCastingNFTClassification();
  },
  destroyed() {

  },
  // 计算属性
  computed: {
    ...mapGetters(['isConnectWallet', 'walletAddress']),
    // 判断输入框是否为空
    isEmptySearchkeyword() {
      return isStringEmpty(this.searchKeyword);
    },
  },
  // 监听属性改变
  watch: {
    searchKeyword(val, oval) {
      if (isStringEmpty(val)) {
        this.onRefresh();
      }
    },
    isConnectWallet(val, oval) {
      if (val) {
        this.onRefresh();
        this.getCastingNFTClassification();
      }
    },
    '$i18n.locale'(nval, oval) {
      if (nval === 'zh') {
        this.isEnglish = false;
      } else {
        this.isEnglish = true;
      }
      this.searchPlaceHoder = this.$t("message.market.search");
      this.getCastingNFTClassification();
      console.log('监听到语言的切换');
    },
  },
  // 方法
  methods: {
    // 显示弹框
    showPopup() {
      this.show = true;
    },
    // 切换类型
    handleSwitchMarket(index) {
      if (this.marketMBNFTType === index)
        return
      this.marketMBNFTType = index;
      this.onRefresh();
      this.getCastingNFTClassification();
    },
    // 下拉刷新回调
    onRefresh() {
      this.refreshing = true;
      // 清空列表数据
      this.finished = false;
      this.pageSize = 1;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.getMarketNFTListData(true);
    },
    // 上拉加载更多
    onLoadMore() {
      this.getMarketNFTListData(false);
    },
    // 切换搜索功能
    handleSwitchSearch() {
      this.isShowSearch = !this.isShowSearch;
    },
    // 获取一、二级分类列表
    async getCastingNFTClassification() {
      // type 0 => 一级分类  1 => 二级分类
      const that = this;
      const dict = {};
      dict['type'] = this.marketMBNFTType; // 1 常规 2 艺术类
      const result = await getCastingNFTClassification(dict);
      if (result.status === 200) {
        result.data.subClassify = result.data.subClassify.concat(result.data.hotClassify);
        result.data.mainClassify.forEach(item => {
          const subsList = [];
          result.data.subClassify.forEach(item1 => {
            item1.isSelected = false;
            if (parseInt(item1.classifymain) === item.id) {
              subsList.push(item1);
            }
          });
          item.sub = subsList;
        });
        that.sortList = result.data.mainClassify;
        that.subSortList = result.data.mainClassify[this.classificationOneIndex].sub;
      } else {
        this.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
      }
    },
    // 获取市场NFT列表数据
    async getMarketNFTListData(isRefresh) {
      if (this.refreshing) {
        this.marketList = [];
        this.refreshing = false;
      }
      // 筛选出分类ID
      const classification = [];
      this.sortList.forEach((item, index) => {
        item.sub.forEach((item1) => {
          if (item1.isSelected) {
            classification.push(item1.id);
          }
        });
      });
      const dict = {};
      dict['classfy'] = classification.join();
      dict['search'] = this.searchKeyword;
      dict['lowest'] = this.filterPrice;
      dict['lowPrice'] = isStringEmpty(this.searchMinPrice) ? '' : this.searchMinPrice; // 最低价格
      dict['hightPrice'] = isStringEmpty(this.searchMaxPrice) ? '' : this.searchMaxPrice;// 最高价格
      dict['page'] = this.pageSize; // 当前第几页
      dict['count'] = 8;
      dict['type'] = this.marketMBNFTType;
      const result = await getMarketNFTListData(dict);
      if (result.status === 200) {
        result.data.results.forEach((item) => {
          if (isStringEmpty(item.picurl)) {
            item.picurl = '';
          } else {
            const newStr = item.picurl.indexOf("https");
            if (newStr === -1) {
              item.picurl = `${settingConfig.ipfsNFTUrl + item.picurl}`
            }
          }
        });
        if (isRefresh) {
          this.marketList = result.data.results;
        } else {
          this.marketList.push(...result.data.results);
        }
        if (result.data.results.length < 8) {
          this.finished = true;
        }
        this.pageSize++;
      } else {
        this.finished = true;
        this.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
      }
      this.loading = false;
      console.log('获取创世NFT列表', result);
    },
    // 选择价格
    handleClickSelectPrice() {
      this.isShowPrice = !this.isShowPrice;
      const that = this;
      const showMore = document.addEventListener("click", (e) => {
        if (e.target.className !== "n_c_price" && e.target.className !== "n_c_p_contain" && e.target.className !== "m_c_m_s_span"
          && e.target.className !== "m_c_m_s_img" && e.target.className !== "m_c_m_s_list") {
          this.isShowPrice = false;
          document.removeEventListener("click", showMore, false);
        }
      });
      document.addEventListener("click", showMore, false);
    },
    // 筛选价格
    handleClickSelectItem(item) {
      this.filterPrice = item;
      // 刷选价格后进行数据刷新
      this.isShowPrice = false;
      this.onRefresh();
    },
    // 搜索
    handleClickSearch() {
      if (isStringEmpty(this.searchKeyword)) {
        this.$notify({ message: this.$t("message.market.searchMsg"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      }
      this.onRefresh();
      console.log('search nft');
    },
    // 开始筛选
    handleClickFilter(index) {
      if (!this.isConnectWallet) {
        this.$notify({ message: this.$t("message.casting.connectWallet"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      }
      if (index === 1) {
        this.onRefresh();
        this.show = false;
        console.log('开始筛选');
      } else if (index === 2) {
        this.sortList.forEach((item, index) => {
          item.sub.forEach((item1) => {
            item1.isSelected = false;
          });
        });
        this.searchKeyword = '';
        this.searchMinPrice = '';
        this.searchMaxPrice = '';
        this.filterPrice = 0;
        this.onRefresh();
        this.show = false;
        console.log('重置筛选');
      }
    },
    // 筛选一级分类
    handleSelectClassification(selectIndex) {
      this.classificationOneIndex = selectIndex;
      this.subSortList = this.sortList[this.classificationOneIndex].sub;
    },
    // 筛选二级分类
    handleClickSelectFilterSort(subItem) {
      this.sortList.forEach((item, index) => {
        item.sub.forEach((item1) => {
          if (subItem.id === item1.id && !subItem.isSelected) {
            item1.isSelected = true;
          } else {
            item1.isSelected = false;
          }
        });
      });
      // subItem.isSelected = !subItem.isSelected;
    },
    // 选择查看NFT详情
    handleViewOnlyMethod(item) {
      console.log('查看NFT');
      sessionStorage.setItem("mbMarketNavKey", this.marketMBNFTType);
      this.$router.push({ path: '/nftdetialMb', query: { item: item.tokenid, item1: true, item2: this.isEnglish } });
    },
    // 复制
    handleClickCopy() {
      let copyText = 'aladdinmeta@gmail.com';
      // navigator clipboard 需要https等安全上下文
      if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard 向剪贴板写文本
        navigator.clipboard.writeText(copyText);
        this.$notify({ message: this.$t("message.alertMsg.copySuccess"), duration: 3000, showClose: false, customClass: 'notifyClass' });
      } else {
        // 创建text area
        let textArea = document.createElement("textarea");
        textArea.value = copyText;
        textArea.style.position = "absolute";
        textArea.style.opacity = 0;
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        this.$notify({ message: this.$t("message.alertMsg.copySuccess"), duration: 3000, showClose: false, customClass: 'notifyClass' });
        document.body.removeChild(textArea);
      }
    },
  },
}
</script>


<style lang="scss" scoped>

.nMarket {
  position: relative;
  padding-top: 0.1px;
  box-sizing: border-box;
  padding-bottom: vw(100);
  background-color: #202136;
  .n_market_top {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100vw;
    height: vw(528);
    box-sizing: border-box;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url('../../../assets/newPhones/nHome/icon_top_bg.svg');
  }
  .n_market_content {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100vw;
    height: 100vh;
    .h_c_title {
      margin-top: vw(140);
      padding: 0 vw(30);
      line-height: vw(79);
      font-size: vw(60);
      text-align: left;
      word-break: normal;
      font-family: MicrosoftYaqiHei, sans-serif;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      user-select: none;
      color: var(--white);
    }
    .n_c_top {
      padding: 0 vw(30);
      height: vw(90);;
      margin-top: vw(30);
      display: flex;
      align-items: center;
      justify-content: space-between;
      div {
        display: flex;
        align-items: center;
        justify-content: center;
        width: vw(335);
        height: vw(90);
        box-sizing: border-box;
        border: solid 2px #3b3f71;
        border-radius: vw(20);
        background-color: #1a1c40;
        img {
          width: vw(50);
          height: vw(50);
        }
        span {
          margin-left: vw(22);
          line-height: normal;
          font-size: vw(32);
          font-weight: 600;
          font-stretch: normal;
          font-style: normal;
          letter-spacing: normal;
          text-align: left;
          font-family: PingFangSC, sans-serif;
          color: #383c6f;
        }
      }
      .select_div {
        border: solid vw(2) #ff953f;
        span {
          color: transparent;
          -webkit-background-clip: text;
          background-image: linear-gradient(to bottom, #ff953f, #fcca6e);
        }
      }
    }
    .n_c_content {
      padding: 0 vw(30);
      margin-top: vw(20);
      .n_c_wrapper {
        padding-top: 0.1px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .n_c_search {
          display: flex;
          align-items: center;
          justify-content: center;
          width: vw(80);
          height: vw(80);
          border-radius: vw(10);
          background-color: #42456e;
          img {
            width: vw(40);
            height: vw(40);
          }
        }
        .n_c_price {
          position: relative;
          padding: 0 vw(30);
          width: vw(485);
          height: vw(80);
          border-radius: vw(10);
          background-color: #42456e;
          .n_c_p_contain {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 100%;
            span {
              font-family: PingFangSC, sans-serif;
              font-size: vw(28);
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              line-height: normal;
              letter-spacing: normal;
              text-align: center;
              color: #676b96;
            }
            img {
              width: vw(44);
              height: vw(44);
            }
          }
          .m_c_m_s_list {
            position: absolute;
            top: vw(81);
            right: 0;
            width: vw(485);
            height: vw(160);
            border-radius: vw(10);
            box-sizing: border-box;
            background-color: #42456e;
            z-index: 2;
            ul {
              padding-left: 0;
              margin-bottom: 0;
            }
            ul li {
              padding-left: vw(50);
              width: 100%;
              line-height: vw(80);
              font-family: Ubuntu, sans-serif;
              font-size: vw(28);
              text-align: left;
              cursor: pointer;
              user-select: none;
              list-style: none;
              box-sizing: border-box;
              color: #676b96;
            }
          }
        }
      }
      .n_s_wrapper {
        padding-top: 0.1px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .n_c_w_search {
          display: flex;
          align-items: center;
          justify-content: center;
          width: vw(80);
          height: vw(80);
          img {
            width: vw(40);
            height: vw(40);
          }
        }
        .m_c_m_c_search {
          display: flex;
          align-items: center;
          padding: 0 vw(30);
          width: vw(590);
          height: vw(80);
          border-radius: vw(10);
          box-sizing: border-box;
          background-color: #42456e;
          input {
            width: 100%;
            height: 100%;
            border: 0; // 去除未选中状态边框
            outline: none; // 去除选中状态边框
            font-size: vw(28);
            font-family: PingFangSC, sans-serif;
            font-weight: normal;
            box-sizing: border-box;
            background-color: transparent;
            color: var(--white);
          }
          input::-webkit-input-placeholder {
            color: #676b96;
            font-size: vw(24);
          }
          input:-moz-placeholder {
            /* FF 4-18 */
            color: #676b96;
            font-size: vw(24);
          }
          input::-moz-placeholder {
            /* FF 19+ */
            color: #676b96;
            font-size: vw(24);
          }
          input:-ms-input-placeholder {
            /* IE 10+ */
            color: #676b96;
            font-size: vw(24);
          }
          input:-webkit-autofill {
            transition: background-color 5000s ease-in-out 0s; //背景颜色
          }
          img {
            width: vw(44);
            height: vw(44);
            cursor: pointer;
          }
        }
      }
    }
    .van-pull-refresh {
      flex: 1 1 auto;
      overflow: auto;
      margin-top: vw(20);
      max-height: 100%;
    }
    .list-empty {
      margin: vw(150) auto 0;
      padding-top: vw(200);
      width: vw(312);
      height: vw(240);
      line-height: vw(46);
      font-size: vw(28);
      font-weight: normal;
      font-stretch: normal;
      font-family: PingFangSC, sans-serif;
      color: #c5c8d9;
      box-sizing: border-box;
      background-size: contain;
      background-repeat: no-repeat;
      background-image: url('../../../assets/newPhones/nLaboratory/h5_icon_empty.png');
    }
  }
  .van-popup {
    height: vw(1062);
    //overflow: hidden;
    display: flex;
    flex-direction: column;
    background-color: #202136;
    .p_top {
      //flex: 0 0 auto;
      padding: 0 vw(30);
      height: vw(254);
      background-color: #27273f;
      .p_line {
        width: vw(100);
        height: vw(8);
        margin: vw(30) auto vw(56);
        border-radius: vw(5);
        background-color: #fff;
      }
      .p_content {
        background-color: #27273f;
        .p_c_tip {
          display: flex;
          justify-content: space-between;
          div {
            line-height: vw(30);
            font-size: vw(22);
            font-weight: 500;
            font-stretch: normal;
            font-style: normal;
            letter-spacing: normal;
            font-family: PingFangSC, sans-serif;
            color: #4b4b79;
          }
        }
        .p_c_price {
          margin-top: vw(10);
          display: flex;
          justify-content: space-between;
          div {
            width: vw(330);
            height: vw(80);
            border-radius: vw(10);
            background-color: #1b1b33;
            input {
              width: 90%;
              height: 100%;
              margin: 0 auto;
              border: 0; // 去除未选中状态边框
              outline: none; // 去除选中状态边框
              font-size: vw(24);
              text-align: center;
              font-family: PingFangSC, sans-serif;
              font-weight: normal;
              box-sizing: border-box;
              background-color: transparent;
              color: var(--white);
            }
            input::-webkit-outer-spin-button,
            input::-webkit-inner-spin-button {
              -webkit-appearance: none;
            }
            /* 火狐 */
            input[type="number"] {
              -moz-appearance: textfield;
            }
            input::-webkit-input-placeholder {
              color: #4b4b79;
              font-size: vw(24);
            }
            input:-moz-placeholder {
              /* FF 4-18 */
              color: #4b4b79;
              font-size: vw(24);
            }
            input::-moz-placeholder {
              /* FF 19+ */
              color: #4b4b79;
              font-size: vw(24);
            }
            input:-ms-input-placeholder {
              /* IE 10+ */
              color: #4b4b79;
              font-size: vw(24);
            }
            input:-webkit-autofill {
              transition: background-color 5000s ease-in-out 0s; //背景颜色
            }
          }
        }
      }
    }
    .p_filter {
      height: vw(660);
      //flex: 1 1 auto;
      display: flex;
      .p_f_left {
        overflow-y: auto;
        height: 100%;
        width: vw(270);
        .p_f_left_wrapper {
          display: flex;
          flex-direction: column;
          .p_f_one_classification {
            width: 100%;
            height: vw(110);
            background-color: #303255;
            span {
              line-height: vw(110);
              font-size: vw(26);
              font-weight: 600;
              font-stretch: normal;
              font-style: normal;
              letter-spacing: normal;
              text-align: left;
              font-family: PingFangSC, sans-serif;
              color: #fff;
            }
          }
          .p_f_one_select_classification {
            background-color: #202136;
          }
        }
      }
      .p_f_right {
        overflow-y: auto;
        margin-left: vw(90);
        height: 100%;
        width: vw(270);
        .p_f_right_wrapper {
          display: flex;
          flex-direction: column;
          padding-top: vw(20);
          .p_f_two_classification {
            margin-bottom: vw(20);
            width: 100%;
            height: vw(60);
            box-sizing: border-box;
            border-radius: vw(30);
            border: solid 1px #4b4b79;
            background-color: #202136;
            span {
              line-height: vw(60);
              font-size: vw(24);
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              letter-spacing: normal;
              text-align: center;
              font-family: PingFangSC, sans-serif;
              color: #4b4b79;
            }
          }
          .p_f_two_select_classification {
            border: solid 1px #50559d;
            background-color: #50559d;
            span {
              color: #fff;
            }
          }
        }
      }
    }
    .p_bottom {
      //flex: 0 0 auto;
      padding: 0 vw(30);
      height: vw(148);
      display: flex;
      align-items: center;
      justify-content: center;
      .p_b_filter {
        margin-left: vw(30);
        width: vw(300);
        height: vw(90);
        line-height: vw(90);
        font-size: vw(28);
        font-family: Ubuntu, sans-serif;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        cursor: pointer;
        user-select: none;
        border-radius: vw(10);
        background-image: linear-gradient(95deg, #f109b4 1%, #622fe3 96%);
        color: var(--white);
      }
      .p_b_filter:hover {
        //border-radius: 10px;
        //color: var(--primary);
        //background-image: none;
        //border: solid 1px var(--primary);
      }
      .p_b_reset {
        width: vw(300);
        height: vw(90);
        line-height: vw(90);
        font-size: vw(28);
        font-family: Ubuntu, sans-serif;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        cursor: pointer;
        user-select: none;
        color: #fff;
        //background-image: none;
        //border: solid 1px #f109b4;
        box-sizing: border-box;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-image: url("../../../assets/newPhones/nMarket/icon_m_filter_bk.svg");
      }
      .p_b_reset:hover {
        //color: var(--white);
      }
    }
  }
}

</style>
