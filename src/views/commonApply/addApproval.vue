<template>
  <!-- 每个模板定义自己的class，方便样式的隔离和控制 -->
  <div class="rule">
    <div class="modal" @click="cancel" v-show="isShow"></div>
    <div class="modal-content rule-content" :class="{ show: isShow }">
      <i class="icon-close" @click="cancel"></i>
      <h3 class="title">添加人员</h3>
      <h4 class="sub-title">添加人员</h4>
      <ul class="approval-list clearfix">
        <li v-for="(item, index) in addedApproverList" :key="index">
          {{item.name}}
          <el-popover
            placement="bottom"
            width="314"
            trigger="click"
            ref="popover">
            <p class="popover-text">删除审批人"{{item.name}}"？</p>
            <div class="btn-bar popover">
              <el-button size="medium" class='button-popover' @click="hidePopover(index)">取消</el-button>
              <el-button size="medium" class='button-popover-cancel' @click="delApprover(index)">删除</el-button>
            </div>
            <span class="close" slot="reference"></span>
          </el-popover>
        </li>
      </ul>
      <el-select v-model="query" v-loadmore="loadingMore" filterable remote :remote-method="remoteMethod" :loading="loading" @change="addApprover($event)" popper-class="approver-select" placeholder="输入ID/姓名" no-match-text="没有搜索到相关人员" no-data-text="没有搜索到相关人员">
        <el-option
          v-for="(item, index) in approverList"
          :key="index"
          v-if="index<=showNum"
          :label="item.name"
          :value="index">
          <p class="approver-text"><span class="approver-name">{{item.name}}</span> {{item.userAccount}}/{{item.duty}}/{{item.department}}</p>
          <!--<h3 class="approver-name">{{item.name}}（{{item.userAccount}}/{{item.duty}}）</h3>-->
          <!--<h4 class="approver-depart">{{item.department}}</h4>-->
        </el-option>
        <div v-loading="loadingM" class="loadingMoreClass"></div>
      </el-select>
      <div class="btn-bar">
        <el-button class='button-popover' @click="cancel">取消</el-button>
        <el-button size="medium" type="primary" class="button-medium-primary" @click="confirm">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import * as api from '../../api/common'
