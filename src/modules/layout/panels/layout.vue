<template>
  <div class="layout-main">
    <div class="layout-content">
      <router-view></router-view>
    </div>
    <div class="left-navbar">
      <ul class="left-navbar-warp">
        <li
            v-for="item in leftMenus"
            :key="item.name"
            :class="['left-navbar-menu', 'menu-' + item.name]"
        >
          <a
              href="javascript:;"
              @click="onRedirect(item)"
              :class="[isActive(item.name) ? 'active' : '']"
          >
            <span>{{ item.label }}</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'layout',
    props: {
      leftMenus: {
        type: Array,
        default: () => {
          return []
        }
      },
      beforeRedirect: {
        type: Function,
        default: () => {}
      },
      keyPathname: {
        type: String,
        default: ''
      }
    },
    methods: {
      onRedirect(item) {
        if (this.isActive(item.name)) return
        this.$router.push({
          name: item.routeName
        })
      },
      isActive(name) {
        // 约定规则：左侧菜单的名字，在pathname中必须紧跟在主模块名称的后面的后面，（如：manage/project）
        if (!name) return false
        let path = this.$route.path
        return new RegExp('\\/' + this.keyPathname + '\\/' + name).test(path)
      }
    }
  }
</script>
<style lang="sass">
  @import "../styles/layout"
</style>
