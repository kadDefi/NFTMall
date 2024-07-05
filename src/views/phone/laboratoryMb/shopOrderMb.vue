<template>
  <div class="shop">
    <div v-if="orderDataList.length <= 0" class="h_empty">{{ $t("message.holding.empty") }}</div>
    <div v-else class="h_contian">
      <van-pull-refresh style="min-height: 100vh" v-model="isRefresh" @refresh="onRefresh">
        <van-list v-model="isLoadMoring" :finished="isFinisedLoadMoring" :finished-text="$t('message.alertMsg.loadFinisedMsg')" :immediate-check="false" @load="onLoadMore">
          <order-card :marketList="orderDataList" @handleClickItem="handleClickItem"></order-card>
        </van-list>
      </van-pull-refresh>
    </div>
    <!-- 发货弹框 -->
    <div class="mask" v-show="showDeliveryMaks" @touchmove.prevent @mousewheel.prevent>
      <div class="m_delivery">
        <div class="m_d_title">{{ `${selectedItem.status === 5 ? $t("message.holding.Tobedelivered") : $t("message.holding.Shipped")}` }}</div>
        <div class="m_d_address">
          <img src="../../../assets/newPhones/nLaboratory/icon_d_address.svg" alt="">
          <div class="m_d_a_content">
            <div>{{ `${logisticsData.user}   +${logisticsData.number}` }}</div>
            <div class="m_d_a_c_margin">{{ logisticsData.area }}</div>
          </div>
        </div>
        <div class="m_d_remark">{{ $t("message.holding.remark") }}:{{ logisticsData.remarks }}</div>
        <div class="m_d_info">
          <div class="m_d_i_one">
            <span>{{ $t("message.holding.Couriercompany") }}</span>
            <div class="m_d_i_item"><input type="text" v-model="deliveryCompanyName" :placeholder="placeholderDesc1"></div>
          </div>
          <div class="m_d_i_one">
            <span>{{ $t("message.holding.Logisticsordernumber") }}</span>
            <div class="m_d_i_item"><input type="text" v-model="deliveryLogistics" :placeholder="placeholderDesc2"></div>
          </div>
        </div>
        <div class="m_d_delivery" @click="handleConfirmShip">{{ `${selectedItem.status === 5 ? $t("message.holding.ConfirmShip") : $t("message.holding.ConfirmModify")}` }}</div>
        <img class="mask_close" src="../../../assets/newPhones/nLaboratory/icon_qb_close.svg" alt="logo" @click="hanleClickCloseHoldMaks(5)">
      </div>
    </div>
    <!-- 收货信息弹框 -->
    <div class="mask1" v-show="showDeliveryMaks1" @touchmove.prevent @mousewheel.prevent>
      <div class="m_delivery">
        <div class="m_d_title">{{ $t("message.holding.DeliveryInformation") }}</div>
        <!--<div class="m_d_line"></div>-->
        <div class="m_d_info">
          <div class="m_d_i_one">
            <span>{{ $t("message.holding.Receiver") }}</span>
            <div class="m_d_i_item"><input type="text" v-model="deliveryName" :placeholder="placeholderDesc3"></div>
          </div>
          <div class="m_d_i_two">
            <span>{{ $t("message.holding.CellphoneNumber") }}</span>
            <div class="m_d_i_item m_d_i_item1">
              <div>+</div>
              <input class="c_r_i_p_input" type="number" v-model="phoneAearNum">
              <div>|</div>
              <input type="text" v-model="deliveryPhone" :placeholder="placeholderDesc4">
            </div>
          </div>
        </div>
        <div class="m_d_area">
          <div class="m_d_a_title">{{ $t("message.holding.Yourarea") }}</div>
          <div class="m_d_a_container">
            <textarea type="text" v-model="deliveryArea" :placeholder="placeholderDesc5"></textarea>
          </div>
        </div>
        <div class="m_d_line"></div>
        <div class="m_d_delivery" @click="handleConfirmDelivery(1)">{{ selectedItem.status === 5 ? $t("message.holding.ConfirmModify") : $t("message.holding.ConfirmDelivery") }}</div>
        <img class="mask_close" src="../../../assets/newPhones/nLaboratory/icon_qb_close.svg" alt="logo" @click="hanleClickCloseHoldMaks(2)">
      </div>
    </div>
    <!-- 待发货/待收货弹框 -->
    <div class="mask" v-show="showDeliveryShippedMaks" @touchmove.prevent @mousewheel.prevent>
      <div class="m_shiped">
        <div class="m_d_title">{{ selectedItem.status === 5 ? $t("message.holding.Tobedelivered") : selectedItem.status === 6 ? $t("message.holding.Shipped") : $t("message.holding.Completed") }}</div>
        <div class="m_d_address">
          <img src="../../../assets/newPhones/nLaboratory/icon_d_address.svg" alt="">
          <div class="m_d_a_content">
            <div>{{ `${logisticsData.user}   +${logisticsData.number}` }}</div>
            <div class="m_d_a_c_margin">{{ logisticsData.area }}</div>
          </div>
          <img v-if=" selectedItem.status === 5 " class="m_d_edit" src="../../../assets/newPhones/nLaboratory/icon_h_edit.svg" alt="" @click="handleClickEditAddress">
        </div>
        <div class="m_d_remark">{{ $t("message.holding.remark") }}:{{ logisticsData.remarks }}</div>
        <div class="m_d_info">
          <div class="m_d_i_one">
            <span>{{ $t("message.holding.Couriercompany") }}</span>
            <div v-if="selectedItem.status === 5 ">
              <span>-</span>
            </div>
            <div v-else>
              <span>{{ logisticsData.expressComp }}</span>
            </div>
          </div>
          <div class="m_d_i_two">
            <span>{{ $t("message.holding.Logisticsordernumber") }}</span>
            <div v-if="selectedItem.status === 5 ">
              <span>-</span>
            </div>
            <div v-else>
              <div class="m_d_i_t_item">
                <span>{{ logisticsData.expressNumber }}</span>
                <img src="../../../assets/laboras/icon_d_copy.svg" alt="logo" @click="handleCopyLogistics">
              </div>
            </div>
          </div>
        </div>
        <div v-if="selectedItem.status === 6" class="m_d_delivery" @click="handleConfirmDelivery(2)">{{ $t("message.holding.ConfirmReceipt") }}</div>
        <div v-if="selectedItem.status !== 7" :class="selectedItem.status === 5 ? 'm_d_delivery1' : ''" class="m_d_delivery m_d_contactCasting" @click="handleConfirmDelivery(3)">{{ $t("message.holding.contactTheMerchant") }}</div>
        <img class="mask_close" src="../../../assets/newPhones/nLaboratory/icon_qb_close.svg" alt="logo" @click="hanleClickCloseHoldMaks(3)">
      </div>
    </div>
    <!-- 联系铸造者  -->
    <div class="mask" v-show="contactCasterMaks" @touchmove.prevent @mousewheel.prevent>
      <div class="m_contact">
        <div class="m_c_title">{{ $t("message.holding.contactTheMerchant") }}</div>
        <div class="m_c_line"></div>
        <div class="m_c_avatar">
          <div class="m_c_a_icon">
            <img v-if="isAvatarStringEmpty(casterInfoData.picurl)" src="../../../assets/newPhones/universal/icon_header_logo.png" alt="">
            <img v-else :src="casterInfoData.picurl" alt="logo">
          </div>
          <img class="m_c_a_level" :src="require(`../../../assets/laboras/icon_l_level_0.svg`)" alt="">
        </div>
        <div class="m_c_creator">{{ $t("message.labora.creatorNo") }}: #{{ casterInfoData.number }}</div>
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
            <span>{{ casterInfoData.link }}</span>
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
        <img class="mask_close" src="../../../assets/newPhones/nLaboratory/icon_qb_close.svg" alt="logo" @click="hanleClickCloseHoldMaks(4)">
      </div>
    </div>
  </div>
