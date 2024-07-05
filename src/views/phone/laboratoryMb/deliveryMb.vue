<template>
  <div class="delivery">
    <div v-if="deliveryDataList.length <= 0" class="s_empty">{{ $t("message.holding.empty") }}</div>
    <div v-else class="s_contian">
      <van-pull-refresh style="min-height: 100vh" v-model="isRefresh" @refresh="onRefresh">
        <van-list v-model="isLoadMoring" :finished="isFinisedLoadMoring" :finished-text="$t('message.alertMsg.loadFinisedMsg')" :immediate-check="false" @load="onLoadMore">
          <delivery-card :marketList="deliveryDataList" @handleClickCheck="handleClickCheck"></delivery-card>
        </van-list>
      </van-pull-refresh>
    </div>
    <!-- 发货弹框 -->
    <div class="mask" v-show="showDeliveryMaks" @touchmove.prevent @mousewheel.prevent>
      <div class="m_delivery">
        <div class="m_d_title">{{ `${selectItem.status === '5' ? $t("message.holding.Tobedelivered") : $t("message.holding.Shipped")}` }}</div>
        <div class="m_d_address">
          <img src="../../../assets/newPhones/nLaboratory/icon_d_address.svg" alt="">
          <div class="m_d_a_content">
            <div>{{ `${logisticsData.user}   +${logisticsData.number}` }}</div>
            <div class="m_d_a_c_margin">{{ logisticsData.area }}</div>
          </div>
        </div>
        <!--<div class="m_d_remark">备注:xxxxxxxxxxxxx</div>-->
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
        <div class="m_d_delivery" @click="handleConfirmShip">{{ `${selectItem.status === '5' ? $t("message.holding.ConfirmShip") : $t("message.holding.ConfirmModify")}` }}</div>
        <img class="mask_close" src="../../../assets/newPhones/nLaboratory/icon_qb_close.svg" alt="logo" @click="hanleClickCloseHoldMaks()">
      </div>
    </div>
  </div>
</template>

<script>
import {isStringEmpty} from "@/utils/validate";
import {mapGetters} from 'vuex';
import {getCustomerNFTList, getReceiverLogisticsInfoData, getShopExpress, getShopReceiver, shopOrderExpress, toBeDeliveryInfoData, updateExpressLogisticsInfoData, updateLogisticsInfoData} from '@/api/mark'
import deliveryCardMb from '../../../components/deliveryCardMb/deliveryCardMb.vue';

const settingConfig = require('../../../settings.js');

