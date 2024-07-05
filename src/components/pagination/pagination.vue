<template>
  <div class="pagination">
    <!--<span>共{{params.totalSize}}条</span>-->
    <!-- <select name="pagesize" v-if="params.pageSizes" class="changeSize" id="" v-model="params.perSize" @change="changePerSize()">
      <option v-for="item in params.pageSizes" :value="item">{{item}}条/每页</option>
    </select> -->
    <button class="preButton" @click="prePage" :disabled="params.currentPage===1" :class="params.currentPage===1?'notAllowed':''">
      <img :src="require(`../../assets/marks/icon_m_previous_${ params.currentPage === 1 ? 'h' : 'w'}.svg`)" alt="logo">
    </button>
    <ul class="pageWrap">
      <li @click="curPage(item)" class="perPage" :class="{activePage:item===params.currentPage}" v-for="item in pageList" track-by="$index">{{item}}</li>
    </ul>
    <button class="nextButton" @click="nextPage" :disabled="params.currentPage===Math.ceil(params.totalSize/params.perSize)" :class="params.currentPage===Math.ceil(params.totalSize/params.perSize)?'notAllowed':''">
      <img :src="require(`../../assets/marks/icon_m_next_${ params.currentPage === Math.ceil(params.totalSize/params.perSize) ? 'h' : 'w'}.svg`)" alt="logo">
    </button>
    <!-- <span class="jumpTip">跳至</span><input id='input1' class="jumpInput" type="text" v-model="jumpPage" @input="inputCur()"><span class="jumpTip">页</span> -->
  </div>
</template>
<script>
  export default {
    name:'pagination',
    props:['params'],
    data(){
      return {
        isParamas:false,
        pageList:[],
        jumpPage:this.params.currentPage
      }
    },
    beforeMount(){

    },
    beforeDestroy(){
      //document.getElementById('input1').removeEventListener('keypress', this.changeCur);
    },
    mounted(){
      this.updatePage();
      //document.getElementById('input1').addEventListener('keypress', this.changeCur);
    },
    methods:{
      updatePage(){
        this.params.totalPage = Math.ceil(this.params.totalSize/this.params.perSize);
        this.params.defaultTotalPage = this.params.defaultTotalPage ? this.params.defaultTotalPage : 9;
        this.jumpPage = this.params.currentPage;
        if(this.jumpPage > this.params.totalPage){
          this.jumpPage = this.params.totalPage;
          this.curPage(this.params.totalPage);
        }
        this.pageList = [];
        if(this.params.totalPage<=this.params.defaultTotalPage){
          for(var i = 1; i <= this.params.totalPage; i++){
            this.pageList.push(i);
          }
        }else{
          let offset = (this.params.defaultTotalPage - 1)/2;
          if(this.params.currentPage <= offset){
            for(var i = 1; i <= offset; i++){ //offset + 1
              this.pageList.push(i);
            }
            if (this.params.currentPage == 2) {
               this.pageList.push(3);
            }
            this.pageList.push('...');
            this.pageList.push(this.params.totalPage - 1);
            this.pageList.push(this.params.totalPage);
          }else if(this.params.currentPage > this.params.totalPage - offset){
            this.pageList.push(1);
            this.pageList.push(2); //
            this.pageList.push('...');
            for(var i = offset; i >= 0; i--){ //offset + 1
              this.pageList.push(this.params.totalPage - i);
            }
          }else {
            this.pageList.push(1);
            if (this.params.currentPage >= 4) {
               this.pageList.push('...');
            }
            for (var i = Math.ceil(offset / 2); i >= 1; i--) { // Math.ceil(offset / 2)
              this.pageList.push(this.params.currentPage - i);
            }
            this.pageList.push(this.params.currentPage);
            for (var i = 1; i <= offset / 2; i++) {
              this.pageList.push(parseInt(this.params.currentPage) + i);
            }
            this.pageList.push('...');
            this.pageList.push(this.params.totalPage);
          }
        }
      },
      prePage(){
        if(this.params.currentPage>1){
          this.params.currentPage = this.params.currentPage - 1;
          this.$emit('changePage', this.params);
        }
      },
      nextPage(){
        this.params.totalPage = Math.ceil(this.params.totalSize/this.params.perSize);
        if(this.params.currentPage<this.params.totalPage){
          this.params.currentPage = parseInt(this.params.currentPage) + 1;
          this.$emit('changePage', this.params);
        }
      },
      curPage(item){
        if(item!='...'){
          this.params.currentPage = item;
          this.$emit('changePage', this.params);
        }
      },
      changePerSize(){
        if(this.params.currentPage>=this.params.totalPage){
          this.params.currentPage = this.params.totalPage;
        }
      },
      changeCur(event){
        if (event.keyCode == "13") {
          event.preventDefault();
          if(this.jumpPage==''){
            this.jumpPage = this.params.currentPage;
          }
          this.params.currentPage = this.jumpPage;
        }
//        var tempPage = this.jumpPage.replace(/[^0-9]/g,'');
//        if(tempPage && tempPage>0){
//            this.params.currentPage = this.jumpPage;
//        }else{
//          this.jumpPage = this.params.currentPage;
//          return false;
//        }
      },
      inputCur(){
        const tempPage = Number(this.jumpPage);
        const totalPage = Math.ceil(this.params.totalSize/this.params.perSize);
        if(tempPage>0 && tempPage <= totalPage){
            this.jumpPage = tempPage;
        }else if(tempPage <= 0){
            this.jumpPage = '';
        }else{
            this.jumpPage = totalPage;
        }
      }
    },
    watch:{
      'params.currentPage':function (newV, oldV) {
        // this.$emit('changePage', this.params);
        this.updatePage();
      },
      'params.perSize':function (newV, oldV) {
        //this.$emit('changePage', this.params);
        this.updatePage();
      },
      'params.totalSize':function (newV, oldV) {
        //this.$emit('changePage', this.params);
        this.updatePage();
      }
    }
  }
