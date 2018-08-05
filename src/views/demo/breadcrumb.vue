<template>
    <div class='subitem'>
        <span id="spanimg"><img src="../../assets/img/breadcrumb.jpg"></span>
        <el-breadcrumb separator="/">
           <el-breadcrumb-item :to="{ path: '/' }">个人首页</el-breadcrumb-item>
            <!-- <el-breadcrumb-item><a href="/">漏打卡申请</a></el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">我的申请</a></el-breadcrumb-item>
            <el-breadcrumb-item>详情</el-breadcrumb-item>-->
            <el-breadcrumb-item v-for="(item,index) in opt" :key="index"><router-link :to="item.path">{{item.name}}</router-link></el-breadcrumb-item>
                 <!--<router-link :to="item.path">{{item.value}}</router-link>-->
        </el-breadcrumb>
    </div>
</template>

<script>

export default {
  name: 'breadcrumb',
  data () {
    return {
      brumblist: [{
        name: '考勤查询',
        path: '/'
      }, {
        name: '漏打卡申请',
        path: '/'
      }, {
        name: '我的申请',
        path: '/'
      }] // 路由集合
    }
  },
  props:['opt']
}
</script>

<style lang="scss" scoped>
  .subitem {
      height: 34px;
      width: 1200px;
      padding-top: 23px;
      background:rgba(255,255,255,1);
      #spanimg{
        img{
          width:16px;
          height:16px;
          position:absolute;
          left:31px;
        }
      };
      .el-breadcrumb{
          width:600px;
          height:22px;
          position:absolute;
          left:54px;
          span:last-child{
            a{
              color:#416DD7;
            }
          }
      }
  }
</style>
