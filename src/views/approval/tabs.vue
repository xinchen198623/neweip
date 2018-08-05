<template>
  <div class = "tabs" v-show='!loading'>
    <ul class="clearfix">
      <template v-for="(item,index) in tabsParam">
        <li class="tab" ref="tab" v-if="index > 0 && item.num > 0" @click="tabChanged(index)" :class="{active:index===active}" :key="index">
          <div slot="reference" class="tabRouter" >
            {{item.text}} ( <span class="tabNum">{{item.num}}</span> )
          </div>
        </li>
        <li class="tab first" ref="tab" v-else-if="index === 0" :key="index">
          <div class="tabRouter">
            {{item.text}} (  <span class="tabNum">{{item.num}}</span> )
          </div>
        </li>
        <!--<li class="tab" ref="tab" v-else-if="index > 7 && item.num > 0"  @click="tabChanged(index)" :class="{active:index===active}" :key="index">-->
          <!--<router-link :to="item.routerTo" class="tabRouter">-->
            <!--{{item.text}} ( <span class="tabNum">{{item.num}}</span> )-->
          <!--</router-link>-->
        <!--</li>-->
      </template>
    </ul>
    <div class="navSlider" :style="{left: left+'px',width: width + 'px'}"></div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import * as api from '../../api/home'

let typeMap = {
  'all': 0,
  'attendance': 1,
  'recruitment': 2,
  'entry': 3,
  'regularization': 4,
  'dimission': 5,
  'expense': 6,
  'oa': 7,
  'baseFee': 8,
  'right': 9,
  'other': 10
}
export default {
  props: ['curKey'],
  data () {
    return {
      tabsParam: [
        {text: '全部', name: '全部', key: 'all', num: 0},
        {text: '考勤', name: '待审批-考勤', key: 'attendance', routerTo: 'toOuterPageApproval', num: 0, host: 'EHR'},
        {text: '招聘', name: '待审批-招聘', key: 'recruitment', routerTo: 'toOuterPageApproval', num: 0, host: 'EHR'},
        {text: '入职', name: '待审批-入职', key: 'entry', routerTo: 'toOuterPageApproval', num: 0, host: 'EHR'},
        {text: '转正', name: '待审批-转正', key: 'regularization', routerTo: 'toOuterPageApproval', num: 0, host: 'EHR'},
        {text: '离职', name: '待审批-离职', key: 'dimission', routerTo: 'toOuterPageApproval', num: 0, host: 'EHR'},
        {text: '费控', name: '待审批-费控', key: 'expense', routerTo: 'toOuterPageApproval', num: 0, host: 'ERP'},
        {text: 'OA', name: '待审批-OA', key: 'oa', routerTo: 'toOuterPageApproval', num: 0, host: 'OA'},
        {text: '基础费用', name: '待审批-基础费用', key: 'baseFee', routerTo: 'commonApproval', num: 0, host: ''},
        {text: '权限/IT', name: '待审批-权限/IT', key: 'right', routerTo: 'commonApproval', num: 0, host: ''},
        {text: '其他', name: '待审批-其他', key: 'other', routerTo: 'commonApproval', num: 0, host: ''}
      ],
      active: 0,
      left: 5,
      width: 0,
      loading: true
    }
  },
  computed: {
    ...mapState({
      userId: state => state.user.userAccount
    })
  },
  watch: {
    userId: function (newValue, oldValue) {
      this.updateTab()
    },
    active: function (newValue, oldValue) {
      this.switch()
      this.updateTab()
    }
  },
  created () {
    // 这个应该重首页拿值
    console.log('首页传过来的当前活动页的值')
    console.log(this.$route.query)
    this.active = typeMap[this.$route.query.key]
    this.updateTab()
  },
  methods: {
    async getHistoryTabNums () {
      // 获取tab各项数量
      try {
        const data = await api.getHomeInfo(this.userId)
        console.log('直接从接口获取的数据')
        console.log(data)
        // 将获取到的值更新到页面中
        let totalNum = 0
        this.tabsParam[0].num = 0
        this.tabsParam[1].num = 0
        let todolist = data.todolist
        // 考勤
        for (let key in todolist.attendance) {
          this.tabsParam[1].num += todolist.attendance[key] || 0
        }

        for (let i = 2; i < this.tabsParam.length; i++) {
          if (i > 5) {
            // 费控及以后
            this.tabsParam[i].num = todolist[this.tabsParam[i].key] || 0
          } else {
            // 入转调离
            this.tabsParam[i].num = todolist.rzdl[this.tabsParam[i].key] || 0
            console.log(this.tabsParam[i].key, this.tabsParam[i].num)
          }
        }
        // 全部
        for (let i = 1; i < this.tabsParam.length; i++) {
          totalNum += this.tabsParam[i].num
        }
        this.tabsParam[0].num = totalNum
        // console.log(this.tabsParam)
        this.loading = false
        this.$emit('closeLoading')
        this.$nextTick(() => {
          if (this.tabsParam[this.active].num <= 0) {
            this.autoSwitch()
          } else {
            this.switch()
          }
        })
      } catch (err) {
        if (!err.isCanceled) {
          this.$emit('closeLoading', 'timeout')
        }
      }
    },
    tabChanged (newTab) {
      // tab切换
      this.active = newTab
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
        let curItem = this.tabsParam[this.active]
        this.$router.push({path: curItem.routerTo, query: {key: curItem.key}})
      }
    },
    sliderLeft: function (tab) {
      // 改变active状态滑动位置
      this.$nextTick(function () {
        if (this.$refs.tab[tab]) {
          this.left = this.$refs.tab[tab].offsetLeft
          this.width = this.$refs.tab[tab].clientWidth
        } else {
          this.autoSwitch()
        }
      })
    },
    updateTab () {
      // 更新数据
      if (this.userId.length > 0) {
        this.getHistoryTabNums()
      }
    },
    autoSwitch() {
      for (let i = 1, il = this.tabsParam.length; i < il; i++) {
        if (this.tabsParam[i].num > 0) {
          this.tabChanged(i)
          break
        }
      }
    }
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
</style>
