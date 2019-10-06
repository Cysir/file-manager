import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router/index'
import store from './store/index'
//iview
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import VueSocketio from 'vue-socket.io'
import socketio from 'socket.io-client'
//Vue.use(VueSocketio,socketio(''))
Vue.use(iView);
//
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
//日志输出控制
const isDebug = true;
let log = console.log;
console.log = function(...info){
  if (isDebug){
    log(...info)
  }

}
/**
 * 时间对象的格式化;
 */
Date.prototype.format = function(format) {
  /*
   * eg:format="YYYY-MM-dd hh:mm:ss";
   */
  var o = {
    "M+" :this.getMonth() + 1, // month
    "d+" :this.getDate(), // day
    "h+" :this.getHours(), // hour
    "m+" :this.getMinutes(), // minute
    "s+" :this.getSeconds(), // second
    "q+" :Math.floor((this.getMonth() + 3) / 3), // quarter
    "S" :this.getMilliseconds()
    // millisecond
  }

  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + "")
        .substr(4 - RegExp.$1.length));
  }

  for ( var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
          : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
}
/* eslint-disable no-new */
console.log(router);
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
