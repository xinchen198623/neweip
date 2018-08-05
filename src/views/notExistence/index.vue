<template>
    <div class="content_box">
      <div class="pencil"><img src="../../assets/img/pencil.png"></div>
      <p  class="error">404</p>
      <p class="text">很抱歉, 您访问的页面不存在…</p>
      <p class="graytext">当前页面无法访问? 没关系您还可以访问以下页面</p>
      <span class="button" @click="backpre"><p class="backpre">返回上一页</P></span>
      <span class="button" @click="backindex"><p class="backindex">返回首页</p></span>
    </div>
</template>

<script>

export default {
  data() {
    return {
    };
  },
  computed: {
  },
  watch: {
  },
  components: {
   
  },
  mounted() {
 
  },
  methods: {
   backpre(){
     this.$router.go(-1)
   },
   backindex(){
      this.$router.push('/')
   }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/variables.scss";
.content_box{
    width:$contentWidth;
    margin:0 auto;
    height:860px;
    padding-top: 175px;
    background: #FFFFFF;
    .pencil{
    margin-left:306px;
    }
    .error{
      width:216px;
      height:168px;
      font-size:120px;
      color:$major;
      margin: -70px 493px;
    }
    .text{
       font-size:24px;
       color:$major;
       margin: 49px 447px;
       width: 332px;
    }
    .graytext{
       width:308px;
       height:20px;
       font-size:14px;
       color:$secondary;
       margin-left:450px;
       margin-top: -22px;
    }
    .button{
      display: inline-flex;
      width:139px;
      height:40px;
      border-radius:3px;  
      font-size:16px;
      border:1px solid rgba(47,93,204,1);
      box-sizing:border-box;  
      line-height:38px;
      font-family:PingFangSC-Regular;
      position: relative;
      left: 452px;
      margin-top: 103px;
      margin-right: 41px;
      cursor: pointer;
      .backpre{
        width:80px;
        height:22px;
        color:rgba(47,93,204,1);
        margin: 0 auto; 
      }
      .backindex{
        width: 100%;
        color:#ffffff;
        background:#2F5DCC;
        margin: 0 auto; 
        padding-left:32px;
      
      }
    }
}
  



</style>
