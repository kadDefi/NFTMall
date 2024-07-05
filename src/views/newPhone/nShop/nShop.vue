<template>
  <div class="nShop">
    <div class="n_shop_top"></div>
    <div class="n_shop_content">
      <div class="n_c_content">
        <div class="m_c_m_c_search">
          <input type="text" v-model="searchKeyword" :placeholder="searchPlaceHoder">
        </div>
        <div class="n_c_search" @click="handleClickSearch">
          <img :src="require(`../../../assets/newPhones/nMarket/icon_noram_search.svg`)" alt="search"/>
        </div>
      </div>
      <div v-if="shopList.length <= 0" class="s_empty">{{ $t("message.holding.empty") }}</div>
      <van-pull-refresh v-else v-model="isRefresh" @refresh="onRefresh">
        <van-list v-model="isLoadMoring" :finished="isFinisedLoadMoring" :finished-text="$t('message.alertMsg.loadFinisedMsg')" :immediate-check="false" @load="onLoadMore">
          <shop-card :shopList="shopList" @handleClickItem="handleClickItem"></shop-card>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import shopCard from '@/components/shopCardMb/shopCardMb'
import {getShop} from '@/api/mark'
import settingConfig from '@/settings'
import {isStringEmpty} from '@/utils/validate'

export default {
  name: "nShop",
  components: {
    'shop-card': shopCard,
  },
  data() {
    return {
      isEnglish: true,
      isRefresh: false,// 是否刷新中
      isLoadMoring: false, // 加载更多
      isFinisedLoadMoring: false, // 结束加载更是
      searchKeyword: '',
      searchPlaceHoder: this.$t('message.labora.enterStoreName'),
      pageSize: 1, // 当前的页码
      shopList: [],
    }
  },
  // 监听属性改变
  watch: {
    searchKeyword(val, oval) {
      if (isStringEmpty(val)) {
        this.onRefresh();
      }
    },
    '$i18n.locale'(nval, oval) {
      this.isEnglish = nval !== 'zh';
      this.searchPlaceHoder = this.$t('message.labora.enterStoreName');
    }
  },
  created() {
    this.isEnglish = window.localStorage.getItem("lang") !== "zh";
    this.getShopListData(true);
    console.log('hold page create');
  },
  methods: {
    handleClickSearch() {
      this.getShopListData(true);
    },
    handleClickItem(item) {
      this.$router.push({ path: '/creatorMb', query: { item: item.address, item1: this.isEnglish, item2: 'shop' } });
    },
    // 下拉刷新回调
    onRefresh() {
      this.isFinisedLoadMoring = false;
      this.getShopListData(true);
    },
    // 上拉加载更多
    onLoadMore() {
      this.getShopListData(false);
    },
    async getShopListData(isRefresh) {
      const dict = {};
      dict['name'] = this.searchKeyword;
      dict['page'] = isRefresh ? 1 : this.pageSize; // 当前第几页
      dict['count'] = 8; // 当前第几页
      const that = this;
      let result = await getShop(dict);
      console.log('getShop =', result);
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
        // 当获取数据完成后开始处理控件状态
        if (isRefresh) {
          that.isRefresh = false;
          that.pageSize = 2;
          that.shopList = [];
          console.log('下拉刷新');
        } else {
          that.isLoadMoring = false;
          this.pageSize++;
          // 当返回的数据是空的时候则表示已经加载完毕
          console.log('上拉加载更多');
        }
        if (result.data.result.length < 8 && !isRefresh) {
          that.isFinisedLoadMoring = true;
        }
        that.shopList = that.shopList.concat(result.data.result);
        console.log(`店铺列表数据=`, that.shopList);
      } else {
        if (isRefresh) {
          that.isRefresh = false;
        } else {
          that.isLoadMoring = false;
        }
        that.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.nShop {
  position: relative;
  padding-top: 0.1px;
  box-sizing: border-box;
  overflow: hidden;
  height: 100vh;
  background-color: #202136;
  .n_shop_top {
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
  .n_shop_content {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100vw;
    height: 100%;
    .n_c_content {
      flex: 0 0 auto;
      display: flex;
      justify-content: space-between;
      padding: 0 vw(30);
      margin-top: vw(120);
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
    }
    .s_empty {
      margin: vw(370) auto 0;
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
    .van-pull-refresh {
      width: vw(690);
      margin: vw(10) auto 0;
      flex: 1 1 auto;
      overflow: auto;
      max-height: 100%;
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
