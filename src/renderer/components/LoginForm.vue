<template>
  <div class="my_login">
        <p>重点工作任务智能助手</p>
        <p>欢迎使用</p>
        <div class="login-form">
          <Input prefix="ios-contact" v-model="account" placeholder="请输入账号" style="width: 280px" />
        </div>
        <div class="login-form">
          <Input prefix="ios-lock" v-model="password" type="password" placeholder="请输入密码" style="width: 280px" />
        </div>
        <div class="login-form">
            <Button type="success" style="width: 280px" v-on:click="dologin()">登录</Button>
        </div>

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
      margin-top: 20px;
  }
    .my_login{
        text-align: center;
        background: rgba(0,0,0,0.1);
        margin: 30px;
        padding-top: 30px;
    }
    p{
        color: white;
        font-size: 20px;
        margin-top: 10px;
    }
</style>
