import Store from '../Store'
import { actions, mutations } from '../constants'

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
              versions.push({
                name: '10.' + n,
                date: '2019.02.18',
                readme: 'readme' + n,
                build: 'build' + n,
                update: 'update' + n
              })
            }
            for (let j = 0; j < 5; j++) {
              item['id'] = Math.random()
              item['name'] = `name-${i}`
              item['gitUrl'] = `git-${i}`
              item['version'] = `version-${i}`
              item['readmeUrl'] = `readmeUrl-${i}`
              item['buildUrl'] = `buildUrl-${i}`
              item['versionList'] = versions
              item['cmdList'] = []
              item['configList'] = []
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
