<template>
  <div class="configs">
    <c-data-grid :store="list">
      <c-grid-column title="名称" field="name" fix="left">
        <template v-slot="{ data }">
          <span class="name" :title="data.name">{{data.name}}</span>
        </template>
      </c-grid-column>
      <c-grid-column title="最新版本号" field="version">
        <template v-slot="{ data }">
          <span class="version" :title="data.latestVersion ? data.latestVersion.name : '-'">{{data.latestVersion ? data.latestVersion.name : '-'}}</span>
        </template>
      </c-grid-column>
      <c-grid-column title="更新时间" field="version">
        <template v-slot="{ data }">
          <span class="update-date" :title="data.latestVersion ? data.latestVersion.date : '-'">{{data.latestVersion ? data.latestVersion.date : '-'}}</span>
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
          <span class="underline" @click="onInfo(data)">编辑</span>&nbsp;&nbsp;
          <span class="underline" @click="onDelete(data)">删除</span>
        </template>
      </c-grid-column>
    </c-data-grid>
    <div class="footer">
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
  import { mapState } from 'vuex'
  import { actions } from '../../store/constants'
  import { routes } from '../../router/constants'
  export default {
    name: 'configsIndex',
    data () {
      return {
        dialog: {
          show: false,
          content: ''
        }
      }
    },
    computed: {
      ...mapState({
        list(state) {
          return state.configs.list || []
        }
      })
    },
    watch: {
    },
    beforeCreate() {
      this.$store.dispatch(actions.configs.queryConfigList)
      this.$store.dispatch(actions.project.querySourceList)
    },
    created() {
    },
    methods: {
      updateDialogContent(data, key) {
        if (data) {
          this.dialog.content = data[key]
        } else {
          this.dialog.content = ''
        }
        this.dialog.show = true
      },
      onCreate() {
        this.$router.replace({
          name: routes.configs.create
        })
      },
      onInfo(data) {
        this.$router.replace({
          name: routes.configs.info,
          params: {
            id: data.id
          }
        })
      },
      onDelete(data) {
        console.log('del: ', data)
      }
    }
  }
</script>
<style lang="sass">
@import "./styles/index.sass"
</style>
