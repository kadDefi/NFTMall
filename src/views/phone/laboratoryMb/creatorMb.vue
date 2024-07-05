<template>
  <div class="creator">
    <div class="top_bar">
      <img src="../../../assets/newPhones/nMarket/icon_detail_back.svg" alt="" @click="goBackPage">
    </div>
    <div class="c_top">
      <div class="l_bg">
        <van-image class="l_img" fit="cover" :src="isAvatarStringEmpty(coverUrl)?require('../../../assets/newPhones/nCreator/icon_c_bg'+(typeName==='shop'?'1':'')+'.png'):coverUrl"></van-image>
        <div class="l_div">
          <div class="n_t_header">
            <van-image fit="cover" :src="isAvatarStringEmpty(avatarUrl)?require('../../../assets/newPhones/nMarket/icon_header_logo.png'):avatarUrl" round></van-image>
            <div class="n_t_level"><img :src="require(`../../../assets/laboras/icon_l_level_${temaLevel}.svg`)" alt=""></div>
          </div>
          <div class="n_t_content">
            <div class="l_nickName">
              <span>{{ isConnectWallet ? customerName : '--' }}</span>
            </div>
            <div class="l_creator">{{ $t("message.labora.creatorNo") }}: #{{ isConnectWallet ? creatorNumber : '--' }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="c_line"></div>
    <div v-if="creatorDataList.length <= 0" class="list-empty" @click="onRefresh">{{ $t("message.holding.empty") }}</div>
    <van-pull-refresh v-else v-model="refreshing" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" :finished-text="$t('message.alertMsg.loadFinisedMsg')" :immediate-check="false" @load="onLoadMore">
        <creator-card :marketList="creatorDataList" :typeName="typeName"></creator-card>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>

import {mapGetters} from 'vuex';
import {isStringEmpty} from '@/utils/validate';
import {getCreatorListData, getShopList} from '@/api/mark'
import creatorCard from '../../../components/creatorCardMb/creatorCardMb.vue';
const settingConfig = require('../../../settings.js');

export default {
  name: "creatorMb",
  components: {
    'creator-card': creatorCard,
  },
  data() {
    return {
      isEnglish: false,
      refreshing: false,// 是否刷新中
      loading: false, // 加载更多
      finished: false, // 结束加载更是
      pageSize: 1, // 当前的页码
      creatorNumber: '--', // 创建的第几个用户
      customerName: '--',// 用户名称
      temaLevel: 0, // 等级
      avatarUrl: '',// 头像
      coverUrl: '',//封面
      creatorDataList: [],
      typeName: '',
    };
  },
  created() {
    this.onRefresh();
    this.typeName = this.$route.query.item2;
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
  watch: {},
  // 方法
  methods: {
    goBackPage() {
      this.$router.back();
    },
    // 判断头像是否是空的
    isAvatarStringEmpty(avatar) {
      return isStringEmpty(avatar);
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
      this.getCreatorListData(true);
    },
    // 上拉加载更多
    onLoadMore() {
      this.getCreatorListData(false);
    },
    // 获取铸造者详情列表数据
    async getCreatorListData(isRefresh) {
      if (this.refreshing) {
        this.creatorDataList = [];
        this.refreshing = false;
      }

      const dict = {};
      dict['address'] = this.$route.query.item;
      dict['page'] = this.pageSize; // 当前第几页
      dict['count'] = 8;
      let type = this.$route.query.item2;
      let result;
      if (type === 'shop') {
        result = await getShopList(dict);
        console.log('getShopList =', result)
      } else {
        result = await getCreatorListData(dict);
        console.log('getCreatorListData =', result)
      }
      if (result.status === 200) {
        this.temaLevel = result.data.level;
        this.customerName = result.data.name;
        this.creatorNumber = result.data.number;
        if (isStringEmpty(result.data.userPic)) {
          this.avatarUrl = '';
        } else {
          const newStr = result.data.userPic.indexOf("https");
          if (newStr === -1) {
            this.avatarUrl = `${settingConfig.ipfsNFTUrl + result.data.userPic}`
          } else {
            this.avatarUrl = result.data.userPic;
          }
        }
        if (isStringEmpty(result.data.coverPic)) {
          this.coverUrl = '';
        } else {
          const newStr = result.data.coverPic.indexOf("https");
          if (newStr === -1) {
            this.coverUrl = `${settingConfig.ipfsNFTUrl + result.data.coverPic}`
          } else {
            this.coverUrl = result.data.coverPic;
          }
        }
        // 开始处理列表数据
        result.data.result.forEach((item) => {
            if (isStringEmpty(item.picurl)) {
              item.picurl = '';
            } else {
              const newStr = item.picurl.indexOf("https");
              if (newStr === -1) {
                item.picurl = `${settingConfig.ipfsNFTUrl + item.picurl}`
              }
            }
          }
        );
        // 当获取数据完成后开始处理控件状态
        if (isRefresh) {
          this.creatorDataList = result.data.result;
        } else {
          this.creatorDataList.push(...result.data.result);
        }
        if (result.data.result.length < 8) {
          this.finished = true;
        }
        this.pageSize++;
        console.log(`创造者列表数据源数据=`, this.creatorDataList);
      } else {
        this.finished = true;
        this.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
      }
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>

.creator {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  padding-top: 0.1px;
  box-sizing: border-box;
  background-color: #202136;
  .top_bar {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100vw;
    height: vw(110);
    padding: 0 vw(30);
    text-align: left;
    img {
      margin-top: vw(15);
      width: vw(80);
      height: vw(80);
    }
  }
  .c_top {
    flex: none;
    width: 100%;
    height: vw(402);
    background-color: #202136;
    .l_bg {
      position: relative;
      width: 100%;
      height: 100%;
      .l_img {
        width: 100%;
        height: 100%;
      }
      .l_div {
        position: absolute;
        bottom: vw(-5);
        left: 0;
        display: flex;
        align-items: center;
        padding: 0 vw(30);
        width: 100%;
        height: vw(165);
        box-sizing: border-box;
        background-size: 100%;
        background-repeat: no-repeat;
        background-image: url('../../../assets/newPhones/nCreator/icon_shadow_bg.png');
        .n_t_header {
          position: relative;
          width: vw(160);
          height: vw(160);
          .van-image {
            width: 100%;
            height: 100%;
            border: vw(5) solid white;
          }
          .n_t_level {
            position: absolute;
            bottom: 0;
            right: 0;
            width: vw(50);
            height: vw(50);
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
        .n_t_content {
          margin-left: vw(20);
          .l_nickName {
            text-align: left;
            margin: auto 0;
            span {
              line-height: vw(45);
              font-size: vw(32);
              font-weight: 600;
              font-stretch: normal;
              font-style: normal;
              font-family: PingFangSC, sans-serif;
              user-select: none;
              color: var(--white);
            }
          }
          .l_creator {
            margin: vw(16) auto 0;
            font-size: vw(24);
            line-height: vw(33);
            font-family: PingFangSC, sans-serif;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            color: #72729b;
          }
        }
      }
    }
  }
  .c_line {
    margin-top: vw(30);
    width: vw(750);
    height: vw(2);
    background-color: #494b65;
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

</style>
