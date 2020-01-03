<template>
  <div class="project-cmd-list content">
    <draggable :list="list" class="draggable-warp">
      <div class="draggable-line" v-for="(obj, index) in list" :key="index" @click="onLineClick(index)">
        <el-tag
            v-if="!obj.edit"
            :closable="true"
            type="primary"
            :close-transition="false"
            @close="onCmdDelete(index)">
          {{obj.value}}
        </el-tag>
        <el-input
            v-else
            class="input-cmd"
            :ref="'input' + index"
            v-model="obj.value"
            @blur="onInputBlur(index)"
            @keyup.enter.native="onInputBlur(index)"
        ></el-input>
      </div>
    </draggable>
    <div class="new-cmd-line">
      <el-input
          class="input-cmd"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="mini"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm">
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New cmd</el-button>
    </div>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  export default {
    name: 'projectCmdList',
    components: {
      draggable
    },
    props: {
      compileCmd: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data () {
      return {
        list: [],
        inputVisible: false,
        inputValue: ''
      }
    },
    watch: {
      list () {
        this.change()
      },
      compileCmd: {
        handler: function() {
          this.initData()
        },
        deep: true
      }
    },
    created () {
      this.initData()
    },
    methods: {
      initData() {
        this.list = this.compileCmd.map(item => {
          return {
            value: item,
            edit: false
          }
        })
      },
      onLineClick (index) {
        this.list[index].edit = true
        this.$nextTick(() => {
          this.$refs['input' + index][0].$refs.input.focus()
        })
      },
      onCmdDelete (index) {
        this.list.splice(index, 1)
      },
      onInputBlur (index) {
        this.list[index].edit = false
        this.change()
      },
      showInput () {
        this.inputVisible = true
        this.$nextTick(() => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },
      handleInputConfirm () {
        let inputValue = this.inputValue
        if (inputValue) {
          this.list.push({
            edit: false,
            value: inputValue
          })
        }
        this.inputVisible = false
        this.inputValue = ''
      },
      change () {
        this.$emit('change', this.list.map(item => {
          return item.value
        }))
      }
    }
  }
</script>

<style lang="sass">
.project-cmd-list
  .draggable-warp
    display: inline-block
    .draggable-line
      margin-top: 5px
      display: inline-block
    .el-tag
      margin-right: 10px
      cursor: pointer
  .new-cmd-line
    margin-top: 5px
  .input-cmd input
    min-width: 300px
    height: 32px
</style>
