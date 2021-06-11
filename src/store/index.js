import { createStore } from 'vuex'
import mutations from "./mutations.js"
import getters from "./getters.js"
import actions from "./actions.js"

export default createStore({
  state: {
    selected: {n: 0, r: 0, b: 0},
    network: [],
  },
  mutations,
  getters,
  actions,
  modules: {}
})
