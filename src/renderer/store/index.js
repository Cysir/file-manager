import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import { createPersistedState, createSharedMutations } from 'vuex-electron'

import modules from './modules'
import user from './modules/user'
Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  getters,
  plugins: [
    createPersistedState(),
    // createSharedMutations()
  ]
})
