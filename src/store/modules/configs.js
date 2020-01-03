import Store from '../Store'
import { actions, mutations } from '../constants'

let store = new Store({
  state: {
    list: [],
    idMap: {}
  },
  mutations: {
    [mutations.configs.updateList](state, obj) {
      state.list = obj.list
      state.idMap = obj.idMap
    }
  },
  getters: {

  },
  actions: {
    [actions.configs.queryConfigList](context, force) {
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
            let versions = []
            for (let n = 0; n < 20; n++) {
              let version = {
                id: n,
                name: '12.' + n,
                date: '2019.12.30',
                README: 'readme' + n,
                BUILD: 'build' + n,
                UPDATE: 'update' + n,
                globalConfig: [],
                projects: [{
                  id: n,
                  version_id: n,
                  buildMod: 'downLoad'
                }]
              }
              versions.push(version)
            }
            let latestVersion = versions[versions.length - 1]

            let item = {
              id: i,
              name: '私有部署-' + i,
              latestVersion: latestVersion,
              versionList: versions
            }
            list.push(item)
            idMap[item.id] = item
          }
          context.commit(mutations.configs.updateList, {
            list,
            idMap
          })
          store.setReady(context, 'list', true)
          resolve()
        }catch (e) {
          reject()
        }
      })
    }
  }
})

export default store
