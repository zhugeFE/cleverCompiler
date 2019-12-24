import Vue from 'vue'
import Vuex from 'vuex'

import sources from './modules/sources'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    sources
  },
  strict: debug,
  devtools: process.env.NODE_ENV !== 'production'
})