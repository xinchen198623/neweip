<template>
  <div class="attendancePage">
    <breadcrumb :breadlist="navlist"></breadcrumb>
    <div  class='content'>
      <el-row>
        <el-col :span='1'><span class='el-vertial-cell'>月份：</span></el-col>
        <el-col :span='5'>
          <el-date-picker
            :editable="false"
            :clearable="false"
            v-model="currentDate"
            @change="monthChanged"
            value-format="yyyy-MM"
            type="month"
            placeholder="选择月">
          </el-date-picker>
        </el-col>
      </el-row>
      <el-row class='margin-row'>
        <span class='el-vertial-cell count-bar' v-if="vacation>0">休假：{{vacation}}天</span>
        <span class='el-vertial-cell count-bar' v-if="leakage>0">漏打卡：{{leakage}} 次</span>
        <span class='el-vertial-cell count-bar' v-if="leave>0">公出：{{leave}} 次</span>
        <span class='el-vertial-cell count-bar' v-if="absent>0">旷工：{{absent}} 天</span>
        <span class='el-vertial-cell count-bar' v-if="late>0">迟到：{{late}} 次</span>
        <span class='el-vertial-cell count-bar' v-if="late>0">迟到：{{late}} 次</span>
        <span class='el-vertial-cell count-bar'>{{currentYear}}年漏打卡次数：{{leakage_total}} 次</span>
        <span class='el-vertial-cell count-bar'>
          <el-popover
            placement="right"
            offset="100"
            trigger="hover">
            <div class="countPopover">每年漏打卡不得超过<span class='emphasis-text'> 20次</span></div>
            <span slot="reference" class="icon-info"></span>
          </el-popover>
        </span>
        <div class='float-right' style='margin-right: 33px'>
          <span class='el-vertial-cell count-bar' v-if="abnormalCount===0">考勤正常</span>
          <span class=''>
            <el-button class="checkBtn" @click="confirm" :disabled="!btnValid" :class="{checkBtnInvalid:!btnValid}">{{checkBtnTxt}}</el-button>
          </span>
        </div>
      </el-row>
      <el-row class='margin-row'>
        <div class='calendar'>
          <div class='header'>
            <span class='header-cell'>星期一</span><span class='header-cell'>星期二</span><span class='header-cell'>星期三</span>
            <span class='header-cell'>星期四</span><span class='header-cell'>星期五</span><span class='header-cell'>星期六</span><span class='header-cell'>星期日</span>
          </div>
          <div class='body'>
            <span v-for='(item,index) in calendarData' :key='index' :class='["body-cell", {"abnormal-cell": item && (item.status === 1)},{"weekend-cell": (index%7===5 || index%7===6) || calendarData[index].offShift>0}]'>
              <!-- 考勤异常 -->
              <popover :item="item" :confirmStatus="confirmStatus" :btnValid="btnValid" :pageList="popoverPageList" v-if="item.status===1">
                <span class='date'>{{item.day}}</span>
                <span class='status'>考勤异常</span>
              </popover>
              <!-- 公休日 -->
              <popover :item="item" :confirmStatus="confirmStatus" :btnValid="btnValid" :pageList="popoverPageList" v-else-if="item.offShift>0">
                <span class='date'>{{item.day}}</span>
                <!-- <span class='status' :class='[{"status-success": item.status===0}]' v-if="item.msg">{{item.msg}} (已批准)</span> -->
                <span v-if="item.normalNotes && item.normalNotes.length>0">
                  <span v-for="(note,index) in item.normalNotes" :key="index" :class='[{"status-success": item.status===0},{"multi-status":item.normalNotes.length>1}]' class="status">{{note}}(已批准)</span>
                </span>
              </popover>
              <!-- 考勤正常 -->
              <span v-else>
                <span class='date'>{{item.day}}</span>
                <span v-if="item.normalNotes && item.normalNotes.length>0">
                  <span v-for="(note,index) in item.normalNotes" :key="index" :class='[{"status-success": item.status===0},{"multi-status":item.normalNotes.length>1}]' class="status">{{note}}(已批准)</span>
                </span>
                <!-- <span class='status' :class='[{"status-success": item.status===0}]' v-if="item.msg">{{item.msg}} (已批准)</span> -->
              </span>
            </span>
          </div>
        </div>
      </el-row>
      <div v-if="dialogVisible" class="dialog">
        <el-dialog
        title="考勤异常"
        :visible.sync="dialogVisible"
        width="390px"
        center>
          <!-- <div class="dialog-header" slot="title">考勤异常</div> -->
          <span>有<span class="highlight-abnormal">{{abnormalCount}}天</span>考勤异常/未通过审批，若不及时处理，将被当做<span class="highlight-abnormal">旷工</span>处理</span>
          <span slot="footer" class="dialog-footer">
            <el-button  class="button-popover" @click="attendanceConfirm">直接提交</el-button>
            <el-button type="primary" @click="dialogVisible = false">立即处理</el-button>
          </span>
        </el-dialog>
      </div>
      <!-- <div v-else class="dialog">
        <el-dialog
        title="确认考勤?"
        :visible.sync="dialogVisible"
        width="30%"
        center>
          <span>本月汇总：漏打卡<span class="highlight-normal">{{leakage}}次</span>、休假<span class="highlight-normal">{{vacation}}天</span></span>
          <span slot="footer" class="dialog-footer">
            <el-button class="button-popover" @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="confirm">确认考勤</el-button>
          </span>
        </el-dialog>
      </div> -->
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import date from '@hc/core/lib/date'
import * as api from '@/api/attendance'
import popover from './popover.vue'
import breadcrumb from '@/components/breadcrumb.vue'
import { setOurterPageUrl } from '../../utils/sso.js'

