<template>
  <div class = "tabs">
    <ul class="clearfix">
      <template v-for="(item,index) in tabsParam">
        <li class="tab" ref="tab" v-if="index>0 && index<5" :class="{active:index===active}" :key="index">
          <el-popover
            placement="top"
            trigger="hover">
            <router-link v-if="index !== 2" :to="item.routerTo" class="single-page">
              去往 <span>{{ item.text }} >></span>
            </router-link>
            <div v-else class="mutile-page">
              <ul class="clearfix">
                <li v-for="(subItem,index) in item.children" :key="index">
                  <router-link :to="subItem.routerTo">
                    {{subItem.name}}
                  </router-link>
                </li>
              </ul>
              <p>点击以上页签，打开EHR系统相应列表页</p>
            </div>
            <div slot="reference"  class="tabRouter">
              {{item.name}}
              <span class="tabNum">({{item.num}})</span>
            </div>
          </el-popover>
        </li>
        <li class="tab" ref="tab" v-else-if="index === 0" :class="{active:index===active}" :key="index">
          <router-link :to="item.routerTo" class="tabRouter">
            {{item.name}}
            <span class="tabNum">({{item.num}})</span>
          </router-link>
        </li>
        <li class="tab" ref="tab" v-else  @click="tabChanged(index)" :class="{active:index===active}" :key="index">
          <router-link :to="item.routerTo" class="tabRouter">
            {{item.name}}
            <span class="tabNum">({{item.num}})</span>
          </router-link>
        </li>
      </template>
    </ul>
    <div class="navSlider" :style="{left: left+'px'}" v-show="active!==1"></div>
    <div class="subtabs" :style="{height: height+'px'}">
      <ul  v-show="active===1">
        <li class="tab" v-for="(item,index) in tabsParam[1].child" @click="subtabChanged(index)" :class="{active:index===subactive}" :key="index">
          <router-link :to="item.routerTo" class="tabRouter">
            {{item.name}}
            <span class="tabNum">({{item.num}})</span>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="subnavSlider" :style="{left: subleft+'px'}" v-show="active===1"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tabsParam: [
        {name: '全部', routerTo: '', num: 12},
        {
          name: '考勤',
          routerTo: '/history/leakcardHistory',
          text:'去往EHR系统审批列表页 >>',
          variable:'hover',
          num: 8,
          child: [
            {name: '漏打卡', routerTo: '/history/leakcardHistory', num: 2},
            {name: '休假', routerTo: '', num: 4},
            {name: '加班', routerTo: '', num: 1},
            {name: '公出', routerTo: '/history/errandHistory', num: 1}
          ]
        },
        {name: '入转调离', text:'去往ERR费控审批列表页 >>',variable:'hover',routerTo: '', num: 1},
        {name: '费控', text:'去往ERR费控审批列表页 >>', variabler:'hover',routerTo: '', num: 1},
        {name: 'OA', text:'去往OA审批系统列表页 >>', variable:'hover',routerTo: '', num: 1},
        {name: '基础费用', routerTo: '',variable:'click', num: 1},
        {name: '权限/IT', routerTo: '', variable:'click',num: 1},
        {name: '其他', routerTo: '',variable:'click', num: 1}
      ],
      active: 0,
      subactive: 0,
      left: 21,
      subleft: 140,
      dropVisible: false
    }
  },
  computed: {
  },
  methods: {
    push(){
      this.$router.push("/")
    },
    visibleChanged (status) {
      // 弹出true,收回false
      this.dropVisible = status
      if (status) {
        this.tabChanged(1)
      }
    },
    tabChanged (newTab) {
      console.log('tabChanged', newTab)
      if (this.active !== newTab) {
        this.active = newTab
        this.sliderLeft(newTab)
      }
    },
    subtabChanged (newTab) {
      console.log('subtabChanged', newTab)
      if (this.subactive !== newTab) {
        this.subactive = newTab
        this.subsliderLeft(newTab)
      }
    },
    sliderLeft: function (tab) {
      // console.log('sliderOffset')
      let left = 0
      if (tab === 0) {
        left = 21
      } else if (tab === 6) {
        left = 137 + 5 * 104 + 9.5
      } else {
        left = 137 + (tab - 1) * 104 + 4.5
      }
      this.left = left
    },
    subsliderLeft: function (tab) {
      // console.log('sliderOffset')
      let left = 0
      if (tab === 0) {
        left = 140
      } else {
        left = 254 + (tab - 1) * 104 + 6
      }
      this.subleft = left
    }
  },
  mounted () {
    // 定位到第一个,或者可以拿一个参数，现在问题是这个参数怎么拿
    console.log('挂载完成后')
    console.log(this.$refs.tab)
    this.tabChanged(5)
    // 继续想想这个还有什么别的方法,如果定位到第一个那现在可以了，但是现在明显不是
    if (this.$router.history.current.name === 'leakcardHistory') {
      this.tabChanged(1)
    } else if (this.$router.history.current.name === 'errandHistory') {
      this.tabChanged(1)
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
      padding: 20px 29px;
      line-height: 20px;
      white-space:nowrap;
      text-align: center;
    }
    .tab:hover {
      cursor: pointer;

    }
    .tip{
      background:red;
    }
    .tab:first-child {
      width: 137px;
    }
    .tab:last-child {
      width: 114px;
    }
    .tabRouter {
      display: block;
      width: 100%;
      height: 100%;
      text-align: center;
      text-decoration: none;
      color: $secondary;
    }
    .tabNum {
      color: $going;
    }
    .tips{
      width:190px; 
      height:30px; 
      border:1px solid gray; 
      position: absolute;
      top:-28px;
      border-radius: 4px;
      display:none;
      
    }
      /*倒置三角样式*/
    .arror{
      width:0; 
      height:0; 
      overflow:hidden; 
      border-width:15px; 
      border-style:solid;  
      position:absolute;
      margin-left:30px;
      top:-73px;
    }
    /*倒置三角中背景三角样式*/
    .arrorbg{
      border-color:#FFF transparent transparent;
      margin-top:99px;
    }
      /*倒置三角中主三角样式*/
    .arr{
      border-color:#909399 transparent transparent;
      margin-top:101px;
    }
    .selectNum {
      position: absolute;
      top: 20px;
      right: 28px;
      z-index: 1;
      color: $going;
    }
    .navSlider {
      position: absolute;
      top: 58px;
      height: 3px;
      width: 95px;
      background-color: $primary;
      transition: left .3s;
      transition-timing-function: ease;
    }
    .subtabs {
      height: 0; // 47
      background-color: #fafafa;
      transition: height .2s;
      transition-timing-function: ease;
      ul {
        padding-left: 120px;
        position: relative;
        &::before {
        content: '';
        position:absolute;
        top: -20px;
        left: 180px;
        border-bottom: 10px solid #e6e6e6;
        border-top: 10px solid transparent;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
      }
      &::after {
        content: '';
        position:absolute;
        top: -18px;
        left: 180px;
        border-bottom: 10px solid #fafafa;
        border-top: 10px solid transparent;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
      }
        li {
          line-height: 47px;
          &:last-child {
            width: 104px;
          }
        }
      }
    }
    .subnavSlider {
      position: absolute;
      top: 105px;
      height: 3px;
      width: 95px;
      background-color: $primary;
      transition: left .3s;
      transition-timing-function: ease;
    }
  }
  .single-page{
    color: $minor;
    font-size: $smallSize;
  }
  .single-page span{
    color: $primary;
    font-size: $contentSize;
  }
  .mutile-page ul{
    list-style: none;
    padding-left: 0;
    margin: 0;
  }
  .mutile-page ul li{
    float: left;
    width: 25%;
    text-align: center;
  }
  .mutile-page ul li a{
    color: $primary;
    text-decoration: underline;
  }
  .mutile-page p{
    margin: 0;
    margin-top: 6px;
    font-size: $smallSize;
    color: $minor;
  }
</style>
