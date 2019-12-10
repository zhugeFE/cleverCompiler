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
  import leftMenu from './leftMenu.vue'
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
.main,.left-guide,.content
  height: 100%
.main
  display: flex
  flex-direction: row
  .left-guide
    width: 96px
    flex: none
  .content
    flex: 1
    overflow: auto
    background: #fff
</style>
