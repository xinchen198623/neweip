import * as types from '../mutation-types'
import * as api from '../../api/user'

/* eslint-disable */
const state = {
  department: '',
  duty: '',
  id: '',
  name: '',
  userAccount: '',
  alreadyShow: false
}

const actions = {
  async [types.GET_USER_INFO] ({commit}) {
    try {
      const userData = await api.getUserInfo()
      commit(types.GET_USER_INFO, {...userData})
    } catch (err) {
      debuglog(err)
    }
  },
  async [types.LOGOUT] ({commit}) {
    try {
      const success = await api.logout()
      // if(success) {
        commit(types.LOGOUT_SUCCESS)
        window.sessionStorage.removeItem("token");
      // }else {
      //   debuglog('logout fail')
      //   commit(types.LOGOUT_FAILURE)
      // }
      // return success
    } catch (err) {
      debuglog(err)
    }
  },
}

const mutations = {
  [types.LOGIN_SUCCESS] (state, user) {
    state.name = user.name
    state.department = user.department
    state.userAccount = user.userAccount
    state.duty = user.duty
    state.id = user.id
  },
  [types.LOGOUT_SUCCESS] (state) {
    state.name = ''
    state.department = ''
    state.userAccount = ''
    state.duty = ''
    state.id = ''
  },
  [types.LOGOUT_FAILURE] (state) {
  },
  [types.GET_USER_INFO] (state,user) {
    state.name = user.name
    state.department = user.department
    state.userAccount = user.userAccount
    state.duty = user.duty
    state.id = user.id
  },
  [types.ALREADY_SHOW] (state){
    state.alreadyShow = true
  }
}

export default {
  state,
  mutations,
  actions
}
