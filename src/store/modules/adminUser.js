import * as adminTypes from '../adminData.js'

/* eslint-disable */
const state = {
  userAccount: '',
  adminName: ''
};

const actions = {
  [adminTypes.ADMIN_GET_USER_INFO] (context, userData) {
    context.commit(adminTypes.ADMIN_GET_USER_INFO, userData)
  },
}

const mutations = {
  [adminTypes.ADMIN_GET_USER_INFO] (state, user) {
    state.adminName = user.adminName;
    state.userAccount = user.userAccount;
  },
};

export default {
  state,
  mutations,
  actions
}
