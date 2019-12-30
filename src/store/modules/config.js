import Store from '../Store'
import { actions, mutations } from '../constants'

let store = new Store({
  state: {
    list: [],
    idMap: {}
  },
  mutations: {
    [mutations.config.updateList](state, obj) {
      state.list = obj.list
      state.idMap = obj.idMap
    }
  },
  getters: {

  },
  actions: {
    [actions.config.queryConfigList](context, force) {
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
                cmdList: ['yarn' + n, 'npm run build' + n],
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
    }
  }
})

export default store
