<template>
  <div class='popover'>
    <el-popover
      placement="top-start"
      trigger="click"
      width="{widthSet[inde]}"
      v-if="item.day"
      v-model="visible">
      <!-- <div class="abnormal">
        <p>考勤异常：{{item.msg}}</p>
        <p style="margin-top:15px;">
          <span>打卡时间：</span>
          <span>{{item.start}}</span>
          -
          <span>{{item.end}}</span>
        </p>
      </div> -->
      <div class="abnormal" v-if="item.status===1">
        <!-- 考勤异常 -->
        <p v-if="item.abnormalNotes && item.abnormalNotes.length>0">
          <span v-for="(note,index) in item.abnormalNotes" :key="index">
            <span class="highlight">{{note}}</span>
          </span>
        </p>
        <p v-if="item.normalNotes && item.normalNotes.length>0">
          <span v-for="(note,index) in item.normalNotes" :key="index" class="normal-note">{{note}}</span>
        </p>
        <p v-if="item.txtStatus!==2">
          <span>打卡时间：</span>
          <span v-if="item.start" :class="{highlight:item.txtStatus===0}">{{item.start}}</span>
          <span v-if="item.txtStatus!==2">-</span>
          <span v-if="item.end" :class="{highlight:item.txtStatus===1}">{{item.end}}</span>
        </p>
        <el-row>
          <el-button class='button-popover' :disabled="confirmStatus==2 || !btnValid"><a target="view_window" :href="pageList[3].url" :target="pageList[3].target" class='linkActive' @click="visible = false">公出申请</a></el-button>
          <el-button class='button-popover' :disabled="confirmStatus==2 || !btnValid"><a target="view_window" :href="pageList[1].url" :target="pageList[1].target" class='linkActive' @click="visible = false">漏打卡申请</a></el-button>
          <el-button class='button-popover' :disabled="confirmStatus==2 || !btnValid"><a target="view_window" :href="pageList[0].url" :target="pageList[0].target" class='linkActive' @click="visible = false">休假申请</a></el-button>
        </el-row>
      </div>
      <!-- <div v-if="item.status==1" class="abnormal">
        考勤异常
        <p>
          <span class="highlight">{{detailData.msg}}</span>
          <span :class="{highlight:!detailData.tag}">{{detailData.start}}</span>
          -
          <span :class="{highlight:detailData.tag}">{{detailData.end}}</span>
        </p>
        <el-row>
          <el-button class='button-popover'>公出申请</el-button>
          <el-button class='button-popover'>漏打卡申请</el-button>
          <el-button class='button-popover'>休假申请</el-button>
        </el-row>
      </div> -->
      <!-- <div v-else-if="item.status==1" class="going">
        考勤正常
        <el-form ref='form' label-width="82px">
          <div class="item-with-line item-with-icon icon_check first-item-with-line steps">
            <span class='row-item'>{{detailData.name}}</span>
            <span class='row-item'>时间：{{detailData.date}} {{detailData.time}}</span>
            <span class='row-item'>原因：{{detailData.reason}}</span>
          </div>
          <div v-for="(item, index) in detailData.approverModels" class="item-with-line item-with-icon" :class='[{"icon_graypoint": item.status=="I"},{"icon_point": item.status=="S"},{"last-item-with-line": index==detailData.approverModels.length-1}]' :key="index">
            <span class='row-item' :class="{'disabled-text':item.statusStr=='待审批'}">{{item.approver.name}} {{item.statusStr}}</span>
          </div>
        </el-form>
      </div>
      <div v-else-if="item.status==2" class="success">
        审批完
        <p>{{detailData.msg}}：{{detailData.time}}</p>
        <p>时间：{{detailData.start}} 至 {{detailData.end}} </p>
        <p>原因：{{detailData.tag}}</p>
      </div>
      <div v-else-if="item.status==3" class="noData">
        数据未同步
        <p class="title">数据未同步</p>
        <p class="tag">请于打卡1个工作日之后查看</p>
        <el-row>
          <el-button class='button-popover'>公出申请</el-button>
          <el-button class='button-popover'>休假申请</el-button>
        </el-row>
      </div> -->
      <div v-else-if="item.offShift>0" class="holiday">
        <!-- <p>法定节假日</p> -->
        <el-button class='button-popover' :disabled="confirmStatus==2 || !btnValid"><a target="view_window" :href="pageList[2].url" :target="pageList[2].target" class='linkActive' @click="visible = false">加班申请</a></el-button>
      </div>
      <a slot="reference" class="slot">
        <slot></slot>
      </a>
    </el-popover>
  </div>
</template>