</script>
<style lang="scss" scoped>
  .pagination {
    color: #4A4A4A;
    font-size: 0;
  }
  .jumpTip {
    font-size: 12px;
    vertical-align: middle;
  }
  .pageWrap {
    display: inline-block;
    vertical-align: bottom;
    list-style-type: none;
    padding: 0;
    margin:0;
  }
  .perPage, .changeSize, .jumpInput, .preButton, .nextButton {
    height: 40px;
    margin-right: 12px;
    line-height:40px;
    border-radius: 8px;
    border: solid 2.3px var(--white);
    vertical-align: middle;
    background-color: transparent;
    outline: none;
    user-select: none;
  }
  .preButton, .nextButton {
    width: 40px;
    height: 40px;
    line-height: 40px;
    outline: none;
    cursor: pointer;
  }
  .preButton img, .nextButton img {
    margin-top: 8px;
    width: 10px;
    height:17px;
  }
  .perPage{
    width: 40px;
    line-height: 40px;
    font-size: 18px;
    font-weight: 500;
    font-family: Montserrat;
    font-stretch: normal;
    font-style: normal;
    float: left;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    color: var(--white);
    list-style: none;
    user-select: none;
  }
  .nextButton{
    margin-right: 0px;
  }
  .jumpInput{
    width: 31px;
    color: #606266;
    outline: none;
    margin:0 14px;
    padding: 0 10px;
  }
  .perPage:hover {
    border:solid 2.3px;
    border-image: linear-gradient(to bottom, var(--bgc12) 3%, var(--bgc13));
    border-image-slice: 1;
    clip-path: inset(0 round 4px);
  }
  .activePage {
    border:solid 2.3px;
    border-image: linear-gradient(to bottom, var(--bgc12) 3%, var(--bgc13));
    border-image-slice: 1;
    clip-path: inset(0 round 4px);
  }
  button.notAllowed{
    background-color: var(--bgc11);
    border:solid 2px var(--bgc11);
    cursor: not-allowed;
  }

  @media screen and (max-width: 768px) {
    .perPage, .changeSize, .jumpInput, .preButton, .nextButton {
      height: vw(44);
      margin-right: vw(10);
      line-height:vw(44);
      border-radius: vw(10);
      border: solid vw(3) var(--white);
    }
    .preButton, .nextButton {
      width: vw(44);
      height: vw(44);
      line-height: vw(44);
    }
    .preButton img, .nextButton img {
      margin-top: vw(10);
      width: vw(10);
      height:vw(17);
    }
    .perPage{
      width:  vw(44);
      line-height: vw(44);
      font-size: vw(26);
    }
    .perPage:hover {
      border:solid vw(3);
      border-image: linear-gradient(to bottom, var(--bgc12) 3%, var(--bgc13));
      border-image-slice: 1;
      clip-path: inset(0 round vw(4));
    }
    .activePage {
      border:solid vw(3);
      border-image: linear-gradient(to bottom, var(--bgc12) 3%, var(--bgc13));
      border-image-slice: 1;
      clip-path: inset(0 round vw(4));
    }
    button.notAllowed{
      background-color: var(--bgc11);
      border:solid vw(3) var(--bgc11);
      cursor: not-allowed;
    }
  }

</style>
