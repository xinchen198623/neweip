<template>
  <div class = "tabs">
    <ul class="clearfix">
      <template v-for="(item,index) in tabsParam">
        <li class="tab" ref="tab" v-if="index > 0 && (item.num > 0)" @click="tabChanged(index)" :class="{active:index===active}" :key="index">
          <div slot="reference" class="tabRouter" >
            {{item.text}} ( <span class="tabNum">{{item.num}}</span> )
          </div>
        </li>
        <li class="tab first" ref="tab" v-else-if="index === 0" :key="index" v-show="showTab">
          <div class="tabRouter">
            {{item.text}} (  <span class="tabNum">{{item.num}}</span> )
          </div>
        </li>
      </template>
    </ul>
    <div class="navSlider" :style="{left: left+'px',width: width + 'px'}"></div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
// import * as api from '../../api/home'
import * as api from '../../api/history'
export default {
  data () {
    return {
      left: 5,
      width: 0
    }
  },
  props: {
    // refresh: {
    //   type: Boolean,
    // },
    tabsParam: {
      type: Array
    },
    active: {
      type: Number
      // default: 0
    },
    showTab: {
      type: Boolean
    }
  },
  watch: {
    active (newValue, oldValue) {
        // console.warn('tab watch active 变化',oldValue, newValue)
        this.switch(newValue)
    },
    '$route' (to, from) {
    },
  },
  created () {
  },
  mounted () {
    //console.log('tab挂载完成')
    // 获取我的申请的数值
    // if (this.userId.length > 0) {
    //   this.getHistoryTabNums()
    // }
    this.switch(this.active)
  },
  methods: {
    tabChanged (newTab) {
      // tab切换
      this.$emit('activeChanged',newTab)
      // this.active = newTab
      //this.toPage()
    },
    switch () {
      let num = 0
      for (let i = 0; i < this.active; i++) {
        if (this.tabsParam[i].num > 0) {
          num++
        }
      }

      if (num > 0) {
        this.sliderLeft(num)
      }
    },
    sliderLeft: function (num) {
      // console.warn('改变active状态滑动位置')
      // console.warn(this.$refs.tab)
      // let left = 5
      // // console.warn(num)
      this.$nextTick(function () {
        // 此时已经渲染完成
        this.left = this.$refs.tab[num].offsetLeft
        this.width = this.$refs.tab[num].clientWidth
      });
    },
  }
}
</script>

<style lang="scss" scoped>
  @import "@/assets/css/variables.scss";
  @import "@/assets/css/layout.scss";
  .tabs {
    position: relative;
    background-color: #fff;
    ul {
      padding: 0 5px;
      margin:0;
      border-bottom: 1px solid #e6e6e6;
      list-style: none;
    }
    .tab {
      float: left;
      position: relative;
      height: 60px;
      line-height: 20px;
      white-space:nowrap;
      text-align: center;
    }
    .tab:hover {
      cursor: pointer;
    }
    // 【全部】hover箭头
    .first:hover {
      cursor: auto;
    }
    .tab.first .tabRouter{
      padding-left: 29px;
      font-size: 16px;
      font-weight: 600;
    }
    .tab.active .tabRouter{
      color: #416DD7;
      font-weight: 600;
      .tabNum{
        font-weight: 400;
      }
    }
    .tabRouter {
      display: inline-block;
      color: $secondary;
      padding: 20px 10px;
    }
    .tabNum {
      color: #FC5252;
    }
    .navSlider {
      position: absolute;
      top: 58px;
      height: 3px;
      width: 95px;
      background-color: $primary;
      transition: all .2s ease-out;
    }
  }
  .tab-hover .tabRouter{
    /*padding-bottom: 15px;*/
    /*margin-bottom: 5px;*/
  }
  .single-page{
    color: $minor;
    font-size: $contentSize;
  }
  .single-page span{
    color: $primary;
    font-size: $contentSize;
    text-decoration: underline;
  }
  .mutile-page ul{
    list-style: none;
    padding-left: 0;
    margin: 0;
  }
  .mutile-page ul li{
    float: left;
    /*width: 25%;*/
    padding: 0 5px;
    text-align: center;
    color: $primary;
    text-decoration: underline;
    cursor: pointer;
  }
  .mutile-page ul li span{
    color: #FC5252;
  }
  .mutile-page p{
    margin: 0;
    margin-top: 6px;
    font-size: $smallSize;
    color: $minor;
  }
  /**跳转页面**/
  .toOuterPage{
    position: relative;
  }
  .link-box{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    text-align: center;
  }
  .link-box .tip{
    display: block;
    margin-bottom: 8px;
    color: #666666;
  }
  .link-box .link{
    font-size: 16px;
    color: $primary;
    text-decoration: underline;
    cursor: pointer;
  }
</style>
