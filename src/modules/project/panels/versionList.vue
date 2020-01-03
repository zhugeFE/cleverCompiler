<template>
  <div class="project-version-list content">
    <div class="version-panel">
      <div :class="{'item': true, 'active': version.name === value.name}" v-for="version in versionList" :key="version.name">
        <div class="header">{{version.name}}</div>
        <div class="main">
          <div class="node-line"></div>
          <div class="node-icon" @click="setValue(version)"></div>
        </div>
        <div class="footer">{{version.date}}</div>
      </div>
      <div class="item today" ref="end-item">
        <div class="header">
          <i class="icon-add-thin" @click="addVersion"></i>
        </div>
        <div class="main">
          <div class="node-line">
            <div class="icon icon-start"></div>
          </div>
          <div class="node-icon"></div>
        </div>
        <div class="footer">今天</div>
      </div>
    </div>
    <el-dialog :visible.sync="showDialog" title="添加版本">
      <div class="content">
        <span class="name">版本号：</span>
        <el-input v-model="name"></el-input>
      </div>
      <div class="footer" style="text-align: right">
        <el-button @click="onsubmit" type="primary">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'projectVersionList',
    props: {
      value: {
        type: Object,
        default() {
          return {}
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
        showDialog: false,
        name: ''
      }
    },
    mounted() {
      this.$refs['end-item'].scrollIntoView()
    },
    methods: {
      setValue(value) {
        this.$emit('input', value)
      },
      addVersion() {
        this.showDialog = true
      },
      onsubmit() {
        // todo 校验表单&提交

      }
    }
  }
</script>

<style lang="sass">
@import "../styles/versionRecord"
</style>
