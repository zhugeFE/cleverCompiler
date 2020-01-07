import { util } from '../../utils'
const mutations = {
  project: {
    updateList: '',
    addProject: '',
    editProject: ''
  },
  configs: {
    updateList: ''
  },
  compile: {
    updateList: ''
  }
}
util.initializeConstants(mutations, 'mutation')
export default mutations
