import { util } from '../../utils'
const constants = {
  manage: {
    layout: '',
    project: {
      list: '',
      create: '',
      info: ''
    },
    group: {
      list: '',
      create: '',
      info: ''
    }
  },
  compile: {
    layout: '',
    configs: {
      list: '',
      create: '',
      info: ''
    },
    release: ''
  }
}
util.initializeConstants(constants, 'router')
export default constants
