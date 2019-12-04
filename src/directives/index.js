import Vue from 'vue'

const directives = {}
for (let key in directives) {
  let directive = directives[key]
  Vue.directive(key, directive)
}
