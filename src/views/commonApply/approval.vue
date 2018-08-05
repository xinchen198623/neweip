<template>
  <div v-show="!loading">
    <div class="table-content" v-if="!isEmpty">
      <div class="table-top-bar" v-if="$route.query.key === 'right'">
        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
        <el-button type="primary" v-if="multipleSelection.length > 0" class="button-primary batch-btn" @click="addApprovalByList">批量审批</el-button>
        <el-button type="primary" v-else class="button-primary disabled batch-btn">批量审批</el-button>
      </div>
      <div v-else class="gap">
      </div>
      <div class="table">
        <el-table
        ref="table"
        :show-header="false"
        :highlight-current-row="false"
        empty-text="暂无审批数据"
        :stripe="isStripe"
        :data="filterTableData"
        style="width: 100%;"
        @selection-change="handleSelectionChange">
          <el-table-column type="expand">
            <template slot-scope="props">
              <div class="table-expand-top">
                <div class="subject"><span>{{ props.row.createByName }}</span><span>{{ props.row.typeName }}</span></div>
                <div class="others clearfix">
                  <div class="others-content">
                    <span>申请时间：{{ formatDate(0, 0, props.row.createAt)  }}</span>
                  </div>
                  <div class="others-content">
                    <div class="attachment" v-if="props.row.generalApprovalAttachments && props.row.generalApprovalAttachments.length">
                      <div class="attachment-content">附件：</div>
                      <div class="attachment-content">
                        <a href="" v-for="(file, fileIndex) in props.row.generalApprovalAttachments"
                           @click.prevent="fileDownload(file)"  :key="fileIndex">{{ file.fileName }}</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <el-form class="table-expand-flow" :model="props.row" ref="formApproval" :rules="formRules" :validate-on-rule-change="true">
                <div v-for="(item, index) in props.row.generalApprovalHistoryDaos" :key="index" class="item-with-line first-item-with-long-line item-with-icon icon_check">
                  <div class="state-box">
                    <h3>{{item.approverName + ' ' + actionMap[item.action]}}</h3>
                    <p>时间：{{formatDate(0, 0, item.createAt)}}</p>
                  </div>
                </div>
                <div class="item-with-line last-item-with-line item-with-icon icon_point">
                  <div class="state-box">
                    <h3>{{approver}} 审批中</h3>
                  </div>
                  <el-form-item label="" prop="reason">
                    <el-input type="textarea" :maxlength="500" rows="4" v-model="props.row.reason" :placeholder="formRules.reason[0].required ? '拒绝原因' : '审批意见'"></el-input>
                    <label style="font-size: 12px; color: #F39C12;position: absolute; bottom: -5px;right: 20px;" v-if="props.row.reason.length >= 500">最多可输入500字</label>
                  </el-form-item>
                  <div class="upload" v-if="['PROOF_OF_INCOME', 'INCUMBENCY', 'INTERNSHIP_PROVE'].indexOf(props.row.type) !== -1">
                  <!--<div class="upload" v-if="true">-->
                    <upload :ref="props.row.id" :fileList="[]" @updateFiles="updateFiles(props)"></upload>
                  </div>
                  <el-form-item>
                    <el-button size="medium" type='primary' class="button-medium-primary" @click="addSingleApproval(props, 'AGREE')">批准</el-button>
                    <el-button size="medium" type="primary" class="button-medium-orange" @click="addSingleApproval(props, 'REJECTBACK')" v-if="props.row.generalApprovalHistoryDaos && props.row.generalApprovalHistoryDaos.length">驳回到上一级</el-button>
                    <el-button size="medium" type="danger" class="button-medium-danger" @click="addSingleApproval(props, 'REJECT')">拒绝</el-button>
                  </el-form-item>
                </div>
              </el-form>
            </template>ID
          </el-table-column>
          <el-table-column
            type="selection"
            width="55" v-if="$route.query.key === 'right'">
          </el-table-column>
          <el-table-column
            header-align="center"
            align="left"
            prop="typeName"
            :show-overflow-tooltip="true"
            label="费用类型">
            <template slot-scope="scope">
              <el-tag
                type="success"
                class="type-tag"
                disable-transitions>{{scope.row.typeName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="left"
            prop="createByName"
            label="申请人">
          </el-table-column>
          <el-table-column
            header-align="center"
            align="left"
            prop="createAt"
            label="申请时间"
            :formatter="formatDate">
          </el-table-column>
          <el-table-column
            header-align="center"
            align="left"
            prop="comment"
            :show-overflow-tooltip="true"
            label="事由">
          </el-table-column>
          <el-table-column
            header-align="center"
            align="left"
            width="150px"
            prop="status"
            label="操作">
            <template slot-scope="scope">
              <!--<router-link :to="'/commonApply/detail/' + scope.row.id">-->
                <span class="blue-link" @click="toggleCurExpand(scope.row)">查看详情</span>
              <!--</router-link>-->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageSize"
          :total="totalNum"
          @current-change="changePage">
        </el-pagination>
      </div>
    </div>
    <div v-else class="empty-page">
      <div class="center-con">
        <img src="../../assets/img/table_empty.png"/>
        <p>暂无内容</p>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '../../api/commonApply'
import date from '@hc/core/lib/date'
import upload from '../../components/upload'
import {mapState} from 'vuex'

let actionMap = {
  AGREE: '已批准',
  REJECTBACK: '拒绝回上一级',
  REJECT: '拒绝整个流',
  WAIT: '待审批',
  APPROVING: '审批中',
  WITHDRAW: '撤回'
}

let typeMap = {
  baseFee: 'basic',
  right: 'authIT',
  other: 'other'
}

export default {
  data () {
    return {
      form: {
        reason: '',
        fileList: []
      },
      multipleSelection: [], // 当前选中的rows
      tableData: [],
      employeeId: '123456',
      id: '1111',
      page: 1, // 当前页
      pageSize: 20, // 每页条数
      pageNum: 0, // 总页数
      totalNum: 0, // 列表总条数
      expand: '', // 当前展开行
      checkAll: false, // 控制全选
      isIndeterminate: false, // 控制全选
      isStripe: true, // 控制斑马条纹
      approveType: '', // 审批类型
      navlist: [
        {
          name: '基础费用',
          path: '/approval/commonApproval'
        }
      ],
      actionMap,
      loading: true,
      isEmpty: false,
      formRules: {
        reason: [{ // 是否必填审批意见
          required: false,
          message: '请输入拒绝原因',
          trigger: 'change',

        }]
      },
    }
  },
  computed: {
    ...mapState({
      approver: state => state.user.name
    }),
    filterTableData() {
      let page = this.page
      this.pageNum = Math.ceil(this.tableData.length / this.pageSize)
      return this.page < this.pageNum ? this.tableData.slice((page - 1) * this.pageSize, page * this.pageSize)
        : this.tableData.slice((page - 1) * this.pageSize, this.tableData.length)
    }
  },
  components: {
    // tabs
    upload
  },
  watch: {
    $route: {
      handler: function (to, from) {
        this.approveType = typeMap[this.$route.query.key]
        this.fetchData()
      },
      deep: true,
      immediate: true
    }
  },
  created () {
    this.approveType = typeMap[this.$route.query.key]
  },
  mounted () {
    // 将面包屑传回给父组件
    this.$emit('subNav', this.navlist)

    // 获取待审批列表
    // this.fetchData()
  },
  methods: {
    async fetchData () {
      // 获取待审批列表
      try {
        let response = await api.getApprovalPendingList(this.approveType)
        for (let temp of response) {
          temp.reason = ''
          temp.fileList = []
        }
        this.tableData = response
        // this.tableData = new Array(30).fill(response[0])
        this.totalNum = this.tableData.length
        if (this.totalNum === 0) {
          this.isEmpty = true
        } else {
          this.isEmpty = false
        }
        setTimeout(function() {
          this.loading = false
          if (this.totalNum > 0) {
            this.$nextTick(function () {
              this.$refs.table.columns[0].width = 0
            })
          }
        }.bind(this), 300)
      } catch (err) {
        console.log(err)
      }
    },
    // 批量审批
    async addApprovalByList () {
      console.log(this.multipleSelection)
      let ids = this.multipleSelection.map(val => {
        return val.id
      })
      let params = {
        ids,
        approverName: this.approver
      }
      try {
        const data = await api.addApprovalByList(params)
        this.$emit('updateTab')
        this.$message.success('批量提交审批成功！')
        this.fetchData()
      } catch (err) {
        this.$message.error('批量提交审批失败，请刷新重试')
        console.log(err)
      }
    },
    // 单个审批
    async addSingleApproval(props, type) {
      if ((type === 'REJECT' || type === 'REJECTBACK') && props.row.reason.trim() === '') {
        // this.formRules.reason[0].required = true
        this.formRules.reason[0].required = true
        this.$refs.formApproval.validateField('reason')
        return
      }

      try {
        let params = {
          approverName: this.approver,
          attitude: type,
          description: props.row.reason,
          generalApprovalHistoryAttachmentFormDtos: props.row.fileList,
          id: props.row.id
        }
        const data = await api.addSingleApproval(params)
        this.$message.success('审批信息发送成功！')
        this.formRules.reason[0].required = false
        this.form.reason = ''
        this.$emit('updateTab')
        this.fetchData()
      } catch (err) {
        this.$message.error('审批信息发送失败，请刷新重试')
        console.log(err)
      }
    },
    changePage (newPage) {
      // 换页
      console.log('换页', newPage)
      this.page = newPage
    },
    async toggleCurExpand (row) {
      // 点击展开行
      if (row === this.expand) {
        row.isExpanded = !row.isExpanded;
        this.$refs.table.toggleRowExpansion(row)
        this.isStripe = !this.isStripe
      } else {
        if (this.expand) {
          this.expand.isExpanded = false
        }
        this.$refs.table.toggleRowExpansion(this.expand, false) // 合并之前的行
        this.isStripe = false
        this.expand = row
        this.$refs.table.toggleRowExpansion(row, true) // 展开现在的行
        row.isExpanded = true
      }
      if (row.isExpanded) {
        if (!row.generalApprovalHistoryDaos) {
          let response = await api.getApprovalPendingDetail(row.id)
          row.generalApprovalAttachments = response.generalApprovalAttachments
          row.generalApprovalHistoryDaos = []
          for (let i = 1, il = response.generalApprovalHistoryDaos.length; i < il - 1; i++) {
            if (response.generalApprovalHistoryDaos[i].approverName === this.approver) {
              break;
            }
            row.generalApprovalHistoryDaos.push(response.generalApprovalHistoryDaos[i])
          }
          // row.generalApprovalHistoryDaos = response.generalApprovalHistoryDaos.slice(1, response.generalApprovalHistoryDaos.length - 1)
        }
      }
      this.formRules.reason[0].required = false
      let _this = this;
      this.$nextTick(function() {
        row.isExpanded ? _this.$refs.formApproval.resetFields() : ''
      })
    },
    handleSelectionChange (val) {
      // 控制全选的状态
      // console.log('获取当前选中的row信息')
      // console.log(val)
      this.multipleSelection = val
      if (this.multipleSelection.length > 0){
        if (this.multipleSelection.length === this.tableData.length) {
          this.isIndeterminate = false
          this.checkAll = true
        } else {
          this.isIndeterminate = true
          this.checkAll = false
        }
      } else {
        this.isIndeterminate = false
        this.checkAll = false
      }
    },
    handleCheckAllChange (val) {
      // 点击全选控制选择
      console.log(val)
      if (this.multipleSelection.length === this.tableData.length) {
        this.tableData.forEach(row => {
          this.$refs.table.toggleRowSelection(row, false)
        })
      } else {
        this.tableData.forEach(row => {
          this.$refs.table.toggleRowSelection(row, true)
        })
      }
    },
    updateFiles (props) {
      console.log('updateFiles', this.$refs[props.row.id])
      props.row.fileList = []
      this.$refs[props.row.id].files.forEach(val => {
        props.row.fileList.push({
          fileHash: val.fileHash,
          fileName: val.name,
          fileType: val.name.split('.')[1]
        })
      })
    },
    // 下载附件
    fileDownload(file) {
      let link = document.createElement('a')
      link.href = `/api/file/download?fileHash=${file.fileHash}&fileName=${file.fileName}`
      link.click()
    },
    formatDate(row, column, cellValue, index) {
      return date.format(new Date(cellValue), 'yyyy-MM-dd HH:mm:ss');
    }
  }
}
</script>

<style lang="scss">
  @import "@/assets/css/common.scss";
  .leakcardPage {
    .el-input {
      input:hover,
      input:active,
      input:focus {
        border-color: $primary !important;
      }
    }
  }
</style>

<style lang="scss" scoped>
  @import "@/assets/css/common.scss";

  .gap {
    height: 28px;
  }
  .table-top-bar {
    padding: 24px 15px;
  }
  .type-tag{
    background-color: #fff;
    border-color: $placeholder;
    color: $secondary;
    max-width: 100%;
  }
  .batch-btn{
    margin-left: 30px;
  }
  .blue-link{
    text-decoration: none;
    cursor: pointer;
  }
  // 列展开样式
  .table-expand-top{
    padding: 16px 0 16px 117px;
    border-bottom: 1px solid #EBEEF5;
  }
  .table-expand-top .subject{
    margin-bottom: 8px;
    font-size: $subtitleSize;
    color: #666666;
    font-weight: 500;
  }
  .table-expand-top .subject span{
    margin-right: 20px;
    font-weight: bold;
  }
  .table-expand-top .others{
    font-size: $contentSize;
    color: $secondary;

    .others-content {
      float: left;
    }
  }
  .table-expand-top .others .attachment{
    margin-left: 108px;

    .attachment-content {
      float: left;
    }
  }
  .table-expand-top .others .attachment a{
    color: $primary;
    /*display: inline-block;*/
    margin-right: 10px;
    display: block;
  }
  .table-expand-flow{
    padding-left: 121px;
    width: 531px;
  }
  .first-item-with-long-line{
    padding-top: 0;
  }
  .first-item-with-long-line:after{
    top: 14px;
  }
  .state-box{
    padding-top: 10px;
    padding-bottom: 15px;
  }
  .state-box h3{
    margin: 0;
    font-size: 16px;
    color: #666666;
    font-weight: 400;
  }
  .state-box p{
    margin: 0;
    font-size: 14px;
    color: #999999;
    margin-top: 5px;
  }
  .upload {
    margin-bottom: 20px;
  }
</style>
<style>
  .el-table__expanded-cell{
    padding: 0 !important;
    background-color: #FAFAFA;
  }
  .el-table__expanded-cell:hover{
    background-color: #FAFAFA !important;
  }
</style>
