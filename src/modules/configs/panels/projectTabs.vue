<template>
  <div class="configs-project-tabs content">
    <el-tabs v-model="active" @tab-click="onChosen" @tab-remove="onDelete" @tab-add="onAdd" tab-position="bottom" type="card" :closable="true" :addable="true">
      <el-tab-pane v-for="item in list" :key="item.id" :label="item.name" :name="item.name">
        <div class="project-content">
          这是项目{{item.name}}的配置
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="showDialog">
      <div>选择项目1？</div>
      <el-button @click="onsubmit" type="primary">确定</el-button>
    </el-dialog>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'configsProjectTabs',
    props: {
      value: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        active: '',
        list: [],
        showDialog: false
      }
    },
    computed: {
      ...mapState({
        idMap(state) {
          return state.project.idMap || {}
        }
      })
    },
    watch: {
      value: {
        handler: function() {
          this.initData()
        },
        deep: true
      }
    },
    mounted() {
      this.initData()
    },
    methods: {
      initData() {
        this.list = []
        this.active = ''
        this.value.forEach(project => {
          let source = this.idMap[project.id]
          this.list.push({
            id: source.id,
            name: source.name,
            version_id: project.version_id,
            buildMod: project.buildMod
          })
        })
        if (this.list.length) {
          this.active = this.list[0].name
        }
      },
      onChosen(data) {
        console.log('chosen: ', data)
      },
      onAdd(data) {
        this.showDialog = true
        console.log('add: ', data)
      },
      onsubmit() {
        let source = this.idMap['1']
        this.list.push({
          id: source.id,
          name: source.name,
          version_id: null,
          buildMod: 'downLoad'
        })
        this.showDialog = false
      },
      onDelete(data) {
        console.log('del: ', data)
      }
    }
  }
</script>

<style lang="sass">
  .configs-project-tabs
    .el-tabs
      width: 80%
      .project-content
        width: 100%
        min-height: 200px
        border: 1px solid #E4E7ED
        border-top: none
    .el-tabs--card
      >.el-tabs__header
        padding: 0
        margin: 0
      >.el-tabs__content
        .el-textarea
          margin-top: -1px
          .el-textarea__inner
            border-radius: 0
            border: 1px solid #E4E7ED
</style>
