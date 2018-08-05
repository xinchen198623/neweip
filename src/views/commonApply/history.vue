<template>
<div class="table-page">
  <div class='toOuterPage' v-if="active<9 && active!==0">
    <div class="link-box">
      <span class="tip">查看{{tabsParam[active].text}}申请，请打开</span>
      <a :target="tabsParam[active].target" :href="tabsParam[active].url" class="link">{{tabsParam[active].host}}系统 - {{tabsParam[active].title}}</a>
    </div>
  </div>
  <div class='table-content history' v-else-if="tabsParam[active].num > 0">
    <div v-loading="loading" style="min-height:510px;">
      <el-table
       v-show="!loading"
      :data="tableData"
      :row-class-name="tableRowClassName"
      style="width: 100%"
      empty-text=""
      @row-click="toDetailPage">
        <el-table-column
          prop="typeName"
          label="类型"
          :show-overflow-tooltip="true"
          width="210">
          <template slot-scope="scope">
            <div class="name-wrapper">
              <el-tag size="medium">{{ scope.row.typeName }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          header-align="left"
          align="left"
          prop="createAt"
          label="申请日期">
          <template slot-scope="scope">
            {{format(scope.row.createAt)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="comment"
          width="300"
          :show-overflow-tooltip="true">
          label="附件">
          <template slot-scope="scope">
            <div class="table-attachment" v-for="(item, index) in scope.row.generalApprovalAttachments" :key="index">
              <span @click.stop='openFile(item)'>{{item.fileName}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          header-align="left"
          align="left"
          prop="comment"
          width="300"
          :show-overflow-tooltip="true"
          label="备注">
        </el-table-column>
        <el-table-column
          header-align="left"
          align="left"
          width="150px"
          prop="state"
          label="状态"
          :formatter="stateDictionary">
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination" v-if="showPagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :total="totalNum"
        @current-change="changePage">
      </el-pagination>
    </div>
  </div>
  <!-- <div v-else class="empty-page" v-loading="loading"> -->
  <div v-else class="emptyPage">
    <div class="center-con">
      <img src="../../assets/img/table_empty.png"/>
      <p>暂无内容</p>
    </div>
  </div>
</div>
</template>

<script>
import {mapState} from 'vuex'
import * as api from '../../api/commonApply'
import date from '@hc/core/lib/date'

export default {
  data () {
    return {
      // loading: true,
      historyData: [], // 从接口拿到的数据
      tableData: [], // 接口数据格式化
      page: 1, // 当前页
      pageSize: 20, // 每页显示条数
      totalNum: 0, // 从接口获取的总条数
      typeMap: {
        basefee: 'basic',
        right: 'authIT',
        other: 'other'
      },
      loading: false,
      showPagination: false
    }
  },
  computed: {
  },
  components: {
  },
  props: {
    refresh:{
      type: Boolean
    },
    tabsParam: {
      type: Array
    },
    active: {
      type: Number,
      default: 0
    }
  },
  created () {
  },
  watch: {
    active: function(newVal,oldVal) {
      if(newVal>=9) {
        this.loading = true
        this.showPagination = false
        this.fetchData(this.typeMap[this.tabsParam[newVal].key])
        // setTimeout(()=>{this.fetchData(this.typeMap[this.tabsParam[this.active].key])},3000)

      }
    }
  },
  updated () {
    // 将面包屑传回给父组件
    this.$nextTick(() => {
      if(this.tabsParam[0].num==0 || this.totalNum==0){
        this.showEmpty = true
      }
    })
  },
  mounted () {
    if(this.active>=9) {
      this.loading = true
      this.fetchData(this.typeMap[this.tabsParam[this.active].key])
      // setTimeout(()=>{this.fetchData(this.typeMap[this.tabsParam[this.active].key])},3000)
    }
  },
  methods: {
    async fetchData (type) {
      // 获取历史申请数据
      try {
        const data = await api.getHistoryList(type)
        this.historyData = data
        console.log('table data',data)
        this.totalNum = data.length
        this.tableData = this.historyData.slice(0,this.pageSize)
        this.loading = false
        this.showPagination = true
        this.page=1
        // 申请人，申请日期，申请类型，备注
      } catch (err) {
        debuglog(err)
      }
    },
    tableRowClassName ({row, rowIndex}) {
      // 表格条纹控制
      if (rowIndex % 2 === 0) {
        return 'stripe'
      } else {
        return ''
      }
    },
    toDetailPage (row) {
      // 跳转到申请的详情页
      this.$router.push({path: '/commonApply/detail', query: {id: row.id}})
    },
    format (time) {
      // 时间类型转换
      return date.format(new Date(time), 'yyyy-MM-dd HH:mm')
    },
    changePage (newPage) {
      // 换页
      this.page = newPage
      let startNum = (this.page - 1) * this.pageSize
      let endNum = this.page * this.pageSize
      this.tableData = this.historyData.slice(startNum, endNum)
    },
    openFile(file) {
      let link = document.createElement('a')
      link.href = `/api/file/download?fileHash=${file.fileHash}&fileName=${file.fileName}`
      // link.target = '_blank'
      link.download = file.fileName
      link.click()
    },
    stateDictionary(state) {
      let stateStr = "";
      switch (state.state) {
        case "A":
          stateStr = "已批准";
          break;
        case "R":
          stateStr = "已拒绝";
          break;
        case "D":
          stateStr = "已撤回";
          break;
        case "I":
          stateStr = "审批中";
          break;
        case "S":
          stateStr = "已提交";
          break;
      }
      return stateStr;
    },
  }
}
</script>
<style lang="scss" scoped>
  @import '@/assets/css/common.scss';
  .el-tag{
    height:30px;
    max-width: 100%;
    text-align: center;
    background-color:#FAFAFA;
    border:1px solid $placeholder;
    color:$secondary;
    font-size: $contentSize;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .table-attachment {
    span {
      margin: 0 0 4px;
      color: $link;
      cursor: pointer;
    }
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .table-page {
    min-height: 510px;
    position: relative;
  }
  .link-box {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
  }
  .link-box .tip{
    display: block;
    margin-bottom: 14px;
    color: $secondary;
  }
  .link-box .link{
    font-size: 16px;
    color: $primary;
    text-decoration: underline;
    cursor: pointer;
  }
  .emptyPage .center-con{
    width: 15%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    text-align: center;
    img {
      width: 100%;
    }
  }
  .el-tooltip__popper.is-light {
    border-color: $primary !important;
  }
</style>
<style>
 .history .el-table__row{
    cursor: pointer;
  }
  .el-table .first-column .cell{
    padding-left: 60px;
  }
</style>

