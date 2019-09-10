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
// Vue.use(VueSocketio,socketio(''))
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
/* eslint-disable no-new */
console.log(router);
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
