<template>
  <div class="compile-list">
    <div class="header">
      <div class="left"></div>
      <div class="right">
        <el-button type="primary" @click="onAdd"><i class="el-icon-plus"></i>  新增配置</el-button>
      </div>
    </div>
    <div class="content">
      <el-table
          :data="compileList"
          border
          style="width: 100%">
        <el-table-column
            prop="name"
            sortable
            align="center"
            label="名称">
        </el-table-column>
        <el-table-column
            prop="type"
            filter-placement="bottom-end"
            align="center"
            label="编译类型">
        </el-table-column>
        <el-table-column
            prop="last_time"
            sortable
            align="center"
            label="上次编译时间">
        </el-table-column>
        <el-table-column
            prop="create_time"
            sortable
            align="center"
            label="创建时间">
        </el-table-column>
        <el-table-column
            align="center"
            width="300"
            label="操作">
          <template slot-scope="scope">
            <el-button
                size="small"
                type="success"
                @click="onCompile(scope.$index, scope.row)">编译</el-button>
            <el-button
                size="small"
                type="primary"
                @click="onEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
                size="small"
                type="danger"
                @click="onDel(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="footer"></div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { actions } from '../../store/constants'
  export default {
    name: 'compileList',
    data() {
      return {

      }
    },
    computed: {
      ...mapState({
        compileList(state) {
          return state.compile.list || []
        }
      })
    },
    beforeCreate() {
      this.$store.dispatch(actions.compile.queryCompileList)
    },
    methods: {
      onAdd() {

      },
      onEdit() {},
      onDel() {},
      onCompile() {}
    }
  }
</script>

<style lang="sass">
@import "./styles/list"
</style>
