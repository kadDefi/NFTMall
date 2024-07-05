<template>
  <div id="app">
    <div class="header">
      <div v-if="!isPhone">
        <!--<announcement></announcement>-->
        <zoon-header></zoon-header>
      </div>
      <!--&& isPhone-->
      <div v-if="$route.name !=='nftdetialMb'&&$route.name !=='nShopDetail' && $route.name !=='creatorMb' && isPhone" class="header_phone">
        <zoon-header-mb @listenOpen="handleOpenLeft"></zoon-header-mb>
      </div>
    </div>
    <div class="content">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
    <!--侧边栏-->
    <van-popup v-if="showLeft" v-model="showLeft" position="left">
      <side-bar :is-off="isOff" @listenClose="handleCloseLeft" @listenBindAddress="handleBindAddress" @listenDownload="isShowDownload=true"></side-bar>
    </van-popup>
    <!--&lt;!&ndash;底部导航栏&ndash;&gt;
    <div v-show="isPhone && $route.name !=='nftdetialMb' && $route.name !=='creatorMb' && bottomIsShow">
      <bottom-bar :selected="selected" :tabBars="tabBars"></bottom-bar>
    </div>-->
    <!-- 绑定上级地址 -->
    <div class="mask" v-show="showBindMaks" @touchmove.prevent @mousewheel.prevent>
      <div class="disconnect">
        <div class="m_dis_title">{{ $t("message.labora.bindUpperTitle") }}</div>
        <div class="m_dis_input"><input type="text" v-model="bindSuperiorAddress" :placeholder="bindAddressPlaceHolder">
        </div>
        <div class="m_dis_prompt">
          <i></i>
          <span>{{ $t("message.labora.bindUpperDesc") }}</span>
        </div>
        <div class="m_dis_confirm" @click="handleClickBindSuperior">
          <span>{{ $t("message.labora.Bind") }}</span>
        </div>
        <img class="mask_close" src="../src/assets/newPhones/nLaboratory/icon_qb_close.svg" alt="logo" @click="handleClickColseBindAddress">
      </div>
    </div>
    <!-- 下载文件 -->
    <div class="mask" v-show="isShowDownload" @touchmove.prevent @mousewheel.prevent>
      <div class="m_download">
        <div class="m_c_title">{{ $t("message.mallFooter.fileDownload") }}</div>
        <div class="m_c_item" @click="handleClickDownLoadFile(0)">阿拉丁-2022变局时代</div>
        <div class="m_c_item" @click="handleClickDownLoadFile(1)">Aladdin-2022 Era of Change</div>
        <img class="mask_close" src="../src/assets/newPhones/nLaboratory/icon_qb_close.svg" alt="logo" @click="isShowDownload = !isShowDownload">
      </div>
    </div>
  </div>
</template>

<script>

import {isMobile} from './utils/utils.js';
import sideBar from './components/sideBar/sideBar';
import {isStringEmpty} from '@/utils/validate'
import {mapGetters} from 'vuex'

window.onload = function() {
  document.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) {
      event.preventDefault()
    }
  })
  document.addEventListener('gesturestart', function(event) {
    event.preventDefault()
  })
}

export default {
  components: { 'sideBar': sideBar },
  data() {
    return {
      isShowDownload: false,
      showBindMaks: false,
      bindSuperiorAddress: '', // 绑定上级输入的地址
      bindAddressPlaceHolder: this.$t("message.labora.bindUpperPlaceHolder"),
      isOff: true,
      isPhone: false,
      showLeft: false,
      nowPhoneHeight: 0, //屏幕现在的高度
      defaultPhoneHeight: 0, //屏幕默认高度
    };
  },
  created() {
    this.isPhone = isMobile();
    if (this.isPhone) {
      this.$router.replace("/nHome")
    }
  },
  mounted() {
    this.defaultPhoneHeight = window.innerHeight
    window.onresize = () => { //这个方法会被调用两次,软键盘弹出后和软件收起后
      this.nowPhoneHeight = window.innerHeight
    }
  },
  watch: {
    '$i18n.locale'(val, oval) {
      this.bindAddressPlaceHolder = this.$t("message.labora.bindUpperPlaceHolder");
    },
  },
  // 计算属性
  computed: {
    ...mapGetters(['isConnectWallet', 'walletAddress', 'isBindSuperAddress', 'connectWalletType']),
  },
  methods: {
    handleClickDownLoadFile(index) {
      let list = ['阿拉丁-2022变局时代.pdf', 'Aladdin-2022 Era of Change.pdf'];
      let listName = ["阿拉丁-2022变局时代.pdf", "Aladdin-2022 Era of Change.pdf"];
      if (index === 0) {
        let a = document.createElement('a');
        a.href = './static/' + list[index];
        a.download = listName[index];
        a.click();

      } else if (index === 1) {
        let a = document.createElement('a');
        a.href = './static/' + list[index];
        a.download = listName[index];
        a.click();
      }
    },
    handleBindAddress() {
      this.showBindMaks = true;
    },
    // 关闭绑定上级地址
    handleClickColseBindAddress() {
      this.bindSuperiorAddress = '';
      this.showBindMaks = false;
    },
    // 确定绑定上级地址
    async handleClickBindSuperior() {
      if (!this.isConnectWallet) {
        return;
      } else if (isStringEmpty(this.bindSuperiorAddress)) {
        this.$notify({
          message: this.$t("message.labora.bindSuperAddressMsg"),
          duration: 2500,
          showClose: false,
          customClass: 'notifyClass'
        });
        return;
      }
      try {
        const that = this;
        this.$loading.showLoading();
        const dict = { address: this.walletAddress, superAddress: this.bindSuperiorAddress }
        const result = await this.$decentralized.bindUpLevelAddress(dict, this.connectWalletType);
        if (result) {
          // 绑定成功后更新数据
          // 绑定上级成功后获取编号
          setTimeout(() => {
            that.$loading.hiddenLoading();
            that.$eventBus.$emit('setBindAddress');
            that.$store.dispatch('wallet/setBindSuperAddress', true);
            that.handleClickColseBindAddress();
          }, 3000);
        }
      } catch (error) {
        this.$loading.hiddenLoading();
        this.$notify({ message: error.message, duration: 2500, showClose: false, customClass: 'notifyClass' });
        console.log('Error message: ', error)
      }
      console.log('绑定上级地址');
    },
    handleOpenLeft() {
      this.showLeft = true;
    },
    handleCloseLeft() {
      this.showLeft = false;
    },
  },
  destroyed() {
    //页面销毁前要记得这个监听消除掉;
    window.onresize = null
  },
}

