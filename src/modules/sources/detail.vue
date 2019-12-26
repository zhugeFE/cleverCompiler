<template>
  <div class="sources-detail">
    <div class="go-back" @click="goBack">
      <span class="icon-pagination-prev"></span>返回
    </div>
    <div class="line">
      <label class="title">名称</label>
      <el-input v-model="name"></el-input>
    </div>
    <div class="line">
      <label class="title">git地址</label>
      <el-input v-model="name"></el-input>
    </div>
    <div class="line">
      <label class="title">配置</label>
      <regex-list :data-list="configList"></regex-list>
    </div>
    <div class="line">
      <label class="title">编译命令组</label>
      <cmd-list :compileCmd="cmdList"></cmd-list>
    </div>
    <div class="line">
      <label class="title">版本记录</label>
      <version-record></version-record>
    </div>
  </div>
</template>

<script>
  import regexList from './panels/regexList'
  import cmdList from './panels/cmdList'
  import versionRecord from './panels/versionRecord'
  export default {
    name: 'sourcesDetail',
    components: {
      regexList,
      cmdList,
      versionRecord
    },
    props: {
    },
    data() {
      return {
        name: '',
        gitUrl: '',
        configList: [],
        cmdList: []
      }
    },
    methods: {
      onEdit() {

      },
      onDelete() {

      },
      goBack() {
        this.$router.replace({
          name: 'sources'
        })
      }
    }
  }
</script>

<style lang="sass">
@import "./styles/detail"
</style>
