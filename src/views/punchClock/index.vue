<template>
    <!-- 每个模板定义自己的class，方便样式的隔离和控制 -->
    <div class="punck">
      <breadcrumb :breadlist="navlist"></breadcrumb>
      <div class="content">
        <div class="top-bar">
          <span>本月漏打卡次数<span class="emphasis-text">1 次</span> </span>
          <span>2018漏打卡次数<span class="emphasis-text">3 次</span></span>
          <router-link :to="{name: 'leakcardHistory'}">
            <span class="blue-link">查看漏打卡申请历史记录</span>
          </router-link>
        </div>
        <div class="content-box">
          <el-form ref="form" :model="form" :rules="rules" label-width="82px">
            <div class="item-with-line first-item-with-line item-with-icon icon_clock">
              <el-form-item label="漏打卡时间" prop="leadCardDate">
                <div class="block">
                  <el-date-picker
                    v-model="form.leadCardDate"
                    type="datetime"
                    prefix-icon="el-icon-date"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </div>
              </el-form-item>
              <el-form-item label="漏打卡原因" prop="reason">
                <el-input type="textarea" rows="4" v-model="form.reason"></el-input>
              </el-form-item>
            </div>
            <approver @:updateApproverList="updateApproverList($event)"></approver>
            <div class="item-with-line item-with-icon">
              <el-form-item>
                <el-button type='primary' class='button-primary' @click="onSubmit('form')">提交</el-button>
              </el-form-item>
            </div>
            <div class="item-with-line last-item-with-line item-with-icon icon_graypoint">
              <span class='row-item disabled-text'>ABS0001 人力审批</span>
            </div>
          </el-form>
        </div>
        <rule :ruleList="ruleList"></rule>
      </div>
    </div>
</template>

<script>
import {mapMutations} from 'vuex'
import ruleList from './ruleList'
import rule from '../../components/rule.vue'
import approver from '../../components/approver.vue'
import breadcrumb from '@/components/breadcrumb.vue'
import * as api from '../../api/punchClock'
import Header from '../../components/header'

export default {
  data: function () {
    return {
      form: {
        approver: [], // 审批人列表
        employeeId: '当前状态不可获取', // 申请人账号
        id: '当前状态不可获取', // 申请编号
        leadCardDate: '', // 漏打卡时间
        reason: ''// 漏打卡原因
      },
      rules: {
        leadCardDate: [
          { required: true, message: '请选择漏打卡时间', trigger: 'change' }
        ],
        reason: [
          { required: true, message: '请填写漏打卡原因', trigger: 'blur' }
        ]
      },
      ruleList: ruleList,
      navlist: []
    }
  },
  computed: {
  },
  components: {
    rule,
    approver,
    breadcrumb,
    Header
  },
  mounted() {
    this.navlist = [
       {
          name: '漏打卡申请', // $router.params.name
          path: 'punchClock'
        }
    ]
    this.setBreadcrumb(this.navlist) // save current nav
  },
  // mounted: {
  //   // 获取申请人账号和申请编号
  // },
  methods: {
    ...mapMutations(['setBreadcrumb']),
    async addLeakCard (param) {
      // 提交漏打卡申请
      try {
        const data = await api.addLeakCard(param)
        // 漏打卡提交成功后
        console.log(data)
        this.$router.push({path: '/punchclock/detail'})
      } catch (err) {
        console.log('提交漏打卡信息出错')
        console.log('get data error', err)
      }
    },
    async onSubmit (formName) {
      // 校验
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.approver = [JSON.stringify(this.form.approver)] // 这个字段传值的类型应该是数组里面包对象的格式，目前是数组里面包字符串
          let param = this.form
          console.log(this.form)
          this.addLeakCard(param)
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    updateApproverList (value) {
      // 添加审批人组件：以添加的审批人信息回传
      this.form.approver = value
      console.log('从子组件传回的添加的审批人的值')
      console.log(this.form.approver)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/css/variables.scss';
  @import '@/assets/css/utilities.scss';
</style>
