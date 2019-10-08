import Cookies from 'js-cookie'
var fs = require("fs")
const TokenKey = 'vue_admin_template_token'

export function getToken() {
  var token = null;
  try{
    token = fs.readFileSync("./token.txt","utf-8")
  }
  catch(err){
    console.log("读取token 发生错误");
    token = null;
  }
  return token
 
  // return Cookies.get(TokenKey)
}

export function setToken(token) {
  fs.writeFileSync("./token.txt",token);
  console.log("保存token");
  console.log("token:", fs.readFileSync("./token.txt","utf-8"))
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  fs.writeFileSync("./token.txt","");
  return Cookies.remove(TokenKey)
}
