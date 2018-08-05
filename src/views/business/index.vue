<template>
    <!-- 每个模板定义自己的class，方便样式的隔离和控制 -->
    <div class="punck">
      <breadcrumb :breadlist="navlist"></breadcrumb>
      <div class="content">
        <div class="top-bar">
          <span>已公出时常32小时</span>
          <router-link to="/punchclock/detail">
            <span class="blue-link">查看漏打卡申请历史记录</span>
          </router-link>
        </div>
        <div class="content-box">
          <el-form ref="form" :model="form" :rules="rules" label-width="82px">
            <div class="item-with-line first-item-with-line item-with-icon icon_list">
              <el-form-item label="事务类型" prop="transationType">
                <el-radio v-model="form.transationType" label="1" border>日常事务</el-radio>
                <el-radio v-model="form.transationType" label="2" border>紧急事务</el-radio>
              </el-form-item>
              <el-form-item label="交通工具" prop="transportation">
                <el-radio v-model="form.transportation" label-width="106px" label="1" border>公交车</el-radio>
                <el-radio v-model="form.transportation" label-width="106px" label="2" border>出租车</el-radio>
                <el-col :span="24">
                  <span class="tip-text">日常事务乘坐公共交通工具，紧急特殊事务可乘坐出租车</span>
                </el-col>
              </el-form-item>
              <el-form-item label="公出时间" prop="businessDate">
                <el-col :span="24">
                  <el-date-picker
                    v-model="form.businessDate"
                    prefix-icon="el-icon-date"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-col>
                <label class="form-label-tag">共<span class="tip-text">7小时</span></label>
              </el-form-item>
              <el-form-item label="是否住宿" prop="isStay">
                <el-radio v-model="form.isStay" label="1">是</el-radio>
                <el-radio v-model="form.isStay" label="2">否</el-radio>
              </el-form-item>
              <el-form-item label="公出地点" prop="startAddress">
                <el-col :span="11">
                  <el-select v-model="form.startAddress" placeholder="起点">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                  <el-select v-model="form.endAddress" placeholder="终点">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-col>
              </el-form-item>
              <el-form-item label="公出事由" prop="reason">
                <el-input type="textarea" rows="4" placeholder="请输入" v-model="form.reason"></el-input>
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
import ruleList from './ruleList'
import rule from '../../components/rule.vue'
import approver from '../../components/approver.vue'
import breadcrumb from '@/components/breadcrumb.vue'
import * as api from '../../api/punchClock'

export default {
  data: function () {
    return {
      form: {
        approver: [], // 审批人列表
        employeeId: '当前状态不可获取', // 申请人账号
        id: '当前状态不可获取', // 申请编号
        transationType: '',
        transportation: '',
        businessDate: '', // 公出日期
        businessTime: '', // 公出时间
        isStay: '',
        startAddress: '',
        endAddress: '',
        reason: '', // 漏打卡原因
        test: ''
      },
      rules: {
        // leadCardDate: [
        //   { required: true, message: '请选择漏打卡时间', trigger: 'change' }
        // ],
        // reason: [
        //   { required: true, message: '请填写漏打卡原因', trigger: 'blur' }
        // ]
      },
      ruleList: ruleList,
      navlist: [
        {
          name: '漏打卡申请',
          path: '/'
        }
      ]
    }
  },
  computed: {
  },
  components: {
    rule,
    approver,
    breadcrumb
  },
  // mounted: {
  //   // 获取申请人账号和申请编号
  // },
  methods: {
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
