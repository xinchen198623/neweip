<template>
  <div class="vacation">
    <breadcrumb :breadlist="navlist"></breadcrumb>
    <div class='content '>
      <div class="content-box clearfix">
        <div class='float-left leftblock' v-show="isShowleft">
          <el-button type="text" @click="centerDialogVisible = true">
            <el-button v-if="withDrawDisabled" :loading="loading" type='primary' class='button-second' @click="toggleWithDrawDialog">撤回</el-button>
            <el-button v-else type='primary' class='button-disabled'>已撤回</el-button>
          </el-button>
          <el-dialog
            :visible.sync="withDrawDialog"
            width="390px"
            center>
            <p class="dialog-withdraw-text">撤回{{typeName}}申请？</p>
            <span slot="footer" class="dialog-footer">
              <el-button size="medium" class='button-popover' @click="toggleWithDrawDialog">取消</el-button>
              <el-button size="medium" type="primary" class="button-medium-primary" @click="doWithDraw">撤回</el-button>
            </span>
          </el-dialog>
          <div class="emphasis-text" :class="{colorGrey: !withDrawDisabled}">第一个审批人审批之前，可以撤回申请</div>
        </div>
        <div class='float-right rightblock'>
          <div class="item-with-line first-item-with-line item-with-icon" :class="[active ? 'icon_check' : 'icon_check_grey']">
            <div class='listitem'>
              <div class='title'><span>{{userName}}</span></div>
              <div>类型：{{applyDetailData.typeName}}</div>
              <div>原因：{{applyDetailData.comment}}</div>
              <div>时间：{{format(applyDetailData.createAt)}}</div>
              <div v-show="isShowUpload">附件：
                <upload ref="upload" :oneMust="true" :isActive="withDrawDisabled" :fileList="newFileList" @updateFiles="updateFiles"></upload>
              </div>
            </div>
          </div>
          <template v-for="(item, index) in approvalList" v-if="index > 0">
            <div class="item-with-line item-with-icon icon_check"  :class="{'last-item-with-line': index === approvalList.length - 1}" v-if="item.action === 'AGREE'" :key='index'>
              <!--已批准-->
              <div class='listitem'>
                <div class='title'> <span>{{item.approverName}}</span><span>{{typeAction[item.action]}}</span></div>
                <div class="detail">时间：{{format(item.createAt)}}</div>
                <div v-if="item.comment" class="detail">审批意见：{{item.comment}}</div>
                <div v-if="item.generalApprovalHistoryAttachments.length > 0">附件：
                  <upload ref="upload" :isActive="false" :fileList="item.generalApprovalHistoryAttachments" @updateFiles="updateFiles"></upload>
                </div>
              </div>
            </div>
            <div class="item-with-line item-with-icon icon_alert" :class="{'last-item-with-line': index === approvalList.length - 1}" v-else-if="item.action === 'REJECTBACK'" :key='index'>
              <!--驳回到上一级-->
              <div class='listitem'>
                <div class='title'> <span>{{item.approverName}}</span><span>{{typeAction[item.action]}}</span></div>
                <div class="detail">时间：{{format(item.createAt)}}</div>
                <div v-if="item.comment" class="detail">驳回原因：{{item.comment}}</div>
                <div v-if="item.generalApprovalHistoryAttachments.length > 0">附件：
                  <upload ref="upload" :isActive="false" :fileList="item.generalApprovalHistoryAttachments" @updateFiles="updateFiles"></upload>
                </div>
              </div>
            </div>
            <div class="item-with-line item-with-icon icon_alert" :class="{'last-item-with-line': index === approvalList.length - 1}" v-else-if="item.action === 'REJECT'" :key='index'>
              <!--已拒绝-->
              <div class='listitem'>
                <div class='title'> <span>{{item.approverName}}</span><span>{{typeAction[item.action]}}</span></div>
                <div class="detail">时间：{{format(item.createAt)}}</div>
                <div v-if="item.comment" class="detail">拒绝原因：{{item.comment}}</div>
                <div v-if="item.generalApprovalHistoryAttachments.length > 0">附件：
                  <upload ref="upload" :isActive="false" :fileList="item.generalApprovalHistoryAttachments" @updateFiles="updateFiles"></upload>
                </div>
              </div>
            </div>
            <div class="item-with-line item-with-icon icon_graypoint" :class="{'last-item-with-line': index === approvalList.length - 1}" v-else-if="item.action === 'WAIT'" :key='index'>
              <!--待审批-->
              <div class='listitem'>
                <div class='title colorGrey'> <span>{{item.approverName}}</span><span>{{typeAction[item.action]}}</span></div>
              </div>
            </div>
            <div class="item-with-line item-with-icon icon_point" :class="[index === approvalList.length - 1 ? 'last-item-with-line' : '', active ? 'icon_point' : 'icon_graypoint']" v-else-if="item.action === 'APPROVING'" :key='index'>
              <!--审批中-->
              <div class='listitem'>
                <div class='title' :class="{colorGrey: !withDrawDisabled}"> <span>{{item.approverName}}</span><span>{{typeAction[item.action]}}</span></div>
              </div>
            </div>
            <div class="item-with-line item-with-icon icon_graypoint" :class="{'last-item-with-line': index === approvalList.length - 1}" v-else-if="item.action === 'WITHDRAW'" :key='index'>
              <!--已撤回-->
              <div class='listitem'>
                <div class='title colorGrey'> <span>{{item.approverName}}</span><span>{{typeAction[item.action]}}</span></div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import breadcrumb from '@/components/breadcrumb.vue'
