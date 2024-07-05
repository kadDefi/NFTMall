<template>
  <div class="casting">
    <div v-if="!isSpecialSeller" class="ordinaryCast">
      <div class="c_left">
        <div class="c_l_title">{{ $t("message.casting.nftTitle") }}</div>
        <div class="c_l_title c_l_desc3 c_l_desc4">{{ $t("message.casting.Type") }}</div>
        <div class="c_l_castType">
          <div class="c_l_c_left" @click="handleClickCastNFTType(1)">
            <img :src="require(`../../../assets/laboras/icon_cast_${isCastingArt ? 'normal' : 'select'}.svg`)" alt="">
            <span :class="isCastingArt ? '' : 'c_l_c_span'">{{ $t("message.mallHeader.conventionalNFT") }}</span>
          </div>
          <div class="c_l_c_left" @click="handleClickCastNFTType(2)">
            <img :src="require(`../../../assets/laboras/icon_cast_${isCastingArt ? 'select' : 'normal'}.svg`)" alt="">
            <span :class="isCastingArt ? 'c_l_c_span' : ''">{{ $t("message.mallHeader.artworkNFT") }}</span>
          </div>
        </div>
        <div class="c_l_title c_l_desc c_l_desc3">{{ $t("message.casting.uploadFile") }}</div>
        <div class="c_l_upload">
          <el-upload id="file-uploader" ref="upload" action="''" name="file" :accept="'image/*'" :limit="1" :auto-upload="false" :show-file-list="false" :on-change ="uploadImgFileChange"  drag>
            <div v-if="!isUploadSuccess" class="c_l_u_nomal">
              <span>· Length: width  =  1:1</span>
              <span>JPG, PNG, GIF, SVG, WEBM 100mb.</span>
              <img src="../../../assets/laboras/icon_l_photo.svg" alt="logo">
              <span>{{ $t("message.casting.uploadDesc") }}</span>
              <span>{{ $t("message.casting.uploadDesc1") }} </span>
            </div>
            <div v-else class="c_l_u_selected" @click.stop="hanldeRemoveFile"><img :src="uploadPhotoUrl" alt="logo"></div>
          </el-upload>
          <img v-show="isShowUploadGif" class="c_l_gif" src="../../../assets/universal/icon_upload.gif" alt="logo">
        </div>
        <div class="c_l_desc c_l_desc1">
          <span>{{ $t("message.casting.classification") }}</span>
          <span>*</span>
        </div>
        <div class="c_l_sort">
          <div class="m_d_s_item" @click="handleClickClassification(1)">
            <input class="c_l_i_input" type="text" :model="isEnglish ? nftFItem.typeen : nftFItem.typech" :placeholder="placeHolderMap.nftFCategory" disabled>
            <img src="../../../assets/laboras/icon_l_down.svg" alt="logo">
            <div v-show="showFristDropBox" class="m_d_s_drownBox">
              <div class="m_d_s_d_text" v-for="(item,index) in fristClassificationList" :key="index" @click.stop="handleCilckSelectClassification(1,item)">{{ isEnglish ? item.typeen : item.typech }}</div>
            </div>
          </div>
          <div class="m_d_s_item" @click="handleClickClassification(2)">
            <input class="c_l_i_input" type="text" :model="isEnglish ? nftSItem.typeen : nftSItem.typech" :placeholder="placeHolderMap.nftSCategory" disabled>
            <img src="../../../assets/laboras/icon_l_down.svg" alt="logo">
            <div v-show="showSecondDropBox" class="m_d_s_drownBox">
              <div class="m_d_s_d_text" v-for="(item,index) in secondClassificationList" :key="index" @click.stop="handleCilckSelectClassification(2,item)">{{ isEnglish ? item.typeen : item.typech }}</div>
            </div>
          </div>
        </div>
        <div class="c_l_desc2 c_l_desc1">
          <span class="c_l_desc2_span">{{ $t("message.casting.price") }}</span>
        </div>
        <div class="c_l_price_input">
          <div class="c_l_price_input_usdt">
            <img src="../../../assets/newPhones/nCasting/iocn_usdt.png" alt="usdt">
            <span>USDT</span>
          </div>
          <div class="c_l_input">
            <input type="number" v-model="nftPrice" :placeholder="placeHolderMap.shopPrice">
          </div>
        </div>
        <div class="c_l_pay">
          <div class="c_l_text">{{ $t('message.casting.payWay') }}</div>
          <div class="c_l_wrapper">
            <div class="c_l_left" @click="handleClickPayWay(1)">
              <img src="../../../assets/newPhones/nCasting/icon_c_alad.svg" alt="">
              <span>ALAD</span>
              <img :src="require(`../../../assets/newPhones/nCasting/icon_round_${aladPayWay ? '2' : '1'}.svg`)" alt="">
            </div>
            <div class="c_l_left" @click="handleClickPayWay(2)">
              <img src="../../../assets/newPhones/nCasting/icon_c_busd.svg" alt="">
              <span>BUSD</span>
              <img :src="require(`../../../assets/newPhones/nCasting/icon_round_${busdPayWay ? '2' : '1'}.svg`)" alt="">
            </div>
          </div>
        </div>
        <div class="c_l_desc">
          <span>{{ $t("message.casting.name") }}</span>
          <span>*</span>
        </div>
        <div class="c_l_input"><input type="text" v-model="nftName" :placeholder="placeHolderMap.nftName"></div>
        <div class="c_l_desc c_l_desc1">
          <span>{{ $t("message.casting.description") }}</span>
          <span>*</span>
        </div>
        <div class="c_l_description"><textarea type="text" v-model="nftDescripition" :placeholder="placeHolderMap.nftDesc"></textarea></div>
      </div>
      <div class="c_right">
        <div :class="isCastingArt ? 'c_r_css' : ''" class="c_r_title">{{ $t("message.casting.contactInformation") }}</div>
        <div class="c_r_item c_r_item_first">
          <div class="c_r_i_left">
            <img :src="require(`../../../assets/laboras/icon_l_${isCastingArt ? 'phone1' : 'phone'}.svg`)" alt="logo">
            <span :class="isCastingArt ? 'c_r_css' : ''">{{ $t("message.casting.phone") }}</span>
            <span :class="isCastingArt ? 'c_r_css' : ''" class="c_r_i_l_prompt">*</span>
          </div>
          <div class="c_r_i_right c_r_i_phone">
            <div :class="isCastingArt ? 'c_r_css' : ''">+</div>
            <input :class="isCastingArt ? 'c_r_css' : ''" class="c_r_i_p_input" type="number" v-model="phoneAearNum" :disabled="isCastingArt">
            <div :class="isCastingArt ? 'c_r_css' : ''">|</div>
            <input type="text" v-model="phoneNum" :placeholder="placeHolderMap.nftPhone" :disabled="isCastingArt">
          </div>
        </div>
        <div :class="isCastingArt ? 'c_r_css' : ''" class="c_r_prompt ">* {{ $t("message.casting.uploadOtherContact") }}</div>
        <div class="c_r_item">
          <div class="c_r_i_left">
            <img :src="require(`../../../assets/laboras/icon_l_${isCastingArt ? 'qq1' : 'qq'}.svg`)" alt="logo">
            <span :class="isCastingArt ? 'c_r_css' : ''">{{ $t("message.casting.LINK") }}</span>
          </div>
          <div :class="isCastingArt ? 'c_r_css' : ''" class="c_r_i_right"><input type="text" v-model="qqNum" :placeholder="placeHolderMap.nftLink" :disabled="isCastingArt"></div>
        </div>
        <div class="c_r_item">
          <div class="c_r_i_left">
            <img :src="require(`../../../assets/laboras/icon_l_${isCastingArt ? 'wx1' : 'wx'}.svg`)" alt="logo">
            <span :class="isCastingArt ? 'c_r_css' : ''">{{ $t("message.casting.WeChat") }}</span>
          </div>
          <div :class="isCastingArt ? 'c_r_css' : ''" class="c_r_i_right"><input type="text" v-model="weChatNum" :placeholder="placeHolderMap.nftWeChat" :disabled="isCastingArt"></div>
        </div>
        <div class="c_r_item">
          <div class="c_r_i_left">
            <img :src="require(`../../../assets/laboras/icon_l_${isCastingArt ? 'tg1' : 'tg'}.svg`)" alt="logo">
            <span :class="isCastingArt ? 'c_r_css' : ''">{{ $t("message.casting.Telegram") }}</span>
          </div>
          <div :class="isCastingArt ? 'c_r_css' : ''" class="c_r_i_right"><input type="text" v-model="telegramNum" :placeholder="placeHolderMap.nftTelegram" :disabled="isCastingArt"></div>
        </div>
        <div class="c_r_item">
          <div class="c_r_i_left">
            <img :src="require(`../../../assets/laboras/icon_l_${isCastingArt ? 'sky1' : 'sky'}.svg`)" alt="logo">
            <span :class="isCastingArt ? 'c_r_css' : ''">{{ $t("message.casting.Skype") }}</span>
          </div>
          <div :class="isCastingArt ? 'c_r_css' : ''" class="c_r_i_right"><input type="text" v-model="skypeNum" :placeholder="placeHolderMap.nftSkype" :disabled="isCastingArt"></div>
        </div>
        <div class="c_r_item">
          <div class="c_r_i_left">
            <img :src="require(`../../../assets/laboras/icon_l_${isCastingArt ? 'bbm1' : 'bbm'}.svg`)" alt="logo">
            <span :class="isCastingArt ? 'c_r_css' : ''">{{ $t("message.casting.BBM") }}</span>
          </div>
          <div :class="isCastingArt ? 'c_r_css' : ''" class="c_r_i_right"><input type="text" v-model="bbmNum" :placeholder="placeHolderMap.nftBBM" :disabled="isCastingArt"></div>
        </div>
        <!--<div class="c_r_castPrompt">{{ $t("message.casting.CastPrompt") }}</div>-->
        <div class="c_r_cast" @click="handleClickCastNFT">{{ castBtnText }}</div>
      </div>
    </div>
    <div v-else class="shopperCast">
      <div class="c_l_title">{{ $t("message.casting.uploadFile") }}</div>
      <div class="c_upload_tips">{{ $t('message.casting.supportedFileTypes') }}</div>
      <div class="c_l_upload">
        <van-uploader v-model="fileList" multiple :max-count="5" :after-read="afterRead" :before-delete="beforeDelete">
          <van-image :src="require('../../../assets/newPhones/nCasting/icon_upload_s.png')"></van-image>
        </van-uploader>
      </div>
      <div class="c_l_upload_tip">{{ $t('message.casting.uploadTip1') }}</div>
      <div class="c_l_wrapper">
        <div class="c_l_w_left">
          <div class="c_l_w_l_name">{{ $t("message.casting.name") }}</div>
          <div class="c_l_input"><input type="text" v-model="nftName" :placeholder="placeHolderMap.shopName"></div>
        </div>
        <div class="c_l_w_right">
          <div class="c_l_w_l_name">{{ $t("message.casting.price") }}</div>
          <div class="c_l_price_input">
            <div class="c_l_price_input_usdt">
              <img src="../../../assets/newPhones/nCasting/iocn_usdt.png" alt="usdt">
              <span>USDT</span>
            </div>
            <div class="c_l_input">
              <input type="number" v-model="nftPrice" :placeholder="placeHolderMap.shopPrice">
            </div>
          </div>
        </div>
      </div>
      <div class="c_l_pay">
        <div class="c_l_text">{{ $t('message.casting.payWay') }}</div>
        <div class="c_l_wrapper">
          <div class="c_l_left" @click="handleClickPayWay(1)">
            <img src="../../../assets/newPhones/nCasting/icon_c_alad.svg" alt="">
            <span>ALAD</span>
            <img :src="require(`../../../assets/newPhones/nCasting/icon_round_${aladPayWay ? '2' : '1'}.svg`)" alt="">
          </div>
          <div class="c_l_left" @click="handleClickPayWay(2)">
            <img src="../../../assets/newPhones/nCasting/icon_c_busd.svg" alt="">
            <span>BUSD</span>
            <img :src="require(`../../../assets/newPhones/nCasting/icon_round_${busdPayWay ? '2' : '1'}.svg`)" alt="">
          </div>
        </div>
      </div>
      <div class="c_l_description">
        <div class="c_l_desc">{{ $t("message.casting.description") }}</div>
        <div class="c_l_description"><textarea type="text" v-model="nftDescripition" :placeholder="placeHolderMap.shopDesc"></textarea></div>
      </div>
      <div class="c_l_upload_wrapper">
        <div class="c_l_text">{{ $t('message.casting.detailsMap') }}</div>
        <div class="c_l_upload_main">
          <van-uploader v-model="mainFileList" multiple :max-count="9" :after-read="afterReadMain" :before-delete="beforeDeleteMain">
            <van-image :src="require('../../../assets/newPhones/nCasting/icon_upload_x.png')"></van-image>
          </van-uploader>
        </div>
      </div>
      <div class="c_l_upload_tip">{{ $t('message.casting.uploadTip2') }}</div>
      <div class="c_l_contact">
        <div class="c_l_text">{{ $t('message.casting.contactInformation') }}</div>
        <div class="c_l_c_wrapper">
          <div class="c_l_c_top">
            <div class="c_r_item">
              <div class="c_r_i_left">
                <img :src="require(`../../../assets/laboras/icon_l_phone.svg`)" alt="logo">
                <span>{{ $t("message.casting.phone") }}</span>
              </div>
              <div class="c_r_i_right c_r_i_phone">
                <div>+</div>
                <input class="c_r_i_p_input" type="number" v-model="phoneAearNum">
                <div>|</div>
                <input type="text" v-model="phoneNum" :placeholder="placeHolderMap.nftPhone">
              </div>
            </div>
            <div class="c_r_item">
              <div class="c_r_i_left">
                <img :src="require(`../../../assets/laboras/icon_l_qq.svg`)" alt="logo">
                <span>{{ $t("message.casting.LINK") }}</span>
              </div>
              <div class="c_r_i_right"><input type="text" v-model="qqNum" :placeholder="placeHolderMap.nftLink"></div>
            </div>
            <div class="c_r_item">
              <div class="c_r_i_left">
                <img :src="require(`../../../assets/laboras/icon_l_wx.svg`)" alt="logo">
                <span>{{ $t("message.casting.WeChat") }}</span>
              </div>
              <div class="c_r_i_right"><input type="text" v-model="weChatNum" :placeholder="placeHolderMap.nftWeChat"></div>
            </div>
          </div>
          <div class="c_l_c_top c_l_c_bottom">
            <div class="c_r_item">
              <div class="c_r_i_left">
                <img :src="require(`../../../assets/laboras/icon_l_tg.svg`)" alt="logo">
                <span>{{ $t("message.casting.Telegram") }}</span>
              </div>
              <div class="c_r_i_right"><input type="text" v-model="telegramNum" :placeholder="placeHolderMap.nftTelegram"></div>
            </div>
            <div class="c_r_item">
              <div class="c_r_i_left">
                <img :src="require(`../../../assets/laboras/icon_l_sky.svg`)" alt="logo">
                <span>{{ $t("message.casting.Skype") }}</span>
              </div>
              <div class="c_r_i_right"><input type="text" v-model="skypeNum" :placeholder="placeHolderMap.nftSkype"></div>
            </div>
            <div class="c_r_item">
              <div class="c_r_i_left">
                <img :src="require(`../../../assets/laboras/icon_l_bbm.svg`)" alt="logo">
                <span>{{ $t("message.casting.BBM") }}</span>
              </div>
              <div class="c_r_i_right"><input type="text" v-model="bbmNum" :placeholder="placeHolderMap.nftBBM"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="c_r_cast" @click="createShop">{{ castBtnText }}</div>
    </div>
    <!-- 剪裁功能 -->
    <div class="mask" v-show="isShowTailor" @touchmove.prevent @mousewheel.prevent>
      <div class="tailor">
        <div class="t_body">
          <vueCropper ref="cropper"
          :img="option.img"
          :outputSize="option.size"
          :outputType="option.outputType"
          :info="true"
          :full="option.full"
          :canMove="option.canMove"
          :canMoveBox="option.canMoveBox"
          :original="option.original"
          :autoCrop="option.autoCrop"
          :autoCropWidth="option.autoCropWidth"
					:autoCropHeight="option.autoCropHeight"
          :fixed="option.fixed"
          :fixedNumber="option.fixedNumber"
          :centerBox="option.centerBox"
          :infoTrue="option.infoTrue"
          :fixedBox="option.fixedBox">
          </vueCropper>
        </div>
        <div class="mask_save" @click="handleClickSaveTailor">{{ $t("message.casting.updateImge") }}</div>
        <img class="mask_close" src="../../../assets/universal/icon_qb_close.svg" alt="logo" @click="handlClickColseTailor">
      </div>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { isObjectEmpty, isStringEmpty } from '@/utils/validate';
