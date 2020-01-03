import Vue from 'vue'
import Router from 'vue-router'
import login from '../modules/login/index'
import layout from '../modules/layout/index'

import projectList from '../modules/project/index'
import projectInfo from '../modules/project/info'

import configs from '../modules/configs/index'
import configInfo from '../modules/configs/info'

import compile from '../modules/compile/action'
import compileList from '../modules/compile/list'
import compileInfo from '../modules/compile/info'

import { routes } from './constants'

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
        name: routes.project.list
      },
      children: [
        {
          path: 'project/list',
          name: routes.project.list,
          component: projectList
        },
        {
          path: 'project/create',
          name: routes.project.create,
          component: projectInfo
        },
        {
          path: 'project/:id/info',
          name: routes.project.info,
          component: projectInfo
        },
        {
          path: 'configs/list',
          name: routes.configs.list,
          component: configs
        },
        {
          path: 'configs/create',
          name: routes.configs.create,
          component: configInfo
        },
        {
          path: 'configs/:id/info',
          name: routes.configs.info,
          component: configInfo
        },
        {
          path: 'compile',
          name: routes.compile.action,
          component: compile
        },
        {
          path: 'compile/list',
          name: routes.compile.list,
          component: compileList
        },
        {
          path: 'compile/create',
          name: routes.compile.create,
          component: compileInfo
        },
        {
          path: 'compile/:id/info',
          name: routes.compile.info,
          component: compileInfo
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