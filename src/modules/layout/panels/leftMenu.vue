<template>
  <div class="left-guide">
    <span class="logo"></span>
    <ul class="top">
      <li v-for="menu in menusData" :key="menu.name" @click="onRedirect(menu.name)">
        <span :class="['icon', menu.icon]"></span>
        <span class="txt">{{menu.label}}</span>
      </li>
    </ul>
    <div class="bottom">
      <div class="setting" @click="showSetting = true">
        设置
        <ul v-show="showSetting" class="popover">
          <div class="arrow-box-left"></div>
          <li>个人中心</li>
          <li>用户管理</li>
          <li>退出系统</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { routes } from '../../../router/constants'
export default {
  name: 'mainPage',
  data () {
    return {
      showSetting: false,
      menusData: [{
        name: routes.project.list,
        label: '源'
      }, {
        name: routes.configs.list,
        label: '套件'
      }, {
        name: routes.compile.list,
        label: '管理'
      }, {
        name: routes.compile.action,
        label: '编译'
      }]
    }
  },
  computed: {
  },
  methods: {
    onRedirect(routerName) {
      this.$router.replace({
        name: routerName
      })
    }
  }
}
</script>

<style lang="sass">
@import "../styles/leftMenu"
</style>
