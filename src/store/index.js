import Vue from 'vue'
import Vuex from 'vuex'

import project from './modules/project'
import configs from './modules/configs'
import compile from './modules/compile'
import common from './modules/common'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    project,
    configs,
    compile,
    common
  },
  strict: debug,
  devtools: process.env.NODE_ENV !== 'production'
})