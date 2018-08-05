<!--未完成页面均跳转到该页面-->
<template>
  <div class="todo-wrapper">
    <bread-crumb :breadlist="breadList"/>
    <div class="todo-main">
      <span>页面仍在开发中......</span>
    </div>
  </div>
</template>

<script>
  import BreadCrumb from '@/components/breadcrumb'

  export default {
    components: {BreadCrumb},
    data() {
      return {
        breadList: [
          {
            name: '待开发',
            path: '/todo'
          }
        ]
      }
    }
  }
</script>

<style lang="scss" scoped>
  .todo-wrapper {

    .todo-main {
      position: absolute;
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 30px;
      font-weight: bold;
      letter-spacing: 1px;
    }
  }
</style>
