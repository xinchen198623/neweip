<template>
  <div class="breadcrumb">
    <div class='breadcrumb-body'>
      <div class='breadcrumb-flex'>
        <router-link id="spanimg" :to="{ path: '/' }"><img src="../assets/img/icon_home.png"></router-link>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">个人首页</el-breadcrumb-item>
          <el-breadcrumb-item v-for="(item,index) in breadlist " :key="index" v-if='index !== breadlist.length - 1'><router-link tag="span" class="poniter" :to="{name: item.path}">{{item.name}}</router-link></el-breadcrumb-item>
          <span class='current'>{{breadlist[breadlist.length - 1].name}}</span>
        </el-breadcrumb>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'breadcrumb',
  props: ['breadlist'],
  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';

.breadcrumb{
  width: 100%;
  background-color: #fff;

  .breadcrumb-body {
    width: $contentWidth;
    margin: 0px auto;

    .breadcrumb-flex {
      height: 57px;
      display: flex;
      align-items: center;
      padding-left: 22px;
    }
    #spanimg{
      img{
        width: 16px;
        height: 16px;
        margin-top: 5px;
      }
    };
    .el-breadcrumb{
      font-size: $subtitleSize;
      margin-left: 10px;

      .current {
        color: $major;
      }
    }
  }
}
.poniter{
  cursor: pointer;
}
</style>

<style lang="scss" >
  @import '@/assets/css/variables.scss';
  .breadcrumb .el-breadcrumb__inner{
    color: $primary;
    font-weight: normal !important;
  }
</style>
