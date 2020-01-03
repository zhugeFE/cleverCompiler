import { util } from '../../utils'
const actions = {
  project: {
    querySourceList: '',
    queryProjectTree: ''
  },
  configs: {
    queryConfigList: ''
  },
  compile: {
    queryCompileList: ''
  }
}
util.initializeConstants(actions, 'action')
export default actions