export default {
  props: {
    isShowAdd: Boolean, // 是否显示
    approver: Array // 已经添加的审批人
  },
  data: function () {
    return {
      loading: false,
      loadingM: false,
      isMax: false,
      // isShow: true,
      isShowRuleIndex: 0,
      showNum: 19, // dropdown默认可显示的审批人的数量
      approverList: [], // 从接口获取的审批人的列表
      addedApproverList: [],
      page: 1,
      query: ''
    }
  },
  computed: {
    isShow: function () {
      return this.isShowAdd
    },
    ...mapState({
      userId: state => state.user.id
    })
  },
  watch: {
    approver: function () {
      this.addedApproverList = []
      this.addedApproverList.push(...this.approver)
    }
  },
  mounted () {
    this.addedApproverList = []
    this.addedApproverList.push(...this.approver)
  },
  methods: {
    async getApproverList (name, page, limit, type) { // 按员工姓名搜索
      try {
        const data = await api.employeeSearch(name, page, limit)
        console.log(data)
        // 更新员工列表的值
        if (type === 1) { // 第一次获取
          this.approverList = []
          this.approverList.push(...data.list)
        } else if (type === 2) { // 加载更多
          this.approverList.push(...data.list)

          let newNum = this.showNum + 20
          if (newNum > this.approverList.length) {
            this.showNum = this.approverList.length
            this.isMax = true
            console.log('数组长度')
          } else {
            this.showNum = newNum
            console.log('增加20')
          }
        }

        this.loading = false
        this.loadingM = false
      } catch (err) {
        this.$message.error('网络出错，请稍后重试')
        console.log('get data error', err)
      }
    },
    async getApproverListById (employeeId, page, limit) { // 按员工ID搜索
      try {
        const data = await api.employeeSearchById(employeeId, page, limit)
        console.log('按员工id搜索的结果')
        console.log(data)
        // 更新员工列表的值
        this.approverList = []
        this.approverList.push(...data.list)

        this.loading = false
        this.loadingM = false
      } catch (err) {
        this.$message.error('网络出错，请稍后重试')
        console.log('get data error', err)
      }
    },
    delApprover (index) {
      // 删除审批人
      this.$refs['popover'][index].doClose() // 隐藏popover
      this.addedApproverList.splice(index, 1)
    },
    addApprover (value) {
      // 添加审批人
      if (parseInt(this.userId) === parseInt(this.approverList[value].id)) {
        this.$message.error('不能添加自己为审批人')
      } else {
        this.addedApproverList.push(this.approverList[value])
      }
      this.query = ''
      this.approverList = []
    },
    remoteMethod (query) {
      // 搜索过滤
      console.log('当前所有的内容：', query)
      this.loading = true
      this.query = query
      this.approverList = []
      this.showNum = 19
      this.page = 1

      if (query.trim() !== '') {
        // 函数节流
        if (this.method) {
          clearTimeout(this.method)
        }
        var _this = this
        this.method = setTimeout(function () {
          // 能够转换成数字，且字符串的长度等于8位
          console.log('执行')
          if (Number(query) >= 10000000 && query.length === 8) {
            _this.getApproverListById(query, this.page, 20)
          } else {
            _this.getApproverList(query, this.page, 20, 1)
          }
        }, 500)
      } else {
        this.loading = false
      }
    },
    loadingMore () {
      // dropdown滑动到底部更新数据
      console.log('执行加载更多的操作')
      if (this.query.trim() !== '' && !this.loadingM && !this.isMax) {
        this.page++
        this.loadingM = true
        this.getApproverList(this.query, this.page, 20, 2)
      }
    },
    hidePopover (index) {
      // 关闭popover
      this.$refs['popover'][index].doClose()
    },
    cancel () {
      // 点击取消按钮
      this.$emit('toggleShow', false)
    },
    confirm () {
      // 点击确认按钮
      this.$emit('toggleShow', false)
      this.$emit('updateApprover', this.addedApproverList)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/css/variables.scss';
  /**制度**/
  .rule{
  }
  .modal{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2000;
    background-color: rgba(0,0,0,.5);
    transition: display .5s linear;
    -moz-transition: display .5s linear;
    -webkit-transition: display .5s linear;
    -o-transition: display .5s linear;
  }
  .rule-content{
    position: fixed;
    top: 0;
    right: -373px;
    z-index: 2001;
    width: 373px;
    height: 100%;
    padding: 30px 29px 30px 33px;
    background-color: #fff;
    overflow-y: auto;
    transition: all .3s linear;
    -moz-transition: all .3s linear;
    -webkit-transition: all .3s linear;
    -o-transition: all .3s linear;
  }
  .rule-content.show{
    right: 0;
  }
  .rule-content>.icon-close{
    display: block;
    position: absolute;
    top: 25px;
    right: 22px;
    width: 25px;
    height: 25px;
    background: url('../../assets/img/icon_close_grey.png') center center no-repeat;
    background-size: 17px 17px;
  }
  .rule-content .title{
    font-size: $headerSize;
    color: $major;
    line-height: 1.4;
    font-weight: 500;
    padding-bottom: 20px;
    border-bottom: 1px solid #EBEEF5;
  }
  .rule-content .sub-title{
    font-size: 16px;
    color: $major;
    line-height: 1.4;
    font-weight: 400;
    margin-top: 40px;
    margin-bottom: 20px;
  }
  .approval-list{
    margin-bottom: 10px;
  }
  .approval-list>li{
    position: relative;
    float: left;
    padding: 6px 29px 6px 6px;
    margin-right: 14px;
    margin-bottom: 10px;
    font-size: 14px;
    color: #416DD7;
    line-height: 20px;
    background-color: #ECF4FF;
    border: 1px solid #D8E3FF;
    border-radius: 2px;
  }
  .approval-list>li .close{
    display: block;
    position: absolute;
    right: 0;
    top: 0;
    width: 30px;
    height: 32px;
    background: url('../../assets/img/icon_close_blue.png') right 11px center no-repeat;
    background-size: 8px 8px;
  }
  .approval-list>li:hover .close{
    background: url('../../assets/img/icon_close_circle.png') right 8px center no-repeat;
    background-size: 15px 15px;
  }
  .el-select{
    width: 100%;
  }
  .el-select-dropdown__item{
    height: inherit;
    padding-top: 8px;
    padding-bottom: 8px;
  }
  .approver-name{
    margin: 0;
    font-size: $contentSize;
    color: $secondary;
    line-height: 1.4;
    font-weight: normal;
  }
  .approver-depart{
    margin: 0;
    font-size: $mincontentSize;
    color: $minor;
    line-height: 1.4;
    font-weight: normal;
  }
  .approver-text{
    width: 100%;
    white-space:normal;
    line-height: 1.4;
  }
  .approver-text .approver-name{
    font-size: 16px;
    color: #333333;
    font-weight: 500;
  }
  /**添加的审批人样式**/
  .item-with-line{
    min-height: 50px;
  }
  .approver-item{
    display: inline-block;
    margin-top: 10px;
    font-size: $contentSize;
    color: $primary;
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
  .approver-select .el-scrollbar{
    display: block !important;
  }
  .approver-select .el-select-dropdown__wrap{
    width: 311px;
    max-height: 350px;
  }
  .loadingMoreClass{
    width: 100%;
  }
  .loadingMoreClass .el-loading-spinner .circular{
    width: 30px;
    height: 30px;
  }
</style>
