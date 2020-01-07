<template>
  <div class="manage-project-text-tabs content">
    <el-tabs v-model="active" @tab-click="handleClick" tab-position="bottom" type="card">
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
  export default {
    name: 'manageProjectTextTabs',
    props: {
      value: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        active: 'README',
        list: [{
          name: 'README',
          value: ''
        },{
          name: 'BUILD',
          value: ''
        },{
          name: 'UPDATE',
          value: ''
        }]
      }
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
        if (this.value) {
          this.list.forEach(item => {
            item.value = this.value[item.name]
          })
        }
      },
      handleClick(data) {
        console.log(data)
      }
    }
  }
</script>

<style lang="sass">
.manage-project-text-tabs
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
