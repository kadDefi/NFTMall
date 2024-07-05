<template>
<!-- :style="{height:dynamicHeight}" -->
  <div class="header">
    <!-- body -->
    <div class="content">
      <a class="navLeft">
        <img src="../../assets/universal/logo.svg" alt="logo"/>
      </a>
      <div class="navMiddle">
        <i class="navMiddleLeft"></i>
        <div class="navMiddleRight" ref="navMiddleRef">
          <div :style="topNavKey === 0 ? {color:'var(--primary)',fontSize:'18px'} : {color:'var(--white'}" @click="handleChangeNavItemMethod(0)">
            {{ $t("message.mallHeader.home") }}
          </div>
          <div :style="topNavKey === 1 ? {color:'var(--primary)',fontSize:'18px'} : {color:'var(--white'}" @click="handleChangeNavItemMethod(1)">
            {{ $t("message.mallHeader.market") }}
          </div>
          <!--<el-dropdown trigger="click" @command="handleDropdownMarkCommand">
            <div class="n_mark">
              <div :style="topNavKey === 1 ? {color:'var(&#45;&#45;primary)',fontSize:'18px'} : {color:'var(&#45;&#45;white'}">
                {{ $t("message.mallHeader.market") }}
              </div>
              <img :src="topNavKey === 1 ? require('../../assets/universal/icon_down_select.svg') : require('../../assets/universal/icon_down_normal.svg')" alt=""/>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command='conventional'><span>{{ $t("message.mallHeader.conventionalNFT") }}</span></el-dropdown-item>
              <el-dropdown-item command='artwork'><span>{{ $t("message.mallHeader.artworkNFT") }}</span></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>-->
          <div :style="topNavKey === 2 ? {color:'var(--primary)',fontSize:'18px'} : {color:'var(--white'}" @click="handleChangeNavItemMethod(2)">
            {{ $t("message.mallHeader.laboratory") }}
          </div>
          <div :style="topNavKey === 3 ? {color:'var(--primary)',fontSize:'18px'} : {color:'var(--white)'}" @click="handleChangeNavItemMethod(3)">
            {{ $t("message.mallSideBar.soonText3") }}
          </div>
          <div :style="topNavKey === 4 ? {color:'var(--primary)',fontSize:'18px'} : {color:'var(--white)'}" @click="handleChangeNavItemMethod(4)">
            {{ $t("message.mallHeader.lp") }}
          </div>
          <div :style="topNavKey === 5 ? {color:'var(--primary)',fontSize:'18px'} : {color:'var(--white)'}" @click="handleChangeNavItemMethod(5)">
            {{ $t("message.mallHeader.wish") }}
          </div>
          <div :style="topNavKey === 6 ? {color:'var(--primary)',fontSize:'18px'} : {color:'var(--white)'}" @click="handleChangeNavItemMethod(6)">
            {{ $t("message.mallHeader.aboutUs") }}
          </div>
          <i class="nav_underline" :style="navLineStyle"></i>
        </div>
      </div>
      <div class="navRight">
        <el-dropdown trigger="click" @command="handleDropdownCommand">
          <div class="h_w_language">
            <img :src="isEnglish ? require('../../assets/universal/h_yw.png') : require('../../assets/universal/h_zw.png')" alt="logo" class="h_w_l_gq">
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command='en'><img alt="logo" class="el-dropdown-item-img" src="../../assets/universal/h_yw.png"></el-dropdown-item>
            <el-dropdown-item command='zh'><img alt="logo" class="el-dropdown-item-img" src="../../assets/universal/h_zw.png"></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div v-if="isConnectWallet">
          <div class="nr_right_dk" @click="handleWallOperate">
            <van-image class="nr_right_tx" :src="isAvatarStringEmpty(avatarUrl) ? require('../../assets/universal/icon_h_logo.png') : avatarUrl" fit="cover" ></van-image>
            <!--<img class="nr_right_tx"  src="../../assets/universal/icon_h_logo.png" alt="">-->
            <div class="nr_right_dz">{{ walletAddress | omitCharacters(7) }}</div>
            <img class="nr_right_ts"  src="../../assets/universal/icon_h_down.svg" alt="">
            <img class="nr_right_dj" :src="require(`../../assets/laboras/icon_l_level_${temaLevel}.svg`)" alt="">
          </div>
        </div>
        <div v-else>
          <div class="nr_right_lj" @click="handleWallOperate">{{ $t('message.mallHeader.connect') }}</div>
        </div>
      </div>
    </div>
    <!-- 连接钱包提示框 -->
    <div class="mask" v-show="showConnectMaks" @touchmove.prevent @mousewheel.prevent>
      <div class="connect">
        <div class="m_c_title">{{ $t("message.mallHeader.connect") }}</div>
        <div class="m_c_line"></div>
        <div class="m_c_item" @click="handleMetamaskConnect">
          <img src="../../assets/universal/icon_metamask.svg" alt="logo">
          <span>Metamask</span>
        </div>
        <div class="m_c_item m_c_marginTop" @click="handleWalletConnect">
          <img src="../../assets/universal/icon_walletConnect.svg" alt="logo">
          <span>WalletConnect</span>
        </div>
        <img class="mask_close" src="../../assets/universal/icon_qb_close.svg" alt="logo" @click="handleDisWallOperate">
      </div>
    </div>
    <!-- 断开钱包链接提示框 -->
    <div class="mask" v-show="showDisconnectMaks" @touchmove.prevent @mousewheel.prevent>
      <div class="disconnect">
        <div class="m_dis_title">{{ $t("message.mallHeader.connected") }}</div>
        <div class="m_dis_line"></div>
        <div class="m_dis_item">
          <span>{{ $t("message.mallHeader.Address") }}:</span>
          <span>{{ walletAddress }}</span>
        </div>
        <div class="m_dis_item m_dis_itemTop">
          <span>ALAD:</span>
          <span>{{ aladBalance | noRoundingDecimals(4) }}</span>
        </div>
        <div class="m_dis_item m_dis_itemTop">
          <span>BUSD:</span>
          <span>{{ busdBalance | noRoundingDecimals(4) }}</span>
        </div>
        <div class="m_dis_confirm" @click="handleConfirmDisconnect">{{ $t('message.mallHeader.disconnect') }}</div>
        <img class="mask_close" src="../../assets/universal/icon_qb_close.svg" alt="logo" @click="handleDisWallOperate">
      </div>
    </div>
    <!-- 下拉框提示框 -->
    <div class="mask1" v-show="dropDownBoxMaks" @touchmove.prevent @mousewheel.prevent>
      <div class="wrapper">
        <div class="disconnect">
          <div class="m_dis_title">{{ $t("message.mallHeader.connected") }}</div>
          <div class="m_dis_header">
            <el-upload ref="upload" action="''" name="file" :accept="'image/*'" :limit="1" :auto-upload="false" :show-file-list="false" :on-change ="uploadImgFileChange">
              <van-image class="nr_right_tx" :src="isAvatarStringEmpty(avatarUrl) ? require('../../assets/universal/icon_h_logo.png') : avatarUrl" fit="cover" ></van-image>
            </el-upload>
           <!-- <img src="../../assets/universal/icon_h_logo.png" alt="">-->
            <img class="nr_right_dj" :src="require(`../../assets/laboras/icon_l_level_${temaLevel}.svg`)" alt="">
            <div class="m_dis_name">
              <div>{{ customerName }}</div>
              <div>{{ walletAddress | omitCharacters(7) }}</div>
            </div>
          </div>
          <div class="m_dis_item" @click="handleClickPopup(1)">
            <img src="../../assets/universal/icon_h_link1.svg" alt="">
            <span v-if="isBindSuperAddress">{{ superAdd | omitCharacters(7) }}</span>
            <span v-else>{{ $t("message.labora.bindUpperTitle") }}</span>
          </div>
          <div class="m_dis_item1" @click="handleClickPopup(2)">
            <img :src="require(`../../assets/universal/icon_h_dp${shopStatus}.svg`)" alt="">
            <span :style="{color: colorText[shopStatus]}">{{ shopStatusText[shopStatus] }}</span>
          </div>
          <div class="m_dis_item2" @click="handleClickPopup(3)">
            <img src="../../assets/universal/icon_h_mz1.svg" alt="">
            <span>{{ $t("message.labora.EditNickname") }}</span>
          </div>
          <div class="m_dis_item3" @click="handleClickPopup(4)">
            <img src="../../assets/universal/icon_h_dk1.svg" alt="">
            <span>{{ $t("message.mallHeader.disConnected") }}</span>
          </div>
          <div class="m_dis_wrapper">
            <div class="m_dis_w1">
              <div class="m_dis_left">
                <img src="../../assets/newPhones/universal/icon_alad_coin.svg" alt="">
                <span>{{ aladBalance | noRoundingDecimals(4) }}</span>
              </div>
              <div class="m_dis_right" @click="handleClickPopup(5)">{{ $t("message.mallSideBar.buy") }}</div>
            </div>
            <div class="m_dis_w2"></div>
            <div class="m_dis_w3">
              <div class="m_dis_left">
                <span>{{ $t("message.labora.aridrop") }}:</span>
                <span>{{ aridropAmount | noRoundingDecimals(4) }}</span>
              </div>
              <div class="m_dis_right" @click="handleClickPopup(6)">{{ $t("message.mallSideBar.extract") }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 绑定上级地址 -->
    <div class="mask2" v-show="bind.showBindMaks" @touchmove.prevent @mousewheel.prevent>
      <div class="disconnect">
        <div class="m_dis_title">{{ $t("message.labora.bindUpperTitle") }}</div>
        <div class="m_dis_input"><input type="text" v-model="bind.bindSuperiorAddress" :placeholder="bind.indAddressPlaceHolder"></div>
        <div class="m_dis_prompt">
          <i></i>
          <span>{{ $t("message.labora.bindUpperDesc") }}</span>
        </div>
        <div class="m_dis_confirm" @click="handleClickBindSuperior">{{ $t("message.labora.Bind") }}</div>
        <img class="mask_close" src="../../assets/universal/icon_qb_close.svg" alt="logo" @click="handleClickColseBindAddress">
      </div>
    </div>
    <!-- 是否上架 -->
    <div class="mask3" v-show="applyShop.showSaleToMarketMaks" @touchmove.prevent @mousewheel.prevent>
      <div class="m_sale">
        <div class="m_s_desc">{{ $t("message.smOption.ApplyStoreMsg") }}?</div>
        <div class="m_s_btn">
          <div @click="applyShop.showSaleToMarketMaks=!applyShop.showSaleToMarketMaks">{{ $t("message.stock.No") }}</div>
          <div @click="handleClickApply">{{ $t("message.stock.Yes") }}</div>
        </div>
      </div>
    </div>
    <!-- 修改昵称 -->
    <div class="mask4" v-show="modifyName.showModifyMask" @touchmove.prevent @mousewheel.prevent>
      <div class="disconnect">
        <div class="m_dis_title">{{ $t("message.labora.EditNickname") }}</div>
        <div class="m_dis_input"><input type="text" v-model="modifyName.inputModifyName" :placeholder="modifyName.modifyNamePlaceHolder"></div>
        <div class="m_dis_confirm" @click="handleClickSubmitModifyName">{{ $t("message.labora.Submit") }}</div>
        <img class="mask_close" src="../../assets/universal/icon_qb_close.svg" alt="logo" @click="handleClickColseModifyName">
      </div>
    </div>
  </div>
</template>

<script>

import { isMobile,getObjectIndexAtArray } from '@/utils/utils';
import { isStringEmpty } from '@/utils/validate';
import { chuDivision } from '@/utils/computing';
const settingConfig = require('../../settings.js');
import Web3 from "web3";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import contractObject from '../../decentralizedApi/inits.js'
import {applySeller, getCustomerInfoData, getShopStatus, uploadAvatar} from "@/api/mark";
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { ethers } from "ethers";

export default {
  data() {
    return {
      topNavKey:0,
      isIphone:false,
      isEnglish:false,
      dropDownBoxMaks:false, // 下拉框弹框
      showConnectMaks:false, // 显示连接弹框
      showDisconnectMaks:false, // 显示断开连接弹框
      navItemDistanceLeftStyle:0,
      countdTimer:null, // 定时器
      //connectWalletType:null, // 1 metamske、2 walletConnect
      walletConnector:null, // walletConnect的初始化对象
      aladBalance:0, // 阿拉丁余额
      busdBalance:0, // busd余额
      aridropAmount:0,// 空投数量
      temaLevel:0, // 等级
      avatarUrl:'', // 用户头像
      isBindSuperAddress:false,// 是否绑定上级
      superAdd:'--',// 父级地址
      customerName:'--', // 用户昵称
      shopStatus:0,// 店铺状态  0 无法申请 1 可以申请 2 审核中  3 已完成
      colorText: ['#898989', '#ffffff', '#ff953f', '#9a55dc'],
      shopStatusText: [this.$t("message.smOption.ApplyStore0"), this.$t("message.smOption.ApplyStore1"), this.$t("message.smOption.ApplyStore2"), this.$t("message.smOption.ApplyStore3")],
      bind: {
        showBindMaks:false, // 绑定上级弹框
        bindSuperiorAddress:'', // 绑定上级输入的地址
        indAddressPlaceHolder:this.$t("message.labora.bindUpperPlaceHolder"),
      },
      applyShop: {
        showSaleToMarketMaks:false,
      },
      modifyName: {
        showModifyMask:false,
        inputModifyName:'', // 输入修改的昵称
        modifyNamePlaceHolder:this.$t("message.labora.modifyNamePlaceHoler"),
      },
      updateAvarat: {
        ipfsClient:null, // IPFS对象
        isShowUploadGif:false, // 是否显示上传的gif
      }
    }
  },
  // watch/event事件回调
  created() {
    // 是否是手机
    this.isIphone = isMobile();
    // 国际化
    this.isEnglish = window.localStorage.getItem("lang") !== "zh";
    // 获取用户信息
    this.getUserInfo();
    // 初始化合约
    this.init_web3_contractObject();
    // 判断是否存在小狐狸浏览器钱包
    if(typeof window.ethereum !== 'undefined'){
      // 当窗口存在window.ethereum对象时候立刻进行Web3初始化
      this.getMetamskeConnectWallet();
      console.log('存在window.ethereum对象');
    }
    // 创建IPF客户端对象
    if (!this.updateAvarat.ipfsClient) {
      const ipfsNode = settingConfig.ipfsNode;
      this.updateAvarat.ipfsClient = ipfsHttpClient(ipfsNode);
    }
    const that = this;
    // 监听许愿池返回操作
    this.$eventBus.$on('goBackWish', () => {
      const name = this.$route.name;
      const routerList = ['home','market','labora','lpMining','wish'];
      const index = getObjectIndexAtArray(routerList,name);
      this.topNavKey = index;
      this.handleGetNavItemStyle(index);
      sessionStorage.setItem("topNFTMallNavKey", index);
    });
    // 监听是否需要绑定上级地址
    this.$eventBus.$on('showBindUpperAddress', () => {
      that.bind.showBindMaks = true;
    });
    // 监听跳转到实验室
    this.$eventBus.$on('buyNFTSuccessJump', () => {
      that.handleChangeNavItemMethod(2);
    });
    // 监听跳转到详情页面
    this.$eventBus.$on('checkNFTDetailJump', (arg) => {
      if (arg === 1) {
        that.handleChangeNavItemMethod(1);
      }else if(arg === 2) {
        that.topNavKey = 2;
        that.handleChangeNavItemMethod(2);
        sessionStorage.setItem("topNFTMallNavKey", 5);
      }else if(arg === 3) {
        that.topNavKey = 1;
        that.handleGetNavItemStyle(1);
        sessionStorage.setItem("topNFTMallNavKey", 1);
      }else if(arg === 4) {
        that.topNavKey = 3;
        that.handleGetNavItemStyle(3);
        sessionStorage.setItem("topNFTMallNavKey", 1);
      }
    });
  },
  mounted(){
    let nextKeyStorage = sessionStorage.getItem("topNFTMallNavKey");
    if (nextKeyStorage !== null) {
      this.topNavKey = parseInt(nextKeyStorage);
    }
    this.handleGetNavItemStyle(this.topNavKey);
    if (this.$refs.upload) {
      this.$refs.upload.clearFiles();
    }
  },
  destroyed() {
    if (this.countdTimer) {
      window.clearTimeout(this.countdTimer);
      this.countdTimer = null;
    }
  },
  computed: {
    connectWalletType: {
      get() {
        return this.$store.getters.connectWalletType;
      },
      set(val) {
        this.$store.dispatch('wallet/setConnectWalletType',val);
      }
    },
    isConnectWallet: {
      get() {
        return this.$store.getters.isConnectWallet;
      },
      set(val) {
        this.$store.dispatch('wallet/setConnectWallet',val);
      }
    },
    walletAddress: {
      get() {
        return this.$store.getters.walletAddress;
      },
      set(val) {
        this.$store.dispatch('wallet/setWalletAddress',val);
      }
    },
    navLineStyle(){
      return {left:`${this.navItemDistanceLeftStyle}px`};
    },
	},
  // 监听方法
  watch: {
    // 监听是否授权连接钱包
    isConnectWallet(val,oval) {
      this.$store.dispatch('wallet/setConnectWallet',val);
      if (!val) {
        this.closeTimer();
        this.dropDownBoxMaks = false;
        this.showConnectMaks = false;
        this.showDisconnectMaks = false;
        this.applyShop.showSaleToMarketMak = false;
        this.handleClickColseBindAddress();
        this.handleClickColseModifyName();
      } else {
        // 获取用户信息
        this.getUserInfo();
        //this.openTimer();
      }
      console.log('钱包已经',val ? '连接' : '断开');
    },
    // 监听语言的切换
    '$i18n.locale'(val,oval) {
      this.isEnglish = val !== 'zh';
      let navIndex = sessionStorage.getItem("topNFTMallNavKey");
      this.handleGetNavItemStyle(navIndex);
      this.shopStatusText = [this.$t("message.smOption.ApplyStore0"), this.$t("message.smOption.ApplyStore1"), this.$t("message.smOption.ApplyStore2"), this.$t("message.smOption.ApplyStore3")];
      console.log('监听语言发生变化');
    },
  },
  // 方法集合
  methods: {
    // 判断头像是否是空的
    isAvatarStringEmpty(avatar) {
      return isStringEmpty(avatar);
    },
    // 选择切换市场的分类(废弃)
    handleDropdownMarkCommand(command) {
      const routeName = this.$route.name;
      const paramsType = command === 'conventional' ? 1 : 2;
      if (routeName === 'nftdetial') {
        this.handleChangeNavItemMethod(1,paramsType);
        return;
      }
      if (this.topNavKey !== 1) {
        this.handleChangeNavItemMethod(1,paramsType);
      }else {
        this.$eventBus.$emit('switchMarketNFTType',paramsType);
      }
    },
    // 选择切换语言
    handleDropdownCommand(command){
      let lang;
      if(command === 'en'){
        lang = 'en';
        this.isEnglish = true;
      }else if(command === 'zh'){
        lang = 'zh';
        this.isEnglish = false;
      }
      this.$i18n.locale = lang;
      window.localStorage.setItem("lang", lang);
      console.log('选择切换的语言是=',command);
    },
    // 连接钱包弹框
    handleWallOperate() {
      if (this.isConnectWallet) {
        if (!this.dropDownBoxMaks) {
          // 当定时器不存在时候开启定时器
          if (!this.countdTimer) {
            this.openTimer();
          }
          // 获取用户信息
          this.getUserInfo();
          this.getCurrentAddressShopStatus();
        }
        this.dropDownBoxMaks = !this.dropDownBoxMaks;
        const that = this;
        const showMore = document.addEventListener("click", (e) => {
          if (e.target.className !== "nr_right_dk" && e.target.className !== "nr_right_tx" && e.target.className !== "van-image__img"  && e.target.className !== "nr_right_dz" && e.target.className !== "nr_right_ts") {
            that.dropDownBoxMaks = false;
            document.removeEventListener("click", showMore, false);
          }
        });
        document.addEventListener("click", showMore, false);
      }else {
        this.showConnectMaks = true;
      }
    },
    // 点击弹框进行操作
    handleClickPopup(index) {
      if (index === 1) { // 绑定上级
        if (this.isBindSuperAddress) {
          return;
        }
        this.bind.showBindMaks = true;
      }else if (index === 2) { // 申请店铺
        if (this.shopStatus === 1) {
          this.applyShop.showSaleToMarketMaks = true;
        }
      }else if (index === 3) { // 修改昵称
        this.modifyName.showModifyMask = true;
      }else if (index === 4) { // 断开链接
        this.showDisconnectMaks = true;
      }else if (index === 5) { // 购买ALAD
        let url = settingConfig.buyUrl;
        window.open(url);
      }else if (index === 6) { // 提取空投
        this.handleClickExtractAridrop();
      }
    },
    // 文件添加、 上传、 失败都会回调这里
    async uploadImgFileChange(files,fileList) {
      if (!this.isConnectWallet) {
        this.$refs.upload.clearFiles();
        this.$notify({message: this.$t("message.casting.connectWallet"),duration: 2500,showClose:false,customClass:'notifyClass'});
        return;
      }
      const that = this;
      const file = fileList[0];
      const fileType = file.raw.type;
      if (fileType.indexOf('image') === -1) {
        // 如果不是图片格式
        that.$refs.upload.clearFiles();
        that.$notify({message: this.$t("message.casting.validPhoto"),duration: 2500,showClose:false,customClass:'notifyClass'});
        return false;
      }
      try {
        // 开启加载视图
        //this.updateAvarat.isShowUploadGif = true;
        // 获取上传文件
        const ipfsFile = file.raw;
        // 开始上传IPFS
        const added = await this.updateAvarat.ipfsClient.add(ipfsFile,{ progress: (prog) => console.log(`received: ${prog}`)});
        // 开始上传头像
        this.uploadCustomerAvatar(added);
      } catch (error) {
        //that.updateAvarat.isShowUploadGif = false;
        that.$refs.upload.clearFiles();
        that.$notify({message: error.message,duration: 2500,showClose:false,customClass:'notifyClass'});
        console.log('Error message: ',error)
      }
    },
    // 上传更新用户头像
    async uploadCustomerAvatar(added) {
      const uploadDict = {};
      uploadDict['address'] = this.walletAddress;
      uploadDict['pic'] = added.path;
      const that = this;
      const result = await uploadAvatar(uploadDict);
      //this.updateAvarat.isShowUploadGif = false;
      if (result.status === 200) {
        that.$refs.upload.clearFiles();
        that.avatarUrl = `${settingConfig.ipfsNFTUrl + added.path}`;
        that.$eventBus.$emit('modifyCustomerInfoMonitor');
      }else {
        that.$refs.upload.clearFiles();
        that.$notify({message: result.data,duration: 2500,showClose:false,customClass:'notifyClass'});
      }
    },
    // 关闭绑定上级弹框
    handleClickColseBindAddress() {
      this.bind.showBindMaks = false;
      this.bind.bindSuperiorAddress = '';
    },
    // 确定绑定上级地址
    async handleClickBindSuperior() {
      if(!this.isConnectWallet){
        return;
      } else if (isStringEmpty(this.bind.bindSuperiorAddress)) {
        this.$notify({message: this.$t("message.labora.bindSuperAddressMsg"),duration: 2500,showClose:false,customClass:'notifyClass'});
        return;
      }
      try {
        const that = this;
        this.$loading.showLoading();
        // 判断绑定的地址是否已经绑定过上级或者是否是根地址
        const specialAddr = await this.$decentralized.getSpecialAddr();
        // 判断如果绑定的上级地址不是特殊的上级地址、则进行判断上级地址是否绑定了上级
        if (specialAddr.toLowerCase() !== this.bind.bindSuperiorAddress.toLowerCase()) {
          const superAddress = await this.$decentralized.getParents({address:this.bind.bindSuperiorAddress});
          const isHaveSuper = superAddress === "0x0000000000000000000000000000000000000000" ? false : true;
          if (!isHaveSuper) {
            that.$loading.hiddenLoading();
            this.$notify({message: this.$t("message.labora.bindSuperNoQualifiedMsg"),duration: 2500,showClose:false,customClass:'notifyClass'});
            return;
          }
        }
        const dict = {address:this.walletAddress,superAddress:this.bind.bindSuperiorAddress}
        const result1 = await this.$decentralized.bindUpLevelAddress(dict,this.connectWalletType);
        if(result1) {
          // 绑定成功后更新数据、绑定上级成功后获取编号
          setTimeout(() => {
            that.$loading.hiddenLoading();
            that.$store.dispatch('wallet/setBindSuperAddress',true);
            that.superAdd = this.bind.bindSuperiorAddress;
            that.handleClickColseBindAddress();
            that.getUserInfo();
          }, 3000);
        }
      } catch (error) {
        this.$loading.hiddenLoading();
        this.$notify({message: error.message,duration: 2500,showClose:false,customClass:'notifyClass'});
        console.log('Error message: ', error)
      }
      console.log('绑定上级地址');
    },
    // 申请店铺
    async handleClickApply() {
      if (!this.isConnectWallet) {
        return;
      }
      const dict = {};
      const that = this;
      dict['address'] = this.walletAddress;
      let result = await applySeller(dict);
      if (result.status === 200) {
        that.getCurrentAddressShopStatus();
        that.applyShop.showSaleToMarketMaks = false;
      } else {
        this.$notify({message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass'});
      }
    },
    // 关闭修改昵称弹框
    handleClickColseModifyName() {
      this.modifyName.showModifyMask = false;
      this.modifyName.inputModifyName = '';
    },
    // 提交修改昵称
    async handleClickSubmitModifyName() {
      // 0 修改昵称  1 获取列表数据
      if (!this.isConnectWallet) {
        return;
      }
      if (isStringEmpty(this.modifyName.inputModifyName)) {
        this.$notify({ message: this.$t("message.labora.modifyNameMsg"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      }
      const dict = {};
      dict['type'] = 0;
      dict['address'] = this.walletAddress;
      dict['name'] = this.modifyName.inputModifyName;
      const result = await getCustomerInfoData(dict);
      if (result.status === 200) {
        this.customerName = this.modifyNickName;
        this.handleClickColseModifyName();
        this.$notify({message: this.$t("message.labora.modifySuccess"), duration: 2500, showClose: false, customClass: 'notifyClass'});
      }else  {
        this.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
      }
    },
    // 提取空投
    async handleClickExtractAridrop() {
      if (!this.isConnectWallet) {
        this.$notify({ message: this.$t("message.casting.connectWallet"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      } else if (this.aridropAmount <= 0) {
        this.$notify({ message: this.$t("message.labora.airdropMsg"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      }
      try {
        const that = this;
        const dict = {};
        dict['address'] = that.walletAddress;
        that.$loading.showLoading();
        const result = await that.$decentralized.extractAirdrop(dict, this.connectWalletType);
        that.$loading.hiddenLoading();
      } catch (error) {
        this.$loading.hiddenLoading();
        this.$notify({ message: error.message, duration: 2500, showClose: false, customClass: 'notifyClass' });
      }
    },
    // 关闭钱包操作弹框
    handleDisWallOperate() {
      if (this.isConnectWallet) {
        this.showDisconnectMaks = false;
      }else  {
        this.showConnectMaks = false;
      }
    },
    // 确认断开钱包连接
    handleConfirmDisconnect() {
      if (this.connectWalletType === '2') {
        this.killSession();
      }
      this.walletAddress = '';
      this.connectWalletType = '';
      this.isConnectWallet = false;
      this.showDisconnectMaks = false;
      this.closeTimer();
    },
    // 查询浏览器连接小狐狸钱包信息
    getMetamskeConnectWallet() {
      const that = this;
      let connectTimeout = setTimeout( async () => {
        const networkID = await window.ethereum.request({method: 'eth_chainId'});
        const chainId = ethers.BigNumber.from(networkID).toString();
        if(chainId === settingConfig.chainID){
          const accounts = await web3Provider.request({method: 'eth_requestAccounts'});
          const address = accounts[0];
          if(!isStringEmpty(address)) {
            that.connectWalletType = '1';
            that.isConnectWallet = true;
            that.walletAddress = address;
            that.monitorWallectSwitched();
          }
        }
        clearTimeout(connectTimeout);
      }, 500);
    },
    // 主动触发metamske连接
    async handleMetamaskConnect(){
     let web3Provider;
     let that = this;
     if(!Web3.givenProvider) {
       this.$notify({message: this.$t("message.alertMsg.MetaMaskPlugin"),duration: 2500,showClose:false,customClass:'notifyClass'});
       return;
     }
     if(typeof window.ethereum !== 'undefined') {
       web3Provider = window.ethereum;
     }else if(typeof window.web3 !== 'undefined') { // 老版 MetaMask Legacy dapp browsers...
       web3Provider = window.web3.currentProvider;
     }
     try{
       // 当窗口存在window.ethereum对象时候立刻进行Web3初始化
       //this.init_web3_contractObject(new Web3(web3Provider));
       const networkID = await window.ethereum.request({method: 'eth_chainId'});
       const chainId = ethers.BigNumber.from(networkID).toString();
       console.log("window ethereum network id = ",chainId);
       if(chainId === settingConfig.chainID){
         const accounts = await web3Provider.request({method: 'eth_requestAccounts'});
         console.log("用户授权连接钱包成功返回的地址 accounts = ", accounts[0]);
         if(chainId === settingConfig.chainID){
           that.showConnectMaks = false;
           that.isConnectWallet = true;
           that.connectWalletType = '1';
           that.walletAddress = accounts[0];
           that.monitorWallectSwitched();
         }else {
           console.log(`请切换到${settingConfig.chainID}网络`);
         }
       }
     }catch(error) { // 用户不授权时
       console.log("error", error);
     }
   },
    // 小狐狸钱包监听用户是否切换钱包或者网络
    monitorWallectSwitched() {
     //this.init_web3_contractObject(new Web3(window.ethereum));
     let that = this;
     ethereum.on("chainChanged", function (chainId) {
       const idNum = Web3.utils.hexToNumberString(chainId);
       if (idNum !== settingConfig.chainID) {// 判断网络ID是否跟配置的网络ID相等
         that.walletAddress = '';
         that.connectWalletType = '';
         that.isConnectWallet = false;
         console.log(`请切换到${settingConfig.chainID}网络`);
       } else { // 获取小狐狸当前登录钱包地址
         let address = window.ethereum.selectedAddress;
         if(!isStringEmpty(address)){
           that.walletAddress = address;
           that.connectWalletType = '1';
           that.isConnectWallet = true;
         }
       }
     });
     // 监听如果更改账户，则重新登录
     ethereum.on("accountsChanged", function (accounts) {
       that.walletAddress = '';
       that.connectWalletType = '';
       that.isConnectWallet = false;
       console.log("账户发生修改,需要重新授权登录");
     });
     ethereum.on('disconnect', function(error){
       that.walletAddress = '';
       that.connectWalletType = '';
       that.isConnectWallet = false;
       console.log("账户已经断开链接,需要重新授权登录");
     });
   },
    // wallectConnect连接
    async handleWalletConnect() {
     const that = this;
     const connector = new WalletConnect({bridge: settingConfig.walletConnectBridge, qrcodeModal: QRCodeModal});
     that.walletConnector = connector;
     if(!connector.connected) {
       await connector.createSession();
     }
     that.subscribeToEvents();
   },
    // 添加事件订阅
    subscribeToEvents() {
    const connector = this.walletConnector;
    if (!connector) {
      return;
    }
    // 监听连接事件
    connector.on("connect", (error, payload) => {
      console.log(`connector.on("connect")`);
      if (error) {
        throw error;
      }
      const {chainId, accounts} = payload.params[0];
      this.onConnect(accounts, chainId);
    });
    // 监听更新事件
    connector.on("session_update", async (error, payload) => {
      console.log(`connector.on("session_update")`);
      if (error) {
        throw error;
      }
      const {chainId, accounts} = payload.params[0];
      this.onSessionUpdate(accounts, chainId);
    });
    // 监听断开事件
    connector.on("disconnect", (error, payload) => {
      console.log(`connector.on("disconnect")`);
      if (error) {
        throw error;
      }
      this.onDisconnect();
    });
    if(connector.connected) { // 判断是否是已经连接成功了
      const {chainId, accounts} = connector;
      const address = accounts[0];
      this.onSessionUpdate(accounts, chainId);
    }
    this.walletConnector = connector;
  },
    // 连接
    onConnect(accounts, chainId) {
    if(chainId !== parseInt(settingConfig.chainID)){
      this.killSession();
      console.log(`请切换到${settingConfig.chainID}网络`);
      return;
    }
    this.showConnectMaks = false;
    this.isConnectWallet = true;
    this.connectWalletType = '2';
    this.walletAddress = accounts[0];
    // 保存wallectConnector作为全局对象
    contractObject.initGlobalWalletConenctor(this.walletConnector);
  },
    // 更新
    onSessionUpdate(accounts, chainId) {
    if(chainId !== parseInt(settingConfig.chainID)) {
      this.killSession();
      console.log(`请切换到${settingConfig.chainID}网络`);
      return;
    }
    this.showConnectMaks = false;
    this.isConnectWallet = true;
    this.connectWalletType = '2';
    this.walletAddress = accounts[0];
    // 保存wallectConnector作为全局对象
    contractObject.initGlobalWalletConenctor(this.walletConnector);
  },
    // 断开
    onDisconnect() {
    this.resetApp();
  },
    // 断开WalletConnect连接
    killSession() {
    const connector = this.walletConnector;
    if (connector) {
      connector.killSession();
    }
  },
    // 设置页面连接数据
    resetApp() {
    this.isConnectWallet = false;
    this.connectWalletType = '';
    this.walletAddress = '';
    // 保存wallectConnector作为全局对象
    contractObject.initGlobalWalletConenctor(null);
  },
    // 初始化合约对象并进行各种合约对象的初始化
    init_web3_contractObject(){
     contractObject.initWithContractObjec();
   },
    // 导航栏切换页面
    handleChangeNavItemMethod(index){
     if(index === 0) {
       this.$router.push({ name: "home" });
     }else if(index === 1) {
       this.$router.push({ name: "market"});
     }else if(index === 2) {
       this.$router.push({ name: "labora" });
     }else if(index === 3) {
       this.$router.push({ name: "shop" });
     } else if(index === 4) {
       this.$router.push({ name: "lpMining" });
     }else if(index === 5) {
       this.$router.push({ name: "wish" });
     } else if(index === 6) {
       const openUrl = settingConfig.aboutUsUrl;
       window.open(openUrl);
       return;
     }
     /*if (index === 4) {
       return;
     }*/
     this.topNavKey = index;
     this.handleGetNavItemStyle(index);
     sessionStorage.setItem("topNFTMallNavKey", index);
   },
    // 联系方式
    handleContactClick(index) {
     let openUrl = settingConfig.telegramUrl;
     if(index === 2) {
       openUrl = settingConfig.mediumUrl;
     }else if(index === 3) {
       openUrl = settingConfig.twitterUrl;
     }
     window.open(openUrl);
   },
    // 获取ALAD余额
    async getCurrenAddressALADBalance(){
     const that = this;
     const dict = {address:this.walletAddress}
     try {
       const result = await this.$decentralized.getALADBlanace(dict);
       that.aladBalance = chuDivision(result,18);
       that.$store.dispatch('wallet/setAladBalance',that.aladBalance);
       console.log('alad的余额=',that.aladBalance);
    } catch (error) {
      this.$notify({message: error.message,duration: 2500,showClose:false,customClass:'notifyClass'});
      console.log('Error message: ', error.message)
    }
   },
    // 获取BUSD的余额
    async getCurrenAddressBUSDBalance() {
      const that = this;
      const dict = { address: this.walletAddress }
      try {
        const result = await this.$decentralized.getGAKABlanace(dict);
        that.busdBalance = chuDivision(result, 18);
        console.log('usdt的余额=', that.busdBalance);
      } catch (error) {
        //this.$notify({ message: error.message, duration: 2500, showClose: false, customClass: 'notifyClass' });
        console.log('Error message: ', error.message)
      }
    },
    // 获取空投比种的数量
    async getAirdropInfoData() {
      if (!this.isConnectWallet) {
        return;
      }
      try {
        const that = this;
        const dict = {};
        dict['address'] = that.walletAddress;
        const result = await that.$decentralized.getAirdropInfoData(dict);
        that.aridropAmount = chuDivision(result, 18);
        console.log('空投的余额=',that.aridropAmount);
      } catch (error) {
        this.$notify({ message: error.message, duration: 2500, showClose: false, customClass: 'notifyClass' });
        console.log('Error message: ', error)
      }
    },
    // 获取用户相关信息
    async getUserInfo() {
      if (!this.isConnectWallet) {
        return;
      }
      const dict = {};
      dict['type'] = 1;
      dict['address'] = this.walletAddress;
      const result = await getCustomerInfoData(dict);
      if (result.status === 200) {
        // 判断用户是否绑定了上级地址
        const data = result.data;
        const isBindSuperAddress = data.superadd !== "0x0000000000000000000000000000000000000000";
        // 将用户是否绑定上级地址进行存储
        this.$store.dispatch('wallet/setBindSuperAddress', isBindSuperAddress);
        this.isBindSuperAddress = isBindSuperAddress;
        this.temaLevel = data.level;
        this.superAdd = data.superadd;
        this.customerName = isStringEmpty(data.name) ? '--' : data.name;
        // 缓存起来是普通地址还是店铺地址
        sessionStorage.setItem('shopStatus', data.shopStatus);
        if (isStringEmpty(data.picurl)) {
          this.avatarUrl = '';
        }else  {
          const newStr = data.picurl.indexOf("https");
          if (newStr === -1) {
            this.avatarUrl = `${settingConfig.ipfsNFTUrl + data.picurl}`
          }else  {
            this.avatarUrl = data.picurl;
          }
        }
        console.log('获取用户信息= ', data);
      } else {
        this.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
      }
    },
    // 获取当前地址店铺状态
    async getCurrentAddressShopStatus() {
      if (!this.isConnectWallet){
        return
      }
      try {
        let amount = await this.$decentralized.getUserDepositAmount(this.walletAddress);
        const dict = {};
        dict['address'] = this.walletAddress;
        dict['amount'] = chuDivision(amount, 18);
        let result = await getShopStatus(dict);
        if (result.status === 200) {
          // 店铺状态  0 无法申请 1 可以申请 2 审核中  3 已完成
          this.shopStatus = parseInt(result.data)
          console.log('当前地址店铺状态=',this.shopStatus);
        }
      } catch (e) {
        console.log('error =', e.message)
      }
    },
    // 开启定时器
    openTimer(){
      let that = this;
      this.closeTimer();
      this.countdTimer = setInterval(() => {
        //that.getAirdropInfoData();
        //that.getCurrenAddressALADBalance();
        //that.getCurrenAddressBUSDBalance();
      }, 6000);
    },
    // 关闭定时器
    closeTimer(){
      if(this.countdTimer){
        clearInterval(this.countdTimer);
        this.countdTimer = null;
        console.log('关闭头部组件定时器');
      }
    },
    // 获取Nav中每个Item的宽度以及距离父级左边距离
    handleGetNavItemStyle(index) {
      if (index < 0) return;
      if (this.isIphone) return;
      const that = this;
      this.$nextTick (()=>{
        let childNodes = that.$refs.navMiddleRef.childNodes;
        let width = childNodes[index].clientWidth;
        let left = 0;
        if (index > 0) {
          for (let i = 0; i < index; i++) {
            left += childNodes[i].clientWidth + 45;
          }
          left += (width - 30)/2;
        }else{
          left = (width - 30)/2;
        }
        that.navItemDistanceLeftStyle = left;
      });
    },
  },
}
</script>

<style lang="scss" scoped>

.header {
  height: 80px;
  position: relative;
  user-select: none;
  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
  background-color: #2c2f53;
  .content {
    height: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .navLeft {
      width: 97px;
      height: 50px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .navMiddle {
      flex-grow: 1;
      display: flex;
      justify-content: space-between;
      .navMiddleLeft {
        height: 0;
        flex: 1;
      }
      .navMiddleRight {
        position: relative;
        display: flex;
        align-items: center;
        div {
          height: 36px;
          margin-right: 45px;
          font-size: 16px;
          line-height: 36px;
          font-weight: normal;
          text-align: center;
          font-family: "PingFang SC",sans-serif;
          cursor: pointer;
          user-select: none;
          color: var(--white);
        }
        .n_mark {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          margin-right: 0;
          div {
            margin-right: 0;
          }
          img {
            margin-top: 5px;
            margin-left: 7px;
            margin-right: 0;
            width: 12px;
            height: 8px;
          }
        }
        .nav_underline {
          position: absolute;
          left: 0;
          bottom: 0;
          display: block;
          height: 2px;
          width: 30px;
          border-radius: 1px;
          background-color:var(--primary);
          transition: all .2s ease-out;
        }
      }
    }
    .navRight {
      display: flex;
      align-items: center;
      .h_w_language img {
       width: 30px;
       height: 30px;
       margin-right: 40px;
       user-select: none;
       cursor: pointer;
      }
      .nr_right_dk {
        position: relative;
        cursor: pointer;
        display: flex;
        align-items: center;
        .nr_right_tx {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          overflow: hidden;
        }
        .nr_right_dz {
          margin-left: 10px;
          line-height: 20px;
          font-size: 14px;
          font-weight: normal;
          text-align: left;
          font-family: "PingFang SC",sans-serif;;
          color: var(--white);
        }
        .nr_right_ts {
          margin-left: 10px;
          width: 12px;
          height: 6px;
        }
        .nr_right_dj {
          position: absolute;
          bottom: 0;
          left: 28px;
          width: 14px;
          height: 14px;
        }
      }
      .nr_right_lj {
        width: 196px;
        height: 64px;
        line-height: 64px;
        font-size: 16px;
        font-weight: 500;
        text-align: center;
        font-family: "PingFang SC",sans-serif;
        box-sizing: border-box;
        cursor: pointer;
        user-select: none;
        color: var(--white);
        background-size: contain;
        background-repeat: no-repeat;
        background-image: url('../../assets/universal/icon_lj_bg.svg');
        -webkit-tap-highlight-color: transparent;
      }
      .nr_right_lj:hover {
        background-image: url('../../assets/universal/icon_dk_bg.svg');
      }
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
    .connect {
      position:relative;
      width: 500px;
      height: 304px;
      border-radius: 20px;
      background-color: #2e2f48;
      .m_c_title {
        margin-top: 16px;
        line-height: 28px;
        font-size: 20px;
        font-weight: 600;
        font-family: "PingFang SC",sans-serif;
        font-stretch: normal;
        font-style: normal;
        color: var(--white);
      }
      .m_c_line {
        margin-top: 15px;
        width: 100%;
        height: 0;
        border: dashed 1px #707070;
      }
      .m_c_item {
        width: 460px;
        height: 74px;
        padding: 0 30px;
        margin: 46px auto 0;
        border-radius: 10px;
        background-color: #343660;
        cursor: pointer;
        user-select: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        img {
          width: 48px;
          height: 48px;
        }
        span {
          line-height: 22px;
          font-size: 16px;
          font-weight: 500;
          font-family: "PingFang SC",sans-serif;
          font-stretch: normal;
          font-style: normal;
          color: var(--white);
        }
      }
      .m_c_marginTop {
        margin-top: 20px;
      }
      .mask_close {
        width: 24px;
        height: 24px;
        top: 20px;
        right: 20px;
        position: absolute;
        cursor: pointer;
      }
    }
    .disconnect {
      position:relative;
      width: 500px;
      height: 337px;
      border-radius: 20px;
      background-color: #2e2f48;
      .m_dis_title {
        margin-top: 16px;
        line-height: 28px;
        font-size: 20px;
        font-weight: 600;
        font-family: "PingFang SC",sans-serif;
        font-stretch: normal;
        font-style: normal;
        color: var(--white);
      }
      .m_dis_line {
        margin-top: 15px;
        width: 100%;
        height: 0;
        border: dashed 1px #707070;
      }
      .m_dis_item {
        padding: 0 20px;
        margin: 30px auto 0;
        user-select: none;
        display: flex;
        span {
          font-size: 16px;
          font-weight: 600;
          font-family:  "PingFang SC",sans-serif;;
          font-stretch: normal;
          font-style: normal;
          color: var(--white);
          &:last-child {
            word-break: break-all;
            text-align: left;
            margin-left: 16px;
            font-weight: normal;
            color: #d0d0d0;
          }
        }
      }
      .m_dis_itemTop {
        margin-top: 26px;
      }
      .m_dis_confirm {
        width: 306px;
        height: 64px;
        margin: 40px auto 0;
        font-size: 18px;
        font-weight: 500;
        line-height: 64px;
        cursor: pointer;
        user-select: none;
        font-family: "PingFang SC",sans-serif;;
        color: var(--white);
        box-sizing: border-box;
        background-size: contain;
        background-repeat: no-repeat;
        background-image: url('../../assets/universal/icon_disConnect.svg');
      }
      .mask_close {
        width: 24px;
        height: 24px;
        top: 20px;
        right: 20px;
        position: absolute;
        cursor: pointer;
      }
    }
  }
  .mask1 {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100vw;
    height: 100vh;
    transition: all 0.3s;
    .wrapper {
      position:relative;
      margin: 0 auto;
      max-width: 1200px;
      height: 100%;
      .disconnect {
        position:absolute;
        top: 84px;
        right: 0;
        width: 240px;
        height: 368px;
        border-radius: 10px;
        background-color: #343650;
        .m_dis_title {
          margin-top: 11px;
          margin-left: 20px;
          line-height: 20px;
          font-size: 14px;
          font-family: "PingFang SC",sans-serif;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          text-align: left;
          color: var(--white);
        }
        .m_dis_header {
          position: relative;
          display: flex;
          align-items: center;
          margin-top: 24px;
          margin-left: 20px;
          .nr_right_tx {
            width: 32px;
            height: 32px;
            border-radius: 16px;
            overflow: hidden;
          }
          .m_dis_name {
            margin-left: 6px;
            div {
              line-height: 22px;
              font-size: 16px;
              font-family: "PingFang SC",sans-serif;
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              text-align: left;
              color: var(--white);
              &:last-child {
                margin-top: 0;
                line-height: 17px;
                font-size: 12px;
                color: var(--primary);
              }
            }
          }
          .nr_right_dj {
            position: absolute;
            bottom: 4px;
            left: 20px;
            width: 10px;
            height: 10px;
          }
        }
        .m_dis_item {
          display: flex;
          align-items: center;
          margin-top: 25px;
          margin-left: 20px;
          cursor: pointer;
          user-select: none;
          img {
            width: 16px;
            height: 16px;
          }
          span {
            margin-left: 8px;
            line-height: 20px;
            font-size: 14px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            letter-spacing: normal;
            text-align: center;
            font-family: "PingFang SC",sans-serif;
            color: #fff;
          }
        }
        .m_dis_item:hover {
          span {
            color: #ff953f;
          }
        }
        .m_dis_item1 {
          display: flex;
          align-items: center;
          margin-top: 12px;
          margin-left: 20px;
          cursor: pointer;
          user-select: none;
          img {
            width: 16px;
            height: 16px;
          }
          span {
            margin-left: 8px;
            line-height: 20px;
            font-size: 14px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            letter-spacing: normal;
            text-align: center;
            font-family: "PingFang SC",sans-serif;
            color: #fff;
          }
        }
        .m_dis_item2 {
          display: flex;
          align-items: center;
          margin-top: 12px;
          margin-left: 20px;
          cursor: pointer;
          user-select: none;
          img {
            width: 16px;
            height: 16px;
          }
          span {
            margin-left: 8px;
            line-height: 20px;
            font-size: 14px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            letter-spacing: normal;
            text-align: center;
            font-family: "PingFang SC",sans-serif;
            color: #fff;
          }
        }
        .m_dis_item2:hover {
          span {
            color: #ff953f;
          }
        }
        .m_dis_item3 {
          display: flex;
          align-items: center;
          margin-top: 12px;
          margin-left: 20px;
          cursor: pointer;
          user-select: none;
          img {
            width: 16px;
            height: 16px;
          }
          span {
            margin-left: 8px;
            line-height: 20px;
            font-size: 14px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            letter-spacing: normal;
            text-align: center;
            font-family: "PingFang SC",sans-serif;
            color: #fff;
          }
        }
        .m_dis_item3:hover {
          span {
            color: #ff953f;
          }
        }
        .m_dis_item1 span {
          color: #898989;
        }
        .m_dis_wrapper {
          margin: 20px auto 0;
          width: 220px;
          //height: 101px;
          border-radius: 4px;
          border: solid 1px #5e5e7b;
          .m_dis_w1 {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-left: 10px;
            padding-right: 6px;
            width: 100%;
            height: 50px;
            box-sizing: border-box;
            .m_dis_left {
              display: flex;
              align-items: center;
              img {
                width: 20px;
                height: 20px;
              }
              span {
                margin-left: 8px;
                line-height: 20px;
                font-size: 12px;
                font-weight: normal;
                font-stretch: normal;
                font-style: normal;
                letter-spacing: normal;
                text-align: center;
                font-family: "PingFang SC",sans-serif;
                color: #ff953f;
              }
            }
            .m_dis_right {
              width: 76px;
              height: 30px;
              line-height: 30px;
              font-size: 14px;
              font-weight: 500;
              font-stretch: normal;
              font-style: normal;
              letter-spacing: normal;
              text-align: center;
              font-family: "PingFang SC",sans-serif;
              color: #fff;
              cursor: pointer;
              user-select: none;
              object-fit: contain;
              border-radius: 4px;
              background-image: linear-gradient(96deg, #f109b4 -16%, #622fe3 105%);
            }
          }
          .m_dis_w2 {
            width: 100%;
            height: 1px;
            background-color: #5e5e7b;
          }
          .m_dis_w3 {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-left: 10px;
            padding-right: 6px;
            width: 100%;
            height: 50px;
            box-sizing: border-box;
            .m_dis_left {
              display: flex;
              align-items: center;
              span {
                line-height: 20px;
                font-size: 12px;
                font-weight: normal;
                font-stretch: normal;
                font-style: normal;
                letter-spacing: normal;
                text-align: center;
                font-family: "PingFang SC",sans-serif;
                color: #fff;
                &:last-child {
                  margin-left: 2px;
                  color: #ff953f;
                }
              }
            }
            .m_dis_right {
              width: 76px;
              height: 30px;
              line-height: 30px;
              font-size: 14px;
              font-weight: 500;
              font-stretch: normal;
              font-style: normal;
              letter-spacing: normal;
              text-align: center;
              font-family: "PingFang SC",sans-serif;
              color: #fff;
              cursor: pointer;
              user-select: none;
              object-fit: contain;
              border-radius: 4px;
              background-image: linear-gradient(96deg, #f109b4 -16%, #622fe3 105%);
            }
          }
        }
      }
    }
  }
  .mask2 {
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
    .disconnect {
      position:relative;
      width: 500px;
      height: 320px;
      padding: 0 30px;
      border-radius: 20px;
      background-color: #2e2f48;
      .m_dis_title {
        margin-top: 60px;
        line-height: 30px;
        font-size: 20px;
        text-align: left;
        font-family: "PingFang SC",sans-serif;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        color: var(--white);
      }
      .m_dis_input {
        margin-top: 25px;
        height: 50px;
        border-radius: 8px;
        background-color: #1b1b33;
        input {
          width: 90%;
          height: 100%;
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
          color: #373752;
          font-size: 16px;
        }
        input:-moz-placeholder {
          /* FF 4-18 */
          color: #373752;
          font-size: 16px;
        }
        input::-moz-placeholder {
          /* FF 19+ */
          color: #373752;
          font-size: 16px;
        }
        input:-ms-input-placeholder {
          /* IE 10+ */
          color: #373752;
          font-size: 16px;
        }
        input:-webkit-autofill {
          transition: background-color 5000s ease-in-out 0s; //背景颜色
        }
      }
      .m_dis_prompt {
        margin-top: 20px;
        display: flex;
        align-items: center;
        i {
          width: 4px;
          height: 4px;
          border-radius: 2px;
          background-color: var(--white);
        }
        span {
          margin-left: 10px;
          font-size: 14px;
          font-family: "PingFang SC",sans-serif;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          color: var(--white);
        }
      }
      .m_dis_confirm {
        width: 246px;
        height: 64px;
        margin: 30px auto 0;
        cursor: pointer;
        user-select: none;
        box-sizing: border-box;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-image: url('../../assets/universal/icon_bind_disConnect.png');
        font-size: 16px;
        font-weight: 600;
        line-height: 64px;
        font-family: "PingFang SC",sans-serif;
        color: var(--white);
      }
      .mask_close {
        width: 24px;
        height: 24px;
        top: 20px;
        right: 20px;
        position: absolute;
        cursor: pointer;
      }
    }
  }
  .mask3 {
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
    .m_sale {
      width: 420px;
      height: 270px;
      border-radius: 20px;
      background-color: #2e2f48;
      .m_s_desc {
        margin: 70px auto 0;
        line-height: 33px;
        font-size: 24px;
        font-weight: 500;
        font-family: PingFangSC, sans-serif;
        font-stretch: normal;
        font-style: normal;
        color: var(--white);
      }
      .m_s_btn {
        margin: 65px auto 0;
        display: flex;
        justify-content: space-between;
        width: 322px;
        div {
          width: 156px;
          height: 64px;
          line-height: 64px;
          font-size: 16px;
          font-weight: 600;
          user-select: none;
          cursor: pointer;
          color: #fff;
          font-family: PingFangSC, sans-serif;
          background-size: 100% 100%;
          background-repeat: no-repeat;
          background-image: url('../../assets/newPhones/nLaboratory/h5_icon_l_cancle.png');
          &:last-child {
            background-image: url('../../assets/newPhones/nLaboratory/h5_icon_l_takeBack.png');
          }
        }
      }
    }
  }
  .mask4 {
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
    .disconnect {
      position:relative;
      width: 500px;
      height: 300px;
      padding: 0 30px;
      border-radius: 20px;
      background-color: #2e2f48;
      .m_dis_title {
        margin-top: 60px;
        line-height: 30px;
        font-size: 20px;
        text-align: left;
        font-family: "PingFang SC",sans-serif;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        color: var(--white);
      }
      .m_dis_input {
        margin-top: 25px;
        height: 50px;
        border-radius: 8px;
        background-color: #1b1b33;
        input {
          width: 90%;
          height: 100%;
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
          color: #373752;
          font-size: 16px;
        }
        input:-moz-placeholder {
          /* FF 4-18 */
          color: #373752;
          font-size: 16px;
        }
        input::-moz-placeholder {
          /* FF 19+ */
          color: #373752;
          font-size: 16px;
        }
        input:-ms-input-placeholder {
          /* IE 10+ */
          color: #373752;
          font-size: 16px;
        }
        input:-webkit-autofill {
          transition: background-color 5000s ease-in-out 0s; //背景颜色
        }
      }
      .m_dis_confirm {
        width: 246px;
        height: 64px;
        margin: 30px auto 0;
        cursor: pointer;
        user-select: none;
        box-sizing: border-box;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-image: url('../../assets/universal/icon_bind_disConnect.png');
        font-size: 16px;
        font-weight: 600;
        line-height: 64px;
        font-family: "PingFang SC",sans-serif;
        color: var(--white);
      }
      .mask_close {
        width: 24px;
        height: 24px;
        top: 20px;
        right: 20px;
        position: absolute;
        cursor: pointer;
      }
    }
  }
}
.el-dropdown-item-img {
  width: 35px;
  height: 35px;
  user-select: none;
  cursor: pointer;
}
.el-dropdown-menu__item span {
  height: 52px;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  font-family: Ubuntu,sans-serif;
  user-select: none;
  cursor: pointer;
  color: #000;
}
.el-dropdown-menu__item span:hover {
  color: var(--primary);
}


</style>