</template>

<script>

const settingConfig = require('../../../settings.js');
import {mapGetters} from 'vuex';
import {isStringEmpty} from '@/utils/validate';
import {confirmedOrder, getList, getShopExpress, getShopInfo, getShopReceiver, modifyOrderReceiver, shopOrderExpress} from '@/api/mark'
import orderCardMb from '../../../components/orderCardMb/orderCardMb';

export default {
  name: "shopOrderMb",
  components: { 'order-card': orderCardMb },
  data() {
    return {
      isEnglish: false, // 中英文
      isRefresh: false,// 是否刷新中
      isLoadMoring: false, // 加载更多
      isFinisedLoadMoring: false, // 结束加载更是
      showDeliveryMaks: false,// 收货信息弹框
      placeholderDesc1: this.$t("message.holding.companyMsg"),
      placeholderDesc2: this.$t("message.holding.trackingMsg"),
      logisticsData: '', // 收货人的信息
      deliveryCompanyName: '', // 快递公司
      deliveryLogistics: '', // 快递单号
      selectedItem: '', // 选中的NFT对象

      // 填写收货信息参数
      showDeliveryMaks1: false,// 收货信息弹框
      deliveryName: '',
      phoneAearNum: '86',
      deliveryPhone: '',
      deliveryArea: '',
      placeholderDesc3: this.$t("message.holding.Name"),
      placeholderDesc4: this.$t("message.holding.Number"),
      placeholderDesc5: this.$t("message.holding.AreaDesc"),

      // 待发货/已发货
      showDeliveryShippedMaks: false,// 收货信息弹框
      // 是否上架待上架的NFT
      showSaleToMarketMaks: false,
      // 联系铸造者
      contactCasterMaks: false,
      casterInfoData: {
        level: 0,
        picurl: '',
        number: 0,
        phone: '--',
        qnumber: '--',
        wechat: '--',
        tg: '--',
        skype: '--',
        bbm: '--',
      },
      pageSize: 1, // 当前的页码
      orderDataList: [],
    };
  },
  created() {
    this.isEnglish = window.localStorage.getItem("lang") !== "zh";
    this.getCustomerNFTList(true);
    console.log('hotOrderMb page create');
  },
  mounted() {

  },
  destroyed() {

  },
  // 计算属性
  computed: {
    ...mapGetters(['isConnectWallet', 'walletAddress', 'connectWalletType']),
  },
  // 监听属性改变
  watch: {
    isConnectWallet(val, oval) {
      this.showDeliveryMaks = false;
      this.showDeliveryMaks1 = false;
      this.showDeliveryShippedMaks = false;
      this.contactCasterMaks = false;
      if (val) {
        this.getCustomerNFTList(true);
      } else {
        this.orderDataList = [];
      }
    },
    // 监听语言的切换
    '$i18n.locale'(nval, oval) {
      this.isEnglish = nval !== 'zh';
      console.log('监听到语言的切换');
      this.placeholderDesc1 = this.$t("message.holding.companyMsg");
      this.placeholderDesc2 = this.$t("message.holding.trackingMsg");
      this.placeholderDesc3 = this.$t("message.holding.Name");
      this.placeholderDesc4 = this.$t("message.holding.Number");
      this.placeholderDesc5 = this.$t("message.holding.AreaDesc");
    },
  },
  // 方法
  methods: {
    // 判断头像是否是空的
    isAvatarStringEmpty(avatar) {
      return isStringEmpty(avatar);
    },
    // 发货弹框
    async handleClickItem(item) {
      this.selectedItem = item;
      const that = this;
      if (item.status === 5) { // 5
        if (item.type === 0) {
          let result;
          const dict = {};
          // 获取物流信息
          dict['orderid'] = item.id;
          result = await getShopReceiver(dict);
          if (result.status === 200) {
            that.logisticsData = result.data;
            that.showDeliveryMaks = true;
            console.log('物流信息数据 =', that.logisticsData);
          } else {
            that.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
          }
        } else {
          const dict = {};
          let result;
          dict['orderid'] = item.id;
          result = await getShopExpress(dict);
          if (result.status === 200) {
            const data = result.data.userData;
            data['expressComp'] = result.data.outData.expressComp;
            data['expressNumber'] = result.data.outData.expressNumber;
            that.logisticsData = data;
            that.showDeliveryShippedMaks = true;
            console.log('物流信息数据 =', that.logisticsData);
          } else {
            that.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
          }
        }
      } else if (item.status === 6) { // 6
        if (item.type === 0) {
          const dict = {};
          let result;
          dict['orderid'] = item.id;
          result = await getShopExpress(dict);
          if (result.status === 200) {
            const data = result.data.userData;
            data['expressComp'] = result.data.outData.expressComp;
            data['expressNumber'] = result.data.outData.expressNumber;
            that.logisticsData = data;
            that.deliveryCompanyName = that.logisticsData.expressComp;
            that.deliveryLogistics = that.logisticsData.expressNumber;
            that.showDeliveryMaks = true;
            console.log('已发货物流信息数据 =', that.logisticsData);
          } else {
            that.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
          }
        } else {
          const dict = {};
          let result;
          dict['orderid'] = item.id;
          result = await getShopExpress(dict);
          if (result.status === 200) {
            const data = result.data.userData;
            data['expressComp'] = result.data.outData.expressComp;
            data['expressNumber'] = result.data.outData.expressNumber;
            that.logisticsData = data;
            that.showDeliveryShippedMaks = true;
            console.log('物流信息数据 =', that.logisticsData);
          } else {
            that.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
          }
        }
      } else {
        const dict = {};
        let result;
        dict['orderid'] = item.id;
        result = await getShopExpress(dict);
        if (result.status === 200) {
          const data = result.data.userData;
          data['expressComp'] = result.data.outData.expressComp;
          data['expressNumber'] = result.data.outData.expressNumber;
          that.logisticsData = data;
          that.showDeliveryShippedMaks = true;
          console.log('物流信息数据 =', that.logisticsData);
        } else {
          that.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
        }
      }
    },
    // 关闭查看NFT
    hanleClickCloseHoldMaks(index) {
      if (index === 1) {
        this.holdSalePrice = '';
        this.selectedItem = '';
        this.showHoldMaks = false;
      } else if (index === 2) {
        this.phoneAearNum = '86';
        this.deliveryName = '';
        this.deliveryPhone = '';
        this.deliveryArea = '';
        this.showDeliveryMaks1 = false;
      } else if (index === 3) {
        this.selectedItem = '';
        this.logisticsData = '';
        this.showDeliveryShippedMaks = false;
      } else if (index === 4) {
        this.selectedItem = '';
        this.casterInfoData = { level: 0, picurl: '', number: 0, phone: '--', qnumber: '--', wechat: '--', tg: '--', skype: '--', bbm: '--' };
        this.contactCasterMaks = false;
      } else {
        this.selectedItem = '';
        this.logisticsData = '';
        this.deliveryLogistics = '';
        this.deliveryCompanyName = '';
        this.showDeliveryMaks = false;
      }
    },
    // 确认发货
    async handleConfirmShip() {
      if (this.selectedItem.status === 5) {
        if (isStringEmpty(this.deliveryCompanyName)) {
          this.$notify({ message: this.$t("message.holding.companyNameMsg"), duration: 2500, showClose: false, customClass: 'notifyClass' });
          return;
        } else if (isStringEmpty(this.deliveryLogistics)) {
          this.$notify({ message: this.$t("message.holding.logisticMsg"), duration: 2500, showClose: false, customClass: 'notifyClass' });
          return;
        }
        const dict = {};
        const that = this;
        let result;
        dict['orderid'] = this.selectedItem.id;
        dict['courierNumber'] = this.deliveryLogistics;
        dict['courierComp'] = this.deliveryCompanyName;
        result = await shopOrderExpress(dict);
        if (result.status === 200) {
          that.hanleClickCloseHoldMaks(5);
          that.getCustomerNFTList(true);
          that.$notify({ message: this.$t("message.holding.deliverySuccess"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        } else {
          that.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
        }
      } else if (this.selectedItem.status === 6) {
        if (isStringEmpty(this.deliveryCompanyName)) {
          this.$notify({ message: this.$t("message.holding.companyNameMsg"), duration: 2500, showClose: false, customClass: 'notifyClass' });
          return;
        } else if (isStringEmpty(this.deliveryLogistics)) {
          this.$notify({ message: this.$t("message.holding.logisticMsg"), duration: 2500, showClose: false, customClass: 'notifyClass' });
          return;
        }
        const dict = {};

        const that = this;
        let result;

        dict['orderid'] = this.selectedItem.id;
        dict['courierNumber'] = this.deliveryLogistics;
        dict['courierComp'] = this.deliveryCompanyName;
        result = await shopOrderExpress(dict);
        if (result.status === 200) {
          that.hanleClickCloseHoldMaks(5);
          that.getCustomerNFTList(true);
          that.$notify({ message: this.$t("message.holding.deliverySuccess"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        } else {
          that.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
        }
      }
    },
    // 下拉刷新回调
    onRefresh() {
      this.isFinisedLoadMoring = false;
      this.getCustomerNFTList(true);
    },
    // 上拉加载更多
    onLoadMore() {
      this.getCustomerNFTList(false);
    },
    // 获取用户在持NFT数据
    async getCustomerNFTList(isRefresh) {
      if (!this.isConnectWallet) {
        return;
      }
      const dict = {};
      dict['sender'] = this.walletAddress; // 用户地址
      dict['page'] = isRefresh ? 1 : this.pageSize; // 当前第几页
      const that = this;
      const result = await getList(dict);
      if (result.status === 200) {
        result.data.result.forEach((item) => {
          if (isStringEmpty(item.picurl)) {
            item.picurl = '';
          } else {
            const newStr = item.picurl.indexOf("https");
            if (newStr === -1) {
              item.picurl = `${settingConfig.ipfsNFTUrl + item.picurl}`
            }
          }
        });
        // 当获取数据完成后开始处理控件状态
        if (isRefresh) {
          that.isRefresh = false;
          that.pageSize = 2;
          that.orderDataList = [];
          console.log('下拉刷新');
        } else {
          that.isLoadMoring = false;
          this.pageSize++;
          // 当返回的数据是空的时候则表示已经加载完毕
          console.log('上拉加载更多');
        }
        if (result.data.result.length < 8) {
          that.isFinisedLoadMoring = true;
        }
        that.orderDataList = that.orderDataList.concat(result.data.result);
        console.log(`店铺商品列表数据=`, that.orderDataList);
      } else {
        if (isRefresh) {
          that.isRefresh = false;
        } else {
          that.isLoadMoring = false;
        }
        that.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
      }
    },
    // 1、确认交割信息  2、取消发货(确认收货)
    async handleConfirmDelivery(index) {
      if (!this.isConnectWallet) {
        return;
      }
      if (index === 1) {
        // 提交/修改持有者的收货信息
        if (isStringEmpty(this.deliveryName)) {
          this.$notify({ message: this.$t("message.holding.nameMsg"), duration: 2500, showClose: false, customClass: 'notifyClass' });
          return;
        } else if (isStringEmpty(this.phoneAearNum)) {
          this.$notify({ message: this.$t("message.holding.areaNumMsg"), duration: 2500, showClose: false, customClass: 'notifyClass' });
          return;
        } else if (isStringEmpty(this.deliveryPhone)) {
          this.$notify({ message: this.$t("message.holding.numberMsg"), duration: 2500, showClose: false, customClass: 'notifyClass' });
          return;
        } else if (isStringEmpty(this.deliveryArea)) {
          this.$notify({ message: this.$t("message.holding.areaMsg"), duration: 2500, showClose: false, customClass: 'notifyClass' });
          return;
        }
        const dict = {};
        const that = this;
        let result;
        dict['user'] = this.deliveryName;
        // dict['areaNum'] = this.phoneAearNum;
        dict['number'] = this.phoneAearNum + ' ' + this.deliveryPhone;
        dict['area'] = this.deliveryArea;
        dict['orderid'] = this.selectedItem.id;
        result = await modifyOrderReceiver(dict);
        console.log('提交物流信息 =', result);
        if (result.status === 200) {
          that.showHoldMaks = false;
          that.holdSalePrice = '';
          that.showDeliveryShippedMaks = false;
          that.logisticsData = '';
          that.showDeliveryMaks1 = false;
          that.selectedItem = '';
          that.phoneAearNum = '86';
          that.deliveryName = '';
          that.deliveryPhone = '';
          that.deliveryArea = '';
          // 刷新数据
          that.getCustomerNFTList(true);
          that.$notify({ message: that.$t("message.holding.deliverySumbitSuccess"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        } else {
          that.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
        }
      } else if (index === 2) {
        // 判断是取消交割还是确认交割
        if (this.selectedItem.status === 5) {
          // 取消交割
          // const dict = {};
          // dict['address'] = this.walletAddress;
          // dict['tokenid'] = this.selectedItem.tokenid;
          // const that = this;
          // this.$loading.showLoading();
          // const result = await cancleDeliveryInfoData(dict);
          // console.log('取消交割 =', result);
          // if (result.status === 200) {
          //   that.$loading.hiddenLoading();
          //   that.logisticsData = '';
          //   that.holdSalePrice = '';
          //   that.selectedItem = '';
          //   that.showHoldMaks = false;
          //   that.showDeliveryShippedMaks = false;
          //   // 刷新数据
          //   that.getCustomerNFTList(true);
          // } else {
          //   this.$loading.hiddenLoading();
          //   that.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
          // }
        } else if (this.selectedItem.status === 6) {
          // 确认最终的交割
          try {
            const that = this;
            this.$loading.showLoading();
            const dict = { orderid: this.selectedItem.id }
            const result = await confirmedOrder(dict);
            if (result.status === 200) {
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
            } else {
              this.$loading.hiddenLoading();
              this.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
              console.log('Error message: ', error)
            }
          } catch (error) {
            this.$loading.hiddenLoading();
            this.$notify({ message: error.message, duration: 2500, showClose: false, customClass: 'notifyClass' });
            console.log('Error message: ', error)
          }
        }
      } else if (index === 3) {
        // 联系铸造者
        const dict = {};
        const that = this;
        let result;
        dict['orderid'] = this.selectedItem.id;
        result = await getShopInfo(dict);
        console.log('铸造者信息=', result);
        if (result.status === 200) {
          that.casterInfoData = result.data;
          that.casterInfoData['level'] = result.data.level;
          that.casterInfoData['number'] = result.data.number;
          //that.casterInfoData['picurl'] = isStringEmpty(result.data.picurl) ? '' :  `${settingConfig.ipfsNFTUrl + result.data.picurl}`;
          that.casterInfoData['bbm'] = isStringEmpty(result.data.bbm) ? '--' : result.data.bbm;
          that.casterInfoData['qnumber'] = isStringEmpty(result.data.qnumber) ? '--' : result.data.qnumber;
          that.casterInfoData['skype'] = isStringEmpty(result.data.skype) ? '--' : result.data.skype;
          that.casterInfoData['tg'] = isStringEmpty(result.data.tg) ? '--' : result.data.tg;
          that.casterInfoData['wechat'] = isStringEmpty(result.data.wechat) ? '--' : result.data.wechat;
          that.logisticsData = '';
          if (isStringEmpty(result.data.picurl)) {
            that.casterInfoData['picurl'] = '';
          } else {
            const newStr = result.data.picurl.indexOf("https");
            if (newStr === -1) {
              that.casterInfoData['picurl'] = `${settingConfig.ipfsNFTUrl + result.data.picurl}`
            } else {
              that.casterInfoData['picurl'] = result.data.picurl;
            }
          }
          that.showDeliveryShippedMaks = false;
          that.contactCasterMaks = true;
        } else {
          that.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
        }
      }
    },
    // 编辑收货地址
    handleClickEditAddress() {
      let info = this.logisticsData.number.split(" ");
      this.deliveryName = this.logisticsData.user;
      this.phoneAearNum = info[0];
      this.deliveryPhone = info[1];
      this.deliveryArea = this.logisticsData.area;
      this.showDeliveryMaks1 = true;
    },
    // 复制联系方式
    handleClickCopy(index) {
      let copyText = '';
      if (index === 1) {
        copyText = this.casterInfoData.phone;
      } else if (index === 2) {
        copyText = this.casterInfoData.qnumber;
      } else if (index === 3) {
        copyText = this.casterInfoData.wechat;
      } else if (index === 4) {
        copyText = this.casterInfoData.tg;
      } else if (index === 5) {
        copyText = this.casterInfoData.skype;
      } else if (index === 6) {
        copyText = this.casterInfoData.bbm;
      }
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
        textArea.style.opacity = '0';
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
    //  复制快递单号
    handleCopyLogistics() {
      let copyText = this.logisticsData.expressNumber;
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
  },
}
</script>

<style lang="scss" scoped>

.shop {
  flex: 1;
  overflow-y: auto;
  width: 100vw;
  padding-top: 0.1px;
  background-color: #3d3f60;
  .h_empty {
    margin: vw(370) auto 0;
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
  .h_contian {
    width: vw(690);
    margin: vw(20) auto 0;
  }
  .h_pagination {
    height: vw(40);
    margin: vw(40) auto 0;
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
  .m_delivery {
    position: relative;
    width: vw(690);
    padding-top: vw(25);
    padding-bottom: vw(45);
    //height: vw(682);
    border-radius: vw(20);
    background-color: #27273f;
    .m_d_title {
      margin: 0 auto;
      line-height: vw(50);
      font-size: vw(30);
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      color: #fff;
      font-family: Poppins, sans-serif;
    }
    .m_d_line {
      height: 1px;
      margin-top: vw(20);
      background-color: var(--bgc29);

    }
    .m_d_address {
      height: vw(150);
      padding: 0 vw(20);
      margin: vw(40) vw(25) 0;
      display: flex;
      align-items: center;
      border-radius: vw(20);
      background-color: #363652;
      img {
        width: vw(45);
        height: vw(54);
      }
      .m_d_a_content {
        margin-left: vw(35);
        div {
          overflow: hidden;
          width: vw(510);
          line-height: vw(30);
          font-size: vw(24);
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
          margin-top: vw(12);
        }
      }
    }
    .m_d_remark {
      padding: 0 vw(20);
      margin-top: vw(30);
      line-height: vw(33);
      font-family: PingFangSC, sans-serif;
      font-size: vw(24);
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      letter-spacing: normal;
      text-align: left;
      word-break: break-all;
      white-space: pre-wrap;
      color: #fff;
    }
    .m_d_info {
      padding: 0 vw(20);
      .m_d_i_one {
        margin-top: vw(30);
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          font-size: vw(24);
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          font-family: PingFangSC, sans-serif;
          color: #994cf0;
        }
        .m_d_i_item {
          width: vw(360);
          height: vw(70);
          border-radius: vw(4);
          background-color: #1b1b33;
          input {
            width: 90%;
            height: 100%;
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
            font-size: vw(20);
          }
          input:-moz-placeholder {
            /* FF 4-18 */
            color: #373752;
            font-size: vw(20);
          }
          input::-moz-placeholder {
            /* FF 19+ */
            color: #373752;
            font-size: vw(20);
          }
          input:-ms-input-placeholder {
            /* IE 10+ */
            color: #373752;
            font-size: vw(20);
          }
          input:-webkit-autofill {
            transition: background-color 5000s ease-in-out 0s; //背景颜色
          }
        }
      }
    }
    .m_d_delivery {
      width: vw(456);
      height: vw(94);
      margin: vw(40) auto 0;
      line-height: vw(94);
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
      background-image: url('../../../assets/newPhones/nLaboratory/h5_icon_destory_bg1.png');
    }
    .mask_close {
      width: vw(44);
      height: vw(44);
      top: vw(20);
      right: vw(25);
      position: absolute;
      cursor: pointer;
    }
  }
  .m_contian {
    position: relative;
    padding: vw(40) 0;
    width: vw(570);
    //height: vw(850);
    border-radius: vw(20);
    background-color: #27273f;
    .m_c_wrapper {
      display: flex;
      margin-top: vw(20);
      .m_c_icon {
        flex-shrink: 0;
        width: vw(200);
        height: vw(200);
        margin-left: vw(36);
        position: relative;
        border-radius: vw(10);
        img {
          width: 100%;
          height: 100%;
          border-radius: vw(10);
        }
        .m_c_i_bottom {
          position: absolute;
          width: 100%;
          height: vw(55);
          left: 0;
          bottom: vw(5);
          background-size: cover;
          background-repeat: no-repeat;
          background-image: url('../../../assets/laboras/icon_l_icon_bg.svg');
          user-select: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: vw(26);
            height: vw(26);
          }
          span {
            margin-left: vw(12);
            font-size: vw(22);
            font-weight: bold;
            font-family: Montserrat, sans-serif;
            color: var(--white);
          }
        }
      }
      .m_c_right {
        margin-left: vw(34);
        .m_dis_title {
          padding-right: vw(20);
          line-height: vw(40);
          font-size: vw(26);
          text-align: left;
          word-break: break-all;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          user-select: none;
          font-family: Ubuntu, sans-serif;
          color: var(--white);
          &:nth-child(2) {
            margin-top: vw(10);
            line-height: vw(33);
            color: #9a55dc;
          }
          &:nth-child(3) {
            margin-top: vw(28);
            line-height: vw(30);
            font-size: vw(24);
          }
        }
        .m_p_c_usdt {
          display: flex;
          align-items: center;
          margin-top: vw(20);
          img {
            width: vw(34);
            height: vw(34);
          }
          span {
            margin-left: vw(10);
            font-size: vw(28);
            line-height: vw(30);
            word-break: break-all;
            text-align: left;
            font-family: PingFangSC, sans-serif;
            font-weight: 600;
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
      padding: 0 vw(25);
      margin-top: vw(45);
      line-height: vw(30);
      font-size: vw(22);
      font-weight: normal;
      text-align: left;
      font-family: PingFangSC, sans-serif;
      color: #fff;

    }
    .m_dis_sort {
      padding: 0 vw(25);
      margin-top: vw(10);
      display: flex;
      justify-content: space-between;
      .m_d_s_item {
        width: vw(250);
        height: vw(80);
        line-height: vw(80);
        font-size: vw(26);
        border-radius: vw(8);
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
      margin-top: vw(20);
    }
    .m_dis_input {
      margin: vw(20) auto 0;
      width: vw(510);
      height: vw(80);
      border-radius: vw(10);
      background-color: #1b1b33;
      input {
        width: 100%;
        padding-left: vw(20);
        height: 100%;
        border: 0; // 去除未选中状态边框
        outline: none; // 去除选中状态边框
        font-size: vw(24);
        font-family: PingFangSC, sans-serif;
        font-weight: normal;
        box-sizing: border-box;
        background-color: transparent;
        color: var(--white);
      }
      input::-webkit-input-placeholder {
        color: var(--bgc26);
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
        font-size: 16px;
        font-weight: 600;
        font-family: PingFangSC, sans-serif;
        font-stretch: normal;
        font-style: normal;
        color: var(--white);
      }
    }
    .m_confirm_content {
      margin-top: vw(40);
      display: flex;
      align-items: center;
      justify-content: center;
      .m_dis_sell1 {
        width: vw(220);
        height: vw(94);
        font-size: vw(28);
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
          margin-left: vw(10);
          background-image: url('../../../assets/newPhones/nLaboratory/h5_icon_l_cancle.png');
        }
      }
    }
    .m_dis_sell {
      width: vw(456);
      height: vw(94);
      margin: vw(40) auto 0;
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
        font-size: vw(28);
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
      margin-top: vw(40);
    }
    .m_dis_bottom {
      display: flex;
      width: vw(500);
      margin: vw(20) auto 0;
      justify-content: space-between;
      .m_dis_confirm {
        width: vw(240);
        height: vw(60);
        cursor: pointer;
        user-select: none;
        box-sizing: border-box;
        background-size: contain;
        background-repeat: no-repeat;
        //background-image: url('../../../assets/laboras/h5_icon_destory_bg.svg');
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          font-family: PingFangSC, sans-serif;
          font-size: vw(28);
          font-weight: 500;
          color: var(--primary);
        }
      }
      .m_dis_destory {
        span {
          font-family: PingFangSC, sans-serif;
          font-size: vw(28);
          font-weight: 500;
          color: var(--primary);
        }
      }
    }
    .m_dis_confirm {
      width: vw(500);
      height: vw(60);
      margin-top: vw(40);
      cursor: pointer;
      user-select: none;
      box-sizing: border-box;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      //background-image: url('../../../assets/laboras/h5_icon_destoryAll_bg.svg');
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        font-family: PingFangSC, sans-serif;
        font-size: vw(28);
        font-weight: 500;
        color: var(--primary);
      }
    }
    .m_dis_destory {
      span {
        font-family: PingFangSC, sans-serif;
        font-size: vw(28);
        font-weight: 500;
        color: var(--primary);
      }
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
  .m_contian1 {
    width: vw(570);
    //height: vw(410);
  }
  .m_shiped {
    position: relative;
    width: vw(690);
    padding-top: vw(25);
    padding-bottom: vw(45);
    //height: vw(660);
    border-radius: vw(20);
    background-color: #27273f;
    .m_d_title {
      margin: 0 auto;
      line-height: vw(50);
      font-size: vw(30);
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      color: #fff;
      font-family: Poppins, sans-serif;
    }
    .m_d_line {
      height: 1px;
      margin-top: vw(30);
      background-color: var(--bgc29);

    }
    .m_d_address {
      position: relative;
      height: vw(150);
      padding: 0 vw(25);
      margin: vw(40) vw(25) 0;
      display: flex;
      align-items: center;
      border-radius: vw(20);
      background-color: #363652;
      img {
        width: vw(45);
        height: vw(54);
      }
      .m_d_edit {
        position: absolute;
        top: calc(50% - 20 / 750 * 100vw);
        right: vw(20);
        width: vw(40);
        height: vw(40);
      }
      .m_d_a_content {
        margin-left: vw(35);
        div {
          overflow: hidden;
          width: vw(460);
          line-height: vw(30);
          font-size: vw(24);
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
          margin-top: vw(12);
        }
      }
    }
    .m_d_remark {
      padding: 0 vw(25);
      margin-top: vw(30);
      line-height: vw(33);
      font-family: Poppins, sans-serif;
      font-size: vw(24);
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      letter-spacing: normal;
      text-align: left;
      word-break: break-all;
      white-space: pre-wrap;
      color: #fff;
    }
    .m_d_info {
      padding: 0 vw(25);
      .m_d_i_one {
        margin-top: vw(30);
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          font-size: vw(24);
          font-weight: normal;
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
        margin-top: vw(36);
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          font-size: vw(26);
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
      width: vw(456);
      height: vw(94);
      margin: vw(30) auto 0;
      line-height: vw(94);
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
      background-image: url('../../../assets/newPhones/nWish/icon_wish_cancle.svg');
    }
    .m_d_contactCasting {
      margin: vw(20) auto 0;
      background-image: url('../../../assets/newPhones/nLaboratory/h5_icon_destory_bg1.png');
    }
    .m_d_delivery1 {
      margin-top: vw(60);
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
  .m_sale {
    width: vw(500);
    height: vw(320);
    border-radius: vw(20);
    background-color: #2e2f48;
    .m_s_desc {
      margin: vw(85) vw(50) 0;
      line-height: vw(33);
      font-size: vw(32);
      font-weight: 500;
      font-family: PingFangSC, sans-serif;
      font-stretch: normal;
      font-style: normal;
      color: var(--white);
    }
    .m_s_btn {
      margin: vw(50) auto 0;
      display: flex;
      justify-content: space-between;
      width: vw(472);
      div {
        width: vw(236);
        height: vw(94);
        line-height: vw(94);
        font-size: vw(28);
        font-weight: 500;
        user-select: none;
        cursor: pointer;
        color: #fff;
        font-family: PingFangSC, sans-serif;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-image: url('../../../assets/newPhones/nLaboratory/h5_icon_l_cancle.png');
        &:last-child {
          background-image: url('../../../assets/newPhones/nLaboratory/h5_icon_l_takeBack.png');
        }
      }
    }
  }
  .m_contact {
    position: relative;
    width: vw(690);
    height: vw(730);
    border-radius: vw(20);
    background-color: #27273f;
    .m_c_title {
      margin: vw(16) auto 0;
      line-height: vw(50);
      font-size: vw(30);
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      color: #fff;
      font-family: Poppins, sans-serif;
    }
    .m_d_line {
      margin-top: vw(30);
      height: 2px;
      background-color: var(--bgc29);
    }
    .m_c_avatar {
      position: relative;
      margin-top: vw(40);
      .m_c_a_icon {
        margin: 0 auto;
        width: vw(140);
        height: vw(140);
        border-radius: vw(70);
        overflow: hidden;
        //border: solid 2px var(--bgc14);
        img {
          width: 100%;
          height: 100%;
        }
      }
      .m_c_a_level {
        width: 20px;
        height: 20px;
        position: absolute;
        bottom: -5px;
        left: calc(50% - 10px);
      }
    }
    .m_c_creator {
      margin-top: vw(10);
      line-height: vw(27);
      font-size: vw(24);
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      font-family: Poppins, sans-serif;
      color: #fff;
    }
    .m_c_item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: vw(40);
      padding: 0 vw(20);
      .m_c_i_left {
        display: flex;
        align-items: center;
        width: vw(310);
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
          font-family: Poppins, sans-serif;
          color: #fff;
        }
      }
    }
    .m_c_item1 {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: vw(10);
      padding: 0 vw(20);
      .m_c_i1_left {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: vw(310);
        height: vw(60);
        border-radius: vw(10);
        background-color: #363843;
        span {
          margin-left: vw(10);
          line-height: vw(27);
          font-size: vw(24);
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          font-family: Poppins;
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

.mask1 {
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
  .m_delivery {
    position: relative;
    width: vw(690);
    height: vw(820);
    border-radius: vw(20);
    background-color: #27273f;
    .m_d_title {
      margin: vw(30) auto 0;
      line-height: vw(38);
      font-size: vw(34);
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      color: #fff;
      font-family: Poppins, sans-serif;
    }
    .m_d_line {
      height: 1px;
      margin-top: vw(20);
      background-color: var(--bgc29);
    }
    .m_d_info {
      padding: 0 vw(30);
      .m_d_i_one {
        margin-top: vw(30);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        span {
          line-height: vw(27);
          font-size: vw(24);
          font-weight: 500;
          text-align: left;
          font-stretch: normal;
          font-style: normal;
          font-family: Poppins, sans-serif;
          color: #fff;
        }
        .m_d_i_item {
          height: vw(80);
          margin-top: vw(10);
          border-radius: vw(10);
          background-color: #1b1b33;
          input {
            width: 90%;
            height: 100%;
            border: 0; // 去除未选中状态边框
            outline: none; // 去除选中状态边框
            font-size: vw(26);
            font-family: Montserrat, sans-serif;
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
      }
      .m_d_i_two {
        margin-top: vw(30);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        span {
          line-height: vw(27);
          font-size: vw(24);
          font-weight: 500;
          text-align: left;
          font-stretch: normal;
          font-style: normal;
          font-family: Poppins, sans-serif;
          color: #fff;
        }
        .m_d_i_item {
          height: vw(80);
          margin-top: vw(10);
          border-radius: vw(10);
          background-color: #1b1b33;
          input {
            width: 90%;
            height: 100%;
            border: 0; // 去除未选中状态边框
            outline: none; // 去除选中状态边框
            font-size: vw(26);
            font-family: Montserrat, sans-serif;
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
            width: vw(80);
            height: 100%;
            border: 0; // 去除未选中状态边框
            outline: none; // 去除选中状态边框
            font-size: vw(26);
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
      margin-top: vw(30);
      padding: 0 vw(30);
      .m_d_a_title {
        line-height: vw(27);
        font-size: vw(26);
        font-weight: 500;
        text-align: left;
        font-stretch: normal;
        font-style: normal;
        color: #fff;
        font-family: Poppins, sans-serif;
      }
      .m_d_a_container {
        width: 100%;
        height: vw(200);
        margin-top: vw(20);
        border-radius: vw(10);
        background-color: #1b1b33;
        textarea {
          margin-top: vw(20);
          width: 90%;
          height: 80%;
          border: 0; // 去除未选中状态边框
          resize: none;
          outline: none; // 去除选中状态边框
          font-size: vw(26);
          font-family: Poppins, sans-serif;
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
    .m_d_delivery {
      width: vw(456);
      height: vw(94);
      margin: vw(40) auto 0;
      line-height: vw(94);
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
      background-image: url('../../../assets/newPhones/nLaboratory/h5_icon_destory_bg1.png');
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
</style>

