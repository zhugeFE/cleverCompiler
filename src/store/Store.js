import { util } from '../utils/index'
class Store {
  constructor(
    config = {
      state: {},
      mutations: {},
      getters: {},
      actions: {}
    }
  ) {
    this.id = util.guid()

    this.state = this.getState(config)
    this.mutations = this.getMutation(config)
    this.getters = config.getters
    this.actions = config.actions
  }
  getState(config) {
    let result = util.clone(config.state)
    result.error = {}
    result.ready = {}
    for (let key in config.state) {
      result[key] = config.state[key]
      result.ready[key] = false
      result.error[key] = false
    }
    return result
  }
  getMutation(config) {
    let mutation = util.clone(config.mutations)
    for (let key in config.state) {
      let firstCode = key.match(/\S/)[0]
      let name = key.replace(firstCode, firstCode.toUpperCase())

      mutation[`set${name}Ready${this.id}`] = (state, status) => {
        state.ready[key] = status
      }
      mutation[`set${name}Error${this.id}`] = (state, status) => {
        state.error[key] = status
      }
    }
    return mutation
  }
  setReady(context, state, status) {
    let firstCode = state.match(/\S/)[0]
    let name = state.replace(firstCode, firstCode.toUpperCase())
    context.commit(`set${name}Ready${this.id}`, status)
  }
  setError(context, state, status) {
    let firstCode = state.match(/\S/)[0]
    let name = state.replace(firstCode, firstCode.toUpperCase())
    context.commit(`set${name}Error${this.id}`, status)
  }
}
export default Store
