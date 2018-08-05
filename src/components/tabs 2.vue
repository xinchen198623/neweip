<template>
  <div class = "tabs">
      <ul class="clearfix">
        <!-- <li class="tab" v-for="(item,index) in tabsParam" @click="tabChanged(index)" :class="[{tip:hover},{active:index===active}]" :key="index">
          <router-link :to="item.routerTo" class="tabRouter">
            {{item.name}}
             <div class="tips">
                <div class="arror arr"></div>
                <div class="arror arrorbg"></div>
                <label style="position: relative;top: -15px;"  @click="push()">{{item.text}} </label>
            </div> 
            <span class="tabNum">({{item.num}})</span>
          </router-link>
        </li> -->
        <!-- <li class="tab" v-for="(item,index) in tabsParam1"  @click="tabChanged(index)" :class="{active:index===active}" :key="index">
          <el-popover  class="tab"  :trigger="variable" placement="top-start" visible-arrow=true >       
              <div class="tips">
                  <div class="arror arr"></div>
                  <div class="arror arrorbg"></div>
                  <label  @click="push()">{{item.text}} </label>
              </div> 
            <el-button slot="reference"> {{item.name}}</el-button>
          </el-popover>
        </li> -->
        <div class="tab">全部
          <span class="tabNum">({{total}})</span>
        </div>
        <div class="tab" v-for="(item,index) in tabsParam" :key="index"> 
          {{item.name}} 
          <span class="tabNum">({{item.num}})</span>
          <div class="tips">
              <div class="arror arr"></div>
              <div class="arror arrorbg"></div>
              <label style="position: relative;top: -15px;font-size: 12px;"  @click="push()">{{item.text}} </label>
          </div> 
        </div>
        <!-- <li class="tab" v-for="(item,index) in tabsParams" :key="index" @click="tabChanged(index)" :class="{active:index===active}">
          <router-link :to="item.routerTo" class="tabRouter">
            {{item.name}}
            <span class="tabNum">({{item.num}})</span>
          </router-link>
        </li> -->
        <div class="tab"  @click="basic(index)">基础费用 
          <span class="tabNum">({{total5}})</span>
          <div  class="block" :style="{height: height1+'px'}"> 
            <p class="title basiccost" v-show="active===1" >
              <el-checkbox v-model="checked"></el-checkbox>
              <span>名字</span>
              <span>日期时间</span>
              <span>原因</span>
              <span>其他</span>
            </p>
            <div class="basiccost" v-for="(item,index) in basiccost" :key="index"  v-show="active===1">
              <el-checkbox v-model="checked"></el-checkbox>
              <span>{{item.title}}</span>
              <span>{{item.time}}</span>
              <span>{{item.reason}}</span>
              <span>查看详情</span>
            </div>
            <div class="block" v-show="active===1">
              <el-pagination
                layout="prev, pager, next"
                :total="50">
              </el-pagination>
            </div>
          </div>
        </div>

        <div class="tab" @click="just(index)">权限/IT
          <span class="tabNum">({{total6}})</span>
          <div  class="block" :style="{height: height2+'px'}"> 
            <p class="title basiccost just" v-show="active===2">
              <el-checkbox v-model="checked"></el-checkbox>
              <span>名字</span>
              <span>日期时间</span>
              <span>原因</span>
              <span>其他</span>
            </p>
            <div class="basiccost just" v-for="(item,index) in Jurisdiction" :key="index" :style="{height: height2+'px'}" v-show="active===2">
              <el-checkbox v-model="checked"></el-checkbox>
              <span>{{item.title}}</span>
              <span>{{item.time}}</span>
              <span>{{item.reason}}</span>
              <span>查看详情</span>
            </div>
          </div>
        </div>

        <div class="tab" @click="other(index)">其他 
          <span class="tabNum">({{total7}})</span>
          <div  class="block" :style="{height: height3+'px'}"> 
            <p class="title basiccost other" v-show="active===3">
              <el-checkbox v-model="checked"></el-checkbox>
              <span>名字</span>
              <span>日期时间</span>
              <span>原因</span>
              <span>其他</span>
            </p>
            <div class="basiccost other" v-for="(item,index) in others" :key="index" :style="{height: height3+'px'}" v-show="active===3">
              <el-checkbox v-model="checked"></el-checkbox>
              <span>{{item.title}}</span>
              <span>{{item.time}}</span>
              <span>{{item.reason}}</span>
              <span>查看详情</span>
            </div>
          </div>
        </div>
      </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tabsParam: [
        {
          name: '考勤',
  
          num: 8,
          text:'去往EHR系统审批列表页 >>',
        },
        {name: '入转调离', text:'去往ERR费控审批列表页 >>', num: 1},
        {name: '费控', text:'去往ERR费控审批列表页 >>', num: 2},
        {name: 'OA', text:'去往OA审批系统列表页 >>', num: 3},
      ],
      basiccost: [
        {name: '基础费用', routerTo: '', num: 1, title: '张三',time:"7:00--9:00", reason:"娃哈哈",num:2 },
        {name: '基础费用', routerTo: '', num: 1, title: '李四',time:"9：00--11:00", reason:"娃哈哈",num:2 },
        {name: '基础费用', routerTo: '', num: 1, title: '王五',time:"7:00--9:00", reason:"娃哈哈",num:2 },
        {name: '基础费用', routerTo: '', num: 1, title: '赵六',time:"9：00--11:00", reason:"娃哈哈",num:2 }
      ],
      Jurisdiction: [
        {name: '基础费用', routerTo: '', num: 1, title: '张三',time:"7:00--9:00", reason:"娃哈哈",num:3 },
         {name: '基础费用', routerTo: '', num: 1, title: '张三',time:"7:00--9:00", reason:"娃哈哈",num:3 },
          {name: '基础费用', routerTo: '', num: 1, title: '张三',time:"7:00--9:00", reason:"娃哈哈",num:3 }
      ],
      others: [
        {name: '基础费用', routerTo: '', num: 1, title: '张三',time:"7:00--9:00", reason:"娃哈哈",num:4},
        {name: '基础费用', routerTo: '', num: 1, title: '张三',time:"7:00--9:00", reason:"娃哈哈",num:4},
        {name: '基础费用', routerTo: '', num: 1, title: '张三',time:"7:00--9:00", reason:"娃哈哈",num:4},
        {name: '基础费用', routerTo: '', num: 1, title: '张三',time:"7:00--9:00", reason:"娃哈哈",num:4},
        {name: '基础费用', routerTo: '', num: 1, title: '张三',time:"7:00--9:00", reason:"娃哈哈",num:4},
      ],
      active: 0,
      subactive: 0,
      left: 21,
      subleft: 140,
      dropVisible: false,
      height1:0,
      height2:0,
      height3:0,
      subleft: 140,
      dropVisible: false,
      checked:"checked",
      index:0,
      //total:12,
      total1:1,
      total2:2,
      total3:3,
      total4:4,
      total5:5,
      total6:6,
      total7:7
    }
  },
  computed: {
    height: function() {
      if(this.active===1) return 47
      else return 0
    }
  },
  methods: {
    basic(index){
      this.height1=60;
      this.active=1;
    },
    just(index){
      this.height2=60;
      this.active=2;
    },
    other(index){
      this.height3=60;
      this.active=3;
    },
    push(){
      this.$router.push("/")
    }
  },
  computed:{
    total:function(){
      return this.total1+this.total2+this.total3+this.total4+this.total5+this.total6+this.total7
    },

  },
  mounted: function (){
    if(this.$router.history.current.name==="leakcardHistory"){
      this.tabChanged(1)
      this.subtabChanged(0)
    }
    else if (this.$router.history.current.name==="errandHistory"){
      this.tabChanged(1)
      this.subtabChanged(3)
    }
  }
}
</script>

