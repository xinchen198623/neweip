<template>
  <!-- 每个模板定义自己的class，方便样式的隔离和控制 -->
  <!-- <div class="header">顶部组件的点点滴滴</div> -->
  <div class="header">
    <div class='headerbanner clearfix'>
      <a herf="" class="logo">恒昌EIP系统</a>
      <div class="my-info">
        <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              <img class="head-portrait" src="../../assets/img/Oval.png" alt="">
              {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
          <el-dropdown-menu slot="dropdown">
            <div v-for="(item, index) in myDropInfo" :key="index" @mouseenter="item.active = true" @mouseleave="item.active = false">
              <el-dropdown-item :command="item.command" :divided="index === 4">
                <img :src="item.active ? item.imgActive : item.img" class="drop-img">{{item.name}}
              </el-dropdown-item>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="contact">
        <el-dropdown>
            <span class="el-dropdown-link">
              <i class="contact-img"></i>
            </span>
          <el-dropdown-menu slot="dropdown">
            <p class="drop-title">联系管理员：</p>
            <div v-for="(item, index) in contactDropInfo" :key="index" @mouseenter="item.active = true" @mouseleave="item.active = false">
              <el-dropdown-item :command="item.command">
                <img :src="item.active ? item.imgActive : item.img" class="drop-img">{{item.text}}
              </el-dropdown-item>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="setting"><img src="../../assets/img/icon_setting.png" alt=""></div>
      <!--<div class="news"><img src="../../assets/img/icon_bell.png" alt=""></div>-->
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import * as adminApi from '../../api/adminUser';
  import * as adminTypes from '../../store/adminData.js'

  let myDropInfo = [
    {name: '替换审批人', command: 'alterApproval', img: require('../../assets/img/mydrop01.png'), imgActive: require('../../assets/img/mydrop01-active.png'), url: '', active: false},
    // {name: '我的申请', command: 'myapplies', img: require('../../assets/img/mydrop02.png'), imgActive: require('../../assets/img/mydrop02-active.png'), url: '', active: false},
    {name: '个人信息', command: 'profile', img: require('../../assets/img/mydrop03.png'), imgActive: require('../../assets/img/mydrop03-active.png'), url: '', active: false},
    {name: '更改密码', command: 'change', img: require('../../assets/img/mydrop04.png'), imgActive: require('../../assets/img/mydrop04-active.png'), url: '', active: false},
    {name: '退出登录', command: 'exit', img: require('../../assets/img/mydrop05.png'), imgActive: require('../../assets/img/mydrop05-active.png'), url: '', active: false}
  ];

  let contactDropInfo = [
    {text: '15510980099', command: 'myapplies', img: require('../../assets/img/drop-call.png'), imgActive: require('../../assets/img/drop-call-active.png'), url: '', active: false},
    {text: 'mahkhh@credithc.com', command: 'myapplies', img: require('../../assets/img/drop-mail.png'), imgActive: require('../../assets/img/drop-mail-active.png'), url: '', active: false}
  ];

  export default {
    name: 'LimitsHeader',
    data () {
      return {
        myDropInfo,
        contactDropInfo,
      }
    },

    // 可以本地取，没定
    computed:mapState({
      username : state => state.adminUser.adminName
    }),

    methods: {
      async handleCommand(command) {
        switch(command) {
          case 'exit':
            this.$router.push('/admin');
            break;
          case 'alterApproval':
            this.$router.push('/index');
            break;
          case 'myapplies':
            // this.$router.push('/history/commonApplyHistory');
            break;
          case 'profile':{
            break;
          }
          case 'change':{
            break;
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .header{
    height: 58px;
    padding: 0 28px;
    box-sizing: border-box;
    background-color: #416DD7;

    .contact {
      float: right;
      margin-left: 38px;

      .contact-img {
        width: 18px;
        height: 18px;
        display: inline-block;
        background: url(../../assets/img/call.png);
        background-size: 18px 18px;
        cursor: pointer;
        vertical-align: text-bottom;
      }
    }
    .setting{
      margin: 14px 0 14px 38px;
      img{
        width: 18px;
        height: 18px;
      }
    }
    .news{
      margin: 14px 0;
      img{
        width: 16px;
        height: 18px;
      }
    }
    .news, .setting{
      float: right;
      cursor: pointer;
      img{
        vertical-align: middle;
      }
    }
  }
  .drop-title {
    margin:6px 0 8px 20px;
  }
  .drop-img {
    width: 18px;
    height: 18px;
    vertical-align:middle;
    margin-right: 10px;
  }
  .headerbanner {
    width: 1200px;
    margin: 0 auto;
    line-height: 30px;
  }
  .logo{
    display: inline-block;
    width: 147px;
    margin: 14px 0;
    font-size: 0;
    background: url('../../assets/img/icon_logo.png') 0 0 no-repeat;
    background-size: 100% 100%;
  }
  .my-info{
    float: right;
  }
  .my-info .head-portrait{
    display: block;
    float: left;
    width: 28px;
    padding: 1px 0;
    margin-left: 32px;
    margin-right: 6px;
  }
  .el-dropdown-link{
    display: block;
    margin: 14px 0;
    cursor: pointer;
  }
  .my-info .el-dropdown{
    color: #fff;
    margin-left: 6px;
  }
  .header .el-badge{
    float: right;
    height: 30px;
    margin-top: 14px;
    margin-bottom: 14px;
    margin-left: 40px;
  }
  .header .el-badge .icon{
    display: block;
    width: 19px;
    height: 30px;
  }
  .header .el-badge .icon.icon-bell{
    background: url('../../assets/img/icon_bell.png') center center no-repeat;
    background-size: 16px 19px;
  }
  .header .el-badge .icon.icon-setting{
    background: url('../../assets/img/icon_setting.png') center center no-repeat;
    background-size: 17px 17px;
  }
  .el-dropdown-menu{
    min-width: 234px;
    padding: 0;
    margin: 0;
  }
  .el-dropdown-menu__item{
    line-height: 50px;
  }
  .el-dropdown-menu__item--divided{
    margin-top: 0;
    border-color: #F2F3F5;
  }
  .el-dropdown-menu__item--divided img{
    width: 14px;
    height: 15px;
    margin-top: -3px;
    margin-left: 3px;
  }
  .el-dropdown-menu__item--divided:before{
    height: 0;
  }
</style>
<style lang="scss">
  .header .el-badge .el-badge__content{
    background-color: #FF0000;
    height: 12px;
    width: 12px;
    line-height: 12px;
    border: 0;
    padding: 0;
  }
  .header .el-badge .el-badge__content.is-fixed{
    top: 8px;
    right: 4px;
  }
</style>
