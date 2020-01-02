import Store from '../Store'
import { actions, mutations } from '../constants'

let store = new Store({
  state: {
    list: [],
    idMap: {}
  },
  mutations: {
    [mutations.compile.updateList](state, obj) {
      state.list = obj.list
      state.idMap = obj.idMap
    }
  },
  getters: {

  },
  actions: {
    [actions.compile.queryCompileList](context, force) {
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
            let item = {
              id: i,
              name: '客户' + i,
              type: 3,
              last_time: '2019-12-17T06:29:00.000Z',
              create_time: '2017-08-31T08:52:29.000Z',
            }
            list.push(item)
            idMap[item.id] = item
          }
          context.commit(mutations.compile.updateList, {
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
