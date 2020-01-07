<template>
  <div class="main">
    <zg-loading v-if="loading"></zg-loading>
    <template v-else>
      <top-menu></top-menu>
      <router-view class="content"></router-view>
    </template>
  </div>
</template>

<script>
  import topMenu from './panels/topNavbar'
  export default {
    name: 'indexPage',
    components: {
      topMenu
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
