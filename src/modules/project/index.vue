<template>
  <div class="project">
    <c-data-grid :store="sourceList">
      <c-grid-column title="选择" field="-" fix="left">
        <template v-slot="{ data }">
          <c-checkbox v-model="idCheckMap[data.id]"></c-checkbox>
        </template>
      </c-grid-column>
      <c-grid-column title="项目名" field="name" fix="left">
        <template v-slot="{ data }">
          <span class="name" :title="data.name">{{data.name}}</span>
        </template>
      </c-grid-column>
      <c-grid-column title="最新版本" field="version">
        <template v-slot="{ data }">
          <span class="version" :title="data.latestVersion ? data.latestVersion.name : '-'">{{data.latestVersion ? data.latestVersion.name : '-'}}</span>
        </template>
      </c-grid-column>
      <c-grid-column title="使用文档" field="readmeUrl">
        <template v-slot="{ data }">
          <span class="underline" @click="updateDialogContent(data.latestVersion, 'README')">README.md</span>
        </template>
      </c-grid-column>
      <c-grid-column title="部署文档" field="buildUrl">
        <template v-slot="{ data }">
          <span class="underline" @click="updateDialogContent(data.latestVersion, 'BUILD')">BUILD.md</span>
        </template>
      </c-grid-column>
      <c-grid-column title="操作" field="-">
        <template v-slot="{ data }">
          <span class="underline" @click="onInfo(data)">编辑</span>
        </template>
      </c-grid-column>
    </c-data-grid>
    <div class="footer">
      <c-button @click="onChosenAll">全选/取消全选</c-button>
      <c-button @click="onApply" :disable="!chosenIds.length">应用</c-button>
      <c-button @click="onCreate">创建</c-button>
    </div>
    <el-dialog
        :visible.sync="dialog.show"
        :modal="false"
        class="is-full-screen-dialog"
        :fullscreen="true">
      <div>{{ dialog.content}}</div>
    </el-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { mapState } from 'vuex'
  import { actions } from '../../store/constants'
  import { routes } from '../../router/constants'
  export default {
    name: 'projectIndex',
    data() {
      return {
        idCheckMap: {},
        chosenIds: [],
        checkAll: false,
        dialog: {
          show: false,
          content: ''
        }
      }
    },
    computed: {
      ...mapState({
        sourceList(state) {
          return state.project.list || []
        }
      })
    },
    watch: {
      sourceList() {
        this.initIdMap()
      },
      idCheckMap: {
        handler() {
          this.getChosenIds()
        },
        deep: true
      }
    },
    beforeCreate() {
      this.$store.dispatch(actions.project.querySourceList)
    },
    created() {
      this.initIdMap()
    },
    methods: {
      initIdMap() {
        this.sourceList.forEach(item => {
          Vue.set(this.idCheckMap, item.id, false)
        })
      },
      updateDialogContent(data, key) {
        if (data) {
          this.dialog.content = data[key]
        } else {
          this.dialog.content = ''
        }
        this.dialog.show = true
      },
      getChosenIds() {
        this.chosenIds = []
        for (let key in this.idCheckMap) {
          if (this.idCheckMap[key]) {
            this.chosenIds.push(key)
          }
        }
      },
      onChosenAll() {
        this.checkAll = !this.checkAll
        for (let key in this.idCheckMap) {
          this.idCheckMap[key] = this.checkAll
        }
      },
      onApply() {
        // todo
        console.log('chosenIds:', this.chosenIds)
      },
      onCreate() {
        this.$router.replace({
          name: routes.project.create
        })
      },
      onInfo(data) {
        this.$router.replace({
          name: routes.project.info,
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
