import Store from '../Store'
import {ajax, util} from '../../utils'
import { actions, mutations, apis } from '../constants'

let store = new Store({
  state: {
    list: [],
    idMap: {}
  },
  mutations: {
    [mutations.sources.updateList](state, obj) {
      state.list = obj.list
      state.idMap = obj.idMap
    }
  },
  getters: {

  },
  actions: {
    [actions.sources.querySourceList](context, force) {
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
          for (let i = 0; i < 3; i++) {
            let item = {}
            let versions = []
            for (let n = 0; n < 20; n++) {
              let version = {
                name: '10.' + n,
                date: '2019.02.18',
                README: 'readme' + n,
                BUILD: 'build' + n,
                UPDATE: 'update' + n,
                cmdList: [],
                configList: []
              }
              versions.push(version)
            }
            let latestVersion = versions[versions.length - 1]
            for (let j = 0; j < 5; j++) {
              item['id'] = Math.random()
              item['name'] = `name-${i}`
              item['gitUrl'] = `git-${i}`
              item['latestVersion'] = latestVersion
              item['versionList'] = versions
            }
            list.push(item)
            idMap[item.id] = item
          }
          context.commit(mutations.sources.updateList, {
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
    [actions.sources.queryProjectTree](context, params) {
      return new Promise((resolve, reject) => {
        ajax({
          url: util.strReplace(apis.sources.queryProjectTree, {name: params.name}),
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
