<template>
  <div class="wrapper">
    <div class="container">
      <div class="logo"></div>
      <form>
        <dl>
          <dt>用户登录</dt>
          <dd class="account"><input type="text" placeholder="请使用EHR账号密码登录" v-model="account"></dd>
          <dd class="password"><input type="text" placeholder="请输入密码" v-model="password"></dd>
          <dd class="code"><input type="text" placeholder="请输入验证码" v-model="code"><img class="code" src=""></dd>
          <dd class="tips"><p v-if="isRight">验证码错误</p></dd>
          <dd class="login" @click="login"><input type="button" value="登录"></dd>
        </dl>
      </form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as adminApi from '../../api/adminUser';
  import {  mapActions } from 'vuex'
  import * as adminTypes from '../../store/adminData.js'
  export default {
    data() {
      return {
        account: '',
        password: '',
        code: '',
        isRight: true
      }
    },
    methods: {
      ...mapActions([adminTypes.ADMIN_GET_USER_INFO]),
      // 验证码接口

      // 登录接口
      async login() {
        if (this.account && this.password) {
          // 请求
          try{
            const userData = await adminApi.getUserInfo();
            window.sessionStorage.setItem('userData', userData);
            this[adminTypes.ADMIN_GET_USER_INFO](userData);
            this.$router.push('/index');
          }catch(err) {
            this.tips('用户名或密码不正确哦~')
          }
        } else {
          this.tips('用户名或密码不能为空哦~')
        }
      },
      tips(val) {
        this.$message({
          message: val,
          type: 'warning'
        });
      }
    }
  }

</script>

<style lang="scss" scoped>
  * {
    margin: 0;
    padding: 0;
  }

  .wrapper {
    .container {
      width: 435px;
      margin: calc(50vh - 269px) auto;
      /*margin: 0 auto;*/
    }
    .logo {
      width: 435px;
      height: 48px;
      background: url('../../assets/img/logo.png') no-repeat center center;
    }
    form {
      margin-top: 20px;
      background-color: #fff;
      box-shadow: 0 1px 5px 0 rgba(125, 138, 217, 0.2);
      border-radius: 3px;
      padding: 40px 39px 50px 39px;
      dl {
        font-size: 20px;
        dt {
          font-size: 20px;
        }
        dd {
          margin-top: 20px;
          position: relative;
          input {
            width: 356px;
            height: 56px;
            border-radius: 3px;
            border: 1px solid rgba(229, 231, 235, 1);
            padding-left: 36px;
          }
        }
        dd:before {
          content: '';
          position: absolute;
          left: 15px;
          top: 20px;
          width: 15px;
          height: 17px;
        }
        .account:before {
          background: url("../../assets/img/contact.png") no-repeat left center
        }
        .password:before {
          background: url("../../assets/img/password.png") no-repeat left center
        }
        .code:before {
          background: url("../../assets/img/code.png") no-repeat left center
        }
        .code {
          input {
            width: 250px;
          }
          img {
            margin-left: 6px;
            vertical-align: top;
            width: 100px;
            height: 56px;
          }
        }
        .tips {
          margin-top: 8px;
          color: #FC5252;
          font-size: 14px;
          height: 20px;
        }
        .login input {
          padding-left: 0;
          margin-top: 25px;
          width: 356px;
          height: 52px;
          background: rgba(65, 109, 215, 1);
          opacity: 1;
          border-radius: 3px;
          font-size: 18px;
          color: #fff;
        }
      }
    }
  }

  .wrapper:before {
    content: '';
    width: 100vw;
    height: 50vh;
    position: fixed;
    top: 0;
    left: 0;
    background: url("../../assets/img/background.jpg") no-repeat bottom;
    background-size: cover;
    z-index: -2;
  }

  .wrapper:after {
    content: '';
    width: 100vw;
    height: 50vh;
    position: fixed;
    top: 0;
    left: 0;
    background: linear-gradient(180deg, rgba(49, 27, 180, 1), rgba(33, 114, 255, 1));
    opacity: 0.8975;
    z-index: -1;
  }
</style>
