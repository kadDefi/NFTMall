<template>
  <div class="creator">
    <div class="c_top">
      <div class="l_bg">
        <van-image class="l_img" fit="cover" :src="isAvatarStringEmpty(coverUrl)?require('../../../assets/newPhones/nCreator/icon_c_bg'+(isSpecialSeller?'1':'')+'.png'):coverUrl"></van-image>
        <div class="l_div">
          <div class="l_d_left">
            <van-uploader :after-read="afterRead">
              <div class="n_t_header">
                <van-image fit="cover" :src="isAvatarStringEmpty(avatarUrl)?require('../../../assets/newPhones/nMarket/icon_header_logo.png'):avatarUrl" round></van-image>
                <div class="n_t_level"><img :src="require(`../../../assets/laboras/icon_l_level_${teamLevel}.svg`)" alt=""></div>
              </div>
            </van-uploader>
            <div class="n_t_content">
              <div class="l_nickName">
                <span>{{ isConnectWallet ? customerName : '--' }}</span>
                <img src="../../../assets/newPhones/universal/icon_edit.svg" alt="" @click="handleClickEditName(1)">
              </div>
              <div class="l_creator">{{ $t("message.labora.creatorNo") }}: #{{ isConnectWallet ? creatorNumber : '--' }}</div>
            </div>
          </div>
          <van-uploader v-if="isSpecialSeller" :after-read="afterReadCover">
            <div class="l_d_right">
              <img src="../../../assets/newPhones/nCreator/icon_c_photo.svg" alt="">
              <span>{{ $t('message.center.changeCover') }}</span>
            </div>
          </van-uploader>
        </div>
      </div>
    </div>
    <div class="n_t_switch">
      <div class="n_t_s_detail" :class="switchIndex === 0 ? 'n_t_s_info' : ''" @click="handleClickSwitch(0)">{{ $t('message.center.nftRecord') }}</div>
      <div class="n_t_s_detail" :class="switchIndex === 1 ? 'n_t_s_info' : ''" @click="handleClickSwitch(1)">{{ $t('message.center.acceleratedRecord') }}</div>
      <div class="n_t_s_detail" :class="switchIndex === 2 ? 'n_t_s_info' : ''" @click="handleClickSwitch(2)">{{ $t('message.center.promotionRecord') }}</div>
    </div>
    <div v-if="switchIndex === 0" class="p_title" @click="handleClickFilter">
      <span class="p_title_select">{{ filterDesc }}</span>
      <img src="../../../assets/laboras/h5_icon_x.svg" alt="logo">
    </div>
    <div v-show="isShowFilter" class="p_select">
      <span :class="recordType === 0 ? 'p_title_select' :''" @click="handleClickRecord(0)">{{ $t("message.smFreed.all") }}</span>
      <span :class="recordType === 1 ? 'p_title_select' :''" @click="handleClickRecord(1)">{{ $t("message.smFreed.casting") }}</span>
      <span :class="recordType === 2 ? 'p_title_select' :''" @click="handleClickRecord(2)">{{ $t("message.smFreed.sell") }}</span>
      <span :class="recordType === 3 ? 'p_title_select' :''" @click="handleClickRecord(3)">{{ $t("message.smFreed.buy") }}</span>
      <span :class="recordType === 4 ? 'p_title_select' :''" @click="handleClickRecord(4)">{{ $t("message.smFreed.delivery") }}</span>
      <span :class="recordType === 5 ? 'p_title_select' :''" @click="handleClickRecord(5)">{{ $t("message.smFreed.isTheDelivery") }}</span>
      <span :class="recordType === 6 ? 'p_title_select' :''" @click="handleClickRecord(6)">{{ $t("message.smFreed.destroy") }}</span>
      <!--<span :class="recordType === 7 ? 'p_title_select' :''" @click="handleClickRecord(7)">{{ $t("message.smFreed.beDestroyed") }}</span>-->
    </div>
    <div v-if="recordDataList.length <= 0" class="list-empty" @click="onRefresh">{{ $t("message.holding.empty") }}</div>
    <van-pull-refresh v-else v-model="refreshing" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" :finished-text="$t('message.alertMsg.loadFinisedMsg')" :immediate-check="false" @load="onLoadMore">
        <div v-if="switchIndex === 0" class="nft-record">
          <div class="nft-record-item" v-for="(item,index) in recordDataList" :key="index">
            <van-image class="item-img" :src="item.pic"></van-image>
            <div class="item-left">
              <span class="item-name multi-ellipsis--l2">{{ item.name }}</span>
              <span class="item-time">{{ item.time }}</span>
            </div>
            <div class="item-right">
              <span class="item-type">{{ recordTypeDesc(item) }}</span>
              <span v-if="item.headType === 1 && (item.status === 4 || item.status === 5 )" class="item-amount">
                <van-image class="coin_logo" :src="require(`../../../assets/newPhones/nCasting/icon_c_alad.svg`)" round/>
                {{ item.aladPrice | roundingDecimals(4) }}
              </span>
              <span v-if="item.headType === 2 && (item.status === 2 || item.status === 3 )" class="item-amount">
                <van-image class="coin_logo" :src="require(`../../../assets/newPhones/nCasting/icon_c_alad.svg`)" round/>
                {{ item.aladPrice | roundingDecimals(4)  }}
              </span>
            </div>
          </div>
        </div>
        <div v-else-if="switchIndex === 1" class="release-record">
          <div class="release-record-item" v-for="(item,index) in recordDataList" :key="index">
            <div class="item-left">
              <span class="item-name multi-ellipsis--l2">{{ freedTypeDesc(1, item) }}</span>
              <span class="item-time">{{ item.days }}</span>
            </div>
            <div class="item-right">
              <span class="item-type">{{ freedTypeDesc(2, item) }}</span>
              <span class="item-amount">{{ item.amount | tanferUnitData(18) | notRoundingDecimals(4) }}</span>
            </div>
          </div>
        </div>
        <div v-else class="promote-record">
          <div class="promote-record-item" v-for="(item,index) in recordDataList" :key="index">
            <img :src="require(`../../../assets/laboras/icon_l_level_${item.level}.svg`)" alt="logo">
            <span>{{ item.address }}</span>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
    <!-- 修改昵称 -->
    <div class="mask" v-show="showModifyNickMaks" @touchmove.prevent @mousewheel.prevent>
      <div class="modifyNick">
        <div class="m_dis_title">{{ $t("message.labora.EditNickname") }}</div>
        <div class="m_dis_input"><input type="text" v-model="modifyNickName" :placeholder="modifyNamePlaceHolder"></div>
        <div class="m_dis_confirm" @click="getCustomerInfoData(0)">{{ $t("message.labora.Submit") }}</div>
        <img class="mask_close" src="../../../assets/newPhones/nLaboratory/icon_qb_close.svg" alt="logo" @click="showModifyNickMaks = !showModifyNickMaks">
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import {isStringEmpty} from '@/utils/validate';
import {getCustomerInfoData, getCustomerPromoteList, getHistoryRecordListData, getUserReleaseListData, publishCover, uploadAvatar} from '@/api/mark'
import creatorCard from '../../../components/creatorCardMb/creatorCardMb.vue';
import {create as ipfsHttpClient} from 'ipfs-http-client';
const settingConfig = require('../../../settings.js');

