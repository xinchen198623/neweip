<template>
    <!-- 每个模板定义自己的class，方便样式的隔离和控制 -->
    <!-- <div class="header">顶部组件的点点滴滴</div> -->
    <div class="header">
      <div class='headerbanner'>
        <a herf="" class="logo" @click="toHome" title="回到首页">恒昌EIP系统</a>
        <div class="my-info">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              <img class="head-portrait" src="../assets/img/Oval.png" alt="">
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
              <div v-for="(item, index) in contactDropInfo" :key="index" @mouseenter="item.active = false" @mouseleave="item.active = false">
                <el-dropdown-item :command="item.command" disabled>
                  <img :src="item.active ? item.imgActive : item.img" class="drop-img">{{item.text}}
                </el-dropdown-item>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <!--这一期暂时没有-->
        <!--<el-badge :value="3" :max="99" class="item">-->
          <!--<span class="icon icon-setting"></span>-->
        <!--</el-badge>-->
        <!--<el-badge :value="1" :max="99" class="item">-->
          <!--<span class="icon icon-bell"></span>-->
        <!--</el-badge>-->
      </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import * as types from '../store/mutation-types'
import * as api from '../api/user'
import { setOurterPageUrl } from '../utils/sso.js'

let myDropInfo = [
  // {name: '替换审批人', command: 'alterApproval', img: require('../assets/img/mydrop01.png'), imgActive: require('../assets/img/mydrop01-active.png'), url: '', active: false},
  {name: '我的申请', command: 'myapplies', img: require('../assets/img/mydrop02.png'), imgActive: require('../assets/img/mydrop02-active.png'), url: '', active: false, isOuter: 0},
  {name: '个人信息', command: 'profile', img: require('../assets/img/mydrop03.png'), imgActive: require('../assets/img/mydrop03-active.png'), url: '', active: false, isOuter: 1},
  {name: '更改密码', command: 'change', img: require('../assets/img/mydrop04.png'), imgActive: require('../assets/img/mydrop04-active.png'), url: '', active: false, isOuter: 1},
  {name: '退出登录', command: 'exit', img: require('../assets/img/mydrop05.png'), imgActive: require('../assets/img/mydrop05-active.png'), url: '', active: false, isOuter: 0}
];

let contactDropInfo = [
  {text: '15510980099', command: 'myapplies', img: require('../assets/img/drop-call.png'), imgActive: require('../assets/img/drop-call-active.png'), url: '', active: false},
  {text: 'mahkhh@credithc.com', command: 'myapplies', img: require('../assets/img/drop-mail.png'), imgActive: require('../assets/img/drop-mail-active.png'), url: '', active: false}
];

export default {
  name: 'Header',
  data () {
    return {
      description: '',
      myDropInfo,
      contactDropInfo
    }
  },
  computed: {
    ...mapState({
      username: state => state.user.name
    }),
  },
  components: {
  },
  mounted () {
    if (this.username.length === 0) {
      this[types.GET_USER_INFO]()
      setOurterPageUrl(this.myDropInfo)
    }
  },
  methods: {
    ...mapActions([types.LOGOUT, types.GET_USER_INFO]),
    async handleCommand(command) {
      switch(command) {
        case 'exit':
          const success = await this.LOGOUT()
          break;
        case 'alterApproval':
          this.$router.push('alterApproval');
          break;
        case 'myapplies':
          // this.$router.push('/history/commonApplyHistory?key=all');
          this.$router.push('/history');
          break;
        case 'profile':
          this.openPage(this.myDropInfo[1])
          break;
        case 'change':
          this.openPage(this.myDropInfo[2])
          break;
      }
    },
    toHome() {
      if (this.$route.path === '/') {
        return;
      }
      this.$router.push('/');
    },
    openPage: function({url, target}){
      let link = document.createElement('a')
      console.log('url', url)
      link.href = url
      link.target = target
      link.click()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/css/variables.scss';

  .header{
    height: 58px;
    padding: 0 28px;
    box-sizing: border-box;
    background-color: #416DD7;

    .contact {
      float: right;
      cursor: pointer;
      text-align: center;

      .contact-img {
        width: 18px;
        height: 18px;
        display: inline-block;
        background: url(../assets/img/call.png);
        background-size: 18px 18px;
        vertical-align: sub;
      }

      .el-dropdown-link {
        display: block;
        line-height: 58px;
        cursor: pointer;
        width: 60px;
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
    width: calc(#{$contentWidth} - 40px);
    margin: 0 auto;
  }
  .logo{
    display: inline-block;
    width: 147px;
    height: 30px;
    margin: 14px 0;
    font-size: 0;
    line-height: 30px;
    background: url('../assets/img/icon_logo.png') 0 0 no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
  }
      .el-dropdown:hover {
        background: #3865D2;
      }
  .my-info{
    float: right;
  }
  .my-info .head-portrait{
    display: block;
    float: left;
    width: 28px;
    height: 28px;
    padding: 1px 0;
    margin-right: 6px;
    margin-top: 14px;
  }
  .my-info .el-dropdown-link{
    display: block;
    line-height: 58px;
    cursor: pointer;
  }
  .my-info .el-dropdown{
    color: #fff;
    padding: 0px 8px;
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
    background: url('../assets/img/icon_bell.png') center center no-repeat;
    background-size: 16px 19px;
  }
  .header .el-badge .icon.icon-setting{
    background: url('../assets/img/icon_setting.png') center center no-repeat;
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
  .el-dropdown-menu__item.is-disabled {
    color: #666;
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
