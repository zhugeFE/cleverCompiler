/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 18:45:22
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-25 15:32:28
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
                name: '客户列表',
                component: "./compileManage/customerList"
              },
              {
                path: '/compile/customer/:id',
                name: 'customerEdit',
                hideInMenu: true,
                component: './compileManage/customerEdit'
              },
              {
                path: '/compile/project/list',
                name: '项目列表',
                component: './compileManage/projectList'
              },
              {
                path: '/compile/project/:id',
                name: 'projectEdit',
                hideInMenu: true,
                component: './compileManage/projectEdit'
              },
              {
                path: '/compile/list',
                name: '编译列表',
                component: './compileManage/compileList'
              },
              {
                path: '/compile/edit',
                name: 'compileEdit',
                hideInMenu: true,
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
