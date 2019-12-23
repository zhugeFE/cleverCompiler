<template>
  <div class="sources-detail">
    这是详情页：{{msg}}
  </div>
</template>

<script>
  export default {
    name: 'sourcesDetail',
    props: {
      msg: {
        type: String,
        default: () => {
          return 'test'
        }
      }
    }
  }
</script>

<style lang="sass">

</style>
