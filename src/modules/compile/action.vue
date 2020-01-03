<template>
  <div class="compile-action">
    <div class="line">
      <label class="title">名称</label>
      <div class="content">
        <el-input v-model="name"></el-input>
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
      <label class="title"></label>
      <div class="content">
        <el-button>编译</el-button>
      </div>
    </div>
    <div class="line">
      <label class="title"></label>
      <div class="content">
        <div class="logs" v-show="logList.length">
          <div class="title">日志信息</div>
          <el-button size="mini" icon="el-icon-rank" class="showAll">全屏显示</el-button>
          <ul class="content" ref="logs">
            <li v-for="(log, index) in logList" :class="[log.tag]" :key="log.msg + index">{{log.msg}}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'compileAction',
    data() {
      return {
        name: '',
        publishingMode: {
          git: false,
          download: false,
          auto: true
        },
        describe: '',
        logList: []

      }
    }
  }
</script>

<style lang="sass">
@import "./styles/action"
</style>
