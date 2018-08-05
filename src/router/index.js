import Vue from 'vue'
import Router from 'vue-router'

const main = () => import('../views/main')
const demo = () => import('../views/demo/demo.vue')
const attendance = () => import('../views/attendance/index.vue')

const punchClock = () => import('../views/punchClock/index.vue')
const punchClockdetail = () => import('../views/punchClock/detail.vue')
const punchClockleakcard = () => import('../views/punchClock/leakcard.vue')

const vacation = () => import('../views/vacation/index.vue')
const vacationdetail = () => import('../views/vacation/detail.vue')

const business = () => import('../views/business/index.vue')

// 通用审批实例
const commonApply2 = () => import('../views/commonApply/index2.vue') // 只有上传文件
const commonApply1 = () => import('../views/commonApply/index1.vue') // 下载模板和上传文件
const commonApply = () => import('../views/commonApply/index.vue')
const commonApplyDetail = () => import('../views/commonApply/detail.vue')

// 我的申请
const history = () => import('../views/history/index.vue')
const businessHistory = () => import('../views/business/history.vue')
const punchClockHistory = () => import('../views/punchClock/history.vue')
const commonApplyHistory = () => import('../views/commonApply/history.vue')
const twoweekapply = () => import('../views/twoweekapply/index.vue')
const toOuterPageHistory = () => import('../views/history/ToOuterPage.vue')

// 待审批
const approval = () => import('../views/approval/index.vue')
const commonApproval = () => import('../views/commonApply/approval.vue')
const home = () => import('../views/home/home.vue')

// 替换审批人
const alterApproval = () => import('../views/alterApproval/alterApproval.vue');
const limitsLogin = () => import('../views/alterApproval/limitsLogin.vue');
const index = () => import('../views/alterApproval/index.vue');

// 跳转到其他系统页面
const toOuterPage = () => import('../views/approval/ToOuterPage.vue')

// 待完成页面
const todo = () => import('../views/todo/todo.vue')

// 权限设置
const authorization = () => import('../views/authorization/index.vue')

// 404不存在
const notExistence = () => import('../views/notExistence/index.vue')
Vue.use(Router)

window.debuglog = function () {
  if (process.env.NODE_ENV === 'development') {
    console.log(...arguments)
  }
}

const router = new Router({
  routes: [
    {
      path: '/',
      component: main,
      children: [
        {
          name: 'home',
          path: '/',
          component: home,
          meta: {
            title: '企业信息化门户'
          }
        },
        {
          path: '/demo',
          component: demo,
          meta: {
            title: '示例页面'
          }
        },
        {
          name: 'twoweekapply',
          path: 'twoweekapply',
          component: twoweekapply,
          meta: {
            title: '两周内申请'
          }
        },
        {
          name: 'attendance',
          path: '/attendance',
          component: attendance,
          meta: {
            title: '考勤查询'
          }
        },
        {
          name: 'history',
          path: '/history',
          component: history,
          children: [
            {name: 'punchClockHistory', path: 'punchClock', component: punchClockHistory, meta: {title: '我的申请'}},
            {name: 'businessHistory', path: 'business', component: businessHistory, meta: {title: '我的申请'}},
            {
              name: 'commonApplyHistory',
              path: 'commonApplyHistory',
              component: commonApplyHistory,
              meta: {title: '我的申请'}
            },
            {name: 'toOuterPageHistory', path: 'toOuterPage', component: toOuterPageHistory, meta: {title: '我的申请'}}
          ]
        },
        {
          name: 'approval',
          path: '/approval',
          component: approval,
          children: [
            {name: 'commonApproval', path: 'commonApproval', component: commonApproval, meta: {title: '待审批'}},
            {name: 'toOuterPageApproval', path: 'toOuterPageApproval', component: toOuterPage, meta: {title: '待审批'}}
          ]
        },
        {
          name: 'punchClock',
          path: '/punchClock',
          component: punchClock,
          meta: {
            title: '漏打卡申请'
          }
        },
        {
          name: 'punchclockDetail',
          path: '/punchclock/detail',
          component: punchClockdetail,
          meta: {
            title: '详情'
          }
        },
        {
          name: 'punchclockleakcard',
          path: '/punchclock/leakcard',
          component: punchClockleakcard,
          meta: {
            title: '漏打卡'
          }
        },
        {
          name: 'vacation',
          path: '/vacation',
          component: vacation,
          meta: {
            title: '休假申请'
          }
        },
        {
          name: 'vacationdetail',
          path: '/vacation/detail',
          component: vacationdetail
        },
        {
          name: 'business',
          path: '/business',
          component: business,
          meta: {
            title: '公出申请'
          }
        },
        {
          name: 'commonApply',
          path: '/commonApply',
          component: commonApply,
          meta: {
            title: '通用申请'
          }
        },
        {
          name: 'commonApply1',
          path: '/commonApply1',
          component: commonApply1,
          meta: {
            title: '通用申请'
          }
        },
        {
          name: 'commonApply2',
          path: '/commonApply2',
          component: commonApply2,
          meta: {
            title: '通用申请'
          }
        },
        {
          path: '/commonApply/detail',
          component: commonApplyDetail
        },
        {
          name: 'todo',
          path: '/todo',
          component: todo
        },
        {
          name: 'authorization',
          path: '/authorization',
          component: authorization
        },
        {
          name: 'alter',
          path: 'alter',
          component: alterApproval,
          meta: {
            title: '替换审批人',
          }
        },
        {
          name: '404',
          path: '/404',
          component: notExistence
        }
      ]
    },
    {
      name: 'admin',
      path: '/admin',
      component: limitsLogin,
      meta: {
        title: '登录页'
      }
    },
    {
      name: 'index',
      path: '/index',
      component: index,
      redirect: '/index/alterApproval',
      children: [
        {
          name: 'alterApproval',
          path: 'alterApproval',
          component: alterApproval,
          meta: {
            title: '替换审批人',
            admin: true,
            auth: true
          }
        },
      ]
    },
    {
      path: '*',
      redirect: '/404'
    }
  ],
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {x: 0, y: 0}
    }
  }
})

router.afterEach((to, from) => {
  const title = to.meta && to.meta.title ? to.meta.title : '企业信息化平台'
  document.title = title
})
router.beforeEach((to, from, next) => {
  if (to.meta.admin) {
    if (to.path === '/admin' || to.path === '/index/alterApproval') {
      next();
    } else {
      if (to.meta.auth && !sessionStorage.getItem('userData')) {
        next({path: '/admin'});
      } else {
        next();
      }
    }
  } else {
    next();
  }
})

export default router
