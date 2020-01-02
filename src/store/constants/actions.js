import { util } from '../../utils'
const actions = {
  sources: {
    querySourceList: '',
    queryProjectTree: ''
  },
  config: {
    queryConfigList: ''
  },
  compile: {
    queryCompileList: ''
  }
}
util.initializeConstants(actions, 'action')
export default actions
