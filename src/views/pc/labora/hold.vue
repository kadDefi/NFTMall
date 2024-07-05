<template>
  <div class="hold">
    <div v-if="holdDataList.length <= 0" class="s_empty">{{ $t("message.holding.empty") }}</div>
    <div v-else class="s_contian" @scroll="scrollEvent">
      <hold-card :marketList="holdDataList" @handleClickItem="handleClickItem"></hold-card>
    </div>
    <!-- 查看NFT -->
    <div class="mask" v-show="showHoldMaks" @touchmove.prevent @mousewheel.prevent>
      <div v-if="selectedItem.headType === 1 && selectedItem.type === 0" class="m_contian m_contian1">
        <div class="m_c_wrapper">
          <div class="m_c_icon">
            <img :src="selectedItem.picurl" alt="logo">
          </div>
          <div class="m_c_right">
            <div class="m_dis_title">{{ selectedItem.userName }}</div>
            <div class="m_dis_title">{{ selectedItem.nftName }}</div>
            <div class="m_dis_title">{{ $t("message.holding.CastingPrice") }}</div>
            <div class="m_p_c_usdt">
              <img src="../../../assets/newPhones/universal/icon_usdt_coin.svg" alt="">
              <span>{{ selectedItem.castingprice | roundingDecimals(4) }}</span>
            </div>
          </div>
        </div>
        <div class="m_dis_sell m_dis_destory1" @click="handleClickConfirm(3)">
          <span>{{ $t("message.holding.submitAddressInfo") }}</span>
        </div>
        <img class="mask_close" src="../../../assets/newPhones/nLaboratory/icon_qb_close.svg" alt="logo" @click="hanleClickCloseHoldMaks(1)">
      </div>
      <div v-else class="m_contian">
        <div class="m_c_wrapper">
          <div class="m_c_icon">
            <!--<router-link :to="{path:'/nftdetial',query:{item:selectedItem.tokenid,item1:false}}" @click.native="handleClickCheckNFT">-->
              <img :src="selectedItem.picurl" alt="logo">
              <!--<div class="m_c_i_bottom">
                <img src="../../../assets/laboras/h5_icon_l_check.svg" alt="logo">
                <span>{{ $t("message.holding.Check") }}</span>
              </div>-->
           <!-- </router-link>-->
          </div>
          <div class="m_c_right">
            <div class="m_dis_title">{{ selectedItem.userName }}</div>
            <div class="m_dis_title m_dis_title1">{{ selectedItem.nftName }}</div>
            <div class="m_dis_title">{{ $t("message.holding.BuyPrice") }}</div>
            <div class="m_p_c_usdt">
              <img src="../../../assets/newPhones/universal/icon_usdt_coin.svg" alt="">
              <span>{{ selectedItem.sellprice | roundingDecimals(2) }}</span>
            </div>
          </div>
        </div>
        <div class="m_dis_title m_dis_desc">{{ $t("message.holding.Classification") }}</div>
        <div class="m_dis_sort">
          <div class="m_d_s_item text-ellipsis">
            <span>{{ isEnglish ? selectedItem.classifyen1 : selectedItem.classifych1 }}</span>
          </div>
          <div class="m_d_s_item text-ellipsis">
            <span>{{ isEnglish ? selectedItem.classifyen2 : selectedItem.classifych2 }}</span>
          </div>
        </div>
        <div class="m_dis_title m_dis_desc m_dis_desc1">{{ $t("message.holding.Price") }} ({{ $t("message.holding.AreaPrice") }}：{{ lowPrice | roundingDecimals(2) }} ~ {{ heighPrice | roundingDecimals(2) }} USDT)</div>
        <div class="m_dis_input">
          <input type="text" v-model="holdSalePrice" :placeholder="placeholderDesc">
        </div>
        <div class="m_confirm_content">
          <div class="m_dis_sell1" @click="handleClickConfirm(1)">{{ saleNFTBtnText }}</div>
          <div class="m_dis_sell1" @click="handleClickConfirm(2)">{{ $t("message.holding.Destroy") }}</div>
        </div>
        <img class="mask_close" src="../../../assets/newPhones/nLaboratory/icon_qb_close.svg" alt="logo" @click="hanleClickCloseHoldMaks(1)">
      </div>
    </div>
    <!-- 收货信息弹框 -->
    <div class="mask1" v-show="showDeliveryMaks" @touchmove.prevent @mousewheel.prevent>
      <div class="m_delivery">
        <div class="m_d_title">{{ $t("message.holding.DeliveryInformation") }}</div>
        <div class="m_d_info">
          <div class="m_d_i_one">
            <span>{{ $t("message.holding.Receiver") }}</span>
            <span>{{ $t("message.holding.CellphoneNumber") }}</span>
          </div>
          <div class="m_d_i_two">
            <div class="m_d_i_item"><input type="text" v-model="deliveryName" :placeholder="placeholderDesc1"></div>
            <div class="m_d_i_item m_d_i_item1">
              <div>+</div>
              <input class="c_r_i_p_input" type="number" v-model="phoneAearNum">
              <div>|</div>
              <input type="text" v-model="deliveryPhone" :placeholder="placeholderDesc2">
            </div>
          </div>
        </div>
        <div class="m_d_area">
          <div class="m_d_a_title">{{ $t("message.holding.Yourarea") }}</div>
          <div class="m_d_a_container">
            <textarea type="text" v-model="deliveryArea" :placeholder="placeholderDesc3"></textarea>
          </div>
        </div>
        <div class="m_d_delivery" @click="handleConfirmDelivery(1)">{{ selectedItem.status === '5' ? $t("message.holding.ConfirmModify") : $t("message.holding.ConfirmDelivery") }}</div>
        <img class="mask_close" src="../../../assets/universal/icon_qb_close.svg" alt="logo" @click="hanleClickCloseHoldMaks(2)">
      </div>
    </div>
    <!-- 待发货/待收货弹框 -->
    <div class="mask" v-show="showDeliveryShippedMaks" @touchmove.prevent @mousewheel.prevent>
      <div class="m_shiped">
        <div class="m_d_title">{{ selectedItem.status === '5' ? $t("message.holding.Tobedelivered") : $t("message.holding.Shipped") }}</div>
        <div class="m_d_address">
          <img src="../../../assets/newPhones/nLaboratory/icon_d_address.svg" alt="">
          <div class="m_d_a_content">
            <div>{{ `${logisticsData.user}   +${logisticsData.number}` }}</div>
            <div class="m_d_a_c_margin">{{ logisticsData.area }}</div>
          </div>
          <img v-if=" selectedItem.status === '5' " class="m_d_edit" src="../../../assets/newPhones/nLaboratory/icon_h_edit.svg" alt="" @click="handleClickEditAddress">
        </div>
        <!--<div class="m_d_remark">备注:xxxxxxxxxxxxx</div>-->
        <div class="m_d_info">
          <div class="m_d_i_one">
            <span>{{ $t("message.holding.Couriercompany") }}</span>
            <div v-if="selectedItem.status === '5' ">
              <span>-</span>
            </div>
            <div v-else-if="selectedItem.status === '6' ">
              <span>{{ logisticsData.expressComp }}</span>
            </div>
          </div>
          <div class="m_d_i_two">
            <span>{{ $t("message.holding.Logisticsordernumber") }}</span>
            <div v-if="selectedItem.status === '5' ">
              <span>-</span>
            </div>
            <div v-else-if="selectedItem.status === '6' ">
              <div class="m_d_i_t_item">
                <span>{{ logisticsData.expressNumber }}</span>
                <img src="../../../assets/laboras/icon_d_copy.svg" alt="logo" @click="handleCopyLogistics">
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="m_d_line"></div>-->
        <!--<div class="m_d_delivery" @click="handleConfirmDelivery(2)">{{ selectedItem.status === '5' ? $t("message.holding.CancelDelivery") : $t("message.holding.ConfirmDeliverys") }}</div>-->
        <div v-if="selectedItem.status === '6'" class="m_d_delivery" @click="handleConfirmDelivery(2)">{{ this.selectedItem.headType === 3 ? $t("message.holding.ConfirmReceipt") : $t("message.holding.ConfirmDeliverys") }}</div>
        <div :class="selectedItem.status === '5' ? 'm_d_delivery1' : ''" class="m_d_delivery m_d_contactCasting" @click="handleConfirmDelivery(3)">{{ $t("message.holding.ContactCasting") }}</div>
        <img class="mask_close" src="../../../assets/newPhones/nLaboratory/icon_qb_close.svg" alt="logo" @click="hanleClickCloseHoldMaks(3)">
      </div>
    </div>
    <!-- 是否上架  -->
    <div class="mask" v-show="showSaleToMarketMaks" @touchmove.prevent @mousewheel.prevent>
      <div class="m_sale">
        <div class="m_s_desc">{{ $t("message.stock.saleMarket") }}?</div>
        <div class="m_s_btn">
          <div @click="handleCancleSaleToMarket(1)">{{ $t("message.stock.No") }}</div>
          <div @click="handleCancleSaleToMarket(2)">{{ $t("message.stock.Yes") }}</div>
        </div>
      </div>
    </div>
    <!-- 联系铸造者  -->
    <div class="mask" v-show="casterInfoData.contactCasterMaks" @touchmove.prevent @mousewheel.prevent>
      <div class="m_contact">
        <div class="m_c_title">{{ $t("message.holding.ContactCasting") }}</div>
        <div class="m_c_line"></div>
        <div class="m_c_avatar">
          <div class="m_c_a_icon">
            <img v-if="isAvatarStringEmpty(casterInfoData.picurl)" src="../../../assets/nfts/icon_n_header.svg" alt="">
            <img v-else :src="casterInfoData.picurl" alt="logo">
          </div>
          <img class="m_c_a_level" :src="require(`../../../assets/laboras/icon_l_level_${casterInfoData.level}.svg`)" alt="">
        </div>
        <div class="m_c_creator">{{ $t("message.labora.creatorNo") }}:  #{{ casterInfoData.number }}</div>
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
            <span>+{{ casterInfoData.phone }}</span>
            <img src="../../../assets/laboras/icon_h_copy.svg" alt="">
          </div>
          <div class="m_c_i1_left" @click="handleClickCopy(2)">
            <span>{{ casterInfoData.qnumber }}</span>
            <img src="../../../assets/laboras/icon_h_copy.svg" alt="">
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
            <span>{{ casterInfoData.wechat }}</span>
            <img src="../../../assets/laboras/icon_h_copy.svg" alt="">
          </div>
          <div class="m_c_i1_left" @click="handleClickCopy(4)">
            <span>{{ casterInfoData.tg }}</span>
            <img src="../../../assets/laboras/icon_h_copy.svg" alt="">
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
            <span>{{ casterInfoData.skype }}</span>
            <img src="../../../assets/laboras/icon_h_copy.svg" alt="">
          </div>
          <div class="m_c_i1_left" @click="handleClickCopy(6)">
            <span>{{ casterInfoData.bbm }}</span>
            <img src="../../../assets/laboras/icon_h_copy.svg" alt="">
          </div>
        </div>
        <img class="mask_close" src="../../../assets/universal/icon_qb_close.svg" alt="logo" @click="hanleClickCloseHoldMaks(4)">
      </div>
    </div>
  </div>
