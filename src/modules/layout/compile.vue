<template>
  <layout
      :leftMenus="leftMenus"
      keyPathname="compile"
  ></layout>
</template>

<script>
  import { routes } from '../../router/constants'
  import layout from './panels/layout'
  export default {
    name: 'compileLayout',
    components: {
      layout
    },
    data() {
      return {
        leftMenus: [{
          name: 'release',
          routeName: routes.compile.release,
          label: '发布'
        }, {
          name: 'configs',
          routeName: routes.compile.configs.list,
          label: '配置列表'
        }]
      }
    }
  }
</script>

<style lang="sass">

</style>
