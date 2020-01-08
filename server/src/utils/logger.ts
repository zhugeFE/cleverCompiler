import * as log4js from 'log4js'

log4js.configure({
  appenders: {
    console: {
      type: 'console'
    }
  },
  categories: {
    default: {
      appenders: ['console'],
      level: 'info'
    }
  }
})
export default ():log4js.Logger => {
  return log4js.getLogger()
}