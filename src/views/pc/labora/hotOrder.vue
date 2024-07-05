<template>
  <div class="hot">
    <div v-if="hotDataList.length <= 0" class="h_empty">{{ $t("message.holding.empty") }}</div>
    <div v-else class="h_contian">
      <hot-card :marketList="hotDataList" @handleClickItem="handleClickItem"></hot-card>
    </div>
    <div v-show="showPapination" class="h_pagination">
      <pagination :params="paginatioParams" @changePage="changePage"></pagination>
    </div>
    <!-- 联系铸造者  -->
    <div class="mask" v-show="contactCasterMaks" @touchmove.prevent @mousewheel.prevent>
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
        <img class="mask_close" src="../../../assets/universal/icon_qb_close.svg" alt="logo" @click="hanleClickCloseHoldMaks()">
      </div>
    </div>
    <!-- 查看物流信息 -->
    <div class="mask" v-show="shippedMaks" @touchmove.prevent @mousewheel.prevent>
      <div class="m_contianer">
        <div class="m_t_title">{{ $t("message.holding.Shipped") }}</div>
        <div class="m_t_divLine"></div>
        <div class="m_t_icon"><img :src="hotCheckItem.picurl" alt="logo"></div>
        <div class="m_t_title m_t_name">{{ hotCheckItem.nftName }}</div>
        <div class="m_t_company">{{ $t("message.holding.Couriercompany") }}</div>
        <div class="m_t_wrapper">
          <span>{{ hotCheckItem.expressComp  }}</span>
        </div>
        <div class="m_t_company">{{ $t("message.holding.Logisticsordernumber") }}</div>
        <div class="m_t_wrapper m_t_kdWrapper">
          <span>{{ hotCheckItem.expressNumber  }}</span>
          <img src="../../../assets/laboras/icon_h_copy.svg" alt="" @click="handleClickCopyExpressDeliveryNum">
        </div>
        <img class="mask_close" src="../../../assets/universal/icon_qb_close.svg" alt="logo" @click="handleClickCloseShipped">
      </div>
    </div>
  </div>
</template>

<script>

const settingConfig = require('../../../settings.js');
import { mapGetters } from 'vuex';
import { isStringEmpty } from '@/utils/validate';
import {getCasterInfo, getHotOrderList, getHotOrderLogisticsInfoData, updateExpressLogisticsInfoData} from '@/api/mark'
import constParam from '../../../decentralizedApi/const.js'
import hotCard from '../../../components/hotCard/hotCard';
import { parseNumber } from '@/decentralizedApi/param';
import { chuDivision } from '@/utils/computing';

export default {
  name: "hotOrder",
  components: {'hot-card':hotCard},
  data() {
    return {
      isEnglish:false, // 中英文
      showPapination:false, // 分页
      shippedMaks:false,
      // 联系铸造者
      contactCasterMaks:false,
      casterInfoData:{
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
      hotCheckItem:{},
      hotDataList:[],
      paginatioParams:{currentPage:1,perSize:8,totalSize:1,defaultTotalPage:5},
    };
  },
  created() {
    this.isEnglish = window.localStorage.getItem("lang") !== "zh";
    this.getCustomerHotList();
    console.log('hot page create');
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
        this.getCustomerHotList();
      }else {
        this.hotDataList = [];
        this.showPapination = false;
        this.paginatioParams = {currentPage:1,perSize:8,totalSize:1,defaultTotalPage:5};
      }
    },
    // 监听语言的切换
    '$i18n.locale'(nval,oval) {
      this.isEnglish = nval !== 'zh';
      console.log('监听到语言的切换');
    },
  },
  // 方法
  methods: {
    // 判断头像是否是空的
    isAvatarStringEmpty(avatar) {
      return isStringEmpty(avatar);
    },
    // 获取用户在持NFT数据
    async getCustomerHotList() {
      if(!this.isConnectWallet) {
        return;
      }
      const dict = {};
      dict['address'] = this.walletAddress; // 用户地址
      dict['page'] = this.paginatioParams.currentPage; // 当前第几页
      const that = this;
      const result = await getHotOrderList(dict);
      if (result.status === 200) {
        // 请求成功后先清空数据
        that.hotDataList = [];
        // 然后开始处理数据
        that.showPapination = result.data.count > 0;
        that.paginatioParams.totalSize = result.data.count;
        result.data.result.forEach((item) => {
          const newStr = item.picurl.indexOf("https");
          if (newStr === -1) {
            item.picurl = `${settingConfig.ipfsNFTUrl + item.picurl}`
          }
        });
        that.hotDataList = result.data.result;
      }else {
        that.$notify({message: result.data,duration: 2500,showClose:false,customClass:'notifyClass'});
      }
      console.log('爆款NFT列表',result);
    },
    async handleClickItem(item) {
      // type  0 表示这个NFT是我购买的 1 表示这个NFT是我铸造的
      // status 0 待审核 1 待收获(爆款)  5 待发货(爆款)   6 待收货  8 待上架
      if (item.status == 5) {
        // 联系铸造者
        const dict = {};
        dict['address'] = this.walletAddress;
        dict['tokenid'] = item.tokenid;
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
          that.contactCasterMaks = true;
        }else {
          that.$notify({message: result.data,duration: 2500,showClose:false,customClass:'notifyClass'});
        }
      } else if (item.status == 1) {
        const dict = {};
        dict['orderid'] = item.orderid; // 用户地址
        const that = this;
        const result = await getHotOrderLogisticsInfoData(dict);
        console.log('result',result)
        if (result.status === 200) {
          that.hotCheckItem = item;
          that.hotCheckItem['expressComp'] = result.data.expressComp;
          that.hotCheckItem['expressNumber'] = result.data.expressNumber;
          that.shippedMaks = true;
          console.log('b爆款商品已发货物流信息数据 =',that.hotCheckItem);
        }else {
          that.$notify({message: result.data,duration: 2500,showClose:false,customClass:'notifyClass'});
        }
        this.hotCheckItem = item;
        this.shippedMaks = true;
      }
      console.log('item = ',item);
    },
    handleClickCloseShipped() {
      this.hotCheckItem = {};
      this.shippedMaks = false;
    },
    // 关闭查看NFT
    hanleClickCloseHoldMaks() {
      this.casterInfoData = {level:0, picurl:'', number:0, phone:'--', qnumber:'--', wechat:'--', tg:'--', skype:'--', bbm:'--'};
      this.contactCasterMaks = false;
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
    // 复制快递单号
    handleClickCopyExpressDeliveryNum() {
      let copyText = this.hotCheckItem.expressNumber;
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
    // 修改页数
    changePage(params) {
      if (params.currentPage === 0) {
        return;
      }
      this.getCustomerHotList();
      console.log('修改页数params',params);
    },
  },
}
</script>

