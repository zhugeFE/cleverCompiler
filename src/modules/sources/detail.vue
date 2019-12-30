<template>
  <div class="sources-detail">
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
      <version-list :versionList="currentSource.versionList" v-model="chosenVersion"></version-list>
    </div>
    <div class="line">
      <label class="title">配置</label>
      <div v-if="!haveChosenVersion()" class="content empty">
        <li></li>
        <li></li>
      </div>
      <config-list v-else :data-list="chosenVersion.configList" @addConfig="showConfigDialog = true"></config-list>
    </div>
    <div class="line">
      <label class="title">编译命令组</label>
      <div v-if="!haveChosenVersion()" class="content empty">
        <li></li>
      </div>
      <cmd-list v-else :compileCmd="chosenVersion.cmdList"></cmd-list>
    </div>
    <div class="line">
      <label class="title"></label>
      <div v-if="!haveChosenVersion()" class="content empty">
        <li></li>
        <li></li>
      </div>
      <text-tabs v-else v-model="chosenVersion"></text-tabs>
    </div>
    <div class="footer-action">
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
      textTabs,
    },
    data() {
      return {
        chosenVersion: {}
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
    watch: {
      currentSource: {
        handler: function() {
          this.chosenVersion = this.currentSource.latestVersion || {}
        },
        deep: true
      }
    },
    created() {
      if (this.currentSource) {
        this.chosenVersion = this.currentSource.latestVersion || {}
      }
    },
    methods: {
      haveChosenVersion() {
        console.log(this.chosenVersion, 'aaaa')
        return this.chosenVersion && this.chosenVersion.name
      },
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