// popover页跳转路由
let popoverPageList = [
  {text: '休假申请', type: '', name: '休假申请', key: 'xiuJiaShengQing', img: require('../../assets/img/xiujia.png'), isOuter: 1, url: ''},
  {text: '漏打卡申请', type: '', name: '漏打卡申请', key: 'louDaKa', img: require('../../assets/img/ldksq.png'), isOuter: 1, url: ''},
  {text: '加班申请', type: '', name: '加班申请', key: 'jiaBanShengQing', img: require('../../assets/img/jbsq.png'), isOuter: 1, url: ''},
  {text: '公出申请', type: '', name: '公出申请', key: 'gongChuShenQing', img: require('../../assets/img/gcsq.png'),  isOuter: 1, url: ''}
]

export default {
  data () {
    return {
      // currentYear: '',
      currentDate: '',
      vacation: 0, //休假天数
      leave: 0, // 公出次数
      leakage: 0, // 漏打卡次数
      absent: 0, // 旷工天数
      late: 0, // 迟到次数
      leakage_total: 0,
      days:[],
      attendanceData: [],
      dialogVisible: false,
      btnValid: true, // [确认考勤]按钮状态 false:置灰 true:蓝色
      compositeData: {},
      abnormalCount: 0, //异常天数
      confirmStatus: 0, //确认考勤状态(0:未开始;1:确认中;2已确认)
      navlist: [
        {
          name: '考勤查询',
          path: '/attendance'
        }
      ],
      checkBtnTxt: '确认考勤',
      popoverPageList
    }
  },
  components: {
    popover,
    breadcrumb
  },
  watch: {
    $route :function(to,from){
      this.fetchData()
    },
    userId: function(newValue, oldValue){
      if(newValue && newValue.length>0){
        this.fetchData()
      }
    },
  },
  computed: {
    currentYear: function () {
      return this.currentDate.split('-')[0]
    },
    calendarData: function () {
      let existData = this.attendanceData
      let monthLength = date.getDaysInMonth(new Date(this.currentDate))
      let currentMonth = new Date(this.currentDate).getMonth()+1
      let firstDay = new Date(this.currentYear+'-'+(currentMonth<10?'0'+currentMonth:currentMonth)+'-01').getDay()
      firstDay = firstDay!==0?firstDay-1:6

      let existDay=[]
      for(let item of existData){
        existDay.push(item.day)
      }
      let array = []
      for(let i=1;i<=monthLength;i++) {
        if(existDay.indexOf(i)>=0){
          array[i-1] = existData.shift()
        } else {
          array.push({day: i})
        }
      }
      let calendarData = new Array(firstDay).fill({}).concat(array)
      // this.checkBtnTxt = '确认考勤'
      return calendarData
    },
    ...mapState({
      userId: state => state.user.userAccount
    }),
  },
  mounted () {
    this.currentDate = this.$route.query.month?this.$route.query.month:date.format(new Date(), 'yyyy-MM')
    // this.currentYear = this.currentDate.split('-')[0]
    this.fetchData()
    this.initPopoverPagRouter()
  },
  methods: {
    async fetchData () {
      // 获取当月考勤及参数
      // console.log('fetchData',this.userId)
      if(this.userId && this.userId.length>0){
        try {
          let data = await api.getCompositeInfo(this.userId,this.currentDate)
          console.log('data:',data)
          this.late = data.lateCount + data.leaveCount //迟到次数=迟到次数+早退休次数
          this.absent = data.absentDays // 旷工天数
          this.leave = data.publicOutCount // 公出次数
          this.vacation = data.vacationCount// 请假天数
          this.leakage = data.missCount //漏打卡次数
          this.leakage_total = data.missCountYear //年度漏打卡次数
          this.days = data.days //每日出勤table
          // console.log(typeof data.confirmStatus)
          this.btnValid = (data.confirmStatus===1?true:false) //考勤确认按钮状态
          this.confirmStatus = data.confirmStatus //确认考勤状态(0:未开始;1:确认中;2已确认)
          if(this.confirmStatus===2){
            console.log('等2')
            this.checkBtnTxt = '已确认'
            console.log(this.checkBtnTxt)
          } else {
            this.checkBtnTxt = '确认考勤'
          }
          this.handleTable(this.days)
        } catch (err){
          // console.warn(err)
          debuggerLog(err)
        }
      }
    },
    async attendanceConfirm () {
      // console.log('考勤确认')
      //考勤确认
      this.dialogVisible = false
      try {
        let res = await api.attendanceConfirm(this.userId, this.currentDate.split('-').join(''))
        console.log(res)
        if(res===1){
          console.log('考勤确认成功')
          // this.btnValid = false
          // this.checkBtnTxt = '已确认'
          this.fetchData()
        } else {
          console.log('考勤确认失败')
          this.$message.error('考勤确认失败，请重新确认考勤')

        }
      } catch(err) {
        // console.warn(err)
        debuggerLog(err)
      }
    },
    confirm () {
      if(this.abnormalCount===0){
        // 如果考勤正常直接提交
        this.attendanceConfirm()
      } else {
        // 不正常显示弹窗
        this.dialogVisible = true
      }
    },
    handleTable (table) {
      //考勤状态status 0:正常 1:异常 2:未同步
      let attendanceData = []
      let abnormalCount = 0 // 考勤异常天数
      for(let i=0;i<table.length;i++){
        let data = {}
        data.day = parseInt(table[i].date.split(' ')[0].split('-')[2])

        data.start = table[i].punchBegin?table[i].punchBegin.split(' ')[1].substring(0,5):''
        data.end = table[i].punchEnd?table[i].punchEnd.split(' ')[1].substring(0,5):''

        // 判断公休 >0为公休日
        // data.offShift = table[i].offShift>0?true:false
        data.offShift = table[i].offShift

        data.abnormalNotes = table[i].abnormalNotes
        let abnormalString = data.abnormalNotes?data.abnormalNotes.join(''):''
        if(abnormalString.indexOf('迟到')>=0) {
          // 第一个时间标红
          data.txtStatus = 0
        } else if (abnormalString.indexOf('早退')>=0) {
          // 第二个时间标红
          data.txtStatus = 1
        } else if (abnormalString.indexOf('旷工')>=0 && data.start.length===0 && data.end.length===0) {
          // 横杠不显示
          data.txtStatus = 2
        } else {
          // 正常显示字体颜色
          data.txtStatus = 3
        }
       
        // console.log(normalNotes)

        // console.log(table[i].hpsStauts)
        if(table[i].hpsStauts=='Y'){
          // 正常
          data.status = 0
        } else if(table[i].hpsStauts=='N'){
          // 异常
          data.status = 1
          abnormalCount++
        }
        else {
          // 还没有这个情况
          data.status = 2
        }
        //正常notes处理
        data.normalNotes = table[i].normalNotes?table[i].normalNotes:[]
        if(data.status===0){
          let normalNotes = []
          for(let i=0;i<data.normalNotes.length;i++) {
            normalNotes.push(data.normalNotes[i].split(':')[0])
          }
          data.normalNotes = normalNotes
        }

        attendanceData.push(data)
        // console.log(data)
      }
      this.attendanceData = attendanceData
      this.abnormalCount = abnormalCount
      // console.log('attendanceData:',attendanceData)
    },
    monthChanged: function() {
      this.$router.push({path:'/attendance',query:{month: this.currentDate}})
    },
    initPopoverPagRouter() {
      // popover路由初始化
      setOurterPageUrl(this.popoverPageList)
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/variables.scss';
.attendancePage {
  .el-dialog--center {
    .el-dialog__header {
      padding-top: 36px;
    }
    .el-dialog__body {
      text-align: center;
      padding: 15px 58px 18px;
      color: $secondary;
    }
    .el-dialog__footer {
      padding:10px 20px 25px;
    }
  }
//   .abnormalDialog {
//   .el-dialog__title {
//     position: relative;
//     color: $major;
//   }
//   .el-dialog__title:after {
//     content: "";
//     position: absolute;
//     top: 0;
//     left: -36px;
//     height: 28px;
//     width: 28px;
//     background: url(../../assets/img/icon_alert.png);
//     background-size: 100% 100%;
//   }
// }
  .el-dialog__title {
    position: relative;
    color: $major;
  }
  .el-dialog__title:after {
    content: "";
    position: absolute;
    top: 0;
    left: -36px;
    height: 28px;
    width: 28px;
    background: url(../../assets/img/icon_alert.png);
    background-size: 100% 100%;
  }
  .el-poper {
    padding: 0;
    height: 48px;
  }
}
</style>
<style lang="scss" scoped>
@import '@/assets/css/common.scss';

.dialog {
  .highlight-abnormal {
      color: #ff0000;
    }
  .highlight-normal {
    color: $going;
  }
  .el-button {
    width: 87px;
    height: 36px;
    padding: 0;
  }
  .el-button--primary {
    color: #fff;
    background-color: $primary;
    border-color: $primary;
  }
}
.abnormal-cell {
  background-color: rgba($alert, .3);
  .status {
    color: red;
    background-color: $alert;
  }
  .status-going {
    background-color: $going;
  }
  .status-success {
    background-color: $success;
  }
}

.checkBtn {
  height: 40px;
  width: 125px;
  // position: relative;
  // right: 33px;
  background-color: $primary;
  color: #ffffff;
  font-weight: normal;
  border: none;
}
.checkBtnInvalid {
  background-color: #d3d3d3;
  color: #ffffff;
  &:hover {
    border-color: #d3d3d3;
    background-color: #d3d3d3;
    color: #ffffff;
  }
}

.calendar {
  font-size: 0px;
  .header {
    background-color: #FAFAFA;
    border: 1px solid #EBEEF5;
    display: inline-block;
    .header-cell {
      font-size: $contentSize;
      width: 161.4px;
      height: 50px;
      line-height: 50px;
      display: inline-block;
      text-align: center;
    }
  }
  .body {
    border-left: 1px solid #EBEEF5;
    .body-cell {
      font-size: $contentSize;
      width: 161.5px;
      height: 136px;
      display: inline-block;
      vertical-align: top;
      // padding: 15px 20px;
      border-right: 1px solid #EBEEF5;
      border-bottom: 1px solid #EBEEF5;
      span { display: block;}
      .date {
        padding: 15px 0 0 20px; 
      }
      .status {
        // position: absolute;
        // bottom: 15px;
        margin: 50px auto 0;
        width:136px;
        height:28px;
        border-radius:13px;
        color: #fff;
        text-align: center;
        line-height: 28px;
      }
      .multi-status {
        margin-top: 5px;
      }
      .status-going {
        background-color: $going;
      }
      .status-success {
        background-color: $success;
      }
      .el-button {
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
    .weekend-cell {
      background-color: #fafafa;
    }
    .normal-cell {
      background-color: #fff;
    }
  }
}
.countPopover {
  left: 100px;
  // height: 30px;
  width: 185px;
  padding: 0 0 0 17px;
  font-size: 13px;
  // line-height: 30px;
  .emphasis-text {
    margin-left: 0;
  }
}
.count-bar {
  line-height: 56px;
  margin-right: 25px;
}
.icon-info {
  display: inline-block;
  width: 14px;
  height: 14px;
  margin: 0 0 -2px -14px;
  cursor: pointer;
  background: url(../../assets/img/icon_info.png);
  background-size: 100% 100%;
}
</style>