import upload from '@/components/upload.vue'
import * as api from '@/api/commonApply.js'
// import * as api from '@/api/temperary.js'
import date from '@hc/core/lib/date'
let typeAction = {
  AGREE: '已批准',
  REJECTBACK: '驳回到上一级',
  REJECT: '已拒绝',
  WAIT: '待审批',
  APPROVING: '审批中',
  WITHDRAW: '已撤回'
}

export default {
  data: function () {
    return {
      navlist: [
        {
          name: '我的申请',
          path: 'commonApplyHistory'
        }
      ],
      id: '', // id
      loading: false, // 点击撤回按钮进入不可点
      isShowleft: false, // 是否显示左边撤回按钮
      isShowUpload: true, // 是否显示附件，如果不可添加附件并且附件个数为0时，值为false
      withDrawDialog: false, // 撤回弹窗显示
      withDrawDisabled: false, // 顶部详情和按钮是否为disabled状态
      approvalList: [], // 审批人列表
      applyDetailData: [], // 申请详情信息
      typeAction,
      fileList: [],
      newFileList: [],
      active: true, // 是否为撤回状态,默认true，表示正常，未撤回
      typeName: ''
    }
  },
  computed: {
    ...mapState({
      userName: state => state.user.name
    })
  },
  watch: {
    $route: function (to, from) {
      let bread = this.$route.query.bread
      console.log('从哪里跳转过来')
      console.log(bread)
      if (parseInt(bread) === 2) {
        this.navlist[0] = {
          name: '2周内申请',
          path: 'twoweekapply'
        }
      }
    }
  },
  components: {
    breadcrumb,
    upload
  },
  created () {
    // 获取传过来的ID
    this.id = this.$route.query.id
    this.getApplyDetail()
    let bread = this.$route.query.bread
    if (parseInt(bread) === 2) {
      this.navlist[0] = {
        name: '2周内申请',
        path: 'twoweekapply'
      }
    }
  },
  mounted () {
    console.log('挂载完成')
    console.log(this.$refs.upload.files)
  },
  methods: {
    toggleWithDrawDialog () {
      // 切换撤回弹窗
      this.withDrawDialog = !this.withDrawDialog
    },
    doWithDraw () {
      // 执行撤回操作
      this.loading = true
      this.WithDraw()
    },
    updateFiles (value, action) {
      // 上传附件组件：fileList回传
      let data = {
        action: action,
        approvalId: this.id,
        attachmentId: value.id,
        fileHash: value.fileHash,
        fileName: value.name,
        fileType: value.name.split('.')[1]
      }
      console.log(JSON.stringify(data))
      this.attachmentEdit(data, action)
    },
    format (time) {
      return date.format(new Date(time), 'yyyy-MM-dd HH:mm')
    },
    async attachmentEdit (data, action) {
      // 删除添加附件
      try {
        const res = await api.attachmentEdit(data)
        console.log('执行文件删除修改结果')
        console.log('res:', res)
        if (action === 'add') {
          this.$refs.upload.files[this.$refs.upload.files.length - 1].id = res.id
        }
      } catch (err) {
        console.log(err)
      }
    },
    async WithDraw () {
      // 调用撤回接口
      console.log(this.id)
      console.log(this.userName)
      try {
        const data = await api.withdraw({approverName: this.userName, id: this.id})
        console.log('撤回操作')
        console.log(data)
        if (data === null) {
          console.log('撤回成功')
          this.loading = false
          this.withDrawDisabled = false
          this.active = false
          this.toggleWithDrawDialog()
        } else if (data.code && data.code === 401) {
          // 第一级审批人已经审批，不能进行撤回
          this.loading = false
          this.withDrawDisabled = false
          this.active = false
          this.toggleWithDrawDialog()
          this.$message.error('已经发生过审批，禁止撤回')
        } else {
          // 撤回失败
          this.$message.error(data.message)
        }
      } catch (err) {
        console.log(err)
      }
    },
    async getApplyDetail () {
      // 获取详情信息
      try {
        const data = await api.getApplyDetail(this.id)
        console.log('详情结果')
        console.log(data)
        // 处理审批人添加的附件
        for (let i = 1; i < data.generalApprovalHistoryDaos.length; i++) {
          let curList = data.generalApprovalHistoryDaos[i].generalApprovalHistoryAttachments
          if (curList) {
            let length = curList.length
            for (let j = 0; j < length; j++) {
              curList[j].name = curList[j].fileName
            }
          }
        }

        this.applyDetailData = data
        this.approvalList = data.generalApprovalHistoryDaos
        this.fileList = data.generalApprovalAttachments
        this.navlist.push(
          {
            name: data.typeName,
            path: '/'
          }
        )
        data.generalApprovalAttachments.forEach(val => {
          this.newFileList.push({
            fileHash: val.fileHash,
            name: val.fileName,
            id: val.id
          })
        })

        if (data.type === 'SVN' || data.type === 'IT_DEVICE_APPLY') {
          this.isShowUpload = false
        }

        // 这块的逻辑要重新理一下
        if (data.canWithDraw) { // 可以撤回
          this.isShowleft = true // 显示左边按钮
          this.withDrawDisabled = true
        } else { // 不可撤回
          // this.isShowleft = false // 不显示撤回按钮
          // this.withDrawDisabled = false
          if (this.fileList.length === 0) { // 附件为0，不显思
            this.isShowUpload = false
          }
        }
        if (data.state === 'D') {
          this.isShowleft = true
          this.withDrawDisabled = false
          this.active = false
        }

        data.typeName.indexOf('申请', data.typeName.length - 2) > 0 ? this.typeName = data.typeName.slice(0, -2) : this.typeName = data.typeName
      } catch (err) {
        this.$message.error('网络出错，请稍后重试')
        console.log('获取详情信息失败')
      }
    }
  }
}

</script>

<style lang="scss" scoped>
  @import '@/assets/css/variables.scss';
  .content-box {
    width: 750px;
    margin-top: 30px;
    .leftblock {
      width: 40%;
      text-align: right;
      padding-right: 40px;
    }
    .rightblock {
      width: 60%;
      margin-top: 10px;
    }
  }
  .dialog-withdraw-text{
    font-size: 20px;
    color: $major;
    text-align: center;
    font-weight: 500;
  }
  .colorGrey{
    color: $minor !important;
  }
.listitem {
  padding-bottom: 30px;
  line-height: 35px;
  font-size: $contentSize;

  div {
    span:first-child {
      padding-right: 15px;
    }
  }
  .detail{
    font-size: 14px;
    color: #999999;
  }
  .title {
    padding-top: 4px;
    font-size: $subtitleSize;
  }
}

.topbutton {
  margin-bottom: 30px;
}
.el-upload__tip{
  color:#F39C12;
  margin-top: -62px;
  margin-left: 52px;
}
.dialog-footer .el-button{
  width:87px;
  height:36px;
  line-height: 0px;
}
.cancel{
  background-color: $primary;
}
</style>
