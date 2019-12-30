import { util } from '../../utils'
const actions = {
  sources: {
    querySourceList: '',
    queryProjectTree: ''
  },
  config: {
    queryConfigList: ''
  }
}
util.initializeConstants(actions, 'action')
export default actions
