<template>
  <div class="manage-project-version-list content">
    <div class="version-panel">
      <div :class="{'item': true, 'active': version.id === value.id}" v-for="version in versionList" :key="version.id">
        <div class="header">{{version.name}}</div>
        <div class="time-line">
          <div class="node-line"></div>
          <div class="node-icon" @click="setValue(version)"></div>
        </div>
        <div class="footer">{{version.date}}</div>
      </div>
      <div class="item today" ref="end-item">
        <div class="header">
          <i class="icon-add-thin" @click="addVersion"></i>
        </div>
        <div class="time-line">
          <div class="node-line">
            <div class="icon icon-start"></div>
          </div>
          <div class="node-icon"></div>
        </div>
        <div class="footer">今天</div>
      </div>
    </div>
    <el-dialog v-loading="!ready" :visible.sync="showDialog" class="add-version-dialog" title="添加版本">
      <div class="content">
        <span class="name">版本号：</span>
        <el-input v-model="version.name"></el-input><br/>
        <span class="name">版本来源：</span>
        <el-radio-group v-model="version.sourceType">
          <el-radio-button v-for="type in sourceTypes" :key="type.name" :label="type.name"></el-radio-button>
        </el-radio-group><br/>
        <span class="name">branch/tag：</span>
        <el-select v-model="version.sourceValue">
          <el-option v-for="item in nodeList" :key="item.name" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </div>
      <div class="footer" style="text-align: right">
        <el-button @click="onsubmit" type="primary">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { actions } from '../../../store/constants'
  export default {
    name: 'manageProjectVersionList',
    props: {
      value: {
        type: Object,
        default() {
          return {}
        }
      },
      git: {
        type: String,
        default() {
          return ''
        }
      },
      versionList: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        ready: false,
        showDialog: false,
        version: {
          name: '',
          sourceType: 'tag',
          sourceValue: null
        },
        nodeList: []
      }
    },
    computed: {
      ...mapState({
        sourceTypes(state) {
          return state.common.sourceTypes || []
        }
      })
    },
    watch: {
      git() {
        if (this.git) {
          this.queryNodeList()
        }
      }
    },
    created() {
      if (this.git) {
        this.queryNodeList()
      }
    },
    mounted() {
      this.$refs['end-item'].scrollIntoView()
    },
    methods: {
      queryNodeList() {
        this.ready = false
        let api = actions.common.queryTags
        if (this.version.sourceType === 'branch') {
          api = actions.common.queryBranches
        }
        this.$store.dispatch(api, {
          git: this.git
        }).then(data => {
          this.nodeList = data
          this.ready = true
        })
      },
      setValue(value) {
        this.$emit('input', value)
      },
      addVersion() {
        this.version.name = ''
        this.version.sourceType = 'tag'
        this.version.sourceValue = ''
        this.showDialog = true
      },
      onsubmit() {
        // todo 校验表单&提交
        if (this.version.name && this.version.sourceType && this.version.sourceValue) {
          this.$emit('addVersion', {
            "id": this.versionList.length,
            "name": this.version.name,
            "date": "2020.01.05",
            "source_type": this.version.sourceType,
            "source_value": this.version.sourceValue,
            "file": {
              "README": "",
              "BUILD": "",
              "UPDATE": ""
            },
            replacement_config: '',
            compile_cmd: ''
          })
          this.showDialog = false
        } else {
          this.$message.error('请输入完整的表单信息！')
        }

      }
    }
  }
</script>

<style lang="sass">
@import "../styles/versionRecord"
</style>
