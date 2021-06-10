import { createStore } from 'vuex'

export default createStore({
  state: {
    selected: {n:0,r:0,b:0},
    network: [],
    menu: {
        contact: false,
        coil: false,
        blocks: false,
    },
  },
  mutations: {
    setNetwork({state}, network){
      state.network = network
    }
  },
  actions: {
    initialize(){
      
    }
  },
  modules: {
  }
})
