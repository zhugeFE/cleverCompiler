<template>
  <layout
      :leftMenus="leftMenus"
      keyPathname="manage"
  ></layout>
</template>

<script>
  import { routes } from '../../router/constants'
  import layout from './panels/layout'
  export default {
    name: 'manageLayout',
    components: {
      layout
    },
    data() {
      return {
        leftMenus: [{
          name: 'project',
          routeName: routes.manage.project.list,
          label: '项目'
        }, {
          name: 'group',
          routeName: routes.manage.group.list,
          label: '套件'
        }]
      }
    }
  }
</script>

<style lang="sass">

</style>
