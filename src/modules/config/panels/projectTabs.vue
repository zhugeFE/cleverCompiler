<template>
  <div class="config-project-tabs content">
    <el-tabs v-model="active" @tab-click="onChosen" @tab-remove="onDelete" @tab-add="onAdd" tab-position="bottom" type="card" :closable="true" :addable="true">
      <el-tab-pane v-for="item in list" :key="item.name" :label="item.name" :name="item.name">
        <el-input
            type="textarea"
            :rows="10"
            placeholder="请输入内容"
            v-model="item.value">
        </el-input>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'configProjectTabs',
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
        list: []
      }
    },
    computed: {
      ...mapState({
        idMap(state) {
          return state.sources.idMap || {}
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
    created() {
      this.initData()
    },
    methods: {
      initData() {
        this.list = []
        this.value.forEach(project => {
          let source = this.idMap[project.id]
          this.list.push({
            originData: source,
            ...project
          })
        })
        this.active = this.list[0] || ''
        console.log('list:', this.list)
      },
      onChosen(data) {
        console.log('chosen: ', data)
      },
      onAdd(data) {
        console.log('add: ', data)
      },
      onDelete(data) {
        console.log('del: ', data)
      }
    }
  }
</script>

<style lang="sass">
  .config-project-tabs
    .el-tabs
      width: 80%
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
