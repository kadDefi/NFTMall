import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters.js'

import wallet from './modules/wallet.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    wallet,
  },
  getters,
});

export default store;