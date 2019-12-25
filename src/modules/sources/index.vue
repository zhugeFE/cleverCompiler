<template>
  <div class="sources">
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
          <span class="underline">README.md</span>
        </template>
      </c-grid-column>
      <c-grid-column title="部署文档" field="buildUrl">
        <template v-slot="{ data }">
          <span class="underline">BUILD.md</span>
        </template>
      </c-grid-column>
      <c-grid-column title="操作" field="-">
        <template v-slot="{ data }">
          <span class="underline" @click="onDetail(data)">编辑</span>
        </template>
      </c-grid-column>
    </c-data-grid>
    <div class="footer">
      <c-button @click="onChosenAll">全选/取消全选</c-button>
      <c-button @click="onApply" :disable="!chosenIds.length">应用</c-button>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { mapState } from 'vuex'
  import { actions } from '../../store/constants'
  export default {
    name: 'sourcesIndex',
    data() {
      return {
        idMap: {},
        chosenIds: [],
        checkAll: false
      }
    },
    computed: {
      ...mapState({
        sourceList(state) {
          return state.sources.list || []
        }
      })
    },
    watch: {
      sourceList() {
        this.initIdMap()
      },
      idMap: {
        handler() {
          this.getChosenIds()
        },
        deep: true
      }
    },
    beforeCreate() {
      this.$store.dispatch(actions.sources.querySourceList)
    },
    created() {
      this.initIdMap()
    },
    methods: {
      initIdMap() {
        this.sourceList.forEach(item => {
          Vue.set(this.idMap, item.id, false)
        })
      },
      getChosenIds() {
        this.chosenIds = []
        for (let key in this.idMap) {
          if (this.idMap[key]) {
            this.chosenIds.push(key)
          }
        }
      },
      onChosenAll() {
        this.checkAll = !this.checkAll
        for (let key in this.idMap) {
          this.idMap[key] = this.checkAll
        }
      },
      onApply() {
        // todo
        console.log('chosenIds:', this.chosenIds)
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
@import "./styles/index"
</style>
