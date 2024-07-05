<template>
  <div class="promote">
    <div class="p_contian">
      <div :class="nftRecord.showRecord ? 'n_info_wrapper' : ''" class="n_info" >
        <div class="n_info_top" @click="handlOpenClick(1)">
          <div class="n_i_left">
            <img src="../../../assets/center/icon_c_nft.svg" alt="">
            <span>{{ $t("message.center.nftRecord") }}</span>
          </div>
          <div class="n_i_right"><img :src="require(`../../../assets/marks/icon_m_${!nftRecord.showRecord ? 'x' : 's'}.svg`)" alt=""></div>
        </div>
        <div v-if="nftRecord.showRecord" >
          <div class="n_w_line"></div>
           <div class="p_title">
             <div :class="recordType === 0 ? 'p_title_select' :''" @click="handleClickRecord(0)">{{ $t("message.smFreed.all") }}</div>
             <div :class="recordType === 1 ? 'p_title_select' :''" @click="handleClickRecord(1)">{{ $t("message.smFreed.casting") }}</div>
             <div :class="recordType === 2 ? 'p_title_select' :''" @click="handleClickRecord(2)">{{ $t("message.smFreed.sell") }}</div>
             <div :class="recordType === 3 ? 'p_title_select' :''" @click="handleClickRecord(3)">{{ $t("message.smFreed.buy") }}</div>
             <div :class="recordType === 4 ? 'p_title_select' :''" @click="handleClickRecord(4)">{{ $t("message.smFreed.delivery") }}</div>
             <div :class="recordType === 5 ? 'p_title_select' :''" @click="handleClickRecord(5)">{{ $t("message.smFreed.isTheDelivery") }}</div>
             <div :class="recordType === 6 ? 'p_title_select' :''" @click="handleClickRecord(6)">{{ $t("message.smFreed.destroy") }}</div>
           </div>
           <div class="p_c_title">
             <span>{{ $t("message.smFreed.NFTName") }}</span>
             <span>{{ $t("message.smFreed.picture") }}</span>
             <span>{{ $t("message.smFreed.fronzeAlAD") }}</span>
             <span>{{ $t("message.smFreed.type") }}</span>
             <span>{{ $t("message.smFreed.date") }}</span>
           </div>
           <div v-if="nftRecord.nftList.length <= 0" class="s_empty">{{ $t("message.holding.empty") }}</div>
           <div v-else class="p_c_wrapper" @scroll="scrollNFTReacorEvent">
             <div class="p_c_text" v-for="(item,index) in nftRecord.nftList" :key="index">
               <span>{{ item.name }}</span>
               <div><img :src="item.pic" alt="logo"></div>
               <span v-if="item.headType === 1 && (item.status === 4 || item.status === 5 )" class="item-amount">
                 <img class="coin_logo" :src="require(`../../../assets/newPhones/nCasting/icon_c_alad.svg`)" alt="">
                 {{ item.aladPrice | roundingDecimals(4) }}
               </span>
               <span v-else-if="item.headType === 2 && (item.status === 2 || item.status === 3 )" class="item-amount">
                 <img class="coin_logo" :src="require(`../../../assets/newPhones/nCasting/icon_c_alad.svg`)" alt="">
                 {{ item.aladPrice | roundingDecimals(4)  }}
               </span>
               <span v-else>--</span>
               <span>{{ recordTypeDesc(item) }}</span>
               <span>{{ item.time }}</span>
             </div>
           </div>
        </div>
      </div>
      <div :class="speedRecord.showSpeedRecord ? 'n_info_wrapper' : ''" class="n_info" >
        <div class="n_info_top" @click="handlOpenClick(2)">
          <div class="n_i_left">
            <img src="../../../assets/center/icon_c_speed.svg" alt="">
            <span>{{ $t("message.center.acceleratedRecord") }}</span>
          </div>
          <div class="n_i_right"><img :src="require(`../../../assets/marks/icon_m_${!speedRecord.showSpeedRecord ? 'x' : 's'}.svg`)" alt=""></div>
        </div>
        <div v-if="speedRecord.showSpeedRecord" >
          <div class="n_w_line"></div>
          <div class="p_c_title">
            <span>{{ $t("message.smFreed.typesOf") }}</span>
            <span>{{ $t("message.smFreed.quantity") }}</span>
            <span>{{ $t("message.smFreed.condition") }}</span>
            <span>{{ $t("message.smFreed.time") }}</span>
          </div>
          <div v-if="speedRecord.speedList.length <= 0" class="s_empty">{{ $t("message.holding.empty") }}</div>
          <div v-else class="p_c_wrapper" @scroll="scrollSpeedReacorEvent">
            <div class="p_c_text" v-for="(item,index) in speedRecord.speedList" :key="index">
              <span>{{ freedTypeDesc(1,item) }}</span>
              <span>{{ item.amount | tanferUnitData(18) | roundingDecimals(4) }}</span>
              <span>{{ freedTypeDesc(2,item) }}</span>
              <span>{{ item.days }}</span>
            </div>
          </div>
        </div>
      </div>
      <div :class="promoteRecord.showpromoteRecord ? 'n_info_wrapper' : ''" class="n_info" >
        <div class="n_info_top" @click="handlOpenClick(3)">
          <div class="n_i_left">
            <img src="../../../assets/center/icon_c_promote.svg" alt="">
            <span>{{ $t("message.center.promotionRecord") }}</span>
          </div>
          <div class="n_i_right"><img :src="require(`../../../assets/marks/icon_m_${!promoteRecord.showpromoteRecord ? 'x' : 's'}.svg`)" alt=""></div>
        </div>
        <div v-if="promoteRecord.showpromoteRecord">
          <div class="n_w_line"></div>
          <div v-if="promoteRecord.promoteList.length <= 0" class="s_empty">{{ $t("message.holding.empty") }}</div>
          <div v-else class="p_c_wrapper" @scroll="scrollPromoteReacorEvent">
            <div class="p_c_text1" v-for="(item,index) in promoteRecord.promoteList" :key="index">
              <img :src="require(`../../../assets/laboras/icon_l_level_${item.level}.svg`)" alt="logo">
              <span>{{ item.address }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

const settingConfig = require('../../../settings');
import { mapGetters } from 'vuex';
import {getCustomerPromoteList, getHistoryRecordListData, getUserReleaseListData} from '@/api/mark'
import {chuDivision} from "@/utils/computing";

export default {
  name: "record",
  data() {
    return {
      recordType:0,
      nftRecord:{
        showRecord:false,
        nftList:[],
        pageNum:1,
        moreLoading:false, // 是否是加载中
        noMore:false, // 是否没有数据了
      },
      speedRecord:{
        showSpeedRecord:false,
        speedList:[],
        pageNum:1,
        moreLoading:false, // 是否是加载中
        noMore:false, // 是否没有数据了
      },
      promoteRecord:{
        showpromoteRecord:false,
        promoteList:[],
        pageNum:1,
        moreLoading:false, // 是否是加载中
        noMore:false, // 是否没有数据了
      },
    };
  },
  created() {
    console.log('个人中心');
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
      if (!val) {
        this.nftRecord.nftList = [];
        this.speedRecord.speedList = [];
        this.promoteRecord.promoteList = [];
      }
    }
  },
  // 方法
  methods: {
    // 关闭或者展开
    handlOpenClick(index) {
      if (index === 1) {
        if (this.nftRecord.showRecord) {
          this.nftRecord.pageNum = 1;
          this.nftRecord.nftList = [];
          this.nftRecord.showRecord = false;
        }else  {
          this.nftRecord.showRecord = true;
          this.getCustomerNFTList(true);
        }
      }else  if (index === 2) {
        if (this.speedRecord.showSpeedRecord) {
          this.speedRecord.pageNum = 1;
          this.speedRecord.speedList = [];
          this.speedRecord.showSpeedRecord = false;
        }else  {
          this.speedRecord.showSpeedRecord = true;
          this.getCustomerSpeedList(true);
        }
      }else  if (index === 3) {
        if (this.promoteRecord.showpromoteRecord) {
          this.promoteRecord.pageNum = 1;
          this.promoteRecord.promoteList = [];
          this.promoteRecord.showpromoteRecord = false;
        }else  {
          this.promoteRecord.showpromoteRecord = true;
          this.getCustomerPromoteList(true);
        }
      }
    },
    // 操作筛选NFT类型列表
    recordTypeDesc(item) {
      // type： 0:全部数据，1: 铸造,2:出售,3:购买,4:交割,5:被交割,6:销毁,7:被销毁
      let freedDesc = this.$t("message.smFreed.all");
      if (item.status === 1) {
        freedDesc = this.$t("message.smFreed.casting");
      }else  if(item.status === 2) {
        freedDesc = this.$t("message.smFreed.sell");
      }else  if(item.status === 3) {
        freedDesc = this.$t("message.smFreed.buy");
      }else  if(item.status === 4) {
        freedDesc = this.$t("message.smFreed.delivery");
      }else  if(item.status === 5) {
        freedDesc = this.$t("message.smFreed.isTheDelivery");
      }else  if(item.status === 6) {
        freedDesc = this.$t("message.smFreed.destroy");
      }else  if(item.status === 7) {
        freedDesc = this.$t("message.smFreed.beDestroyed");
      }
      return freedDesc;
    },
    // 切换了NFT记录类型列表
    handleClickRecord(index) {
      this.recordType = index;
      this.nftRecord.pageNum = 1;
      this.getCustomerNFTList(true);
    },
    // 监听NFT列表滚动事件
    scrollNFTReacorEvent(e) {
      const ele = e.srcElement ? e.srcElement : e.target;
      if(ele.scrollTop + ele.offsetHeight > ele.scrollHeight - 10 && !this.moreLoading && !this.noMore) {
        this.getCustomerNFTList(false);
        console.log('调用NFT记录加载更多');
      }
    },
    // 获取用户NFT列表记录
    async getCustomerNFTList(isRefersh) {
      if(!this.isConnectWallet){
        return;
      }
      this.nftRecord.moreLoading = true;
      if (isRefersh) {
        this.nftRecord.pageNum = 1;
        this.nftRecord.noMore = false;
      }else {
        this.nftRecord.pageNum++;
      }
      const dict = {};
      // type: 0:全部数据，1: 铸造,2:出售,3:购买,4:交割,5:被交割,6:销毁,7:被销毁
      dict['type'] = this.recordType;
      dict['address'] = this.walletAddress;
      dict['page'] = this.nftRecord.pageNum;
      dict['count'] = 20;
      const that = this;
      const result = await getHistoryRecordListData(dict);
      if (result.status === 200) {
        result.data.outData.forEach((item) => {
          const newStr = item.pic.indexOf("https");
          if (newStr === -1) {
            item.pic = `${settingConfig.ipfsNFTUrl + item.pic}`
          }
        });
        if (isRefersh){
          this.nftRecord.nftList = result.data.outData;
        }else {
          this.nftRecord.nftList.push(...result.data.outData);
        }
        // 将状态机设置对应状态
        that.nftRecord.moreLoading = false;
        // 当我们取到的数据长度小于1页的数量时，就没有更多了数据了
        if (result.data.outData.length < 20) {
          that.nftRecord.noMore = true;
        }
      }else {
        that.nftRecord.moreLoading = false;
        that.$notify({message: result.data,duration: 2500,showClose:false,customClass:'notifyClass'});
      }
      console.log('NFT记录列表',result);
    },
    // 释放类型
    freedTypeDesc(index,item) {
      let freedDesc = this.$t("message.smFreed.dynamicSF");
      if (index === 1) {
        // type： 1: 动态加速    2:级别加速    3: 推广奖励
        if (item.type === 2) {
          freedDesc = this.$t("message.smFreed.levelSF");
        }else  if(item.type === 3) {
          freedDesc = this.$t("message.smFreed.promotionSF");
        }
      }else  if (index === 2) {
        // status： 0: 未释放   1:已经释放
        freedDesc = this.$t("message.smFreed.pendingRelease");
        if (item.status === 1) {
          freedDesc = this.$t("message.smFreed.released");
        }
      }
      return freedDesc;
    },
    // 监听释放列表滚动事件
    scrollSpeedReacorEvent(e) {
      const ele = e.srcElement ? e.srcElement : e.target;
      if(ele.scrollTop + ele.offsetHeight > ele.scrollHeight - 10 && !this.moreLoading && !this.noMore) {
        this.getCustomerSpeedList(false);
        console.log('调用释放记录加载更多');
      }
    },
    // 获取用户NFT列表记录
    async getCustomerSpeedList(isRefersh) {
      if(!this.isConnectWallet){
        return;
      }
      this.speedRecord.moreLoading = true;
      if (isRefersh) {
        this.speedRecord.pageNum = 1;
        this.speedRecord.noMore = false;
      }else {
        this.speedRecord.pageNum++;
      }
      const dict = {};
      dict['address'] = this.walletAddress;
      dict['page'] = this.speedRecord.pageNum;
      dict['count'] = 20;
      const that = this;
      const result = await getUserReleaseListData(dict);
      if (result.status === 200) {
        if (isRefersh){
          this.speedRecord.speedList = result.data.outData;
        }else {
          this.speedRecord.speedList.push(...result.data.outData);
        }
        // 将状态机设置对应状态
        that.speedRecord.moreLoading = false;
        // 当我们取到的数据长度小于1页的数量时，就没有更多了数据了
        if (result.data.outData.length < 20) {
          that.speedRecord.noMore = true;
        }
      }else {
        that.speedRecord.moreLoading = false;
        that.$notify({message: result.data,duration: 2500,showClose:false,customClass:'notifyClass'});
      }
      console.log('释放记录列表',result);
    },
    // 监听推广列表滚动事件
    scrollPromoteReacorEvent(e) {
      const ele = e.srcElement ? e.srcElement : e.target;
      if(ele.scrollTop + ele.offsetHeight > ele.scrollHeight - 10 && !this.moreLoading && !this.noMore) {
        this.getCustomerPromoteList(false);
        console.log('调用推广记录加载更多');
      }
    },
    // 获取用户NFT列表记录
    async getCustomerPromoteList(isRefersh) {
      if(!this.isConnectWallet){
        return;
      }
      this.promoteRecord.moreLoading = true;
      if (isRefersh) {
        this.promoteRecord.pageNum = 1;
        this.promoteRecord.noMore = false;
      }else {
        this.promoteRecord.pageNum++;
      }
      const dict = {};
      dict['address'] = this.walletAddress;
      dict['page'] = this.promoteRecord.pageNum;
      dict['count'] = 20;
      const that = this;
      const result = await getCustomerPromoteList(dict);
      if (result.status === 200) {
        result.data.result.forEach((item,index) => {
          item.address = item.address.toLowerCase();
        });
        if (isRefersh){
          this.promoteRecord.promoteList = result.data.result;
        }else {
          this.promoteRecord.promoteList.push(...result.data.result);
        }
        // 将状态机设置对应状态
        that.promoteRecord.moreLoading = false;
        // 当我们取到的数据长度小于1页的数量时，就没有更多了数据了
        if (result.data.result.length < 20) {
          that.promoteRecord.noMore = true;
        }
      }else {
        that.promoteRecord.moreLoading = false;
        that.$notify({message: result.data,duration: 2500,showClose:false,customClass:'notifyClass'});
      }
      console.log('推广记录列表',result);
    },
  },
};
</script>

