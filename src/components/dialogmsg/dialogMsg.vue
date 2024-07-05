<template>
  <div class="maks" v-show="showMask" @touchmove.prevent @mousewheel.prevent>
    <div class="markGiftCenter">
      <div class="markGiftCard">
        <div class="markGiftCardBody">
          <span>{{ isEnglish ? 'BL$D Message' : '提示' }}</span>
          <span>{{textMsg}}</span>
          <!-- <div class="markGiftCardConfirm" @click="handleGiftConfirm">Confirm</div> -->
        </div>
      </div>
      <!-- <img class="markClose" src="../../assets/images/zoons/icon_mz_close.png" alt="" @click="handleCloseMask"> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "dialogMsg",
  data() {
    return {
      textMsg:'',
      showMask:false,
      isEnglish:true,
    };
  },
  created() {

  },
  mounted() {

  },
  watch:{

  },
  computed: {
  },
  methods: {
    handleGiftConfirm(){
      this.showMask = false;
    },
    handleCloseMask(){
      this.showMask = false;
    },
  },
};
</script>

<style lang="scss" scoped>

.maks {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1999;
    transition: all 0.3s;
    background-color: var(--bg);
    .markGiftCenter {
      position:relative;
      width: 690px;
      height: 464px;
      .markGiftCard {
        width: 690px;
        height: 464px;
        background-color: var(--white);
        //background-size: contain;
        //background-repeat: no-repeat;
        //background-image: url('../../assets/images/zoons/icon_mzCard.png');
        .markGiftCardBody {
          margin: 0px 80px 0px;
          display: flex;
          flex-direction: column;
          align-items: center;
          word-break:break-all;
          span {
            height: 29px;
            margin-top: 25px;
            line-height: 29px;
            font-size: 26px;
            user-select: none;
            font-family: Ubuntu;
            color: var(--white);
            &:nth-child(2){
              margin-top: 110px;
              font-size: 18px;
              font-weight: 500;
              text-align: left;
              font-family: Ubuntu;
            }
          }
        }
        .markGiftCardConfirm {
            width: 210px;
            height: 50px;
            margin-top: 32px;
            font-size: 20px;
            font-weight: 500;
            line-height: 50px;
            cursor: pointer;
            user-select: none;
            font-family: Ubuntu;
            color: var(--white);
            box-sizing: border-box;
            background-color: var(--white);
            //background-size: contain;
            //background-repeat: no-repeat;
            //background-image: url('../../assets/images/adventures/a_mk_appprove.png');
        }
      }
      .markClose {
        width: 60px;
        height: 60px;
        top: 11px;
        right: 89px;
        position: absolute;
        cursor: pointer;
      }
    }
}

@media screen and (max-width: 768px){
  .maks {
    .markGiftCenter {
      @include converWidth(640);
      @include converHeight(475);
      .markGiftCard {
        @include converWidth(640);
        @include converHeight(475);
        @include converMargin(0,0,0,0);
        background-size: 100% 100%;
        .markGiftCardBody {
          padding-top: 0px;
          margin: 0px vw(80) 0px;
          span {
            @include converHeight(29);
            @include converLineHeight(29);
            @include converFont(26);
            margin-top: vw(25);
            &:nth-child(2) {
              margin-top: vw(120);
              @include converFont(24);
            }
          }
        }
        .markGiftCardConfirm {
          @include converHeight(56);
          @include converLineHeight(56);
          @include converMargin(32,0,0,0);
          @include converFont(20);
          background-color: var(--white);
          //background-image: url('../../assets/images/zoons/icon_h5_mz_appprove.png');
        }
      }
      .markClose {
        top: vw(15);
        right: vw(80);
        @include converWidth(60);
        @include converHeight(60);
      }
    }
  }
}

</style>