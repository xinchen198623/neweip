// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

// v-loadmore: 用于在element-ui的select下拉框加上滚动到底事件监听
Vue.directive('loadmore', {
  bind (el, binding) {
    // 获取element-ui定义好的scroll盒子
    const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown__wrap')
    SELECTWRAP_DOM.addEventListener('scroll', function () {
      /*
       * scrollHeight 获取元素内容高度(只读)
       * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
       * clientHeight 读取元素的可见高度(只读)
       * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
       * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
       */
      const CONDITION = (this.scrollHeight - this.scrollTop === this.clientHeight)

      if (CONDITION) {
        binding.value()
      }
    })
  }
})

window.debuggerLog = function (message) {
  if (process.env.NODE_ENV === 'development') {
    console.log(message)
  }
}
