<template>
  <div class="market">
    <div class="m_c_m_body">
      <div class="m_c_m_c_search">
        <input type="text" v-model="searchKeyword" :placeholder="searchPlaceHoder">
        <div @click="handleClickSearch"></div>
      </div>
      <div class="m_c_line"></div>
      <div class="m_c_m_contain">
        <div class="m_c_m_c_left">
          <div class="m_c_m_select">
            <div class="m_c_m_s_contain" @click="handleClickSelectPrice">
              <span>{{ filterPrice === 0 ? $t("message.market.lowPrice") : $t("message.market.HightPrice") }}</span>
              <img :src="require(`../../../assets/marks/icon_${isShowPrice ? 'xl' : 'xl1'}.svg`)" alt="logo">
            </div>
            <div v-if="isShowPrice" class="m_c_m_s_list">
              <ul>
                <li v-for="(item,index) in chooseList" :class="filterPrice === index ? 'li' : ''" :key="index" @click="handleClickSelectItem(item)">{{ item === 0 ? $t("message.market.lowPrice")  : $t("message.market.HightPrice") }}</li>
              </ul>
            </div>
          </div>
          <div class="m_c_m_l_filter">{{ $t("message.stock.Price") }}</div>
          <div class="m_c_m_l_price">
            <div><input type="number" v-model="searchMinPrice" :placeholder="searchMinPlaceHoder"></div>
            <span>to</span>
            <div><input type="number" v-model="searchMaxPrice" :placeholder="searchMaxPlaceHoder"></div>
          </div>
          <div class="m_c_m_l_line"></div>
          <div class="m_c_m_l_sort">
            <div v-for="(item,index) in sortList" :key="index" class="m_c_sort_wrapper">
              <div class="m_c_m_s_contain" @click="handleClickSelectFirstFilterSort(item,index)">
                <span>{{ isEnglish ? item.typeen : item.typech }}</span>
                <img class="m_c_m_s_img" :src="require(`../../../assets/marks/icon_${filterFirstSortIndex === index ? 'xl' : 'xl1'}.svg`)" alt="logo">
              </div>
              <div v-if="filterFirstSortIndex === index" class="m_c_m_s_list">
                <ul>
                  <li v-for="(subItem,index1) in item.sub" :class="subItem.isSelected  ? 'li' : ''" :key="index1" @click="handleClickSelectFilterSort(subItem)">
                    {{ isEnglish ? subItem.typeen : subItem.typech }}
                  </li>
                </ul>
              </div>
            </div>
          <!--  <el-menu mode="vertical" background-color="transparent" text-color="#fff" active-text-color='transparent'>
              &lt;!&ndash; 一级菜单 &ndash;&gt;
              <el-submenu :index="index + ''" v-for="(item,index) in sortList" :key="index">
                <template slot="title">
                  <span>{{ isEnglish ? item.typeen : item.typech }}</span>
                </template>
                &lt;!&ndash; 二级菜单 &ndash;&gt;
                <el-menu-item :index="index1 + ''" v-for="(subItem,index1) in item.sub" :key="index1" @click="handleClickSelectFilterSort(subItem)">
                  <template slot="title" >
                    <span :class="subItem.isSelected ? 'selectedItem' : ''">{{ isEnglish ? subItem.typeen : subItem.typech }}</span>
                    <span :class="subItem.isSelected ? 'selectedItem' : ''">({{ subItem.count }}) </span>
                    <img class="selectedImg" v-show="subItem.isSelected " src="../../../assets/marks/icon_m_g.svg" alt="logo">
                  </template>
                </el-menu-item>
              </el-submenu>
            </el-menu>-->
          </div>
          <div class="m_c_m_l_filterBtn" @click="handleClickFilter(1)">{{ $t("message.market.Filter") }}</div>
          <div class="m_c_m_l_refilterBtn" @click="handleClickFilter(2)">{{ $t("message.market.ResetFilter") }}</div>
        </div>
        <div class="m_c_m_c_right">
          <div class="m_c_class">
            <div v-for="(item,index) in classList" :key="index" :class="marketNFTType === index ? 'm_c_class1' : ''" @click="handleClickFilterType(index)">{{ item }}</div>
          </div>
          <div class="m_c_wraper" @scroll="scrollEvent">
            <mark-card :marketList="marketList"></mark-card>
          </div>
        </div>
      </div>
    </div>
    <zoon-footer></zoon-footer>
  </div>
