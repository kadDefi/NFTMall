<template>
  <div class="nftdetail">
    <div class="top_bar">
      <img src="../../../assets/newPhones/nMarket/icon_detail_back.svg" alt="back" @click="goBackPage">
      <img :src="require(`../../../assets/newPhones/nLaboratory/icon_coin_3.png`)" alt="">
    </div>
    <div class="n_top">
      <div class="n_t_left">
        <van-swipe @change="onChange">
          <van-swipe-item v-for="(item,index) in detailData.nftPicurl" :key="index">
            <van-image fit="cover" :src="item"></van-image>
          </van-swipe-item>
          <template #indicator>
            <div class="custom-indicator">{{ current + 1 }}/{{ detailData.nftPicurl.length }}</div>
          </template>
        </van-swipe>
      </div>
      <div class="n_t_right">
        <div class="n_t_r_content">
          <div class="n_t_header">
            <van-image :src="isAvatarStringEmpty(detailData.userUrl)?require('../../../assets/newPhones/nMarket/icon_header_logo.png'):detailData.userUrl" alt="logo" round></van-image>
            <div class="n_t_level"><img :src="require(`../../../assets/laboras/icon_l_level_${detailData.level}.svg`)" alt=""></div>
          </div>
          <div class="n_t_name">
            <div class="n_t_r_name">{{ detailData.userName }}</div>
            <div class="n_t_r_like" v-if="false">
              <span>{{ detailData.likeCount }}</span>
              <img alt="logo" src="../../../assets/newPhones/nMarket/icon_detail_like.svg">
            </div>
          </div>
          <div class="n_t_nftName">{{ detailData.nftName }}</div>
        </div>
        <div class="n_t_switch">
          <div class="n_t_s_detail" :class="switchIndex === 0 ? 'n_t_s_info' : ''" @click="handleClickSwitch(0)">{{ $t("message.market.Detail") }}</div>
          <div class="n_t_s_detail" :class="switchIndex === 1 ? 'n_t_s_info' : ''" @click="handleClickSwitch(1)">{{ $t("message.market.Description") }}</div>
          <div class="n_t_s_detail" :class="switchIndex === 2 ? 'n_t_s_info' : ''" @click="handleClickSwitch(2)">{{ $t("message.market.Information") }}</div>
        </div>
        <div v-if="switchIndex === 0" class="n_t_r_detail">
          <van-image fit="cover" v-for="(item,index) in detailData.detailPic" :src="item" :key="index"></van-image>
        </div>
        <div v-else-if="switchIndex === 1" class="n_t_r_desc">
          <span>{{ detailData.desc }}</span>
        </div>
        <div v-else class="n_t_r_infomation">
          <div class="m_c_item">
            <div class="m_c_i_left">
              <img src="../../../assets/laboras/icon_h_1.svg" alt="">
              <span>{{ $t("message.casting.phone") }}</span>
            </div>
            <div class="m_c_i_left">
              <img src="../../../assets/laboras/icon_h_2.svg" alt="">
              <span>{{ $t("message.casting.LINK") }}</span>
            </div>
          </div>
          <div class="m_c_item1">
            <div class="m_c_i1_left" @click="handleClickCopy(1)">
              <span>+{{ detailData.phone }}</span>
              <!--<img src="../../../assets/laboras/icon_h_copy.svg" alt="">-->
            </div>
            <div class="m_c_i1_left" @click="handleClickCopy(2)">
              <span>{{ detailData.link }}</span>
              <!--<img src="../../../assets/laboras/icon_h_copy.svg" alt="">-->
            </div>
          </div>
          <div class="m_c_item m_c_margin">
            <div class="m_c_i_left">
              <img src="../../../assets/laboras/icon_h_3.svg" alt="">
              <span>{{ $t("message.casting.WeChat") }}</span>
            </div>
            <div class="m_c_i_left">
              <img src="../../../assets/laboras/icon_h_4.svg" alt="">
              <span>{{ $t("message.casting.Telegram") }}</span>
            </div>
          </div>
          <div class="m_c_item1">
            <div class="m_c_i1_left" @click="handleClickCopy(3)">
              <span>{{ detailData.wechat }}</span>
              <!--<img src="../../../assets/laboras/icon_h_copy.svg" alt="">-->
            </div>
            <div class="m_c_i1_left" @click="handleClickCopy(4)">
              <span>{{ detailData.tg }}</span>
              <!--<img src="../../../assets/laboras/icon_h_copy.svg" alt="">-->
            </div>
          </div>
          <div class="m_c_item m_c_margin">
            <div class="m_c_i_left">
              <img src="../../../assets/laboras/icon_h_5.svg" alt="">
              <span>{{ $t("message.casting.Skype") }}</span>
            </div>
            <div class="m_c_i_left">
              <img src="../../../assets/laboras/icon_h_6.svg" alt="">
              <span>{{ $t("message.casting.BBM") }}</span>
            </div>
          </div>
          <div class="m_c_item1">
            <div class="m_c_i1_left" @click="handleClickCopy(5)">
              <span>{{ detailData.skype }}</span>
              <!--<img src="../../../assets/laboras/icon_h_copy.svg" alt="">-->
            </div>
            <div class="m_c_i1_left" @click="handleClickCopy(6)">
              <span>{{ detailData.bbm }}</span>
              <!--<img src="../../../assets/laboras/icon_h_copy.svg" alt="">-->
            </div>
          </div>
          <!-- <span v-for="(item,index) in infomationList" :key="index">{{ item.name }}</span>-->
        </div>
      </div>
    </div>
    <div class="n_buy" >
      <div class="n_t_r_b_price1" @click="handleClickBuyNFT">{{ $t("message.smFreed.buy") }}</div>
    </div>
    <!-- 支付成功的弹框 -->
    <div v-show="showPaySuccessMaks" class="mask" @touchmove.prevent @mousewheel.prevent>
      <div class="m_success">
        <div class="m_b_title">{{ $t("message.market.Orderhasbeenpaid") }}</div>
        <div class="m_b_line"></div>
        <div class="m_b_icon"><img alt="log" src="../../../assets/newPhones/nMarket/icon_n_success.png"></div>
        <div class="m_b_confirm" @click="handleClickGotoLab">
          <span>{{ $t("message.market.Checkoutthelab") }}</span>
        </div>
      </div>
    </div>
    <!-- 购买火爆商品收货信息弹框 -->
    <div class="mask1" v-show="hotData.showDeliveryMaks" @touchmove.prevent @mousewheel.prevent>
      <div class="m_delivery">
        <div class="m_d_icon"><img :src="detailData.picurl" alt="logo"></div>
        <div class="m_d_title">{{ detailData.nftName }}</div>
        <!--<div class="m_d_title m_d_price">{{ $t("message.holding.unitPrice") }}: {{ detailData.usdtPrice | roundingDecimals(6) }}USDT</div>-->
        <!--<div class="m_d_line"></div>-->
        <div class="m_d_info">
          <div class="m_d_i_one">
            <span>{{ $t("message.holding.Receiver") }}</span>
            <span>{{ $t("message.holding.CellphoneNumber") }}</span>
          </div>
          <div class="m_d_i_two">
            <div class="m_d_i_item"><input type="text" v-model="hotData.deliveryName" :placeholder="hotData.placeholderDesc1"></div>
            <div class="m_d_i_item m_d_i_item1">
              <div>+</div>
              <input class="c_r_i_p_input" type="number" v-model="hotData.phoneAearNum">
              <div>|</div>
              <input type="text" v-model="hotData.deliveryPhone" :placeholder="hotData.placeholderDesc2">
            </div>
          </div>
        </div>
        <div class="m_d_area">
          <div class="m_d_a_title">{{ $t("message.holding.Yourarea") }}</div>
          <div class="m_d_a_container">
            <textarea type="text" v-model="hotData.deliveryArea" :placeholder="hotData.placeholderDesc3"></textarea>
          </div>
        </div>
        <div class="m_d_amount_wrap">
          <div class="title">{{ $t("message.holding.buyAmount") }}</div>
          <div class="wrap">
            <input type="number" v-model="hotData.deliveryAmount" inputmode="decimal" @input="check_num()" :placeholder="hotData.placeholderDesc4">
            <span>X{{ detailData.usdtPrice | noRoundingDecimals(2) }}USDT</span>
          </div>
        </div>
        <div class="m_d_remark">
          <div class="title">{{ $t("message.holding.remark") }}</div>
          <div class="wrap">
            <input type="text" v-model="hotData.deliveryRemark" :placeholder="hotData.placeholderDesc5">
          </div>
        </div>
        <div class="m_p_Btn">
          <!--alad支付-->
          <div v-if="detailData.payType === 0" class="n_t_r_b_price" @click="handleClickBuyNFTType(0)">
            <div v-if="isNeedApproveALAD" class="n_approve">{{ $t("message.casting.ApproveALAD") }}</div>
            <div v-else class="n_content">
              <img :src="require(`../../../assets/newPhones/nCasting/icon_c_alad.svg`)" alt="">
              <span>{{ buyNeedAladPrice * hotData.deliveryAmount | noRoundingDecimals(4) }}</span>
            </div>
          </div>
          <!--busd支付-->
          <div v-else-if="detailData.payType === 1" class="n_t_r_b_price" @click="handleClickBuyNFTType(0)">
            <div v-if="isNeedApproveUSDT" class="n_approve">{{ $t("message.casting.ApproveBUSD") }}</div>
            <div v-else class="n_content">
              <img :src="require(`../../../assets/newPhones/nCasting/icon_c_busd.svg`)" alt="">
              <span>{{  detailData.usdtPrice * hotData.deliveryAmount | noRoundingDecimals(4) }}</span>
            </div>
          </div>
          <!--alad/busd支付-->
          <div v-else-if="detailData.payType === 2"  class="n_t_r_b_pay">
            <div class="n_left" @click="handleClickBuyNFTType(1)">
              <div v-if="isNeedApproveALAD" class="n_approve">{{ $t("message.casting.ApproveALAD") }}</div>
              <div v-else class="n_content">
                <img :src="require(`../../../assets/newPhones/nCasting/icon_c_alad.svg`)" alt="">
                <span>{{  buyNeedAladPrice * hotData.deliveryAmount | noRoundingDecimals(4) }}</span>
              </div>
            </div>
            <div class="n_left" @click="handleClickBuyNFTType(2)">
              <div v-if="isNeedApproveUSDT" class="n_approve">{{ $t("message.casting.ApproveBUSD") }}</div>
              <div v-else class="n_content">
                <img :src="require(`../../../assets/newPhones/nCasting/icon_c_busd.svg`)" alt="">
                <span>{{  detailData.usdtPrice * hotData.deliveryAmount | noRoundingDecimals(4) }}</span>
              </div>
            </div>
          </div>
        </div>
        <img class="mask_close" src="../../../assets/universal/icon_qb_close.svg" alt="logo" @click="hanleClickClosehotMaks">
      </div>
    </div>
  </div>
