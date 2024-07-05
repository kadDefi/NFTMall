<template>
  <div class="market">
    <div class="m_contian">
      <div class="m_c_top">
        <img :src="require(`../../../assets/marks/h5_icon_mark_text_${isEnglish ? 'y' : 'z'}.svg`)" alt="logo">
      </div>
      <div class="m_c_marks">
        <div class="m_c_m_body">
          <div class="m_c_m_contain">
            <div class="m_c_m_c_left">
              <div class="m_c_m_c_search">
                <input type="text" v-model="searchKeyword" :placeholder="searchPlaceHoder">
                <img src="../../../assets/marks/h5_icon_m_search.svg" @click="handleClickSearch" alt="search"/>
              </div>
              <div class="m_c_m_l_coin">{{ $t("message.holding.Classification") }}</div>
              <div class="m_c_m_l_classification">
                <div class="m_c_m_l_category" @click="showPopup">
                  <span>{{ $t("message.market.chooseCategory") }}</span>
                  <img src="../../../assets/marks/h5_icon_xl.svg" alt="logo">
                </div>
                <div class="m_c_m_select">
                  <div class="m_c_m_s_contain" @click="handleClickSelectPrice">
                    <span class="m_c_m_s_span">{{ filterPrice == 0 ? $t("message.market.lowPrice") : $t("message.market.HightPrice") }}</span>
                    <img class="m_c_m_s_img" src="../../../assets/marks/h5_icon_xl.svg" alt="logo">
                  </div>
                  <div v-show="isShowPrice" class="m_c_m_s_list">
                    <ul>
                      <li v-for="(item,index) in chooseList" :key="index" @click="handleClickSelectItem(item)">{{ item == 0 ? $t("message.market.lowPrice") : $t("message.market.HightPrice") }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div class="m_c_m_c_right">
              <mark-card :marketList="marketList"></mark-card>
              <div class="m_c_m_c_pagination">
                <pagination :params="paginatioParams" @changePage="changePage"></pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="m_c_copy">
        <span>{{ $t("message.market.desc1") }}</span>
        <span>{{ $t("message.market.desc2") }}</span>
        <span>{{ $t("message.market.desc3") }}</span>
        <div class="m_c_c_bottom">
          <span>aladdinmeta@gmail.com</span>
          <img alt="copy" src="../../../assets/marks/h5_icon_market_copy.svg" @click="handleClickCopy">
        </div>
      </div>
    </div>
    <van-popup v-model="show" round position="bottom">
      <div class="p_line"></div>
      <div class="p_content">
        <div class="p_c_price_title">{{ $t("message.casting.price") }}</div>
        <div class="p_c_price">
          <div><input type="number" v-model="searchMinPrice" :placeholder="searchMinPlaceHoder"></div>
          <div><input type="number" v-model="searchMaxPrice" :placeholder="searchMaxPlaceHoder"></div>
        </div>
        <div class="p_c_price_title p_c_margin">{{ $t("message.casting.classification") }}</div>
        <el-menu mode="vertical" background-color="transparent" text-color="#fff" active-text-color='transparent'>
          <!-- 一级菜单 -->
          <el-submenu :index="index + ''" v-for="(item,index) in sortList" :key="index">
            <template slot="title">
              <span>{{ isEnglish ? item.typeen : item.typech }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="index1 + ''" v-for="(subItem,index1) in item.sub" :key="index1" @click="handleClickSelectFilterSort(subItem)">
              <template slot="title">
                <span :class="subItem.isSelected ? 'selectedItem' : ''">{{ isEnglish ? subItem.typeen : subItem.typech }}</span>
                <span :class="subItem.isSelected ? 'selectedItem' : ''">({{ subItem.count }}) </span>
               <!-- <img class="selectedImg" :src="subItem.isSelected?require('../../../assets/marks/h5_icon_m_g.svg'):require('../../../assets/marks/h5_icon_m_g_n.svg')" alt="logo">-->
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <div class="p_bottom">
        <div class="p_b_filter" @click="handleClickFilter(1)">{{ $t("message.market.Filter") }}</div>
        <div class="p_b_reset" @click="handleClickFilter(2)">{{ $t("message.market.ResetFilter") }}</div>
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
  name: "marketMb",
  components: {
    'mark-card': markCard,
  },
  data() {
    return {
      show: false,
      isEnglish: false,
      isShowPrice: false,
      isShowCoin: false,
      showPapination: false,
      searchPlaceHoder: this.$t("message.market.searchNFT"),
      searchMinPlaceHoder: this.$t("message.market.MinPrice"),
      searchMaxPlaceHoder: this.$t("message.market.MaxPrice"),
      chooseList: [0, 1],
      filterPrice: 0, // 0 从低到高  1 从高到低
      searchKeyword: '', // 关键字
      searchMinPrice: '', // 最低价
      searchMaxPrice: '', // 最高价
      marketMBNFTType:1,  // 1 常规类NFT  2 艺术类NFT
      sortList: [],
      marketList: [],
      paginatioParams: { currentPage: 1, perSize: 8, totalSize: 1, defaultTotalPage: 5 },
    };
  },
  created() {
    this.marketMBNFTType = this.$route.params.item;
    if (isStringEmpty(this.marketMBNFTType)) {
      this.marketMBNFTType = 1;
    }
    console.log('choose NFT Type =',this.marketMBNFTType);
    this.isEnglish = window.localStorage.getItem("lang") !== "zh";
    this.getMarketNFTListData(true);
    this.getCastingNFTClassification();
    const that = this;
    this.$eventBus.$off("switchMarketMBNFTType");
    this.$eventBus.$on('switchMarketMBNFTType', (item) => {
      console.log(`监听到切换到${item === 1 ? '常规类' : '艺术类'}NFT类型操作`);
      if (item === that.marketMBNFTType) {
        return;
      }
      that.marketMBNFTType = item;
      that.getMarketNFTListData(true);
      that.getCastingNFTClassification();
    });
  },
  mounted() {

  },
  destroyed() {
    this.$eventBus.$off("switchMarketMBNFTType");
  },
  // 计算属性
  computed: {
    ...mapGetters(['isConnectWallet', 'walletAddress']),
  },
  // 监听属性改变
  watch: {
    searchKeyword(val, oval) {
      if (isStringEmpty(val)) {
        this.getMarketNFTListData(true);
      }
    },
    isConnectWallet(val, oval) {
      if (val) {
        this.getMarketNFTListData(true);
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
      this.searchMinPlaceHoder = this.$t("message.market.MinPrice");
      this.searchMaxPlaceHoder = this.$t("message.market.MaxPrice");
      // this.getCastingNFTClassification();
      console.log('监听到语言的切换');
    },
  },
  // 方法
  methods: {
    showPopup() {
      this.show = true;
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
        console.log(`获取${this.marketMBNFTType === 2 ? '艺术类' : '常规类'}第一级全部分类列表=`, result.data.mainClassify);
        console.log(`获取${this.marketMBNFTType === 2 ? '艺术类' : '常规类'}第二级全部分类列表=`, result.data.subClassify);
      } else {
        this.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
      }
    },
    // 获取市场NFT列表数据
    async getMarketNFTListData(isRefersh) {
      // if (!this.isConnectWallet) {
      //   return;
      // }
      // 筛选出分类ID
      const classification = [];
      this.sortList.forEach((item, index) => {
        item.sub.forEach((item1) => {
          if (item1.isSelected) {
            classification.push(item1.id);
          }
        });
      });
      const that = this;
      const dict = {};
      dict['classfy'] = classification.join();
      dict['search'] = this.searchKeyword;
      dict['lowest'] = this.filterPrice;
      dict['lowPrice'] = isStringEmpty(this.searchMinPrice) ? '' : this.searchMinPrice; // 最低价格
      dict['hightPrice'] = isStringEmpty(this.searchMaxPrice) ? '' : this.searchMaxPrice;// 最高价格
      dict['page'] = isRefersh ? 1 : this.paginatioParams.currentPage; // 当前第几页
      dict['count'] = 8;
      dict['type'] = this.marketMBNFTType;
      const result = await getMarketNFTListData(dict);
      if (result.status === 200) {
        that.showPapination = result.data.count > 0 ? true : false;
        if (result.data.count > 0 && isRefersh) {
          that.paginatioParams.currentPage = 1;
          that.paginatioParams.totalSize = result.data.count;
        }
        result.data.results.forEach((item) => {
          const newStr = item.picurl.indexOf("https");
          if (newStr === -1) {
            item.picurl = `${settingConfig.ipfsNFTUrl + item.picurl}`
          }
        });
        that.marketList = result.data.results;
      } else {
        that.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
      }
      console.log('获取创世NFT列表', result);
    },
    // 选择价格
    handleClickSelectPrice() {
      this.isShowPrice = !this.isShowPrice;
      const that = this;
      const showMore = document.addEventListener("click", (e) => {
        if (e.target.className !== "m_c_m_select" && e.target.className !== "m_c_m_s_contain" && e.target.className !== "m_c_m_s_span"
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
      this.getMarketNFTListData(true);
    },
    // 搜索
    handleClickSearch() {
      if (isStringEmpty(this.searchKeyword)) {
        this.$notify({ message: this.$t("message.market.searchMsg"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      }
      this.getMarketNFTListData(true);
      console.log('search nft');
    },
    // 开始筛选
    handleClickFilter(index) {
      if (!this.isConnectWallet) {
        this.$notify({ message: this.$t("message.casting.connectWallet"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      }
      if (index === 1) {
        this.getMarketNFTListData(true);
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
        this.getMarketNFTListData(true);
        this.show = false;
        console.log('重置筛选');
      }
    },
    // 筛选种类
    handleClickSelectFilterSort(subItem) {
      this.sortList.forEach((item, index) => {
        item.sub.forEach((item1) => {
          if (subItem.id == item1.id && !subItem.isSelected) {
            item1.isSelected = true;
          } else {
            item1.isSelected = false;
          }
        });
      });
      // subItem.isSelected = !subItem.isSelected;
    },
    // 修改页数
    changePage(params) {
      if (params.currentPage === 0) {
        return;
      }
      this.getMarketNFTListData(false);
      console.log('修改页数params', params);
    },
    // 选择查看NFT详情
    handleViewOnlyMethod(item) {
      console.log('查看NFT');
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
};
</script>

<style lang="scss" scoped>

.market {
  box-sizing: border-box;
  background-position: top;
  background-attachment: fixed;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  //background-image: url('../../../assets/marks/icon_mark_bg.jpg');
  padding-bottom: vw(100);
  .m_contian {
    padding-top: 0.1px;
    .m_c_top {
      width: 100%;
      height: calc(460 / 750 * 100vw);
      box-sizing: border-box;
      background-size: contain;
      background-repeat: no-repeat;
      //background-image: url('../../../assets/marks/h5_icon_mark_banner.svg');
      img {
        margin: vw(70) auto 0;
        width: vw(680);
        height: vw(322);
      }
    }
    .m_c_marks {
      position: relative;
      .m_c_m_body {
        margin: vw(48) auto 0px;
        //background-color: gray;
        .m_c_m_contain {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .m_c_m_c_left {
            width: vw(690);
            margin: 0 auto;
            .m_c_m_c_search {
              width: vw(690);
              height: vw(80);
              box-sizing: border-box;
              background-size: 100% 100%;
              background-repeat: no-repeat;
              display: flex;
              align-items: center;
              //background-image: url("../../../assets/marks/h5_icon_m_search_bg.svg");
              input {
                width: 100%;
                height: 100%;
                margin-left: vw(50);
                border: 0; // 去除未选中状态边框
                outline: none; // 去除选中状态边框
                font-size: vw(24);
                font-family: Ubuntu;
                font-weight: normal;
                box-sizing: border-box;
                background-color: transparent;
                color: var(--white);
              }
              input::-webkit-input-placeholder {
                color: var(--bgc26);
                font-size: vw(24);
              }
              input:-moz-placeholder {
                /* FF 4-18 */
                color: var(--bgc26);
                font-size: vw(24);
              }
              input::-moz-placeholder {
                /* FF 19+ */
                color: var(--bgc26);
                font-size: vw(24);
              }
              input:-ms-input-placeholder {
                /* IE 10+ */
                color: var(--bgc26);
                font-size: vw(24);
              }
              input:-webkit-autofill {
                transition: background-color 5000s ease-in-out 0s; //背景颜色
              }
              img {
                width: vw(44);
                height: vw(44);
                margin-right: vw(50);
                cursor: pointer;
              }
            }
            .m_c_m_l_coin {
              margin-top: vw(40);
              font-size: vw(28);
              line-height: vw(31);
              text-align: left;
              font-family: Ubuntu;
              font-weight: bold;
              font-stretch: normal;
              font-style: normal;
              color: var(--white);
              &:first-child {
                margin-top: 0;
              }
            }
            .m_c_m_l_classification {
              margin-top: vw(22);
              display: flex;
              justify-content: space-between;
              .m_c_m_l_category {
                display: flex;
                justify-content: center;
                align-items: center;
                width: vw(330);
                height: vw(80);
                border-radius: vw(8);
                background-color: var(--bgc16);
                span {
                  font-family: Ubuntu;
                  font-size: vw(26);
                  font-weight: normal;
                  font-stretch: normal;
                  font-style: normal;
                  line-height: normal;
                  letter-spacing: normal;
                  text-align: center;
                  color: var(--white);
                }
                img {
                  margin-left: vw(20);
                  width: vw(20);
                  height: vw(15);
                }
              }
              .m_c_m_select {
                position: relative;
                .m_c_m_s_contain {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  width: vw(330);
                  height: vw(80);
                  border-radius: vw(8);
                  background-color: var(--bgc16);
                  span {
                    font-family: Ubuntu;
                    font-size: vw(26);
                    font-weight: normal;
                    font-stretch: normal;
                    font-style: normal;
                    line-height: normal;
                    letter-spacing: normal;
                    text-align: center;
                    color: var(--white);
                  }
                  img {
                    margin-left: vw(20);
                    width: vw(20);
                    height: vw(15);
                  }
                }
                .m_c_m_s_list {
                  position: absolute;
                  top: vw(110);
                  right: 0;
                  width: vw(330);
                  height: vw(160);
                  border-radius: vw(8);
                  box-sizing: border-box;
                  background-color: var(--bgc16);
                  z-index: 2;
                  ul {
                    padding-left: 0px;
                    margin-bottom: 0px;
                  }
                  ul li {
                    width: 100%;
                    line-height: vw(80);
                    font-family: Ubuntu;
                    font-size: vw(26);
                    text-align: center;
                    cursor: pointer;
                    user-select: none;
                    list-style: none;
                    box-sizing: border-box;
                    color: var(--white);
                  }
                }
              }
            }
          }
        }
        .m_c_m_c_right {
          width: 100vw;
          margin-top: vw(40);
          padding: 0 vw(30);
          .m_c_m_c_pagination {
            height: vw(44);
            margin: vw(50) auto 0;
          }
        }
      }
    }
  }
  .m_c_copy {
    height: vw(578);
    margin: vw(58) auto vw(100);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    //background-image: url('../../../assets/marks/h5_icon_m_copy_bg.png');
    display: flex;
    flex-direction: column;
    align-items: center;
    span {
      width: vw(690);
      font-size: vw(28);
      word-break: normal;
      font-family: Ubuntu;
      font-weight: 300;
      font-stretch: normal;
      font-style: normal;
      color: var(--white);
      &:first-child {
        width: vw(500);
        margin-top: vw(85);
        font-size: vw(40);
        font-family: Ubuntu;
        font-weight: bold;
        color: transparent;
        -webkit-background-clip: text;
        background-image: linear-gradient(to bottom, #d745e8, #74e9f2);
      }
      &:nth-child(2) {
        margin-top: vw(30);
        opacity: 0.7;
      }
      &:nth-child(3) {
        margin-top: vw(10);
        font-style: normal;
        color: var(--bgc06);
      }
    }
    .m_c_c_bottom {
      width: vw(400);
      height: vw(60);
      margin-top: vw(20);
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 10px;
      border: solid 2px var(--white);
      span {
        margin-top: 0px;
        font-size: vw(24);
        font-weight: 600;
        font-family: PingFangHK;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        color: var(--white);
        text-align: center;
        text-decoration: underline;
        text-decoration-color: var(--white);
        text-decoration-style: solid;
        text-underline-offset: 3px;
      }
      img {
        width: vw(34);
        height: vw(34);
        margin-right: vw(18);
      }
    }
  }
}

.van-popup {
  background-color: var(--bgc03);
  height: vw(1142);
  display: flex;
  flex-direction: column;
  padding: 0 vw(30);
  overflow: hidden;
  .p_line {
    flex: 0 0 auto;
    width: vw(100);
    height: vw(8);
    margin: vw(33) auto vw(50);
    border-radius: vw(5);
    background-color: #e3d7e8;
  }
  .p_content {
    flex: 1 1 auto;
    overflow-y: auto;
    .p_c_price_title {
      font-family: Ubuntu;
      font-size: vw(28);
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: transparent;
      background-image: linear-gradient(to bottom, #d745e8, #74e9f2);
      -webkit-background-clip: text;
    }
    .p_c_margin {
      margin-top: vw(60);
      margin-bottom: vw(40);
    }
    .p_c_price {
      margin-top: vw(30);
      display: flex;
      justify-content: space-between;
      div {
        width: vw(330);
        height: vw(80);
        border-radius: vw(4);
        background-color: #201f22;
        input {
          width: 90%;
          height: 100%;
          margin: 0px auto;
          border: 0; // 去除未选中状态边框
          outline: none; // 去除选中状态边框
          font-size: vw(26);
          text-align: center;
          font-family: Ubuntu;
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
          color: var(--bgc26);
          font-size: vw(26);
        }
        input:-moz-placeholder {
          /* FF 4-18 */
          color: var(--bgc26);
          font-size: vw(26);
        }
        input::-moz-placeholder {
          /* FF 19+ */
          color: var(--bgc26);
          font-size: vw(26);
        }
        input:-ms-input-placeholder {
          /* IE 10+ */
          color: var(--bgc26);
          font-size: vw(26);
        }
        input:-webkit-autofill {
          transition: background-color 5000s ease-in-out 0s; //背景颜色
        }
      }
    }
  }
  .p_bottom {
    flex: 0 0 auto;
    height: vw(148);
    display: flex;
    align-items: center;
    justify-content: center;
    .p_b_filter {
      width: vw(250);
      height: vw(80);
      line-height: vw(80);
      font-size: vw(28);
      font-family: Ubuntu;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      cursor: pointer;
      user-select: none;
      border-radius: 10px;
      background-image: linear-gradient(to bottom, #6929af, #3b2999);
      color: var(--white);
    }
    .p_b_filter:hover {
      //border-radius: 10px;
      //color: var(--primary);
      //background-image: none;
      //border: solid 1px var(--primary);
    }
    .p_b_reset {
      margin-left: vw(60);
      width: vw(250);
      height: vw(80);
      line-height: vw(80);
      font-size: vw(28);
      font-family: Ubuntu;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      cursor: pointer;
      user-select: none;
      border-radius: 10px;
      color: var(--primary);
      background-image: none;
      border: solid 1px var(--primary);
    }
    .p_b_reset:hover {
      //color: var(--white);
    }
    .p_b_confirm {
      margin: 0 auto;
      width: vw(570);
      height: vw(90);
      line-height: vw(90);
      border-radius: 10px;
      background-image: linear-gradient(93deg, #6929af 0%, #3b2999 97%);
      font-size: vw(28);
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      letter-spacing: normal;
      text-align: center;
      color: var(--white);
    }
  }

  /deep/ .el-menu {
    border: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /deep/ .el-submenu .el-submenu__title {
    height: vw(100) !important;
    line-height: vw(100) !important;
    padding: 0px !important;
    text-align: left !important;
    border-bottom: solid 1px var(--bgc10);
    background-color: transparent !important;
  }

  /deep/ .el-submenu .el-submenu__title:hover {
    background-color: transparent !important;
  }

  .el-submenu .el-submenu__title span {
    padding-left: vw(26);
    font-size: vw(30);
    font-weight: 500;
    text-align: left;
    font-family: Ubuntu;
    font-stretch: normal;
    font-style: normal;
    user-select: none;
    color: var(--white);
  }

  /deep/ .el-submenu__title .el-submenu__icon-arrow {
    width: vw(20) !important;
    height: vw(16) !important;
    right: vw(58);
  }

  /deep/ .el-submenu__title .el-icon-arrow-down:before {
    content: url('../../../assets/marks/h5_icon_m_gb.svg') !important;
  }

  /deep/ .el-menu-item {
    position: relative;
    height: vw(100) !important;
    line-height: vw(100) !important;
    padding: 0px 0px 0px vw(26) !important;
    text-align: left !important;
    border-bottom: solid 1px var(--bgc10);
    background-color: transparent !important;
  }

  /deep/ .el-menu-item:hover {
    background-color: transparent !important;
  }

  .el-menu-item span {
    font-size: vw(30);
    font-weight: normal;
    text-align: left;
    font-family: Ubuntu;
    font-stretch: normal;
    font-style: normal;
    user-select: none;
    color: var(--bgc26);
  }

  .el-menu-item .selectedItem {
    font-size: vw(30);
    font-weight: normal;
    text-align: left;
    font-family: Ubuntu;
    font-stretch: normal;
    font-style: normal;
    user-select: none;
    color: var(--primary);
  }

  .el-menu-item .selectedImg {
    width: vw(36);
    height: vw(36);
    right: vw(50);
    top: 50%;
    margin-top: vw(-16);
    position: absolute;
  }
}

</style>
