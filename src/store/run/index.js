import actions from './actions';
import getters from './getters';
import mutations from './mutations';

export default({
    state: {
      stateTable: {
        I: [],
        Q: [],
        V: [],
        T: [],
        C: [],
      },
      run: false,
      panelRun: false
    },
    mutations,
    getters,
    actions,
})