<template>
  <el-dialog
      :visible.sync="show"
      :modal="false"
      class="is-full-screen-dialog"
      :fullscreen="fullscreen">
    <div class="config-dialog">
      <div style="margin-bottom: 20px">这是配置</div>
      <el-button type="danger" @click="onClose">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: 'manageProjectConfigEdit',
    props: {
      show: {
        type: Boolean,
        default() {
          return false
        }
      }
    },
    data() {
      return {
        fullscreen: true
      }
    },
    methods: {
      onClose() {
        this.$emit('onClose')
      }
    }
  }
</script>

<style lang="sass">
.el-dialog__wrapper.is-full-screen-dialog
  width: 100%
  height: 100%
  .el-dialog
    width: 100%
    height: 100%
    padding: 0
    margin: 0
    top: 0 !important
    border-radius: 0
</style>
