import Vue from 'vue'
import Router from 'vue-router'
import login from '../modules/login/index'
import layout from '../modules/layout/index'
import manageLayout from '../modules/layout/manage'
import compileLayout from '../modules/layout/compile'

import projectList from '../modules/manageProject/index'
import projectInfo from '../modules/manageProject/info'
import groupList from '../modules/manageGroup/index'
import groupInfo from '../modules/manageGroup/info'

import compileList from '../modules/compileConfigs/index'
import compileInfo from '../modules/compileConfigs/info'
import compileRelease from '../modules/compileRelease/index'


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
        name: routes.manage.project.list
      },
      children: [
        {
          path: 'manage',
          name: routes.manage.layout,
          component: manageLayout,
          redirect: {
            name: routes.manage.project.list
          },
          children: [
            {
              path: 'project/list',
              name: routes.manage.project.list,
              component: projectList
            },
            {
              path: 'project/create',
              name: routes.manage.project.create,
              component: projectInfo
            },
            {
              path: 'project/:id/info',
              name: routes.manage.project.info,
              component: projectInfo
            },
            {
              path: 'group/list',
              name: routes.manage.group.list,
              component: groupList
            },
            {
              path: 'group/create',
              name: routes.manage.group.create,
              component: groupInfo
            },
            {
              path: 'group/:id/info',
              name: routes.manage.group.info,
              component: groupInfo
            }
          ]
        },
        {
          path: 'compile',
          name: routes.compile.layout,
          component: compileLayout,
          redirect: {
            name: routes.compile.configs.list
          },
          children: [
            {
              path: 'release',
              name: routes.compile.release,
              component: compileRelease
            },
            {
              path: 'configs/list',
              name: routes.compile.configs.list,
              component: compileList
            },
            {
              path: 'configs/create',
              name: routes.compile.configs.create,
              component: compileInfo
            },
            {
              path: 'configs/:id/info',
              name: routes.compile.configs.info,
              component: compileInfo
            }
          ]

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