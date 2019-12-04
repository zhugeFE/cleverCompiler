import Vue from 'vue'
import Router from 'vue-router'
import Home from '../modules/Home.vue'
import About from '../modules/About.vue'

Vue.use(Router)

export default new Router({
  base: '',
  routes: [
    {
      path: '/',
      redirect: {
        name: 'home'
      }
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ],
  mode: 'history'
})
