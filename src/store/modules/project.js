import Store from '../Store'
import {ajax, util} from '../../utils'
import { actions, mutations, apis } from '../constants'

let store = new Store({
  state: {
    list: [],
    idMap: {}
  },
  mutations: {
    [mutations.project.updateList](state, obj) {
      state.list = obj.list
      state.idMap = obj.idMap
    }
  },
  getters: {

  },
  actions: {
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
