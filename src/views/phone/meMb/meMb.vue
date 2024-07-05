<template>
  <div class="me">
    <div class="m_top">
      <div class="l_creator">{{ $t("message.labora.creatorNo") }}: #{{ isConnectWallet ? creatorNumber : '--' }}</div>
      <div class="l_superior" @click="handlClickBindSuperior">{{ isConnectWallet ? (isBindSuperAddress ? `${$t("message.labora.superior") + structure(superAdd) }` : $t("message.labora.bindSuperAddDesc")) : '--' }}</div>
      <div class="l_avatar">
        <!-- <img class="l_a_icon" src="../../assets/nfts/icon_n_header.svg" alt="logo">-->
        <!-- <img class="l_a_level" src="../../assets/laboras/icon_l_level_0.svg" alt="logo">-->
        <el-upload ref="upload" action="''" name="file" :accept="'image/*'" :limit="1" :auto-upload="false" :show-file-list="false" :on-change ="uploadImgFileChange">
          <div class="l_a_icon" :class="isConnectWallet ? 'l_a_icon1' : ''">
            <img v-if="isAvatarStringEmpty(avatarUrl) || !isConnectWallet" src="../../../assets/nfts/icon_n_header.svg" alt="logo">
            <img v-else :src="avatarUrl" alt="logo">
          </div>
          <img v-show="isConnectWallet" class="l_a_level" :src="require(`../../../assets/laboras/icon_l_level_${temaLevel}.svg`)" alt="logo">
        </el-upload>
        <img v-show="isShowUploadGif" class="c_l_gif" src="../../../assets/universal/icon_upload.gif" alt="logo">
      </div>
      <div class="l_nickName">
        <span>{{ isConnectWallet ? isAvatarStringEmpty(customerName) ? $t("message.labora.EditNickname") : customerName : '--' }}</span>
        <img src="../../../assets/laboras/icon_modify_nick.svg" alt="logo" @click="handleClickModifyNickName">
      </div>
      <div class="l_aridrop">
        <span>{{ $t("message.labora.aridrop")}}: </span>
        <span>{{ aridropAmount | roundingDecimals(4) }}  </span>
       <!-- <img :src="isEnglish ? require('../../../assets/laboras/icon_l_extract_y.svg') : require('../../../assets/laboras/icon_l_extract_z.svg') " alt="" @click="handleClickAridrop">-->
      </div>
      <div class="l_features">
        <div class="l_f_wapper" v-for="(item,index) in featuresList" :key="index">
          <router-link :to="item.path">
            <div class="l_f_title" :class="featuresIndex === index ? 'l_f_titles' : ''" @click="handleClickFeature(index)">{{ item.name }}</div>
          </router-link>
        </div>
      </div>
      <div class="l_features l_features1">
        <div class="l_f_wapper" v-for="(item,index) in featuresList1" :key="index">
          <router-link :to="item.path">
            <div class="l_f_title" :class="featuresIndex === index + 3 ? 'l_f_titles' : ''" @click="handleClickFeature(index + 3)">{{ item.name }}</div>
          </router-link>
        </div>
      </div>
    </div>
    <route-view></route-view>
    <!-- 绑定上级地址 -->
    <div class="mask" v-show="showBindMaks" @touchmove.prevent @mousewheel.prevent>
      <div class="disconnect">
        <div class="m_dis_title">{{ $t("message.labora.bindUpperTitle") }}</div>
        <div class="m_dis_input"><input type="text" v-model="bindSuperiorAddress" :placeholder="bindAddressPlaceHolder"></div>
        <div class="m_dis_prompt">
          <i></i>
          <span>{{ $t("message.labora.bindUpperDesc") }}</span>
        </div>
        <div class="m_dis_confirm" @click="handleClickBindSuperior">
          <span>{{ $t("message.labora.Bind") }}</span>
          <img src="../../../assets/nfts/icon_n_go.svg" alt="logo">
        </div>
        <img class="mask_close" src="../../../assets/universal/icon_qb_close.svg" alt="logo" @click="showBindMaks = !showBindMaks">
      </div>
    </div>
    <!-- 修改昵称 -->
    <div class="mask" v-show="showModifyNickMaks" @touchmove.prevent @mousewheel.prevent>
      <div class="modifyNick">
        <div class="m_dis_title">{{ $t("message.labora.EditNickname") }}</div>
        <div class="m_dis_input"><input type="text" v-model="modifyNickName" :placeholder="modifyNamePlaceHolder"></div>
        <div class="m_dis_confirm" @click="handleClickConfirModifyNick">
          <span>{{ $t("message.labora.Submit") }}</span>
          <img src="../../../assets/nfts/icon_n_go.svg" alt="logo">
        </div>
        <img class="mask_close" src="../../../assets/universal/icon_qb_close.svg" alt="logo" @click="showModifyNickMaks = !showModifyNickMaks">
      </div>
    </div>
    <!--LP挖矿-->
    <div class="mask" v-show="showLPMaks" @touchmove.prevent @mousewheel.prevent>
      <div class="lp">
        <div class="m_dis_title">{{ $t("message.smOption.LPMining") }}</div>
        <div class="m_dis_pledge">{{ $t("message.smOption.TotalValue") }}(USDT) ≈ ${{ isConnectWallet ? lpData.platformToUSDT : '--' }}</div>
        <div class="m_dis_line"></div>
        <div class="m_dis_coin">
          <img src="../../../assets/laboras/icon_lp_hh.svg" alt="logo">
          <span>BUSD/ALAD</span>
        </div>
        <div class="m_dis_content">
          <div class="m_dis_apr">
            <span>{{ isConnectWallet ? `${lpData.lpARP}%` : '--' }}</span>
            <span>{{ $t("message.smOption.APR") }}</span>
          </div>
          <div class="m_dis_apr">
            <span>ALAD</span>
            <span>{{ $t("message.smOption.Earn") }}</span>
          </div>
        </div>
        <div class="m_dis_bottom">
          <div class="m_dis_left">
            <div class="m_dis_text">
              <span>{{ $t("message.smOption.Harvests") }}(ALAD)</span>
              <span>{{ isConnectWallet ? lpData.userWithdrawNum : '--' }}</span>
            </div>
            <div class="m_dis_text">
              <span>{{ $t("message.smOption.Staked") }}(LP)</span>
              <span> {{ isConnectWallet ? lpData.userStakeNum : '--' }}</span>
            </div>
            <div class="m_dis_text">
              <span>{{ $t("message.smOption.LPStakeWorth") }}(BUSD)</span>
              <span> {{ isConnectWallet ? lpData.userStakeToUSDT : '--' }}</span>
            </div>
          </div>
          <div class="m_dis_right">
            <div class="m_dis_button" @click="handleHarvestPotionResponse">
              <span>{{ inputRightOptionalStatu(2) }}</span>
              <img src="../../../assets/laboras/icon_lp_bt_go.svg" alt="logo">
            </div>
            <div class="m_dis_button" @click="handleLPStakedResponse">
              <span>{{ inputRightOptionalStatu(3) }}</span>
              <img src="../../../assets/laboras/icon_lp_bt_go.svg" alt="logo">
            </div>
          </div>
        </div>
        <img class="mask_close" src="../../../assets/universal/icon_qb_close.svg" alt="logo" @click="showLPMaks = !showLPMaks">
      </div>
    </div>
    <!-- 质押功能 -->
    <div class="mask" v-show="showStakeMaks" @touchmove.prevent @mousewheel.prevent>
      <div class="markContent">
        <div class="mark_title">{{ $t("message.smOption.StakeLP") }}</div>
        <div class="left_line">-</div>
        <div class="mark_state">
          <div class="mark_state_topCell">
            <span>{{ $t("message.smOption.Input") }}</span>
            <span>{{ $t("message.smOption.Balance") }}:{{ lpBalace }}</span>
          </div>
          <div class="mark_state_bottomCell">
            <input type="number" v-model="stakeLPInputNum" @keyup="chageStakeBtnTextMsg" placeholder="0.00">
            <div class="mark_bottomCell_right">
              <div class="mark_max" @click="handleStateMaxCoin()">{{ $t("message.smOption.MAXs") }}</div>
              <div class="mark_type">
                <!-- <img src="../../assets/images/frams/f_icon_bnb.png" alt="logo"> -->
                <span>BUSD/ALAD</span>
              </div>
            </div>
          </div>
        </div>
        <div class="mark_liquidity" @click="handleAddLiquidityStake">{{ $t("message.smOption.LiquidityStake") }}</div>
        <div class="mark_btn" @click="handleConfirmStateCoin">{{ stakeBtnText }}</div>
        <div class="mark_harvest">
          <div class="mark_withdraw">
            <span class="Withdraw-LP-000">{{ $t("message.smOption.WithdrawLP") }} (<span>{{ lpData.userStakeNum }}</span>)</span>
          </div>
          <div class="mark_harvestBtn" @click="handleHarvestLPStake">{{ $t("message.smOption.Harvest") }}</div>
        </div>
        <img class="markClose" src="../../../assets/universal/icon_qb_close.svg" alt="logo" @click="handleCloseMask">
      </div>
    </div>
  </div>