import {getCastingNFTClassification, getCustomerInfoData, getSpecialSeller, publishOrder} from '@/api/mark';
import { MaxUint256 } from '@ethersproject/constants';
import { transactionHash } from '@/utils/queryHash'
import { dataURLtoFile} from '@/utils/utils'
import {parseNumber} from "@/decentralizedApi/param";
const settingConfig = require('../../../settings.js');

export default {
  name: "casting",
  data() {
    return {
      isEnglish:false,
      isShowTailor:false,
      castBtnText:'', // 铸造按钮文本
      ipfsClient:null, // IPFS对象
      isCastingArt:false, // 选择铸造的类型(常规、艺术)
      isSpecialSeller: false,// 判断是否是店铺类型
      showFristDropBox:false, // 显示第一分类下拉框
      showSecondDropBox:false, // 显示第二分类下拉框
      nftFItem:'', // 第一分类
      nftSItem:'', // 第二分类
      fristClassificationList:[],// 一级分类列表
      secondSourceDataList:[],// 全部二级分类数据
      secondClassificationList:[],// 二级分类列表
      isShowUploadGif:false, // 是否显示上传的gif
      isUploadSuccess:false, // 是否上传图片成功
      uploadPhotoUrl:'', // 上传成功后的url
      nftName:'', // NFT名称
      nftDescripition:'', // NFT描述
      nftPrice:'',// NFT价格
      phoneNum:'',// 创建者手机号
      phoneAearNum:'86',// 手机区号
      qqNum:'', // 创建者qq
      weChatNum:'',// 创建者微信
      telegramNum:'', // 创建者tg
      skypeNum:'', // 创建者sky
      bbmNum:'', // 创建者bb
      // 裁剪组件的基础配置option
      option: {
        img: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 1, // 裁剪生成图片的质量
        outputType: 'jpeg', // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 500, // 默认生成截图框宽度
        autoCropHeight: 500, // 默认生成截图框高度
        fixedBox: true, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [1, 1], // 截图框的宽高比例
        full: true, // 是否输出原图比例的截图
        canMoveBox: false, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
      // placeHold
      placeHolderMap:{nftName:this.$t("message.casting.nftName"),
        nftDesc:this.$t("message.casting.nftDesc"),
        nftPrice:this.$t("message.casting.nftPrice"),
        nftFCategory:this.$t("message.casting.nftFCategory"),
        nftSCategory:this.$t("message.casting.nftSCategory"),
        nftPhone:this.$t("message.casting.nftPhone"),
        nftLink:this.$t("message.casting.nftLink"),
        nftWeChat:this.$t("message.casting.nftWeChat"),
        nftSkype:this.$t("message.casting.nftSkype"),
        nftBBM:this.$t("message.casting.nftBBM"),
        nftTelegram:this.$t("message.casting.nftTelegram"),
        shopName: this.$t("message.casting.shopDesc1"),
        shopPrice: this.$t("message.casting.shopDesc2"),
        shopDesc: this.$t("message.casting.shopDesc3"),
      },
      aladPayWay: true, // 支付方式 false 是未选中 true 是选中
      busdPayWay: false, // 支付方式 false 是未选中 true 是选中
      uploadHeaderUrl: [], // 上传的头部图片hash列表
      uploadMainUrl: [], // 上传的主图图片hash列表
      fileList: [],
      mainFileList: [],
    };
  },
  created() {
    // 中英文
    this.isEnglish = window.localStorage.getItem("lang") !== "zh";
    // 获取是否是商店地址
    let shopStatus = sessionStorage.getItem('shopStatus');
    console.log(`本地存储的${parseInt(shopStatus) === 1 ? '是' : '不是'}店铺地址`);
    if (shopStatus !== null) {
      this.isSpecialSeller = parseInt(shopStatus) === 1;
    }
    // 创建IPF客户端对象
    const ipfsNode = settingConfig.ipfsNode;
    this.ipfsClient = ipfsHttpClient(ipfsNode);
    this.changeBtnStatuTextMsg();
    this.getSpecialSeller()
    this.getCustomerInfoData();
    //this.getCastingNFTClassification();
  },
  mounted() {
    if (this.$refs.upload) {
      this.$refs.upload.clearFiles();
    }
  },
  destroyed() {

  },
  // 计算属性
  computed: {
    ...mapGetters(['isConnectWallet','walletAddress','isBindSuperAddress','connectWalletType']),
  },
  // 监听属性改变
  watch:{
    isConnectWallet(val,oval) {
      this.changeBtnStatuTextMsg();
      if (val) {
        this.getSpecialSeller()
        this.getCustomerInfoData();
        //this.getCastingNFTClassification();
      }else {
        this.clearControlData();
      }
    },
    '$i18n.locale'(nval,oval) {
       this.isEnglish = nval !== 'zh';
       this.placeHolderMap = { nftName:this.$t("message.casting.nftName"), nftDesc:this.$t("message.casting.nftDesc"),nftPrice:this.$t("message.casting.nftPrice"),
         nftFCategory:this.$t("message.casting.nftFCategory"),nftSCategory:this.$t("message.casting.nftSCategory"),nftPhone:this.$t("message.casting.nftPhone"),nftLink:this.$t("message.casting.nftLink"),
         nftWeChat:this.$t("message.casting.nftWeChat"),nftSkype:this.$t("message.casting.nftSkype"),nftBBM:this.$t("message.casting.nftBBM"),nftTelegram:this.$t("message.casting.nftTelegram"),
         shopName: this.$t("message.casting.shopDesc1"), shopPrice: this.$t("message.casting.shopDesc2"), shopDesc: this.$t("message.casting.shopDesc3"),};
       this.changeBtnStatuTextMsg();
       console.log('监听到语言的切换');
    },
  },
  // 方法
  methods: {
    // 选择支付方式
    handleClickPayWay(index) {
      if (index === 1) {
        this.aladPayWay = !this.aladPayWay;
      }else  if (index === 2) {
        this.busdPayWay = !this.busdPayWay;
      }
    },
    // 选择铸造类型
    handleClickCastNFTType(index) {
      if (index === 1 && this.isCastingArt) {
        this.isCastingArt = false;
        this.clearControlData();
        this.getCastingNFTClassification();
      }else if (index === 2 && !this.isCastingArt)  {
        this.isCastingArt = true;
        this.clearControlData();
        this.getCastingNFTClassification();
      }
    },
    // 关闭剪裁
    handlClickColseTailor() {
      this.hanldeRemoveFile();
      this.isShowTailor = false;
    },
    // 裁剪图片
    handleClickSaveTailor() {
      // 确定后将剪裁的图片进行上次
      this.$refs.cropper.getCropData( async (data)  => {
        // 获取上传文件
        const file = dataURLtoFile(data,'cropperNmae');
        try {
          const that = this;
          // 开启加载视图
          that.isShowUploadGif = true;
          that.isShowTailor = false;
          // 开始上传IPFS
          const added = await that.ipfsClient.add(file,{ progress: (prog) => console.log(`received: ${prog}`)});
          that.isUploadSuccess = true;
          that.uploadPhotoUrl = `${settingConfig.ipfsNFTUrl + added.path}`;
          console.log('==added.path==',added.path);
          setTimeout(() => {
            that.isShowUploadGif = false;
          }, 1000);
          console.log(' this.uploadPhotoUrl =',this.uploadPhotoUrl);
        } catch (error) {
          this.isShowUploadGif = false;
          this.hanldeRemoveFile();
          this.$notify({message: error,duration: 2500,showClose:false,customClass:'notifyClass'});
          console.log('Error uploading file: ', error)
        }
        console.log('data =',data);
      });
    },
    // 获取用户名称
    async getCustomerInfoData() {
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
      } else {
        this.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
      }
    },
    // 获取是否是店铺地址
    async getSpecialSeller() {
      if (!this.isConnectWallet) {
        return;
      }
      const dict = {};
      dict['address'] = this.walletAddress;
      const that = this;
      const result = await getSpecialSeller(dict);
      if (result.status === 200) { // 1 特殊地址  0 非特殊地址
        that.isSpecialSeller = result.data === 1;
        if (!that.isSpecialSeller) {
          that.getCastingNFTClassification();
        }
        // 缓存起来是普通地址还是店铺地址
        sessionStorage.setItem('shopStatus', result.data);
        console.log(`当前地址${result.data === 1 ? '是' : '不是'}店铺NFT`)
      } else {
        this.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
      }
    },
    // 获取一、二级分类列表
    async getCastingNFTClassification() {
      // type 0 => 一级分类  1 => 二级分类
      const dict = {};
      dict['type'] = this.isCastingArt ? 2 : 1;
      dict['address'] = this.walletAddress;
      const result = await getCastingNFTClassification(dict);
      if (result.status === 200) {
         this.fristClassificationList = result.data.mainClassify;
         this.secondSourceDataList = result.data.subClassify;
         console.log(`获取${this.isCastingArt ? '艺术类' : '常规类'}第一级全部分类列表=`,result.data.mainClassify);
         console.log(`获取${this.isCastingArt ? '艺术类' : '常规类'}第二级全部分类列表=`,result.data.subClassify);
      }else {
        this.$notify({message: result.data,duration: 2500,showClose:false,customClass:'notifyClass'});
      }
    },
    // 开启选择分类下拉框
    handleClickClassification(index) {
      if(index === 1) {
        this.showFristDropBox = ! this.showFristDropBox;
      }else if(index === 2) {
        if (isObjectEmpty(this.nftFItem)) {
           this.$notify({message: this.$t("message.casting.selectedNFTCategoryMsg"),duration: 2500,showClose:false,customClass:'notifyClass'});
           return;
        }
        this.showSecondDropBox = ! this.showSecondDropBox;
      }
      const that = this;
      const showMore = document.addEventListener("click", (e) => {
        if (e.target.className !== "m_d_s_item" && e.target.className !== "c_l_i_input" && e.target.className !== "m_d_s_drownBox") {
          if(index === 1) {
            that.showFristDropBox = false;
          }else if(index === 2) {
            that.showSecondDropBox = false;
          }
          document.removeEventListener("click", showMore, false);
        }
      });
      document.addEventListener("click", showMore, false);
    },
    // 选择具体分类
    handleCilckSelectClassification(index,item) {
      if (index === 1) {
        this.showFristDropBox = false;
        this.nftFItem = item;
        this.nftSItem = '';
        // 选择完第一分类立即进行获取对应的第二分类数据
        this.secondClassificationList = [];
        const that = this;
        this.secondSourceDataList.forEach((subItem,index) => {
          if (parseInt(subItem.classifymain) === item.id) {
            that.secondClassificationList.push(subItem);
          }
        });
      }else if(index === 2) {
        this.showSecondDropBox = false;
        this.nftSItem = item;
      }
    },
    // 店铺类头部图片文件读取完成后的回调
    async afterRead(file) {
      let ipfsFile = [];
      console.log('afterRead =', file)
      //区分单文件上传还是多文件
      if (file instanceof Array && file.length) {
        for (let i = 0; i < file.length; i++) {
          ipfsFile.push(file[i]);
        }
      } else {
        ipfsFile.push(file);
      }
      console.log('ipfsFile =', ipfsFile)
      for (const item of ipfsFile) {
        const index = ipfsFile.indexOf(item);
        try {
          const added = await this.ipfsClient.add(item.file, { progress: (prog) => console.log(`received: ${prog}`) });
          let uploadPhotoUrl = added.path;
          this.uploadHeaderUrl.push(uploadPhotoUrl);
          console.log('uploadHeaderUrl =', this.uploadHeaderUrl.join(','))
        } catch (e) {
          let index = this.fileList.findIndex((file) => {
            return file === item;
          });
          this.fileList.splice(index, 1);
          console.log('index =', index)
        }
      }
    },
    beforeDelete(file, detail) {
      console.log(detail)
      this.fileList.splice(detail.index, 1);
      this.uploadHeaderUrl.splice(detail.index, 1);
    },
    // 店铺类主图图片文件读取完成后的回调
    async afterReadMain(file) {
      let ipfsFile = [];
      console.log('afterRead =', file)
      //区分单文件上传还是多文件
      if (file instanceof Array && file.length) {
        for (let i = 0; i < file.length; i++) {
          ipfsFile.push(file[i].file);
        }
      } else {
        ipfsFile.push(file.file);
      }
      console.log('ipfsFile =', ipfsFile)
      for (const item of ipfsFile) {
        const index = ipfsFile.indexOf(item);
        try {
          const added = await this.ipfsClient.add(item, { progress: (prog) => console.log(`received: ${prog}`) });
          let uploadPhotoUrl = added.path;
          this.uploadMainUrl.push(uploadPhotoUrl);
          console.log('uploadMainUrl =', this.uploadMainUrl.join(','))
        } catch (e) {
          let index = this.mainFileList.findIndex((file) => {
            return file.file === item;
          });
          this.mainFileList.splice(index, 1);
          console.log('index =', index)
        }
      }
    },
    beforeDeleteMain(file, detail) {
      this.mainFileList.splice(detail.index, 1);
      this.uploadMainUrl.splice(detail.index, 1);
    },
    // 移除上传文件
    hanldeRemoveFile() {
      this.uploadPhotoUrl = '';
      this.isUploadSuccess = false;
      this.$refs.upload.clearFiles();
    },
    // 设置按钮显示文本
    changeBtnStatuTextMsg() {
      let textMsg = this.$t("message.casting.Connect");
      if (this.isConnectWallet) {
        textMsg = this.$t("message.casting.CastNow");
      }
      this.castBtnText = textMsg;
    },
    // 文件添加、 上传、 失败都会回调这里
    async uploadImgFileChange(files,fileList) {
      if (!this.isConnectWallet) {
        this.hanldeRemoveFile();
        this.$notify({message: this.$t("message.casting.connectWallet"),duration: 2500,showClose:false,customClass:'notifyClass'});
        return;
      }
      let that = this;
      const file = fileList[0];
      const fileSize = file.raw.size;
      const fileType = file.raw.type;
      const is100M = fileSize / 1024 / 1024 < 100;
      if (fileType.indexOf('image') === -1) {
         // 如果不是图片格式
        this.$notify({message: this.$t("message.casting.validPhoto"),duration: 2500,showClose:false,customClass:'notifyClass'});
        this.hanldeRemoveFile();
        return false;
      }else if (!is100M) {
        // 限制小于100M
        this.$notify({message: this.$t("message.casting.validPhoto100MB"),duration: 2500,showClose:false,customClass:'notifyClass'});
        this.hanldeRemoveFile();
        return false;
      }
      // 验证图片是否是1:1
      const isAvailable = await this.checkImgLengthAndWidthSize(file);
      if (!isAvailable) {
         const reader = new FileReader();
         reader.readAsDataURL(file.raw);
         reader.onload = () => {
           that.option.img = reader.result;
           that.isShowTailor = true;
         }
         //this.isShowTailor = false;
        //this.$notify({message: this.$t("message.casting.validPhotoFomat"),duration: 2500,showClose:false,customClass:'notifyClass'});
        //this.hanldeRemoveFile();
        return false;
      }
      try {
        // 开启加载视图
        this.isShowUploadGif = true;
        // 获取上传文件
        const ipfsFile = file.raw;
        // 开始上传IPFS
        const added = await this.ipfsClient.add(ipfsFile,{ progress: (prog) => console.log(`received: ${prog}`)});
        that.isUploadSuccess = true;
        that.uploadPhotoUrl = `${settingConfig.ipfsNFTUrl + added.path}`;
        console.log('==added.path==',added.path);
        setTimeout(() => {
          that.isShowUploadGif = false;
        }, 1000);
        console.log(' this.uploadPhotoUrl =',this.uploadPhotoUrl);
      } catch (error) {
        this.isShowUploadGif = false;
        this.hanldeRemoveFile();
        this.$notify({message: error,duration: 2500,showClose:false,customClass:'notifyClass'});
        console.log('Error uploading file: ', error)
      }
    },
    // 检验图片是否是1:1的大小
    checkImgLengthAndWidthSize(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsDataURL(file.raw);
        reader.onload = () => {
          let img = new Image()
          img.src = reader.result;
          img.onload = () => {
            if (img.width === img.height) {
              resolve(true)
            } else {
              resolve(false)
            }
          }
        }
      });
    },
    // 铸造商品类/艺术类NFT
    async handleClickCastNFT() {
     if (!this.isConnectWallet) {
       this.$notify({message: this.$t("message.casting.connectWallet"),duration: 2500,showClose:false,customClass:'notifyClass'});
       return;
     }
     // 判断是否已经绑定上级了
     if (!this.isBindSuperAddress) {
       this.$eventBus.$emit('showBindUpperAddress');
       return;
     }
     if (isStringEmpty(this.uploadPhotoUrl)) {
       this.$notify({message:this.$t("message.casting.uploadNFTPhoto"),duration: 2500,showClose:false,customClass:'notifyClass'});
       return;
     }else if (isStringEmpty(this.nftName)) {
       this.$notify({message:this.$t("message.casting.uploadNFTName"),duration: 2500,showClose:false,customClass:'notifyClass'});
       return;
     }else if (isStringEmpty(this.nftDescripition)) {
       this.$notify({message:this.$t("message.casting.uploadNFTDesc"),duration: 2500,showClose:false,customClass:'notifyClass'});
       return;
     }else if (isStringEmpty(this.nftPrice)) {
       this.$notify({message:this.$t("message.casting.uploadNFTPrice"),duration: 2500,showClose:false,customClass:'notifyClass'});
       return;
     }else if (isObjectEmpty(this.nftFItem)) {
       this.$notify({message:this.$t("message.casting.uploadNFTFCategory"),duration: 2500,showClose:false,customClass:'notifyClass'});
       return;
     }else if (isObjectEmpty(this.nftSItem)) {
       this.$notify({message:this.$t("message.casting.uploadNFTSCategory"),duration: 2500,showClose:false,customClass:'notifyClass'});
       return;
     }else if (isStringEmpty(this.phoneNum) && !this.isCastingArt){
       this.$notify({message:this.$t("message.casting.uploadNFTPhone"),duration: 2500,showClose:false,customClass:'notifyClass'});
       return;
     }else if (isStringEmpty(this.phoneAearNum) && !this.isCastingArt){
       this.$notify({message:this.$t("message.casting.uploadNFTPhoneArea"),duration: 2500,showClose:false,customClass:'notifyClass'});
       return;
     }else if (isStringEmpty(this.qqNum) && isStringEmpty(this.weChatNum) && isStringEmpty(this.telegramNum) && isStringEmpty(this.skypeNum) && isStringEmpty(this.bbmNum) && !this.isCastingArt) {
       this.$notify({message:this.$t("message.casting.uploadOtherContact"),duration: 2500,showClose:false,customClass:'notifyClass'});
       return;
     }else if (!this.aladPayWay && !this.busdPayWay) {
       this.$notify({message: this.$t("message.casting.payWayMsg"), duration: 2500, showClose: false, customClass: 'notifyClass'});
       return;
     }
     /* first, upload to IPFS */
     const mapDict = {};
     // const length = settingConfig.ipfsNFTUrl.length;
     mapDict['image'] = this.uploadPhotoUrl;
     mapDict['name'] = this.nftName;
     mapDict['description'] = this.nftDescripition;
     mapDict['nftPrice'] = this.nftPrice;
     mapDict['nftPhone'] = this.isCastingArt ? '' : (this.phoneAearNum + ' ' + this.phoneNum);
     mapDict['qqNum'] = this.isCastingArt ? '' : this.qqNum;
     mapDict['weChatNum'] = this.isCastingArt ? '' : this.weChatNum;
     mapDict['telegramNum'] = this.isCastingArt ? '' : this.telegramNum;
     mapDict['skypeNum'] = this.isCastingArt ? '' : this.skypeNum;
     mapDict['bbmNum'] = this.isCastingArt ? '' : this.bbmNum;
     console.log('mapDict data =',mapDict);
     const data = JSON.stringify(mapDict);
     try {
       const that = this;
       // 将数据信息更新到IPFS上
       const added = await that.ipfsClient.add(data);
       const nftUrl = added.path;
       console.log('nftUrl =',nftUrl);
       // 开始创建NFT
       const nftData = {};
       nftData['address'] = that.walletAddress;
       nftData['tokenURL'] = nftUrl;
       nftData['fSort'] = that.nftFItem.id;
       nftData['sSort'] = that.nftSItem.id;
       nftData['price'] = that.nftPrice;
       // 艺术类/商品类才存在的参数
       nftData['nftType'] = that.isCastingArt ? 2 : 1;
       // 支付类型 0 alad 1 busd 2 alad/busd
       let payWay = that.aladPayWay ? '0' : '1';
       if (that.aladPayWay && that.busdPayWay) {
         payWay = '2';
       }
       nftData['payType'] = payWay;
       // 开始铸造NFT
       that.$loading.showLoading();
       const result = await that.$decentralized.createToken(nftData,that.connectWalletType);
       console.log('createToken result =',result);
       if (result) {
         setTimeout(() => {
           that.$loading.hiddenLoading();
           that.clearControlData();
           that.$notify({message: this.$t("message.alertMsg.castCompletion"),duration: 2500,showClose:false,customClass:'notifyClass'});
         }, 3000)
         /*let assetID;
         if (that.connectWalletType === '1') {
           assetID = result.events.CreateNFTEvent.returnValues.tokenId;
         }else if (that.connectWalletType === '2') {
           assetID = result.events.args.tokenId;
         }
         const marketData = {};
         marketData['address'] = that.walletAddress;
         marketData['assetID'] = assetID;
         marketData['price'] = that.nftPrice;
         // 将NFT挂载到市场上去
         const result1 = await that.$decentralized.createOrder(marketData,that.connectWalletType);
         if (result1) {
           // 延迟三秒等待数据同步到后台的数据库
           setTimeout(() => {
             that.$loading.hiddenLoading();
             that.clearControlData();
             that.$notify({message: this.$t("message.alertMsg.castCompletion"),duration: 2500,showClose:false,customClass:'notifyClass'});
           }, 3000);
         }*/
       }else {
         // 铸造失败
         that.$loading.hiddenLoading();
         that.clearControlData();
         that.$notify({message: this.$t("message.alertMsg.castFailureMsg"),duration: 2500,showClose:false,customClass:'notifyClass'});
       }
     } catch (error) {
       this.$loading.hiddenLoading();
       this.clearControlData();
       this.$notify({message: error.message,duration: 2500,showClose:false,customClass:'notifyClass'});
       console.log('Error message: ', error)
     }
    },
    // 创建商店类商品
    async createShop() {
      if (!this.isConnectWallet) {
        this.$notify({message: this.$t("message.casting.connectWallet"),duration: 2500,showClose:false,customClass:'notifyClass'});
        return;
      }
      // 判断是否已经绑定上级了
      if (!this.isBindSuperAddress) {
        this.$eventBus.$emit('showBindUpperAddress');
        return;
      }
      if (this.uploadHeaderUrl.length === 0) {
        this.$notify({message: this.$t("message.casting.uploadMainPhoto"), duration: 2500, showClose: false, customClass: 'notifyClass'});
        return;
      } else if (isStringEmpty(this.nftName)) {
        this.$notify({message: this.$t("message.casting.shopDesc1"), duration: 2500, showClose: false, customClass: 'notifyClass'});
        return;
      }else if (!this.aladPayWay && !this.busdPayWay) {
        this.$notify({message: this.$t("message.casting.payWayMsg"), duration: 2500, showClose: false, customClass: 'notifyClass'});
        return;
      } else if (isStringEmpty(this.nftPrice)) {
        this.$notify({message: this.$t("message.casting.shopDesc2"), duration: 2500, showClose: false, customClass: 'notifyClass'});
        return;
      }else if (isStringEmpty(this.nftDescripition)) {
        this.$notify({message: this.$t("message.casting.shopDesc3"), duration: 2500, showClose: false, customClass: 'notifyClass'});
        return;
      }
      if (isStringEmpty(this.phoneNum)) {
        this.$notify({message: this.$t("message.casting.uploadNFTPhone"), duration: 2500, showClose: false, customClass: 'notifyClass'});
        return;
      } else if (isStringEmpty(this.phoneAearNum)) {
        this.$notify({message: this.$t("message.casting.uploadNFTPhoneArea"), duration: 2500, showClose: false, customClass: 'notifyClass'});
        return;
      } else if (isStringEmpty(this.qqNum) && isStringEmpty(this.weChatNum) && isStringEmpty(this.telegramNum) && isStringEmpty(this.skypeNum) && isStringEmpty(this.bbmNum)) {
        this.$notify({message: this.$t("message.casting.uploadOtherContact1"), duration: 2500, showClose: false, customClass: 'notifyClass'});
        return;
      }
      const that = this;
      const mapDict = {};
      mapDict['pics'] = this.uploadHeaderUrl.join(',');
      mapDict['picurl'] = this.uploadHeaderUrl[0];
      mapDict['orderDetails'] = this.uploadMainUrl.join(',');
      mapDict['name'] = this.nftName;
      mapDict['desc'] = this.nftDescripition;
      mapDict['price'] = parseNumber(this.nftPrice, 18);
      mapDict['phone'] = this.phoneAearNum + ' ' + this.phoneNum;
      mapDict['link'] = this.qqNum;
      mapDict['weChat'] = this.weChatNum;
      mapDict['tg'] = this.telegramNum;
      mapDict['skype'] = this.skypeNum;
      mapDict['bbm'] = this.bbmNum;
      mapDict['sender'] = this.walletAddress;
      // 支付类型 0 alad 1 busd 2 alad/busd
      let payWay = that.aladPayWay ? '0' : '1';
      if (that.aladPayWay && that.busdPayWay) {
        payWay = '2';
      }
      mapDict['payType'] = payWay;
      const signDict = await this.$decentralized.getApprovePublishOrderSignShopOnShelfGood(mapDict);
      mapDict['time'] = signDict.time;
      mapDict['sign'] = signDict.signature;
      that.$loading.showLoading();
      let result = await publishOrder(mapDict);
      if (result.status === 200) {
        setTimeout(() => {
          that.$loading.hiddenLoading();
          that.clearControlData();
          that.$notify({message: this.$t("message.alertMsg.castCompletion"), duration: 2500, showClose: false, customClass: 'notifyClass'});
        }, 3000)
      } else {
        // 铸造失败
        that.$loading.hiddenLoading();
        that.clearControlData();
        that.$notify({message: this.$t("message.alertMsg.castFailureMsg"), duration: 2500, showClose: false, customClass: 'notifyClass'});
      }
      console.log('publishOrder =', result)
    },
    // 铸造完成或者断开账户时候将清楚输入的数据
    clearControlData() {
      this.nftName = '';
      this.nftDescripition = '';
      this.nftPrice = '';
      this.nftFItem = '';
      this.nftSItem = '';
      this.phoneNum = '';
      this.qqNum = '';
      this.weChatNum = '';
      this.telegramNum = '';
      this.skypeNum = '';
      this.bbmNum = '';
      this.phoneAearNum = '86';
      this.uploadPhotoUrl = '';
      this.isUploadSuccess = false;
      this.fileList = [];
      this.mainFileList = [];
      this.uploadMainUrl = [];
      this.uploadHeaderUrl = [];
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles();
      }
    },
  },
};
</script>

