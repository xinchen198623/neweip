<template>
  <div id="app" class='main'>
     <!--<Header></Header>-->
    <router-view/>
    <div class='overlay' v-if='!username'></div>
  </div>
</template>

<script>
import Vue from 'vue'
import {mapState} from 'vuex'
import ElementUI from 'element-ui'
import { Loading } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/common.scss'
import Header from './components/header.vue'
Vue.use(ElementUI)

export default {
  name: 'App',
  components: {
    Header
  },
  computed: {
    ...mapState({
      username: state => state.user.name
    })
  },
  data: function(){
    return {

    }
  }
}
</script>

<style>
.overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  z-index: 2000;
}
</style>
