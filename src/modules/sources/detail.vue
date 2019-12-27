<template>
  <div class="sources-detail">
<!--    <div class="go-back" @click="goBack">-->
<!--      <span class="icon-pagination-prev"></span>返回-->
<!--    </div>-->
    <div class="line">
      <label class="title">名称</label>
      <el-input v-model="currentSource.name"></el-input>
    </div>
    <div class="line">
      <label class="title">git地址</label>
      <el-input v-model="currentSource.gitUrl"></el-input>
    </div>
    <div class="line">
      <label class="title">版本记录</label>
      <version-list :versionList="currentSource.versionList"></version-list>
    </div>
    <div class="line">
      <label class="title">配置</label>
      <config-list :data-list="currentSource.configList"></config-list>
    </div>
    <div class="line">
      <label class="title">编译命令组</label>
      <cmd-list :compileCmd="currentSource.cmdList"></cmd-list>
    </div>
    <div class="line">
      <label class="title"></label>
      <text-tabs></text-tabs>
    </div>
    <div class="footer">
      <el-button @click="onsubmit" type="primary">更新</el-button>
      <el-button @click="oncancel">取消</el-button>
    </div>
  </div>
</template>

<script>
  import configList from './panels/configList'
  import cmdList from './panels/cmdList'
  import versionList from './panels/versionList'
  import textTabs from './panels/textTabs'
  import { util } from '../../utils'
  import { mapState } from 'vuex'
  export default {
    name: 'sourcesDetail',
    components: {
      configList,
      cmdList,
      versionList,
      textTabs
    },
    data() {
      return {

      }
    },
    computed: {
      ...mapState({
        idMap(state) {
          return state.sources.idMap || {}
        }
      }),
      sourceId() {
        return this.$route.params.id
      },
      currentSource() {
        let source = this.idMap[this.sourceId] || {}
        return util.clone(source)
      }
    },
    methods: {
      onsubmit() {

      },
      oncancel() {
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