</script>

<style lang="scss" scoped>
#app {
  display: flex;
  display: -webkit-flex;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
  .header {
    position: relative;
    flex: 0 1 auto;
    .header_phone {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 99;
      width: 100vw;
      height: vw(100);
    }
  }
  .content {
    flex: 1 1 auto;
    max-height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: #202136;
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
  z-index: 9999;
  transition: all 0.3s;
  background-color: var(--bgc02);

  .m_download {
    position: relative;
    width: vw(690);
    height: vw(440);
    border-radius: vw(20);
    background-color: var(--bgc03);
    .m_c_title {
      margin: vw(30) auto 0;
      line-height: vw(50);
      font-size: vw(30);
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      color: #fff;
      font-family: Poppins, sans-serif;
    }
    .m_c_item {
      margin: vw(50) auto 0;
      width: vw(570);
      height: vw(100);
      font-size: vw(28);
      line-height: vw(100);
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      font-family: Poppins;
      text-align: center;
      user-select: none;
      cursor: pointer;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      //background-image: url('../../../assets/homes/icon_down_bg.svg');
      border-radius: vw(10);
      background-image: linear-gradient(93deg, #f109b4 -6%, #622fe3 98%);
      color: #fff;
    }
    .m_c_item1 {
      line-height: vw(45);
    }
    .mask_close {
      width: vw(44);
      height: vw(44);
      top: vw(20);
      right: vw(15);
      position: absolute;
      cursor: pointer;
    }
  }
  .disconnect {
    position: relative;
    width: vw(586);
    height: vw(417);
    padding: 0px vw(50);
    border-radius: vw(20);
    background-color: #27273f;

    .m_dis_title {
      margin-top: vw(40);
      line-height: vw(49);
      font-size: vw(30);
      text-align: left;
      font-family: PingFangSC-Semibold, sans-serif;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      color: var(--white);
    }

    .m_dis_input {
      margin-top: vw(40);
      height: vw(80);
      border-radius: vw(8);
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

    .m_dis_prompt {
      margin-top: vw(20);
      display: flex;
      align-items: center;

      i {
        width: vw(6);
        height: vw(6);
        border-radius: vw(3);
        background-color: var(--white);
      }

      span {
        margin-left: vw(8);
        font-size: vw(20);
        font-family: PingFangSC;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        color: var(--white);
      }
    }

    .m_dis_confirm {
      width: vw(240);
      height: vw(60);
      margin: vw(50) auto 0px;
      cursor: pointer;
      user-select: none;
      box-sizing: border-box;
      background-size: contain;
      background-repeat: no-repeat;
      object-fit: contain;
      border-radius: vw(10);
      background-image: linear-gradient(93deg, #f109b4 0%, #622fe3 97%);
      display: flex;
      align-items: center;
      justify-content: center;

      span {
        font-size: vw(28);
        font-weight: 500;
        line-height: vw(60);
        font-family: PingFangSC;
        color: var(--white);
      }

      img {
        display: none;
        width: 22px;
        height: 22px;
        margin-left: 34px;
      }
    }

    .mask_close {
      width: vw(40);
      height: vw(40);
      top: vw(30);
      right: vw(30);
      position: absolute;
      cursor: pointer;
    }
  }
}
</style>
