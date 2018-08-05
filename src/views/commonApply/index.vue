<template>
    <!-- 每个模板定义自己的class，方便样式的隔离和控制 -->
    <div class="punck">
      <breadcrumb :breadlist="navlist"></breadcrumb>
      <div class="content">
        <!--<div class="top-bar">-->
          <!--<router-link to="/history/commonApplyHistory">-->
            <!--<span class="blue-link">查看{{title}}申请历史记录</span>-->
          <!--</router-link>-->
        <!--</div>-->
        <div class="content-box">
          <el-form ref="form" :model="form" :rules="rules" label-width="82px">
            <div class="item-with-line first-item-with-line item-with-icon icon_clock">
              <span data-v-0de43e65="" class="row-item title-text">{{title}}申请</span>
              <el-form-item label="申请描述" prop="comment">
                <el-input type="textarea" rows="4" v-model="form.comment" maxlength="500" placeholder="请输入"></el-input>
              </el-form-item>
              <!--<el-form-item label="附件信息" prop="fileList">-->
                <!--<el-row>-->
                  <!--<el-button type='primary' class="button-blue icon_edit" @click="downloadFile">填写信息</el-button>-->
                  <!--<span class="tip-text">请先填写信息，编辑后上传</span>-->
                <!--</el-row>-->
                <!--<upload :fileList="form.generalApprovalAttachments" @:updatefileList="updatefileList($event)"></upload>-->
              <!--</el-form-item>-->
            </div>
            <transition-group tag="div" v-if="form.employeeModels.length>0" v-for="(item, index) in form.employeeModels" :key="index"  class="item-with-line item-with-icon icon_min">
              <div  class="approver-wrap"
                    :key="index"
                   draggable="true"
                   @dragstart="handleDragStart($event, item)"
                   @dragover.prevent="handleDragOver($event, item)"
                   @dragenter="handleDragEnter($event, item)"
                   @dragend="handleDragEnd($event, item)">
                <el-popover
                  placement="top"
                  width="314"
                  trigger="click"
                  ref="popover">
                  <p class="popover-text">删除审批人"{{item.name}}"？</p>
                  <div class="btn-bar popover">
                    <el-button size="medium" class='button-popover' @click="hidePopover(index)">取消</el-button>
                    <el-button size="medium" class='button-popover-cancel' @click="delApprover(index)">删除</el-button>
                  </div>
                  <span class="approver-item" slot="reference">{{item.name}}</span>
                </el-popover>
              </div>
            </transition-group>
            <div class="item-with-line item-with-icon last-item-with-line icon_plus add_approval">
              <el-form-item label="" prop="employeeModels">
                <div class="state-box clearfix" >
                  <h3 @click="toggleShow">添加审批人 <span class="icon_info"></span></h3>
                </div>
              </el-form-item>
            </div>
            <!--<approver :isLast="true" @:updateApproverList="updateApproverList($event)"></approver>-->
            <div class="item-with-line item-with-icon last-item-without-line">
              <el-form-item>
                <el-button type='primary' class='button-primary' :loading="loading" @click="onSubmit('form')">提交</el-button>
              </el-form-item>
            </div>
            <!--<div class="item-with-line last-item-with-line item-with-icon icon_graypoint">-->
              <!--<span class='row-item disabled-text'>ABS0001 人力审批</span>-->
            <!--</div>-->
          </el-form>
        </div>
        <rule :ruleList="ruleList"></rule>
        <addApproval :isShowAdd="isShowAdd" :approver="form.employeeModels" @toggleShow="toggleShow" @updateApprover="updateApprover"></addApproval> 
      </div>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import ruleList from './ruleList'
import rule from '../../components/rule.vue'
import approver from '../../components/approver.vue'
import breadcrumb from '@/components/breadcrumb.vue'
import upload from '@/components/upload.vue'
import * as api from '../../api/commonApply'
import addApproval from './addApproval.vue'

