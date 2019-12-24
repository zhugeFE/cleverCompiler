import Store from '../Store'
import { actions, mutations } from '../constants'

let store = new Store({
  state: {
    list: []
  },
  mutations: {
    [mutations.sources.updateList](state, list) {
      state.list = list
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
          for (let i = 0; i < 3; i++) {
            let item = {}
            for (let j = 0; j < 5; j++) {
              item['id'] = Math.random()
              item['name'] = `name-${i}`
              item['version'] = `version-${i}`
              item['readmeUrl'] = `readmeUrl-${i}`
              item['buildUrl'] = `buildUrl-${i}`
            }
            list.push(item)
          }
          context.commit(mutations.sources.updateList, list)
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
