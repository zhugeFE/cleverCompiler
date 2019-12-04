<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    name: 'app',
    components: {
    },
    data() {
      return {
      }
    },
    beforeCreate() {
    }
  }
</script>
<style src="./assets/icons/iconfont.css"></style>
<style lang="sass">
  @import "assets/styles/reset"
  @import "assets/styles/base"
  #app
    height: 100%
</style>
