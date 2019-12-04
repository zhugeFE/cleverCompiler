function log(step, context) {
  if (step === 'beforeCreate')
    console.log(`↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓${context._uid}`)
  if (step === 'destroyed') console.log(`↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑${context._uid}`)
  let moduleName = ((context.$vnode || {}).tag + '').replace(
    /vue-component-\d+-/,
    ''
  )
  console.log(
    formatStr(step),
    formatStr(moduleName),
    formatStr(context._uid),
    formatStr(context.$route.name),
    new Date().toLocaleTimeString()
  )
}
function formatStr(str) {
  str += ''
  let clearance = ' '
  let length = 30 - str.length
  for (let i = 0; i < length; i++) {
    str += clearance
  }
  return str
}
export default {
  beforeCreate() {
    log('beforeCreate', this)
  },
  created() {
    log('created', this)
  },
  beforeMount() {
    log('beforeMount', this)
  },
  mounted() {
    log('mounted', this)
  },
  beforeUpdate() {
    // log('beforeUpdate', this)
  },
  updated() {
    // log('updated', this)
  },
  activated() {
    log('activated', this)
  },
  deactivated() {
    log('deactivated', this)
  },
  beforeDestroy() {
    log('beforeDestroy', this)
  },
  destroyed() {
    log('destroyed', this)
  }
}
