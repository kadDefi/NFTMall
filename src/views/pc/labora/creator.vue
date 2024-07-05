<template>
  <div class="creator">
    <div class="l_bg">
      <van-image class="l_img" :src="isAvatarStringEmpty(coverUrl) ? require(`../../../assets/newPhones/nCreator/icon_c_pc_bg_${isEnglish ? 'y' : 'z'}.png`) : coverUrl"  fit="cover"></van-image>
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
      <img class="l_shadow" src="../../../assets/laboras/icon_shadow_bg.png" alt="">
    </div>
    <div class="c_contian" @scroll="scrollEvent">
      <creator-card :marketList="creatorDataList" :typeName="typeName"></creator-card>
    </div>
    <div class="c_footer"> © 2022 COMPASS Club. All rights reserved. </div>
  </div>
</template>

<script>

const settingConfig = require('../../../settings.js');
import { mapGetters } from 'vuex';
import { isStringEmpty } from '@/utils/validate';
import {getCreatorListData, getShopList} from '@/api/mark'
import creatorCard from '../../../components/creatorCard/creatorCard.vue';

export default {
  name: "creator",
  components: {
    'creator-card':creatorCard,
  },
  data() {
    return {
      isEnglish:false,
      showPapination:false,
      creatorAddress:'',
      creatorNumber:'--', // 创建的第几个用户
      customerName:'--',// 用户名称
      temaLevel:0, // 等级
      avatarUrl:'',// 头像
      coverUrl: '',//封面
      pageNum:1, // 分页
      moreLoading:false, // 是否是加载中
      noMore:false, // 是否没有数据了
      creatorDataList:[],
      typeName: '', // 判断是常规类/店铺类的铸造者列表
    };
  },
  created() {
    // 获取当前语言
    this.isEnglish = localStorage.getItem("lang") !== "zh";
    // 判断是否是店铺类列表
    this.typeName = this.$route.query.item2;
    // 设置tabBar在哪个页面
    const that = this;
    setTimeout(() => {
      that.$eventBus.$emit("checkNFTDetailJump", this.typeName === 'shop' ? 4 : 3);
    }, 500);
    this.getCreatorListData(true);
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
    // 监听语言的切换
    '$i18n.locale'(val,oval) {
      this.isEnglish = val !== 'zh';
    }
  },
  // 方法
  methods: {
    // 判断头像是否是空的
    isAvatarStringEmpty(avatar) {
      return isStringEmpty(avatar);
    },
    scrollEvent(e) {
      // !this.moreLoading 没有在加载状态，触发加载更多时，把this.moreLoading置未true
      // !this.noMore 没有更多的状态为false，当我们取到的数据长度小于1页的数量时，就没有更多了数据了，把 this.noMore置为true，这样就不会触发无意义的加载更多了
      if(e.srcElement.scrollTop + e.srcElement.offsetHeight > e.srcElement.scrollHeight - 10 && !this.moreLoading && !this.noMore) {
        this.pageNum++;
        this.getCreatorListData(false);
        console.log('开始调用加载更多');
      }
    },
    // 获取铸造者详情列表数据
    async getCreatorListData(isRefersh) {
      this.moreLoading = true;
      const dict = {};
      dict['address'] = this.$route.query.item;
      dict['page'] = isRefersh ? 1 : this.pageNum; // 当前第几页
      dict['count'] = 20;
      const that = this;
      let result;
      if (this.typeName === 'shop') {
        result = await getShopList(dict);
        console.log('店铺类铸造者列表数据 =', result)
      } else {
        result = await getCreatorListData(dict);
        console.log('商品类/NFT类铸造者列表数据 =', result)
      }
      if (result.status === 200) {
        that.temaLevel = result.data.level;
        that.customerName = result.data.name;
        that.creatorNumber = result.data.number;
        if (isStringEmpty(result.data.picurl)) {
          that.avatarUrl = '';
        }else  {
          const newStr = result.data.picurl.indexOf("https");
          if (newStr === -1) {
            that.avatarUrl = `${settingConfig.ipfsNFTUrl + result.data.picurl}`
          }else  {
            that.avatarUrl = result.data.picurl;
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
        if (result.data.count <= 0) {
          return;
        }
        result.data.result.forEach((item) => {
          const newStr = item.picurl.indexOf("https");
          if (newStr === -1) {
            item.picurl = `${settingConfig.ipfsNFTUrl + item.picurl}`
          }
        });
        if (isRefersh){
          that.creatorDataList = result.data.result;
        }else {
          that.creatorDataList.push(...result.data.result);
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
    },
  },
};
</script>

<style lang="scss" scoped>

.creator {
  overflow: hidden;
  padding-top: 0.1px;
  position: relative;
  box-sizing: border-box;
  background-color: #202136;
  .l_bg {
    position: relative;
    margin: 0 auto;
    width: 1400px;
    height: 560px;
    box-sizing: border-box;
    .l_img {
      width: 100%;
      height: 100%;
    }
    .l_div {
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 140px;
      .n_t_header {
        position: relative;
        width: 140px;
        height: 140px;
        .van-image {
          width: 100%;
          height: 100%;
          border: 5px solid white;
        }
        .n_t_level {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 40px;
          height: 40px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .n_t_content {
        margin-left: 14px;
        .l_nickName {
          text-align: left;
          margin: auto 0;
          span {
            line-height: 48px;
            font-size: 32px;
            font-weight: 600;
            font-stretch: normal;
            font-style: normal;
            font-family: PingFangSC, sans-serif;
            user-select: none;
            color: var(--white);
          }
        }
        .l_creator {
          margin: 15px auto 0;
          font-size: 16px;
          line-height: 22px;
          font-family: PingFangSC, sans-serif;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          color: #72729b;
        }
      }
    }
    .l_shadow {
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 1;
      width: 1400px;
      height: 560px;
    }
  }
  .c_contian {
    overflow-y: scroll;
    margin: 40px auto 0;
    width: 1200px;
    height: 950px;
  }
  .c_footer {
    margin-top: 80px;
    height: 108px;
    line-height: 108px;
    font-size: 16px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    font-family: "PingFang SC",sans-serif;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url('../../../assets/wish/icon_n_footer_bg.svg');
    color: var(--white);
  }
}

</style>
