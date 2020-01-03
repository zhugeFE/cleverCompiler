<template>
  <div class="compile-index">
    <tabs-panel v-model="active" position="left" :tabs="tabs">
      <compile-config v-show="active === 'config'"></compile-config>
      <compile v-show="active === 'compile'"></compile>
    </tabs-panel>
  </div>
</template>

<script>
  import tabsPanel from '../../components/tabsPanel'
  import compileConfig from './list'
  import compile from './info'
  import { actions } from '../../store/constants'
  export default {
    name: 'compileIndex',
    components: {
      tabsPanel,
      compileConfig,
      compile
    },
    data() {
      return {
        active: 'config',
        tabs: [{
          value: 'config',
          label: '配置',
        }, {
          value: 'compile',
          label: '编译'
        }]

      }
    },
    beforeCreate() {
      this.$store.dispatch(actions.configs.queryConfigList)
      this.$store.dispatch(actions.compile.queryCompileList)
    },
    methods: {
    }
  }
</script>

<style lang="sass">

</style>