</template>

<script>

const settingConfig = require('../../../settings.js');
import { mapGetters } from 'vuex';
import { isStringEmpty } from '@/utils/validate';
import {
  getCustomerNFTList,
  deliveLogisticsInfoData,
  getExpressLogisticsInfoData,
  cancleDeliveryInfoData,
  getCasterInfo,
  createOrder
} from '@/api/mark'
import constParam from '../../../decentralizedApi/const.js'
import holdCard from '../../../components/holdCard/holdCard.vue';
import { parseNumber } from '@/decentralizedApi/param';
import { chuDivision } from '@/utils/computing';

export default {
  name: "hold",
  components: {'hold-card':holdCard},
  data() {
    return {
      isEnglish:false, // 中英文
      showHoldMaks:false, // NFT详情
      placeholderDesc:this.$t("message.holding.placeholdDesc"),
      // 填写收货信息参数
      showDeliveryMaks:false,// 收货信息弹框
      deliveryName:'',
      phoneAearNum:'86',
      deliveryPhone:'',
      deliveryArea:'',
      placeholderDesc1:this.$t("message.holding.Name"),
      placeholderDesc2:this.$t("message.holding.Number"),
      placeholderDesc3:this.$t("message.holding.AreaDesc"),
      // 待发货/已发货
      logisticsData:'',// 物流信息数据
      showDeliveryShippedMaks:false,// 收货信息弹框
      // 是否上架待上架的NFT
      showSaleToMarketMaks:false,
      // 铸造者赖联系方式
      casterInfoData:{
        contactCasterMaks:false,
        level:0,
        picurl:'',
        number:0,
        phone:'--',
        qnumber:'--',
        wechat:'--',
        tg:'--',
        skype:'--',
        bbm:'--',
      },
      saleNFTBtnText:'', // 出售NFT时候判断是否授权该地址后显示的文本
      selectedItem:'', // 选择查看List中的某个Item
      approveSaleNFTAddress:'',// 授权出售NFT的地址
      holdSalePrice:'', // 出售NFT/商品输入价格
      lowPrice:0, // 重新出售时候最低价
      heighPrice:0, // 重新出售时候最高价
      pageNum:1, // 分页
      moreLoading:false, // 是否是加载中
      noMore:false, // 是否没有数据了
      holdDataList:[], // 数据源
    };
  },
  created() {
    this.isEnglish = window.localStorage.getItem("lang") !== "zh";
    this.getCustomerNFTList(true);
  },
  mounted() {
  },
  destroyed() {
  },
  // 计算属性
  computed: {
    ...mapGetters(['isConnectWallet','walletAddress','connectWalletType']),
  },
  // 监听属性改变
  watch:{
    isConnectWallet(val,oval) {
      if (val) {
        this.getCustomerNFTList(true);
      }else {
        this.hanleClickCloseHoldMaks(1);
        this.hanleClickCloseHoldMaks(2);
        this.hanleClickCloseHoldMaks(3);
        this.hanleClickCloseHoldMaks(4);
        this.showSaleToMarketMaks = false;
        this.holdDataList = [];
      }
    },
    // 监听语言的切换
    '$i18n.locale'(nval,oval) {
       this.isEnglish = nval !== 'zh';
       this.placeholderDesc = this.$t("message.holding.placeholdDesc");
       this.placeholderDesc1 = this.$t("message.holding.Name");
       this.placeholderDesc2 = this.$t("message.holding.Number");
       this.placeholderDesc3 = this.$t("message.holding.AreaDesc");
    },
  },
  // 方法
  methods: {
    // 判断头像是否是空的
    isAvatarStringEmpty(avatar) {
      return isStringEmpty(avatar);
    },
    // 改不出售按钮的状态
    changeBtnStatuTextMsg() {
      let textMsg = this.$t("message.casting.Approve");
      if (this.approveSaleNFTAddress.toLowerCase() === constParam.market_addr.toLowerCase()) {
        textMsg = this.$t("message.holding.Sell");
      }
      this.saleNFTBtnText = textMsg;
    },
    // 滚动事件
    scrollEvent(e) {
      // !this.moreLoading 没有在加载状态，触发加载更多时，把this.moreLoading置未true
      // !this.noMore 没有更多的状态为false，当我们取到的数据长度小于1页的数量时，就没有更多了数据了，把 this.noMore置为true，这样就不会触发无意义的加载更多了
      const ele = e.srcElement ? e.srcElement : e.target;
      if(ele.scrollTop + ele.offsetHeight > ele.scrollHeight - 10 && !this.moreLoading && !this.noMore) {
        this.getCustomerNFTList(false);
        console.log('开始调用再持加载更多接口');
      }
    },
    // 获取用户在持NFT数据
    async getCustomerNFTList(isRefersh) {
      if(!this.isConnectWallet){
         return;
      }
      this.moreLoading = true;
      if (isRefersh) {
        this.pageNum = 1;
        this.noMore = false;
      }else {
        this.pageNum++;
      }
      const dict = {};
      dict['status'] = '2'; // 1: 在售 2: 在持 3:待交割
      dict['address'] = this.walletAddress; // 用户地址
      dict['page'] = this.pageNum; // 当前第几页
      dict['count'] = 20;
      const that = this;
      const result = await getCustomerNFTList(dict);
      if (result.status === 200) {
        result.data.result.forEach((item) => {
          const newStr = item.picurl.indexOf("https");
          if (newStr === -1) {
            item.picurl = `${settingConfig.ipfsNFTUrl + item.picurl}`
          }
        });
        if (isRefersh){
          that.holdDataList = result.data.result;
        }else {
          that.holdDataList.push(...result.data.result);
        }
        // 将状态机设置对应状态
        that.moreLoading = false;
        // 当我们取到的数据长度小于1页的数量时，就没有更多了数据了
        if (result.data.result.length < 20) {
          that.noMore = true;
        }
      }else {
        that.moreLoading = false;
        that.$notify({message: result.data,duration: 2500,showClose:false,customClass:'notifyClass'});
      }
      console.log('在持NFT列表',result);
    },
    // 查看NFT
    async handleClickItem(item) {
      // type  0 表示这个NFT是我购买的 1 表示这个NFT是我铸造的
      // status 0 待审核  5 待发货   6 待发货  8 待上架
      if (item.status === '0') {
        return;
      }
      // 如果非0的则可以进行修改
      this.selectedItem = item;
      if (item.status === '5' || item.status === '6') { // 5 待发货  6 待发货
        const dict = {};
        dict['address'] = this.walletAddress;
        dict['tokenid'] = this.selectedItem.tokenid;
        const that = this;
        const result = await getExpressLogisticsInfoData(dict);
        console.log('物流信息数据 =',result);
        if (result.status === 200) {
          const data = result.data.userData;
          data['expressComp'] = result.data.outData.expressComp;
          data['expressNumber'] = result.data.outData.expressNumber;
          that.logisticsData = data;
          that.showDeliveryShippedMaks = true;
          console.log('物流信息数据 =',that.logisticsData);
        }else {
          that.$notify({message: result.data,duration: 2500,showClose:false,customClass:'notifyClass'});
        }
      }else if (item.status === '8') {
        this.showSaleToMarketMaks = true;
      } else {
        this.showHoldMaks = true;
        // 选择查看某个NFT时候去获取当前NFT授权出售的地址
        this.changeBtnStatuTextMsg();
        this.getNFTApprovedSaleAddress();
        this.getXYpercent();
      }
    },
    // 关闭查看NFT
    hanleClickCloseHoldMaks(index) {
      if (index === 1) {
        this.holdSalePrice = '';
        this.selectedItem = '';
        this.showHoldMaks = false;
      }else if(index === 2) {
        this.phoneAearNum = '86';
        this.deliveryName = '';
        this.deliveryPhone = '';
        this.deliveryArea = '';
        this.showDeliveryMaks = false;
      }else  if (index === 3) {
        this.selectedItem = '';
        this.logisticsData = '';
        this.showDeliveryShippedMaks = false;
      }else  if (index === 4) {
        this.selectedItem = '';
        this.casterInfoData = {level:0, picurl:'', number:0, phone:'--', qnumber:'--', wechat:'--', tg:'--', skype:'--', bbm:'--'};
        this.casterInfoData.contactCasterMaks = false;
      }
    },
    // 操作是否上到市场上 1 取消  2 确定
    async handleCancleSaleToMarket(index) {
      if (index === 1) {
        this.selectedItem = '';
        this.showSaleToMarketMaks = false;
      }else  {
        // 将店铺类地址待上架的NFT挂到市场上去
        if (this.selectedItem.headType === 3) {
          try {
            const that = this;
            const marketData = {};
            marketData['sender'] = this.walletAddress;
            marketData['orderid'] = this.selectedItem.tokenid;
            const signDict = await this.$decentralized.getApproveSignShopOnShelfGood(marketData);
            const marketsData = {};
            marketsData['sender'] = this.walletAddress.toLowerCase();
            marketsData['orderid'] = this.selectedItem.tokenid;
            marketsData['time'] = signDict.time;
            marketsData['sign'] = signDict.signature;
            this.$loading.showLoading();
            const result = await createOrder(marketsData);
            if (result.status === 200) {
              // 更新NFT列表数据
              setTimeout(() => {
                that.selectedItem = '';
                that.showSaleToMarketMaks = false;
                that.$loading.hiddenLoading();
                that.getCustomerNFTList(true);
              }, 2000);
            }else  {
              this.$loading.hiddenLoading();
              this.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
            }
          } catch (e) {
            this.$loading.hiddenLoading();
            this.$notify({ message: e.message, duration: 2500, showClose: false, customClass: 'notifyClass' });
            console.log('Error message: ', e)
          }
        } else {
          // 将普通类/NFT类待上架的NFT挂到市场上去
          try {
            const that = this;
            const marketData = {};
            marketData['address'] = this.walletAddress;
            marketData['assetID'] = this.selectedItem.tokenid;
            marketData['price'] = this.selectedItem.sellprice;
            // 将NFT挂载到市场上去
            this.$loading.showLoading();
            const result = await this.$decentralized.createOrder(marketData, that.connectWalletType);
            if (result) {
              // 更新NFT列表数据
              setTimeout(() => {
                that.selectedItem = '';
                that.showSaleToMarketMaks = false;
                that.$loading.hiddenLoading();
                that.getCustomerNFTList(true);
              }, 3000);
            }
          } catch (error) {
            this.$loading.hiddenLoading();
            this.$notify({ message: error.message, duration: 2500, showClose: false, customClass: 'notifyClass' });
            console.log('Error message: ', error)
          }
        }
      }
    },
    // 1、确认交割信息  2、取消发货(确认收货)
    async handleConfirmDelivery(index) {
      if(!this.isConnectWallet){
        return;
      }
      if (index === 1) {
        // 提交/修改持有者的收货信息
        if (isStringEmpty(this.deliveryName)) {
          this.$notify({message: this.$t("message.holding.nameMsg"),duration: 2500,showClose:false,customClass:'notifyClass'});
          return;
        }else  if (isStringEmpty(this.phoneAearNum)) {
          this.$notify({message: this.$t("message.holding.areaNumMsg"),duration: 2500,showClose:false,customClass:'notifyClass'});
          return;
        }else  if (isStringEmpty(this.deliveryPhone)) {
          this.$notify({message: this.$t("message.holding.numberMsg"),duration: 2500,showClose:false,customClass:'notifyClass'});
          return;
        }else  if (isStringEmpty(this.deliveryArea)) {
          this.$notify({message: this.$t("message.holding.areaMsg"),duration: 2500,showClose:false,customClass:'notifyClass'});
          return;
        }
        const dict = {};
        dict['address'] = this.walletAddress;
        dict['name'] = this.deliveryName;
        dict['areaNum'] = this.phoneAearNum;
        dict['number'] = this.deliveryPhone;
        dict['area'] = this.deliveryArea;
        dict['tokenid'] = this.selectedItem.tokenid;
        //dict['signature'] = await this.$decentralized.signature({address:this.walletAddress,name:this.deliveryName,areaNum:this.phoneAearNum,number:this.deliveryPhone,
        //area:this.deliveryArea,tokenid:this.selectedItem.tokenid});
        const that = this;
        const result = await deliveLogisticsInfoData(dict);
        console.log('提交物流信息 =',result);
        if (result.status === 200) {
          that.showHoldMaks = false;
          that.holdSalePrice = '';
          that.showDeliveryShippedMaks = false;
          that.logisticsData = '';
          that.showDeliveryMaks = false;
          that.selectedItem = '';
          that.phoneAearNum = '86';
          that.deliveryName = '';
          that.deliveryPhone = '';
          that.deliveryArea = '';
          // 刷新数据
          that.getCustomerNFTList(true);
          that.$notify({message:that.$t("message.holding.deliverySumbitSuccess"),duration:2500,showClose:false,customClass:'notifyClass'});
        }else {
          that.$notify({message: result.data,duration: 2500,showClose:false,customClass:'notifyClass'});
        }
      }else  if (index === 2) {
        // 判断是取消交割还是确认交割
        if (this.selectedItem.status === '5') {
          // 取消交割
          const dict = {};
          dict['address'] = this.walletAddress;
          dict['tokenid'] = this.selectedItem.tokenid;
          const that = this;
          const result = await cancleDeliveryInfoData(dict);
          console.log('取消交割 =',result);
          if (result.status === 200) {
            that.logisticsData = '';
            that.holdSalePrice = '';
            that.selectedItem = '';
            that.showHoldMaks = false;
            that.showDeliveryShippedMaks = false;
            // 刷新数据
            that.getCustomerNFTList(true);
          }else {
            that.$notify({message: result.data,duration: 2500,showClose:false,customClass:'notifyClass'});
          }
        }else  if (this.selectedItem.status === '6') {
          // 确认最终的交割
          try {
            const that = this;
            this.$loading.showLoading();
            const dict = {address:this.walletAddress,tokenID:this.selectedItem.tokenid}
            const result = await this.$decentralized.deliveryNft(dict,this.connectWalletType);
            if(result) {
              // 更新NFT列表数据
             setTimeout(() => {
               that.$loading.hiddenLoading();
               that.holdSalePrice = '';
               that.selectedItem = '';
               that.logisticsData = '';
               that.showHoldMaks = false;
               that.showDeliveryShippedMaks = false;
               that.getCustomerNFTList(true);
              }, 3000);
            }
          } catch (error) {
            this.$loading.hiddenLoading();
            this.$notify({message: error.message,duration: 2500,showClose:false,customClass:'notifyClass'});
            console.log('Error message: ', error)
          }
        }
      }else  if (index === 3) {
        // 联系铸造者
        const dict = {};
        dict['address'] = this.walletAddress;
        dict['tokenid'] = this.selectedItem.tokenid;
        const that = this;
        const result = await getCasterInfo(dict);
        console.log('铸造者信息=',result);
        if (result.status === 200) {
          that.casterInfoData = result.data;
          that.casterInfoData['level'] = result.data.level;
          that.casterInfoData['number'] = result.data.number;
          that.casterInfoData['bbm'] = isStringEmpty(result.data.bbm) ? '--' : result.data.bbm;
          that.casterInfoData['qnumber'] = isStringEmpty(result.data.qnumber) ? '--' : result.data.qnumber;
          that.casterInfoData['skype'] = isStringEmpty(result.data.skype) ? '--' : result.data.skype;
          that.casterInfoData['tg'] = isStringEmpty(result.data.tg) ? '--' : result.data.tg;
          that.casterInfoData['wechat'] = isStringEmpty(result.data.wechat) ? '--' : result.data.wechat;
          that.logisticsData = '';
          if (isStringEmpty(result.data.picurl)) {
            that.casterInfoData['picurl'] = '';
          }else  {
            const newStr = result.data.picurl.indexOf("https");
            if (newStr === -1) {
              that.casterInfoData['picurl'] = `${settingConfig.ipfsNFTUrl + result.data.picurl}`
            }else  {
              that.casterInfoData['picurl'] = result.data.picurl;
            }
          }
          that.showDeliveryShippedMaks = false;
          that.casterInfoData.contactCasterMaks = true;
        }else {
          that.$notify({message: result.data,duration: 2500,showClose:false,customClass:'notifyClass'});
        }
      }
    },
    // 编辑收货地址
    handleClickEditAddress() {
      let info = this.logisticsData.number.split(" ");
      this.deliveryName =  this.logisticsData.user;
      this.phoneAearNum =  info[0];
      this.deliveryPhone = info[1];
      this.deliveryArea = this.logisticsData.area;
      this.showDeliveryMaks = true;
    },
    // 复制联系方式
    handleClickCopy(index) {
      let copyText = '';
      if (index === 1) {
        copyText = this.casterInfoData.phone;
      }else if(index === 2) {
        copyText = this.casterInfoData.qnumber;
      }else if(index === 3) {
        copyText = this.casterInfoData.wechat;
      }else if(index === 4) {
        copyText = this.casterInfoData.tg;
      }else if(index === 5) {
        copyText = this.casterInfoData.skype;
      }else if(index === 6) {
        copyText = this.casterInfoData.bbm;
      }
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
        textArea.style.opacity = '0';
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
    //  复制快递单号
    handleCopyLogistics() {
      let copyText = this.logisticsData.expressNumber;
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
        textArea.style.opacity = '0';
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
    // 查看NFT详情
    handleClickCheckNFT() {
      const that = this;
      setTimeout(() => {
        that.hanleClickCloseHoldMaks();
      }, 500);
      console.log('查看NFT详情');
    },
     // 获取出售NFT合约授权的地址
    async getNFTApprovedSaleAddress() {
       try {
          const that = this;
          const dict = {address:this.walletAddress,tokenID:this.selectedItem.tokenid}
          const result = await this.$decentralized.getNFTApprovedSaleAddress(dict);
          if(result) {
            that.approveSaleNFTAddress = result;
            that.changeBtnStatuTextMsg();
            console.log('获取出售NFT合约授权的地址=',result);
          }
        } catch (error) {
          this.$notify({message: error.message,duration: 2500,showClose:false,customClass:'notifyClass'});
          console.log('Error message: ', error)
        }
    },
    // 授权出售NFT合约地址
    async ApprovedNFTSaleAddress() {
       try {
          const that = this;
          this.$loading.showLoading();
          const dict = {address:this.walletAddress,nftmarketAddress:constParam.market_addr,tokenID:this.selectedItem.tokenid}
          const result = await this.$decentralized.ApprovedNFTSaleAddress(dict,this.connectWalletType);
          if(result) {
            that.$loading.hiddenLoading();
            that.approveSaleNFTAddress = constParam.market_addr;
            that.changeBtnStatuTextMsg();
          }
        } catch (error) {
          this.$loading.hiddenLoading();
          this.$notify({message: error.message,duration: 2500,showClose:false,customClass:'notifyClass'});
          console.log('Error message: ', error)
        }
    },
    // 获取出售时候价格范围值
    async getXYpercent() {
      try {
        const that = this;
        const result = await this.$decentralized.getXYpercent();
        const heigh = result[0] / 100;
        const low = result[1] / 100;
        const lowPrice1 = parseFloat(this.selectedItem.sellprice);
        const lowPrice2 = parseFloat(this.selectedItem.sellprice * low);
        that.lowPrice = lowPrice1 - lowPrice2;
        const heighPrice1 = parseFloat(this.selectedItem.sellprice);// parseNumber(this.selectedItem.sellprice,18);
        const heighPrice2 = parseFloat(this.selectedItem.sellprice * heigh);
        that.heighPrice = heighPrice1 + heighPrice2;
      } catch (error) {
        this.$notify({message: error.message,duration: 2500,showClose:false,customClass:'notifyClass'});
        console.log('Error message: ', error)
      }
    },
    // 选择出售或者销毁
    async handleClickConfirm(index) {
      if (index === 1) {
        if (this.approveSaleNFTAddress.toLowerCase() !== constParam.market_addr.toLowerCase()) {
          this.ApprovedNFTSaleAddress();
          return;
        }else if (isStringEmpty(this.holdSalePrice)) {
          this.$notify({message: this.$t('message.holding.sellMsg'),duration: 2500,showClose:false,customClass:'notifyClass'});
          return;
        }else if (this.holdSalePrice < this.lowPrice || this.holdSalePrice > this.heighPrice) {
          this.$notify({message: this.$t('message.holding.sellOutOfRangeMsg'),duration: 2500,showClose:false,customClass:'notifyClass'});
          return;
        }
        try {
          const that = this;
          this.$loading.showLoading();
          const dict = {address:this.walletAddress,assetID:this.selectedItem.tokenid,price:this.holdSalePrice}
          const result = await this.$decentralized.createOrder(dict,this.connectWalletType);
          if(result) {
            // 更新NFT列表数据
            setTimeout(() => {
              that.$loading.hiddenLoading();
              that.holdSalePrice = '';
              that.selectedItem = '';
              that.showHoldMaks = false;
              that.getCustomerNFTList(true);
            }, 3000);
          }
        } catch (error) {
          this.$loading.hiddenLoading();
          this.$notify({message: error.message,duration: 2500,showClose:false,customClass:'notifyClass'});
          console.log('Error message: ', error)
        }
        console.log('确定出售');
      }else if(index === 2) {
        try {
          const that = this;
          this.$loading.showLoading();
          const dict = {address:this.walletAddress,tokenID:this.selectedItem.tokenid}
          const result = await this.$decentralized.destroyNFT(dict,this.connectWalletType);
          if(result) {
            // 更新NFT列表数据
            setTimeout(() => {
              that.$loading.hiddenLoading();
              that.holdSalePrice = '';
              that.selectedItem = '';
              that.showHoldMaks = false;
              that.getCustomerNFTList(true);
            }, 3000);
          }
        } catch (error) {
          this.$loading.hiddenLoading();
          this.$notify({message: error.message,duration: 2500,showClose:false,customClass:'notifyClass'});
          console.log('Error message: ', error)
        }
        console.log('确定销毁');
      }else if(index === 3) {
        // 判断是否是常规NFT的交割还是艺术类的NFT交割
        if (this.selectedItem.headType === 1) {
          this.showDeliveryMaks = true;
        }else  if (this.selectedItem.headType === 2) {
          try {
            const that = this;
            this.$loading.showLoading();
            const dict = {address:this.walletAddress,tokenID:this.selectedItem.tokenid}
            const result = await this.$decentralized.deliveryArtNft(dict,this.connectWalletType);
            if(result) {
              // 更新NFT列表数据
              setTimeout(() => {
                that.$loading.hiddenLoading();
                that.selectedItem = '';
                that.showHoldMaks = false;
                that.getCustomerNFTList();
              }, 3000);
            }
          } catch (error) {
            this.$loading.hiddenLoading();
            this.$notify({message: error.message,duration: 2500,showClose:false,customClass:'notifyClass'});
            console.log('Error message: ', error)
          }
          console.log('艺术类NFT确定交割');
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>

.hold {
  max-width: 1200px;
  padding-top: 0.1px;
  margin: 0 auto;
  height: 1100px;
  .s_empty {
    margin: 100px auto 0;
    padding-top: 150px;
    width: 172px;
    height: 180px;
    line-height: 28px;
    font-size: 20px;
    font-weight: normal;
    font-stretch: normal;
    font-family: "PingFang SC",sans-serif;
    color: #c5c8d9;
    box-sizing: border-box;
    background-size: contain;
    background-repeat: no-repeat;
    background-image: url('../../../assets/universal/icon_empty.svg');
  }
  .s_contian {
    width: 1200px;
    height: 1100px;
    margin: 20px auto 0;
    overflow-y: scroll;
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
    .m_contian {
      position: relative;
      padding:30px 0;
      width: 400px;
      border-radius: 20px;
      background-color: #27273f;
      .m_c_wrapper {
        display: flex;
        margin-top: 20px;
        .m_c_icon {
          flex-shrink: 0;
          width: 140px;
          height: 140px;
          margin-left: 20px;
          position: relative;
          border-radius: 8px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 8px;
          }
          .m_c_i_bottom {
            position: absolute;
            width: 100%;
            height: 40px;
            left: 0;
            bottom: 2px;
            background-size: cover;
            background-repeat: no-repeat;
            background-image: url('../../../assets/laboras/icon_l_icon_bg.svg');
            user-select: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
              width: 20px;
              height: 20px;
            }
            span {
              margin-left: 10px;
              font-size: 12px;
              font-weight: 500;
              font-family: "PingFang SC", sans-serif;
              color: var(--white);
            }
          }
        }
        .m_c_right {
          margin-left: 20px;
          .m_dis_title {
            padding-right: 10px;
            line-height: 22px;
            font-size: 20px;
            text-align: left;
            word-break: break-all;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            user-select: none;
            font-family: Ubuntu, sans-serif;
            color: var(--white);
            &:nth-child(2) {
              margin-top: 15px;
              line-height: 20px;
              font-size: 16px;
              color: #9a55dc;
            }
            &:nth-child(3) {
              margin-top: 10px;
              line-height: 22px;
              font-size: 16px;
            }
          }
          .m_p_c_usdt {
            display: flex;
            align-items: center;
            margin-top: 10px;
            img {
              width: 26px;
              height: 26px;
            }
            span {
              margin-left:10px;
              font-size: 16px;
              line-height:20px;
              word-break: break-all;
              text-align: left;
              font-family: PingFangSC, sans-serif;
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              color: #ff953f;
            }
          }
          .m_dis_title1 {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      .m_dis_desc {
        padding: 0 20px;
        margin-top: 20px;
        line-height: 22px;
        font-size: 16px;
        font-weight: normal;
        text-align: left;
        font-family: PingFangSC, sans-serif;
        color: #fff;
      }
      .m_dis_sort {
        padding: 0 20px;
        margin-top:6px;
        display: flex;
        justify-content: space-between;
        .m_d_s_item {
          width: 175px;
          height: 50px;
          line-height: 50px;
          font-size: 14px;
          border-radius: 4px;
          font-family: PingFangSC, sans-serif;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          user-select: none;
          color: var(--white);
          background-color: #363652;
        }
      }
      .m_dis_desc1 {
        margin-top: 20px;
      }
      .m_dis_input {
        margin: 6px auto 0;
        width: 360px;
        height: 50px;
        border-radius: 4px;
        background-color: #1b1b33;
        input {
          width: 100%;
          padding-left: 16px;
          height: 100%;
          border: 0; // 去除未选中状态边框
          outline: none; // 去除选中状态边框
          font-size: 16px;
          font-family: PingFangSC, sans-serif;
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
      .m_confirm_content {
        margin-top:20px;
        display: flex;
        align-items: center;
        justify-content: center;
        .m_dis_sell1 {
          width: 156px;
          height: 64px;
          font-size: 16px;
          font-weight: 500;
          font-family: PingFangSC, sans-serif;
          color: var(--white);
          cursor: pointer;
          user-select: none;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          background-size: contain;
          background-repeat: no-repeat;
          background-image: url('../../../assets/newPhones/nLaboratory/h5_icon_l_takeBack.png');
          &:last-child {
            margin-left: 10px;
            background-image: url('../../../assets/newPhones/nLaboratory/h5_icon_l_cancle.png');
          }
        }
      }
      .m_dis_sell {
        width: 306px;
        height: 64px;
        margin: 30px auto 0;
        cursor: pointer;
        user-select: none;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        background-size: contain;
        background-repeat: no-repeat;
        background-image: url('../../../assets/newPhones/nLaboratory/h5_icon_destory_bg1.png');
        span {
          font-size: 16px;
          font-weight: 500;
          font-family: PingFangSC, sans-serif;
          color: var(--white);
        }
      }
      .m_dis_destory {
        margin: vw(15) auto 0;
        border: 1px solid var(--primary);
        background-image: none;
        span {
          font-size: vw(28);
          font-weight: 500;
          font-family: PingFangSC, sans-serif;
          color: var(--primary);
        }
      }
      .m_dis_destory1 {
        margin-top: 30px;
      }
      .mask_close {
        width: 22px;
        height: 22px;
        top: 15px;
        right: 15px;
        position: absolute;
        cursor: pointer;
      }
    }
    .m_contian1 {
      width: 400px;
    }
    .m_shiped {
      position: relative;
      width: 580px;
      padding-top: 16px;
      padding-bottom: 30px;
      border-radius: 20px;
      background-color: #27273f;
      .m_d_title {
        margin: 0 auto;
        line-height: 28px;
        font-size: 20px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        color: #fff;
        font-family: Poppins, sans-serif;
      }
      .m_d_address {
        position: relative;
        height: 130px;
        padding: 0 20px;
        margin: 16px 20px 0;
        display: flex;
        align-items: center;
        border-radius: 10px;
        background-color: #363652;
        img {
          width: 33px;
          height: 40px;
        }
        .m_d_edit {
          position: absolute;
          top: calc(50% - 22px);
          right: 20px;
          width: 30px;
          height: 30px;
        }
        .m_d_a_content {
          margin-left:20px;
          div {
            overflow: hidden;
            width: 380px;
            line-height: 20px;
            font-size: 14px;
            font-weight: 500;
            text-align: left;
            word-wrap: break-word;
            word-break: normal;
            font-stretch: normal;
            font-style: normal;
            color: #999;
            font-family: Poppins, sans-serif;
            &:last-child {
              color: #fff;
            }
          }
          .m_d_a_c_margin {
            margin-top: 12px;
          }
        }
      }
      .m_d_remark {
        padding: 0 20px;
        margin-top: 20px;
        line-height: 20px;
        font-family: "PingFang SC", sans-serif;
        font-size: 14px;
        word-break: normal;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: normal;
        text-align: left;
        color: #fff;
      }
      .m_d_info {
        padding: 0 20px;
        .m_d_i_one {
          margin-top: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          span {
            font-size: 14px;
            font-weight: 500;
            font-stretch: normal;
            font-style: normal;
            font-family: "PingFang SC", sans-serif;
            color: #994cf0;
            &:last-child {
              color: #fff;
            }
          }
          .m_d_i_item {
            width: 227px;
            height: vw(50);
            border-radius: 6px;
            background-color: #000;
            input {
              width: 80%;
              height: 100%;
              border: 0; // 去除未选中状态边框
              outline: none; // 去除选中状态边框
              font-size: 16px;
              font-family: Montserrat, sans-serif;
              font-weight: normal;
              box-sizing: border-box;
              background-color: transparent;
              color: var(--white);
            }
            input::-webkit-input-placeholder {
              color: #999;
              font-size: 14px;
            }
            input:-moz-placeholder {
              /* FF 4-18 */
              color: #999;
              font-size: 14px;
            }
            input::-moz-placeholder {
              /* FF 19+ */
              color: #999;
              font-size: 14px;
            }
            input:-ms-input-placeholder {
              /* IE 10+ */
              color: #999;
              font-size: 14px;
            }
            input:-webkit-autofill {
              transition: background-color 5000s ease-in-out 0s; //背景颜色
            }
          }
        }
        .m_d_i_two {
          margin-top: 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          span {
            font-size: 14px;
            font-weight: 500;
            font-stretch: normal;
            font-style: normal;
            font-family: Poppins, sans-serif;
            color: #994cf0;
            &:last-child {
              color: #fff;
            }
          }
          .m_d_i_item {
            width: 227px;
            height: 50px;
            border-radius: 6px;
            background-color: #000;
            input {
              width: 80%;
              height: 100%;
              border: 0; // 去除未选中状态边框
              outline: none; // 去除选中状态边框
              font-size: 16px;
              font-family: Montserrat, sans-serif;
              font-weight: normal;
              box-sizing: border-box;
              background-color: transparent;
              color: var(--white);
            }
            input::-webkit-input-placeholder {
              color: #999;
              font-size: 14px;
            }
            input:-moz-placeholder {
              /* FF 4-18 */
              color: #999;
              font-size: 14px;
            }
            input::-moz-placeholder {
              /* FF 19+ */
              color: #999;
              font-size: 14px;
            }
            input:-ms-input-placeholder {
              /* IE 10+ */
              color: #999;
              font-size: 14px;
            }
            input:-webkit-autofill {
              transition: background-color 5000s ease-in-out 0s; //背景颜色
            }
          }
          .m_d_i_t_item {
            display: flex;
            align-items: center;
            max-width: vw(330);
            span {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              color: #fff;
            }
            img {
              margin-left: 8px;
              width: 16px;
              height: 16px;
              cursor: pointer;
              user-select: none;
            }
          }
        }
      }
      .m_d_delivery {
        width: 306px;
        height: 64px;
        margin: 30px auto 0;
        line-height:64px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        user-select: none;
        box-sizing: border-box;
        font-stretch: normal;
        font-style: normal;
        color: #fff;
        font-family: "PingFang SC", sans-serif;
        background-size: contain;
        background-repeat: no-repeat;
        background-image: url('../../../assets/newPhones/nWish/icon_wish_cancle.svg');
      }
      .m_d_contactCasting {
        margin: 10px auto 0;
        background-image: url('../../../assets/newPhones/nLaboratory/h5_icon_destory_bg1.png');
      }
      .m_d_delivery1 {
        margin-top: 30px;
      }
      .mask_close {
        width: 23px;
        height: 23px;
        top: 20px;
        right: 20px;
        position: absolute;
        cursor: pointer;
      }
    }
    .m_sale {
      width: 420px;
      height: 272px;
      border-radius: 20px;
      background-color: #2e2f48;
      .m_s_desc {
        margin: 75px 50px 0;
        line-height: 33px;
        font-size: 24px;
        font-family: "PingFang SC",sans-serif;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        color: var(--white);
      }
      .m_s_btn {
        margin: 50px auto 0;
        display: flex;
        justify-content: space-between;
        width: 320px;
        div {
          width: 156px;
          height: 64px;
          line-height:64px;
          font-size: 16px;
          font-weight: 500;
          user-select: none;
          cursor: pointer;
          color: #fff;
          font-family: "PingFang SC",sans-serif;
          background-size: contain;
          background-repeat: no-repeat;
          background-image: url('../../../assets/newPhones/nLaboratory/h5_icon_l_cancle.png');
          &:last-child {
            background-image: url('../../../assets/newPhones/nLaboratory/h5_icon_l_takeBack.png');
          }
        }
      }

    }
    .m_contact {
      position:relative;
      width: 580px;
      height: 580px;
      border-radius: 20px;
      background-color: #2e2f48;
      .m_c_title {
        margin: 16px auto 0;
        line-height: 28px;
        font-size: 20px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        color: #fff;
        font-family: "PingFang SC",sans-serif;
      }
      .m_c_line {
        margin-top: 15px;
        width: 100%;
        height: 0;
        border: dashed 1px #707070;
      }
      .m_c_avatar {
        position: relative;
        margin-top: 20px;
        .m_c_a_icon {
          margin: 0 auto;
          width: 100px;
          height: 100px;
          border-radius: 50px;
          overflow: hidden;
          border: solid 3px #fff;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .m_c_a_level {
          width: 32px;
          height: 32px;
          position: absolute;
          bottom: -2px;
          left: calc(50% + 15px);
        }
      }
      .m_c_creator {
        margin-top: 10px;
        line-height: 22px;
        font-size: 16px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        font-family: "PingFang SC",sans-serif;
        color: #fff;
      }
      .m_c_item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 40px;
        padding: 0 20px;
        .m_c_i_left {
          display: flex;
          align-items: center;
          width: 260px;
          img {
            width: 18px;
            height: 18px;
          }
          span {
            margin-left: 10px;
            line-height: 20px;
            font-size: 14px;
            font-weight: 500;
            font-stretch: normal;
            font-style: normal;
            font-family: "PingFang SC",sans-serif;
            color: #fff;
          }
        }
      }
      .m_c_item1 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 10px;
        padding: 0 20px;
        .m_c_i1_left {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 260px;
          height: 50px;
          border-radius: 4px;
          background-color: #363652;
          span {
            margin-left: 10px;
            line-height: 20px;
            font-size: 14px;
            font-weight: 600;
            font-stretch: normal;
            font-style: normal;
            font-family: "PingFang SC",sans-serif;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #fff;
          }
          img {
            width: 18px;
            height: 18px;
            margin-right: 20px;
          }
        }
      }
      .m_c_margin {
        margin-top: 20px;
      }
      .mask_close {
        width: 23px;
        height: 23px;
        top: 20px;
        right: 20px;
        position: absolute;
        cursor: pointer;
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
      width: 586px;
      padding-top: 16px;
      padding-bottom: 30px;
      //height: 474px;
      border-radius: 20px;
      background-color: #27273f;
      .m_d_title {
        margin: 0 auto;
        line-height: 28px;
        font-size: 20px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        color: #fff;
        font-family: Poppins, sans-serif;
      }
      .m_d_info {
        padding: 0 30px;
        .m_d_i_one {
          display: flex;
          justify-content: space-between;
          span {
            width: 255px;
            margin-top: 30px;
            line-height: 23px;
            font-size: 14px;
            font-weight: 500;
            text-align: left;
            font-stretch: normal;
            font-style: normal;
            font-family: "PingFang SC",sans-serif;
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
            border-radius: 4px;
            background-color: #363652;
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
              color: #999;
              font-size: 14px;
            }
            input:-moz-placeholder {
              /* FF 4-18 */
              color: #999;
              font-size: 14px;
            }
            input::-moz-placeholder {
              /* FF 19+ */
              color: #999;
              font-size: 14px;
            }
            input:-ms-input-placeholder {
              /* IE 10+ */
              color: #999;
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
          border-radius: 4px;
          background-color: #363652;
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
            color: #999;
            font-size: 14px;
          }
          textarea:-moz-placeholder {
            /* FF 4-18 */
            color: #999;
            font-size: 14px;
          }
          textarea::-moz-placeholder {
            /* FF 19+ */
            color: #999;
            font-size: 14px;
          }
          textarea:-ms-input-placeholder {
            /* IE 10+ */
            color: #999;
            font-size: 14px;
          }
          textarea:-webkit-autofill {
            transition: background-color 5000s ease-in-out 0s; //背景颜色
          }
        }
      }
      .m_d_delivery {
        width: 306px;
        height: 64px;
        margin: 30px auto 0;
        line-height: 64px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        user-select: none;
        box-sizing: border-box;
        font-stretch: normal;
        font-style: normal;
        color: #fff;
        font-family: Poppins,sans-serif;
        background-size: contain;
        background-repeat: no-repeat;
        background-image: url('../../../assets/newPhones/nLaboratory/h5_icon_destory_bg1.png');
      }
      .mask_close {
        width: 23px;
        height: 23px;
        top: 20px;
        right: 20px;
        position: absolute;
        cursor: pointer;
      }
    }
  }
}

</style>
