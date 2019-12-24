<template>
  <div class="source-list-table-box">
    <c-data-grid :store="sourceList">
      <c-grid-column title="选择" field="-" fix="left">
        <template v-slot="{ data }">
          <c-checkbox v-model="idMap[data.id]"></c-checkbox>
        </template>
      </c-grid-column>
      <c-grid-column title="项目名" field="name" fix="left">
        <template v-slot="{ data }">
          <span class="name" :title="data.name">{{data.name}}</span>
        </template>
      </c-grid-column>
      <c-grid-column title="最新版本" field="version">
        <template v-slot="{ data }">
          <span class="version" :title="data.version">{{data.version}}</span>
        </template>
      </c-grid-column>
      <c-grid-column title="使用文档" field="readmeUrl">
        <template v-slot="{ data }">
          <span>README.md</span>
        </template>
      </c-grid-column>
      <c-grid-column title="部署文档" field="buildUrl">
        <template v-slot="{ data }">
          <span>BUILD.md</span>
        </template>
      </c-grid-column>
      <c-grid-column title="操作" field="-">
        <template v-slot="{ data }">
          <span @click="onDetail(data)">编辑</span>
        </template>
      </c-grid-column>
    </c-data-grid>
    <div style="display: none;">{{chosenIds}}</div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Vue from 'vue'
  export default {
    name: 'sourceList',
    data() {
      return {
        idMap: {}
      }
    },
    computed: {
      ...mapState({
        sourceList(state) {
          return state.sources.list || []
        }
      }),
      chosenIds() {
        let idList = []
        for (let key in this.idMap) {
          if (this.idMap[key]) {
            idList.push(key)
          }
        }
        return idList
      }
    },
    watch: {
      sourceList() {
        this.initIdMap()
      },
      idMap() {
        console.log('...', this.idMap)
      }
    },
    created() {
      this.initIdMap()
    },
    methods: {
      initIdMap() {
        this.sourceList.forEach(item => {
          Vue.set(this.idMap, item.id, false)
        })
        console.log(this.idMap)
      },
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
