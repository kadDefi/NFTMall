<template>
  <div class="delivery">
    <div v-if="deliveryDataList.length <= 0" class="s_empty">{{ $t("message.holding.empty") }}</div>
    <div v-else class="s_contian" @scroll="scrollEvent">
      <delivery-card :marketList="deliveryDataList" @handleClickCheck="handleClickCheck"></delivery-card>
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
   <!-- <div class="mask" v-show="showDeliveryMaks" @touchmove.prevent @mousewheel.prevent>
      <div class="m_delivery">
        <div class="m_d_title">{{ `${selectItem.status === '5' ? $t("message.holding.Tobedelivered") : $t("message.holding.Shipped")  }` }}</div>
        <div class="m_d_address">
          <img src="../../../assets/laboras/icon_d_address.svg" alt="">
          <div class="m_d_a_content">
            <div>{{ logisticsData.area }}</div>
            <div class="m_d_a_c_margin">{{ `${logisticsData.user}   +${logisticsData.number}`}}</div>
          </div>
        </div>
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
        <div class="m_d_line"></div>
        <div class="m_d_delivery" @click="handleConfirmShip">{{ `${selectItem.status === '5' ? $t("message.holding.ConfirmShip") : $t("message.holding.ConfirmModify")  }` }}</div>
        <img class="mask_close" src="../../../assets/universal/icon_qb_close.svg" alt="logo" @click="hanleClickCloseHoldMaks()">
      </div>
    </div>-->
  </div>
</template>

<script>

const settingConfig = require('../../../settings.js');
import { mapGetters } from 'vuex';
import { getCustomerNFTList, getExpressLogisticsInfoData, getReceiverLogisticsInfoData, toBeDeliveryInfoData, updateExpressLogisticsInfoData, updateLogisticsInfoData } from '@/api/mark'
import {isStringEmpty} from "@/utils/validate";
import deliveryCard from '../../../components/deliveryCard/deliveryCard.vue';

