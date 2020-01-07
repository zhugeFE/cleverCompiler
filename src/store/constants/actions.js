import { util } from '../../utils'
const actions = {
  common: {
    queryVersions: '',
    queryBranches: '',
    queryTags: ''
  },
  project: {
    addProject: '',
    editProject: '',
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
