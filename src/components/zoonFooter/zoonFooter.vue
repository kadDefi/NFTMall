<template>
  <div class="footer">
    <div class="f_contain">
      <div class="f_c_item1">
        <img src="../../assets/universal/icon_sd.svg" alt="logo">
        <span>{{ $t("message.mallFooter.desc") }}</span>
        <span> © 2022 aladdinmarket. All rights reserved. </span>
      </div>
      <div class="f_c_item2">
        <span>{{ $t("message.mallFooter.company") }}</span>
        <span @click="handleCompay(1)">ALAD</span>
        <span @click="handleCompay(2)">Rainbow Nasie</span>
        <span @click="handleCompay(3)">Guard the Planet</span>
        <span @click="handleCompay(4)">ORA</span>
      </div>
      <div class="f_c_item2">
        <span>{{ $t("message.mallFooter.help") }}</span>
        <!-- <span @click="handleHelp(1)">FAQs</span> -->
        <span @click="handleHelp(1)">{{ $t("message.mallFooter.emailUs") }}</span>
        <span @click="handleHelp(2)">{{ $t("message.mallFooter.fileDownload") }}</span>
        <span @click="handleHelp(3)">{{ $t("message.mallFooter.guide") }}</span>
      </div>
      <div class="f_c_item3">
        <span class="f_c_i_title">{{ $t("message.mallFooter.connect") }}</span>
        <div class="f_c_i_item1" @click="handleConnect(1)">
          <img src="../../assets/universal/icon_contact_1.svg" alt="logo">
          <span>Telegram</span>
        </div>
        <div class="f_c_i_item1" @click="handleConnect(2)">
          <img src="../../assets/universal/icon_contact_2.svg" alt="logo">
          <span>Medium</span>
        </div>
        <div class="f_c_i_item1" @click="handleConnect(3)">
          <img src="../../assets/universal/icon_contact_3.svg" alt="logo">
          <span>Twitter</span>
        </div>
        <!-- <div class="f_c_i_item1" @click="handleConnect(4)">
          <img src="../../assets/universal/icon_contact_4.svg" alt="logo">
          <span>Talegram</span>
        </div> -->
        <!-- <span class="f_c_item4" @click="handleConnect(4)">Terms & Conditions</span> -->
      </div>
    </div>
  </div>
</template>

<script>
const settingConfig = require('../../settings.js');
export default {
  data() {
    return {
      isEnglish:false,
    }
  },
  // 初始创建 数据观测（data observer），属性和方法的运算，watch/event事件回调
  created(){
    this.isEnglish = window.localStorage.getItem("lang") !== "zh";
  },
  // 监听方法
  watch: {
    // 监听语言的切换
    '$i18n.locale'(val,oval) {
      if(val === 'zh') {
        this.isEnglish = false;
      } else {
        this.isEnglish = true;
      }
      console.log('监听语言发生变化');
    },
  },
  // 方法集合
  methods:{
    handleCompay(index) {
      let openUrl = settingConfig.aladUrl;
      if (index === 2) {
        openUrl = settingConfig.rainbowNasieUrl;
      } else if (index === 3) {
        this.$notify({ message: this.$t("message.alertMsg.stayTuned"), duration: 2500, showClose: false, customClass: 'notifyClass' });
        return;
      } else if (index === 4) {
        openUrl = settingConfig.oraUrl;
      }
      window.open(openUrl);
      console.log('company index =', index);
    },
    handleHelp(index) {
      if (index === 1) {
        let copyText = 'aladdinmeta@gmail.com';
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
          textArea.style.opacity = 0;
          textArea.style.left = "-999999px";
          textArea.style.top = "-999999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
           this.$notify({message: this.$t("message.alertMsg.copySuccess"),duration: 3000,showClose:false,customClass:'notifyClass'});
          document.body.removeChild(textArea);
        }
      } else if (index === 2) {
        let list = ['Aladdin_Global_CN.pdf', 'Aladdin_Magic_CN.pdf'];
        let listName = ["Aladdin Marketing Version_CN.pdf", "Global Supply and Demand Circular Economy Agreement_CN.pdf"];
        if (this.isEnglish) {
          list = ['Aladdin_Global_EN.pdf', 'Aladdin_Magic_EN.pdf'];
          listName = ["Aladdin Marketing Version_EN.pdf", "Global Supply and Demand Circular Economy Agreement_EN.pdf"];
        }
        list.forEach((item,index) => {
          if (index === 0) {
            let a = document.createElement('a');
            a.href = './static/'+ item;
            a.download = listName[index];
            a.click();
          }else if(index === 1) {
            let a = document.createElement('a');
            a.href = './static/'+ item;
            a.download = listName[index];
            a.click();
          }
        });
      } else if (index === 3) {
        const openUrl = this.isEnglish ? settingConfig.guideUrlEN : settingConfig.guideUrlCN;
        window.open(openUrl);
      }
      console.log('help index =',index);
    },
    handleConnect(index) {
     let openUrl = settingConfig.telegramUrl;
     if(index === 2) {
       openUrl = settingConfig.mediumUrl;
     }else if(index === 3) {
       openUrl = settingConfig.twitterUrl;
     }
      window.open(openUrl);
      console.log('conenct index =',index);
    },
  },
}
</script>

<style lang="scss" scoped>

.footer{
  margin-top: 115px;
  height: 603px;
  padding-top: 0.1px;
  box-sizing: border-box;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-image: url('../../assets/universal/icon_footer_bg.svg');
  .f_contain {
    max-width: 1200px;
    margin: 32px auto 0px;
    display: flex;
    justify-content: space-between;
    .f_c_item1 {
      width: 443px;
      margin-top: 100px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      img {
        width: 190px;
        height: 133px;
      }
      span {
        flex: 1;
        margin-top: 40px;
        font-size: 16px;
        line-height: 26px;
        text-align: left;
        word-break: break-all;
        font-family: Montserrat;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        user-select: none;
        color: var(--white);
        &:last-child {
          flex: 0;
          font-weight: bold;
        }
      }
    }
    .f_c_item2 {
      margin-top: 100px;
      display: flex;
      flex-direction: column;
      span {
        margin-top: 30px;
        font-size: 16px;
        line-height: 20px;
        text-align: left;
        font-family: Montserrat;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        user-select: none;
        cursor: pointer;
        user-select: none;
        color: var(--white);
        &:first-child {
          margin-top: 0px;
          font-size: 20px;
          line-height: 24px;
          font-weight: bold;
          cursor: default;
        }
        &:first-child:hover {
          color: var(--white);
        }
      }
      span:hover {
        color: var(--primary);
      }

    }
    .f_c_item3 {
      margin-top: 100px;
      display: flex;
      flex-direction: column;
      .f_c_i_title {
        font-size: 20px;
        line-height: 24px;
        text-align: left;
        font-family: Montserrat;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        user-select: none;
        cursor: pointer;
        color: var(--white);
      }
      .f_c_i_item1 {
        margin-top: 30px;
        display: flex;
        align-items: center;
        img {
          width: 40px;
          height: 40px;
        }
        span {
          margin-left: 20px;
          font-size: 16px;
          line-height: 20px;
          text-align: left;
          font-family: Montserrat;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          user-select: none;
          cursor: pointer;
          color: var(--white);
        }
        span:hover {
          color: var(--primary);
        }
      }
    }
    .f_c_item4 {
      margin-top: 110px;
      font-size: 16px;
      line-height: 20px;
      text-align: center;
      font-family: Montserrat;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      user-select: none;
      cursor: pointer;
      color: var(--white);
    }
    .f_c_item4:hover {
      color: var(--primary);
    }
  }
}

</style>
