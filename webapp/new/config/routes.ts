/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 18:45:22
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-09-17 20:04:00
 */
export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/login',
      }
    ],
  },
  {
    path: '/init',
    component: './initGuide/guide'
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    authority: ['admin', 'user'],
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        authority: ['admin', 'user'],
        routes: [
          {
            path: '/',
            redirect: '/manage/git/list'
          },
          {
            path: '/manage',
            name: 'configManage',
            routes: [
              {
                path: '/manage/git/list',
                name: 'gitList',
                component: './gitManage/gitList'
              },
              {
                path: '/manage/git/:id',
                name: 'gitEdit',
                hideInMenu: true,
                component: './gitManage/gitEdit'
              },
              {
                path: '/manage/template/list',
                name: 'templateList',
                component: './templateManage/templateList'
              },
              {
                path: '/manage/template/:id',
                name: 'templateEdit',
                hideInMenu:true,
                component: './templateManage/templateEdit'
              },
              {
                component: './404',
              }
            ]
          },
          {
            path: '/compile',
            name: 'compileManage',
            routes: [
              {
                path: '/compile/customer/list',
                name: 'customerList',
                component: "./customerManage/customerList"
              },
              {
                path: '/compile/customer/edit/:id',
                name: 'customerEdit',
                hideInMenu: true,
                component: './customerManage/customerEdit'
              },
              {
                path: '/compile/project/list',
                name: 'configList',
                component: './projectManage/projectList'
              },
              {
                path: '/compile/project/edit/:id',
                name: 'configEdit',
                hideInMenu: true,
                component: './projectManage/projectEdit'
              },
              // {
              //   path: '/compile/list',
              //   name: 'compileList',
              //   component: './compileManage/compileList'
              // },
              {
                path: '/compile/compileEdit',
                name: 'compile',
                hideInMenu: false,
                component: './compileManage/compileEdit'
              },
              {
                component: './404',
              }
            ]
          },
          {
            component: './404',
          }
        ]
      },
      {
        component: './404',
      }
    ]
  },
  {
    component: './404',
  },
];