<style lang="scss">
// @import "@/assets/css/variables.scss";
// .tabs {
//   .el-dropdown {
//     height: 58px;
//     margin: 0;
//     padding: 0;
//     color: $secondary;
//     .el-dropdown-link {
//       display: inline-block;
//       height: 100%;
//       padding-top: 20px;
//     }
//     .arrowDown:before {
//       content: "";
//       position: absolute;
//       top: 28px;
//       right: -10px;
//       height: 0;
//       width: 0;
//       border-top: 7px solid #cccccc;
//       border-bottom: 7px solid transparent;
//       border-left: 6px solid transparent;
//       border-right: 6px solid transparent;
//     }
//     .arrowUp:before {
//       content: "";
//       position: absolute;
//       top: 21px;
//       right: -10px;
//       height: 0;
//       width: 0;
//       border-bottom: 7px solid #cccccc;
//       border-top: 7px solid transparent;
//       border-left: 6px solid transparent;
//       border-right: 6px solid transparent;
//     }
//   }
// }
// .dropdownMenu {
//   height: 159px;
//   width: 205px;
//   left: 210px !important;
//   .popper__arrow {
//     left: 60px !important;
//   }
//   .el-dropdown-menu__item {
//     height: 34px;
//     padding: 0;
//   }
//   .el-dropdown-menu__item:hover {
//     color: $primary;
//     background-color: rgba(245,247,250,1);
//   }
// }
//   .dropRouter {
//     display: block;
//     width: 100%;
//     padding: 0 30px;
//       text-decoration: none;
//       color: $secondary;
//     }
//   .dropRouter:hover {
//     color: $primary;
//   }
</style>

<style lang="scss" scoped>
  @import "@/assets/css/variables.scss";
  @import "@/assets/css/layout.scss";
  .tabs {
    position: relative;
    width: 100%;
    background-color: #fff;
    ul {
      height: 100%;
      padding-left: 0;
      margin:0;
      border-bottom: 1px solid #e6e6e6;
    }
    .tab {
      // display: inline-block;
      float: left;
      position: relative;
      height: 60px;
      width: 104px;
      list-style:none;
      line-height:60px;
      white-space:nowrap;
      text-align: center;
    }
    .tab:hover {
      cursor: pointer;
      .tips{
        display: block;
      }
    }
    .tabNum {
      color: $going;
    }
    .tips{
      width:190px; 
      height:30px; 
      border:1px solid #ebeef5; 
      position: absolute;
      top:-28px;
      border-radius: 4px;
      display:none;
      box-shadow: -2px 0 0 #e6e6e6, //左边阴影
      0 -2px 0 #f5f7fa, //顶部阴影
      0 2px 0 #cccccc, //底部阴影
      0 0 0 #c0c4cc; //右边阴影
    }
      /*倒置三角样式*/
    .arror{
      width:0; 
      height:0; 
      overflow:hidden; 
      border-width:8px; 
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
    .block{
      width:1200px;
      hight:100%;
      position: absolute;
      left: -520px;
      }
    .basiccost,.tilte{
      width:1200px;
      display:flex;
      left: -520px;
      line-height:60px;
      box-sizing:border-box;
      border-bottom: 10px solid #e6e6e6;
      border-top: 10px solid transparent;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      .el-checkbox{
        margin-left:120px;
      }
      span{
        width:220px;
      }
    }
    .just{
      position: relative;
      left:-100px;
    }
    .other{
       position: relative;
       left: -210px;
    }
  }
</style>
