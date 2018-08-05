<template>
    <!-- 每个模板定义自己的class，方便样式的隔离和控制 -->
    <div class="rule">
      <div class="modal" @click="switchRule" v-show="isShowRule">
      </div>
      <div class="rule-btn" @click="switchRule">制度</div>
      <div class="modal-content rule-content" :class="{ show: isShowRule }">
        <h3 class="title">{{ruleList.title}}</h3>
        <ul class="rule-list">
          <li v-for="(item,index) in ruleList.list" :key="index" :class="{active: index == isShowRuleIndex}" @click="switchRuleDetail(index)">
            <div class="rule-title">{{item.subTitle}}<span class="arrow-box"></span></div>
            <p v-for="(list, index) in item.desList" :key="index" class="rule-detail">{{list}}</p>
          </li>
        </ul>
      </div>
    </div>
</template>

<script>
export default {
  props: {
    ruleList: {
      type: Object,
      required: true
    }
  },
  data: function () {
    return {
      isShowRule: false,
      isShowRuleIndex: 0
    }
  },
  methods: {
    switchRule () {
      this.isShowRule = !this.isShowRule
    },
    switchRuleDetail (index) {
      // this.isShowRuleIndex === index ? this.isShowRuleIndex = -1 : this.isShowRuleIndex = index
      this.isShowRuleIndex = index
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/css/variables.scss';
  /**制度**/
  .rule{
  }
  .rule-btn{
    position: absolute;
    top: 65px;
    right: 0;
    z-index: 1000;
    width: 74px;
    height: 34px;
    padding-left: 17px;
    border-top-left-radius: 17px;
    border-bottom-left-radius: 17px;
    font-size: $contentSize;
    color: #fff;
    line-height: 34px;
    background: #F39C12 url('../assets/img/icon_rule_arrow.png') right 12px center no-repeat;
    background-size: 13px 13px;
    transition: all .5s linear;
    -moz-transition: all .5s linear;
    -webkit-transition: all .5s linear;
    -o-transition: all .5s linear;
  }
  .rule-btn.show{
    right: 373px;
  }
  .modal{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100000;
    background-color: rgba(0,0,0,.5);
    transition: display .5s linear;
    -moz-transition: display .5s linear;
    -webkit-transition: display .5s linear;
    -o-transition: display .5s linear;
  }
  .rule-content{
    position: fixed;
    top: 0;
    right: -373px;
    z-index: 100001;
    width: 373px;
    height: 100%;
    padding: 50px 29px 50px 33px;
    background-color: #fff;
    overflow-y: auto;
    transition: all .3s linear;
    -moz-transition: all .3s linear;
    -webkit-transition: all .3s linear;
    -o-transition: all .3s linear;
  }
  .rule-content.show{
    right: 0;
  }
  .rule-content .title{
    font-size: $headerSize;
    color: $major;
    line-height: 1.4;
    padding-bottom: 10px;
    border-bottom: 1px solid #EBEEF5;
    margin: 0;
  }
  .rule-content .rule-list{
    list-style: none;
    padding-left: 0;
    margin: 0;
  }
  .rule-content .rule-list>li{
    padding: 11px 0;
    border-bottom: 1px solid #EBEEF5;
  }
  .rule-content .rule-list .rule-title{
    position: relative;
    padding-right: 10px;
    font-size: $subtitleSize;
    color: $secondary;
    line-height: 22px;
  }
  .rule-content .rule-list .rule-title .arrow-box{
    display: block;
    position: absolute;
    top:0;
    right: 0;
    margin: 5px 0;
    border-left: 7px solid #D8D8D8;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-right: 0;
    transition: all .2s linear;
    -moz-transition: all .2s linear;
    -webkit-transition: all .2s linear;
    -o-transition: all .2s linear;
  }
  .rule-content .rule-list .rule-detail{
    display: none;
    font-size: $contentSize;
    color: $secondary;
    line-height: 20px;
    margin: 9px 0 0;
    transition: all .3s ease-in-out;
    -moz-transition: all .3s ease-in-out;
    -webkit-transition: all .3s ease-in-out;
    -o-transition: all .3s ease-in-out;
  }
  .rule-content .rule-list>li.active .rule-title{
    color: $primary;
  }
  .rule-content .rule-list>li.active .rule-title .arrow-box{
    border-left-color: $primary;
    transform:rotate(90deg);
    -ms-transform:rotate(90deg);
    -moz-transform:rotate(90deg);
    -webkit-transform:rotate(90deg);
    -o-transform:rotate(90deg);
    right: 2px;
  }
  .rule-content .rule-list>li.active .rule-detail{
    display: block;
  }
  .rule-content .rule-list .rule-title:hover{
    color: $primary;
  }
  .rule-content .rule-list .rule-title:hover .arrow-box{
    border-left-color: $primary;
  }
</style>
