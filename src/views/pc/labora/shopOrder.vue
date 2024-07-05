<template>
  <div class="shop-order">
    <div class="shop-order-body">
      <div class="shop-order-title">
        <span>{{ $t('message.shopOrder.orderInformation') }}</span>
        <span>{{ $t('message.shopOrder.operating') }}</span>
      </div>
      <div class="shop-order-line"></div>
      <div v-if="orderDataList.length <= 0" class="s_empty">{{ $t("message.holding.empty") }}</div>
      <div v-else class="s_contian" @scroll="scrollEvent">
        <order-card :marketList="orderDataList" @handleClickItem="handleClickItem"></order-card>
      </div>
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
        <div class="m_d_line"></div>
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
import OrderCard from '@/components/orderCard/orderCard'
import {mapGetters} from 'vuex'
import {isStringEmpty} from '@/utils/validate'
import {confirmedOrder, getList, getShopExpress, getShopInfo, getShopReceiver, modifyOrderReceiver, shopOrderExpress} from '@/api/mark'
import settingConfig from '@/settings'

export default {
  name: "shopOrder",
  components: { OrderCard },
  data() {
    return {
      isEnglish: false, // 中英文
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
      pageNum: 1, // 当前的页码
      moreLoading: false, // 是否是加载中
      noMore: false, // 是否没有数据了
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
    // 滚动事件
    scrollEvent(e) {
      // !this.moreLoading 没有在加载状态，触发加载更多时，把this.moreLoading置未true
      // !this.noMore 没有更多的状态为false，当我们取到的数据长度小于1页的数量时，就没有更多了数据了，把 this.noMore置为true，这样就不会触发无意义的加载更多了
      const ele = e.srcElement ? e.srcElement : e.target;
      if(ele.scrollTop + ele.offsetHeight > ele.scrollHeight - 10 && !this.moreLoading && !this.noMore) {
        this.getCustomerNFTList(false);
        console.log('调用再持加载更多');
      }
    },
    // 获取用户在持NFT数据
    async getCustomerNFTList(isRefresh) {
      if (!this.isConnectWallet) {
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
      dict['sender'] = this.walletAddress; // 用户地址
      dict['page'] = this.pageNum; // 当前第几页
      dict['count'] = 10;
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
        console.log('orderDataList =',result.data.result)
        // 当获取数据完成后开始处理控件状态
        if (isRefresh) {
          that.orderDataList = result.data.result;
        } else {
          that.orderDataList.push(...result.data.result);
        }
        // 将状态机设置对应状态
        that.moreLoading = false;
        // 当我们取到的数据长度小于1页的数量时，就没有更多了数据了
        if (result.data.result.length < 10) {
          that.noMore = true;
        }
      } else {
        that.moreLoading = false;
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
.shop-order {
  .shop-order-body {
    width: 1200px;
    height: 990px;
    padding: 0 26px;
    margin: 30px auto 80px;
    border-radius: 6px;
    border: solid 1px #4f5776;
    background-color: #343650;
    .shop-order-title {
      margin-top: 19px;
      display: flex;
      justify-content: space-between;
      padding: 0 93px 0 38px;
      span {
        font-family: PingFangSC-Semibold, sans-serif;
        font-size: 16px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: center;
        color: var(--white);
      }
    }
    .shop-order-line {
      width: 1147px;
      height: 2px;
      margin: 16px auto 0;
      background-color: #202136;
    }
    .s_empty {
      margin: 100px auto 0;
      padding-top: 150px;
      width: 172px;
      height: 180px;
      line-height: 28px;
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      font-family: "PingFang SC", sans-serif;
      color: #c5c8d9;
      box-sizing: border-box;
      background-size: contain;
      background-repeat: no-repeat;
      background-image: url('../../../assets/universal/icon_empty.svg');
    }
    .s_contian {
      width: 1147px;
      height: 880px;
      margin: 34px auto 0;
      overflow-y: scroll;
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
      width: 580px;
      padding-top: 16px;
      padding-bottom: 40px;
      border-radius: 20px;
      background-color: #27273f;
      .m_d_title {
        margin: 0 auto;
        line-height: 28px;
        font-size: 20px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        color: #fff;
        font-family: PingFangSC, sans-serif;
      }
      .m_d_address {
        height: 130px;
        padding: 0 20px;
        margin: 16px 20px 0;
        display: flex;
        align-items: center;
        border-radius: 20px;
        background-color: #363652;
        img {
          width: 33px;
          height: 40px;
        }
        .m_d_a_content {
          margin-left: 20px;
          div {
            overflow: hidden;
            width: 384px;
            line-height: normal;
            font-size: 14px;
            font-weight: 500;
            text-align: left;
            word-wrap: break-word;
            word-break: normal;
            font-stretch: normal;
            font-style: normal;
            color: #999;
            font-family: PingFangSC-Regular, sans-serif;
            &:last-child {
              color: #fff;
              font-family: PingFangSC, sans-serif;
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
        font-family: PingFangSC, sans-serif;
        font-size: 14px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: normal;
        text-align: left;
        word-break: break-all;
        white-space: pre-wrap;
        color: #fff;
      }
      .m_d_info {
        margin-top: 20px;
        padding: 0 20px;
        .m_d_i_one {
          margin-top: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          span {
            font-size: 14px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            font-family: PingFangSC, sans-serif;
            color: #994cf0;
          }
          .m_d_i_item {
            width: 300px;
            height: 50px;
            border-radius: 4px;
            background-color: #1b1b33;
            input {
              width: 90%;
              height: 100%;
              border: 0; // 去除未选中状态边框
              outline: none; // 去除选中状态边框
              font-size: 14px;
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
        }
      }
      .m_d_delivery {
        width: 290px;
        height: 50px;
        margin: 20px auto 0;
        line-height: 50px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        user-select: none;
        box-sizing: border-box;
        font-stretch: normal;
        font-style: normal;
        color: #fff;
        font-family: PingFangSC-Semibold, sans-serif;
        border-radius: 10px;
        box-shadow: 0 0 10px 0 rgba(123, 40, 219, 0.6);
        background-image: linear-gradient(85deg, #f109b4 -1%, #622fe3 102%);
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
    .m_shiped {
      position: relative;
      width: 580px;
      padding-top: 16px;
      padding-bottom: 40px;
      border-radius: 20px;
      background-color: #27273f;
      .m_d_title {
        margin: 0 auto;
        line-height: 28px;
        font-size: 20px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        color: #fff;
        font-family: PingFangSC, sans-serif;
      }
      .m_d_address {
        position: relative;
        height: 130px;
        padding: 0 20px;
        margin: 16px 20px 0;
        display: flex;
        align-items: center;
        border-radius: 20px;
        background-color: #363652;
        img {
          width: 33px;
          height: 40px;
        }
        .m_d_edit {
          position: absolute;
          top: calc(50% - 10 / 1080 * 100vw);
          right: 26px;
          width: 32px;
          height: 32px;
        }
        .m_d_a_content {
          margin-left: 20px;
          div {
            overflow: hidden;
            width: 384px;
            line-height: 20px;
            font-size: 14px;
            font-weight: 500;
            text-align: left;
            word-wrap: break-word;
            word-break: normal;
            font-stretch: normal;
            font-style: normal;
            color: #999;
            font-family: PingFangSC-Regular, sans-serif;
            &:last-child {
              color: #fff;
              font-family: PingFangSC, sans-serif;
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
        font-family: PingFangSC, sans-serif;
        font-size: 14px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: normal;
        text-align: left;
        word-break: break-all;
        white-space: pre-wrap;
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
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            font-family: PingFangSC, sans-serif;
            color: #994cf0;
            &:last-child {
              color: #fff;
            }
          }
        }
        .m_d_i_two {
          margin-top: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          span {
            font-size: 14px;
            font-weight: 500;
            font-stretch: normal;
            font-style: normal;
            font-family: PingFangSC, sans-serif;
            color: #994cf0;
            &:last-child {
              color: #fff;
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
        width: 290px;
        height: 50px;
        margin: 20px auto 0;
        line-height: 50px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        user-select: none;
        box-sizing: border-box;
        font-stretch: normal;
        font-style: normal;
        color: #fff;
        font-family: PingFangSC-Semibold, sans-serif;
        border-radius: 10px;
        box-shadow: 0 0 10px 0 rgba(123, 40, 219, 0.6), inset 0 3px 10px 0 #742adc;
        background-color: #2e2e48;
      }
      .m_d_contactCasting {
        margin: 20px auto 0;
        border-radius: 10px;
        box-shadow: 0 0 10px 0 rgba(123, 40, 219, 0.6);
        background-image: linear-gradient(85deg, #f109b4 -1%, #622fe3 102%);
      }
      .m_d_delivery1 {
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
    .m_contact {
      position: relative;
      width: 580px;
      height: 584px;
      border-radius: 20px;
      background-color: #27273f;
      .m_c_title {
        margin: 16px auto 0;
        line-height: 28px;
        font-size: 20px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        color: #fff;
        font-family: PingFangSC, sans-serif;
      }
      .m_d_line {
        margin-top: 15px;
        height: 1px;
        background-color: var(--bgc29);
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
        margin-top: 20px;
        line-height: 22px;
        font-size: 16px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        font-family: PingFangSC-Semibold, sans-serif;
        color: #fff;
      }
      .m_c_item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 30px;
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
            font-family: PingFangSC, sans-serif;
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
            margin-right: 10px;
            width: 16px;
            height: 16px;
          }
        }
      }
      .m_c_margin {
        margin-top: 30px;
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
      width: 580px;
      padding-top: 16px;
      padding-bottom: 30px;
      border-radius: 20px;
      background-color: #27273f;
      .m_d_title {
        margin: 0 auto;
        line-height: 28px;
        font-size: 20px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        color: #fff;
        font-family: PingFangSC, sans-serif;
      }
      .m_d_line {
        height: 1px;
        margin-top: 15px;
        background-color: var(--bgc29);
      }
      .m_d_info {
        padding: 0 20px;
        .m_d_i_one {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          span {
            line-height: 20px;
            font-size: 14px;
            font-weight: 500;
            text-align: left;
            font-stretch: normal;
            font-style: normal;
            font-family: Poppins, sans-serif;
            color: #fff;
          }
          .m_d_i_item {
            height: 50px;
            margin-top: 10px;
            border-radius: 10px;
            background-color: #1b1b33;
            input {
              width: 90%;
              height: 100%;
              border: 0; // 去除未选中状态边框
              outline: none; // 去除选中状态边框
              font-size: 14px;
              font-family: Montserrat, sans-serif;
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
        }
        .m_d_i_two {
          margin-top: 30px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          span {
            line-height: 20px;
            font-size: 14px;
            font-weight: 500;
            text-align: left;
            font-stretch: normal;
            font-style: normal;
            font-family: Poppins, sans-serif;
            color: #fff;
          }
          .m_d_i_item {
            height: 50px;
            margin-top: 10px;
            border-radius: 10px;
            background-color: #1b1b33;
            input {
              width: 90%;
              height: 100%;
              border: 0; // 去除未选中状态边框
              outline: none; // 去除选中状态边框
              font-size: 14px;
              font-family: Montserrat, sans-serif;
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
              font-size: 14px;
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
                margin-right: 10px;
              }
            }
            .c_r_i_p_input {
              width: 40px;
              height: 100%;
              border: 0; // 去除未选中状态边框
              outline: none; // 去除选中状态边框
              font-size: 14px;
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
        margin-top: 30px;
        padding: 0 20px;
        .m_d_a_title {
          line-height: 20px;
          font-size: 14px;
          font-weight: 500;
          text-align: left;
          font-stretch: normal;
          font-style: normal;
          color: #fff;
          font-family: PingFangSC, sans-serif;
        }
        .m_d_a_container {
          width: 100%;
          height: 150px;
          margin-top: 20px;
          border-radius: 10px;
          background-color: #1b1b33;
          textarea {
            margin-top: 20px;
            width: 90%;
            height: 80%;
            border: 0; // 去除未选中状态边框
            resize: none;
            outline: none; // 去除选中状态边框
            font-size: 14px;
            font-family: Poppins, sans-serif;
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
      .m_d_delivery {
        width: 290px;
        height: 50px;
        margin: 20px auto 0;
        line-height: 50px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        user-select: none;
        box-sizing: border-box;
        font-stretch: normal;
        font-style: normal;
        color: #fff;
        font-family: PingFangSC-Semibold, sans-serif;
        border-radius: 10px;
        box-shadow: 0 0 10px 0 rgba(123, 40, 219, 0.6);
        background-image: linear-gradient(85deg, #f109b4 -1%, #622fe3 102%);
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

</style>
