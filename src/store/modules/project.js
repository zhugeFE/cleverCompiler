import Vue from 'vue'
import Store from '../Store'
import {ajax, util} from '../../utils'
import { actions, mutations, apis } from '../constants'
import versions from "../json/queryVersions";

let store = new Store({
  state: {
    list: [],
    idMap: {}
  },
  mutations: {
    [mutations.project.updateList](state, obj) {
      state.list = obj.list
      state.idMap = obj.idMap
    },
    [mutations.project.addProject](state, data) {
      state.list.push(data)
      state.idMap[data.id] = data
    },
    [mutations.project.editProject](state, data) {
      state.list.forEach((item, i) => {
        if (data.id === item.id) {
          let newData = item
          for (let prop in data) {
            newData[prop] = data[prop]
          }
          Vue.set(state.list, i, newData)
          Vue.set(state.idMap, item.id, newData)
        }
      })
    }
  },
  getters: {

  },
  actions: {
    [actions.project.addProject](context, params) {
      return new Promise((resolve, reject) => {
        try {
          console.log(context, params)
          setTimeout(() => {
            // context.commit(mutations.project.addProject, {
            //   id:
            // })
            resolve(versions.data)
          }, 1000)
        } catch (e) {
          reject(e)
        }
        // ajax({
        //   url: apis.project.addProject,
        //   method: 'post',
        //   data: params
        // }).then((res) => {
        //   resolve(res.data)
        // }).catch((error) => {
        //   reject(error)
        // })
      })
    },
    [actions.project.editProject](context, params) {
      return new Promise((resolve, reject) => {
        ajax({
          url: apis.project.editProject,
          method: 'post',
          data: params
        }).then((res) => {
          resolve(res.data)
        }).catch((error) => {
          reject(error)
        })
      })
    },
    [actions.project.querySourceList](context, force) {
      return new Promise((resolve, reject) => {
        if (context.state.ready.list && !force) {
          resolve()
          return
        }
        store.setReady(context, 'list', false)
        // todo ajax 请求
        try {
          let list = []
          let idMap = {}
          for (let i = 0; i < 20; i++) {
            let versions = []
            for (let n = 0; n < 20; n++) {
              let version = {
                id: n,
                name: '10.' + n,
                date: '2019.02.18',
                README: 'readme' + n,
                BUILD: 'build' + n,
                UPDATE: 'update' + n,
                cmdList: ['yarn' + n, 'npm run build' + n],
                configList: []
              }
              versions.push(version)
            }
            let latestVersion = versions[versions.length - 1]

            let item = {
              id: i,
              name: '项目' + i,
              gitUrl: 'git-' + i,
              latestVersion: latestVersion,
              versionList: versions
            }
            list.push(item)
            idMap[item.id] = item
          }
          context.commit(mutations.project.updateList, {
            list,
            idMap
          })
          store.setReady(context, 'list', true)
          resolve()
        }catch (e) {
          reject()
        }
      })
    },
    [actions.project.queryProjectTree](context, params) {
      return new Promise((resolve, reject) => {
        ajax({
          url: util.strReplace(apis.project.queryProjectTree, {name: params.name}),
          method: 'get'
        }).then((res) => {
          resolve(res)
        }).catch((error) => {
          reject(error)
        })
      })
    }
  }
})

export default store
