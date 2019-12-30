import Vue from 'vue'
import Router from 'vue-router'
import login from '../modules/login/index'
import layout from '../modules/layout/index'

import sources from '../modules/sources/index'
import sourcesDetail from '../modules/sources/detail'
import config from '../modules/config/index'
import configDetail from '../modules/config/detail'

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
        name: 'sources'
      },
      children: [
        {
          path: 'sources',
          name: 'sources',
          component: sources
        },
        {
          path: 'sources/:id',
          name: 'sourcesDetail',
          component: sourcesDetail
        },
        {
          path: 'config/list',
          name: 'config',
          component: config
        },
        {
          path: 'config/:id/detail',
          name: 'configDetail',
          component: configDetail
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