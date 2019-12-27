<template>
  <div class="sources-text-tabs content">
    <el-tabs v-model="active" @tab-click="handleClick" :tab-position="tabPosition" type="card">
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
    name: 'sourcesTextTabs',
    data() {
      return {
        active: 'README',
        tabPosition: 'bottom',
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
    methods: {
      handleClick(data) {
        console.log(data)
      }
    }
  }
</script>

<style lang="sass">
.sources-text-tabs
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