</template>

<script>

import {MaxUint256} from '@ethersproject/constants'
import {mapGetters} from 'vuex';
import {isStringEmpty} from '@/utils/validate';
import {getCustomerInfoData, uploadAvatar} from '@/api/mark'
import {getObjectIndexAtArray} from '@/utils/utils';
import {create as ipfsHttpClient} from 'ipfs-http-client';
import RouteView from "@/layout/RouterView.vue";
import {chuDivision, keepAFewDecimalPlaces, keepFormatDecimalDecimalPlaces} from '@/utils/computing'
const settingConfig = require('../../../settings.js');

export default {
  name: "meMb",
  components: { RouteView },
  data() {
    return {
      isEnglish:false,
      featuresIndex: 0, // 第几个子视图
      ipfsClient: null, // IPFS对象
      bindAddressPlaceHolder: this.$t("message.labora.bindUpperPlaceHolder"),
      modifyNamePlaceHolder: this.$t("message.labora.modifyNamePlaceHoler"),
      isShowUploadGif: false, // 是否显示上传的gif
      showBindMaks: false, // 绑定上级弹框
      modifyNickName: '', // 输入需要修改的名称
      showModifyNickMaks: false, // 修改昵称弹框
      bindSuperiorAddress: '', // 绑定上级输入的地址

      creatorNumber: '--', // 创建的第几个用户
      superAdd: '--',// 父级地址
      customerName: '',// 用户名称
      temaLevel: 0, // 等级
      avatarUrl: '',// 头像
      aridropAmount:0, // 空投数量
      featuresList: [{name: this.$t("message.labora.wallet"), path: '/meMb/walletMb'},{name: this.$t("message.labora.promote"), path: '/meMb/promoteMb'},{name: this.$t("message.mallHeader.lp"), path: ''}],
      featuresList1: [{name: this.$t("message.labora.freed"), path: '/meMb/freedMb'},{name: this.$t("message.labora.record"), path: '/meMb/recordMb'},{name: this.$t("message.labora.wish"), path: '/meMb/wishMB'}],
      showLPMaks: false, // LP挖矿弹框
      showStakeMaks: false,
      countdTimer: null, // 定时器
      stakeBtnText: '', // 质押按钮文本状态
      lpBalace: 0, // lp的余额
      stakeLPInputNum: '', // 质押LP输入框输入的数量
      lpChefContractApporveNum: 0, // LPErc20合约授权地址
      lpData: {
        platformToUSDT: 0,
        userStakeToUSDT: 0,
        lpARP: 0,
        userWithdrawNum: 0,
        userStakeNum: 0,
      },
    };
  },
  created() {
    this.isEnglish = window.localStorage.getItem("lang") !== "zh";
    // 创建IPF客户端对象
    const that = this;
    this.$eventBus.$on('showBindUpperAddress', () => {
      that.handlClickBindSuperior();
    });
    const ipfsNode = settingConfig.ipfsNode;
    this.ipfsClient = ipfsHttpClient(ipfsNode);
    this.agetAirdropInfoData();
    this.getCustomerInfoData(1);
    this.getChefAllowance();
    this.getDataInfo();
    this.getLPBalance();
    if (this.isConnectWallet) {
      this.openTimer();
    }
  },
  mounted() {
    this.$refs.upload.clearFiles();
    // 刷新页面时候记录上次浏览的页面
    let nextKeyStorage = sessionStorage.getItem("meFeaturesNavKey");
    if (nextKeyStorage !== null) {
      this.featuresIndex = parseInt(nextKeyStorage);
    }
  },
  destroyed() {
    this.closeTimer();
  },
  // 计算属性
  computed: {
    ...mapGetters(['isConnectWallet', 'walletAddress', 'isBindSuperAddress', 'connectWalletType']),
  },
  // 监听属性改变
  watch: {
    // 监听路由变化
    $route(to, from) {
      let routeList = ['walletMb', 'promoteMb', '','freedMb','recordMb','wishMB'];
      let routeName = to.name;
      let routeIndex = getObjectIndexAtArray(routeList, routeName);
      this.featuresIndex = routeIndex;
      sessionStorage.setItem("meFeaturesNavKey", routeIndex);
      console.log('labora page router chainge');
    },
    // 监听语言的切换
    '$i18n.locale'(val, oval) {
      this.isEnglish = val !== 'zh';
      this.bindAddressPlaceHolder = this.$t("message.labora.bindUpperPlaceHolder");
      this.modifyNamePlaceHolder = this.$t("message.labora.modifyNamePlaceHoler");
      this.featuresList = [{ name: this.$t("message.labora.wallet"), path: '/meMb/walletMb' }, { name: this.$t("message.labora.promote"), path: '/meMb/promoteMb' }, { name: this.$t("message.mallHeader.lp"), path: '' },];
      this.featuresList1 = [{ name: this.$t("message.labora.freed"), path: '/meMb/freedMb' },{ name: this.$t("message.labora.record"), path: '/meMb/recordMb'},{name: this.$t("message.labora.wish"), path: '/meMb/wishMB'}];
      // let navIndex = sessionStorage.getItem("topNFTMallNavKey");
      // this.handleGetNavItemStyle(navIndex);
    },
    isConnectWallet(val, oval) {
      if (!val) {
        this.closeTimer();
      } else {
        this.agetAirdropInfoData();
        this.getCustomerInfoData(1);
        this.openTimer();
      }
    },
  },
  // 方法
  methods: {
    //隐藏中间几位字符
    structure(array) {
      return array.substring(0, 8) + '*****' + array.substring(array.length - 8);
    },
    // 判断头像是否是空的
    isAvatarStringEmpty(avatar) {
      return isStringEmpty(avatar);
    },
    // 切换
    handleClickFeature(index) {
      if (index !== 2) {
        if (index === 5) {
          return;
        }
        this.featuresIndex = index;
        sessionStorage.setItem("meFeaturesNavKey", index);
      } else {
        this.handleClickLP();
      }
    },
    // 绑定上级
    handlClickBindSuperior() {
      if (this.isBindSuperAddress) {
        return;
      }
      this.showBindMaks = true;
    },
    // 关闭绑定上级地址
    handleClickColseBindAddress() {
      this.showBindMaks = false;
      this.bindSuperiorAddress = '';
    },
    // 确定绑定上级地址
    async handleClickBindSuperior() {
      if(!this.isConnectWallet){
        return;
      }else if (isStringEmpty(this.bindSuperiorAddress)) {
        this.$notify({message: this.$t("message.labora.bindSuperAddressMsg"),duration: 2500,showClose:false,customClass:'notifyClass'});
        return;
      }
      try {
        const that = this;
        this.$loading.showLoading();
        // 判断绑定的地址是否已经绑定过上级或者是否是根地址
        const specialAddr = await this.$decentralized.getSpecialAddr();
        // 判断如果绑定的上级地址不是特殊的上级地址、则进行判断上级地址是否绑定了上级
        if (specialAddr.toLowerCase() !== this.bindSuperiorAddress.toLowerCase()) {
          const superAddress = await this.$decentralized.getParents({address:this.bindSuperiorAddress});
          const isHaveSuper = superAddress === "0x0000000000000000000000000000000000000000" ? false : true;
          if (!isHaveSuper) {
            that.$loading.hiddenLoading();
            this.$notify({message: this.$t("message.labora.bindSuperNoQualifiedMsg"),duration: 2500,showClose:false,customClass:'notifyClass'});
            return;
          }
        }
        const dict = {address:this.walletAddress,superAddress:this.bindSuperiorAddress}
        const result1 = await this.$decentralized.bindUpLevelAddress(dict,this.connectWalletType);
        if(result1) {
          // 绑定成功后更新数据、绑定上级成功后获取编号
          setTimeout(() => {
            that.$loading.hiddenLoading();
            that.$store.dispatch('wallet/setBindSuperAddress',true);
            that.superAdd = this.bindSuperiorAddress;
            that.handleClickColseBindAddress();
            that.getCustomerInfoData(1);
          }, 6000);
        }
      } catch (error) {
        this.$loading.hiddenLoading();
        this.$notify({message: error.message,duration: 2500,showClose:false,customClass:'notifyClass'});
        console.log('Error message: ', error)
      }
      console.log('绑定上级地址');
    },
    // 文件添加、 上传、 失败都会回调这里
    async uploadImgFileChange(files, fileList) {
      if (!this.isConnectWallet) {
        this.$refs.upload.clearFiles();
        this.$notify({ message: this.$t("message.casting.connectWallet"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      }
      let that = this;
      const file = fileList[0];
      const fileType = file.raw.type;
      if (fileType.indexOf('image') === -1) {
        // 如果不是图片格式
        this.$refs.upload.clearFiles();
        this.$notify({ message: this.$t("message.casting.validPhoto"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return false;
      }
      try {
        // 开启加载视图
        this.isShowUploadGif = true;
        // 获取上传文件
        const ipfsFile = file.raw;
        // 开始上传IPFS
        const added = await this.ipfsClient.add(ipfsFile, { progress: (prog) => console.log(`received: ${prog}`) });
        // 开始上传头像
        this.uploadCustomerAvatar(added);
      } catch (error) {
        this.isShowUploadGif = false;
        this.$refs.upload.clearFiles();
        this.$notify({ message: error.message, duration: 2500, showClose: false, customClass: 'notifyClass' });
        console.log('Error message: ', error)
      }
    },
    // 上传更新用户头像
    async uploadCustomerAvatar(added) {
      const uploadDict = {};
      uploadDict['address'] = this.walletAddress;
      uploadDict['pic'] = added.path;
      const result = await uploadAvatar(uploadDict);
      this.isShowUploadGif = false;
      if (result.status === 200) {
        this.$refs.upload.clearFiles();
        this.avatarUrl = `${settingConfig.ipfsNFTUrl + added.path}`;
      } else {
        this.$refs.upload.clearFiles();
        this.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
      }
    },
    // 提取空投
    async handleClickAridrop() {
      if (!this.isConnectWallet) {
        this.$notify({message: this.$t("message.casting.connectWallet"),duration: 2500,showClose:false,customClass:'notifyClass'});
        return;
      }else if (this.aridropAmount <= 0) {
         this.$notify({message: this.$t("message.labora.airdropMsg"),duration: 2500,showClose:false,customClass:'notifyClass'});
        return;
      }
      try {
        const that = this;
        const dict = {};
        dict['address'] = that.walletAddress;
        that.$loading.showLoading();
        const result = await that.$decentralized.extractAirdrop(dict,this.connectWalletType);
        that.$loading.hiddenLoading();
        that.agetAirdropInfoData();
      } catch (error) {
        this.$loading.hiddenLoading();
        this.$notify({message: error.message,duration: 2500,showClose:false,customClass:'notifyClass'});
        console.log('Error message: ', error)
      }
    },
    // 修改昵称
    handleClickModifyNickName() {
      this.showModifyNickMaks = true;
    },
    // 关闭修改昵称
    handlClickColseModifyName() {
      this.showModifyNickMaks = false;
      this.modifyNickName = '';
    },
    // 确定修改昵称
    handleClickConfirModifyNick() {
      if (isStringEmpty(this.modifyNickName)) {
        this.$notify({ message: this.$t("message.labora.modifyNameMsg"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      }
      this.getCustomerInfoData(0);
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
          this.handlClickColseModifyName();
          this.$notify({ message: this.$t("message.labora.modifySuccess"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        } else if (type === 1) {
          // 判断用户是否绑定了上级地址
          const data = result.data;
          const isBindSuperAddress = data.superadd !== "0x0000000000000000000000000000000000000000";
          // 将用户是否绑定上级地址进行存储
          this.$store.dispatch('wallet/setBindSuperAddress', isBindSuperAddress);
          this.temaLevel = data.level;
          this.superAdd = data.superadd;
          //this.avatarUrl = isStringEmpty(data.picurl) ? '' : `${settingConfig.ipfsNFTUrl + data.picurl}`;
          this.customerName = isStringEmpty(data.name) ? '' : data.name;
          this.creatorNumber = isStringEmpty(data.number) ? '--' : data.number;
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
          console.log('result data = ', data);
        }
      } else {
        this.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
      }
    },
     // 获取空投比种的数量
    async agetAirdropInfoData() {
      if(!this.isConnectWallet){
        return;
      }
      try {
        const that = this;
        const dict = {};
        dict['address'] = that.walletAddress;
        const result = await that.$decentralized.getAirdropInfoData(dict);
        that.aridropAmount = chuDivision(result,18);
      } catch (error) {
        this.$notify({message: error.message,duration: 2500,showClose:false,customClass:'notifyClass'});
        console.log('Error message: ', error)
      }
    },

    // 打开LP弹框
    handleClickLP() {
      this.showLPMaks = true;
    },
    // 关闭LP弹框
    handleClickCloseLP() {
      this.showLPMaks = false;
    },
    // 设置按钮状态
    inputRightOptionalStatu(type) {
      let msgText;
      if (!this.isConnectWallet) {
        msgText = this.$t("message.casting.Connect");
      } else {
        if (type === 1) {
          msgText = this.$t("message.smOption.Harvest");
        } else if (type === 2) {
          msgText = this.$t("message.smOption.Harvest");
        } else if (type === 3) {
          msgText = this.$t("message.smOption.LPStakeds");
        }
      }
      return msgText;
    },
    // 设置质押按钮的状态
    chageStakeBtnTextMsg() {
      let msgText;
      if (this.lpChefContractApporveNum === 0) {
        msgText = this.$t("message.smOption.Approve");
      } else if (parseInt(this.stakeLPInputNum) > this.lpChefContractApporveNum) {
        msgText = this.$t("message.smOption.Approve");
      } else if (!isStringEmpty(this.stakeLPInputNum)) {
        msgText = this.$t("message.smOption.Confirm");
      } else {
        msgText = `${this.$t("message.smOption.Enter")} ${'LP'} ${this.$t("message.smOption.Amount")}`;
      }
      this.stakeBtnText = msgText;
    },
    // 获取chef可扣余额
    async getChefAllowance() {
      if (!this.isConnectWallet) {
        return;
      }
      try {
        const that = this;
        const result = await this.$decentralized.getChefAllowance(this.walletAddress);
        if (result) {
          that.lpChefContractApporveNum = parseFloat(result);
          that.chageStakeBtnTextMsg();
          console.log('chef合约剩余可扣量=', that.lpChefContractApporveNum);
        }
      } catch (error) {
        console.log('Error message: ', error)
      }
    },
    // 授权Chef数量
    async approveChefContract() {
      try {
        const that = this;
        that.$loading.showLoading();
        const result = await this.$decentralized.approveChefContract(this.walletAddress, this.connectWalletType);
        if (result) {
          that.$loading.hiddenLoading();
          that.lpChefContractApporveNum = parseFloat(MaxUint256.toString());
          that.chageStakeBtnTextMsg();
          console.log('gaka合约剩余可扣量=', that.lpChefContractApporveNum);
        }
      } catch (error) {
        this.$loading.hiddenLoading();
        this.$notify({ message: error.message, duration: 2500, showClose: false, customClass: 'notifyClass' });
        console.log('Error message: ', error)
      }
    },
    // 获取数据
    async getDataInfo() {
      if (!this.isConnectWallet) {
        return;
      }
      try {
        const that = this;
        const dict = {};
        dict['address'] = that.walletAddress;
        const userWithdrawNum = await that.$decentralized.getUserCanWithdrawNum(dict);
        const userStakeNum = await that.$decentralized.getUserStakeLPNum(dict);
        const totalStakeNum = await that.$decentralized.getTotalStakeLPNum(dict);
        const result = await that.$decentralized.getLPStakeRelatedData(userStakeNum.amount, totalStakeNum);
        result['userWithdrawNum'] = keepAFewDecimalPlaces(chuDivision(userWithdrawNum, 18), 4);
        result['userStakeNum'] = keepAFewDecimalPlaces(chuDivision(userStakeNum.amount, 18), 4);
        result['userStakeToUSDT'] = keepAFewDecimalPlaces(result.userStakeToUSDT, 4);
        result['platformToUSDT'] = keepAFewDecimalPlaces(result.platformToUSDT, 4);
        result['lpARP'] = keepAFewDecimalPlaces(result.lpARP * 100, 2);
        that.lpData = result;
        console.log('lp data =', result);
      } catch (error) {
        this.$notify({ message: error.message, duration: 2500, showClose: false, customClass: 'notifyClass' });
        console.log('Error message: ', error)
      }
    },
    // 获取LP的余额
    async getLPBalance() {
      if (!this.isConnectWallet) {
        return;
      }
      try {
        const that = this;
        const dict = {};
        dict['address'] = that.walletAddress;
        const result = await that.$decentralized.getLPBalance(dict);
        that.lpBalace = keepFormatDecimalDecimalPlaces(chuDivision(result,18),4);
        console.log('lp balance =', that.lpBalace);
      } catch (error) {
        this.$notify({ message: error.message, duration: 2500, showClose: false, customClass: 'notifyClass' });
        console.log('Error message: ', error)
      }
    },
    // 提取ALAD
    async handleHarvestPotionResponse() {
      if (!this.isConnectWallet) {
        this.$notify({ message: this.$t("message.casting.connectWallet"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      } else if (this.lpData.userWithdrawNum <= 0) {
        this.$notify({ message: this.$t("message.alertMsg.harvestLPALADMsg"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      }
      try {
        const that = this;
        const dict = {};
        dict['address'] = that.walletAddress;
        that.$loading.showLoading();
        const result = await that.$decentralized.depositLPStakeAwardALAD(dict, this.connectWalletType);
        that.$loading.hiddenLoading();
      } catch (error) {
        this.$loading.hiddenLoading();
        this.$notify({ message: error.message, duration: 2500, showClose: false, customClass: 'notifyClass' });
        console.log('Error message: ', error)
      }
      console.log('提取ALAD');
    },
    // LP质押
    handleLPStakedResponse() {
      if (!this.isConnectWallet) {
        this.$notify({ message: this.$t("message.casting.connectWallet"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      }
      this.showStakeMaks = true;
    },
    // 添加流动性
    handleAddLiquidityStake() {
      const url = settingConfig.lpUrl;
      window.open(url);
      console.log('添加流动性');
    },
    // 提取已经质押的LP
    async handleHarvestLPStake() {
      if (!this.isConnectWallet) {
        this.$notify({ message: this.$t("message.casting.connectWallet"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      } else if (this.lpData.userWithdrawNum <= 0) {
        this.$notify({ message: this.$t("message.alertMsg.harvestLPMsg"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      }
      try {
        const that = this;
        const dict = {};
        dict['address'] = that.walletAddress;
        const userStakeNum = await that.$decentralized.getUserStakeLPNum(dict);
        dict['amount'] = userStakeNum.amount;
        that.$loading.showLoading();
        const result = await that.$decentralized.withdrawStakeLPNum(dict, this.connectWalletType);
        that.$loading.hiddenLoading();
      } catch (error) {
        this.$loading.hiddenLoading();
        this.$notify({ message: error.message, duration: 2500, showClose: false, customClass: 'notifyClass' });
        console.log('Error message: ', error)
      }
      console.log('提取已经质押');
    },
    // 确定质押最大LP
    handleStateMaxCoin() {
      this.stakeLPInputNum = this.lpBalace;
      this.chageStakeBtnTextMsg();
    },
    // 确定质押LP挖矿
    async handleConfirmStateCoin() {
      if (this.lpChefContractApporveNum == 0 || this.lpChefContractApporveNum < parseFloat(this.stakeLPInputNum)) {
        await this.approveChefContract();
        return;
      } else if (parseFloat(this.stakeLPInputNum) <= 0 || isStringEmpty(this.stakeLPInputNum)) {
        this.$notify({ message: this.$t("message.alertMsg.contentLPEmpty"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      } else if (parseFloat(this.lpBalace) < parseFloat(this.stakeLPInputNum)) {
        this.$notify({ message: this.$t("message.alertMsg.insufficientBalance"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      }
      try {
        const that = this;
        const dict = {};
        dict['address'] = that.walletAddress;
        dict['amount'] = that.stakeLPInputNum;
        that.$loading.showLoading();
        const result = await that.$decentralized.depositStakeLPALAD(dict, this.connectWalletType);
        that.$loading.hiddenLoading();
        that.stakeLPInputNum = '';
        that.showStakeMaks = false;
      } catch (error) {
        this.$loading.hiddenLoading();
        this.$notify({ message: error.message, duration: 2500, showClose: false, customClass: 'notifyClass' });
        console.log('Error message: ', error)
      }
      console.log('确定质押');
    },
    // 关闭LP质押弹框
    handleCloseMask() {
      this.stakeLPInputNum = '';
      this.showStakeMaks = false;
    },
    // 开启定时器
    openTimer() {
      const that = this;
      this.closeTimer();
      this.countdTimer = setInterval(() => {
        that.getDataInfo();
        that.getLPBalance();
        that.getChefAllowance();
      }, 2000);
    },
    // 关闭定时器
    closeTimer() {
      if (this.countdTimer) {
        clearInterval(this.countdTimer);
        this.countdTimer = null;
        console.log('关闭NFT详情定时器');
      }
    },
  },
};
</script>

<style lang="scss" scoped>

.me {
  width: 100vw;
  padding-top: 0.1px;
  box-sizing: border-box;
  .m_top {
    padding-top: 0.1px;
    background-size: contain;
    background-repeat: no-repeat;
    //background-image: url('../../../assets/laboras/icon_me_top_bg.svg');
  }
  .l_creator {
    margin: vw(30) auto 0px;
    font-size: vw(30);
    line-height: vw(34);
    font-family: Ubuntu;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    color: var(--white);
  }
  .l_superior {
    width: vw(490);
    height: vw(60);
    line-height: vw(60);
    padding: 0px vw(20);
    margin: vw(20) auto 0px;
    font-size: vw(25);
    border-radius: vw(40);
    box-sizing: border-box;
    font-family: Ubuntu;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    cursor: pointer;
    user-select: none;
    color: var(--white);
    border: solid vw(2) var(--white);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .l_avatar {
    width: vw(160);
    height: vw(182);
    margin: vw(63) auto 0px;
    position: relative;

    .l_a_level {
      width: vw(44);
      height: vw(44);
      position: absolute;
      bottom: 0;
      left: vw(58);
    }
    .l_a_icon {
      width: vw(160);
      height: vw(160);
      border-radius: vw(80);
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .l_a_icon1 {
      border: solid vw(4) var(--bgc14);
    }
    .l_a_level {
      width: vw(44);
      height: vw(44);
      position: absolute;
      bottom: 0;
      left: vw(58);
    }
    .c_l_gif {
      width: vw(100);
      height: vw(100);
      top: vw(25);
      left: vw(30);
      position: absolute;
    }
  }
  .l_nickName {
    margin: vw(13) auto 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      max-width: vw(600);
      overflow: hidden;
      line-height: vw(31);
      font-size: vw(28);
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-family: Poppins;
      color: var(--white);
    }
    img {
      width: vw(36);
      height: vw(36);
      margin-left: vw(32);
      cursor: pointer;
      user-select: none;
    }
  }
  .l_aridrop {
    margin: vw(50) auto 0px;
    height: vw(27);
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      line-height: vw(25);
      font-size: vw(24);
      font-family: Poppins;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      user-select: none;
      color: var(--white);
      &:nth-child(2) {
        margin-left: vw(20);
        font-weight: 500;
        color: var(--primary);
      }
    }
    img {
      width: vw(120);
      height: vw(44);
      margin-left: vw(20);
      cursor: pointer;
    }
  }
  .l_features {
    width: vw(690);
    height: vw(80);
    border-radius: vw(10);
    background-color: white;
    margin: vw(40) auto 0px;
    display: flex;
    justify-content: space-around;
    .l_f_wapper {
      flex: 1;
      .l_f_title {
        height: vw(80);
        line-height: vw(80);
        font-size: vw(30);
        font-family: Ubuntu-Bold;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        color: var(--bgc28);
        &:first-child {
          margin-left: 0px;
        }
      }
      .l_f_titles {
        color: var(--primary);
      }
    }
  }
  .l_features1 {
    margin: vw(20) auto 0px;
  }
  .l_line {
    max-width: 1200px;
    margin: 0 auto;
    height: 2px;
    background-color: var(--bgc15);

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
    .disconnect {
      position: relative;
      width: vw(586);
      height: vw(417);
      padding: 0px vw(50);
      border-radius: vw(20);
      background-color: var(--bgc03);
      .m_dis_title {
        margin-top: vw(40);
        line-height: vw(49);
        font-size: vw(30);
        text-align: left;
        font-family: Poppins-SemiBold;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        color: var(--white);
      }
      .m_dis_input {
        margin-top: vw(40);
        height: vw(80);
        border-radius: vw(8);
        background-color: var(--bgc16);
        input {
          width: 100%;
          height: 100%;
          padding-left: vw(22);
          border: 0; // 去除未选中状态边框
          outline: none; // 去除选中状态边框
          font-size: vw(26);
          font-family: Ubuntu;
          font-weight: normal;
          box-sizing: border-box;
          background-color: transparent;
          color: var(--white);
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
          cocolor: var(--bgc26);
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
          font-family: Poppins;
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
        background-image: linear-gradient(94deg, #6929af 1%, #3b2999 97%);
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          font-size: vw(28);
          font-weight: 500;
          line-height: vw(60);
          font-family: Poppins;
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
    .modifyNick {
      position: relative;
      width: vw(586);
      height: vw(369);
      padding: 0px vw(50);
      border-radius: vw(20);
      background-color: var(--bgc03);
      .m_dis_title {
        margin-top: vw(40);
        line-height: vw(49);
        font-size: vw(30);
        text-align: left;
        font-family: Poppins;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        color: var(--white);
      }
      .m_dis_input {
        margin-top: vw(40);
        height: vw(80);
        border-radius: vw(10);
        background-color: var(--bgc16);
        input {
          width: 100%;
          height: 100%;
          padding-left: vw(22);
          border: 0; // 去除未选中状态边框
          outline: none; // 去除选中状态边框
          font-size: vw(26);
          font-family: Ubuntu;
          font-weight: normal;
          box-sizing: border-box;
          background-color: transparent;
          color: var(--white);
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
        background-image: linear-gradient(94deg, #6929af 1%, #3b2999 97%);
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          font-size: vw(28);
          font-weight: 500;
          line-height: vw(60);
          font-family: Poppins;
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
    .lp {
      position: relative;
      width: vw(586);
      height: vw(803);
      padding: 0px;
      border-radius: vw(20);
      background-color: var(--bgc03);
      .m_dis_title {
        margin-top: vw(50);
        font-family: Poppins;
        font-size: vw(30);
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: center;
        color: var(--white);
      }
      .m_dis_pledge {
        margin-top: vw(30);
        font-family: Ubuntu;
        font-size: vw(22);
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: center;
        color: var(--white);
      }
      .m_dis_line {
        width: 100%;
        height: 1px;
        margin: vw(40) 0;
        opacity: 0.34;
        background-color: var(--bgc08);
      }
      .m_dis_coin {
        display: flex;
        margin-left: vw(39);
        margin-right: vw(46);
        justify-content: space-between;
        align-items: center;
        img {
          width: vw(90);
          height: vw(50);
        }
        span {
          font-family: Ubuntu;
          font-size: vw(28);
          font-weight: 500;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          text-align: left;
          color: var(--white);
        }
      }
      .m_dis_content {
        margin: vw(30) auto 0;
        width: vw(512);
        height: vw(113);
        border-radius: vw(13);
        background-color: #373845;
        display: flex;
        justify-content: space-between;
        .m_dis_apr {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          span {
            font-family: Ubuntu;
            font-size: vw(28);
            font-weight: 500;
            font-stretch: normal;
            font-style: normal;
            line-height: normal;
            letter-spacing: normal;
            text-align: left;
            color: var(--white);
            &:last-child {
              margin-top: vw(10);
              font-size: vw(20);
            }
          }
        }
      }
      .m_dis_bottom {
        margin-top: vw(45);
        padding: 0 vw(35) 0 vw(53);
        display: flex;
        justify-content: space-between;
        .m_dis_left {
          .m_dis_text {
            display: flex;
            flex-direction: column;
            margin-top: vw(30);
            span {
              font-family: Ubuntu;
              font-size: vw(22);
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              line-height: normal;
              letter-spacing: normal;
              text-align: left;
              color: var(--white);
              &:last-child {
                margin-top: vw(10);
                font-size: vw(30);
                font-weight: bold;
              }
            }
            &:first-child {
              margin-top: 0;
            }
          }
        }
        .m_dis_right {
          .m_dis_button {
            width: vw(201);
            height: vw(60);
            object-fit: contain;
            border-radius: 10px;
            background-image: linear-gradient(95deg, #6929af 1%, #3b2999 97%);
            display: flex;
            justify-content: center;
            align-items: center;
            span {
              font-family: Ubuntu;
              font-size: vw(28);
              font-weight: 500;
              font-stretch: normal;
              font-style: normal;
              line-height: normal;
              letter-spacing: normal;
              text-align: left;
              color: var(--white);
            }
            img {
              width: vw(14);
              height: vw(18);
              margin-left: vw(14);
              object-fit: contain;
            }
            &:last-child {
              margin-top: vw(39);
            }
          }
        }
      }
      .mask_close {
        width: vw(40);
        height: vw(40);
        top: vw(20);
        right: vw(20);
        position: absolute;
        cursor: pointer;
      }
    }
    .markContent {
      position: relative;
      width: vw(586);
      height: vw(673);
      border-radius: vw(20);
      background-color: var(--bgc03);
      .mark_title {
        height: vw(49);
        margin-left: vw(58);
        margin-top: vw(50);
        line-height: vw(49);
        font-size: vw(30);
        text-align: left;
        font-family: Poppins-SemiBold;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        color: var(--white);
      }
      .left_line {
        width: 100%;
        height: 1px;
        margin-top: vw(30);
        background-color: #707070;
      }
      .mark_state {
        width: vw(512);
        margin: vw(40) auto 0;
        height: vw(142);
        overflow: hidden;
        border-radius: 13px;
        box-sizing: border-box;
        background-color: #373845;
        .mark_state_topCell {
          margin: vw(40) vw(35) 0px vw(53);
          display: flex;
          justify-content: space-between;
          align-items: center;
          span {
            height: vw(23);
            line-height: vw(23);
            font-size: vw(20);
            font-weight: normal;
            font-family: Ubuntu;
            color: var(--white);
            &:last-child {
              height: vw(28);
              line-height: vw(28);
            }
          }
        }
        .mark_state_bottomCell {
          margin: vw(10) vw(28) 0px vw(49);
          display: flex;
          justify-content: space-between;
          align-items: center;
          input {
            width: vw(200);
            height: 32px;
            border: 0; // 去除未选中状态边框
            outline: none; // 去除选中状态边框
            color: var(--white);
            font-size: vw(28);
            font-weight: bold;
            font-family: Ubuntu;
            font-stretch: normal;
            font-style: normal;
            box-sizing: border-box;
            background-color: transparent;
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
            color: #999;
            font-size: vw(28);
          }
          input:-moz-placeholder {
            /* FF 4-18 */
            color: #999;
            font-size: vw(28);
          }
          input::-moz-placeholder {
            /* FF 19+ */
            color: #999;
            font-size: vw(28);
          }
          input:-ms-input-placeholder {
            /* IE 10+ */
            color: #999;
            font-size: vw(28);
          }
          input:-webkit-autofill {
            transition: background-color 5000s ease-in-out 0s; //背景颜色
          }
          .mark_bottomCell_right {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .mark_max {
              width: vw(70);
              height: vw(30);
              line-height: vw(30);
              font-size: vw(20);
              font-weight: normal;
              font-family: Ubuntu;
              text-align: center;
              color: var(--white);
              user-select: none;
              cursor: pointer;
              background-size: contain;
              background-repeat: no-repeat;
              //background-image: url('../../../assets/lp/icon_max_bg.svg');
            }
            .mark_type {
              span {
                margin-left: vw(10);
                height: vw(31);
                line-height: vw(31);
                font-size: vw(28);
                font-weight: bold;
                font-family: Ubuntu;
                color: var(--white);
              }
            }
          }
        }
      }
      .mark_liquidity {
        width: vw(512);
        height: vw(70);
        margin: vw(40) auto 0px;
        line-height: vw(70);
        font-size: vw(28);
        font-weight: 500;
        font-family: Ubuntu;
        font-stretch: normal;
        font-style: normal;
        box-sizing: border-box;
        user-select: none;
        cursor: pointer;
        color: var(--white);
        object-fit: contain;
        border-radius: vw(13);
        background-image: linear-gradient(88deg, #6929af 5%, #3b2999 97%);
      }
      .mark_btn {
        width: vw(512);
        height: vw(70);
        margin: vw(30) auto 0px;
        line-height: vw(70);
        font-size: vw(28);
        font-weight: 500;
        border-radius: vw(13);
        cursor: pointer;
        user-select: none;
        font-family: Ubuntu;
        box-sizing: border-box;
        color: var(--primary);
        border: 1px solid var(--primary);
      }
      .mark_harvest {
        height: vw(31);
        margin: vw(60) vw(38) 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .mark_withdraw {
          span {
            height: vw(31);
            line-height: vw(31);
            font-size: vw(28);
            font-weight: normal;
            font-family: Ubuntu;
            color: var(--white);
            span {
              color: var(--primary);
            }
          }

        }
        .mark_harvestBtn {
          height: vw(31);
          line-height: vw(31);
          font-size: vw(28);
          font-weight: normal;
          font-family: Ubuntu;
          color: var(--primary);
          user-select: none;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 1px;
          text-decoration-color: var(--primary);
          -webkit-tap-highlight-color: transparent;
        }
      }
      .markClose {
        width: vw(40);
        height: vw(40);
        top: vw(50);
        right: vw(22);
        position: absolute;
        cursor: pointer;
      }
    }
  }
}

</style>
