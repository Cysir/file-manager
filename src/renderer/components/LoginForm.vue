<template>
  <div class="layout">
        <div class="login-form">
          <Input prefix="ios-contact" v-model="account" placeholder="请输入账号" style="width: 280px" />
        </div>
        <div class="login-form">
          <Input prefix="ios-lock" v-model="password" type="password" placeholder="请输入密码" style="width: 280px" />
        </div>
        <Button type="success" style="width: 280px" v-on:click="dologin()">登录</Button>
  </div>
</template>
<script>

  export default {
    name:'LoginForm',
    data(){
      return {account:'',password:''}
    },
    methods:{
      dologin(){
        this.$emit('toLogin');
      }
    }
  }
</script>
<style scoped>
  .login-form{
    margin-bottom: 10px;
  }

</style>
