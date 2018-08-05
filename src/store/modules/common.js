const state = {
  breadcrumblist: []
}

const mutations = {
  setBreadcrumb: function (state, payload) {
    state.breadcrumblist = payload
  }
}

export default {
  state,
  mutations
}
