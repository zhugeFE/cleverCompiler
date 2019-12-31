import Vue from 'vue'
import Vuex from 'vuex'

import sources from './modules/sources'
import config from './modules/config'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    sources,
    config
  },
  strict: debug,
  devtools: process.env.NODE_ENV !== 'production'
})