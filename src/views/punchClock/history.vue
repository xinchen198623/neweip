<template>
  <div class='leakcardPage'>
    <div class="monthInfo">
      <div class="selectMonth">
        <span>月份：</span>
        <el-date-picker
          v-model="selectedMonth"
          @change="changeMonth"
          type="month"
          placeholder="选择月">
        </el-date-picker>
      </div>
      <div class="leakCount">
        <div class="monthCount">本月漏打卡 <span class="emphasis-text">{{monthCount}} 次</span></div>
        <div class="yearCount">2018年漏打卡次数 <span class="emphasis-text">{{yearCount}} 次</span></div>
      </div>
    </div>
    <div class="table">
      <el-table
      :data="tableData"
      :row-class-name="tableRowClassName"
      style="width: 100%"
      @row-click="toDetailPage">
        <el-table-column
          header-align="center"
          align="center"
          prop="date"
          label="日期">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="time"
          label="打卡时间">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="leak"
          label="漏打卡时间">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="left"
          prop="status"
          label="当前状态">
          <template slot-scope="scope" class="tableSlot">
            <!-- <i class="el-icon-time"></i> -->
            <span class="dot" :class='[{"dot-red":scope.row.status=="已退回"},{"dot-grey":scope.row.status=="已撤回"},{"dot-yellow":scope.row.status=="待审批"||scope.row.status=="审批中"}]'></span>
            <span class="slot" style="margin-left: 10px">{{ scope.row.status }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="100"
        @current-change="changePage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import * as api from '../../api/history'
import date from '@hc/core/lib/date'

export default {
  data () {
    return {
      selectedMonth: '',
      monthFormat: '',
      leakcardData: [],
      tableData: [],
      monthCount: 0,
      yearCount: 0,
      employeeId:'123456',
      page: 1,
      navlist: [
        {
          name: '其他',
          path: 'punchClockHistory'
        }
      ]
    }
  },
  components: {
    // tabs
  },
  watch: {
    selectedMonth: function (newVal, oldVal) {
      console.log('watch', oldVal, newVal)
    }
  },
  updated () {
    // 将面包屑传回给父组件
    this.$emit('subNav', this.navlist)
  },
  mounted () {
    // 将面包屑传回给父组件
    this.$emit('subNav', this.navlist)

    let today = new Date()
    this.selectedMonth = today
    this.monthFormat = date.format(today, 'yyyy-MM')
    this.fetchData(this.employeeId, this.page, this.monthFormat)
    // 月次数查询参数 yyyy-MM 年次数查询参数yyyy
    // console.log(date.format(today, 'yyyy-MM'))
    this.fetchMonthCount(this.monthFormat)
    this.fetchYearCount(date.format(today, 'yyyy'))
  },
  methods: {
    async fetchData (id, page, limit, month) {
      try {
        this.leakcardData = await api.getLeakcardData(id, page, limit,month)
        this.handleData()
        //console.log(this.leakcardData)
      } catch (err) {
        console.log(err)
      }
    },
    async fetchMonthCount (month) {
      try {
        this.monthCount = await api.getMonthCount(month)
      } catch (err) {
        console.log(err)
      }

    },
    async fetchYearCount (year) {
      try {
        this.yearCount = await api.getYearCount(year)
      } catch (err) {
        console.log(err)
      }
    },
    tableRowClassName ({row, rowIndex}) {
      if (rowIndex % 2 === 0) {
        return 'stripe'
      } else {
        return ''
      }
    },
    toDetailPage (row) {
      console.log(row)
      this.$router.push({path: '/punchClock/detail',params: { date: row.id}})
    },
    handleData () {
      let data = this.leakcardData
      let array = []
      for(let i=0; i<data.length; i++) {
        let item = {}
        item.date = data[i].leadCardDate
        item.id = data[i].id
        if(!data[i].punchCardStartDate){
          item.leak = '9:00'
          item.time = '-' + data[i].punchCardEndDate
        }
        else if (!data[i].punchCardEndDate){
          item.leak = '18:00'
          item.time = data[i].punchCardStartDate + "-"
        }
        switch(data[i].status)
        {
          // A:已批准;C:已取消;D:已退回;I:待审批;S:已提交
        case 'A':
          item.status = '已批准'
          break;
        case 'C':
          item.status = '已撤回'
          break;
        case 'D':
          item.status = '已退回'
          break;
        case 'I':
          item.status = '待审批'
          break;
        case 'S':
          item.status = '已提交'
          break;
        }
        array.push(item)
      }
      console.log(array)
      this.tableData = array
      this.tableData = [] //暂时设为空
    },
    changePage(newPage) {
      console.log('换页', newPage)
      this.fetchData(this.employeeId, this.newPage, this.monthFormat)
    },
    changeMonth(newMonth) {
      console.log(newMonth)
      // this.selectedMonth = newMonth
      this.monthFormat = date.format(today, 'yyyy-MM')
      this.fetchData(this.employeeId, this.newPage, this.monthFormat)
    }
  }
}
</script>

<style lang="scss">
  @import "@/assets/css/common.scss";
  .leakcardPage {
    .el-table {
      color: $secondary;
      .stripe {
        background-color: #FAFAFA;
      }
      thead {
        color: $secondary;
      }
      th {
        font-weight: 500;
      }
    }
  }
</style>

<style lang="scss" scoped>
  @import '@/assets/css/common.scss';
  .leakcardPage {
    padding: 0 34px;
    color: $secondary;
    font-size: $contentSize;
    font-weight: normal;
  }
  .monthInfo {
    position: relative;
    height: 90px;
  }
  .selectMonth {
    position: absolute;
    left: 0;
    top: 26px;
    span {
      width: 42px;
    }
  }
  .leakCount {
    position: absolute;
    top: 34px;
    right: 0;
    height: 20px;
  }
  .monthCount {
    display: inline-block;
    margin-right: 19px;
  }
  .yearCount {
    display: inline-block;
  }
  .table {
    border:1px solid #EBEEF5;
    border-bottom: none;
  }
  .pagination {
    position: relative;
    height: 62px;
    .el-pagination {
      position: absolute;
      right: -5px;
      top: 34px;
      padding: 0;
    }
  }
  .el-table__row td:last-child .slot{
    position: relative;
    left: 106px;
  }
  .dot {
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 114px;
    margin-top:-3.5px;
    height: 7px;
    width: 7px;
    border-radius: 50%;
    background-color: $primary;
  }
  .dot-red {
    background-color: $alert;
  }
  .dot-yellow {
    background-color: $going;
  }
  .dot-grey {
    background-color: #999999;
  }
</style>
