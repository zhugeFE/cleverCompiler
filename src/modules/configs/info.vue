<template>
  <div class="configs-info">
    <div class="line">
      <label class="title">名称</label>
      <el-input v-model="currentConfig.name"></el-input>
    </div>
    <div class="line">
      <label class="title">版本记录</label>
      <version-list :versionList="currentConfig.versionList" v-model="chosenVersion"></version-list>
    </div>
    <div class="line">
      <label class="title">全局配置</label>
      <div v-if="!haveChosenVersion()" class="content empty">
        <li></li>
        <li></li>
      </div>
      <config-list v-else :data-list="chosenVersion.configList" @addConfig="showConfigDialog = true"></config-list>
    </div>
    <div class="line">
      <label class="title">项目配置</label>
      <div v-if="!haveChosenVersion()" class="content empty">
        <li></li>
        <li></li>
      </div>
      <project-tabs v-else v-model="chosenVersion.projects"></project-tabs>
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
  import configList from '../project/panels/configList'
  import versionList from '../project/panels/versionList'
  import projectTabs from './panels/projectTabs'
  import textTabs from '../project/panels/textTabs'
  import { util } from '../../utils'
  import { mapState } from 'vuex'
  import { routes } from '../../router/constants'
  export default {
    name: 'configsInfo',
    components: {
      configList,
      versionList,
      projectTabs,
      textTabs
    },
    data() {
      return {
        chosenVersion: {}
      }
    },
    computed: {
      ...mapState({
        idMap(state) {
          return state.configs.idMap || {}
        }
      }),
      configId() {
        return this.$route.params.id
      },
      currentConfig() {
        let source = this.idMap[this.configId] || {}
        return util.clone(source)
      }
    },
    watch: {
      currentConfig: {
        handler: function() {
          this.chosenVersion = this.currentConfig.latestVersion || {}
        },
        deep: true
      }
    },
    created() {
      if (this.currentConfig) {
        this.chosenVersion = this.currentConfig.latestVersion || {}
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
          name: routes.configs.list
        })
      }
    }
  }
</script>

<style lang="sass">
@import "./styles/info"
</style>
