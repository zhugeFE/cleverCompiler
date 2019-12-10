<template>
  <div class="main">
    <div class="logo">
      <a href="/"><img src="../../assets/images/logo1.png"/></a>
    </div>
    <div class="login-box">
      <div class="title-name">登录平台</div>
      <form>
          <div class="inputstyle">
            <el-input v-model="name" placeholder="登录邮箱"></el-input>
          </div>
          <div class="inputstyle">
            <input type="password" v-model="password" class="password el-input__inner" placeholder="密码" @keyup.enter="login">
          </div>
          <div class="login-btn">
            <el-button @click="login" type="primary">
              <span class="button-word">登录</span>
            </el-button>
          </div>
          <div class="singup-word">
            无法登录？<span>请咨询系统管理员</span>
          </div>
      </form>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'login',
    data () {
      return {
        name: '',
        password: ''
      }
    },
    methods: {
      login () {
        // todo 登录
        location.href = '/'
      }
    }
  }
</script>

<style lang="sass">
  @import "styles/index"
</style>