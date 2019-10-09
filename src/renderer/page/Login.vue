<template>
  <div class="layout" id="login-main">
    <Modal v-model="showIp" @on-ok="setIp">
      <Form>
        <FormItem label="服务器IP地址">
          <Input v-model="serverIp" />
        </FormItem>
      </Form>
    </Modal>
    <Affix>
      <span
        class="demo-affix"
        style="float: right;margin: 10px;position: fixed;top:20px;right: 20px;"
        @click="showIp=!showIp"
      >设置ip</span>
    </Affix>
    <Layout>
      <Header id="header">
        <img src="../../../static/icon_logo.png" />
      </Header>
      <Content id="content" style="background-image: url('../../../static/bg_main.jpg');height: 450px;padding: 20px">
        <LoginForm ref="loginForm" @toLogin="testOne" style="width: 344px;height: 350px;border-radius: 6px;"></LoginForm>
      </Content>
      <Footer id="footer">
        <div>{{copyright}}</div>
        <div>{{author}}</div>
      </Footer>
    </Layout>
  </div>
</template>

<script>
import LoginForm from "../components/LoginForm";
import request from "../utils/request";
let copyright = "国网常德分公司 © 版权所有 ";
let author = "技术支持：湖南文理学院古剑奇谭工作室";
let welcome = "重点工作任务智能助手";

export default {
  name: "Login",
  data() {
    return { copyright, author, welcome, showIp: false, serverIp: "" };
  },
  created() {
    var _self = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;

      if (key == 13 || key == 100) {
        _self.testOne();
      }
    };
  },
  mounted() {
    this.serverIp = localStorage.getItem("serverIp");
  },
  methods: {
    setIp() {
      if (this.serverIp == "") {
        this.$Message.error({
          content: "请输入IP地址"
        });
        return;
      }
      localStorage.setItem("serverIp", this.serverIp);
      request.reload();
    },
    testOne() {
      // alert("TEST");
      this.$store
        .dispatch("user/login", {
          username: this.$refs.loginForm.account,
          password: this.$refs.loginForm.password
        })
        .then(data => {
          this.$router.push("/index");
        })
        .catch(err => {
          console.log("登陆失败", err);
          this.$Message.error({ content: "登录失败" });
          // this.$Modal.error({content:"登陆失败"});
        });
    },
    test() {
      let email = this.$refs.loginForm.account;
      let password = this.$refs.loginForm.password;
      // alert(this.$refs.loginForm.account);
      // alert(pwd);
      let data = { email, password };
      this.$http
        .post("/sys/login", data)
        .then(resp => {
          if (resp.status == 200 && resp.data.code == 0) {
            this.$Message.success("登录成功");
            this.$router.push("/emp");
          } else {
            this.$Message.error(resp.data.msg);
          }
        })
        .catch(error => {
          this.$Message.info("登录失败");
        });
    }
  },
  components: { LoginForm }
};
</script>

<style scoped>
#login-main {
}
div {
  background-color: rgba(255, 255, 255, 0);
}

h1 {
  margin-bottom: 30px;
}

#header {
  margin-bottom: 20px;
  margin-top: 20px;
  background-color: #fff;
}
#content {
}
#footer {
  width: 100%;
  margin-top: 10px;
  text-align: center;
}

</style>
