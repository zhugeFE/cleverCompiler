import '@babel/polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import cleverUI from 'clever-ui'
import 'clever-ui/lib/theme-default/main.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(cleverUI)
Vue.use(ElementUI)
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

