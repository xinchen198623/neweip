<template>
    <div class="vacation">
        <breadcrumb :breadlist="navlist"></breadcrumb>
        <div class='content'>
          <div class="top-bar">
            <span>可用年假：<span class="emphasis-text">1 次</span> </span>
            <span>可用倒休假：  请咨询前台</span>
            <a href="#/history" class="blue-link">查看休假历史记录</a>
          </div>
          <div class="content-box">
            <el-form ref='form' label-width="82px">
              <div class="item-with-line first-item-with-line item-with-icon icon_list">
                <el-form-item label="休假类型">
                  <el-select v-model="selectedType" placeholder="请选择">
                    <el-option
                      v-for="item in typelist"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="岂止时间">
                  <el-date-picker
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="工作交接人">
                  <el-input type="text"></el-input>
                </el-form-item>
                <el-form-item label="请假原因">
                  <el-input type="textarea" rows="3" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="附件信息">
                  <upload @:updatefileList="updatefileList($event)"></upload>
                </el-form-item>
              </div>
              <approver @:updateApproverList="updateApproverList($event)"></approver>
              <div class="item-with-line item-with-icon">
                <el-form-item label="">
                  <el-button type='primary' class='button-primary button-submit' @click='onSubmit("form")'>提交</el-button>
                </el-form-item>
              </div>
              <div class="item-with-line last-item-with-line item-with-icon icon_graypoint">
                <span class='row-item disabled-text'>ABS0001 人力审批</span>
              </div>
            </el-form>
            <rule :ruleList="ruleList"></rule>
          </div>
        </div>
    </div>
</template>

<script>
import ruleList from './ruleList'
import rule from '@/components/rule.vue'
import breadcrumb from '@/components/breadcrumb.vue'
import * as api from '../../api//vacation'
import approver from '../../components/approver.vue'
import upload from '../../components/upload.vue'

export default {
  data: function () {
    return {
      ruleList,
      navlist: [
        {
          name: '休假申请',
          path: '/vacation'
        }],
      selectedType: {
        name: '',
        value: ''
      },
      typelist: [],
      form: {
        approver: [] // 审批人列表
      },
      fileList: []
    }
  },
  computed: {
  },
  components: {
    rule,
    breadcrumb,
    approver,
    upload
  },
  mounted () {
    this.getTypeList()
  },
  methods: {
    async getTypeList () {
      try {
        this.typelist  = await api.getTypeList()
        this.selectedType = this.typelist[0]
      } catch (err) {
        debuglog(err)
      }
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    onSubmit (formName) {
      alert('提交申请')
    },
    updateApproverList (value) {
      // 添加审批人组件：以添加的审批人信息回传
      this.form.approver = value
      console.log('从子组件传回的添加的审批人的值')
      console.log(this.form.approver)
    },
    updatefileList (value) {
      // 添加审批人组件：以添加的审批人信息回传
      this.fileList = value
      console.log('从子组件传回的添加的审批人的值')
      console.log(this.fileList)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
