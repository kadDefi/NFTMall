<template>
  <div class="bottombar">
    <van-tabbar v-model="active" :inactive-color="color" :active-color="selectedColor" @change="onChange" :before-change="beforeChange">
      <template v-for="(item,index) in tabBars">
        <van-tabbar-item class="van_tabbar" v-if="index === 1"  :key="item.name" :badge="item.badge" :dot="item.isShowRedDot">
          <el-dropdown class="v_t_d_market" trigger="click" @command="handleDropdownMarketCommand">
            <div class="v_t_item"></div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command='conventional'><span>{{ $t("message.mallHeader.conventionalNFT") }}</span></el-dropdown-item>
              <el-dropdown-item command='artwork'><span>{{ $t("message.mallHeader.artworkNFT") }}</span></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span>{{ item.text }}</span>
          <template #icon="props">
            <img class="img_icon" :src="active === 1 ? item.selectedIconPath : item.iconPath" alt="icon"/>
          </template>
        </van-tabbar-item>
        <van-tabbar-item class="van_tabbar" v-else-if="index === 2" :key="item.name" :badge="item.badge" :dot="item.isShowRedDot">
          <el-dropdown v-if="!isSpecialAddress" class="v_t_d_casting"  trigger="click" @command="handleDropdownCastCommand">
            <div class="v_t_item"></div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command='conventional'><span>{{ $t("message.mallHeader.conventionalNFT") }}</span></el-dropdown-item>
              <el-dropdown-item command='artwork'><span>{{ $t("message.mallHeader.artworkNFT") }}</span></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span>{{ item.text }}</span>
          <template #icon="props">
            <img class="img_icon" :src="active === 2 ? item.selectedIconPath : item.iconPath" alt="icon"/>
          </template>
        </van-tabbar-item>
        <van-tabbar-item v-else :key="item.name" :badge="item.badge" :dot="item.isShowRedDot">
          <span>{{ item.text }}</span>
          <template #icon="props">
            <img class="img_icon" :src="active === index ? item.selectedIconPath : item.iconPath" alt="icon"/>
          </template>
        </van-tabbar-item>
      </template>
    </van-tabbar>
  </div>
</template>

<script>
import {getSpecialAddr} from "@/api/mark";
import {mapGetters} from "vuex";

export default {
  name: 'bottombar',
  props: {
    // 选中tabbar
    selected: {
      type: Number,
      default: 0
    },
    // 默认颜色
    color: {
      type: String,
      default: "#ffffff"
    },
    // 选中颜色
    selectedColor: {
      type: String,
      default: "#bc84ff"
    },
    //item数组
    tabBars: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      active: 0,
      isSpecialAddress:true, // 特殊地址
    };
  },
  created() {
    this.getSpecialAddress();
  },
  mounted(){
    // const active = sessionStorage.getItem('mbTabBarNavKey');
    // if (active !== null) {
    //   this.active = parseInt(active);
    // }
  },
  // 计算属性
  computed: {
    ...mapGetters(['isConnectWallet','walletAddress']),
  },
  // 监听属性改变
  watch:{
    isConnectWallet(val,oval) {
      if (val) {
        this.getSpecialAddress();
      }
    },
  },
  methods: {
    beforeChange(index) {
      let isCanModify = true;
      if (index === 1) {
        isCanModify = false;
      }else if (index === 2 && !this.isSpecialAddress) {
        isCanModify = false;
      }
      return isCanModify;
    },
    onChange(index) {
      if (!this.isConnectWallet && index === 2) {
        this.$notify({message: this.$t("message.casting.connectWallet"),duration: 2500,showClose:false,customClass:'notifyClass'});
        return;
      }
      this.active = index
      const routeName = this.tabBars[index].name;
      this.$router.push({ name: routeName});
      sessionStorage.setItem("meFeaturesNavKey", 0);
      sessionStorage.setItem("mbFeaturesNavKey", 0);
      //sessionStorage.setItem("mbTabBarNavKey", index);
    },
    handleDropdownMarketCommand(command) {
      const paramsType = command === 'conventional' ? 1 : 2;
      if (this.active !== 1) {
        this.active = 1;
        //sessionStorage.setItem("mbTabBarNavKey", 1);
        const routeName = this.tabBars[1].name;
        this.$router.push({ name: routeName,params:{item:paramsType}});
      }else  {
        this.$eventBus.$emit('switchMarketMBNFTType',paramsType);
      }
    },
    handleDropdownCastCommand(command) {
      const paramsType = command === 'conventional' ? 1 : 2;
      if (this.active !== 2) {
        this.active = 2;
        //sessionStorage.setItem("mbTabBarNavKey", 2);
        const routeName = this.tabBars[2].name;
        this.$router.push({ name: routeName,params:{item:paramsType}});
      }else  {
        this.$eventBus.$emit('switchCastingMBNFTType',paramsType);
      }
    },
    // 获取是否是特殊地址
    async getSpecialAddress() {
      if(!this.isConnectWallet){
        return;
      }
      const dict = {};
      dict['address'] = this.walletAddress;
      const result = await getSpecialAddr(dict);
      if (result.status === 200) { // 1 特殊地址  0 非特殊地址
        this.isSpecialAddress = result.data === 1;
        console.log(`当前地址${ result.data === 1 ? '是' : '不是'}特殊地址`)
      }else {
        this.$notify({message: result.data,duration: 2500,showClose:false,customClass:'notifyClass'});
      }
    },
  },
};
</script>


<style lang="scss" scoped>

.van-tabbar {
  position: relative;
  height: 100px !important;
  .v_t_d_market {
    position: absolute;
    left: calc(100% / 5);
    top: 0;
    width: calc(100% / 5);
    height: 100%;
    .v_t_item {
      width: 100%;
      height: 100%;
    }
  }
  .v_t_d_casting {
    position: absolute;
    left: calc(100% / 5 * 2);
    top: 0;
    width: calc(100% / 5);
    height: 100%;
    .v_t_item {
      width: 100%;
      height: 100%;
    }
  }
  //background-color: black;
}

.van-tabbar-item {
  font-size: 20px !important;
  background-color: black;
}

.img_icon {
  margin-bottom: 4px;
  width: 48px;
  height: 48px;
}

.el-dropdown-menu__item span {
  height: 52px;
  font-size: 28px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  font-family: Ubuntu,sans-serif;
  user-select: none;
  cursor: pointer;
  color: #000;
}

.el-dropdown-menu__item span:hover {
  color: var(--primary);
}

</style>
