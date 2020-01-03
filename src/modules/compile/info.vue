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
        <el-select v-model="config" filterable placeholder="套件列表">
          <el-option
              v-for="item in configList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="version" filterable placeholder="版本列表" style="margin-left: 10px">
          <el-option
              v-for="item in versionList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="line">
      <label class="title">编译类型</label>
      <div class="content">
        <el-select v-model="type" filterable placeholder="编译类型">
          <el-option
              v-for="item in publicTypes"
              :key="item"
              :label="item"
              :value="item">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="line">
      <label class="title">发布方式</label>
      <div class="content">
        <el-checkbox v-model="publishingMode.git">发布到git</el-checkbox>
        <el-checkbox v-model="publishingMode.download">打包下载</el-checkbox>
        <el-checkbox v-model="publishingMode.auto">自动</el-checkbox>
      </div>
    </div>
    <div class="line">
      <label class="title">全局配置</label>
      <div class="content">

      </div>
    </div>
    <div class="line">
      <label class="title">项目配置</label>
      <div class="content"></div>
    </div>
    <div class="line">
      <label class="title">分享成员</label>
      <div class="content">
        <el-select v-model="member" multiple placeholder="请选择">
          <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.name"
              :disabled="item.default"
              :value="item.id">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="line">
      <label class="title">描述</label>
      <div class="content">
        <el-input
            style="width: 350px;"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="describe">
        </el-input>
      </div>
    </div>
    <div class="line">
      <label class="title">完成后</label>
      <div class="content"></div>
    </div>
    <div class="footer-action">
      <el-button @click="onsubmit" type="primary">保存</el-button>
      <el-button @click="oncancel">取消</el-button>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { actions } from '../../store/constants'
  import { routes } from '../../router/constants'
  export default {
    name: 'compileInfo',
    data() {
      return {
        name: '',
        config: null,
        version: null,
        versionList: [],
        publicTypes: ['私有部署', '常规迭代', '发布测试'],
        type: '',
        publishingMode: {
          git: false,
          download: false,
          auto: true
        },
        userList: [],
        member: null,
        describe: ''

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
    methods: {
      onsubmit() {

      },
      oncancel() {
        this.$router.replace({
          name: routes.compile.list
        })
      }
    }
  }
</script>

<style lang="sass">
@import "./styles/info"
</style>
