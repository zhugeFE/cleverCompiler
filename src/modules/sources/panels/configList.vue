<template>
  <div class="sources-config-list content">
    <config-edit :show="showConfigDialog" @onClose="showConfigDialog = false"></config-edit>
    <el-table
        :data="dataList"
        border
        style="width: 80%">
      <el-table-column
          prop="name"
          align="left"
          label="名称">
      </el-table-column>
      <el-table-column
          prop="type"
          align="left"
          label="类型">
      </el-table-column>
      <el-table-column
          prop="file"
          align="left"
          label="文件位置">
      </el-table-column>
      <el-table-column
          prop="regex"
          align="left"
          label="正则表达式">
      </el-table-column>
      <el-table-column
          prop="target"
          align="left"
          label="目标内容">
      </el-table-column>
      <el-table-column
          prop="description"
          align="left"
          label="描述">
      </el-table-column>
      <el-table-column
          width="180"
          align="center"
          label="操作">
        <template slot-scope="scope">
          <span class="underline" @click="onEditRow(scope.$index, scope.row)">编辑</span>
          <span class="underline" @click="onDeleteRow(scope.$index, scope.row)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <el-button @click="showConfigDialog = true" type="primary" style="margin-top: 20px;"><i class="el-icon-plus"></i> 添加配置项</el-button>
  </div>
</template>

<script>
  import configEdit from './configEdit'
  export default {
    name: 'sourcesConfigList',
    components: {
      configEdit
    },
    props: {
      dataList: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        showConfigDialog: false
      }
    },
    methods: {
      onEditRow(index, row) {
        console.log('editRow:', index, row)
      },
      onDeleteRow(index, row) {
        console.log('delRow:', index, row)
      }
    }

  }
</script>

<style lang="sass">

</style>