<script>
import date from '@hc/core/lib/date'
// import * as api from '../../api/attendance'
// import { gotoSitePage } from '../../utils/sso.js'
// import { setOurterPageUrl } from '../../utils/sso.js'

// kqsq
// let pageList = [
//   {text: '休假申请', type: '', name: '休假申请', key: 'xiuJiaShengQing', img: require('../../assets/img/xiujia.png'), isOuter: 1, url: ''},
//   {text: '漏打卡申请', type: '', name: '漏打卡申请', key: 'louDaKa', img: require('../../assets/img/ldksq.png'), isOuter: 1, url: ''},
//   {text: '加班申请', type: '', name: '加班申请', key: 'jiaBanShengQing', img: require('../../assets/img/jbsq.png'), isOuter: 1, url: ''},
//   {text: '公出申请', type: '', name: '公出申请', key: 'gongChuShenQing', img: require('../../assets/img/gcsq.png'),  isOuter: 1, url: ''}
// ]

export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    confirmStatus: {
      type: Number,
      required: true
    },
    btnValid: {
      type: Boolean,
      required: true
    },
    pageList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      // pageList
      visible: false,
    }
  },
  mounted () {
    // console.log(this.day)
    // this.fetchData(this.day)
    // this.initInfo();
  },
  methods: {
    // initInfo() {
    //   // console.log(this.pageList)
    //   setOurterPageUrl(this.pageList)
    // },
    isHoliday (day) {
      return date.isWeekend(new Date(day))
    },
    // toOuterPage (item) {
    //   gotoSitePage(item)
    // }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/common.scss';
.el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hover {
  color: #c0c4cc;
  border-color: #ebeef5;
}
</style>

<style lang="scss" scoped>
@import '@/assets/css/common.scss';
.el-popover {
  padding: 0;
  color: $secondary;
  box-sizing: border-box;
  -moz-box-sizing:border-box; /* Firefox */
  -webkit-box-sizing:border-box;
  .abnormal {
    // height: 141px;
    width: 344px;
    padding: 34px 0 30px;
    p {
      margin: 0;
      text-align: center;
      // text-indent: 40px;
      font-size: $headerSize;
      .highlight {
        color: #ff0000;
      }
    }
    .el-row {
      position: relative;
      top: 27px;
      width: 100%;
      margin: 0;
      height: 36px;
      text-align: center;
    }
  }
  .going {
    height: 291px;
    width: 279px;
    padding: 34px 0 0 37px;
    p {
      padding: 0 0 12px 21px;
      margin: 0;
    }
    .steps {
      .step {
        position: relative;
        box-sizing: border-box;
        border-left: 2px solid #cccccc;
        padding-bottom: 13px;
        .icon {
          position: absolute;
          left: -13px;
          top: -3px;
        }
      }
      .step:last-child {
        border-left-color: transparent;
      }
    }
  }
  .success {
    height: 151px;
    width: 354px;
    padding: 34px 21px 22px;
    p {
      margin: 0 0 12px 0;
      padding: 0;
    }
  }
  .holiday {
    height: 90px;
    width: 175px;
    padding: 25px 44px 29px;
  }
  .noData {
    height: 168px;
    width: 314px;
    padding: 29px 60px 33px;
    .title {
      width: 100%;
      padding: 0;
      margin: 0;
      font-size: $titleSize;
      color: $major;
      text-align: center;
    }
    .tag {
      width: 100%;
      padding: 0;
      margin: 4px 0 0;
      text-align: center;
    }
    .el-row {
      margin: 21px 0 0;
      padding: 0;
    }
  }
  .steps {
    span {
    line-height: 20px;
    padding-bottom: 12px;
  }
  }
}
/*-----*/
.popover {
  position: relative;
  height: 100%;
  span { display: block;height:100%;}
  .status {
    position: relative;
    left: -9.5px;
    margin-top: 50px;
    width:136px;
    height:28px;
    border-radius:13px;
    color: #fff;
    text-align: center;
    line-height: 28px;
  }
  // .status-going {
  //   background-color: $going;
  // }
  // .status-success {
  //   background-color: $success;
  // }
  .slot{
    display: block;
    width: 100%;
    height: 100%;
    padding: 0;
    border: none;
    border-radius: 0;
    font-weight: normal;
    text-align: left;
    background-color: transparent;
  }
}
.linkActive {
  display: inline-block;
  height: 36px;
  width: 87px;
  line-height: 36px;
  color: $secondary;
  font-size: $contentSize;
}
.linkActive:hover {
  color: $primary;
}
// .linkDisabled {
//   border-color: $minor;
//   pointer-events:none; 
//   cursor: not-allowed;
// }
.normal-note {
  display: block;
  color: $success;
}
</style>
