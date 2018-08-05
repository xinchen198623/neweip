<template>
  <div class='errandHistory'>
    <div class="timeInfo">
      <div class="selectTime">
        <span>起止时间：</span>
        <el-date-picker
          v-model="selectedTime"
          type="daterange"
          @change="changeTime"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div class="errandCount">
        已公出总时长
        <span class="emphasis-text">{{errandCount}} 小时</span>
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
          prop="reason"
          label="公出事由">
        </el-table-column>
        <el-table-column
          header-align="left"
          align="center"
          prop="time"
          label="公出时间">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="duration"
          width="100"
          label="公出时长">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="type"
          width="100"
          label="公出类型">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="transport"
          width="100"
          label="交通工具">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="stay"
          width="100"
          label="是否住宿">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="location"
          width="120"
          label="公出地点">
          <template slot-scope="scope" class="tableSlot">
            <!-- <i class="el-icon-time"></i> -->
            <div class="locationArrow"></div>
            <div class="location">
              <span>{{scope.row.location.from}}</span>
              <span>{{scope.row.location.to}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="left"
          prop="status"
          width="150"
          label="当前状态">
          <template slot-scope="scope" class="tableSlot">
            <!-- <i class="el-icon-time"></i> -->
            <span class="dot" :class='[{"dot-red":scope.row.status=="已退回"},{"dot-grey":scope.row.status=="已撤回"},{"dot-yellow":scope.row.status=="待审批"||scope.row.status=="审批中"}]'></span>
            <span class="slot">{{scope.row.status}}</span>
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
      selectedTime: '',
      monthFormat: '',
      leakcardData: [],
      tableData: [
        {reason: '恒昌财富交互设计', time: '02-26 9:00 - 02-26 18:00', duration: '8小时', type:'日常事务', transport: '公交车', stay: '否',location: {from:'北京东城区',to:'北京西城区'}, status:'审批中'},
        {reason: '恒昌财富交互设计', time: '02-28 9:00 - 02-29 18:00', duration: '16小时', type:'紧急事务', transport: '出租车', stay: '是',location: {from:'北京东城区',to:'北京西城区'}, status:'已撤回'},
        {reason: '恒昌财富交互设计', time: '02-28 9:00 - 02-29 18:00', duration: '16小时', type:'紧急事务', transport: '出租车', stay: '是',location: {from:'北京东城区',to:'北京西城区'}, status:'已完成'}
      ],
      errandCount: 32,
      employeeId:'123456',
      page: 1,
      navlist: [
        {
          name: '权限/IT',
          path: 'businessHistory'
        }
      ]
    }
  },
  computed: {
  },
  components: {
    // tabs
  },
  watch: {
    // selectedTime: function (newVal, oldVal) {
    //   console.log('watch', oldVal, newVal)
    // }
  },
  updated () {
    // 将面包屑传回给父组件
    this.$emit('subNav', this.navlist)
  },
  mounted () {
    this.$emit('subNav', this.navlist)
    // let today = new Date()
    // this.selectedTime = today
    // this.monthFormat = date.format(today, 'yyyy-MM')
    // this.fetchData(this.employeeId, this.page, this.monthFormat)
    // // 月次数查询参数 yyyy-MM 年次数查询参数yyyy
    // // console.log(date.format(today, 'yyyy-MM'))
    // this.fetchMonthCount(this.monthFormat)
    // this.fetchYearCount(date.format(today, 'yyyy'))
  },
  methods: {
    // async fetchData (id, page, limit, month) {
    //   try {
    //     this.leakcardData = await api.getLeakcardData(id, page, limit,month)
    //     this.handleData()
    //     //console.log(this.leakcardData)
    //   } catch (err) {
    //     console.log(err)
    //   }
    // },
    // async fetchMonthCount (month) {
    //   try {
    //     this.monthCount = await api.getMonthCount(month)
    //   } catch (err) {
    //     console.log(err)
    //   }
    tableRowClassName ({row, rowIndex}) {
      if (rowIndex % 2 === 0) {
        return 'stripe'
      } else {
        return ''
      }
    },
    toDetailPage (row) {
      console.log(row)
      // this.$router.push({path: '/punchClock/detail',params: { date: row.id}})
    },
    changePage(newPage) {
      console.log('换页',newPage)
      // this.fetchData(this.employeeId, this.newPage, this.monthFormat)
    },
    changeTime(e) {
      console.log('changeTime',e)
      console.log(this.selectedTime)
    }
  }
}
</script>

<style lang="scss">
  @import '@/assets/css/common.scss';
  .errandHistory {
    .el-table {
      color: $secondary;
      .stripe {
        background-color: #FAFAFA;
      }
      thead {
        color: $secondary;
        .el-table_1_column_1 {
            padding-left: 50px;
        }
        .el-table_1_column_2 {
            padding-left: 20px;
        }
      }
      th {
        font-weight: 500;
      }
    }
    .el-date-editor .el-range-separator {
      padding: 0;
    }
  }
</style>

<style lang="scss" scoped>
  @import '@/assets/css/common.scss';
  .errandHistory {
    padding: 0 34px;
    color: $secondary;
    font-size: $contentSize;
    font-weight: normal;
  }
  .timeInfo {
    position: relative;
    height: 90px;
  }
  .selectTime {
    position: absolute;
    left: 0;
    top: 26px;
    span {
      width: 42px;
    }
  }
  .errandCount {
    position: absolute;
    top: 34px;
    right: 0;
    height: 20px;
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
    left: 50px;
  }
  .locationArrow{
    position: relative;
    display: inline-block;
    height: 37px;
    width: 12px;
    border-left: 4px solid #cccccc;
    border-bottom: 5px solid #cccccc;
    transform: skewY(-40deg);
    &:after {
      content: '';
      height: 8px;
      width: 4px;
      position: absolute;
      left: -4px;
      top: -4px;
      transform: skewY(40deg);
      background-color:#cccccc;
    }
  }
  .location {
    display: inline-block;
    span {
      display: block;
    }
  }
  .dot {
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 48px;
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