export default {
  data: function () {
    return {
      loading: false,
      isShowAdd: false, // 是否显示
      title: '',
      form: {
        employeeModels: [], // 审批人列表
        comment: '', // 漏打卡原因
        generalApprovalAttachments: [], // 文件列表
        type: '',
        typeName: '',
        approverName: ''
      },
      rules: {
        // generalApprovalAttachments: [
        //   { type: 'array', required: true, message: '请添加附件信息', trigger: 'change' }
        // ],
        comment: [
          { required: true, message: '请填写申请描述', trigger: 'blur' },
          { max: 500, message: '最多可输入500字', trigger: 'change' }
        ],
        employeeModels: [
          { type: 'array', required: true, message: '请添加审批人', trigger: 'change' }
        ]
      },
      ruleList: [],
      navlist: [
        {
          name: '名片印刷申请',
          path: '/'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      userName: state => state.user.name,
      userId: state => state.user.id
    })
  },
  watch: {
    userName: function (newValue, oldValue) {
      this.form.approverName = newValue
    }
  },
  created () {
    // 这里应该从首页把type值传回俩
    let pathParams = this.$route.query
    this.title = decodeURIComponent(pathParams.params)
    if (this.title.indexOf('申请') > 0) {
      this.title = this.title.slice(0, -2)
    }

    this.form.typeName = decodeURIComponent(pathParams.params)
    this.form.type = pathParams.type

    this.ruleList = ruleList[this.form.type]
    if (!this.ruleList) {
      this.ruleList = ruleList['BASIC']
    }

    this.navlist = [{
      name: decodeURIComponent(pathParams.params),
      path: '/'
    }]
    if (this.userName.length > 0) {
      this.form.approverName = this.userName
    }
    this.getApplyUserHistory()
  },
  mounted () {
    console.log('挂载完成')
  },
  components: {
    rule,
    approver,
    breadcrumb,
    upload,
    addApproval
  },
  methods: {
    async addApplication (param) {
      // 提交名片印刷申请
      try {
        console.log('表单数据')
        console.log(JSON.stringify(param))
        const data = await api.addApplication(param)
        // 名片印刷申请提交成功后
        console.log(data)
        this.loading = false
        this.$router.push({path: '/commonApply/detail', query: {id: data.id}})
      } catch (err) {
        this.loading = false
        this.$message.error('网络出错，请稍后重试')
      }
    },
    async onSubmit (formName) {
      // 校验 提交申请
      this.loading = true
      let isSelf = false
      this.form.employeeModels.forEach(item => {
        if (parseInt(this.userId) === parseInt(item.id)) {
          isSelf = true
          return this.$message.error('不能添加自己为审批人')
        }
      })
      this.$refs[formName].validate((valid) => {
        if (valid && !isSelf) {
          let param = this.form
          this.addApplication(param)
        } else {
          console.log('error submit!!')
          this.loading = false
          return false
        }
      })
    },
    async getApplyUserHistory () {
      // 获取历史添加的审批人
      try {
        const data = await api.getApplyUserHistory(this.form.type)
        this.form.employeeModels.push(...data)
      } catch (err) {
        this.loading = false
        this.$message.error('网络出错，请稍后重试')
      }
    },
    updateApprover (value) {
      // 添加审批人组件：以添加的审批人信息回传
      this.form.employeeModels = []
      this.form.employeeModels.push(...value)
    },
    delApprover (index) {
      // 删除审批人
      this.$refs['popover'][index].doClose() // 隐藏popover
      this.form.employeeModels.splice(index, 1)
    },
    hidePopover (index) {
      // 关闭popover
      this.$refs['popover'][index].doClose()
    },
    toggleShow (mag) {
      this.isShowAdd = !this.isShowAdd
    },
    // 拖动效果
    handleDragStart (e, item) {
      this.dragging = item
    },
    handleDragEnd (e, item) {
      this.dragging = null
    },
    // 首先把div变成可以放置的元素，即重写dragenter/dragover
    handleDragOver (e) {
      e.dataTransfer.dropEffect = 'move' // e.dataTransfer.dropEffect="move";//在dragenter中针对放置目标来设置!
    },
    handleDragEnter (e, item) {
      e.dataTransfer.effectAllowed = 'move' // 为需要移动的元素设置dragstart事件
      if (item === this.dragging) {
        return
      }
      let newItems = this.form.employeeModels
      let src = newItems.indexOf(this.dragging)
      let dst = newItems.indexOf(item)

      newItems.splice(dst, 0, ...newItems.splice(src, 1))

      // this.form.employeeModels = newItems
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/css/variables.scss';
  @import '@/assets/css/utilities.scss';
  .button-blue{
    margin-bottom: 23px;
    margin-right: 10px;
  }
  .state-box{
    /*padding-top: 11px;*/
    /*padding-bottom: 22px;*/
  }
  .state-box h3{
    float: left;
    margin: 0;
    font-size: 14px;
    color: $primary;
    font-weight: 400;
    cursor: pointer;
  }
  .state-box p{
    margin: 0;
    font-size: 14px;
    color: #999999;
    margin-top: 5px;
  }
  /**添加的审批人样式**/
  .item-with-line{
    /*min-height: 50px;*/
  }
  .approver-wrap{
    display:inline-block;
    margin-right: 40px;
    margin-bottom:8px;
  }
  .approver-item{
    display: inline-block;
    margin-top: 10px;
    font-size: $contentSize;
    color: $primary;
    cursor: pointer;
  }
  .btn-bar{
    margin-top: 47px;
    text-align: center;
  }
  .btn-bar.popover{
    margin-top: 28px;
    margin-bottom: 21px;
  }
  .popover-text{
    text-align:center;
    margin-top: 34px;
  }
</style>
<style>
  .add_approval .el-form-item__content{
    margin-left: 0 !important;
  }
</style>
