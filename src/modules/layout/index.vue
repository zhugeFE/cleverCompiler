<template>
  <div class="main">
    <zg-loading v-if="loading"></zg-loading>
    <template v-else>
      <left-menu></left-menu>
      <router-view class="content"></router-view>
    </template>
  </div>
</template>

<script>
  import leftMenu from './panels/leftMenu.vue'
  export default {
    name: 'indexPage',
    components: {
      leftMenu
    },
    data () {
      return {
        loading: false
      }
    },
    computed: {
    },
    beforeCreate () {
      // todo
    },
    watch: {
    }
  }
</script>

<style lang="sass">
@import "styles/index"
</style>
