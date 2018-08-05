<template>
  <div class='historyPage'>
    <breadcrumb :breadlist="navlist"></breadcrumb>
    <div class="content" v-loading="loading">
      <tabs :tabsParam="tabsParam" :show-tab="!loading" :active="active" @activeChanged="activeChanged"></tabs>
      <tables :tabsParam="tabsParam" :active="active" v-if="!loading"></tables>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import tabs from './tabs.vue'
import breadcrumb from '../../components/breadcrumb.vue'
import * as api from '../../api/history'
import tables from '../commonApply/history.vue'
import { setOurterPageUrl } from '../../utils/sso.js'

export default {
  data () {
    return {
      navlist: [
        {
          name: '我的申请',
          path: '/history/commonApplyHistory'
        }
      ],
      loading: true,    //全表loading
      active: 0,
      tabsParam: [
        {text: '全部', title: '全部', key: 'all', num: 0,tag:'all'},
        {text: '漏打卡', title: '漏打卡历史记录', name: '我的申请-漏打卡', key: 'shenQingLouDaKa', tag:'leakCard', num: 0, host: 'EHR', url: 'commonApply', isOuter: 1},
        {text: '休假', title: '休假历史记录', name: '我的申请-休假', key: 'shenQingXiuJia', tag: 'offShift',num: 0, host: 'EHR', url: 'commonApply', isOuter: 1},
        {text: '加班', title: '加班历史记录', name: '我的申请-加班', key: 'shenQingJiaBan', tag: 'overTime', num: 0, host: 'EHR', url: 'commonApply', isOuter: 1},
        {text: '公出', title: '公出历史记录', name: '我的申请-公出', key: 'shenQingGongChu', tag: 'publicOut', num: 0, host: 'EHR', url: 'commonApply', isOuter: 1},
        {text: '转正', title: '员工自我鉴定', name: '我的申请-转正', key: 'shenQingZhuanZheng', tag: 'regularization', num: 0, host: 'EHR', url: 'commonApply', isOuter: 1},
        {text: '离职', title: '员工离职申请', name: '我的申请-离职', key: 'shenQingLiZhi', tag: 'dimission', num: 0, host: 'EHR', url: 'commonApply', isOuter: 1},
        {text: '费控', title: '费控', name: '费控', key: 'shenQingFeiKong', num: 0, tag: 'expense', host: 'ERP', url: 'commonApply', isOuter: 1},
        {text: 'OA', title: '流程办结', name: '我的申请-OA', key: 'shenQingOA', num: 0, tag: 'oa', host: 'OA', url: 'commonApply', isOuter: 1},
        {text: '基础费用', title: '我的申请-基础费用', key: 'basefee', num: 0, tag: 'baseFee', host: '', url: 'commonApply', isOuter: 0},
        {text: '权限/IT', title: '我的申请-权限/IT', key: 'right', num: 0, tag: 'right', host: '', url: 'commonApply', isOuter: 0}, // 请用正确的路径替换
        {text: '其他', title: '我的申请-其他', key: 'other', num: 0, tag: 'other', host: 'EHR', url: 'commonApply', isOuter: 0} // 请用正确的路径替换
      ],
    }
  },
  computed: {
    ...mapState({
      historyBreadcrumb: state => state.common.breadcrumblist,
      userId: state => state.user.userAccount
    })
  },
  components: {
    tabs,
    tables,
    breadcrumb
  },
  watch: {
    userId: function (newValue, oldValue) {
      if (newValue.length > 0) {
        this.getHistoryTabNums(this.active)
      }
    },
  },
  mounted () {
    if (this.userId.length > 0) {
      this.getHistoryTabNums()
    }
    this.initRouter();
  },
  methods: {
    ...mapMutations(['setBreadcrumb']),
    // subNav (sublist) {
    //   // 将字面包屑传回
    //   // this.subNavList = sublist // 暂时屏蔽，等确认需求再修改
    //   // this.navlist.path = sublist[0].path
    // },
    async initRouter() {
      setOurterPageUrl(this.tabsParam)
    },
    async getHistoryTabNums () {
      // 获取tab各项数量
      try {
        const data = await api.getTabs(this.userId)
        console.log('TAB data',data)
        let totalCount = 0
        let count = {
          leakCard: 0,
          offShift: 0,
          overTime: 0,
          publicOut: 0,
          regularization: 0,
          dimission: 0,
          expense: 0,
          oa: 0,
          baseFee: 0,
          right: 0,
          other: 0,
          entry: 0, // 不要
          recruitment: 0 // 不要
        }
        
        let all = data.allApplies
        for(let item in all){
          if(item==='attendance' || item==='rzdl'){
            for(let subItem in all[item]){
              count[subItem]=all[item][subItem]
            }
          } else{
            count[item]=all[item]
          }
        }
        
        for(let item in count) {
          if(item==='entry' || item==='recruitment') {
            continue
          }
          totalCount += count[item]
        }


        let tabsParam = this.tabsParam
        for(let i=1;i<tabsParam.length;i++) {
          for(let item in count){
            if (tabsParam[i].tag === item) {
              tabsParam[i].num = count[item]
            }
          }
        }
        tabsParam[0].num = totalCount
        this.tabsParam = tabsParam
        // console.log('刷新tab',this.active, this.tabsParam[this.active])
        if(this.active==0 || this.tabsParam[this.active].num<=0){
          for (let i = this.tabsParam.length - 1; i > 0; i--) {
            if (this.tabsParam[i].num > 0) {
              this.active = i
            }
          }
        }
        this.loading=false
      } catch (err) {
        debuglog(err)
      }
    },
    activeChanged (e) {
      this.active = e
      // 切换tab时刷新tab
      console.lo
      this.getHistoryTabNums()
    },
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/css/variables.scss';
  .historyPage {
    color: $secondary;
    font-size: $contentSize;
    font-weight: normal;
    .content {
      padding: 0 0 30px;
      min-height: 600px;
    }
  }
</style>
