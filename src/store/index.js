import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import mutations from './mutations'
import actions from './actions'

import demo from './modules/demo'
import user from './modules/user'
import common from './modules/common'
import adminUser from './modules/adminUser'

const debug = process.env.NODE_ENV !== 'production'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    demo,
    user,
    common,
    adminUser
  },
  mutations,
  actions,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
