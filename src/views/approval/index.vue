<template>
  <div class='historyPage'>
    <breadcrumb :breadlist="navlist"></breadcrumb>
    <div class="content" v-loading="tabLoading">
      <tabs ref="tab" @closeLoading="closeLoading"></tabs>
      <router-view ref="table" v-on:subNav="subNav" @updateTab="updateTab" class="routerView"/>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import tabs from './tabs.vue'
import breadcrumb from '../../components/breadcrumb.vue'

export default {
  data () {
    return {
      navlist: [
        {
          name: '待审批',
          path: '/approval/commonApproval'
        }
      ],
      subNavList: [],
      mainLoading: true,
      tabLoading: true,
    }
  },
  components: {
    tabs,
    breadcrumb
  },
  computed: {
    ...mapState({
      historyBreadcrumb: state => state.common.breadcrumblist
    }),
    ...mapState({
      userId: state => state.user.userAccount
    })
  },
  watch: {
    subNavList: {
      handler (newVal, oldVal) {
        this.setBreadcrumb([])
        this.navlist = [{name: '待审批', path: '/approval/commonApproval'}]
        this.navlist = [...this.historyBreadcrumb, ...this.subNavList, ...this.navlist]
        this.setBreadcrumb(this.navlist) // save current nav
      },
      deep: true,
      immediate: true
    },

  },
  mounted () {
  },
  methods: {
    ...mapMutations(['setBreadcrumb']),
    subNav (sublist) {
      // 将字面包屑传回
      // this.subNavList = sublist
    },
    updateTab () {
      this.tabLoading = true
      // this.$refs.tab.gettingNum = true
      this.$refs.tab.updateTab()
    },
    closeLoading(flag='right') {
      this.tabLoading = false
      // if (this.$refs.table && this.$refs.table.fetchData && flag === 'right') this.$refs.table.fetchData()
    }
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
    }
  }
  .content {
    min-height: 600px;
  }
</style>