<style lang="scss" scoped>

.promote {
  max-width: 1200px;
  min-height: 800px;
  padding-top: 0.1px;
  margin: 0 auto;
  .p_contian {
    margin: 30px auto 0;
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
      .p_title {
        margin: 20px auto 0;
        height: 40px;
        display: flex;
        div {
          margin-left: 20px;
          width: 100px;
          line-height: 40px;
          font-size: 14px;
          font-weight: normal;
          text-align: center;
          color: var(--white);
          cursor: pointer;
          user-select: none;
          font-family: "PingFang SC",sans-serif;
          box-sizing: border-box;
          border-radius: 10px;
          border: solid 1px #8080c4;
          &:first-child{
            margin-left: 0;
          }
        }
        .p_title_select {
          background-color: #8080c4;
        }
      }
      .p_c_title {
        display: flex;
        align-items: center;
        margin-top: 20px;
        box-sizing: border-box;
        border-bottom: solid 1px #202136;
        span {
          flex: 1;
          line-height: 50px;
          font-size: 14px;
          font-family: "PingFang SC",sans-serif;
          font-weight: 500;
          font-stretch: normal;
          font-style: normal;
          user-select: none;
          text-align: left;
          color: #ffff;
        }
      }
      .p_c_wrapper {
        height: 350px;
        overflow-y: auto;
        .p_c_text {
          height: 50px;
          display: flex;
          align-items: center;
          box-sizing: border-box;
          border-bottom: solid 1px #202136;
          span {
            flex: 1;
            overflow: hidden;
            line-height: 50px;
            font-size: 14px;
            font-weight: normal;
            color: #fff;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-family: "PingFang SC",sans-serif;
            background-color: transparent;
            text-align: left;
          }
          div {
            flex: 1;
            height: 50px;
            text-align: left;
            img {
              margin-top: 10px;
              width: 30px;
              height: 30px;
            }
          }
          .item-amount {
            flex: 1;
            display: flex;
            align-items: center;
            .coin_logo {
              margin-right: 10px;
              width: 18px;
              height: 18px;
            }
            font-family: PingFangSC, sans-serif;
            font-size:14px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: normal;
            letter-spacing: normal;
            text-align: center;
            color: #ff953f;
          }
        }
        .p_c_text1 {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 50px;
          box-sizing: border-box;
          border-bottom: solid 1px #202136;
          span {
            width: 350px;
            line-height: 50px;
            font-size: 14px;
            text-align: left;
            font-family: "PingFang SC",sans-serif;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            color: #fff;
          }
          img {
            margin-right: 30px;
            width: 30px;
            height: 30px;
          }
        }

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
        font-family: "PingFang SC",sans-serif;
        color: #c5c8d9;
        box-sizing: border-box;
        background-size: contain;
        background-repeat: no-repeat;
        background-image: url('../../../assets/universal/icon_empty.svg');
      }
    }
    .n_info_wrapper {
      height: 560px;
    }
  }
}

</style>


