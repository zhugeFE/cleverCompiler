<template>
  <div class="sources">
    <li v-for="source in list" :key="source.id" @click="onDetail(source)">来源列表：{{source.id}}</li>
  </div>
</template>

<script>
  export default {
    name: 'sourcesIndex',
    data() {
      return {
        list: [
          {id: 1, name: '1'},
          {id: 2, name: '2'},
          {id: 3, name: '3'}
        ]
      }
    },
    methods: {
      onDetail(data) {
        this.$router.replace({
          name: 'sourcesDetail',
          params: {
            id: data.id
          }
        })
      }
    }
  }
</script>

<style lang="sass">

</style>
