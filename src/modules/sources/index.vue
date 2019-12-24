<template>
  <div class="sources">
    <source-list></source-list>
  </div>
</template>

<script>
  import sourceList from './panels/list'
  import { actions } from '../../store/constants'
  export default {
    name: 'sourcesIndex',
    components: { sourceList },
    data() {
      return {
      }
    },
    computed: {
    },
    beforeCreate() {
      this.$store.dispatch(actions.sources.querySourceList)
    },
    methods: {
    }
  }
</script>

<style lang="sass">

</style>
