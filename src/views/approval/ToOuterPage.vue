<template>
  <div class='toOuterPage' :style="{height: height + 'px'}" v-if="!loading">
    <div class="link-box">
      <span class="tip">查看{{tabsParam[active].text}}待审批，请打开</span>
      <a :href="tabsParam[active].url" :target="tabsParam[active].target" class="link">{{tabsParam[active].host}}系统 - {{tabsParam[active].linkText}}</a>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import { setOurterPageUrl } from '../../utils/sso.js'
let typeMap = {
  all: 0,
  attendance: 1,
  recruitment: 2,
  entry: 3,
  regularization: 4,
  dimission: 5,
  expense: 6,
  oa: 7
}

export default {
  data () {
    return {
      tabsParam: [
        {text: '全部', name: '全部', linkText: '全部', key: 'all', num: 0},
        {text: '考勤', name: '待审批-考勤', linkText: '考勤待审批', key: 'attendance', url: '', num: 0, host: 'EHR', isOuter: 1, target: ''},
        {text: '招聘', name: '待审批-招聘', linkText: '员工招聘审批', key: 'recruitment', url: '', num: 0, host: 'EHR', isOuter: 1, target: ''},
        {text: '入职', name: '待审批-入职', linkText: '员工入职审批', key: 'entry', url: '', num: 0, host: 'EHR', isOuter: 1, target: ''},
        {text: '转正', name: '待审批-转正', linkText: '员工自我鉴定', key: 'regularization', url: '', num: 0, host: 'EHR', isOuter: 1, target: ''},
        {text: '离职', name: '待审批-离职', linkText: '员工离职审批', key: 'dimission', url: '', num: 0, host: 'EHR', isOuter: 1, target: ''},
        {text: '费控', name: '待审批-费控',linkText: '费控', key: 'expense', url: '', num: 0, host: 'ERP', isOuter: 1, target: ''},
        {text: 'OA', name: '待审批-OA', linkText: '流程办结', key: 'oa', url: '', num: 0, host: 'OA', isOuter: 1, target: ''}
      ],
      navlist: [
        {
          name: '待审批',
          path: '/approval/commonApproval'
        }
      ],
      height: 200,
      timer: false,
      active: 1,
      loading: true
    }
  },
  components: {
  },
  computed: {
    ...mapState({
      historyBreadcrumb: state => state.common.breadcrumblist
    })
  },
  watch: {
    '$route' (to, from) {
      this.active = typeMap[this.$route.query.key]
    },
    height (val) {
      if (!this.timer) {
        this.height = val
        this.timer = true
        let that = this
        setTimeout(function () {
          that.timer = false
        }, 400)
      }
    }
  },
  mounted () {
    this.active = typeMap[this.$route.query.key]
    setOurterPageUrl(this.tabsParam)
    // 计算页面的高度
    this.height = document.documentElement.clientHeight - 246
    const that = this
    window.onresize = () => {
      return (() => {
        that.height = document.documentElement.clientHeight - 246
      })()
    }
    setTimeout(function() {this.loading = false}.bind(this), 300)
  },
  methods: {
    toOuterPage () {
      // gotoSitePage(this.tabsParam[this.active])
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/css/variables.scss';
  .toOuterPage{
    position: relative;
  }
  .link-box{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    text-align: center;
  }
  .link-box .tip{
    display: block;
    margin-bottom: 8px;
    color: #666666;
  }
  .link-box .link{
    font-size: 16px;
    color: $primary;
    text-decoration: underline;
    cursor: pointer;
  }
</style>
