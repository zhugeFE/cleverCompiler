<template>
  <div class="manage-project-info">
    <div class="line">
      <label class="title">名称</label>
      <el-input v-model="name"></el-input>
    </div>
    <div class="line">
      <label class="title">git地址</label>
      <el-input v-model="git"></el-input>
    </div>
    <div class="line">
      <label class="title">版本记录</label>
      <div v-if="!git" class="content empty">
        <li></li>
      </div>
      <version-list
          v-else
          v-loading="!versionsReady"
          :versionList="versionList"
          :git="git"
          v-model="chosenVersion"
          @addVersion="addVersion"
          @editVersion="editVersion"></version-list>
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
      <el-button @click="onsubmit" type="primary">保存</el-button>
      <el-button @click="oncancel">取消</el-button>
    </div>
  </div>
</template>

<script>
  import configList from './panels/configList'
  import cmdList from './panels/cmdList'
  import versionList from './panels/versionList'
  import textTabs from './panels/textTabs'
  import { routes } from '../../router/constants'
  import { actions } from '../../store/constants'
  export default {
    name: 'manageProjectInfo',
    components: {
      configList,
      cmdList,
      versionList,
      textTabs
    },
    data() {
      return {
        name: '',
        git: '',
        versionsReady: false,
        versionList: [],
        chosenVersion: {}
      }
    },
    computed: {
      sourceId() {
        return this.$route.params.id
      },
      isEdit(){
        return !!this.sourceId
      }
    },
    watch: {
      git() {
        if (this.git) {
          this.queryVersionList()
        }
      }
    },
    created() {
      if (this.git) {
        this.queryCompileList()
      }
    },
    methods: {
      queryVersionList() {
        this.versionsReady = false
        this.$store.dispatch(actions.common.queryVersions, {
          git: this.git
        }).then(data => {
          // todo 测试用
          if (this.isEdit) {
            this.versionList = data
          } else {
            this.versionList = []
          }
          if (this.versionList.length) {
            this.chosenVersion = this.versionList[this.versionList.length - 1]
          } else {
            this.chosenVersion = {}
          }
          this.versionsReady = true
        })
      },
      addVersion(newVersion) {
        this.versionList.push(newVersion)
        this.chosenVersion = newVersion
      },
      editVersion() {

      },
      haveChosenVersion() {
        return this.chosenVersion && this.chosenVersion.name
      },
      onsubmit() {

      },
      oncancel() {
        this.$router.replace({
          name: routes.manage.project.list
        })
      }
    }
  }
</script>

<style lang="sass">
@import "./styles/info"
</style>
