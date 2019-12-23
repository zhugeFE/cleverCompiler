<template>
  <div class="config">
    <li v-for="item in list" :key="item.id" @click="onDetail(item)">套件列表：{{item.id}}</li>
  </div>
</template>

<script>
  export default {
    name: 'configIndex',
    data () {
      return {
        list: [
          {id: 1, name: '1'},
          {id: 2, name: '2'},
          {id: 3, name: '3'}
        ]
      }
    },
    computed: {
    },
    methods: {
      onDetail(data) {
        this.$router.replace({
          name: 'configDetail',
          params: {
            id: data.id
          }
        })
      }
    },
    watch: {
    },
    created () {
    }
  }
</script>
<style lang="sass">
@import "./styles/index.sass"
</style>