<style lang="scss" scoped>

.casting {
  max-width: 1200px;
  //height: 1540px;
  margin: 0 auto;
  .ordinaryCast {
    display: flex;
    justify-content: space-between;
    padding-top: 0.1px;
    width: 100%;
    height: 1400px;
    .c_left {
      width: 610px;
      .c_l_title {
        margin-top: 35px;
        line-height: 40px;
        font-size: 24px;
        font-weight: 600;
        text-align: left;
        user-select: none;
        font-family: "PingFang SC",sans-serif;
        font-stretch: normal;
        font-style: normal;
        color: var(--white);
      }
      .c_l_desc {
        margin-top: 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          line-height: 22px;
          font-size: 16px;
          font-weight: 500;
          user-select: none;
          font-family: "PingFang SC",sans-serif;
          font-stretch: normal;
          font-style: normal;
          color: var(--white);
          &:last-child {
            color: var(--primary);
            font-size: 16px;
            font-weight: normal;
          }
        }
      }
      .c_l_castType {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 18px;
        width: 354px;
        height: 24px;
        .c_l_c_left {
          display: flex;
          align-items: center;
          cursor: pointer;
          img {
            width: 24px;
            height: 24px;
          }
          span {
            margin-left: 6px;
            line-height: 20px;
            font-size: 14px;
            font-weight: 600;
            font-stretch: normal;
            font-style: normal;
            user-select: none;
            font-family: Poppins,sans-serif;
            color: #9e94a8;
          }
          .c_l_c_span {
            color: var(--white);
          }
        }
      }
      .c_l_desc1 {
        margin-top: 24px;
      }
      .c_l_desc2 {
        margin-top: 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .c_l_desc2_span {
          line-height: 40px;
          font-size: 18px;
          font-weight: 600;
          user-select: none;
          font-family: "PingFang SC",sans-serif;
          font-stretch: normal;
          font-style: normal;
          color: var(--white);
        }
        .c_l_d_right {
          span {
            line-height: 40px;
            font-size: 14px;
            font-weight: normal;
            user-select: none;
            font-family: "PingFang SC",sans-serif;
            font-stretch: normal;
            font-style: normal;
            color: var(--white);
            &:last-child {
              color: var(--primary);
              font-weight: normal;
            }
          }
        }
      }
      .c_l_desc3 {
        font-size: 18px;
      }
      .c_l_desc4 {
        margin-top: 24px;
      }
      .c_l_upload {
        margin-top: 20px;
        width: 394px;
        height: 394px;
        border-radius: 10px;
        position: relative;
        cursor: pointer;
        user-select: none;
        background-color: #1b1b33;
        box-sizing: border-box;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-image: url('../../../assets/laboras/icon_l_upload.svg');
        overflow: hidden;
        .c_l_u_nomal {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          span {
            margin-top: 6px;
            line-height: 20px;
            font-size: 12px;
            font-weight: 600;
            font-family: "PingFang SC",sans-serif;
            font-stretch: normal;
            font-style: normal;
            color: var(--white);
          }
          img {
            width: 74px;
            height: 74px;
            margin: 30px 0;
          }
        }
        .c_l_u_selected {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
        .c_l_gif {
          width: 200px;
          height: 200px;
          top: 97px;
          left: 97px;
          position: absolute;
        }
      }
      .c_l_sort {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        .m_d_s_item {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 300px;
          height: 54px;
          cursor: pointer;
          user-select: none;
          border-radius: 8px;
          border: solid 1px #4f5776;
          background-color: #1b1b33;
          .c_l_i_input {
            width: 70%;
            height: 100%;
            border: 0; // 去除未选中状态边框
            outline: none; // 去除选中状态边框
            font-size: 14px;
            text-align: left;
            font-family: "PingFang SC",sans-serif;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            cursor: pointer;
            user-select: none;
            box-sizing: border-box;
            background-color: transparent;
            color: var(--white);
          }
          .c_l_i_input::-webkit-outer-spin-button,
          .c_l_i_input::-webkit-inner-spin-button {
            -webkit-appearance: none;
          }
          /* 火狐 */
          .c_l_i_input[type="number"] {
            -moz-appearance: textfield;
          }
          .c_l_i_input::-webkit-input-placeholder {
            color: #373752;
            font-size: 15px;
          }
          .c_l_i_input:-moz-placeholder {
            /* FF 4-18 */
            color: #373752;
            font-size: 15px;
          }
          .c_l_i_input::-moz-placeholder {
            /* FF 19+ */
            color: #373752;
            font-size: 15px;
          }
          .c_l_i_input:-ms-input-placeholder {
            /* IE 10+ */
            color: #373752;
            font-size: 15px;
          }
          .c_l_i_input:-webkit-autofill {
            transition: background-color 5000s ease-in-out 0s; //背景颜色
          }
          img {
            margin-left: 10px;
            width: 16px;
            height: 10px;
          }
          .m_d_s_drownBox {
            width: 100%;
            height: 240px;
            position: absolute;
            top: 55px;
            left: 0;
            border-radius: 8px;
            overflow-y:scroll;
            border: solid 1px #4f5776;
            background-color: #1b1b33;
            .m_d_s_d_text {
              height: 40px;
              line-height: 40px;
              text-align: center;
              font-family: "PingFang SC",sans-serif;
              font-size: 14px;
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              color: var(--white);
              background-color: transparent;
            }
          }
        }
      }
      .c_l_price_input {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .c_l_input {
          margin-top: 0;
          width: 480px;
        }
        .c_l_price_input_usdt {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 120px;
          height: 50px;
          border-radius: 4px;
          border: solid 1px #4f5776;
          background-color: #1b1b33;
          span {
            margin-left: 10px;
            font-size: 18px;
            font-family: PingFangSC, sans-serif;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            color: var(--white);
          }
          img {
            width: 30px;
            height: 30px;
          }
        }
      }
      .c_l_pay {
        margin: 24px auto 0;
        .c_l_text {
          font-family: PingFangSC-Regular, sans-serif;
          font-size: 16px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          text-align: left;
          color: white;
        }
        .c_l_wrapper {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          width: 610px;
          height: 50px;
          .c_l_left {
            padding-left:20px;
            display: flex;
            align-items: center;
            width: 300px;
            height: 100%;
            border-radius: 8px;
            border: solid 1px #4f5776;
            background-color: #1b1b33;
            img {
              width: 24px;
              height:24px;
              &:last-child {
                margin-left: 160px;
              }
            }
            span {
              margin-left: 10px;
              font-family: "PingFang SC", sans-serif;
              font-size: 14px;
              font-weight: 500;
              font-stretch: normal;
              font-style: normal;
              line-height: normal;
              letter-spacing: normal;
              color: white;
            }
          }
        }
      }
      .c_l_input {
        margin-top: 10px;
        height: 50px;
        border-radius: 8px;
        border: solid 1px #4f5776;
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
          font-size: 15px;
        }
        input:-moz-placeholder {
          /* FF 4-18 */
          color: #373752;
          font-size: 15px;
        }
        input::-moz-placeholder {
          /* FF 19+ */
          color: #373752;
          font-size: 15px;
        }
        input:-ms-input-placeholder {
          /* IE 10+ */
          color: #373752;
          font-size: 15px;
        }
        input:-webkit-autofill {
          transition: background-color 5000s ease-in-out 0s; //背景颜色
        }
      }
      .c_l_description {
        margin-top: 10px;
        height: 144px;
        border-radius: 8px;
        border: solid 1px #4f5776;
        background-color: #1b1b33;
        textarea {
          margin-top: 20px;
          width: 90%;
          height: 80%;
          border: 0; // 去除未选中状态边框
          resize:none;
          outline: none; // 去除选中状态边框
          font-size: 16px;
          font-family: "PingFang SC",sans-serif;
          font-weight: normal;
          box-sizing: border-box;
          background-color: transparent;
          color: var(--white);
        }
        textarea::-webkit-input-placeholder {
          color: #373752;
          font-size: 15px;
        }
        textarea:-moz-placeholder {
          /* FF 4-18 */
          color: #373752;
          font-size: 15px;
        }
        textarea::-moz-placeholder {
          /* FF 19+ */
          color: #373752;
          font-size: 15px;
        }
        textarea:-ms-input-placeholder {
          /* IE 10+ */
          color: #373752;
          font-size: 15px;
        }
        textarea:-webkit-autofill {
          transition: background-color 5000s ease-in-out 0s; //背景颜色
        }
      }
    }
    .c_right {
      width: 495px;
      .c_r_title {
        margin-top: 35px;
        line-height: 40px;
        font-size: 24px;
        font-weight: 600;
        text-align: left;
        user-select: none;
        font-family: "PingFang SC",sans-serif;
        font-stretch: normal;
        font-style: normal;
        color: var(--white);
      }
      .c_r_item {
        margin-top: 30px;
        height: 90px;
        .c_r_i_left {
          display: flex;
          align-items: center;
          position: relative;
          img {
            width: 28px;
            height: 28px;
          }
          span {
            margin-left: 20px;
            line-height: 30px;
            font-size: 18px;
            font-weight: 600;
            font-family: "PingFang SC",sans-serif;
            font-stretch: normal;
            font-style: normal;
            color: var(--white);
          }
          .c_r_i_l_prompt {
            position: absolute;
            right: 0;
            font-size: 16px;
            font-weight: normal;
            color: var(--primary);
          }
          .c_r_css {
            color: #484741;
          }
        }
        .c_r_i_right {
          height: 54px;
          margin-top: 6px;
          border-radius: 8px;
          border: solid 1px #4f5776;
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
            font-size: 15px;
          }
          input:-moz-placeholder {
            /* FF 4-18 */
            color: #373752;
            font-size: 15px;
          }
          input::-moz-placeholder {
            /* FF 19+ */
            color: #373752;
            font-size: 15px;
          }
          input:-ms-input-placeholder {
            /* IE 10+ */
            color: #373752;
            font-size: 15px;
          }
          input:-webkit-autofill {
            transition: background-color 5000s ease-in-out 0s; //背景颜色
          }
        }
        .c_r_i_phone {
          display: flex;
          align-items: center;
          div {
            margin-left: 10px;
            font-size: 15px;
            font-weight: 500;
            font-stretch: normal;
            font-style: normal;
            font-family: "PingFang SC",sans-serif;
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
            font-family: "PingFang SC",sans-serif;
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
          .c_r_css {
            color: #484741;
          }
        }
      }
      .c_r_item_first {
        margin-top: 50px;
      }
      .c_r_castPrompt {
        width: 456px;
        margin: 78px auto 0;
        font-size: 14px;
        line-height: 20px;
        text-align: center;
        font-family: "PingFang SC",sans-serif;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        user-select: none;
        color: var(--primary);
      }
      .c_r_cast {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 348px;
        height: 60px;
        margin: 72px auto 0;
        font-size: 20px;
        font-weight: 500;
        font-family: "PingFang SC",sans-serif;
        font-stretch: normal;
        font-style: normal;
        color: var(--white);
        cursor: pointer;
        user-select: none;
        box-sizing: border-box;
        object-fit: contain;
        border-radius: 10px;
        box-shadow: 0 0 10px 0 rgba(123, 40, 219, 0.6);
        background-image: linear-gradient(85deg, #f109b4 -1%, #622fe3 102%);
      }
      .c_r_prompt {
        margin-top: 38px;
        font-size: 16px;
        line-height: 23px;
        text-align: left;
        font-family: "PingFang SC",sans-serif;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        user-select: none;
        color: var(--primary);
      }
      .c_r_css {
        color: #484741;
      }
    }
  }
  .shopperCast {
    padding-top: 0.1px;
    width: 100%;
    height: 1300px;
    .c_l_title {
      margin-top: 30px;
      line-height: 22px;
      font-size: 16px;
      font-weight: 500;
      text-align: left;
      user-select: none;
      font-family: "PingFang SC",sans-serif;
      font-stretch: normal;
      font-style: normal;
      color: var(--white);
    }
    .c_upload_tips {
      margin-top: 7px;
      font-family: PingFangSC-Regular, sans-serif;
      line-height: 17px;
      font-size: 12px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      letter-spacing: normal;
      text-align: left;
      color: #9a55dc;
    }
    .c_l_upload {
      margin-top: 20px;
      width: 100%;
      height: 88px;
      box-sizing: border-box;
      text-align: left;
      .van-uploader {
        /deep/ .van-image {
          width: 88px;
          height: 88px;
          overflow: hidden;
          border-radius: 10px;
        }
      }
    }
    .c_l_upload_tip {
      margin-top: 12px;
      font-family: PingFangSC-Regular, sans-serif;
      font-size: 12px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #9a55dc;
    }
    .c_l_wrapper {
      margin-top: 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .c_l_w_left {
        .c_l_w_l_name {
          line-height: 22px;
          font-size: 16px;
          font-weight: 500;
          user-select: none;
          font-family: "PingFang SC",sans-serif;
          font-stretch: normal;
          font-style: normal;
          text-align: left;
          color: var(--white);
        }
        .c_l_input {
          margin-top: 10px;
          width: 546px;
          height: 50px;
          border-radius: 4px;
          border: solid 1px #4f5776;
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
            font-size: 15px;
          }
          input:-moz-placeholder {
            /* FF 4-18 */
            color: #373752;
            font-size: 15px;
          }
          input::-moz-placeholder {
            /* FF 19+ */
            color: #373752;
            font-size: 15px;
          }
          input:-ms-input-placeholder {
            /* IE 10+ */
            color: #373752;
            font-size: 15px;
          }
          input:-webkit-autofill {
            transition: background-color 5000s ease-in-out 0s; //背景颜色
          }
        }
      }
      .c_l_w_right {
        .c_l_w_l_name {
          line-height: 22px;
          font-size: 16px;
          font-weight: 500;
          user-select: none;
          font-family: "PingFang SC",sans-serif;
          font-stretch: normal;
          font-style: normal;
          text-align: left;
          color: var(--white);
        }
        .c_l_price_input {
          width: 610px;
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .c_l_price_input_usdt {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 120px;
            height: 50px;
            border-radius: 4px;
            border: solid 1px #4f5776;
            background-color: #1b1b33;
            span {
              margin-left: 10px;
              font-size: 18px;
              font-family: PingFangSC, sans-serif;
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              color: var(--white);
            }
            img {
              width: 30px;
              height: 30px;
            }
          }
          .c_l_input {
            margin-left: 10px;
            width: 546px;
            height: 50px;
            border-radius: 4px;
            border: solid 1px #4f5776;
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
              font-size: 15px;
            }
            input:-moz-placeholder {
              /* FF 4-18 */
              color: #373752;
              font-size: 15px;
            }
            input::-moz-placeholder {
              /* FF 19+ */
              color: #373752;
              font-size: 15px;
            }
            input:-ms-input-placeholder {
              /* IE 10+ */
              color: #373752;
              font-size: 15px;
            }
            input:-webkit-autofill {
              transition: background-color 5000s ease-in-out 0s; //背景颜色
            }
          }
        }
      }
    }
    .c_l_pay {
      margin: 30px auto 0;
      .c_l_text {
        font-family:"PingFang SC", sans-serif;
        font-size: 16px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: left;
        color: white;
      }
      .c_l_wrapper {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        width: 610px;
        height: 50px;
        .c_l_left {
          padding-left:20px;
          display: flex;
          align-items: center;
          width: 300px;
          height: 100%;
          border-radius: 8px;
          border: solid 1px #4f5776;
          background-color: #1b1b33;
          img {
            width: 24px;
            height:24px;
            &:last-child {
              margin-left: 160px;
            }
          }
          span {
            margin-left: 10px;
            font-family: "PingFang SC", sans-serif;
            font-size: 14px;
            font-weight: 500;
            font-stretch: normal;
            font-style: normal;
            line-height: normal;
            letter-spacing: normal;
            color: white;
          }
        }
      }
    }
    .c_l_description {
      margin-top: 30px;
      .c_l_desc {
        line-height: 22px;
        font-size: 16px;
        font-weight: 500;
        user-select: none;
        font-family: "PingFang SC",sans-serif;
        font-stretch: normal;
        font-style: normal;
        color: var(--white);
        text-align: left;
      }
      .c_l_description {
        margin-top: 10px;
        height: 144px;
        width: 100%;
        border-radius: 4px;
        border: solid 1px #4f5776;
        background-color: #1b1b33;
        textarea {
          margin-top: 15px;
          width: 95%;
          height: 80%;
          border: 0; // 去除未选中状态边框
          resize:none;
          outline: none; // 去除选中状态边框
          font-size: 16px;
          font-family: "PingFang SC",sans-serif;
          font-weight: normal;
          box-sizing: border-box;
          background-color: transparent;
          color: var(--white);
        }
        textarea::-webkit-input-placeholder {
          color: #373752;
          font-size: 15px;
        }
        textarea:-moz-placeholder {
          /* FF 4-18 */
          color: #373752;
          font-size: 15px;
        }
        textarea::-moz-placeholder {
          /* FF 19+ */
          color: #373752;
          font-size: 15px;
        }
        textarea:-ms-input-placeholder {
          /* IE 10+ */
          color: #373752;
          font-size: 15px;
        }
        textarea:-webkit-autofill {
          transition: background-color 5000s ease-in-out 0s; //背景颜色
        }
      }
    }
    .c_l_upload_wrapper {
      margin-top: 30px;
      .c_l_text {
        font-family: PingFangSC-Regular, sans-serif;
        font-size: 16px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: left;
        color: white;
      }
      .c_l_upload_main {
        margin-top: 20px;
        width: 100%;
        height: 88px;
        box-sizing: border-box;
        text-align: left;
        .van-uploader {
          /deep/ .van-image {
            width: 88px;
            height: 88px;
            overflow: hidden;
            border-radius: 10px;
          }
        }
      }
    }
    .c_l_contact {
      margin-top: 30px;
      .c_l_text {
        font-family: PingFangSC-Regular, sans-serif;
        font-size: 16px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: left;
        color: white;
      }
      .c_l_c_wrapper {
        margin-top: 30px;
        .c_l_c_top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .c_r_item {
            width: 358px;
            .c_r_i_left {
              display: flex;
              align-items: center;
              img {
                width: 24px;
                height: 24px;
              }
              span {
                margin-left: 10px;
                line-height: 22px;
                font-size: 16px;
                font-weight: 500;
                font-family: "PingFang SC",sans-serif;
                font-stretch: normal;
                font-style: normal;
                color: var(--white);
              }
            }
            .c_r_i_right {
              margin-top: 8px;
              width: 100%;
              height: 50px;
              border-radius: 4px;
              border: solid 1px #4f5776;
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
                font-size: 15px;
              }
              input:-moz-placeholder {
                /* FF 4-18 */
                color: #373752;
                font-size: 15px;
              }
              input::-moz-placeholder {
                /* FF 19+ */
                color: #373752;
                font-size: 15px;
              }
              input:-ms-input-placeholder {
                /* IE 10+ */
                color: #373752;
                font-size: 15px;
              }
              input:-webkit-autofill {
                transition: background-color 5000s ease-in-out 0s; //背景颜色
              }
            }
            .c_r_i_phone {
              display: flex;
              align-items: center;
              div {
                margin-left: 10px;
                font-size: 15px;
                font-weight: 500;
                font-stretch: normal;
                font-style: normal;
                font-family: "PingFang SC",sans-serif;
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
                font-family: "PingFang SC",sans-serif;
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
              .c_r_css {
                color: #484741;
              }
            }
          }
        }
        .c_l_c_bottom {
          margin-top: 40px;
        }
      }
    }
    .c_r_cast {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 348px;
      height: 60px;
      margin-top: 60px;
      font-size: 20px;
      font-weight: 500;
      font-family: "PingFang SC",sans-serif;
      font-stretch: normal;
      font-style: normal;
      color: var(--white);
      cursor: pointer;
      user-select: none;
      box-sizing: border-box;
      object-fit: contain;
      border-radius: 10px;
      box-shadow: 0 0 10px 0 rgba(123, 40, 219, 0.6);
      background-image: linear-gradient(85deg, #f109b4 -1%, #622fe3 102%);
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
    .tailor {
      position: relative;
      width: 1200px;
      height: 500px;
      padding: 0 50px;
      border-radius: 20px;
      background-color: var(--bgc03);
      .t_body {
        width: 800px;
        height: 100%;
        margin: 0 auto;
      }
      .mask_save {
        width: 90px;
        height: 30px;
        border-radius: 4px;
        line-height: 30px;
        font-size: 16px;
        font-family: "PingFang SC",sans-serif;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        position: absolute;
        cursor: pointer;
        user-select: none;
        top: calc(50%);
        right: 80px;
        color: var(--white);
        background-color: var( --primary);
      }
      .mask_close {
        width: 33px;
        height: 33px;
        top: 20px;
        right: 20px;
        position: absolute;
        cursor: pointer;
      }
    }
  }
}

/deep/ .el-upload {
  width: 100% !important;
  height: 394px !important;
}
/deep/ .el-upload-dragger {
  width: 100% !important;
  height: 394px !important;
  background-color: transparent !important;
  border: 0;
}

</style>
