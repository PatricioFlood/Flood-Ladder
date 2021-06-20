import { createStore } from 'vuex'
import mutations from "./mutations.js"
import getters from "./getters.js"
import actions from "./actions.js"
import run from "./run/index.js"

export default createStore({
  state: {
    selected: {n: 0, r: 0, b: 0},
    network: [],
    currentView: "ladder",
    symbolTable: [],
  },
  mutations,
  getters,
  actions,
  modules: {run}
})