export default {
  name: "delivery",
  components: {'delivery-card':deliveryCard},
  data() {
    return {
      showPapination:false,
      showDeliveryMaks:false,// 收货信息弹框
      placeholderDesc1:this.$t("message.holding.companyMsg"),
      placeholderDesc2:this.$t("message.holding.trackingMsg"),
      logisticsData:'', // 收货人的信息
      deliveryCompanyName:'', // 快递公司
      deliveryLogistics:'', // 快递单号
      selectItem:'', // 选中的NFT对象
      pageNum:1, // 分页
      moreLoading:false, // 是否是加载中
      noMore:false, // 是否没有数据了
      deliveryDataList:[], // 数据源
    };
  },
  created() {
    this.getCustomerNFTList(true);
    console.log('delivery page create');
  },
  mounted() {

  },
  destroyed() {

  },
  // 计算属性
  computed: {
    ...mapGetters(['isConnectWallet','walletAddress']),
  },
  // 监听属性改变
  watch:{
    isConnectWallet(val,oval) {
      if (val) {
        this.getCustomerNFTList(true);
      }else {
        this.hanleClickCloseHoldMaks();
        this.deliveryDataList = [];
      }
    },
    // 监听语言的切换
    '$i18n.locale'(nval,oval) {
      this.placeholderDesc1 = this.$t("message.holding.companyMsg");
      this.placeholderDesc2 = this.$t("message.holding.trackingMsg");
    },
  },
  // 方法
  methods: {
    // 发货弹框
    async handleClickCheck(item) {
      if (item.status === '5') {
        this.selectItem = item;
        const dict = {};
        dict['caster'] = this.walletAddress;
        dict['tokenid'] = item.tokenid;
        const that = this;
        const result = await getReceiverLogisticsInfoData(dict);
        if (result.status === 200) {
          that.logisticsData = result.data;
          that.showDeliveryMaks = true;
          console.log('待发货时候物流信息数据 =',that.logisticsData);
        }else {
          that.$notify({message: result.data,duration: 2500,showClose:false,customClass:'notifyClass'});
        }
      }else  if (item.status === '6') {
        this.selectItem = item;
        const dict = {};
        dict['address'] = this.walletAddress;
        dict['tokenid'] = item.tokenid;
        const that = this;
        const result = await updateExpressLogisticsInfoData(dict);
        console.log('result',result)
        if (result.status === 200) {
          const data = result.data.userData;
          data['expressComp'] = result.data.outData.expressComp;
          data['expressNumber'] = result.data.outData.expressNumber;
          that.logisticsData = data;
          that.deliveryCompanyName = that.logisticsData.expressComp;
          that.deliveryLogistics = that.logisticsData.expressNumber;
          that.showDeliveryMaks = true;
          console.log('已发货物流信息数据 =',that.logisticsData);
        }else {
          that.$notify({message: result.data,duration: 2500,showClose:false,customClass:'notifyClass'});
        }
      }
    },
    // 关闭查看NFT
    hanleClickCloseHoldMaks() {
      this.selectItem = '';
      this.logisticsData ='';
      this.deliveryLogistics = '';
      this.deliveryCompanyName = '';
      this.showDeliveryMaks = false;
    },
    // 确认发货
    async handleConfirmShip() {
     if (this.selectItem.status === '5') {
       if (isStringEmpty(this.deliveryCompanyName)) {
         this.$notify({message: this.$t("message.holding.companyNameMsg"),duration: 2500,showClose:false,customClass:'notifyClass'});
         return;
       }else if (isStringEmpty(this.deliveryLogistics)) {
         this.$notify({message: this.$t("message.holding.logisticMsg"),duration: 2500,showClose:false,customClass:'notifyClass'});
         return;
       }
       const dict = {};
       dict['address'] = this.walletAddress;
       dict['tokenid'] = this.selectItem.tokenid;
       dict['courierNumber'] = this.deliveryLogistics;
       dict['courierComp'] = this.deliveryCompanyName;
       const that = this;
       const result = await toBeDeliveryInfoData(dict);
       if (result.status === 200) {
         that.hanleClickCloseHoldMaks();
         that.getCustomerNFTList(true);
         that.$notify({message: this.$t("message.holding.deliverySuccess"),duration: 2500,showClose:false,customClass:'notifyClass'});
       }else {
         that.$notify({message: result.data,duration: 2500,showClose:false,customClass:'notifyClass'});
       }
     }else  if (this.selectItem.status === '6') {
       if (isStringEmpty(this.deliveryCompanyName)) {
         this.$notify({message: this.$t("message.holding.companyNameMsg"),duration: 2500,showClose:false,customClass:'notifyClass'});
         return;
       }else if (isStringEmpty(this.deliveryLogistics)) {
         this.$notify({message: this.$t("message.holding.logisticMsg"),duration: 2500,showClose:false,customClass:'notifyClass'});
         return;
       }
       const dict = {};
       dict['address'] = this.walletAddress;
       dict['tokenid'] = this.selectItem.tokenid;
       dict['courierNumber'] = this.deliveryLogistics;
       dict['courierComp'] = this.deliveryCompanyName;
       const that = this;
       const result = await updateLogisticsInfoData(dict);
       if (result.status === 200) {
         that.hanleClickCloseHoldMaks();
         that.getCustomerNFTList(true);
         that.$notify({message: this.$t("message.holding.deliverySuccess"),duration: 2500,showClose:false,customClass:'notifyClass'});
       }else {
         that.$notify({message: result.data,duration: 2500,showClose:false,customClass:'notifyClass'});
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
        console.log('开始调用待交割加载更多接口');
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
      dict['status'] = '3'; // 1: 在售 2: 在持 3:待交割
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
          that.deliveryDataList = result.data.result;
        }else {
          that.deliveryDataList.push(...result.data.result);
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
      console.log('待交割NFT列表',result);
    },
  },
};
</script>

<style lang="scss" scoped>

.delivery {
  max-width: 1200px;
  padding-top: 0.1px;
  margin: 0 auto;
  height: 950px;
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
    height: 950px;
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
    .m_delivery {
      position: relative;
      width: 580px;
      padding-top: 16px;
      padding-bottom: 20px;
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
        font-family: "PingFang SC", sans-serif;
      }
      .m_d_address {
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
        .m_d_a_content {
          margin-left: 20px;
          div {
            overflow: hidden;
            width: 450px;
            line-height: 20px;
            font-size: 14px;
            font-weight: 500;
            text-align: left;
            word-wrap: break-word;
            word-break: normal;
            font-stretch: normal;
            font-style: normal;
            color: #999;
            font-family: "PingFang SC", sans-serif;
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
          margin-top:30px;
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
        width: 306px;
        height: 64px;
        margin: 40px auto 0;
        line-height: 64px;
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
        background-image: url('../../../assets/btns/icon_btn_bg.png');
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
