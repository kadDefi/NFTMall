<template>
  <div class="maks" v-show="showMask" @touchmove.prevent @mousewheel.prevent>
   <div class="mk_loding">
     <img src="../../assets/universal/loading.gif" alt="logo">
   </div>
  </div>
</template>

<script>
export default {
  name: "loading",
  data() {
    return {
       showMask:false,
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
    z-index: 9999;
    transition: all 0.3s;
    background-color: var(--bgc02);
    .mk_loding {
      height: 100px;
      width: 100px;
      margin: 0 auto;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  @media screen and (max-width: 768px){
    .maks {
      .mk_loding {
        width: vw(100);
        height: vw(100);
        img {
           width: 100%;
           height: 100%;
        }
      }
    }
  }

</style>