</template>

<script>

const settingConfig = require('../../../settings.js');
import { mapGetters } from 'vuex';
import { isStringEmpty } from '@/utils/validate';
import { getMarketNFTListData,getCastingNFTClassification } from '@/api/mark'
import markCard from '../../../components/markCard/markCard.vue';
import { parseNumber } from '@/decentralizedApi/param';

export default {
  name: "market",
  components: {
    'mark-card':markCard,
  },
  data() {
    return {
      isEnglish:false,
      isShowPrice:false,
      isShowCoin:false,
      showPapination:false,
      searchPlaceHoder:this.$t("message.market.search"),
      searchMinPlaceHoder:this.$t("message.market.MinPrice"),
      searchMaxPlaceHoder:this.$t("message.market.MaxPrice"),
      chooseList:[0,1],
      filterPrice:0, // 0 从低到高  1 从高到低
      filterFirstSortIndex:-1, // 选中一级分类的下标
      searchKeyword:'', // 关键字
      searchMinPrice:'', // 最低价
      searchMaxPrice:'', // 最高价
      marketNFTType:0,  // 0 全部  1 常规类NFT  2 艺术类NFT
      classList:[this.$t("message.smFreed.all"),this.$t("message.market.commodity"),this.$t("message.mallHeader.artworkNFT")],
      pageNum:1, // 分页
      moreLoading:false, // 是否是加载中
      noMore:false, // 是否没有数据了
      lastLoadSuccess:false, // 最后一次请求是否成功
      sortList:[],
      marketList:[],
      //paginatioParams:{currentPage:1,perSize:9,totalSize:1,defaultTotalPage:5},
    };
  },
  created() {
    this.isEnglish = window.localStorage.getItem("lang") !== "zh";
    this.getMarketNFTListData(true);
    this.getCastingNFTClassification();
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
    // isConnectWallet(val,oval) {
    //   if (val) {
    //      this.getMarketNFTListData(true);
    //      this.getCastingNFTClassification();
    //   }
    // },
    '$i18n.locale'(nval,oval) {
       this.isEnglish = nval !== 'zh';
       this.searchPlaceHoder = this.$t("message.market.search");
       this.searchMinPlaceHoder = this.$t("message.market.MinPrice");
       this.searchMaxPlaceHoder = this.$t("message.market.MaxPrice");
       this.classList = [this.$t("message.smFreed.all"),this.$t("message.market.commodity"),this.$t("message.mallHeader.artworkNFT")];
       //this.getCastingNFTClassification();
       console.log('监听到语言的切换');
    },
  },
  // 方法
  methods: {
    // 获取一、二级分类列表
    async getCastingNFTClassification() {
      // type 0 => 一级分类  1 => 二级分类
      const that = this;
      const dict = {};
      dict['type'] = this.marketNFTType; // 0 全部 1 常规 2 艺术类
      const result = await getCastingNFTClassification(dict);
      if (result.status === 200) {
         result.data.subClassify = result.data.subClassify.concat(result.data.hotClassify);
         result.data.mainClassify.forEach(item => {
           const subsList = [];
           result.data.subClassify.forEach(item1 => {
             item1.isSelected = false;
             if (item1.classifymain === `${item.id}`) {
               subsList.push(item1);
             }
           });
           item.sub = subsList;
         });
         that.sortList = result.data.mainClassify;
         console.log(`获取${this.marketNFTType === 2 ? '艺术类' : '常规类'}第一级全部分类列表=`,result.data.mainClassify);
         console.log(`获取${this.marketNFTType === 2 ? '艺术类' : '常规类'}第二级全部分类列表=`,result.data.subClassify);
      }else {
        this.$notify({message: result.data,duration: 2500,showClose:false,customClass:'notifyClass'});
      }
    },
    // 监听滚动市场列表容器
    scrollEvent(e) {
      // !this.moreLoading 没有在加载状态，触发加载更多时，把this.moreLoading置未true
      // !this.noMore 没有更多的状态为false，当我们取到的数据长度小于1页的数量时，就没有更多了数据了，把 this.noMore置为true，这样就不会触发无意义的加载更多了
      // const bottomOfWindow = window.document.documnetElement.offsetHeight - window.document.documnetElement.scrollTop - window.innerHeight <= 10;
      // console.log('bottomOfWindow = ',bottomOfWindow);
      const ele = e.srcElement ? e.srcElement : e.target;
      if(ele.scrollTop + ele.offsetHeight > ele.scrollHeight - 10 && !this.moreLoading && !this.noMore) {
        this.getMarketNFTListData(false);
        console.log('开始调用市场加载更多接口');
      }
    },
    // 获取市场NFT列表数据
    async getMarketNFTListData(isRefersh) {
      this.moreLoading = true;
      if (isRefersh) {
        this.pageNum = 1;
        this.noMore = false;
      }else {
        this.pageNum++;
      }
      // 筛选出分类ID
      const classification = [];
      this.sortList.forEach((item,index) => {
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
      dict['page'] = this.pageNum; // 当前第几页
      dict['count'] = 20;
      dict['type'] = this.marketNFTType;
      console.log('request paramas =',dict);
      const result = await getMarketNFTListData(dict);
      if (result.status === 200) {
        result.data.results.forEach((item) => {
          const newStr = item.picurl.indexOf("https");
          if (newStr === -1) {
            item.picurl = `${settingConfig.ipfsNFTUrl + item.picurl}`
          }
        });
        if (isRefersh){
          that.marketList = result.data.results;
        }else {
          that.marketList.push(...result.data.results);
        }
        // 将状态机设置对应状态
        that.moreLoading = false;
        // 当我们取到的数据长度小于1页的数量时，就没有更多了数据了
        if (result.data.results.length < 20) {
          that.noMore= true;
        }
      }else {
        that.moreLoading = false;
        that.$notify({message: result.data,duration: 2500,showClose:false,customClass:'notifyClass'});
      }
      console.log('获取市场NFT列表',result);
    },
    // 选择价格
    handleClickSelectPrice(){
      this.isShowPrice = !this.isShowPrice;
    },
    // 筛选价格
    handleClickSelectItem(item) {
      this.filterPrice = item;
      this.isShowPrice = false;
      // 进行数据的刷新
      this.handleClickFilter(1);
    },
    // 搜索
    handleClickSearch() {
      if (isStringEmpty(this.searchKeyword)) {
        this.$notify({message: this.$t("message.market.searchMsg"),duration: 2500,showClose:false,customClass:'notifyClass'});
        return;
      }
      this.getMarketNFTListData(true);
      console.log('search nft');
    },
    // 开始筛选
    handleClickFilter(index) {
      if(!this.isConnectWallet) {
        this.$notify({message: this.$t("message.casting.connectWallet"),duration: 2500,showClose:false,customClass:'notifyClass'});
        return;
      }
      if (index === 1){
        this.getMarketNFTListData(true);
        console.log('开始筛选');
      }else if(index === 2) {
        this.sortList.forEach((item,index) => {
          item.sub.forEach((item1) => {
            item1.isSelected = false;
          });
        });
        this.searchKeyword = '';
        this.searchMinPrice = '';
        this.searchMaxPrice = '';
        this.filterPrice = 0;
        this.getMarketNFTListData(true);
        console.log('重置筛选');
      }
    },
    // 选择第一分类
    handleClickSelectFirstFilterSort(item,index) {
      if (this.filterFirstSortIndex === index) {
        this.filterFirstSortIndex = -1;
        return;
      }
      this.filterFirstSortIndex = index;
    },
    // 筛选种类(只能刷新一个种类)
    handleClickSelectFilterSort(subItem) {
      this.sortList.forEach((item,index) => {
        item.sub.forEach((item1) => {
          if (subItem.id === item1.id && !subItem.isSelected) {
            item1.isSelected = true;
          }else {
            item1.isSelected = false;
          }
        });
      });
    },
    // 选择不同分类
    handleClickFilterType(index) {
      // 筛选
      this.marketNFTType = index;
      this.getMarketNFTListData(true);
      this.getCastingNFTClassification();
    },
    // 选择查看NFT详情
    handleViewOnlyMethod(item) {
      console.log('查看NFT');
    },
  },
};
</script>

<style lang="scss" scoped>

.market {
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
      display: flex;
      justify-content: space-between;
      height: 1300px;
      margin-top: 50px;
      .m_c_m_c_left {
        width: 290px;
        height: 100%;
        .m_c_m_select {
          .m_c_m_s_contain {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 290px;
            height: 50px;
            padding: 0 10px 0 20px;
            cursor: pointer;
            user-select: none;
            box-sizing: border-box;
            border-radius: 10px;
            border: solid 1px #4f5776;
            background-color: #202136;
            span {
              font-size: 14px;
              font-weight: normal;
              line-height: 20px;
              font-family: "PingFang SC",sans-serif;
              font-stretch: normal;
              font-style: normal;
              color: #fff;
            }
            img {
              width: 34px;
              height: 34px;
            }
          }
          .m_c_m_s_list {
            margin-top: 4px;
            width: 100%;
            height: 100px;
            overflow: hidden;
            border-radius: 10px;
            border: solid 1px #4f5776;
            background-color: #202136;
            ul {
              margin-bottom: 0;
            }
            ul li {
              padding-left: 20px;
              width: 100%;
              height: 50px;
              line-height: 50px;
              cursor: pointer;
              user-select: none;
              list-style: none;
              box-sizing: border-box;
              font-size: 14px;
              font-weight: normal;
              font-family: "PingFang SC",sans-serif;
              text-align: left;
              color: #fff;
            }
            ul .li {
              color: #a460f5;
              background-color: #343650;
            }
          }
        }
        .m_c_m_l_filter {
          margin-top: 30px;
          font-size: 16px;
          line-height: 22px;
          text-align: left;
          font-family: "PingFang SC",sans-serif;
          font-weight: 600;
          font-stretch: normal;
          font-style: normal;
          color: var(--white);
        }
        .m_c_m_l_price {
          margin-top: 13px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          div {
            width: 130px;
            height: 50px;
            border-radius: 10px;
            border: solid 1px #4f5776;
            background-color: #202136;
            input {
              width: 90%;
              height: 100%;
              margin: 0 auto;
              border: 0; // 去除未选中状态边框
              outline: none; // 去除选中状态边框
              font-size: 16px;
              text-align: center;
              font-family: "PingFang SC",sans-serif;
              font-weight: normal;
              box-sizing: border-box;
              background-color: transparent;
              color: #fff;
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
              color:#4f5776;
              font-size: 16px;
            }
            input:-moz-placeholder {
              /* FF 4-18 */
              color:#4f5776;
              font-size: 16px;
            }
            input::-moz-placeholder {
              /* FF 19+ */
              color:#4f5776;
              font-size: 16px;
            }
            input:-ms-input-placeholder {
              /* IE 10+ */
              color:#4f5776;
              font-size: 16px;
            }
            input:-webkit-autofill {
              transition: background-color 5000s ease-in-out 0s; //背景颜色
            }
          }
          span {
            font-size: 20px;
            line-height: 28px;
            font-family: "PingFang SC",sans-serif;
            font-weight: 600;
            font-stretch: normal;
            font-style: normal;
            color: var(--white);
          }
        }
        .m_c_m_l_line {
          height: 1px;
          margin-top: 40px;
          background-color: #3f4455;
        }
        .m_c_m_l_sort {
          margin-top: 40px;
          width: 290px;
          height: 400px;
          overflow-y: scroll;
          .m_c_sort_wrapper {
            margin-top: 20px;
            .m_c_m_s_contain {
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 290px;
              height: 50px;
              padding: 0 10px 0 20px;
              cursor: pointer;
              user-select: none;
              box-sizing: border-box;
              border-radius: 10px;
              border: solid 1px #4f5776;
              background-color: #202136;
              span {
                font-size: 14px;
                font-weight: normal;
                line-height: 20px;
                font-family: "PingFang SC",sans-serif;
                font-stretch: normal;
                font-style: normal;
                color: #fff;
              }
              img {
                width: 34px;
                height: 34px;
              }
            }
            .m_c_m_s_list {
              margin-top: 4px;
              width: 100%;
              //height: 100px;
              overflow: hidden;
              border-radius: 10px;
              border: solid 1px #4f5776;
              background-color: #202136;
              ul {
                margin-bottom: 0;
              }
              ul li {
                padding-left: 20px;
                width: 100%;
                height: 50px;
                line-height: 50px;
                cursor: pointer;
                user-select: none;
                list-style: none;
                box-sizing: border-box;
                font-size: 14px;
                font-weight: normal;
                font-family: "PingFang SC",sans-serif;
                text-align: left;
                color: #fff;
              }
              ul .li {
                color: #a460f5;
                background-color: #343650;
              }
            }
            &:first-child {
              margin-top: 0;
            }
          }
        }
        .m_c_m_l_filterBtn {
          margin: 20px auto 0;
          width: 290px;
          height: 50px;
          line-height: 50px;
          font-size: 16px;
          font-family: "PingFang SC",sans-serif;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          cursor: pointer;
          user-select: none;
          color: #9b63ed;
          border-radius: 10px;
          border: solid 1px #9b63ed;
        }
        .m_c_m_l_refilterBtn {
          margin: 25px auto 0;
          width: 290px;
          height: 40px;
          line-height: 40px;
          font-size: 16px;
          font-family: "PingFang SC",sans-serif;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          cursor: pointer;
          user-select: none;
          color: var(--white);
        }
      }
      .m_c_m_c_right {
        display: flex;
        flex-direction: column;
        padding-top: 0.1px;
        width: 880px;
        height: 1300px;
        //background-color: red;
        overflow: hidden;
        .m_c_class {
          flex: none;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-top: 12px;
          div {
            height: 30px;
            margin-left: 44px;
            line-height: 30px;
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            letter-spacing: normal;
            text-align: left;
            user-select: none;
            cursor: pointer;
            font-family: PingFangSC,sans-serif;
            color: #8080c9;
            &:first-child {
              margin-left: 0;
            }
          }
          div:hover {
            color: #fff;
          }
          .m_c_class1 {
            padding: 0 27px 0 27px;
            font-size: 14px;
            border-radius: 15px;
            background-color: #fff;
            color: #000;
          }
          .m_c_class1:hover {
            color: #000;
          }
        }
        .m_c_wraper {
          margin-top: 12px;
          flex: 1 1 auto;
          overflow-y: scroll;
        }
      }
    }
  }
}

