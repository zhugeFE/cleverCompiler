import { util } from '../../utils'
const constants = {
  project: {
    list: '',
    create: '',
    info: ''
  },
  configs: {
    list: '',
    create: '',
    info: ''
  },
  compile: {
    list: '',
    create: '',
    info: '',
    action: ''
  }
}
util.initializeConstants(constants, 'router')
export default constants
