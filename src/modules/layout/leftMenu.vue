<template>
  <div class="left-guide">
    <span class="logo"></span>
    <ul class="top">
      <li>
        <span class="icon icon-line"></span>
        <span class="txt">配置</span>
      </li>
      <li>
        <span class="icon icon-line"></span>
        <span class="txt">编译</span>
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
export default {
  name: 'mainPage',
  data () {
    return {
      showSetting: false
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style lang="sass">
@import "../../assets/styles/base"
.left-guide
  background: #354052
  position: relative
  .logo
    display: block
    width: 100%
    height: 50px
    background: url("../../assets/images/logo.png")
    background-repeat: no-repeat
    background-position: 50%
    background-size: 56px 33px
    @include prefix(box-shadow, 0 2px 4px 0 rgba(0,0,0,0.14))
    img
      display: block
      margin: 10px auto
  .top
    margin-top: 18px
    .active
      background: #273140
      color: #ffffff
    li
      width: 60px
      height: 60px
      text-align: center
      margin: 18px auto 0 auto
      border-radius: 10px
      cursor: pointer
      color: #A5A7A8
      padding: 10px
      &:hover
        @extend .active
      .txt,.icon
        display: block
      .txt
        margin-top: 5px
  .bottom
    position: absolute
    bottom: 50px
    width: 100%
    text-align: center
    .setting
      display: inline-block
      width: 50px
      height: 50px
      line-height: 48px
      background: #D8D8D8
      border: 1px solid #979797
      border-radius: 10px
      color: #000
      font-size: 14px
      cursor: pointer
    .popover
      min-width: 140px
      background: #3B495C
      position: absolute
      left: 75px
      bottom: 0
      z-index: 99999
      font-size: 14px
      color: #fff
      padding: 10px 0
      border-radius: 5px
      box-shadow: 0 2px 8px rgba(0, 0, 0, .33)
      .arrow-box-left
        position: absolute
        bottom: 20px
        background: none
        border: 1px solid #3B495C
        box-shadow: 0 2px 8px rgba(0, 0, 0, .33)
        &:after, &:before
          right: 100%
          top: 50%
          border: solid transparent
          content: " "
          height: 0
          width: 0
          position: absolute
          pointer-events: none
        &:after
          border-right-color: #3B495C
          border-width: 8px
          margin-top: -8px
        &:before
          border-right-color: #3B495C
          border-width: 9px
          margin-top: -9px
      li
        height: 34px
        line-height: 34px
        background: #3B495C
        cursor: pointer
        text-align: left
        padding: 0 40px 0 20px
        white-space: nowrap
        position: relative
        &:hover,.active
          background: #273140
</style>