/deep/ .el-menu {
  border: none !important;
  margin:0 !important;
  padding:0 !important;
}
/deep/ .el-submenu .el-submenu__title {
  height: 50px !important;
  line-height: 50px !important;
  padding: 0px !important;
  text-align: left !important;
  border-bottom: solid 1px var(--bgc10);
}
/deep/ .el-submenu .el-submenu__title:hover {
  background-color: transparent !important;
}
.el-submenu .el-submenu__title span {
  font-size: 18px;
  font-weight: 500;
  text-align: left;
  font-family: Montserrat,sans-serif;
  font-stretch: normal;
  font-style: normal;
  user-select: none;
  color: var(--white);
}
/deep/ .el-submenu__title .el-submenu__icon-arrow {
  width: 11px !important;
  height: 8px !important;
}
/deep/ .el-submenu__title .el-icon-arrow-down:before {
  content: url('../../../assets/marks/icon_m_gb.svg') !important;
}
/deep/ .el-menu-item {
  height: 50px !important;
  line-height: 50px !important;
  padding: 0 0 0 30px !important;
  text-align: left !important;
}
/deep/ .el-menu-item:hover {
  background-color: transparent !important;
}
.el-menu-item span {
  font-size: 16px;
  font-weight: normal;
  text-align: left;
  font-family:  Montserrat,sans-serif;;
  font-stretch: normal;
  font-style: normal;
  user-select: none;
  color: var(--bgc09);
}
.el-menu-item .selectedItem {
  font-size: 16px;
  font-weight: normal;
  text-align: left;
  font-family:  Montserrat,sans-serif;;
  font-stretch: normal;
  font-style: normal;
  user-select: none;
  color: var(--primary);
}
.el-menu-item .selectedImg {
  margin-left: 30px;
  width: 20px;
  height: 20px;
}


// .el-submenu .el-submenu__title .el-submenu__icon-arrow .el-icon-arrow-down {
//   background-image: url('../../assets/marks/icon_m_xs.svg');
// }

</style>
