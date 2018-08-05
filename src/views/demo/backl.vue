<template>
  <div class='container'>
      <h></h>
      <breadcrumb :opt='opts'></breadcrumb>
      <section>
        <div class="sec">
            <div class="left">
              <button  :class="{active:isActive}"><font>撤回</font></button>
              <p>第一审批人审批之前可以撤回</p>
            </div>
            <div class="right">
             <hr>
              <!--<p  class="approver_first">张珊珊：漏打卡申请</p>
              <P  class="tr">时间：2018-09-09</P>
              <P  class="tr">原因：北京市东城区安镇路12号13层1309</P>
              <P  class="approver_second" >王美丽：审批中</P>
              <P  class="approver_third">王美丽：审批中</P>
              <P  class="approver_four" >王美丽：审批中</P>-->

                  <p class="approver_first">
                    <img id="approver_firstimg" :src="imgsrc1">{{dataArray.name}} {{dataArray.text}}
                    <P  class="tr" >时间：{{dataArray.time}}</P>
                    <P  class="tr" >原因：{{dataArray.reason}}</P>
                  </p>
                  <P class="approver_second"  v-for="(item,index) in dataArray.approverModels" :key="index">
                    <img id="approver_secondimg" :src="imgsrc2">{{item.name}}：{{item.status}}
                  </P>
            </div>
        </div>
      </section>
  </div>
</template>

<script>
/* eslint-disable */
import breadcrumb from './breadcrumb.vue'
import h from './h.vue'

export default {
  name: 'backl',
  data () {
    return {
        isActive:false,
        imgsrc1:require("../../assets/img/Group 13.png"),
        imgsrc2:require("../../assets/img/Group 11.png"),
        imgsrc3:require("../../assets/img/Group 7.png"),
        opts: [{
          name: '考勤查询',
          path: '/'
          }, {
          name: '漏打卡申请',
          path: '/'
          }, {
          name: '申请',
          path: '/'
          }],
        dataArray: {
          name: '张珊珊',
          text: "漏打卡申请",
          time: "2018-09-09",
          reason: "打卡机器未记录",
          status: "A",
          statusStr: "已批准",
          approverModels: [{
            name: '张珊珊',
            status: 1,
          },{
            name: '张珊珊',
            status: 0,
          },{
            name: '张珊珊',
            status: 0,
          }]
        }
    }
  },
  components: {
    breadcrumb, h
  },
  methods:{
  },
  mounted(){
    if(this.dataArray.approverModels[0].status==0){
     this.isActive=true
    };
    if(this.dataArray.approverModels[0].status==0){
        this.imgsrc2=this.imgsrc3
    }else{
      this.imgsrc2=this.imgsrc2
    };
  
   

  },
  computed(){
    alert(1)
  }
}
</script>

<style lang="scss" scoped>
  .container {
      width:1200px;
      height:780px;
      section{
        width:1160px;
        height:666px;
        padding:20px;
        background-color:rgb(245,245,250);
        .sec{
          width:1160px;
          height:620px;
          display:flex;
          padding-top:44px;
          background-color:rgb(255,255,255);
          .left{
            width:520px;
            margin-right:24px;
            button{
                width:139px;
                height:40px;
                margin-left:379px;
                background:grey;
                border-radius:3px;
                font{
                  width:36px;
                  height:25px;
                  font-size:18px;
                  font-family:PingFangSC-Regular;
                  color:rgba(255,255,255,1);
                  line-height:25px;
                }
              };
              P{
                width:224px;
                height:20px;
                margin-left:334px;
                font-size:14px;
                font-family:PingFangSC-Regular;
                color:rgba(243,156,18,1);
                line-height:20px;
              }
          };
          .right{
            width:500px;
            margin-top:-10px;
            hr{
            width:0px;
            height:310px;
            border:2px solid rgba(204,204,204,1);
            position: absolute;
            left: 583px;
            top: 245px;
            };
            p{
              img{
                margin-right:12px;
                position:relative;
                top:8px;
              }
            };
              .approver_first{
                width:206px;
                height:88px;
                margin-top:8px;
                font-size:16px;
                font-family:PingFangSC-Regular;
                color:rgba(102,102,102,1);
                line-height:22px;
              };
                .tr{
                  width:268px;
                  height:20px;
                  margin-left:36px;
                  font-size:14px;
                  font-family:PingFangSC-Regular;
                  color:rgba(102,102,102,1);
                  line-height:20px;
                };
                .approver_second{
                    width:200px;
                    height:22px;
                    margin-top:60px;
                    font-size:16px;
                    font-family:PingFangSC-Regular;
                    color:rgba(102,102,102,1);
                    line-height:22px;
                };
                .approver_third,.approver_four{
                    width:200px;
                    height:22px;
                    font-size:16px;
                    margin-top:40px;
                    font-family:PingFangSC-Regular;
                    color:rgba(153,153,153,1);
                    line-height:22px;
                }
            }
          }
      }
  }
  .container .sec .left .active{
    background:rgba(65,109,215,1)
  }
</style>