</template>

<script>

import {MaxUint256} from '@ethersproject/constants'
import {mapGetters} from 'vuex';
import {isStringEmpty} from '@/utils/validate';
import {getCustomerInfoData, getShopDetail, operationLikeNFT} from '@/api/mark'
import {parseNumber} from '@/decentralizedApi/param'
import {chuDivision, keepFormatDecimalDecimalPlaces} from '@/utils/computing'
const settingConfig = require('../../../settings.js');

export default {
  name: "nShopDetail",
  data() {
    return {
      current: 0,
      isEnglish: false,
      switchIndex: 0,
      showPaySuccessMaks: false,
      detailData: {
        level: 0,
        nftPicurl: [],
        nftName: '--',
        userName: '--',
        desc: '--',
        likeCount: 0,
        likeFlag: 0,
        usdtPrice: 0,
        gakaPrice: 0,
      },
      hotData: {
        showDeliveryMaks: false,// 收货信息弹框
        deliveryName: '',
        phoneAearNum: '86',
        deliveryPhone: '',
        deliveryArea: '',
        deliveryAmount: '',
        deliveryRemark: '',
        placeholderDesc1: this.$t("message.holding.Name"),
        placeholderDesc2: this.$t("message.holding.Number"),
        placeholderDesc3: this.$t("message.holding.AreaDesc"),
        placeholderDesc4: this.$t("message.holding.buyAmountMsg"),
        placeholderDesc5: this.$t("message.holding.remarkMsg"),
      },
      countdTimer: null, // 定时器
      isBindSuperAddress: false, // 用户是否绑定上级
      buyNeedAladPrice: 0, // 购买NFT需要多少ALAD
      aladApproveNum: 0, // 授权扣ALAD数量余额
      busdApproveNum: 0, // 授权扣BUSD数量余额
      buyBtnText: '', // 购买按钮状态
      payWayIndex:0, // 支付方式 0 alad 1 busd
    };
  },
  created() {
    this.getALADAllowance();
    this.getNFTDetailInfo();
    this.getCustomerInfoData();
  },
  mounted() {
  },
  destroyed() {
    this.closeTimer();
  },
  // 计算属性
  computed: {
    ...mapGetters(['isConnectWallet', 'walletAddress', 'connectWalletType']),
    isNeedApproveALAD() {
      return parseFloat(this.aladApproveNum) === 0 || parseFloat(this.aladApproveNum) < parseFloat(this.buyNeedAladPrice * this.hotData.deliveryAmount);
    },
    isNeedApproveUSDT() {
      return parseFloat(this.busdApproveNum) === 0 || parseFloat(this.busdApproveNum) < parseFloat(this.detailData.usdtPrice * this.hotData.deliveryAmount);
    },
  },
  // 监听属性改变
  watch: {
    isConnectWallet(val, oval) {
      if (val) {
        this.getALADAllowance();
        this.getNFTDetailInfo();
        this.getCustomerInfoData();
      }
    },
    '$i18n.locale'(nval, oval) {
      this.isEnglish = nval !== 'zh';
      this.hotData.placeholderDesc1 = this.$t("message.holding.Name");
      this.hotData.placeholderDesc2 = this.$t("message.holding.Number");
      this.hotData.placeholderDesc3 = this.$t("message.holding.AreaDesc");
      this.hotData.placeholderDesc4 = this.$t("message.holding.buyAmountMsg");
      this.hotData.placeholderDesc5 = this.$t("message.holding.remarkMsg");
      console.log('监听到语言的切换');
    },
  },
  // 方法
  methods: {
    //限制
    check_num: function() {
      let pearlNumber = '' + this.hotData.deliveryAmount;
      pearlNumber = pearlNumber.replace(/[^\d]/g, ''); // 清除“数字”和“.”以外的字符
      if (pearlNumber.indexOf('.') < 0 && pearlNumber !== '') {
        // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        pearlNumber = parseInt(pearlNumber);
      }
      this.hotData.deliveryAmount = pearlNumber.toString().trim();
      console.log('pearlNumber =', this.hotData.deliveryAmount)
    },
    onChange(index) {
      this.current = index;
    },
    goBackPage() {
      this.$router.back();
    },
    // 判断头像是否是空的
    isAvatarStringEmpty(avatar) {
      return isStringEmpty(avatar);
    },
    // 跳转到铸造者详情页面
    handleClickJumpCreatorEvent() {
      if (!this.isConnectWallet) {
        this.$notify({ message: this.$t("message.casting.connectWallet"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      } else if (this.walletAddress.toLowerCase() === this.detailData.owner.toLowerCase()) {
        this.$notify({ message: this.$t("message.alertMsg.checkCreatorMsg"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      }
      // 打开新页面
      this.$router.push({ path: '/creatorMb', query: { item: this.detailData.owner, item1: this.isEnglish } });
    },
    // 获取market_add可扣ALAD余额
    async getALADAllowance() {
      if (!this.isConnectWallet) {
        return;
      }
      try {
        const that = this;
        const result = await this.$decentralized.getCanBuckledALADAllowance(this.walletAddress);
        const result1 = await this.$decentralized.getCanBuckledBUSDAllowance(this.walletAddress);
        that.aladApproveNum = parseFloat(chuDivision(result,18));
        that.busdApproveNum = parseFloat(chuDivision(result1,18));
        console.log(`购买时候合约剩余可扣ALAD量=${that.aladApproveNum} 购买时候合约剩余可扣BUSD量=${that.busdApproveNum}`);
      } catch (error) {
        console.log('Error message: ', error)
      }
    },
    // 授权ALAD数量
    async approveALADContract() {
      const that = this;
      try {
        that.$loading.showLoading();
        const result = await this.$decentralized.approveALADContract(this.walletAddress, this.connectWalletType);
        if (result) {
          that.$loading.hiddenLoading();
          that.aladApproveNum = parseFloat(MaxUint256.toString());
          console.log('aladApproveNum=', that.aladApproveNum);
        }
      } catch (error) {
        that.$loading.hiddenLoading();
        that.$notify({ message: error.message, duration: 2500, showClose: false, customClass: 'notifyClass' });
        console.log('Error message: ', error)
      }
    },
    // 授权BUSD数量
    async approveBUSDContract() {
      const that = this;
      try {
        that.$loading.showLoading();
        const result = await this.$decentralized.approveBUSDContract(this.walletAddress, this.connectWalletType);
        if (result) {
          that.$loading.hiddenLoading();
          that.busdApproveNum = parseFloat(MaxUint256.toString());
          console.log('购买时候合约剩余可扣BUSD量=', that.busdApproveNum);
        }
      } catch (error) {
        that.$loading.hiddenLoading();
        that.$notify({ message: error.message, duration: 2500, showClose: false, customClass: 'notifyClass' });
        console.log('Error message: ', error)
      }
    },
    // 获取NFT详情数据
    async getNFTDetailInfo() {
      if (!this.isConnectWallet) {
        return;
      }
      const dict = {};
      dict['id'] = this.$route.query.item;
      dict['sender'] = this.walletAddress;
      const that = this;
      const result = await getShopDetail(dict);
      if (result.status === 200) {
        result.data.userName = isStringEmpty(result.data.userName) ? result.data.number : result.data.userName;
        if (isStringEmpty(result.data.userUrl)) {
          result.data.userUrl = '';
        } else {
          const newStr = result.data.userUrl.indexOf("https");
          if (newStr === -1) {
            result.data.userUrl = `${settingConfig.ipfsNFTUrl + result.data.userUrl}`
          }
        }
        if (isStringEmpty(result.data.picurl)) {
          result.data.picurl = '';
        } else {
          let newStr = result.data.picurl.indexOf("https");
          if (newStr === -1) {
            result.data.picurl = `${settingConfig.ipfsNFTUrl + result.data.picurl}`
          }
        }
        if (isStringEmpty(result.data.nftPicurl)) {
          result.data.nftPicurl = [];
        } else {
          const nftPicurl = result.data.nftPicurl.split(',');
          result.data.nftPicurl = nftPicurl.map((item) => {
            let newStr = item.indexOf("https");
            if (newStr === -1) {
              item = `${settingConfig.ipfsNFTUrl + item}`
            }
            return item;
          });
        }
        if (isStringEmpty(result.data.detailPic)) {
          result.data.detailPic = [];
        } else {
          const detailPic = result.data.detailPic.split(',');
          result.data.detailPic = detailPic.map((item) => {
            let newStr = item.indexOf("https");
            if (newStr === -1) {
              item = `${settingConfig.ipfsNFTUrl + item}`
            }
            return item;
          });
        }
        that.detailData = result.data;
        // 开启定时器更新ALAD价格(当存在ALAD支付时候才开启定时器)
        if (that.detailData.payType === 0 || that.detailData.payType === 2) {
          this.openTimer();
        }
      } else {
        that.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
      }
      console.log('NFT详情数据', result.data);
    },
    // 获取用户是否已经绑定上级
    async getCustomerInfoData() {
      // 0 修改昵称  1 获取列表数据
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
        this.isBindSuperAddress = data.superadd !== "0x0000000000000000000000000000000000000000";
        console.log(`用户${this.isBindSuperAddress ? '已经' : '未'}绑定上级`);
      } else {
        this.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
      }
    },
    // 切换NFT详情信息
    handleClickSwitch(index) {
      this.switchIndex = index;
    },
    // 喜欢收藏NFT
    async handleClickCollectNFT() {
      if (!this.isConnectWallet) {
        this.$notify({ message: this.$t("message.casting.connectWallet"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      }
      const dict = {};
      dict['tokenid'] = this.$route.query.item;
      dict['address'] = this.walletAddress;
      dict['shop'] = 1;
      const that = this;
      const result = await operationLikeNFT(dict);
      if (result.status === 200) {
        this.getNFTDetailInfo();
      } else {
        that.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
      }
    },
    // 购买弹框
    handleClickBuyNFT() {
      if (!this.isConnectWallet) {
        this.$notify({ message: this.$t("message.casting.connectWallet"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      }
      this.hotData.showDeliveryMaks = true;
    },
    // index = 0 alad  1 busd
    handleClickBuyNFTType(index) {
      // 判断选择支付的类型 0 alad 1 busd
      if (index === 0) {
        this.payWayIndex = this.detailData.payType;
      }else if (index === 1) {
        this.payWayIndex = 0;
      }else if (index === 2) {
        this.payWayIndex = 1;
      }
      this.hanleClickBuyHotGoods();
    },
    // 购买商店类NFT
    async hanleClickBuyHotGoods() {
      if (!this.isConnectWallet) {
        this.$notify({ message: this.$t("message.casting.connectWallet"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      }
      // 0 alad 1 busd
      if (this.detailData.payType === 0) {
        if (this.aladApproveNum === 0 || this.aladApproveNum < this.buyNeedAladPrice * this.hotData.deliveryAmount) {
          this.approveALADContract();
          return;
        }
      }else  if (this.detailData.payType === 1) {
        if (this.busdApproveNum === 0 || this.busdApproveNum < this.detailData.usdtPrice) {
          this.approveBUSDContract();
          return;
        }
      }else  if (this.detailData.payType === 2) {
        if (this.payWayIndex === 0) {
          if (this.aladApproveNum === 0 || this.aladApproveNum < this.buyNeedAladPrice) {
            this.approveALADContract();
            return;
          }
        }else  if (this.payWayIndex === 1) {
          if (this.busdApproveNum === 0 || this.busdApproveNum < this.detailData.usdtPrice) {
            this.approveBUSDContract();
            return;
          }
        }
      }

      if (this.walletAddress.toLowerCase() === this.detailData.owner.toLowerCase()) {
        this.$notify({ message: this.$t("message.market.NFTHoldMsg"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      } else if (!this.isBindSuperAddress) {
        this.$notify({ message: this.$t("message.alertMsg.bindSuperAddressMsg"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      } else if (isStringEmpty(this.hotData.deliveryName)) {
        this.$notify({ message: this.$t("message.holding.nameMsg"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      } else if (isStringEmpty(this.hotData.phoneAearNum)) {
        this.$notify({ message: this.$t("message.holding.areaNumMsg"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      } else if (isStringEmpty(this.hotData.deliveryPhone)) {
        this.$notify({ message: this.$t("message.holding.numberMsg"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      } else if (isStringEmpty(this.hotData.deliveryArea)) {
        this.$notify({ message: this.$t("message.holding.areaMsg"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      } else if (isStringEmpty(this.hotData.deliveryAmount)) {
        this.$notify({ message: this.$t("message.holding.buyAmountMsg"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      }
      try {
        const that = this;
        this.$loading.showLoading();
        const dict = {address: this.walletAddress, tokenID: this.$route.query.item, sellAddress: this.detailData.owner, usdtValue: parseNumber(this.detailData.usdtPrice, 18),
          count: this.hotData.deliveryAmount, receiver: this.hotData.deliveryName, number: this.hotData.deliveryPhone, areaNum: this.hotData.phoneAearNum, areDesc: this.hotData.deliveryArea,
          remarks: this.hotData.deliveryRemark, payType: this.payWayIndex}
        const result = await this.$decentralized.buyOrder(dict, this.connectWalletType);
        if (result) {
          that.$loading.hiddenLoading();
          that.hanleClickClosehotMaks();
          that.showPaySuccessMaks = true;
        }
      } catch (error) {
        this.$loading.hiddenLoading();
        this.$notify({ message: error.message, duration: 2500, showClose: false, customClass: 'notifyClass' });
        console.log('Error message: ', error)
      }
    },
    // 关闭火爆商品
    hanleClickClosehotMaks() {
      this.hotData.deliveryName = '';
      this.hotData.phoneAearNum = '86';
      this.hotData.deliveryPhone = '';
      this.hotData.deliveryArea = '';
      this.hotData.deliveryAmount = '';
      this.hotData.deliveryRemark = '';
      this.hotData.showDeliveryMaks = false;
    },
    // 确认购买常规/艺术类NFT
    async handleClickGoToBuy() {
      if (!this.isConnectWallet) {
        this.$notify({ message: this.$t("message.casting.connectWallet"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      } else if (this.aladApproveNum === 0 || this.aladApproveNum < this.buyNeedAladPrice * this.hotData.deliveryAmount) {
        this.approveALADContract();
        return;
      } else if (this.walletAddress.toLowerCase() === this.detailData.owner.toLowerCase()) {
        this.$notify({ message: this.$t("message.market.NFTHoldMsg"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      } else if (!this.isBindSuperAddress) {
        this.$notify({ message: this.$t("message.alertMsg.bindSuperAddressMsg"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      }
      try {
        const that = this;
        this.$loading.showLoading();
        const dict = { address: this.walletAddress, tokenID: this.$route.query.item,payType:this.payWayIndex}
        let result = null;
        if (this.detailData.headType === 1) {
          // 常规
          result = await this.$decentralized.executeNormalOrder(dict, this.connectWalletType);
        } else if (this.detailData.headType === 2) {
          // 艺术
          result = await this.$decentralized.safeExecuteOrder(dict, this.connectWalletType);
        }
        if (result) {
          that.$loading.hiddenLoading();
          that.handleClickGoToCancle();
          that.showPaySuccessMaks = true;
        }
      } catch (error) {
        this.$loading.hiddenLoading();
        this.$notify({ message: error.message, duration: 2500, showClose: false, customClass: 'notifyClass' });
        console.log('Error message: ', error)
      }
      console.log('确定购买');
    },
    // 确定跳转到个人实验室
    handleClickGotoLab() {
      this.showPaySuccessMaks = false;
      this.$router.push("/laboratoryMb")
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
    // 开启定时器
    openTimer() {
      const that = this;
      this.closeTimer();
      this.countdTimer = setInterval(() => {
        that.$decentralized.getAladPrice(that.detailData.usdtPrice, (result) => {
          that.buyNeedAladPrice = result;
          console.log(`${that.detailData.usdtPrice}USDT需要${result}ALAD购买`);
        });
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

.nftdetail {
  position: relative;
  display: flex;
  flex-direction: column;
  padding-top: 0.1px;
  box-sizing: border-box;
  height: 100%;
  background-color: #2e2f48;
  //background-size: 100% 100%;
  //background-repeat: no-repeat;
  //background-image: url('../../../assets/nfts/icon_bg.jpg');
  overflow: hidden;
  .top_bar {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100vw;
    height: vw(110);
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 vw(30);
    img {
      width: vw(80);
      height: vw(80);
    }
  }
  .n_top {
    flex: 1 1 auto;
    max-height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    .n_t_left {
      position: relative;
      width: 100vw;
      height: 100vw;
      margin: 0 auto;
      box-sizing: border-box;
      .custom-indicator {
        position: absolute;
        right: vw(30);
        bottom: vw(20);
        padding: 0 vw(30);
        font-family: PingFangSC, sans-serif;
        font-size: vw(28);
        height: vw(50);
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: vw(50);
        letter-spacing: normal;
        text-align: center;
        color: white;
        border-radius: vw(25);
        background: rgba(0, 0, 0, 0.5);
      }
      .van-swipe {
        height: vw(750);
        .van-image {
          width: 100%;
          height: 100%;
        }
      }
    }
    .n_t_right {
      flex: 1;
      text-align: left;
      .n_t_r_content {
        position: relative;
        width: 100%;
        margin: 0 auto;
        padding: 0.1px vw(30) vw(30);
        background-color: #202136;
        .n_t_header {
          position: absolute;
          top: vw(-35);
          left: vw(30);
          width: vw(140);
          height: vw(140);
          .van-image {
            width: 100%;
            height: 100%;
            border: vw(5) solid white;
          }
          .n_t_level {
            position: absolute;
            bottom: 0;
            right: 0;
            width: vw(44);
            height: vw(44);
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
        .n_t_name {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-left: vw(168);
          margin-top: vw(14);
          .n_t_r_name {
            margin-top: vw(14);
            line-height: vw(45);
            font-size: vw(32);
            font-weight: 600;
            font-stretch: normal;
            font-style: normal;
            letter-spacing: normal;
            text-align: center;
            font-family: PingFangSC, sans-serif;
            color: #fff;
          }
          .n_t_r_like {
            display: flex;
            align-items: center;
            justify-content: center;
            img {
              margin-left: vw(20);
              width: vw(44);
              height: vw(44);
            }
            span {
              font-family: Poppins, sans-serif;
              font-size: vw(28);
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              line-height: normal;
              letter-spacing: normal;
              text-align: center;
              color: #fff;
            }
          }
        }
        .n_t_nftName {
          margin-top: vw(50);
          line-height: vw(30);
          font-size: vw(28);
          font-weight: 500;
          font-stretch: normal;
          font-style: normal;
          letter-spacing: normal;
          text-align: left;
          font-family: PingFangSC, sans-serif;
          color: #fff;

        }
      }
      .n_t_switch {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: vw(40) auto vw(40);
        padding: 0 vw(4);
        width: vw(600);
        height: vw(80);
        border-radius: vw(20);
        background-color: #1b1b33;
        .n_t_s_detail {
          width: vw(292);
          height: vw(72);
          font-size: vw(28);
          line-height: vw(72);
          font-weight: 500;
          font-stretch: normal;
          font-style: normal;
          letter-spacing: normal;
          text-align: center;
          color: #919191;
          font-family: PingFangSC, sans-serif;
          border-radius: vw(16);
          background-color: transparent;
        }
        .n_t_s_info {
          color: #fff;
          background-color: #343650;
        }
      }
      .n_t_r_switch {
        margin: vw(40) vw(30) 0;
        span {
          line-height: vw(36);
          font-size: vw(32);
          font-family: Ubuntu, sans-serif;
          font-weight: bold;
          font-stretch: normal;
          font-style: normal;
          color: var(--white);
        }
      }
      .n_t_r_detail {
        .van-image {
          width: vw(750);
        }
      }
      .n_t_r_desc {
        width: vw(635);
        margin: vw(30) auto 0;
        span {
          font-size: vw(26);
          line-height: vw(40);
          font-family: PingFangSC, sans-serif;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          word-wrap: break-word;
          color: var(--white);
        }
      }
      .n_t_r_infomation {
        width: vw(600);
        margin: vw(30) auto 0;
        padding-bottom: vw(50);
        .m_c_item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: vw(40);
          .m_c_i_left {
            display: flex;
            align-items: center;
            width: vw(292);
            img {
              width: vw(24);
              height: vw(24);
            }
            span {
              margin-left: vw(8);
              line-height: vw(27);
              font-size: vw(24);
              font-weight: 500;
              font-stretch: normal;
              font-style: normal;
              font-family: PingFangSC, sans-serif;;
              color: #fff;
            }
          }
        }
        .m_c_item1 {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: vw(18);
          .m_c_i1_left {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: vw(292);
            height: vw(60);
            border-radius: vw(6);
            background-color: #6e6e9a;
            span {
              margin-left: vw(10);
              line-height: vw(27);
              font-size: vw(24);
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              font-family: PingFangSC, sans-serif;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              color: #fff;
            }
            img {
              margin-right: vw(10);
              width: vw(28);
              height: vw(28);
            }
          }
        }
        .m_c_margin {
          margin-top: vw(30);
        }
      }
    }
  }
  .n_buy {
    flex: none;
    width: 100vw;
    display: flex;
    align-items: center;
    height: vw(130);
    .n_t_r_b_price1 {
      margin: 0 auto;
      width: vw(570);
      height: vw(90);
      line-height: vw(90);
      font-size: vw(32);
      font-weight: 500;
      font-family: "PingFang SC", sans-serif;
      font-stretch: normal;
      font-style: normal;
      color: var(--white);
      border-radius: vw(10);
      cursor: pointer;
      user-select: none;
      box-sizing: border-box;
      background-size: contain;
      background-repeat: no-repeat;
      background-image: url("../../../assets/newPhones/nMarket/icon_m_pay2.svg");
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
    .m_pay {
      position: relative;
      width: vw(586);
      height: vw(532);
      border-radius: vw(20);
      background-color: #2e2f48;
      .m_p_title {
        margin-top: vw(30);
        line-height: vw(34);
        font-size: vw(30);
        font-family: Ubuntu, sans-serif;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        color: var(--white);
      }
      .m_p_line {
        margin-top: vw(36);
        height: 1px;
        opacity: 0.34;
        background-color: #3d3d58;
      }
      .m_p_contain {
        display: flex;
        height: vw(280);
        .m_p_c_left {
          padding-left: vw(40);
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          .m_p_c_l_text {
            line-height: vw(31);
            font-size: vw(28);
            font-weight: 500;
            text-align: left;
            font-family: Ubuntu, sans-serif;
            font-stretch: normal;
            font-style: normal;
            color: var(--white);
          }
          .m_p_c_middle {
            display: flex;
            align-items: center;
            .m_p_c_m_desc {
              display: none;
              div {
                margin-left: vw(20);
                line-height: vw(40);
                font-size: vw(28);
                font-weight: 500;
                word-break: break-all;
                text-align: left;
                font-family: Poppins, sans-serif;
                font-stretch: normal;
                font-style: normal;
                color: var(--white);
              }
            }
            img {
              width: vw(106);
              height: vw(106);
              border-radius: vw(8);
            }
          }
        }
        .m_p_c_right {
          flex: 1;
          padding-right: vw(50);
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          div {
            line-height: vw(31);
            font-size: vw(28);
            font-weight: 500;
            text-align: right;
            font-family: Ubuntu, sans-serif;
            font-stretch: normal;
            font-style: normal;
            color: #994cf0;
            &:first-child {
              color: var(--white);
            }
          }
          .m_p_c_usdt {
            align-self: flex-end;
            display: flex;
            align-items: center;
            span {
              line-height: vw(30);
              font-size: vw(28);
              font-weight: 500;
              text-align: right;
              font-family: Ubuntu, sans-serif;
              font-stretch: normal;
              font-style: normal;
              color: #994cf0;
            }
            img {
              margin-left: vw(20);
              width: vw(44);
              height: vw(44);
            }
          }
        }
      }
      .m_p_line1 {
        height: 1px;
        opacity: 0.24;
        background-color: #3d3d58;
      }
      .m_p_Btn {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: vw(40) auto 0;
        div {
          width: vw(236);
          height: vw(94);
          line-height: vw(94);
          font-size: vw(28);
          font-weight: 500;
          cursor: pointer;
          user-select: none;
          font-family: PingFangSC, sans-serif;
          font-stretch: normal;
          font-style: normal;
          background-size: contain;
          background-repeat: no-repeat;
          background-image: url('../../../assets/newPhones/nMarket/h5_icon_n_buy.png');
          color: var(--white);
          &:last-child {
            width: vw(236);
            background-size: contain;
            background-repeat: no-repeat;
            background-image: url('../../../assets/newPhones/nMarket/h5_icon_n_cancle.png');
          }
        }
      }
    }
    .m_success {
      position: relative;
      width: vw(586);
      height: vw(532);
      border-radius: vw(20);
      background-color: var(--bgc03);
      .m_b_title {
        margin-top: vw(25);
        line-height: vw(49);
        font-size: vw(30);
        font-family: Poppins, sans-serif;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        color: var(--white);
      }
      .m_b_line {
        margin-top: vw(26);
        height: 1px;
        opacity: 0.34;
        background-color: #3d3d58;
      }
      .m_b_icon {
        margin: vw(30) auto 0;
        width: vw(355);
        height: vw(250);
        img {
          width: 100%;
          height: 100%;
        }
      }
      .m_b_confirm {
        width: vw(416);
        height: vw(94);
        margin: vw(30) auto 0;
        cursor: pointer;
        user-select: none;
        box-sizing: border-box;
        background-size: contain;
        background-repeat: no-repeat;
        background-image: url('../../../assets/newPhones/nMarket/h5_icon_check.png');
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          font-size: vw(28);
          font-weight: 500;
          line-height: vw(60);
          font-family: Poppins, sans-serif;
          color: var(--white);
        }

      }
    }
  }
  .mask1 {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    transition: all 0.3s;
    background-color: var(--bgc02);
    .m_delivery {
      position: relative;
      width: vw(690);
      padding: vw(30) 0 vw(40);
      //height: 474px;
      border-radius: vw(20);
      background-color: #202136;
      .m_d_icon {
        margin: 0 auto;
        width: vw(160);
        height: vw(160);
        img {
          width: 100%;
          height: 100%;
          border-radius: vw(10);
        }
      }
      .m_d_title {
        margin: vw(16) auto 0;
        line-height: normal;
        font-size: vw(26);
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        color: white;
        font-family: PingFangSC-Regular, sans-serif;
      }
      .m_d_price {
        font-size: vw(28);
        color: #fff;
      }
      .m_d_info {
        padding: 0 vw(20);
        .m_d_i_one {
          display: flex;
          justify-content: space-between;
          span {
            width: vw(310);
            margin-top: vw(33);
            line-height: normal;
            font-size: vw(24);
            font-weight: 500;
            text-align: left;
            font-stretch: normal;
            font-style: normal;
            font-family: PingFangSC, sans-serif;
            color: white;
          }
        }
        .m_d_i_two {
          margin-top: vw(11);
          display: flex;
          justify-content: space-between;
          .m_d_i_item {
            width: vw(310);
            height: vw(80);
            border-radius: vw(10);
            border: solid 1px #4f5776;
            background-color: #1b1b33;
            input {
              width: 80%;
              height: 100%;
              border: 0; // 去除未选中状态边框
              outline: none; // 去除选中状态边框
              font-size: vw(24);
              font-family: PingFangSC-Regular, sans-serif;
              font-weight: normal;
              box-sizing: border-box;
              background-color: transparent;
              color: var(--white);
            }
            input::-webkit-input-placeholder {
              color: #373752;
              font-size: vw(24);
            }
            input:-moz-placeholder {
              /* FF 4-18 */
              color: #373752;
              font-size: vw(24);
            }
            input::-moz-placeholder {
              /* FF 19+ */
              color: #373752;
              font-size: vw(24);
            }
            input:-ms-input-placeholder {
              /* IE 10+ */
              color: #373752;
              font-size: vw(24);
            }
            input:-webkit-autofill {
              transition: background-color 5000s ease-in-out 0s; //背景颜色
            }
          }
          .m_d_i_item1 {
            display: flex;
            align-items: center;
            div {
              margin-left: vw(10);
              font-size: vw(26);
              font-weight: 500;
              font-stretch: normal;
              font-style: normal;
              font-family: Poppins, sans-serif;
              user-select: none;
              cursor: pointer;
              color: var(--white);
              &:nth-child(3) {
                width: 1px;
                margin-left: 0;
                margin-right: vw(10);
              }
            }
            .c_r_i_p_input {
              width: vw(60);
              height: 100%;
              border: 0; // 去除未选中状态边框
              outline: none; // 去除选中状态边框
              font-size: vw(24);
              font-family: Poppins, sans-serif;
              font-weight: normal;
              box-sizing: border-box;
              background-color: transparent;
              color: var(--white);
            }
            .c_r_i_p_input::-webkit-outer-spin-button,
            .c_r_i_p_input::-webkit-inner-spin-button {
              -webkit-appearance: none;
            }
            /* 火狐 */
            .c_r_i_p_input[type="number"] {
              -moz-appearance: textfield;
            }
            .c_r_i_p_input:-webkit-autofill {
              transition: background-color 5000s ease-in-out 0s; //背景颜色
            }
          }
        }
      }
      .m_d_area {
        margin-top: vw(24);
        padding: 0 vw(20);
        .m_d_a_title {
          line-height: normal;
          font-size: vw(24);
          font-weight: 500;
          text-align: left;
          font-stretch: normal;
          font-style: normal;
          color: #fff;
          font-family: PingFangSC, sans-serif;
        }
        .m_d_a_container {
          width: 100%;
          height: vw(140);
          margin-top: vw(20);
          border-radius: vw(10);
          border: solid 1px #4f5776;
          background-color: #1b1b33;
          textarea {
            margin-top: vw(20);
            width: 90%;
            height: 80%;
            border: 0; // 去除未选中状态边框
            resize: none;
            outline: none; // 去除选中状态边框
            font-size: vw(24);
            font-family: PingFangSC-Regular, sans-serif;
            font-weight: normal;
            box-sizing: border-box;
            background-color: transparent;
            color: var(--white);
          }
          textarea::-webkit-input-placeholder {
            color: #373752;
            font-size: vw(24);
          }
          textarea:-moz-placeholder {
            /* FF 4-18 */
            color: #373752;
            font-size: vw(24);
          }
          textarea::-moz-placeholder {
            /* FF 19+ */
            color: #373752;
            font-size: vw(24);
          }
          textarea:-ms-input-placeholder {
            /* IE 10+ */
            color: #373752;
            font-size: vw(24);
          }
          textarea:-webkit-autofill {
            transition: background-color 5000s ease-in-out 0s; //背景颜色
          }
        }
      }
      .m_d_amount_wrap {
        margin-top: vw(30);
        padding: 0 vw(20);
        .title {
          line-height: normal;
          font-size: vw(24);
          font-weight: 500;
          text-align: left;
          font-stretch: normal;
          font-style: normal;
          font-family: PingFangSC, sans-serif;
          color: #fff;
        }
        .wrap {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: vw(24);
          padding: 0 vw(20);
          height: vw(80);
          border-radius: vw(10);
          border: solid 1px #4f5776;
          background-color: #1b1b33;
          input {
            flex: 1;
            //width: 90%;
            height: 100%;
            border: 0; // 去除未选中状态边框
            outline: none; // 去除选中状态边框
            font-size: vw(24);
            font-family: PingFangSC-Regular, sans-serif;
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
            color: #373752;
            font-size: vw(24);
          }
          input:-moz-placeholder {
            /* FF 4-18 */
            color: #373752;
            font-size: vw(24);
          }
          input::-moz-placeholder {
            /* FF 19+ */
            color: #373752;
            font-size: vw(24);
          }
          input:-ms-input-placeholder {
            /* IE 10+ */
            color: #373752;
            font-size: vw(24);
          }
          input:-webkit-autofill {
            transition: background-color 5000s ease-in-out 0s; //背景颜色
          }
          span {
            line-height: vw(33);
            font-size: vw(24);
            font-weight: normal;
            text-align: left;
            font-stretch: normal;
            font-style: normal;
            font-family: Poppins, sans-serif;
            color: #ff953f;
          }
        }
      }
      .m_d_remark {
        margin-top: vw(30);
        padding: 0 vw(20);
        .title {
          line-height: normal;
          font-size: vw(24);
          font-weight: 500;
          text-align: left;
          font-stretch: normal;
          font-style: normal;
          font-family: PingFangSC, sans-serif;
          color: #fff;
        }
        .wrap {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: vw(24);
          padding: 0 vw(20);
          height: vw(80);
          border-radius: vw(10);
          border: solid 1px #4f5776;
          background-color: #1b1b33;
          input {
            flex: 1;
            //width: 90%;
            height: 100%;
            border: 0; // 去除未选中状态边框
            outline: none; // 去除选中状态边框
            font-size: vw(24);
            font-family: PingFangSC-Regular, sans-serif;
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
            color: #373752;
            font-size: vw(24);
          }
          input:-moz-placeholder {
            /* FF 4-18 */
            color: #373752;
            font-size: vw(24);
          }
          input::-moz-placeholder {
            /* FF 19+ */
            color: #373752;
            font-size: vw(24);
          }
          input:-ms-input-placeholder {
            /* IE 10+ */
            color: #373752;
            font-size: vw(24);
          }
          input:-webkit-autofill {
            transition: background-color 5000s ease-in-out 0s; //背景颜色
          }
          span {
            line-height: vw(33);
            font-size: vw(24);
            font-weight: normal;
            text-align: left;
            font-stretch: normal;
            font-style: normal;
            font-family: Poppins, sans-serif;
            color: #9a55dc;
          }
        }
      }
      .m_p_Btn {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: vw(30) auto 0;
        .n_t_r_b_price {
          margin: 0 auto;
          width: vw(360);
          height: vw(80);
          cursor: pointer;
          user-select: none;
          box-sizing: border-box;
          background-size: contain;
          background-repeat: no-repeat;
          background-image: url("../../../assets/newPhones/nMarket/icon_m_pay.svg");
          .n_approve {
            line-height: vw(80);
            font-size: vw(28);
            font-weight: 500;
            font-family: "PingFang SC", sans-serif;
            font-stretch: normal;
            font-style: normal;
            color: var(--white);
          }
          .n_content {
            display: flex;
            align-items: center;
            justify-content: center;
            img {
              width: vw(44);
              height: vw(44);
            }
            span {
              margin-left: vw(13);
              line-height: vw(80);
              font-size: vw(28);
              font-weight: 500;
              font-family: "PingFang SC", sans-serif;
              font-stretch: normal;
              font-style: normal;
              color: var(--white);
            }
          }
        }
        .n_t_r_b_pay {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 0 auto;
          width: vw(530);
          height: vw(80);
          .n_left {
            width: vw(260);
            height: vw(80);
            cursor: pointer;
            user-select: none;
            box-sizing: border-box;
            background-size: contain;
            background-repeat: no-repeat;
            background-image: url("../../../assets/newPhones/nMarket/icon_m_pay1.svg");
            .n_approve {
              line-height: vw(80);
              font-size: vw(28);
              font-weight: 500;
              font-family: "PingFang SC", sans-serif;
              font-stretch: normal;
              font-style: normal;
              color: var(--white);
            }
            .n_content {
              display: flex;
              align-items: center;
              justify-content: center;
              img {
                width: vw(44);
                height: vw(44);
              }
              span {
                margin-left: vw(13);
                line-height: vw(80);
                font-size: vw(28);
                font-weight: 500;
                font-family: "PingFang SC", sans-serif;
                font-stretch: normal;
                font-style: normal;
                color: var(--white);
              }
            }
          }
        }
      }
      .m_d_buy {
        width: vw(500);
        height: vw(70);
        margin: vw(40) auto 0;
        line-height: vw(70);
        font-size: vw(28);
        font-weight: 500;
        cursor: pointer;
        user-select: none;
        box-sizing: border-box;
        font-stretch: normal;
        font-style: normal;
        color: #fff;
        font-family: Poppins, sans-serif;
        background-size: contain;
        background-repeat: no-repeat;
        border-radius: vw(10);
        box-shadow: 0 0 vw(20) 0 rgba(123, 40, 219, 0.6);
        background-image: linear-gradient(86deg, #f109b4 -1%, #622fe3 102%);
      }
      .m_d_cancle {
        margin-top: vw(30);
        width: vw(500);
        height: vw(70);
        line-height: vw(70);
        color: #9a55dc;
        border-radius: vw(10);
        box-shadow: 0 0 vw(10) 0 rgba(123, 40, 219, 0.6), inset 0 vw(3) vw(10) 0 #742adc;
        background-color: #2e2e48;
        background-image: none;
      }
      .mask_close {
        width: vw(36);
        height:  vw(36);
        top:  vw(26);
        right: vw(26);
        position: absolute;
        cursor: pointer;
      }
    }
  }
}

</style>