<style lang="scss" scoped>

.hot {
  max-width: 1200px;
  height: 960px;
  padding-top: 0.1px;
  margin: 0 auto;
  .h_empty {
    margin: 150px auto 0;
    padding-top: 144px;
    width: 534px;
    height: 248px;
    line-height: 32px;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-family: Poppins,sans-serif;
    color: #666;
    box-sizing: border-box;
    background-size: contain;
    background-repeat: no-repeat;
    background-image: url('../../../assets/universal/icon_empty.svg');
  }
  .h_contian {
    width: 1076px;
    height: 800px;
    margin: 50px auto 0;
  }
  .h_pagination {
    height: 40px;
    margin: 60px auto 0;
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
    .m_contianer{
      position: relative;
      width: 450px;
      margin: 0 auto;
      padding: 30px 0 42px;
      border-radius: 20px;
      background-color: #24252d;
      .m_t_title {
        line-height: 40px;
        font-size: 24px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        text-align: center;
        font-family: Poppins,sans-serif;
        color: #fff;
      }
      .m_t_divLine {
        margin-top: 30px;
        width: 100%;
        height: 1px;
        background-color: #707070;
      }
      .m_t_icon {
        margin: 20px auto 0;
        width: 120px;
        height: 120px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .m_t_name {
        margin: 10px auto 0;
        line-height: 37px;
        font-size: 22px;
        font-weight: 500;
      }
      .m_t_company {
        padding: 0 40px;
        margin-top: 20px;
        line-height: 26px;
        font-size: 16px;
        font-weight: 500;
        text-align: left;
        font-stretch: normal;
        font-style: normal;
        font-family: Poppins,sans-serif;
        color: #fff;
      }
      .m_t_wrapper {
        margin: 11px auto 0;
        padding: 0 30px;
        width: 370px;
        height: 50px;
        border-radius: 4px;
        text-align: left;
        background-color: #363843;
        span {
          line-height: 50px;
          font-size: 14px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          font-family: Poppins,sans-serif;
          color: #fff;
        }
        img {
          width: 16px;
          height: 16px;
        }
      }
      .m_t_kdWrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
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
    .m_contact {
      position:relative;
      width: 586px;
      height: 598px;
      border-radius: 20px;
      background-color: var(--bgc03);
      .m_c_title {
        margin: 30px auto 0;
        line-height: 40px;
        font-size: 24px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        color: #fff;
        font-family: Poppins,sans-serif;
      }
      .m_c_line {
        height: 1px;
        margin-top: 30px;
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
          border: solid 2px var(--bgc14);
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
        margin-top: 5px;
        line-height: 26px;
        font-size: 16px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        font-family: Poppins,sans-serif;
        color: #fff;
      }
      .m_c_item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 43px;
        padding: 0 33px;
        .m_c_i_left {
          display: flex;
          align-items: center;
          width: 234px;
          img {
            width: 18px;
            height: 18px;
          }
          span {
            margin-left: 10px;
            line-height: 23px;
            font-size: 14px;
            font-weight: 600;
            font-stretch: normal;
            font-style: normal;
            font-family: Poppins,sans-serif;
            color: #fff;
          }
        }
      }
      .m_c_item1 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 10px;
        padding: 0 33px;
        .m_c_i1_left {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 234px;
          height: 40px;
          border-radius: 4px;
          background-color: #363843;
          span {
            margin-left: 10px;
            line-height: 20px;
            font-size: 14px;
            font-weight: 600;
            font-stretch: normal;
            font-style: normal;
            font-family: Poppins,sans-serif;
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
}

</style>
