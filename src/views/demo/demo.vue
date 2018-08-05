<template>
  <!-- 每个模板定义自己的class，方便样式的隔离和控制 -->
  <div class='demopage'>
    <breadcrumb :breadlist="navlist"></breadcrumb>
    <div class='content'>
      <h3>完成页索引</h3>
      <router-link to='vacation'>休假</router-link>
      <router-link to='punchclock'>漏打卡</router-link>
      <router-link to='business'>公出</router-link>
      <router-link to="attendance">考勤查询</router-link>
      <router-link :to='{name: "punchclockHistory", params: { showPreviousNav: false }}'>我的申请</router-link>

      <h3>顶部</h3>
      <div class="top-bar">
        <span>可用年假<span class="emphasis-text">1 次</span> </span>
        <span>可用倒休假<span class="emphasis-text">3 次</span></span>
        <a href="#/history" class="blue-link">查看休假历史记录</a>
      </div>

      <h3>BUTTON</h3>
      <el-button type='primary' class='button-primary'>确认考勤</el-button>
      <el-button type='primary' class='button-primary disabled'>确认考勤</el-button>
      <el-button type='primary' class='button-second'>撤回</el-button>
      <el-button type='primary' class='button-disabled'>已撤回</el-button>

      <h3>BUTTON hover变色</h3>
      <el-button size="medium" class='button-popover'>取消</el-button>
      <el-button size="medium" class='button-popover-cancel'>删除</el-button>
      <el-button size="medium" type="danger" class="button-medium-danger">删除</el-button>
      <el-button size="medium" type="primary" class="button-medium-primary">批准</el-button>
      <el-button size="medium" type="primary" class="button-medium-orange">驳回到上一级</el-button>

      <h3>下载模板</h3>
      <span class="icon_info"></span>
      <el-button type='primary' class='button-blue icon_edit'>填写信息</el-button>

      <h3>Item with line and icon</h3>
      <div class="content-box">
        <el-form ref='form' label-width="82px">
          <div class="item-with-line first-item-with-line item-with-icon icon_min">
            <span data-v-0de43e65="" class="row-item title-text">交通费申请</span>
            <el-form-item label="漏打卡时间">
              <el-date-picker
                type="datetime"
                prefix-icon="el-icon-date"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="漏打卡原因">
              <el-input type="text" ></el-input>
            </el-form-item>
            <el-form-item label="附件信息" prop="leadCardDate">
              <el-button type='primary' class="button-blue icon_edit">填写信息</el-button>
              <span class="tip-text">请先下载模板，编辑后上传</span>
              <upload @:updatefileList="updatefileList($event)"></upload>
            </el-form-item>
          </div>
          <div class="item-with-line item-with-icon icon_plus">
            <el-form-item label="漏打卡原因">
              <el-input type="text" ></el-input>
            </el-form-item>
          </div>
          <div class="item-with-line item-with-icon icon_clock">
            <el-form-item label="漏打卡原因">
              <el-input type="text" ></el-input>
            </el-form-item>
          </div>
          <div class="item-with-line item-with-icon icon_point">
            <el-form-item label="漏打卡原因">
              <el-input type="text" ></el-input>
            </el-form-item>
          </div>
          <div class="item-with-line item-with-icon icon_graypoint">
            <el-form-item label="漏打卡原因">
              <el-input type="text" ></el-input>
            </el-form-item>
          </div>
          <div class="item-with-line item-with-icon icon_alert">
            <el-form-item label="漏打卡原因">
              <el-input type="text" ></el-input>
            </el-form-item>
          </div>
          <div class="item-with-line item-with-icon icon_check">
            <el-form-item label="漏打卡原因">
              <el-input type="text" ></el-input>
            </el-form-item>
          </div>
          <div class="item-with-line item-with-icon icon_graycheck">
            <span class='row-item disabled-text'>ABS0001 人力审批</span>
          </div>
          <div class="item-with-line last-item-with-line item-with-icon icon_list">
            <span class='row-item disabled-text'>ABS0001 人力审批</span>
          </div>
        </el-form>
        <rule :ruleList="ruleList"></rule>
      </div>
      <h3>API demo</h3>
        <p>{{description}}</p>
        <p><span>full address: </span><span>{{fullAddress}}</span></p>
        <p><span>data bigger than 2: </span><span>{{dataBigger(2)}}</span></p>
        <button @click='update'>Update</button>
        <button @click='getDemoCount'>get demo data</button>
        <button @click='getDemo'>get demo data</button>
        <button @click='getDemo2'>get demo data by para</button>
        <button @click='testsso'>test sso</button>
        <div v-for='d in data' v-bind:key='d.title'>title: {{d.title}}</div>
      </div>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import * as types from '../../store/mutation-types'
import * as api from '../../api/demo'
import ruleList from './ruleList'
import rule from '../../components/rule.vue'
import breadcrumb from '@/components/breadcrumb.vue'
import upload from '@/components/upload.vue'

export default {
  data () {
    return {
      ruleList,
      navlist: [
        {
          name: '休假申请',
          path: '/'
        },{
          name: '休假详情',
          path: '/'
        }],
      fileList: [],
      description: 'show how to call api'
    }
  },
  computed: {
    ...mapState({
      title: state => state.demo.title,
      subTitle: state => state.demo.subTitle,
      data: state => state.demo.data
    }),
    ...mapGetters(['fullAddress', 'dataBigger'])
  },
  mounted() {
  },
  components: {
    rule,
    breadcrumb,
    upload
  },
  methods: {
    // ...mapMutations([types.GETDATA_DEMOPAGE]),
    ...mapActions([types.REFRESH_DEMOPAGE]),
    update () {
      this.REFRESH_DEMOPAGE({title: 'a new title', subTitle: 'a new sub title'})
    },
    async getDemoCount () {
      try {
        const data = await api.getDefaultData()
        console.log('getDefaultData: ', data)
      } catch (err) {
        console.log('get data error', err)
      }
    },
    async getDemo () {
      try {
        const data = await api.getDemo(1)
        console.log('getDemo: ', data)
      } catch (err) {
        console.log('get data error', err)
      }
    },
    async getDemo2 () {
      try {
        const data = await api.queryData(1)
        console.log('queryData: ', data)
      } catch (err) {
        console.log('get data error', err)
      }
    },
    async testsso () {
      // try {
      //   const data = await api.testsso()
      //   console.log('queryData: ', data)
      // } catch (err) {
      //   console.log('get data error', err)
      // }
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
    @import '@/assets/css/variables.scss';
    // 最好采用scoped方式
    .demopage {
        h1 { font-size: 24px; }
    }
    h3 {
      border-left: 2px solid $primary;
      padding-left: 15px;
      margin-top: 30px;
    }
</style>
