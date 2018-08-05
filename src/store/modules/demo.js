import * as types from '../mutation-types'
import { getDefaultData } from '../../api/demo'

const state = {
  title: 'this is a demo page',
  subTitle: 'this is a sub title',
  data: [],
  complexData: {
    name: '',
    address: {
      city: 'Beijing',
      street: 'HaiDian'
    },
    list: [1, 2, 3]
  }
}

const actions = {
  async [types.REFRESH_DEMOPAGE] ({commit}, {title, subTitle}) {
    const {data} = await getDefaultData()
    commit(types.REFRESH_DEMOPAGE, {title, subTitle, data})
  }
}

const mutations = {
  // state: original state object
  // data: the data object to be updated to state
  [types.REFRESH_DEMOPAGE] (state, {
    title,
    subTitle,
    data
  }) {
    state.title = title
    state.subTitle = subTitle
    state.data = data
    // state = {title, subTitle}  // not work
  }
}

const getters = {
  fullAddress: state => state.complexData.address.city + ' ' + state.complexData.address.street,
  dataBigger: state => (value) => {
    let result = []
    if (typeof (value) === 'number') {
      result = state.complexData.list.filter(d => d > value)
    }
    return result
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