export default {
  name: "nCenter",
  components: {
    'creator-card': creatorCard,
  },
  data() {
    return {
      isEnglish: false,
      showModifyNickMaks: false, // 修改昵称弹框
      modifyNamePlaceHolder: this.$t("message.labora.modifyNamePlaceHoler"),
      isSpecialSeller: false,

      refreshing: false,// 是否刷新中
      loading: false, // 加载更多
      finished: false, // 结束加载更是
      pageSize: 1, // 当前的页码

      switchIndex: 0,
      creatorNumber: '--', // 创建的第几个用户
      customerName: '--',// 用户名称
      teamLevel: 0, // 等级
      avatarUrl: '',// 头像
      coverUrl: '',//封面
      modifyNickName: '', // 输入需要修改的名称
      recordDataList: [],
      ipfsClient: null, // IPFS对象

      recordType:0,
      filterDesc:'',
      isShowFilter:false,
    };
  },
  created() {
    this.filterDesc = this.recordTypeDesc({status:0});
    let shopStatus = sessionStorage.getItem('shopStatus');
    if (shopStatus !== null) {
      this.isSpecialSeller = parseInt(shopStatus) === 1;
    }
    // 创建IPF客户端对象
    const ipfsNode = settingConfig.ipfsNode;
    this.ipfsClient = ipfsHttpClient(ipfsNode);
    this.getCustomerInfoData(1);
    this.onRefresh();
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
    // 监听语言的切换
    '$i18n.locale'(val, oval) {
      this.isEnglish = val !== 'zh';
      this.modifyNamePlaceHolder = this.$t("message.labora.modifyNamePlaceHoler");
    },
    isConnectWallet(val, oval) {
      this.getCustomerInfoData(1);
      this.onRefresh();
    },
  },
  // 方法
  methods: {
    async afterRead(file) {
      try {
        const added = await this.ipfsClient.add(file.file, { progress: (prog) => console.log(`received: ${prog}`) });
        await this.uploadCustomerAvatar(added);
      } catch (e) {

      }
    },
    async afterReadCover(file) {
      try {
        const added = await this.ipfsClient.add(file.file, { progress: (prog) => console.log(`received: ${prog}`) });
        await this.uploadCover(added);
      } catch (e) {

      }
    },
    // 上传更新用户头像
    async uploadCover(added) {
      const uploadDict = {};
      uploadDict['sender'] = this.walletAddress;
      uploadDict['pics'] = added.path;
      const result = await publishCover(uploadDict);
      if (result.status === 200) {
        this.coverUrl = `${settingConfig.ipfsNFTUrl + added.path}`;
      } else {
        this.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
      }
    },
    // 上传更新用户头像
    async uploadCustomerAvatar(added) {
      const uploadDict = {};
      uploadDict['address'] = this.walletAddress;
      uploadDict['pic'] = added.path;
      const result = await uploadAvatar(uploadDict);
      if (result.status === 200) {
        this.avatarUrl = `${settingConfig.ipfsNFTUrl + added.path}`;
      } else {
        this.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
      }
    },
    // 切换了类型
    handleClickRecord(index) {
      this.recordType = index;
      this.filterDesc = this.recordTypeDesc({status:index});
      this.isShowFilter = false;
      this.onRefresh();
    },
    handleClickFilter() {
      this.isShowFilter = !this.isShowFilter;
    },
    // 操作类型
    recordTypeDesc(item) {
      // type： 0:全部数据，1: 铸造,2:出售,3:购买,4:交割,5:被交割,6:销毁,7:被销毁
      let freedDesc = this.$t("message.smFreed.all");
      if (item.status === 1) {
        freedDesc = this.$t("message.smFreed.casting");
      } else if (item.status === 2) {
        freedDesc = this.$t("message.smFreed.sell");
      } else if (item.status === 3) {
        freedDesc = this.$t("message.smFreed.buy");
      } else if (item.status === 4) {
        freedDesc = this.$t("message.smFreed.delivery");
      } else if (item.status === 5) {
        freedDesc = this.$t("message.smFreed.isTheDelivery");
      } else if (item.status === 6) {
        freedDesc = this.$t("message.smFreed.destroy");
      } else if (item.status === 7) {
        freedDesc = this.$t("message.smFreed.beDestroyed");
      }
      return freedDesc;
    },
    // 释放类型
    freedTypeDesc(index, item) {
      let freedDesc = this.$t("message.smFreed.dynamicSF");
      if (index === 1) {
        // type： 1: 动态加速    2:级别加速    3: 推广奖励
        if (item.type === 2) {
          freedDesc = this.$t("message.smFreed.levelSF");
        } else if (item.type === 3) {
          freedDesc = this.$t("message.smFreed.promotionSF");
        }
      } else if (index === 2) {
        // status： 0: 未释放   1:已经释放
        freedDesc = this.$t("message.smFreed.pendingRelease");
        if (item.status === 1) {
          freedDesc = this.$t("message.smFreed.released");
        }
      }
      return freedDesc;
    },
    goBackPage() {
      this.$router.back();
    },
    // 判断头像是否是空的
    isAvatarStringEmpty(avatar) {
      return isStringEmpty(avatar);
    },
    // 切换NFT详情信息
    handleClickSwitch(index) {
      this.isShowFilter = false;
      if (this.switchIndex === index)
        return
      this.switchIndex = index;
      this.onRefresh();
    },
    // 修改昵称
    handleClickEditName(index) {
      if (index === 1) {
        this.showModifyNickMaks = true;
      } else if (index === 2) {
        console.log('更换封面')
      }
    },
    // 关闭修改昵称
    handleClickCloseModifyName() {
      this.showModifyNickMaks = false;
      this.modifyNickName = '';
    },
    // 获取用户名称
    async getCustomerInfoData(type) {
      // 0 修改昵称  1 获取列表数据
      if (!this.isConnectWallet) {
        return;
      }
      const dict = {};
      dict['type'] = type;
      dict['address'] = this.walletAddress;
      if (type === 0) {
        dict['name'] = this.modifyNickName;
      }
      const result = await getCustomerInfoData(dict);
      if (result.status === 200) {
        if (type === 0) {
          this.customerName = this.modifyNickName;
          this.handleClickCloseModifyName();
          this.$notify({ message: this.$t("message.labora.modifySuccess"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        } else if (type === 1) {
          // 判断用户是否绑定了上级地址
          const data = result.data;
          const isBindSuperAddress = data.superadd !== "0x0000000000000000000000000000000000000000";
          // 将用户是否绑定上级地址进行存储
          this.$store.dispatch('wallet/setBindSuperAddress', isBindSuperAddress);
          this.isSpecialSeller = parseInt(data.shopStatus) === 1;
          sessionStorage.setItem('shopStatus', data.shopStatus);
          this.teamLevel = data.level;
          this.superAdd = data.superadd;
          this.customerName = isStringEmpty(data.name) ? '' : data.name;
          this.creatorNumber = isStringEmpty(data.number) ? '--' : data.number;
          if (isStringEmpty(data.picurl)) {
            this.avatarUrl = '';
          } else {
            const newStr = data.picurl.indexOf("https");
            if (newStr === -1) {
              this.avatarUrl = `${settingConfig.ipfsNFTUrl + data.picurl}`
            } else {
              this.avatarUrl = data.picurl;
            }
          }
          if (isStringEmpty(data.coverPic)) {
            this.coverUrl = '';
          } else {
            const newStr = data.coverPic.indexOf("https");
            if (newStr === -1) {
              this.coverUrl = `${settingConfig.ipfsNFTUrl + data.coverPic}`
            } else {
              this.coverUrl = data.coverPic;
            }
          }
          console.log('result data = ', data);
        }
      } else {
        this.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
      }
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
      this.getCustomerPromoteList(true);
    },
    // 上拉加载更多
    onLoadMore() {
      this.getCustomerPromoteList(false);
    },
    // 获取用户在持NFT数据
    async getCustomerPromoteList(isRefresh) {
      if (this.refreshing) {
        this.recordDataList = [];
        this.refreshing = false;
      }
      if (!this.isConnectWallet) {
        return;
      }
      if (this.switchIndex === 0) {
        const dict = {};
        // type: 0:全部数据，1: 铸造,2:出售,3:购买,4:交割,5:被交割,6:销毁,7:被销毁
        dict['type'] = this.recordType;
        // 用户地址
        dict['address'] = this.walletAddress;
        // 当前第几页
        dict['page'] = this.pageSize;
        const result = await getHistoryRecordListData(dict);
        if (result.status === 200) {
          result.data.outData.forEach((item) => {
            if (isStringEmpty(item.pic)) {
              item.pic = '';
            } else {
              const newStr = item.pic.indexOf("https");
              if (newStr === -1) {
                item.pic = `${settingConfig.ipfsNFTUrl + item.pic}`
              }
            }
          });
          if (isRefresh) {
            this.recordDataList = result.data.outData;
          } else {
            this.recordDataList.push(...result.data.outData);
          }
          if (result.data.outData.length < 8) {
            this.finished = true;
          }
          this.pageSize++;
        } else {
          this.finished = true;
          this.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
        }
        console.log('NFT列表=', result);
      } else if (this.switchIndex === 1) {
        const dict = {};
        dict['address'] = this.walletAddress; // 用户地址
        dict['page'] = this.pageSize;
        const result = await getUserReleaseListData(dict);
        if (result.status === 200) {
          if (isRefresh) {
            this.recordDataList = result.data.outData;
          } else {
            this.recordDataList.push(...result.data.outData);
          }
          if (result.data.outData.length < 8) {
            this.finished = true;
          }
          this.pageSize++;
        } else {
          this.finished = true;
          this.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
        }
        console.log('释放列表', result);
      } else {
        const dict = {};
        dict['address'] = this.walletAddress; // 用户地址
        dict['page'] = this.pageSize;
        const result = await getCustomerPromoteList(dict);
        if (result.status === 200) {
          result.data.result.forEach((item, index) => {
            item.address = item.address.toLowerCase();
          });
          if (isRefresh) {
            this.recordDataList = result.data.result;
          } else {
            this.recordDataList.push(...result.data.result);
          }
          if (result.data.result.length < 8) {
            this.finished = true;
          }
          this.pageSize++;
        } else {
          this.finished = true;
          this.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
        }
        console.log('推广列表', result);
      }
      this.loading = false;
    }
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
  .c_top {
    flex: none;
    margin-top: vw(100);
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
        justify-content: space-between;
        padding: 0 vw(30);
        width: 100%;
        height: vw(165);
        box-sizing: border-box;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-image: url('../../../assets/newPhones/nCreator/icon_shadow_bg.png');
        .l_d_left {
          display: flex;
          align-items: center;
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
              display: flex;
              align-items: center;
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
              img {
                margin-left: vw(20);
                width: vw(44);
                height: vw(44);
              }
            }
            .l_creator {
              margin: vw(16) auto 0;
              font-size: vw(24);
              line-height: vw(33);
              text-align: left;
              font-family: PingFangSC, sans-serif;
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              color: var(--white);
            }
          }
        }
        .l_d_right {
          display: flex;
          flex-direction: column;
          align-items: center;
          img {
            width: vw(50);
            height: vw(50);
          }
          span {
            margin-top: vw(5);
            line-height: vw(33);
            font-size: vw(24);
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            font-family: PingFangSC, sans-serif;
            user-select: none;
            color: var(--white);
          }
        }
      }
    }
  }
  .n_t_switch {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: vw(40) auto 0;
    padding: vw(10) vw(14);
    width: vw(690);
    border-radius: vw(20);
    background-color: #1b1b33;
    .n_t_s_detail {
      width: vw(320);
      height: vw(72);
      font-size: vw(28);
      line-height: vw(72);
      font-weight: 500;
      font-stretch: normal;
      font-style: normal;
      letter-spacing: normal;
      text-align: center;
      color: #fff;
      border-radius: vw(16);
      font-family: PingFangSC, sans-serif;
      background-color: transparent;
    }
    .n_t_s_info {
      color: #fff;
      background-color: #33334b;
    }
  }
  .p_title {
    width: vw(660);
    height: vw(80);
    margin: vw(20) auto 0;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    user-select: none;
    box-sizing: border-box;
    border-radius: vw(10);
    border: solid 2px #9158d5;
    span {
      line-height: vw(80);
      font-size: vw(26);
      font-weight:600;
      text-align: center;
      color: #9a55dc;
      font-family: "PingFang SC",sans-serif;
    }
    img {
      margin-left: vw(20);
      width: vw(30);
      height: vw(30);
    }
  }
  .p_select {
    width: vw(660);
    height: vw(490);
    position: absolute;
    top: vw(735);
    left: vw(45);
    z-index: 1;
    cursor: pointer;
    user-select: none;
    box-sizing: border-box;
    border-radius: vw(10);
    border: solid 1px #9158d5;
    background-color: #2e2f48;
    display: flex;
    flex-direction: column;
    align-items: center;
    span {
      line-height: vw(70);
      font-size: vw(26);
      font-weight: normal;
      text-align: center;
      color: var(--white);
      cursor: pointer;
      user-select: none;
      font-family: "PingFang SC",sans-serif;
    }
    .p_title_select {
      color: #9158d5;
    }
  }
  .van-pull-refresh {
    flex: 1 1 auto;
    overflow: auto;
    margin-top: vw(10);
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
  .nft-record-item {
    display: flex;
    margin: 0 auto vw(16);
    padding: vw(30);
    width: vw(690);
    height: vw(160);
    border-radius: vw(10);
    background-color: #3d3f60;
    .item-img {
      width: vw(100);
      height: vw(100);
      border-radius: vw(10);
      overflow: hidden;
    }
    .item-left {
      flex: 1;
      display: flex;
      margin: 0 vw(20);
      flex-direction: column;
      justify-content: space-between;
      .item-name {
        font-family: PingFangSC-Regular, sans-serif;
        font-size: vw(22);
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: left;
        color: #fff;
      }
      .item-time {
        font-family: PingFangSC-Regular, sans-serif;
        font-size: vw(22);
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: left;
        color: #8181af;
      }
    }
    .item-right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .item-type {
        font-family: PingFangSC-Regular, sans-serif;
        font-size: vw(22);
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: right;
        color: #fff;
      }
      .item-amount {
        display: flex;
        align-items: center;
        .van-image {
          margin-right: vw(10);
          width: vw(30);
          height: vw(30);
        }
        font-family: PingFangSC, sans-serif;
        font-size: vw(28);
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: center;
        color: #9a55dc;
      }
    }
  }
  .release-record-item {
    display: flex;
    margin: 0 auto vw(16);
    padding: vw(30);
    width: vw(690);
    height: vw(142);
    border-radius: vw(10);
    background-color: #3d3f60;
    .item-left {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .item-name {
        font-family: PingFangSC-Regular, sans-serif;
        font-size: vw(22);
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: left;
        color: #fff;
      }
      .item-time {
        font-family: PingFangSC-Regular, sans-serif;
        font-size: vw(22);
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: left;
        color: #8181af;
      }
    }
    .item-right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .item-type {
        font-family: PingFangSC-Regular, sans-serif;
        font-size: vw(22);
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: right;
        color: #fff;
      }
      .item-amount {
        font-family: PingFangSC, sans-serif;
        font-size: vw(28);
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: center;
        color: #ff953f;
      }
    }
  }
  .promote-record-item {
    margin: 0 auto;
    width: vw(690);
    height: vw(80);
    display: flex;
    align-items: center;
    padding-left: vw(32);
    background-color: #2e2f48;
    img {
      width: vw(30);
      height: vw(30);
    }
    span {
      margin-left: vw(10);
      font-family: PingFangSC-Regular, sans-serif;
      font-size: vw(24);
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: center;
      color: white;
    }
    &:nth-child(2n) {
      background-color: #272746;
    }
  }
  .mask {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    transition: all 0.3s;
    background-color: var(--bgc02);
    .modifyNick {
      position: relative;
      width: vw(586);
      height: vw(369);
      padding: 0 vw(50);
      border-radius: vw(20);
      background-color: #27273f;
      .m_dis_title {
        margin-top: vw(40);
        line-height: vw(49);
        font-size: vw(30);
        text-align: left;
        font-family: PingFangSC, sans-serif;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        color: var(--white);
      }
      .m_dis_input {
        margin-top: vw(40);
        height: vw(80);
        border-radius: vw(10);
        background-color: #1b1b33;
        input {
          width: 100%;
          height: 100%;
          padding-left: vw(22);
          border: 0; // 去除未选中状态边框
          outline: none; // 去除选中状态边框
          font-size: vw(26);
          font-family: PingFangSC, sans-serif;
          font-weight: normal;
          box-sizing: border-box;
          background-color: transparent;
          color: var(--white);
        }
        input::-webkit-input-placeholder {
          color: #373752;
          font-size: vw(26);
        }
        input:-moz-placeholder {
          /* FF 4-18 */
          color: #373752;
          font-size: vw(26);
        }
        input::-moz-placeholder {
          /* FF 19+ */
          color: #373752;
          font-size: vw(26);
        }
        input:-ms-input-placeholder {
          /* IE 10+ */
          color: #373752;
          font-size: vw(26);
        }
        input:-webkit-autofill {
          transition: background-color 5000s ease-in-out 0s; //背景颜色
        }
      }
      .m_dis_confirm {
        width: vw(236);
        height: vw(94);
        margin: vw(30) auto 0;
        font-size: vw(28);
        font-weight: 500;
        line-height: vw(94);
        font-family: PingFangSC, sans-serif;
        color: var(--white);
        cursor: pointer;
        user-select: none;
        box-sizing: border-box;
        background-size: contain;
        background-repeat: no-repeat;
        background-image: url("../../../assets/newPhones/nLaboratory/h5_icon_l_takeBack.png");
      }
      .mask_close {
        width: vw(44);
        height: vw(44);
        top: vw(20);
        right: vw(20);
        position: absolute;
        cursor: pointer;
      }
    }
  }
}

</style>

