import Vue from 'vue'
import Router from 'vue-router'
import login from '../modules/login/index'
import layout from '../modules/layout/index'

import configs from '../modules/configs/index'

Vue.use(Router)

export default new Router({
  base: '',
  routes: [
    {
      path: '/',
      redirect: {
        name: 'app'
      }
    },
    {
      path: '/app',
      name: 'app',
      component: layout,
      redirect: {
        name: 'configs'
      },
      children: [
        {
          path: 'configs/list',
          name: 'configs',
          component: configs
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: login
    }
  ],
  mode: 'history'
})