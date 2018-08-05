<template>
  <div class='toOuterPage' v-if="active" :style="{height: height + 'px'}">
    <div class="link-box">
      <span class="tip">查看{{tabsParam[active].text}}申请，请打开</span>
      <!-- <span class="link" @click="toOuterPage">{{tabsParam[active].host}}系统 - {{tabsParam[active].name}}</span> -->
      <a target="view_window" :href="tabsParam[active].url" class="link">{{tabsParam[active].host}}系统 - {{tabsParam[active].title}}</a>
    </div>
  </div>
  <div class="empty-page" v-else :style="{height: height + 'px'}">
    <div class="center-con">
      <img src="../../assets/img/table_empty.png"/>
      <p>暂无历史申请内容</p>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
// import { gotoSitePage } from '../../utils/sso.js'
import { setOurterPageUrl } from '../../utils/sso.js'
let keyList = {
  all: 0,
  leakCard: 1,
  offShift: 2,
  overTime: 3,
  publicOut: 4,
  regularization: 5,
  dimission: 6,
  expense: 7,
  oa: 8
}
let tabsParam = [
  {text: '全部', title: '全部', key: 'all', num: 0},
  {text: '漏打卡', title: '漏打卡历史记录', name: '我的申请-漏打卡', key: 'shenQingLouDaKa', num: 0, host: 'EHR', url: 'commonApply', isOuter: 1},
  {text: '休假', title: '休假历史记录', name: '我的申请-休假', key: 'shenQingXiuJia', num: 0, host: 'EHR', url: 'commonApply', isOuter: 1},
  {text: '加班', title: '加班历史记录', name: '我的申请-加班', key: 'shenQingJiaBan', num: 0, host: 'EHR', url: 'commonApply', isOuter: 1},
  {text: '公出', title: '公出历史记录', name: '我的申请-公出', key: 'shenQingGongChu', num: 0, host: 'EHR', url: 'commonApply', isOuter: 1},
  {text: '转正', title: '员工自我鉴定', name: '我的申请-转正', key: 'shenQingZhuanZheng', num: 0, host: 'EHR', url: 'commonApply', isOuter: 1},
  {text: '离职', title: '员工离职申请', name: '我的申请-离职', key: 'shenQingLiZhi', num: 0, host: 'EHR', url: 'commonApply', isOuter: 1},
  {text: '费控', title: '费控', name: '费控', key: 'shenQingFeiKong', num: 0, host: 'ERP', url: 'commonApply', isOuter: 1},
  {text: 'OA', title: '流程办结', name: '我的申请-OA', key: 'shenQingOA', num: 0, host: 'OA', url: 'commonApply', isOuter: 1},
  {text: '基础费用', title: '我的申请-基础费用', key: 'basefee', num: 0, host: '', url: 'commonApply', isOuter: 0},
  {text: '权限/IT', title: '我的申请-权限/IT', key: 'right', num: 0, host: '', url: 'commonApply', isOuter: 0}, // 请用正确的路径替换
  {text: '其他', title: '我的申请-其他', key: 'other', num: 0, host: 'EHR', url: 'commonApply', isOuter: 0} // 请用正确的路径替换
]
export default {
  data () {
    return {
      tabsParam,
      navlist: [
        {
          name: '我的申请',
          path: '/approval/commonApproval'
        }
      ],
      height: 200,
      timer: false,
      active: 0
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
      this.active = keyList[this.$route.query.key]
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
    // this.active = this.$route.query.index
    this.active = keyList[this.$route.query.key]
    // 计算页面的高度
    this.height = document.documentElement.clientHeight - 246
    const that = this
    window.onresize = () => {
      return (() => {
        that.height = document.documentElement.clientHeight - 246
      })()
    }
    this.initInfo();
  },
  methods: {
    // toOuterPage () {
    //   gotoSitePage(this.tabsParam[this.active])
    // },
    async initInfo() {
      // console.log('init info')
      setOurterPageUrl(this.tabsParam)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/css/variables.scss';
  .toOuterPage{
    position: relative;
  }
  .link-box,.empty-page .center-con{
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
  .empty-page .center-con{
    margin-top: 0;
    margin-bottom: 0;
  }

</style>
