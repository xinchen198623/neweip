<template>
  <div class="home-wrapper">
    <div class="home-main clearfix">
      <div class="home-left">
        <home-left />
      </div>
      <div class="home-right">
        <home-right  @infoGet="showConfirmBox($event)"/>
      </div>
    </div>
    <el-dialog
  title="考勤确认提醒"
  :visible.sync="dialogVisible"
  width="390px"
  center
  :before-close="handleClose">
  <p class="notice-content">{{attendanceMonth.split('-')[0]}}年{{parseInt(attendanceMonth.split('-')[1])}}月考勤已汇总，请在<span class="highlight">{{parseInt(deadline.split('-')[1])}}月{{parseInt(deadline.split('-')[2])}}日下班前</span>确认结果，逾期未确认视为同意考勤结果。</p>
  <p class="hint">如有疑问请联系职场考勤管理员</p>
  <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose" class="button-popover">暂不确认</el-button>
    <el-button type="primary" size="medium" @click="confirm" class="button-medium-primary">查看考勤</el-button>
  </span>
</el-dialog>

  </div>
</template>

<script>
  import HomeLeft from './HomeLeft'
  import HomeRight from './HomeRight'
  import {mapState, mapMutations} from 'vuex'
  // import * as types from '../../store/mutation-types'

export default {
  components: {HomeLeft, HomeRight},
  data() {
    return {
      dialogVisible: false,
      attendanceMonth: '',
      deadline: '',
      count: 0,
      alreadyShow: false
    }
  },
  computed: {
    // alreadyShow () {
    //   return this.$store.state.user.alreadyShow
    // }
  },
  mounted () {
    // console.log(this.alreadyShow)
    this.alreadyShow = sessionStorage.getItem("alreadyShow")
    console.log('是否显示过考勤确认弹窗',this.alreadyShow)
  },
  methods: {
    // ...mapMutations([types.ALREADY_SHOW]),
    showConfirmBox (e) {
      console.log('获取弹窗信息')
      console.log(e)
      if(!this.alreadyShow) {
      // if(!this.showBox){
        this.attendanceMonth = e.month
        this.deadline = e.deadline
        this.count = e.count
        this.dialogVisible = true
      }
    },
    handleClose () {
      // console.log('closed')
      this.dialogVisible = false
      // this[types.ALREADY_SHOW]()
      sessionStorage.setItem("alreadyShow",true)
      // console.log(this.alreadyShow)

    },
    confirm () {
      // dialogVisible = false;
      this.$router.push({'path': 'attendance', 'query': {'month': this.attendanceMonth}})
      this.handleClose()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/css/variables.scss';
  @import '@/assets/css/utilities.scss';

  .home-wrapper {
    background: $bgColor;

    .home-main {
      width: $contentWidth;
      margin: 0 auto 60px;
      padding: 28px 18px;
      margin-bottom: 0px;
    }

    .home-left {
      float: left;
      width: 866px;
      margin-right: 20px;
      height: 100%;
    }

    .home-right {
      float: right;
      width: 275px;
    }
  }

  .home-foot {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 57px;
    background: #2D3237;

    ul {
      width: 556px;
      height: 57px;
      line-height: 57px;
      margin: 0 auto;
      list-style: none;
      padding: 0;
      font-size: $contentSize;
    }
    li {
      float: left;
      margin: 0 55px;
      cursor: pointer;
    }
    li:hover {
      color: #fff;
      text-decoration: underline;
    }
  }

  .clearfix:after {
    content:"";
    display: block;
    clear:both;
  }

  .notice-content {
    width: 90%;
    margin: -10px auto 0;
  }
  .highlight {
    color: $alert;
  }
  .hint {
    width: 90%;
    margin: 20px auto -20px;
    color: $minor;
  }
</style>
