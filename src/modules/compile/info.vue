<template>
  <div class="compile-info">
    <div class="line">
      <label class="title">名称</label>
      <div class="content">
        <el-input v-model="name"></el-input>
      </div>
    </div>
    <div class="line">
      <label class="title">模版</label>
      <div class="content">
        <el-select v-model="config" filterable placeholder="请选择">
          <el-option
              v-for="item in configList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { actions } from '../../store/constants'
  export default {
    name: 'compileInfo',
    data() {
      return {
        name: '',
        config: null

      }
    },
    computed: {
      ...mapState({
        configList(state) {
          return state.configs.list || []
        }
      })
    },
    beforeCreate() {
      this.$store.dispatch(actions.configs.queryConfigList)
    },
  }
</script>

<style lang="sass">
@import "./styles/info"
</style>
