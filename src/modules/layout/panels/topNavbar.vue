<template>
  <div class="top-navbar">
    <div class="top-navbar-content">
      <div class="navbar-left">
        <div class="navbar-logo-warp">
          <a href="/" class="navbar-logo"></a>
        </div>
      </div>
      <ul v-show="topMenuList.length" class="navbar-menu">
        <li
          v-for="item in topMenuList"
          :key="item.name"
          @click="onRedirectClick(item)"
          :class="['navbar-menu-li', isActive(item.name) ? 'active' : '']"
        >
          <div class="active-bar"></div>
          <div class="navbar-menu-content">
            <span>{{ item.label }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { routes } from '../../../router/constants'
export default {
  name: 'topNavbarView',
  components: {
  },
  data() {
    return {
    }
  },
  computed: {
    topMenuList() {
      let list = []
      list.push({
        name: 'compile',
        routeName: routes.compile.layout,
        label: '编译'
      })
      list.push({
        name: 'manage',
        routeName: routes.manage.layout,
        label: '管理'
      })
      return list
    }
  },
  watch: {

  },
  created() {
  },
  beforeCreate() {
  },
  methods: {
    isActive(name) {
      // 约定规则：顶部菜单的名字，在pathname中必须紧跟在/app/后面，（如：/app/manage）
      if (!name) return false
      let path = this.$route.path
      return new RegExp('\\/app\\/' + name).test(path)
    },
    onRedirectClick(item) {
      if (this.isActive(item.name)) return
      this.$router.push({
        name: item.routeName
      })
    }
  }
}
</script>

<style lang="sass">
@import "../styles/topNavbar"
</style>
