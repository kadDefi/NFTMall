<template>
  <div class="casting">
    <div class="c_top"></div>
    <div class="c_body">
      <div v-if="nextIndex === 0&&!isSpecialSeller" class="c_left">
        <div class="c_title">{{ $t('message.mallSideBar.soonText4') }}</div>
        <div class="c_radio">
          <van-radio-group v-model="castingType" direction="horizontal" @change="onChangeType">
            <van-radio name="1">
              <span class="van-radio-text" :style="{color:castingType==='1'?'#ffffff':'#9e94a8'}">{{ $t('message.casting.conventionalNFT') }}</span>
              <template #icon="props">
                <img class="van-radio-image" :src="props.checked ? activeIcon : inactiveIcon" alt="icon"/>
              </template>
            </van-radio>
            <van-radio name="2">
              <span class="van-radio-text" :style="{color:castingType==='2'?'#ffffff':'#9e94a8'}">{{ $t('message.casting.artworkNFT') }}</span>
              <template #icon="props">
                <img class="van-radio-image" :src="props.checked ? activeIcon : inactiveIcon" alt="icon"/>
              </template>
            </van-radio>
          </van-radio-group>
        </div>
        <div class="c_left_body">
          <div class="c_upload_tips">{{ $t('message.casting.supportedFileTypes') }}</div>
          <div class="c_l_upload">
            <el-upload id="file-uploader" ref="upload" action="''" name="file" :accept="'image/*'" :limit="1" :auto-upload="false" :show-file-list="false" :on-change="uploadImgFileChange" drag>
              <div v-if="!isUploadSuccess" class="c_l_u_nomal">
                <img src="../../../assets/newPhones/nCasting/icon_l_photo.png" alt="logo">
                <span>{{ $t('message.casting.uploadYourNFT') }}</span>
              </div>
              <div v-else class="c_l_u_selected" @click.stop="hanldeRemoveFile"><img :src="uploadPhotoUrl" alt="logo">
              </div>
            </el-upload>
            <img v-show="isShowUploadGif" class="c_l_gif" src="../../../assets/universal/icon_upload.gif" alt="logo">
          </div>
          <div class="c_l_sort">
            <div class="m_d_s_item" @click="showPopup">
              <span>{{ getNftCategoryName() }}</span>
            </div>
          </div>
          <div class="c_l_price_input">
            <div class="c_l_price_input_usdt">
              <img src="../../../assets/newPhones/nCasting/iocn_usdt.png" alt="usdt">
              <span>USDT</span>
            </div>
            <div class="c_l_input">
              <input type="number" v-model="nftPrice" @keyup="getNeedDeductGakaNum" :placeholder="placeHolderMap.nftPrice">
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
          <div class="c_l_input">
            <input type="text" v-model="nftName" :placeholder="placeHolderMap.nftName"></div>
          <div class="c_l_input c_l_des_input">
            <textarea type="text" v-model="nftDescripition" :placeholder="placeHolderMap.nftDesc"></textarea>
          </div>
        </div>
      </div>
      <div v-else-if="nextIndex === 0&&isSpecialSeller" class="c_special">
        <div class="c_title">{{ $t('message.mallSideBar.soonText4') }}</div>
        <div class="c_left_body">
          <div class="c_upload_tips">{{ $t('message.casting.supportedFileTypes') }}</div>
          <div class="c_l_upload">
            <input type="text" v-model="nftName" :placeholder="placeHolderMap.shopName">
            <van-uploader v-model="fileList" multiple :max-count="5" :after-read="afterRead" :before-delete="beforeDelete">
              <van-image :src="require('../../../assets/newPhones/nCasting/icon_upload_s.png')"></van-image>
            </van-uploader>
            <div class="c_l_upload_tip">{{ $t('message.casting.uploadTip1') }}</div>
          </div>
          <div class="c_l_price_input">
            <div class="c_l_price_input_usdt">
              <img src="../../../assets/newPhones/nCasting/iocn_usdt.png" alt="usdt">
              <span>USDT</span>
            </div>
            <div class="c_l_input">
              <input type="number" v-model="nftPrice" @keyup="getNeedDeductGakaNum" :placeholder="placeHolderMap.shopPrice">
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
          <div class="c_l_input c_l_des_input">
            <textarea type="text" v-model="nftDescripition" :placeholder="placeHolderMap.shopDesc"></textarea>
          </div>
          <div class="c_l_text">{{ $t('message.casting.detailsMap') }}</div>
          <div class="c_l_upload_main">
            <van-uploader v-model="mainFileList" multiple :max-count="9" :after-read="afterReadMain" :before-delete="beforeDeleteMain">
              <van-image :src="require('../../../assets/newPhones/nCasting/icon_upload_x.png')"></van-image>
            </van-uploader>
            <div class="c_l_upload_tip">{{ $t('message.casting.uploadTip2') }}</div>
          </div>
        </div>
      </div>
      <div v-else class="c_right">
        <div class="c_r_item c_r_item_first">
          <div class="c_r_i_left">
            <img src="../../../assets/laboras/icon_l_phone.svg" alt="logo">
            <span>{{ $t("message.casting.phone") }}</span>
            <span class="c_r_i_l_prompt">*</span>
          </div>
          <div class="c_r_i_right c_r_i_phone">
            <div>+</div>
            <input class="c_r_i_p_input" type="number" v-model="phoneAearNum">
            <div>|</div>
            <input type="text" v-model="phoneNum" :placeholder="placeHolderMap.nftPhone">
          </div>
        </div>
        <!--        <div class="c_r_prompt">* {{ $t("message.casting.uploadOtherContact") }}</div>-->
        <div class="c_r_item">
          <div class="c_r_i_left">
            <img src="../../../assets/laboras/icon_l_qq.svg" alt="logo">
            <span>{{ $t("message.casting.LINK") }}</span>
          </div>
          <div class="c_r_i_right"><input type="text" v-model="qqNum" :placeholder="placeHolderMap.nftLink"></div>
        </div>
        <div class="c_r_item">
          <div class="c_r_i_left">
            <img src="../../../assets/laboras/icon_l_wx.svg" alt="logo">
            <span>{{ $t("message.casting.WeChat") }}</span>
          </div>
          <div class="c_r_i_right"><input type="text" v-model="weChatNum" :placeholder="placeHolderMap.nftWeChat"></div>
        </div>
        <div class="c_r_item">
          <div class="c_r_i_left">
            <img src="../../../assets/laboras/icon_l_tg.svg" alt="logo">
            <span>{{ $t("message.casting.Telegram") }}</span>
          </div>
          <div class="c_r_i_right"><input type="text" v-model="telegramNum" :placeholder="placeHolderMap.nftTelegram">
          </div>
        </div>
        <div class="c_r_item">
          <div class="c_r_i_left">
            <img src="../../../assets/laboras/icon_l_sky.svg" alt="logo">
            <span>{{ $t("message.casting.Skype") }}</span>
          </div>
          <div class="c_r_i_right"><input type="text" v-model="skypeNum" :placeholder="placeHolderMap.nftSkype"></div>
        </div>
        <div class="c_r_item">
          <div class="c_r_i_left">
            <img src="../../../assets/laboras/icon_l_bbm.svg" alt="logo">
            <span>{{ $t("message.casting.BBM") }}</span>
          </div>
          <div class="c_r_i_right"><input type="text" v-model="bbmNum" :placeholder="placeHolderMap.nftBBM"></div>
        </div>
        <!--<div class="c_r_castPrompt">{{ $t("message.casting.CastPrompt") }}</div>-->
      </div>
    </div>
    <div class="c_bottom">
     <!-- <img v-show="nextIndex === 1" class="img_back" src="../../../assets/newPhones/nCasting/h5_icon_back.png" alt="back" @click="handleClickBack">-->
      <div class="c_b_next" @click="handleClickCastNFT(nextIndex)">
        <span>{{ (nextIndex === 0 && castingType === '1') ? $t("message.casting.NextStep") : castBtnText }}</span>
      </div>
    </div>
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
          <img src="../../../assets/nfts/icon_n_go.svg" alt="logo">
        </div>
        <img class="mask_close" src="../../../assets/universal/icon_qb_close.svg" alt="logo"
             @click="showBindMaks = !showBindMaks">
      </div>
    </div>
    <van-popup v-model="show" round position="bottom">
      <div class="p_top">
        <div class="p_line"></div>
      </div>
      <div class="p_filter">
        <div class="p_f_left">
          <div class="p_f_left_wrapper">
            <div v-for="(item,index) in sortList" :key="index" class="p_f_one_classification"
                 :class="classificationOneIndex===index ? 'p_f_one_select_classification' : ''"
                 @click="handleSelectClassification(index)">
              <span>{{ isEnglish ? item.typeen : item.typech }}</span>
            </div>
          </div>
        </div>
        <div class="p_f_right">
          <div class="p_f_right_wrapper">
            <div v-for="(subItem,index) in subSortList" :key="index"
                 :class="subItem.isSelected ? 'p_f_two_select_classification' : ''" class="p_f_two_classification"
                 @click="handleClickSelectFilterSort(subItem)">
              <span>{{ isEnglish ? subItem.typeen : subItem.typech }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="p_bottom">
        <div class="p_b_filter" @click="handleClickConfirmSort()">{{ $t("message.casting.confirm") }}</div>
      </div>
    </van-popup>
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
        <img class="mask_close" src="../../../assets/universal/icon_qb_close.svg" alt="logo"
             @click="handlClickColseTailor">
      </div>
    </div>
  </div>
</template>

<script>

import {mapGetters} from 'vuex';
import {create as ipfsHttpClient} from 'ipfs-http-client';
import {isObjectEmpty, isStringEmpty} from '@/utils/validate';
import {getCastingNFTClassification, getCustomerInfoData,getSpecialSeller, publishOrder} from '@/api/mark'
import {MaxUint256} from '@ethersproject/constants'
import {dataURLtoFile} from '@/utils/utils'
import {parseNumber} from '@/decentralizedApi/param'
const settingConfig = require('../../../settings.js');

export default {
  name: "castingMb",
  data() {
    return {
      fileList: [],
      mainFileList: [],
      activeIcon: require('../../../assets/newPhones/nCasting/icon_checked_xz.svg'),
      inactiveIcon: require('../../../assets/newPhones/nCasting/icon_checked_wxz.svg'),
      classificationOneIndex: 0, // 默认选中的一级分类
      classificationTwoIndex: 0, // 默认选中的二级分类
      show: false,
      nextIndex: 0,
      isEnglish: false,
      isShowTailor: false,
      showBindMaks: false,
      isSpecialSeller: false,
      bindSuperiorAddress: '', // 绑定上级输入的地址
      bindAddressPlaceHolder: this.$t("message.labora.bindUpperPlaceHolder"),
      gakaApproveNum: 0, // gaka剩余可扣量
      castBtnText: '', // 铸造按钮文本
      needGakaNum: 0, // 输入价格后需要扣除的gaka数量
      ipfsClient: null, // IPFS对象
      showFristDropBox: false,
      showSecondDropBox: false,
      nftCategoryName: '',
      nftFItem: '', // 第一分类
      nftSItem: '', // 第二分类
      sortList: [],
      subSortList: [],
      isShowUploadGif: false, // 是否显示上传的gif
      isUploadSuccess: false, // 是否上传图片成功
      uploadPhotoUrl: '', // 上传成功后的url
      nftName: '', // NFT名称
      nftDescripition: '', // NFT描述
      nftPrice: '',// NFT价格
      phoneNum: '',// 创建者手机号
      phoneAearNum: '86',// 手机区号
      qqNum: '', // 创建者qq
      weChatNum: '',// 创建者微信
      telegramNum: '', // 创建者tg
      skypeNum: '', // 创建者sky
      bbmNum: '', // 创建者bb
      castingType: '1',// 选择铸造类型 1 常规类NFT  2 艺术类NFT
      aladPayWay: true, // 支付方式 false 是未选中 true 是选中
      busdPayWay: false, // 支付方式 false 是未选中 true 是选中
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
      placeHolderMap: {
        nftName: this.$t("message.casting.nftName"),
        nftDesc: this.$t("message.casting.nftDesc"),
        nftPrice: this.$t("message.casting.nftPrice"),
        nftFCategory: this.$t("message.casting.nftFCategory"),
        nftSCategory: this.$t("message.casting.nftSCategory"),
        nftPhone: this.$t("message.casting.nftPhone"),
        nftLink: this.$t("message.casting.nftLink"),
        nftWeChat: this.$t("message.casting.nftWeChat"),
        nftSkype: this.$t("message.casting.nftSkype"),
        nftBBM: this.$t("message.casting.nftBBM"),
        nftTelegram: this.$t("message.casting.nftTelegram"),
        shopName: this.$t("message.casting.shopDesc1"),
        shopPrice: this.$t("message.casting.shopDesc2"),
        shopDesc: this.$t("message.casting.shopDesc3"),
      },
      uploadMainUrl: [],
      uploadHeaderUrl: [],
    };
  },
  created() {
    this.isEnglish = window.localStorage.getItem("lang") !== "zh";
    let shopStatus = sessionStorage.getItem('shopStatus');
    if (shopStatus !== null) {
      this.isSpecialSeller = parseInt(shopStatus) === 1;
    }
    // 创建IPF客户端对象
    const ipfsNode = settingConfig.ipfsNode;
    this.ipfsClient = ipfsHttpClient(ipfsNode);
    this.changeBtnStatuTextMsg();
    this.getCastingNFTClassification();
    this.getCustomerInfoData();
    this.getSpecialSeller()
  },
  mounted() {

  },
  destroyed() {
  },
  // 计算属性
  computed: {
    ...mapGetters(['isConnectWallet', 'walletAddress', 'isBindSuperAddress', 'connectWalletType']),
  },
  // 监听属性改变
  watch: {
    isConnectWallet(val, oval) {
      this.changeBtnStatuTextMsg();
      if (val) {
        this.getSpecialSeller();
        this.getCastingNFTClassification();
        this.getCustomerInfoData();
      } else {
        this.clearControlData();
      }
    },
    '$i18n.locale'(nval, oval) {
      if (nval === 'zh') {
        this.isEnglish = false;
      } else {
        this.isEnglish = true;
      }
      this.placeHolderMap = {
        nftName: this.$t("message.casting.nftName"),
        nftDesc: this.$t("message.casting.nftDesc"),
        nftPrice: this.$t("message.casting.nftPrice"),
        nftFCategory: this.$t("message.casting.nftFCategory"),
        nftSCategory: this.$t("message.casting.nftSCategory"),
        nftPhone: this.$t("message.casting.nftPhone"),
        nftLink: this.$t("message.casting.nftLink"),
        nftWeChat: this.$t("message.casting.nftWeChat"),
        nftSkype: this.$t("message.casting.nftSkype"),
        nftBBM: this.$t("message.casting.nftBBM"),
        nftTelegram: this.$t("message.casting.nftTelegram"),
        shopName: this.$t("message.casting.shopDesc1"),
        shopPrice: this.$t("message.casting.shopDesc2"),
        shopDesc: this.$t("message.casting.shopDesc3"),
      };
      this.changeBtnStatuTextMsg();
      this.getCastingNFTClassification();
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
    // 选择艺术类/商品类
    onChangeType(name) {
      this.aladPayWay = true;
      this.busdPayWay = false;
      this.clearControlData();
      this.getCastingNFTClassification();
    },
    // 关闭剪裁
    handlClickColseTailor() {
      this.hanldeRemoveFile();
      this.isShowTailor = false;
    },
    handleClickSaveTailor() {
      // 确定后将剪裁的图片进行上次
      this.$refs.cropper.getCropData(async (data) => {
        // 获取上传文件
        const file = dataURLtoFile(data, 'cropperNmae');
        try {
          const that = this;
          // 开启加载视图
          that.isShowUploadGif = true;
          that.isShowTailor = false;
          // 开始上传IPFS
          const added = await that.ipfsClient.add(file, { progress: (prog) => console.log(`received: ${prog}`) });
          that.isUploadSuccess = true;
          that.uploadPhotoUrl = `${settingConfig.ipfsNFTUrl + added.path}`;
          console.log('==added.path==', added.path);
          setTimeout(() => {
            that.isShowUploadGif = false;
          }, 1000);
          console.log(' this.uploadPhotoUrl =', this.uploadPhotoUrl);
        } catch (error) {
          this.isShowUploadGif = false;
          this.hanldeRemoveFile();
          this.$notify({ message: error, duration: 2500, showClose: false, customClass: 'notifyClass' });
          console.log('Error uploading file: ', error)
        }
        console.log('data =', data);
      });
    },
    // 获取用户名称
    async getCustomerInfoData() {
      //   1 获取列表数据
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
      if (!this.isConnectWallet) {
        return;
      } else if (isStringEmpty(this.bindSuperiorAddress)) {
        this.$notify({message: this.$t("message.labora.bindSuperAddressMsg"), duration: 2500, showClose: false, customClass: 'notifyClass'});
        return;
      }
      try {
        const that = this;
        this.$loading.showLoading();
        const dict = { address: this.walletAddress, superAddress: this.bindSuperiorAddress }
        const result = await this.$decentralized.bindUpLevelAddress(dict, this.connectWalletType);
        if (result) {
          setTimeout(() => {
            that.$loading.hiddenLoading();
            that.$store.dispatch('wallet/setBindSuperAddress', true);
            that.superAdd = this.bindSuperiorAddress;
            that.handleClickColseBindAddress();
            that.getCustomerInfoData(1);
          }, 3000);
        }
      } catch (error) {
        this.$loading.hiddenLoading();
        this.$notify({ message: error.message, duration: 2500, showClose: false, customClass: 'notifyClass' });
        console.log('Error message: ', error)
      }
      console.log('绑定上级地址');
    },
    getNftCategoryName() {
      return isObjectEmpty(this.nftSItem) ? this.$t("message.market.chooseCategory") : this.isEnglish ? this.nftSItem.typeen : this.nftSItem.typech;
    },
    showPopup() {
      this.show = true;
    },
    handleClickConfirmSort() {
      let that = this;
      const classification = [];
      that.nftFItem = '';
      that.nftSItem = '';
      this.sortList.forEach((item, index) => {
        item.sub.forEach((item1) => {
          if (item1.isSelected) {
            that.nftFItem = item;
            that.nftSItem = item1;
            classification.push(item1.id);
          }
        });
      });
      // if (classification.length === 0) {
      //   this.$notify({ message: this.$t("message.casting.uploadNFTCategory"), duration: 2500, showClose: false, customClass: 'notifyClass' });
      //   return;
      // }
      this.show = false;
    },
    // 筛选种类
    handleClickSelectFilterSort(subItem) {
      this.sortList.forEach((item, index) => {
        item.sub.forEach((item1) => {
          if (subItem.id == item1.id && !subItem.isSelected) {
            item1.isSelected = true;
          } else {
            item1.isSelected = false;
          }
        });
      });
      // subItem.isSelected = !subItem.isSelected;
    },
    // 筛选一级分类
    handleSelectClassification(selectIndex) {
      this.classificationOneIndex = selectIndex;
      this.subSortList = this.sortList[this.classificationOneIndex].sub;
    },
    // 获取是否是店铺NFT
    async getSpecialSeller() {
      if (!this.isConnectWallet) {
        return;
      }
      const dict = {};
      dict['address'] = this.walletAddress;
      const result = await getSpecialSeller(dict);
      if (result.status === 200) { // 1 特殊地址  0 非特殊地址
        this.isSpecialSeller = result.data === 1;
        console.log(`当前地址${result.data === 1 ? '是' : '不是'}店铺NFT`)
      } else {
        this.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
      }
    },
    // 获取一、二级分类列表
    async getCastingNFTClassification() {
      // type 0 => 一级分类  1 => 二级分类
      const dict = {};
      dict['type'] = this.castingType;
      dict['address'] = this.walletAddress;
      let  result = await getCastingNFTClassification(dict);
      if (result.status === 200) {
        result.data.mainClassify.forEach(item => {
          const subsList = [];
          result.data.subClassify.forEach(item1 => {
            item1.isSelected = false;
            if (parseInt(item1.classifymain) === item.id) {
              subsList.push(item1);
            }
          });
          item.sub = subsList;
        });
        this.sortList = result.data.mainClassify;
        this.subSortList = result.data.mainClassify[this.classificationOneIndex].sub;
        console.log(`获取${this.castingType === '2' ? '艺术类' : '常规类'}第一级全部分类列表=`, result.data.mainClassify);
        console.log(`获取${this.castingType === '2' ? '艺术类' : '常规类'}第二级全部分类列表=`, result.data.subClassify);
      } else {
        this.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
      }
    },
    // 移除上传文件
    hanldeRemoveFile() {
      this.uploadPhotoUrl = '';
      this.isUploadSuccess = false;
      this.$refs.upload.clearFiles();
    },
    changeBtnStatuTextMsg() {
      let textMsg = this.$t("message.casting.Connect");
      if (this.isConnectWallet) {
        textMsg = this.$t("message.casting.CastNow");
      }
      this.castBtnText = textMsg;
    },
    // 动态获取需要扣的Gaka数量
    getNeedDeductGakaNum() {
      if (this.nftPrice <= 0 || isStringEmpty(this.nftPrice)) {
        this.needGakaNum = 0;
        return;
      }
      const that = this;
      this.$decentralized.getGakaCoverToUSDTPrice(this.nftPrice, (result, error) => {
        that.needGakaNum = result;
        that.changeBtnStatuTextMsg();
        console.log('铸造NFT输入的价格转换成扣除Gaka需要的量', result);
      });
    },
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
    beforeDelete(file, detail) {
      console.log(detail)
      this.fileList.splice(detail.index, 1);
      this.uploadHeaderUrl.splice(detail.index, 1);
    },
    beforeDeleteMain(file, detail) {
      this.mainFileList.splice(detail.index, 1);
      this.uploadMainUrl.splice(detail.index, 1);
    },
    // 文件添加、 上传、 失败都会回调这里
    async uploadImgFileChange(files, fileList) {
      if (!this.isConnectWallet) {
        this.hanldeRemoveFile();
        this.$notify({
          message: this.$t("message.casting.connectWallet"),
          duration: 2500,
          showClose: false,
          customClass: 'notifyClass'
        });
        return;
      }
      let that = this;
      const file = fileList[0];
      const fileSize = file.raw.size;
      const fileType = file.raw.type;
      const is100M = fileSize / 1024 / 1024 < 100;
      if (fileType.indexOf('image') === -1) {
        // 如果不是图片格式
        this.$notify({
          message: this.$t("message.casting.validPhoto"),
          duration: 2500,
          showClose: false,
          customClass: 'notifyClass'
        });
        this.hanldeRemoveFile();
        return false;
      } else if (!is100M) {
        // 限制小于100M
        this.$notify({
          message: this.$t("message.casting.validPhoto100MB"),
          duration: 2500,
          showClose: false,
          customClass: 'notifyClass'
        });
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
        const added = await this.ipfsClient.add(ipfsFile, { progress: (prog) => console.log(`received: ${prog}`) });
        that.isUploadSuccess = true;
        that.uploadPhotoUrl = `${settingConfig.ipfsNFTUrl + added.path}`;
        console.log('==added.path==', added.path);
        setTimeout(() => {
          that.isShowUploadGif = false;
        }, 1000);
        console.log(' this.uploadPhotoUrl =', this.uploadPhotoUrl);
      } catch (error) {
        this.isShowUploadGif = false;
        this.hanldeRemoveFile();
        this.$notify({ message: error, duration: 2500, showClose: false, customClass: 'notifyClass' });
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
    // 返回上一页面
    handleClickBack() {
      this.nextIndex = 0;
    },
    // 铸造商品类/艺术类NFT
    async handleClickCastNFT(index) {
      if (!this.isConnectWallet) {
        this.$notify({message: this.$t("message.casting.connectWallet"), duration: 2500, showClose: false, customClass: 'notifyClass'});
        return;
      }
      // 判断是否已经绑定上级了
      if (!this.isBindSuperAddress) {
        this.handlClickBindSuperior();
        return;
      }
      if (this.isSpecialSeller) {
        this.createShop(index);
        return
      }
      if (index === 0) {
        if (isStringEmpty(this.nftName)) {
          this.$notify({message: this.$t("message.casting.uploadNFTName"), duration: 2500, showClose: false, customClass: 'notifyClass'});
          return;
        } else if (isStringEmpty(this.nftDescripition)) {
          this.$notify({message: this.$t("message.casting.uploadNFTDesc"), duration: 2500, showClose: false, customClass: 'notifyClass'});
          return;
        } else if (isStringEmpty(this.nftPrice)) {
          this.$notify({message: this.$t("message.casting.uploadNFTPrice"), duration: 2500, showClose: false, customClass: 'notifyClass'});
          return;
        } else if (isObjectEmpty(this.nftFItem)) {
          this.$notify({message: this.$t("message.casting.uploadNFTCategory"), duration: 2500, showClose: false, customClass: 'notifyClass'
          });
          return;
        } else if (isObjectEmpty(this.nftSItem)) {
          this.$notify({message: this.$t("message.casting.uploadNFTCategory"), duration: 2500, showClose: false, customClass: 'notifyClass'});
          return;
        } else if (isStringEmpty(this.uploadPhotoUrl)) {
          this.$notify({message: this.$t("message.casting.uploadNFTPhoto"), duration: 2500, showClose: false, customClass: 'notifyClass'});
          return;
        }else if (!this.aladPayWay && !this.busdPayWay) {
          this.$notify({message: this.$t("message.casting.payWayMsg"), duration: 2500, showClose: false, customClass: 'notifyClass'});
          return;
        }
        // 当选择铸造的是常规类艺术品的时候可以进行下一步操作、艺术类就直接铸造了
        if (this.castingType === '1') {
          this.nextIndex = 1;
          return;
        }
      }
      if (isStringEmpty(this.phoneNum) && this.castingType === '1') {
        this.$notify({message: this.$t("message.casting.uploadNFTPhone"), duration: 2500, showClose: false, customClass: 'notifyClass'});
        return;
      } else if (isStringEmpty(this.phoneAearNum) && this.castingType === '1') {
        this.$notify({message: this.$t("message.casting.uploadNFTPhoneArea"), duration: 2500, showClose: false, customClass: 'notifyClass'});
        return;
      } else if (isStringEmpty(this.qqNum) && isStringEmpty(this.weChatNum) && isStringEmpty(this.telegramNum) && isStringEmpty(this.skypeNum) && isStringEmpty(this.bbmNum) && this.castingType === '1') {
        this.$notify({message: this.$t("message.casting.uploadOtherContact"), duration: 2500, showClose: false, customClass: 'notifyClass'});
        return;
      }

      /* first, upload to IPFS */
      const mapDict = {};
      // const length = settingConfig.ipfsNFTUrl.length;
      // this.uploadPhotoUrl.substring(length)
      mapDict['image'] = this.uploadPhotoUrl;
      mapDict['name'] = this.nftName;
      mapDict['description'] = this.nftDescripition;
      mapDict['nftPrice'] = this.nftPrice;
      mapDict['nftPhone'] = this.castingType === '2' ? '' : (this.phoneAearNum + ' ' + this.phoneNum);
      mapDict['qqNum'] = this.castingType === '2' ? '' : this.qqNum;
      mapDict['weChatNum'] = this.castingType === '2' ? '' : this.weChatNum;
      mapDict['telegramNum'] = this.castingType === '2' ? '' : this.telegramNum;
      mapDict['skypeNum'] = this.castingType === '2' ? '' : this.skypeNum;
      mapDict['bbmNum'] = this.castingType === '2' ? '' : this.bbmNum;
      console.log('mapDict data =', mapDict);
      const data = JSON.stringify(mapDict);
      try {
        const that = this;
        that.$loading.showLoading();
        // 将数据信息更新到IPFS上
        const added = await that.ipfsClient.add(data);
        const nftUrl = added.path;
        console.log('nftUrl =', nftUrl);
        // 开始创建NFT
        const nftData = {};
        nftData['tokenURL'] = nftUrl;
        nftData['address'] = that.walletAddress;
        nftData['fSort'] = that.nftFItem.id;
        nftData['sSort'] = that.nftSItem.id;
        nftData['price'] = that.nftPrice;
        // 艺术类/商品类才存在的参数
        nftData['nftType'] = that.castingType;
        // 支付类型 0 alad 1 busd 2 alad/busd
        let payWay = that.aladPayWay ? '0' : '1';
        if (that.aladPayWay && that.busdPayWay) {
          payWay = '2';
        }
        nftData['payType'] = payWay;
        // 开始铸造NFT
        let result = await that.$decentralized.createToken(nftData, that.connectWalletType);
        if (result) {
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
      } catch (error) {
        this.$loading.hiddenLoading();
        this.clearControlData();
        this.$notify({ message: error.message, duration: 2500, showClose: false, customClass: 'notifyClass' });
        console.log('Error message: ', error)
      }
    },
    // 创建商店类商品
    async createShop(index) {
      let that = this;
      if (index === 0) {
        if (this.uploadHeaderUrl.length === 0) {
          this.$notify({message: this.$t("message.casting.uploadMainPhoto"), duration: 2500, showClose: false, customClass: 'notifyClass'});
          return;
        } else if (isStringEmpty(this.nftName)) {
          this.$notify({message: this.$t("message.casting.shopDesc1"), duration: 2500, showClose: false, customClass: 'notifyClass'});
          return;
        } else if (isStringEmpty(this.nftDescripition)) {
          this.$notify({message: this.$t("message.casting.shopDesc3"), duration: 2500, showClose: false, customClass: 'notifyClass'});
          return;
        } else if (isStringEmpty(this.nftPrice)) {
          this.$notify({message: this.$t("message.casting.shopDesc2"), duration: 2500, showClose: false, customClass: 'notifyClass'});
          return;
        }else if (!this.aladPayWay && !this.busdPayWay) {
          this.$notify({message: this.$t("message.casting.payWayMsg"), duration: 2500, showClose: false, customClass: 'notifyClass'});
          return;
        }
        // 当选择铸造的是常规类艺术品的时候可以进行下一步操作、艺术类就直接铸造了
        this.nextIndex = 1;
        return;
      }
      if (isStringEmpty(this.phoneNum)) {
        this.$notify({message: this.$t("message.casting.uploadNFTPhone"), duration: 2500, showClose: false, customClass: 'notifyClass'});
        return;
      } else if (isStringEmpty(this.phoneAearNum)) {
        this.$notify({message: this.$t("message.casting.uploadNFTPhoneArea"), duration: 2500, showClose: false, customClass: 'notifyClass'});
        return;
      } else if (isStringEmpty(this.qqNum) && isStringEmpty(this.weChatNum) && isStringEmpty(this.telegramNum) && isStringEmpty(this.skypeNum) && isStringEmpty(this.bbmNum)) {
        this.$notify({message: this.$t("message.casting.uploadOtherContact"), duration: 2500, showClose: false, customClass: 'notifyClass'});
        return;
      }
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
      mapDict['sender'] = this.walletAddress.toLowerCase();
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
      this.handleClickBack();
      this.needGakaNum = 0;
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
      this.classificationOneIndex = 0;
      this.fileList = [];
      this.mainFileList = [];
      this.uploadMainUrl = [];
      this.uploadHeaderUrl = [];
      if (this.$refs.upload) {
        setTimeout(() => this.$refs.upload.clearFiles(), 100);
      }
    },
  },
};
</script>

<style lang="scss" scoped>

.casting {
  padding-top: 0.1px;
  margin: 0 auto;
  display: flex;
  height: 100%;
  flex-direction: column;
  background-color: #202136;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  .c_top {
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
  .c_body {
    z-index: 1;
    flex: 1 1 auto;
    max-height: 100%;
    padding: 0 vw(30);
    overflow: hidden;
    .c_left {
      display: flex;
      flex-direction: column;
      max-height: 100%;
      overflow: hidden;
      .c_title {
        flex: none;
        margin-top: vw(140);
        line-height: vw(79);
        font-size: vw(60);
        text-align: left;
        word-break: normal;
        font-family: MicrosoftYaqiHei, sans-serif;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        user-select: none;
        color: var(--white);
      }
      .c_radio {
        flex: none;
        margin-top: vw(40);
        .van-radio-image {
          width: vw(44);
          height: vw(44);
        }
        .van-radio-text {
          font-family: PingFangSC-Semibold, sans-serif;
          font-size: vw(28);
          font-weight: 600;
          font-stretch: normal;
          font-style: normal;
          line-height: vw(44);
          letter-spacing: normal;
          text-align: center;
          color: white;
        }
      }
      .c_left_body {
        margin: vw(20) 0 0;
        flex: 1 1 auto;
        max-height: 100%;
        overflow: auto;
        .c_upload_tips {
          font-family: PingFangSC-Regular, sans-serif;
          font-size: vw(20);
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          text-align: left;
          color: #9a55dc;
        }
        .c_l_upload {
          margin: vw(40) 0 0;
          position: relative;
          width: vw(690);
          height: vw(690);
          border-radius: vw(20);
          cursor: pointer;
          user-select: none;
          background-color: #202136;
          box-sizing: border-box;
          background-size: 100% 100%;
          background-repeat: no-repeat;
          background-image: url('../../../assets/laboras/icon_l_upload.svg');
          .c_l_u_nomal {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: vw(690);
            height: vw(690);

            img {
              width: vw(210);
              height: vw(210);
            }

            span {
              margin-top: vw(17);
              font-family: PingFangSC, sans-serif;
              font-size: vw(38);
              font-weight: 500;
              font-stretch: normal;
              font-style: normal;
              line-height: normal;
              letter-spacing: normal;
              text-align: center;
              color: white;
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
              width: vw(690);
              height: vw(690);
            }
          }
          .c_l_gif {
            position: absolute;
            width: vw(300);
            height: vw(300);
            top: vw(0);
            bottom: 0;
            right: 0;
            margin: auto;
            left: vw(0);
          }
        }
        .c_l_pay {
          margin: vw(40) auto 0;
          .c_l_text {
            font-family: PingFangSC-Regular, sans-serif;
            font-size: vw(28);
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
            margin-top: vw(20);
            width: vw(690);
            height: vw(100);
            .c_l_left {
              display: flex;
              align-items: center;
              padding-left: vw(33);
              width: vw(335);
              height: 100%;
              border-radius: vw(10);
              border: solid 1px #4f5776;
              background-color: #363652;;
              img {
                width: vw(44);
                height: vw(44);
                &:last-child {
                  margin-left: vw(113);
                }
              }
              span {
                margin-left: vw(20);
                font-family: "PingFang SC", sans-serif;
                font-size: vw(26);
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
        .c_l_sort {
          margin-top: vw(40);

          .m_d_s_item {
            width: 100%;
            height: vw(100);
            border-radius: vw(10);
            cursor: pointer;
            user-select: none;
            border: solid 1px #4f5776;
            background-color: #363652;
            display: flex;
            align-items: center;
            position: relative;

            span {
              padding-left: vw(40);
              width: 100%;
              font-size: vw(28);
              font-family: Ubuntu;
              line-height: vw(100);
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              text-align: left;
              user-select: none;
              color: var(--white);
            }

            img {
              width: vw(44);
              height: vw(44);
              margin-right: vw(50);
            }

            .m_d_s_drownBox {
              width: 100%;
              height: 240px;
              position: absolute;
              top: vw(80);
              left: 0;
              border-radius: vw(8);
              overflow-y: scroll;
              z-index: 999;
              background-color: var(--bgc16);

              .m_d_s_d_text {
                height: vw(40);
                line-height: vw(40);
                text-align: center;
                font-family: Poppins;
                font-size: vw(14);
                font-weight: normal;
                font-stretch: normal;
                font-style: normal;
                color: var(--white);
                background-color: transparent;
              }
            }
          }
        }
        .c_l_title {
          display: flex;
          justify-content: space-between;

          span {
            line-height: vw(31);
            font-size: vw(28);
            font-family: Ubuntu-Bold;
            font-weight: bold;
            text-align: left;
            user-select: none;
            font-stretch: normal;
            font-style: normal;
            color: var(--primary);
            margin-right: vw(50);

            &:first-child {
              color: var(--white);
              margin-right: 0;
            }
          }

          .c_l_d_right {
            span {
              line-height: vw(23);
              font-size: vw(20);
              font-weight: normal;
              user-select: none;
              font-family: Ubuntu;
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
        .c_l_desc {
          margin-top: vw(45);
        }
        .c_l_desc1 {
          margin-top: vw(35);
        }
        .c_l_input {
          margin-top: vw(40);
          height: vw(100);
          border-radius: vw(10);
          border: solid 1px #4f5776;
          background-color: #1b1b33;

          input {
            padding-left: vw(30);
            width: 100%;
            height: 100%;
            border: 0; // 去除未选中状态边框
            outline: none; // 去除选中状态边框
            font-size: vw(26);
            font-family: PingFangSC, sans-serif;
            font-weight: normal;
            box-sizing: border-box;
            background-color: transparent;
            word-break: break-all;
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
        .c_l_des_input {
          height: vw(240);

          textarea {
            background-color: black;
            width: 100%;
            height: 100%;
            color: white;
            font-size: 48px;
          }

          textarea {
            padding: vw(25) vw(30);
            width: 100%;
            height: 100%;
            border: 0; // 去除未选中状态边框
            outline: none; // 去除选中状态边框
            font-size: vw(26);
            font-family: PingFangSC, sans-serif;
            font-weight: normal;
            box-sizing: border-box;
            background-color: transparent;
            word-break: break-all;
            color: var(--white);

            &::-webkit-outer-spin-button,
            &::-webkit-inner-spin-button {
              -webkit-appearance: none;
            }

            /* 火狐 */
            &[type="number"] {
              -moz-appearance: textfield;
            }

            &::-webkit-input-placeholder {
              color: #373752;
              font-size: vw(26);
            }

            &:-moz-placeholder {
              /* FF 4-18 */
              color: #373752;
              font-size: vw(26);
            }

            &::-moz-placeholder {
              /* FF 19+ */
              color: #373752;
              font-size: vw(26);
            }

            &:-ms-input-placeholder {
              /* IE 10+ */
              color: #373752;
              font-size: vw(26);
            }

            &:-webkit-autofill {
              transition: background-color 5000s ease-in-out 0s; //背景颜色
            }
          }
        }
        .c_l_description {
          margin-top: 6px;
          height: 144px;
          border-radius: 4px;
          background-color: var(--bgc16);

          textarea {
            margin-top: 20px;
            width: 90%;
            height: 80%;
            border: 0; // 去除未选中状态边框
            resize: none;
            outline: none; // 去除选中状态边框
            font-size: 16px;
            font-family: Poppins;
            font-weight: normal;
            box-sizing: border-box;
            background-color: transparent;
            color: var(--white);
          }

          textarea::-webkit-input-placeholder {
            color: var(--white);
            font-size: 15px;
          }

          textarea:-moz-placeholder {
            /* FF 4-18 */
            color: var(--white);
            font-size: 15px;
          }

          textarea::-moz-placeholder {
            /* FF 19+ */
            color: var(--white);
            font-size: 15px;
          }

          textarea:-ms-input-placeholder {
            /* IE 10+ */
            color: var(--white);
            font-size: 15px;
          }

          textarea:-webkit-autofill {
            transition: background-color 5000s ease-in-out 0s; //背景颜色
          }
        }
        .c_l_price_input {
          margin-top: vw(40);
          display: flex;
          align-items: center;
          justify-content: space-between;

          .c_l_input {
            margin-top: 0;
            width: vw(460);
          }

          .c_l_price_input_usdt {
            display: flex;
            align-items: center;
            justify-content: center;
            width: vw(200);
            height: vw(100);
            border-radius: vw(10);
            border: solid 1px #4f5776;
            background-color: #363652;

            span {
              margin-left: vw(20);
              font-size: vw(26);
              font-family: PingFangSC, sans-serif;
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              color: var(--white);
            }

            img {
              width: vw(44);
              height: vw(44);
            }
          }
        }
      }
    }
    .c_special {
      display: flex;
      flex-direction: column;
      max-height: 100%;
      overflow: hidden;
      .c_title {
        flex: none;
        margin-top: vw(140);
        line-height: vw(79);
        font-size: vw(60);
        text-align: left;
        word-break: normal;
        font-family: MicrosoftYaqiHei, sans-serif;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        user-select: none;
        color: var(--white);
      }
      .c_left_body {
        margin: vw(20) 0 0;
        flex: 1 1 auto;
        max-height: 100%;
        overflow: auto;
        .c_upload_tips {
          font-family: PingFangSC-Regular, sans-serif;
          font-size: vw(20);
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          text-align: left;
          color: #9a55dc;
        }
        .c_l_upload {
          margin: vw(26) 0 0;
          padding: vw(36) vw(18) vw(20) vw(18);
          width: vw(690);
          min-height: vw(402);
          border-radius: vw(20);
          cursor: pointer;
          user-select: none;
          box-sizing: border-box;
          background-color: #202136;
          background-repeat: no-repeat;
          border: solid 1px #4f5776;
          text-align: left;
          input {
            width: 100%;
            height: vw(40);
            border: 0; // 去除未选中状态边框
            outline: none; // 去除选中状态边框
            font-size: vw(26);
            font-family: PingFangSC, sans-serif;
            font-weight: normal;
            box-sizing: border-box;
            background-color: transparent;
            word-break: break-all;
            color: var(--white);

            &::-webkit-outer-spin-button,
            &::-webkit-inner-spin-button {
              -webkit-appearance: none;
            }

            /* 火狐 */
            &[type="number"] {
              -moz-appearance: textfield;
            }

            &::-webkit-input-placeholder {
              color: #373752;
              font-size: vw(26);
            }

            &:-moz-placeholder {
              /* FF 4-18 */
              color: #373752;
              font-size: vw(26);
            }

            &::-moz-placeholder {
              /* FF 19+ */
              color: #373752;
              font-size: vw(26);
            }

            &:-ms-input-placeholder {
              /* IE 10+ */
              color: #373752;
              font-size: vw(26);
            }

            &:-webkit-autofill {
              transition: background-color 5000s ease-in-out 0s; //背景颜色
            }
          }
          .van-uploader {
            margin-top: vw(53);
            /deep/ .van-image {
              width: vw(200);
              height: vw(200);
              overflow: hidden;
              border-radius: vw(20);
            }
          }
          .c_l_upload_tip {
            margin-top: vw(20);
            font-family: PingFangSC-Regular, sans-serif;
            font-size: vw(24);
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: normal;
            letter-spacing: normal;
            text-align: left;
            color: #9a55dc;
          }
        }
        .c_l_pay {
          margin: vw(40) auto 0;
          .c_l_text {
            font-family: PingFangSC-Regular, sans-serif;
            font-size: vw(28);
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
            margin-top: vw(20);
            width: vw(690);
            height: vw(100);
            .c_l_left {
              display: flex;
              align-items: center;
              padding-left: vw(33);
              width: vw(335);
              height: 100%;
              border-radius: vw(10);
              border: solid 1px #4f5776;
              background-color: #363652;;
              img {
                width: vw(44);
                height: vw(44);
                &:last-child {
                  margin-left: vw(113);
                }
              }
              span {
                margin-left: vw(20);
                font-family: "PingFang SC", sans-serif;
                font-size: vw(26);
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
        .c_l_upload_main {
          margin: vw(20) 0 0;
          padding: 0 vw(18);
          width: vw(690);
          min-height: vw(303);
          border-radius: vw(20);
          cursor: pointer;
          user-select: none;
          box-sizing: border-box;
          background-color: #202136;
          background-repeat: no-repeat;
          border: solid 1px #4f5776;
          text-align: left;

          input {
            margin-top: 36px;
            padding-left: vw(28);
            width: 100%;
            height: vw(40);
            border: 0; // 去除未选中状态边框
            outline: none; // 去除选中状态边框
            font-size: vw(26);
            font-family: PingFangSC, sans-serif;
            font-weight: normal;
            box-sizing: border-box;
            background-color: transparent;
            word-break: break-all;
            color: var(--white);

            &::-webkit-outer-spin-button,
            &::-webkit-inner-spin-button {
              -webkit-appearance: none;
            }

            /* 火狐 */
            &[type="number"] {
              -moz-appearance: textfield;
            }

            &::-webkit-input-placeholder {
              color: #373752;
              font-size: vw(26);
            }

            &:-moz-placeholder {
              /* FF 4-18 */
              color: #373752;
              font-size: vw(26);
            }

            &::-moz-placeholder {
              /* FF 19+ */
              color: #373752;
              font-size: vw(26);
            }

            &:-ms-input-placeholder {
              /* IE 10+ */
              color: #373752;
              font-size: vw(26);
            }

            &:-webkit-autofill {
              transition: background-color 5000s ease-in-out 0s; //背景颜色
            }
          }

          .van-uploader {
            margin-top: vw(30);
            /deep/ .van-image {
              width: vw(200);
              height: vw(200);
              overflow: hidden;
              border-radius: vw(20);
            }
          }

          .c_l_upload_tip {
            margin: vw(20) 0;
            font-family: PingFangSC-Regular, sans-serif;
            font-size: vw(24);
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: normal;
            letter-spacing: normal;
            text-align: left;
            color: #9a55dc;
          }
        }
        .c_l_text {
          margin: vw(40) auto 0;
          font-family: PingFangSC-Regular, sans-serif;
          font-size: vw(28);
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          text-align: left;
          color: white;
        }
        .c_l_sort {
          margin-top: vw(40);

          .m_d_s_item {
            width: 100%;
            height: vw(100);
            border-radius: vw(10);
            cursor: pointer;
            user-select: none;
            border: solid 1px #4f5776;
            background-color: #363652;
            display: flex;
            align-items: center;
            position: relative;

            span {
              padding-left: vw(40);
              width: 100%;
              font-size: vw(28);
              font-family: Ubuntu;
              line-height: vw(100);
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              text-align: left;
              user-select: none;
              color: var(--white);
            }

            img {
              width: vw(44);
              height: vw(44);
              margin-right: vw(50);
            }

            .m_d_s_drownBox {
              width: 100%;
              height: 240px;
              position: absolute;
              top: vw(80);
              left: 0;
              border-radius: vw(8);
              overflow-y: scroll;
              z-index: 999;
              background-color: var(--bgc16);

              .m_d_s_d_text {
                height: vw(40);
                line-height: vw(40);
                text-align: center;
                font-family: Poppins;
                font-size: vw(14);
                font-weight: normal;
                font-stretch: normal;
                font-style: normal;
                color: var(--white);
                background-color: transparent;
              }
            }
          }
        }
        .c_l_title {
          display: flex;
          justify-content: space-between;

          span {
            line-height: vw(31);
            font-size: vw(28);
            font-family: Ubuntu-Bold;
            font-weight: bold;
            text-align: left;
            user-select: none;
            font-stretch: normal;
            font-style: normal;
            color: var(--primary);
            margin-right: vw(50);

            &:first-child {
              color: var(--white);
              margin-right: 0;
            }
          }

          .c_l_d_right {
            span {
              line-height: vw(23);
              font-size: vw(20);
              font-weight: normal;
              user-select: none;
              font-family: Ubuntu;
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
        .c_l_desc {
          margin-top: vw(45);
        }
        .c_l_desc1 {
          margin-top: vw(35);
        }
        .c_l_input {
          margin-top: vw(40);
          height: vw(100);
          border-radius: vw(10);
          border: solid 1px #4f5776;
          background-color: #1b1b33;

          input {
            padding-left: vw(30);
            width: 100%;
            height: 100%;
            border: 0; // 去除未选中状态边框
            outline: none; // 去除选中状态边框
            font-size: vw(26);
            font-family: PingFangSC, sans-serif;
            font-weight: normal;
            box-sizing: border-box;
            background-color: transparent;
            word-break: break-all;
            color: var(--white);

            &::-webkit-outer-spin-button,
            &::-webkit-inner-spin-button {
              -webkit-appearance: none;
            }

            /* 火狐 */
            &[type="number"] {
              -moz-appearance: textfield;
            }

            &::-webkit-input-placeholder {
              color: #373752;
              font-size: vw(26);
            }

            &:-moz-placeholder {
              /* FF 4-18 */
              color: #373752;
              font-size: vw(26);
            }

            &::-moz-placeholder {
              /* FF 19+ */
              color: #373752;
              font-size: vw(26);
            }

            &:-ms-input-placeholder {
              /* IE 10+ */
              color: #373752;
              font-size: vw(26);
            }

            &:-webkit-autofill {
              transition: background-color 5000s ease-in-out 0s; //背景颜色
            }
          }
        }
        .c_l_des_input {
          height: vw(240);

          textarea {
            background-color: black;
            width: 100%;
            height: 100%;
            color: white;
            font-size: 48px;
          }

          textarea {
            padding: vw(25) vw(30);
            width: 100%;
            height: 100%;
            border: 0; // 去除未选中状态边框
            outline: none; // 去除选中状态边框
            font-size: vw(26);
            font-family: PingFangSC, sans-serif;
            font-weight: normal;
            box-sizing: border-box;
            background-color: transparent;
            word-break: break-all;
            color: var(--white);

            &::-webkit-outer-spin-button,
            &::-webkit-inner-spin-button {
              -webkit-appearance: none;
            }

            /* 火狐 */
            &[type="number"] {
              -moz-appearance: textfield;
            }

            &::-webkit-input-placeholder {
              color: #373752;
              font-size: vw(26);
            }

            &:-moz-placeholder {
              /* FF 4-18 */
              color: #373752;
              font-size: vw(26);
            }

            &::-moz-placeholder {
              /* FF 19+ */
              color: #373752;
              font-size: vw(26);
            }

            &:-ms-input-placeholder {
              /* IE 10+ */
              color: #373752;
              font-size: vw(26);
            }

            &:-webkit-autofill {
              transition: background-color 5000s ease-in-out 0s; //背景颜色
            }
          }
        }
        .c_l_description {
          margin-top: 6px;
          height: 144px;
          border-radius: 4px;
          background-color: var(--bgc16);

          textarea {
            margin-top: 20px;
            width: 90%;
            height: 80%;
            border: 0; // 去除未选中状态边框
            resize: none;
            outline: none; // 去除选中状态边框
            font-size: 16px;
            font-family: Poppins;
            font-weight: normal;
            box-sizing: border-box;
            background-color: transparent;
            color: var(--white);
          }

          textarea::-webkit-input-placeholder {
            color: var(--white);
            font-size: 15px;
          }

          textarea:-moz-placeholder {
            /* FF 4-18 */
            color: var(--white);
            font-size: 15px;
          }

          textarea::-moz-placeholder {
            /* FF 19+ */
            color: var(--white);
            font-size: 15px;
          }

          textarea:-ms-input-placeholder {
            /* IE 10+ */
            color: var(--white);
            font-size: 15px;
          }

          textarea:-webkit-autofill {
            transition: background-color 5000s ease-in-out 0s; //背景颜色
          }
        }
        .c_l_price_input {
          margin-top: vw(40);
          display: flex;
          align-items: center;
          justify-content: space-between;

          .c_l_input {
            margin-top: 0;
            width: vw(460);
          }

          .c_l_price_input_usdt {
            display: flex;
            align-items: center;
            justify-content: center;
            width: vw(200);
            height: vw(100);
            border-radius: vw(10);
            border: solid 1px #4f5776;
            background-color: #363652;

            span {
              margin-left: vw(20);
              font-size: vw(26);
              font-family: PingFangSC, sans-serif;
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              color: var(--white);
            }

            img {
              width: vw(44);
              height: vw(44);
            }
          }
        }
      }
    }
    .c_right {
      width: vw(690);
      max-height: 100%;
      overflow: auto;

      .c_r_item {
        margin-top: vw(30);

        .c_r_i_left {
          display: flex;
          align-items: center;
          position: relative;

          img {
            width: vw(36);
            height: vw(36);
          }

          span {
            margin-left: vw(14);
            line-height: vw(40);
            font-size: vw(28);
            font-weight: bold;
            font-family: PingFangSC-Semibold, sans-serif;
            font-stretch: normal;
            font-style: normal;
            color: var(--white);
          }

          .c_r_i_l_prompt {
            position: absolute;
            font-family: PingFangSC-Semibold, sans-serif;
            right: vw(10);
            font-size: vw(28);
            font-weight: normal;
            color: var(--primary);
          }
        }

        .c_r_i_right {
          height: vw(100);
          margin-top: vw(20);
          border-radius: vw(10);
          border: solid 1px #4f5776;
          background-color: #1b1b33;

          input {
            width: 100%;
            height: 100%;
            padding-left: vw(50);
            border: 0; // 去除未选中状态边框
            outline: none; // 去除选中状态边框
            font-size: vw(26);
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

        .c_r_i_phone {
          display: flex;
          align-items: center;

          div {
            margin-left: vw(50);
            font-size: vw(26);
            font-stretch: normal;
            font-style: normal;
            font-family: PingFangSC-Semibold, sans-serif;
            user-select: none;
            cursor: pointer;
            color: var(--white);

            &:nth-child(3) {
              width: 1px;
              margin-left: 0;
              margin-right: vw(10);
            }
          }

          input {
            padding-left: vw(20);
          }

          .c_r_i_p_input {
            padding-left: vw(0);
            width: vw(50);
            height: 100%;
            border: 0; // 去除未选中状态边框
            outline: none; // 去除选中状态边框
            font-size: vw(26);
            font-family: PingFangSC-Regular, sans-serif;
            font-weight: normal;
            box-sizing: border-box;
            text-align: center;
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

      .c_r_item_first {
        margin-top: vw(130);
      }

      .c_r_castPrompt {
        width: vw(634);
        margin: vw(68) 0 vw(20);
        font-size: vw(20);
        text-align: left;
        font-family: PingFangSC, sans-serif;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        user-select: none;
        color: var(--primary);
      }

      .c_r_prompt {
        margin-top: vw(44);
        font-family: PingFangSC, sans-serif;
        font-size: vw(20);
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: left;
        user-select: none;
        color: var(--primary);
      }
    }
  }
  .c_bottom {
    flex: none;
    padding-left: vw(30);
    padding-right: vw(30);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: vw(148);

    .img_back {
      width: vw(90);
      height: vw(90);
      margin-right: vw(30);
    }

    .c_b_next {
      display: flex;
      justify-content: center;
      align-items: center;
      width: vw(570);
      height: vw(90);
      border-radius: vw(10);
      background-image: linear-gradient(93deg, #f109b4 0%, #622fe3 97%);

      span {
        font-family: Poppins;
        font-size: vw(28);
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: normal;
        text-align: center;
        color: var(--white);
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
        background-image: linear-gradient(93deg, #f109b4 0%, #622fe3 97%);
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

    .tailor {
      position: relative;
      width: vw(586);
      height: vw(720);
      border-radius: vw(20);
      background-color: var(--bgc03);

      .t_body {
        width: vw(500);
        height: vw(500);
        margin: vw(90) auto 0;
      }

      .mask_save {
        margin: vw(30) auto;
        width: vw(300);
        height: vw(60);
        border-radius: vw(8);
        line-height: vw(60);
        font-size: vw(28);
        font-family: Poppins;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        cursor: pointer;
        user-select: none;
        color: var(--white);
        background-image: linear-gradient(93deg, #6929af 0%, #3b2999 97%);
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
}

.van-popup {
  height: vw(900);
  //overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #202136;

  .p_top {
    //flex: 0 0 auto;
    padding: 0 vw(30);
    height: vw(88);
    background-color: #27273f;

    .p_line {
      width: vw(100);
      height: vw(8);
      margin: vw(30) auto vw(56);
      border-radius: vw(5);
      background-color: #fff;
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
      width: vw(570);
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
  }
}
/deep/ .el-upload {
  width: 100% !important;
  height: vw(160) !important;
}
/deep/ .el-upload-dragger {
  width: 100% !important;
  height: vw(690) !important;
  background-color: transparent !important;
  border: 0;
}
/deep/ .van-uploader__preview-image {
  width: vw(200);
  height: vw(200);
}
/deep/ .van-uploader__preview-delete {
  width: vw(40);
  height: vw(40);
  border-radius: 0 0 0 vw(20);
  .van-uploader__preview-delete-icon {
    font-size: vw(40);
  }
}
/deep/ .van-radio__label {
  height: vw(44);
}
/deep/ .van-radio__icon {
  font-size: vw(44);
}


</style>