export default {
  name: "delivery",
  components: { 'delivery-card': deliveryCardMb },
  data() {
    return {
      isRefresh: false,// 是否刷新中
      isLoadMoring: false, // 加载更多
      isFinisedLoadMoring: false, // 结束加载更是
      showDeliveryMaks: false,// 收货信息弹框
      placeholderDesc1: this.$t("message.holding.companyMsg"),
      placeholderDesc2: this.$t("message.holding.trackingMsg"),
      logisticsData: '', // 收货人的信息
      deliveryCompanyName: '', // 快递公司
      deliveryLogistics: '', // 快递单号
      selectItem: '', // 选中的NFT对象
      pageSize: 1, // 当前的页码
      deliveryDataList: [],
    };
  },
  created() {
    this.getCustomerNFTList(true);
    console.log('hold page create');
  },
  mounted() {

  },
  destroyed() {

  },
  // 计算属性
  computed: {
    ...mapGetters(['isConnectWallet', 'walletAddress']),
  },
  // 监听属性改变
  watch: {
    isConnectWallet(val, oval) {
      this.showDeliveryMaks = false;
      if (val) {
        this.getCustomerNFTList(true);
      } else {
        this.deliveryDataList = [];
      }
    },
    // 监听语言的切换
    '$i18n.locale'(nval, oval) {
      this.placeholderDesc1 = this.$t("message.holding.companyMsg");
      this.placeholderDesc2 = this.$t("message.holding.trackingMsg");
      console.log('监听到语言的切换');
    },
  },
  // 方法
  methods: {
    // 发货弹框
    async handleClickCheck(item) {
      if (item.status === '5') { // 5
        this.selectItem = item;
        const that = this;
        let result;
        const dict = {};
        // 获取物流信息
        if (this.selectItem.headType === 3) {
          dict['orderid'] = item.tokenid;
          result = await getShopReceiver(dict);
        } else {
          dict['caster'] = this.walletAddress;
          dict['tokenid'] = item.tokenid;
          result = await getReceiverLogisticsInfoData(dict);
        }
        if (result.status === 200) {
          that.logisticsData = result.data;
          that.showDeliveryMaks = true;
          console.log('物流信息数据 =', that.logisticsData);
        } else {
          that.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
        }
      } else if (item.status === '6') { // 6
        this.selectItem = item;
        const dict = {};
        let result;
        const that = this;
        if (this.selectItem.headType === 3) {
          dict['orderid'] = item.tokenid;
          result = await getShopExpress(dict);
        } else {
          dict['address'] = this.walletAddress;
          dict['tokenid'] = item.tokenid;
          result = await updateExpressLogisticsInfoData(dict);
        }
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
      }
    },
    // 关闭查看NFT
    hanleClickCloseHoldMaks() {
      this.selectItem = '';
      this.logisticsData = '';
      this.deliveryLogistics = '';
      this.deliveryCompanyName = '';
      this.showDeliveryMaks = false;
    },
    // 确认发货
    async handleConfirmShip() {
      if (this.selectItem.status === '5') {
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
        if (this.selectItem.headType === 3) {
          dict['orderid'] = this.selectItem.tokenid;
          dict['courierNumber'] = this.deliveryLogistics;
          dict['courierComp'] = this.deliveryCompanyName;
          result = await shopOrderExpress(dict);
        } else {
          dict['address'] = this.walletAddress;
          dict['tokenid'] = this.selectItem.tokenid;
          dict['courierNumber'] = this.deliveryLogistics;
          dict['courierComp'] = this.deliveryCompanyName;
          result = await toBeDeliveryInfoData(dict);
        }
        if (result.status === 200) {
          that.hanleClickCloseHoldMaks();
          that.getCustomerNFTList(true);
          that.$notify({ message: this.$t("message.holding.deliverySuccess"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        } else {
          that.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
        }
      } else if (this.selectItem.status === '6') {
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
        if (this.selectItem.headType === 3) {
          dict['orderid'] = this.selectItem.tokenid;
          dict['courierNumber'] = this.deliveryLogistics;
          dict['courierComp'] = this.deliveryCompanyName;
          result = await shopOrderExpress(dict);
        } else {
          dict['address'] = this.walletAddress;
          dict['tokenid'] = this.selectItem.tokenid;
          dict['courierNumber'] = this.deliveryLogistics;
          dict['courierComp'] = this.deliveryCompanyName;
          result = await updateLogisticsInfoData(dict);
        }
        if (result.status === 200) {
          that.hanleClickCloseHoldMaks();
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
      dict['status'] = '3'; // 1: 在售 2: 在持 3:待交割
      dict['address'] = this.walletAddress; // 用户地址
      dict['page'] = isRefresh ? 1 : this.pageSize; // 当前第几页
      const that = this;
      const result = await getCustomerNFTList(dict);
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
          that.deliveryDataList = [];
          console.log('下拉刷新');
        } else {
          that.isLoadMoring = false;
          this.pageSize++;
          console.log('上拉加载更多');
        }
        // 当返回的数据是空的时候则表示已经加载完毕
        if (result.data.result.length < 8) {
          that.isFinisedLoadMoring = true;
        }
        that.deliveryDataList = that.deliveryDataList.concat(result.data.result);
        console.log(`待交割列表数据=`, that.deliveryDataList);
      } else {
        if (isRefresh) {
          that.isRefresh = false;
        } else {
          that.isLoadMoring = false;
        }
        that.$notify({ message: result.data, duration: 2500, showClose: false, customClass: 'notifyClass' });
      }
    },
  },
};
</script>

<style lang="scss" scoped>

.delivery {
  flex: 1;
  overflow-y: auto;
  width: 100vw;
  padding-top: 0.1px;
  background-color: #3d3f60;
  .s_empty {
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
  .s_contian {
    width: vw(690);
    margin: vw(20) auto 0;
  }
  .s_pagination {
    height: vw(40);
    margin: vw(40) auto 0;
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
        font-family: Poppins, sans-serif;
        font-size: vw(24);
        word-break: normal;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: normal;
        text-align: left;
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
  }
}

</style>
