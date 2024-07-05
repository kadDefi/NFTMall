<template>
  <div class="nftdetail">
    <div class="n_top">
      <div class="n_t_left">
        <img :src="isShopperDetail ? detailData.picurl : detailData.nftPicurl" alt="logo">
        <img class="mc_c_art" :src="require(`../../../assets/newPhones/nLaboratory/icon_coin_${ isShopperDetail ? '3' : detailData.headType}.png`)" alt="">
      </div>
      <div class="n_t_right">
        <div class="n_t_r_name">{{ detailData.nftName }}</div>
        <div class="n_t_r_wrapper">
          <div class=n_w_top>
            <div class="n_t_r_info">
              <div class="n_t_wrapper" @click="handleClickJumpCreatorEvent">
                <img v-if="isAvatarStringEmpty(detailData.userUrl)" src="../../../assets/nfts/icon_n_header.svg" alt="logo">
                <img v-else :src="detailData.userUrl" alt="logo">
                <div class="n_t_level"><img :src="require(`../../../assets/laboras/icon_l_level_${detailData.level}.svg`)" alt=""></div>
              </div>
              <span>{{ detailData.userName }}</span>
            </div>
            <div class="n_t_r_like" @click="handleClickCollectNFT">
              <span>{{ detailData.likeCount }}</span>
              <img :src="require(`../../../assets/nfts/icon_n_collect_${detailData.likeFlag}.svg`)" alt="logo">
            </div>
          </div>
          <div class="n_w_line"></div>
          <div class="n_w_infomation">{{ $t("message.market.Detail") }}</div>
          <div class="n_w_desc">{{ detailData.desc }}</div>
          <div v-if="isShopperDetail" class="n_w_infomation">{{ $t("message.casting.mainPhoto") }}</div>
          <div v-if="isShopperDetail" class="n_w_mainPhoto">
            <div v-for="(item,index) in detailData.nftPicurl" :key="index" >
              <van-image fit="cover" :src="item"></van-image>
            </div>
          </div>
          <div class="n_t_r_buy">
            <div class="n_t_r_b_price1" @click="handleClickBuyNFT">{{ $t("message.smFreed.buy") }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="detailData.headType !== 2" :class="showOpenInfo ? 'n_info_wrapper' : ''" class="n_info">
      <div class="n_info_top" @click="showOpenInfo = !showOpenInfo">
        <div class="n_i_left">
          <img src="../../../assets/marks/icon_m_info.svg" alt="">
          <span>{{ $t("message.market.Information") }}</span>
        </div>
        <div class="n_i_right"><img :src="require(`../../../assets/marks/icon_m_${!showOpenInfo ? 'x' : 's'}.svg`)" alt=""></div>
      </div>
      <div v-if="showOpenInfo" class="n_w_line"></div>
      <div v-if="showOpenInfo"  class="m_c_item">
        <div class="m_c_contnet">
          <img src="../../../assets/laboras/icon_h_1.svg" alt="">
          <div>+{{ detailData.phone }}</div>
        </div>
        <div class="m_c_contnet">
          <img src="../../../assets/laboras/icon_h_3.svg" alt="">
          <div>{{ detailData.wechat  }}</div>
        </div>
        <div class="m_c_contnet">
          <img src="../../../assets/laboras/icon_h_5.svg" alt="">
          <div>{{ detailData.skype }}</div>
        </div>
      </div>
      <div v-if="showOpenInfo"  class="m_c_item">
        <div class="m_c_contnet">
          <img src="../../../assets/laboras/icon_h_4.svg" alt="">
          <div>{{ detailData.tg }}</div>
        </div>
        <div class="m_c_contnet">
          <img src="../../../assets/laboras/icon_h_2.svg" alt="">
          <div>{{ detailData.link  }}</div>
        </div>
        <div class="m_c_contnet">
          <img src="../../../assets/laboras/icon_h_6.svg" alt="">
          <div>{{ detailData.bbm }}</div>
        </div>
      </div>
    </div>
    <div v-if="isShopperDetail" :class="showOpenDetail ? 'n_info_wrapper1' : ''" class="n_info1">
      <div class="n_info_top" @click="showOpenDetail = !showOpenDetail">
        <div class="n_i_left">
          <img src="../../../assets/marks/icon_m_detail.svg" alt="">
          <span>{{ $t("message.market.Detail") }}</span>
        </div>
        <div class="n_i_right"><img :src="require(`../../../assets/marks/icon_m_${!showOpenInfo ? 'x' : 's'}.svg`)" alt=""></div>
      </div>
      <div v-if="showOpenDetail" class="n_w_line"></div>
      <div v-if="showOpenDetail" class="n_w_item">
        <van-image fit="cover" v-for="(item,index) in detailData.detailPic" :src="item" :key="index"></van-image>
      </div>
    </div>
    <div class="w_footer"> © 2022 COMPASS Club. All rights reserved. </div>
    <!-- 支付弹框 -->
    <div class="mask" v-show="showPayMaks" @touchmove.prevent @mousewheel.prevent>
      <div class="m_pay">
        <div class="m_p_title">{{ $t("message.market.Confirmationofanorder") }}</div>
        <div class="m_p_line"></div>
        <div class="m_p_contain">
          <div class="m_p_c_left">
            <div class="m_p_c_l_text">{{ $t("message.stock.Items") }}</div>
            <div class="m_p_c_middle">
              <img :src="detailData.nftPicurl" alt="logo">
              <div class="m_p_c_m_desc">
                <div>{{ detailData.userName }}</div>
                <div>{{ detailData.nftName }}</div>
              </div>
            </div>
            <!--<div class="m_p_c_l_text">{{ $t("message.stock.folded") }}</div>-->
          </div>
          <div class="m_p_c_right">
            <div>{{ $t("message.stock.Price") }}</div>
            <div class="m_p_c_usdt">
              <span>{{ detailData.usdtPrice | roundingDecimals(4) }}</span>
              <img src="../../../assets/newPhones/universal/icon_usdt_coin.svg" alt="">
            </div>
          </div>
        </div>
        <div class="m_p_line1"></div>
        <div class="m_p_Btn">
          <!--alad支付-->
          <div v-if="detailData.payType === 0" class="n_t_r_b_price" @click="handleClickBuyNFTType(0)">
            <div v-if="isNeedApproveALAD" class="n_approve">{{ $t("message.casting.ApproveALAD") }}</div>
            <div v-else class="n_content">
              <img :src="require(`../../../assets/newPhones/nCasting/icon_c_alad.svg`)" alt="">
              <span>{{ buyNeedAladPrice }}</span>
            </div>
          </div>
          <!--busd支付-->
          <div v-else-if="detailData.payType === 1" class="n_t_r_b_price" @click="handleClickBuyNFTType(0)">
            <div v-if="isNeedApproveUSDT" class="n_approve">{{ $t("message.casting.ApproveBUSD") }}</div>
            <div v-else class="n_content">
              <img :src="require(`../../../assets/newPhones/nCasting/icon_c_busd.svg`)" alt="">
              <span>{{  detailData.usdtPrice | noRoundingDecimals(4) }}</span>
            </div>
          </div>
          <!--alad/busd支付-->
          <div v-else-if="detailData.payType === 2"  class="n_t_r_b_pay">
            <div class="n_left" @click="handleClickBuyNFTType(1)">
              <div v-if="isNeedApproveALAD" class="n_approve">{{ $t("message.casting.ApproveALAD") }}</div>
              <div v-else class="n_content">
                <img :src="require(`../../../assets/newPhones/nCasting/icon_c_alad.svg`)" alt="">
                <span>{{ buyNeedAladPrice }}</span>
              </div>
            </div>
            <div class="n_left" @click="handleClickBuyNFTType(2)">
              <div v-if="isNeedApproveUSDT" class="n_approve">{{ $t("message.casting.ApproveBUSD") }}</div>
              <div v-else class="n_content">
                <img :src="require(`../../../assets/newPhones/nCasting/icon_c_busd.svg`)" alt="">
                <span>{{  detailData.usdtPrice | noRoundingDecimals(4) }}</span>
              </div>
            </div>
          </div>
        </div>
        <img class="mask_close" src="../../../assets/universal/icon_qb_close.svg" alt="logo" @click="handleClickGoToCancle">
      </div>
    </div>
    <!-- 支付成功的弹框 -->
    <div class="mask" v-show="showPaySuccessMaks" @touchmove.prevent @mousewheel.prevent>
      <div class="m_success">
        <div class="m_b_title">{{ $t("message.market.Orderhasbeenpaid") }}</div>
        <div class="m_b_line"></div>
        <div class="m_b_icon"><img alt="log" src="../../../assets/newPhones/nMarket/icon_n_success.png"></div>
        <div class="m_b_confirm" @click="handleClickGotoLab">
          <span>{{ $t("message.market.Checkoutthelab") }}</span>
        </div>
      </div>
    </div>
    <!-- 收货信息弹框 -->
    <div class="mask1" v-show="hotData.showDeliveryMaks" @touchmove.prevent @mousewheel.prevent>
      <div class="m_delivery">
        <div class="m_d_icon"><img :src="detailData.picurl" alt="logo"></div>
        <div class="m_d_title">{{ detailData.nftName }}</div>
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
            <input type="number" v-model="hotData.deliveryAmount" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" :placeholder="hotData.placeholderDesc4">
            <span>X{{ detailData.usdtPrice | roundingDecimals(2) }}USDT</span>
          </div>
        </div>
        <div class="m_d_remark">
          <div class="title">{{ $t("message.holding.remark") }}</div>
          <div class="wrap">
            <input type="text" v-model="hotData.deliveryRemark" :placeholder="hotData.placeholderDesc5">
          </div>
        </div>
        <div class="m_d_line"></div>
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
       <!-- <div class="m_d_buy" @click="hanleClickBuyHotGoods"> {{ buyBtnText }} </div>-->
        <img class="mask_close" src="../../../assets/universal/icon_qb_close.svg" alt="logo" @click="hanleClickClosehotMaks">
        <!--<div class="m_d_buy m_d_cancle" @click="hanleClickClosehotMaks">{{ $t("message.stock.Cancel") }}</div>-->
      </div>
    </div>
  </div>
</template>

<script>

import {chuDivision} from "@/utils/computing";
const settingConfig = require('../../../settings.js');
import { mapGetters } from 'vuex';
import { isStringEmpty } from '@/utils/validate';
import {getNFTDetailInfo, operationLikeNFT, getCustomerInfoData, getShopDetail} from '@/api/mark'
import { MaxUint256 } from '@ethersproject/constants'
import RouterView from '@/layout/RouterView.vue';
import {parseNumber} from "@/decentralizedApi/param";

export default {
  components: { RouterView },
  name: "nftdetail",
  data() {
    return {
      isEnglish:false,
      showPayMaks:false,
      showPaySuccessMaks:false,
      showOpenInfo:false,
      showOpenDetail:false,
      detailData: {
        level: 0,
        nftName: '--',
        userName: '--',
        desc: '--',
        likeCount: 0,
        likeFlag: 0,
        usdtPrice: 0,
        headType: 1,
      },
      hotData: {
        showDeliveryMaks:false,// 收货信息弹框
        deliveryName:'',
        phoneAearNum:'86',
        deliveryPhone:'',
        deliveryArea:'',
        deliveryAmount:'',
        deliveryRemark:'',
        placeholderDesc1:this.$t("message.holding.Name"),
        placeholderDesc2:this.$t("message.holding.Number"),
        placeholderDesc3:this.$t("message.holding.AreaDesc"),
        placeholderDesc4:this.$t("message.holding.buyAmountMsg"),
        placeholderDesc5: this.$t("message.holding.remarkMsg"),
      },
      isBindSuperAddress:false, // 用户是否绑定上级
      countdTimer:null, // 定时器
      buyNeedAladPrice:0, // 购买NFT需要多少ALAD
      aladApproveNum:0, // 授权市场合约扣ALAD数量
      buyBtnText:'', // 购买按钮状态
      busdApproveNum: 0, // 授权扣Busd数量余额
      payWayIndex:0, // 支付方式
      isShopperDetail:false, // 是否是商店商品
    };
  },
  created() {
    // 获取当前语言
    this.isEnglish = localStorage.getItem("lang") !== "zh";
    // 判断是否是店铺类详情/还是普通商品/NFT详情类
    this.isShopperDetail = this.$route.query.item1 === 'false' ? false : true;
    // 设置tabBar在哪个页面
    const that = this;
    setTimeout(() => {
      that.$eventBus.$emit("checkNFTDetailJump", this.isShopperDetail ? 4 : 3);
    }, 500);
    this.getCustomerInfoData();
    this.getALADAllowance();
    this.getNFTDetailInfo();
  },
  mounted() {

  },
  destroyed() {
    this.closeTimer();
  },
  // 计算属性
  computed: {
    ...mapGetters(['isConnectWallet','walletAddress','connectWalletType']),
    isNeedApproveALAD() {
      return parseFloat(this.aladApproveNum) === 0 || parseFloat(this.aladApproveNum) < parseFloat(this.buyNeedAladPrice);
    },
    isNeedApproveUSDT() {
      return parseFloat(this.busdApproveNum) === 0 || parseFloat(this.busdApproveNum) < parseFloat(this.detailData.usdtPrice);
    },
  },
  // 监听属性改变
  watch:{
    isConnectWallet(val,oval) {
      if (val) {
        this.getCustomerInfoData();
        this.getALADAllowance();
        this.getNFTDetailInfo();
      }
    },
    '$i18n.locale'(nval,oval) {
      this.isEnglish = nval !== 'zh';
      this.hotData.placeholderDesc1 = this.$t("message.holding.Name");
      this.hotData.placeholderDesc2 = this.$t("message.holding.Number");
      this.hotData.placeholderDesc3 = this.$t("message.holding.AreaDesc");
      this.placeholderDesc4 = this.$t("message.holding.buyAmountMsg");
      this.hotData.placeholderDesc5 = this.$t("message.holding.remarkMsg");
      console.log('监听到语言的切换');
    },
  },
  // 方法
  methods: {
    // 判断头像是否是空的
    isAvatarStringEmpty(avatar) {
      return isStringEmpty(avatar);
    },
    // 动态修改购买按钮的状态
    changeBtnStatuTextMsg() {
      let textMsg = this.$t("message.market.Buy");
      if (this.detailData.hotType === 1) {
        if (isStringEmpty(this.hotData.deliveryAmount) || parseInt(this.hotData.deliveryAmount) === 0) {
          textMsg = `0AlAD | ${this.$t("message.holding.confirmBuy")}`;
        }else {
          const needAlADAmount = (this.buyNeedAladPrice * parseInt(this.hotData.deliveryAmount)).toFixed(4);
          textMsg = `${needAlADAmount}AlAD | ${this.$t("message.holding.confirmBuy")}`;
        }
        if(this.aladApproveNum === 0) {
          textMsg = this.$t("message.casting.Approve");
        }else if(this.aladApproveNum < this.buyNeedAladPrice * parseInt(this.hotData.deliveryAmount)) {
          textMsg = this.$t("message.casting.Approve");
        }
      }else  {
        if(this.aladApproveNum === 0) {
          textMsg = this.$t("message.casting.Approve");
        }else if(this.aladApproveNum < this.buyNeedAladPrice) {
          textMsg = this.$t("message.casting.Approve");
        }
      }
      this.buyBtnText = textMsg;
    },
    // 跳转到铸造者详情页面
    handleClickJumpCreatorEvent() {
      if(!this.isConnectWallet) {
        this.$notify({message: this.$t("message.casting.connectWallet"),duration: 2500,showClose:false,customClass:'notifyClass'});
        return;
      }else if(this.walletAddress.toLowerCase() ===  this.detailData.owner.toLowerCase()) {
        this.$notify({message: this.$t("message.alertMsg.checkCreatorMsg"),duration: 2500,showClose:false,customClass:'notifyClass'});
        return;
      }
      // 打开新页面
      const routeUrl = this.$router.resolve({path: '/creator',query:{ item:this.detailData.owner,item1:this.isEnglish,item2: this.isShopperDetail ? 'shop' : ''}});
      window.open(routeUrl.href, '_blank');
    },
    // 获取market_add可扣ALAD/BUSD余额
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
          console.log('购买时候合约剩余可扣ALAD量=', that.aladApproveNum);
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
     if(!this.isConnectWallet){
        return;
      }
      const dict = {};
     if (this.isShopperDetail) {
       dict['id'] = this.$route.query.item;
       dict['sender'] = this.walletAddress;
     }else {
       dict['tokenid'] = this.$route.query.item;
       dict['address'] = this.walletAddress;
     }
      const that = this;
      let result;
      if (this.isShopperDetail) {
        result = await getShopDetail(dict);
      }else  {
        result = await getNFTDetailInfo(dict);
      }
      if (result.status === 200) {
        // 用户昵称
        result.data.userName = isStringEmpty(result.data.userName) ? result.data.number : result.data.userName;
        // 用户头像添加全路径链接
        if (isStringEmpty(result.data.userUrl)) {
          result.data.userUrl = '';
        }else  {
          const newStr = result.data.userUrl.indexOf("https");
          if (newStr === -1) {
            result.data.userUrl = `${settingConfig.ipfsNFTUrl + result.data.userUrl}`
          }
        }
        // 判断详情是普通类/店铺类
        if (that.isShopperDetail) {
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
        }else  {
          // 商品图片添加全路径链接
          if (isStringEmpty(result.data.nftPicurl)) {
            result.data.nftPicurl = '';
          }else  {
            const newStr = result.data.nftPicurl.indexOf("https");
            if (newStr === -1) {
              result.data.nftPicurl = `${settingConfig.ipfsNFTUrl + result.data.nftPicurl}`
            }
          }
        }
        // 开始将存在的数据进行拼接保存显示出俩
        if (isStringEmpty(result.data.phone)) {
          result.data.phone = '--';
        }
        if (isStringEmpty(result.data.link)) {
          result.data.link = '--';
        }
        if (isStringEmpty(result.data.wechat)) {
          result.data.wechat = '--';
        }
        if (isStringEmpty(result.data.tg)) {
          result.data.tg = '--';
        }
        if (isStringEmpty(result.data.skype)) {
          result.data.skype = '--';
        }
        if (isStringEmpty(result.data.bbm)) {
          result.data.bbm = '--';
        }
        that.detailData = result.data;
        // 开启定时器更新ALAD价格(当存在ALAD支付时候才开启定时器)
        if (that.detailData.payType === 0 || that.detailData.payType === 2) {
          this.openTimer();
        }
      }else {
        that.$notify({message: result.data,duration: 2500,showClose:false,customClass:'notifyClass'});
      }
      console.log('NFT详情数据',result.data);
    },
    // 获取用户是否已经绑定上级
    async getCustomerInfoData(type) {
      // 0 修改昵称  1 获取列表数据
      if(!this.isConnectWallet){
        return;
      }
      const dict = {};
      dict['type'] = '1';
      dict['address'] = this.walletAddress;
      const result = await getCustomerInfoData(dict);
      if (result.status === 200) {
        // 判断用户是否绑定了上级地址
        const data = result.data;
        this.isBindSuperAddress = data.superadd !== "0x0000000000000000000000000000000000000000";
        console.log(`用户${this.isBindSuperAddress ? '已经' : '未'}绑定上级`);
      }else {
        this.$notify({message: result.data,duration: 2500,showClose:false,customClass:'notifyClass'});
      }
    },
    // 喜欢收藏NFT
    async handleClickCollectNFT() {
      if(!this.isConnectWallet){
        this.$notify({message: this.$t("message.casting.connectWallet"),duration: 2500,showClose:false,customClass:'notifyClass'});
        return;
      }
      const dict = {};
      dict['tokenid'] = this.$route.query.item;
      dict['address'] = this.walletAddress;
      dict['shop'] = this.isShopperDetail ? 1 : 0;
      const that = this;
      const result = await operationLikeNFT(dict);
      if (result.status === 200) {
        this.getNFTDetailInfo();
      }else {
        that.$notify({message: result.data,duration: 2500,showClose:false,customClass:'notifyClass'});
      }
    },
    // 确认取消
    handleClickGoToCancle() {
      this.showPayMaks = false;
    },
    // 购买弹框
    handleClickBuyNFT() {
      if (!this.isConnectWallet) {
        this.$notify({ message: this.$t("message.casting.connectWallet"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      }
      if (this.isShopperDetail) {
        this.hotData.showDeliveryMaks = true;
        return;
      }
      this.showPayMaks = true;
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
      if (this.isShopperDetail) {
        this.hanleClickBuyHotGoods();
      }else  {
        this.handleClickGoToBuy();
      }

    },
    // 确认普通商品/艺术类NFT购买
    async handleClickGoToBuy() {
      if(!this.isConnectWallet) {
        this.$notify({message: this.$t("message.casting.connectWallet"),duration: 2500,showClose:false,customClass:'notifyClass'});
        return;
      }
      // 0 alad 1 busd
      if (this.detailData.payType === 0) {
        if (this.aladApproveNum === 0 || this.aladApproveNum < this.buyNeedAladPrice) {
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
      if(this.walletAddress.toLowerCase() === this.detailData.owner.toLowerCase()) {
        this.$notify({message: this.$t("message.market.NFTHoldMsg"),duration: 2500,showClose:false,customClass:'notifyClass'});
        return;
      }else if(!this.isBindSuperAddress) {
        this.$notify({message: this.$t("message.alertMsg.bindSuperAddressMsg"),duration: 2500,showClose:false,customClass:'notifyClass'});
        return;
      }
      try {
        const that = this;
        this.$loading.showLoading();
        const dict = {address:this.walletAddress,tokenID:this.$route.query.item,payType:this.payWayIndex}
        let result = null;
        if (this.detailData.headType === 1) {
          // 常规
          result = await this.$decentralized.executeNormalOrder(dict,this.connectWalletType);
        }else if (this.detailData.headType === 2) {
          // 艺术
          result = await this.$decentralized.safeExecuteOrder(dict,this.connectWalletType);
        }
        if(result) {
          that.$loading.hiddenLoading();
          that.handleClickGoToCancle();
          that.showPaySuccessMaks = true;
        }
      } catch (error) {
        this.$loading.hiddenLoading();
        this.$notify({message: error.message,duration: 2500,showClose:false,customClass:'notifyClass'});
        console.log('Error message: ', error)
      }
      console.log('确定购买');
    },
    // 购买店铺类商品
    async hanleClickBuyHotGoods() {
      if(!this.isConnectWallet) {
        this.$notify({message: this.$t("message.casting.connectWallet"),duration: 2500,showClose:false,customClass:'notifyClass'});
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
      if(this.walletAddress.toLowerCase() === this.detailData.owner.toLowerCase()) {
        this.$notify({message: this.$t("message.market.NFTHoldMsg"),duration: 2500,showClose:false,customClass:'notifyClass'});
        return;
      }else if(!this.isBindSuperAddress) {
        this.$notify({message: this.$t("message.alertMsg.bindSuperAddressMsg"),duration: 2500,showClose:false,customClass:'notifyClass'});
        return;
      } else if (isStringEmpty(this.hotData.deliveryName)) {
        this.$notify({message: this.$t("message.holding.nameMsg"),duration: 2500,showClose:false,customClass:'notifyClass'});
        return;
      }else  if (isStringEmpty(this.hotData.phoneAearNum)) {
        this.$notify({message: this.$t("message.holding.areaNumMsg"),duration: 2500,showClose:false,customClass:'notifyClass'});
        return;
      }else  if (isStringEmpty(this.hotData.deliveryPhone)) {
        this.$notify({message: this.$t("message.holding.numberMsg"),duration: 2500,showClose:false,customClass:'notifyClass'});
        return;
      }else  if (isStringEmpty(this.hotData.deliveryArea)) {
        this.$notify({message: this.$t("message.holding.areaMsg"),duration: 2500,showClose:false,customClass:'notifyClass'});
        return;
      }else  if (isStringEmpty(this.hotData.deliveryAmount)) {
        this.$notify({message: this.$t("message.holding.buyAmountMsg"),duration: 2500,showClose:false,customClass:'notifyClass'});
        return;
      }
      try {
        const that = this;
        this.$loading.showLoading();
        /*const dict = {address:this.walletAddress,tokenID:this.$route.query.item,count:this.hotData.deliveryAmount, receiver:this.hotData.deliveryName,
          number:this.hotData.deliveryPhone,areaNum:this.hotData.phoneAearNum,areDesc:this.hotData.deliveryArea,remarks: this.hotData.deliveryRemark,payType: this.payWayIndex}*/
        const dict = {address: this.walletAddress, tokenID: this.$route.query.item, sellAddress: this.detailData.owner, usdtValue: parseNumber(this.detailData.usdtPrice, 18),
          count: this.hotData.deliveryAmount, receiver: this.hotData.deliveryName, number: this.hotData.deliveryPhone, areaNum: this.hotData.phoneAearNum, areDesc: this.hotData.deliveryArea,
          remarks: this.hotData.deliveryRemark, payType: this.payWayIndex}
        const result =  await this.$decentralized.buyOrder(dict, this.connectWalletType);
        if(result) {
          that.$loading.hiddenLoading();
          that.hanleClickClosehotMaks();
          that.showPaySuccessMaks = true;
        }
      } catch (error) {
        this.$loading.hiddenLoading();
        this.$notify({message: error.message,duration: 2500,showClose:false,customClass:'notifyClass'});
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
    // 确定跳转到个人实验室
    handleClickGotoLab() {
      this.showPaySuccessMaks = false;
      this.$eventBus.$emit("buyNFTSuccessJump");
    },
    // 复制
    handleClickCopy() {
      let copyText = 'aladdinmeta@gmail.com';
      // navigator clipboard 需要https等安全上下文
      if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard 向剪贴板写文本
        navigator.clipboard.writeText(copyText);
        this.$notify({message: this.$t("message.alertMsg.copySuccess"),duration: 3000,showClose:false,customClass:'notifyClass'});
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
        this.$notify({message: this.$t("message.alertMsg.copySuccess"),duration: 3000,showClose:false,customClass:'notifyClass'});
        document.body.removeChild(textArea);
      }
    },
    // 开启定时器
   openTimer(){
      const that = this;
      this.closeTimer();
      this.countdTimer = setInterval(() => {
        that.$decentralized.getAladPrice(that.detailData.usdtPrice,(result) => {
          that.buyNeedAladPrice = result;
          console.log(`${that.detailData.usdtPrice}USDT需要${result}ALAD购买`);
        });
      }, 2000);
    },
    // 关闭定时器
    closeTimer(){
      if(this.countdTimer){
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
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-top: 0.1px;
  box-sizing: border-box;
  background-color: #202136;
  .n_top {
    display: flex;
    justify-content: space-between;
    width: 1145px;
    margin: 80px auto 0;
    .n_t_left {
      flex:none;
      width: 580px;
      height: 580px;
      position: relative;
      box-sizing: border-box;
      border-radius: 10px;
      border: solid 1px #707070;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
      .mc_c_art {
        position: absolute;
        top: 20px;
        left: 15px;
        width: 60px;
        height: 60px;
      }
    }
    .n_t_right {
      width: 540px;
      .n_t_r_name {
        line-height: 32px;
        font-size: 24px;
        word-break: normal;
        font-weight: 500;
        text-align: left;
        font-stretch: normal;
        font-style: normal;
        user-select: none;
        font-family: "PingFang SC",sans-serif;
        color: var(--white);
      }
      .n_t_r_wrapper {
        overflow: hidden;
        margin-top: 20px;
        padding: 0.1px 30px 0;
        width: 544px;
        //height: 500px;
        border-radius: 10px;
        background-color: #343650;
        .n_w_top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 30px;
          .n_t_r_info {
            display: flex;
            align-items: center;
            .n_t_wrapper {
              position: relative;
              width: 50px;
              height: 50px;
              cursor: pointer;
              img {
                width: 100%;
                height: 100%;
                border-radius: 25px;
              }
              .n_t_level {
                position: absolute;
                bottom: 0;
                right: 0;
                width: 16px;
                height: 16px;
                img {
                  width: 100%;
                  height: 100%;
                }
              }
            }
            span {
              margin-left: 12px;
              line-height: 46px;
              font-size: 16px;
              font-weight: 600;
              font-stretch: normal;
              font-style: normal;
              user-select: none;
              font-family: "PingFang SC",sans-serif;
              color: var(--white);
            }
          }
          .n_t_r_like {
            display: flex;
            align-items: center;
            user-select: none;
            cursor: pointer;
            img {
              width: 22px;
              height: 22px;
              margin-left: 10px;
            }
            span {
              line-height: 22px;
              font-size: 16px;
              word-break: normal;
              font-family: "PingFang SC",sans-serif;
              font-weight: bold;
              font-stretch: normal;
              font-style: normal;
              user-select: none;
              color: var(--white);
            }
          }
        }
        .n_w_line {
          margin-top: 20px;
          height: 1px;
          background-color: #202136;
        }
        .n_w_infomation {
          margin-top: 20px;
          line-height: 22px;
          font-size: 16px;
          font-family: "PingFang SC",sans-serif;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          user-select: none;
          text-align: left;
          color: #9b63ed;
        }
        .n_w_desc {
          overflow-y: auto;
          margin-top: 10px;
          height: 160px;
          font-size: 14px;
          line-height: 25px;
          word-break: break-all;
          font-family: "PingFang SC",sans-serif;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          user-select: none;
          text-align: left;
          color: var(--white);
        }
        .n_w_mainPhoto {
          display: flex;
          align-items: center;
          margin: 8px auto 0;
          div {
            width: 50px;
            height: 50px;
            margin-left: 10px;
            van-image {
              width: 100%;
              height:100%;
            }
            &:first-child {
              margin-left: 0;
            }
          }
        }
        .n_t_r_buy {
          margin-top: 30px;
          padding-bottom: 30px;
          .n_t_r_b_price1 {
            width: 290px;
            height: 50px;
            line-height: 50px;
            font-size: 16px;
            font-weight: 600;
            border-radius: 10px;
            cursor: pointer;
            user-select: none;
            font-family: "PingFang SC",sans-serif;
            font-stretch: normal;
            font-style: normal;
            border: solid 1px #9b63ed;
            background-color: #343650;
            color: #9b63ed;
          }
        }
      }
    }
  }
  .n_info {
    margin: 30px auto 0;
    padding: 0 22px;
    width: 1145px;
    height: 60px;
    user-select: none;
    cursor: pointer;
    border-radius: 6px;
    border: solid 1px #4f5776;
    background-color: #343650;
    .n_info_top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 60px;
      .n_i_left {
        display: flex;
        align-items: center;
        img {
          width: 34px;
          height: 34px;
        }
        span {
          margin-left: 10px;
          line-height: 22px;
          font-size: 16px;
          font-family: "PingFang SC",sans-serif;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          user-select: none;
          text-align: left;
          color: #ffff;
        }
      }
      .n_i_right img {
        width: 34px;
        height: 34px;
      }
    }
    .n_w_line {
      height: 1px;
      background-color: #202136;
    }
    .m_c_item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 30px auto 0;
      width: 1050px;
      height: 40px;
      .m_c_contnet {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 290px;
        height: 100%;
        img {
          width: 24px;
          height: 24px;
        }
        div {
          padding: 0 20px;
          width: 240px;
          height:40px;
          border-radius: 6px;
          line-height: 40px;
          font-size: 16px;
          font-family: "PingFang SC",sans-serif;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          user-select: none;
          text-align: left;
          color: #ffff;
          border: solid 1px #5b5c83;
          background-color: #414367;
        }
      }
    }
  }
  .n_info_wrapper {
    height: 213px;
  }
  .n_info1 {
    margin: 30px auto 60px;
    padding: 0 22px;
    width: 1145px;
    height: 60px;
    user-select: none;
    cursor: pointer;
    border-radius: 6px;
    border: solid 1px #4f5776;
    background-color: #343650;
    .n_info_top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 60px;
      .n_i_left {
        display: flex;
        align-items: center;
        img {
          width: 34px;
          height: 34px;
        }
        span {
          margin-left: 10px;
          line-height: 22px;
          font-size: 16px;
          font-family: "PingFang SC",sans-serif;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          user-select: none;
          text-align: left;
          color: #ffff;
        }
      }
      .n_i_right img {
        width: 34px;
        height: 34px;
      }
    }
    .n_w_line {
      height: 1px;
      background-color: #202136;
    }
    .n_w_item {
      height: 1185px;
      overflow-y: auto;
      .van-image {
        width: 750px;
      }
    }
  }
  .n_info_wrapper1 {
    height: 1246px;
  }
  .w_footer {
    margin-top: auto;
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
      position:relative;
      width: 500px;
      height: 410px;
      border-radius: 20px;
      background-color: #2e2f48;
      .m_p_title {
        margin-top: 15px;
        line-height: 33px;
        font-size: 24px;
        font-family: "PingFang SC",sans-serif;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        color: var(--white);
      }
      .m_p_line {
        margin-top: 15px;
        width: 100%;
        height: 0;
        border: dashed 1px #707070;
      }
      .m_p_contain {
        display: flex;
        .m_p_c_left {
          padding-left: 40px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          .m_p_c_l_text {
            margin-top: 20px;
            line-height: 22px;
            font-size: 16px;
            font-weight: 500;
            text-align: left;
            font-family: "PingFang SC",sans-serif;
            font-stretch: normal;
            font-style: normal;
            color: var(--white);
          }
          .m_p_c_middle {
            margin-top: 30px;
            display: flex;
            align-items: center;
            img {
              width: 105px;
              height: 105px;
              border-radius: 8px;
            }
            .m_p_c_m_desc {
              div {
                margin-left: 20px;
                line-height: 26px;
                font-size: 16px;
                font-weight: 500;
                word-break: break-all;
                text-align: left;
                font-family: "PingFang SC",sans-serif;
                font-stretch: normal;
                font-style: normal;
                color: var(--white);
              }
            }
          }
        }
        .m_p_c_right {
          flex: 1;
          padding-right: 40px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          div {
            margin-top: 20px;
            line-height: 22px;
            font-size: 16px;
            font-weight: 500;
            text-align: right;
            font-family: "PingFang SC",sans-serif;
            font-stretch: normal;
            font-style: normal;
            color: var(--white);
          }
          .m_p_c_usdt {
            margin-top: 60px;
            align-self: flex-end;
            display: flex;
            align-items: center;
            span {
              line-height: 23px;
              font-size: 16px;
              font-weight: 500;
              text-align: right;
              font-family: Ubuntu, sans-serif;
              font-stretch: normal;
              font-style: normal;
              color: #994cf0;
            }
            img {
              margin-left: 10px;
              width: 26px;
              height: 26px;
            }
          }
        }
      }
      .m_p_line1 {
        margin-top: 15px;
        width: 100%;
        height: 0;
        border: dashed 1px #707070;
      }
      .m_p_Btn {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 40px auto 0;
        .n_t_r_b_price {
          margin: 0 auto;
          width: 290px;
          height: 50px;
          cursor: pointer;
          user-select: none;
          box-sizing: border-box;
          background-size: contain;
          background-repeat: no-repeat;
          background-image: url("../../../assets/marks/icon_m_pay.svg");
          .n_approve {
            line-height: 50px;
            font-size: 16px;
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
              width: 24px;
              height: 24px;
            }
            span {
              margin-left: 11px;
              line-height: 50px;
              font-size: 16px;
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
          width: 370px;
          height: 50px;
          .n_left {
            width: 180px;
            height: 50px;
            cursor: pointer;
            user-select: none;
            box-sizing: border-box;
            background-size: contain;
            background-repeat: no-repeat;
            background-image: url("../../../assets/marks/icon_m_pay1.svg");
            .n_approve {
              line-height: 50px;
              font-size: 16px;
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
                width: 24px;
                height: 24px;;
              }
              span {
                margin-left: 11px;
                line-height: 50px;
                font-size: 16px;
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
      .mask_close {
        width: 24px;
        height:  24px;
        top:  20px;
        right: 20px;
        position: absolute;
        cursor: pointer;
      }
    }
    .m_success {
      width: 500px;
      height: 366px;
      padding-top: 0.1px;
      border-radius: 20px;
      background-color: #2e2f48;
      .m_b_title {
        margin-top: 14px;
        line-height: 33px;
        font-size: 24px;
        font-family: "PingFang SC",sans-serif;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        color: #fff;
      }
      .m_b_line {
        margin-top: 15px;
        width: 100%;
        height: 0;
        border: dashed 1px #707070;
      }
      .m_b_icon {
        margin: 20px auto 0;
        width: 220px;
        height: 154px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .m_b_confirm {
        width:306px;
        height: 64px;
        margin: 40px auto 0;
        cursor: pointer;
        user-select: none;
        box-sizing: border-box;
        background-size: contain;
        background-repeat: no-repeat;
        background-image: url('../../../assets/marks/icon_check.png');
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          font-size: 16px;
          font-weight: 500;
          line-height: 64px;
          font-family: "PingFang SC", sans-serif;
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
      position:relative;
      width: 580px;
      padding: 25px 0;
      border-radius: 20px;
      background-color: #2e2f48;
      .m_d_icon {
        margin: 0 auto;
        width: 110px;
        height: 110px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .m_d_title {
        margin: 10px auto 0;
        line-height: 22px;
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        color: #fff;
        font-family: "PingFang SC",sans-serif;
      }
      .m_d_price {
        font-size: 18px;
        color: #fff;
      }
      .m_d_info {
        padding: 0 30px;
        .m_d_i_one {
          display: flex;
          justify-content: space-between;
          span {
            margin-top: 20px;
            width: 255px;
            line-height: 20px;
            font-size: 14px;
            font-weight: 500;
            text-align: left;
            font-stretch: normal;
            font-style: normal;
            font-family: Poppins,sans-serif;
            color: #fff;
          }
        }
        .m_d_i_two {
          margin-top: 4px;
          display: flex;
          justify-content: space-between;
          .m_d_i_item {
            width: 255px;
            height: 50px;
            border-radius: 6px;
            border: solid 1px #4f5776;
            background-color: #1b1b33;
            input {
              width: 80%;
              height: 100%;
              border: 0; // 去除未选中状态边框
              outline: none; // 去除选中状态边框
              font-size: 16px;
              font-family: Montserrat,sans-serif;
              font-weight: normal;
              box-sizing: border-box;
              background-color: transparent;
              color: var(--white);
            }
            input::-webkit-input-placeholder {
              color: #373752;
              font-size: 14px;
            }
            input:-moz-placeholder {
              /* FF 4-18 */
              color: #373752;
              font-size: 14px;
            }
            input::-moz-placeholder {
              /* FF 19+ */
              color: #373752;
              font-size: 14px;
            }
            input:-ms-input-placeholder {
              /* IE 10+ */
              color: #373752;
              font-size: 14px;
            }
            input:-webkit-autofill {
              transition: background-color 5000s ease-in-out 0s; //背景颜色
            }
          }
          .m_d_i_item1 {
            display: flex;
            align-items: center;
            div {
              margin-left: 10px;
              font-size: 15px;
              font-weight: 500;
              font-stretch: normal;
              font-style: normal;
              font-family: Poppins,sans-serif;
              user-select: none;
              cursor: pointer;
              color: var(--white);
              &:nth-child(3) {
                width: 1px;
                margin-left: 0;
                margin-right: 10px;
              }
            }
            .c_r_i_p_input {
              width: 50px;
              height: 100%;
              border: 0; // 去除未选中状态边框
              outline: none; // 去除选中状态边框
              font-size: 16px;
              font-family: Poppins,sans-serif;
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
        margin-top: 20px;
        padding: 0 30px;
        .m_d_a_title {
          line-height: 23px;
          font-size: 14px;
          font-weight: 500;
          text-align: left;
          font-stretch: normal;
          font-style: normal;
          color: #fff;
          font-family: Poppins,sans-serif;
        }
        .m_d_a_container {
          width: 100%;
          height: 90px;
          margin-top: 4px;
          border-radius: 6px;
          border: solid 1px #4f5776;
          background-color: #1b1b33;
          textarea {
            margin-top: 15px;
            width: 90%;
            height: 80%;
            border: 0; // 去除未选中状态边框
            resize:none;
            outline: none; // 去除选中状态边框
            font-size: 16px;
            font-family: Poppins,sans-serif;
            font-weight: normal;
            box-sizing: border-box;
            background-color: transparent;
            color: var(--white);
          }
          textarea::-webkit-input-placeholder {
            color: #373752;
            font-size: 14px;
          }
          textarea:-moz-placeholder {
            /* FF 4-18 */
            color: #373752;
            font-size: 14px;
          }
          textarea::-moz-placeholder {
            /* FF 19+ */
            color: #373752;
            font-size: 14px;
          }
          textarea:-ms-input-placeholder {
            /* IE 10+ */
            color: #373752;
            font-size: 14px;
          }
          textarea:-webkit-autofill {
            transition: background-color 5000s ease-in-out 0s; //背景颜色
          }
        }
      }
      .m_d_amount_wrap {
        margin-top: 20px;
        padding: 0 30px;
        .title {
          line-height: 20px;
          font-size: 14px;
          font-weight: 500;
          text-align: left;
          font-stretch: normal;
          font-style: normal;
          font-family: Poppins,sans-serif;
          color: #fff;
        }
        .wrap {
          display:  flex;
          justify-content: space-between;
          align-items:center;
          margin-top: 4px;
          padding: 0 30px;
          height: 50px;
          border-radius: 6px;
          border: solid 1px #4f5776;
          background-color: #1b1b33;
          input {
            flex: 1;
            //width: 90%;
            height: 100%;
            border: 0; // 去除未选中状态边框
            outline: none; // 去除选中状态边框
            font-size: 16px;
            font-family: Montserrat,sans-serif;
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
            font-size: 14px;
          }
          input:-moz-placeholder {
            /* FF 4-18 */
            color: #373752;
            font-size: 14px;
          }
          input::-moz-placeholder {
            /* FF 19+ */
            color: #373752;
            font-size: 14px;
          }
          input:-ms-input-placeholder {
            /* IE 10+ */
            color: #373752;
            font-size: 14px;
          }
          input:-webkit-autofill {
            transition: background-color 5000s ease-in-out 0s; //背景颜色
          }
          span {
            line-height: 23px;
            font-size: 16px;
            font-weight: normal;
            text-align: left;
            font-stretch: normal;
            font-style: normal;
            font-family: Poppins,sans-serif;
            color: #ff953f;
          }
        }
      }
      .m_d_remark {
        margin-top: 20px;
        padding: 0 30px;
        .title {
          line-height: normal;
          font-size: 14px;
          font-weight: 500;
          text-align: left;
          font-stretch: normal;
          font-style: normal;
          font-family: PingFangSC, sans-serif;
          color: #fff;
        }
        .wrap {
          display:  flex;
          justify-content: space-between;
          align-items:center;
          margin-top: 4px;
          padding: 0 30px;
          height: 50px;
          border-radius: 6px;
          border: solid 1px #4f5776;
          background-color: #1b1b33;
          input {
            flex: 1;
            //width: 90%;
            height: 100%;
            border: 0; // 去除未选中状态边框
            outline: none; // 去除选中状态边框
            font-size: 16px;
            font-family: Montserrat,sans-serif;
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
            font-size: 14px;
          }
          input:-moz-placeholder {
            /* FF 4-18 */
            color: #373752;
            font-size: 14px;
          }
          input::-moz-placeholder {
            /* FF 19+ */
            color: #373752;
            font-size: 14px;
          }
          input:-ms-input-placeholder {
            /* IE 10+ */
            color: #373752;
            font-size: 14px;
          }
          input:-webkit-autofill {
            transition: background-color 5000s ease-in-out 0s; //背景颜色
          }
        }
      }
      .m_d_line {
        height: 1px;
        margin-top: 24px;
        background-color: var(--bgc29);
      }
      .m_p_Btn {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 40px auto 0;
        .n_t_r_b_price {
          margin: 0 auto;
          width: 290px;
          height: 50px;
          cursor: pointer;
          user-select: none;
          box-sizing: border-box;
          background-size: contain;
          background-repeat: no-repeat;
          background-image: url("../../../assets/marks/icon_m_pay.svg");
          .n_approve {
            line-height: 50px;
            font-size: 16px;
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
              width: 24px;
              height: 24px;
            }
            span {
              margin-left: 11px;
              line-height: 50px;
              font-size: 16px;
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
          width: 370px;
          height: 50px;
          .n_left {
            width: 180px;
            height: 50px;
            cursor: pointer;
            user-select: none;
            box-sizing: border-box;
            background-size: contain;
            background-repeat: no-repeat;
            background-image: url("../../../assets/marks/icon_m_pay1.svg");
            .n_approve {
              line-height: 50px;
              font-size: 16px;
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
                width: 24px;
                height: 24px;;
              }
              span {
                margin-left: 11px;
                line-height: 50px;
                font-size: 16px;
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
      .mask_close {
        width: 24px;
        height:  24px;
        top:  20px;
        right: 20px;
        position: absolute;
        cursor: pointer;
      }
    }
  }
}

</style>
