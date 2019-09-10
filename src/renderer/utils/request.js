import axios from 'axios'
import Modal from 'iview/src/components/modal/index'
import Spin from 'iview/src/components/spin/index'
import Message from 'iview/src/components/message/index'
import iView from 'iview'
import 'iview/dist/styles/iview.css'


import store from '@/store'
import router from '../router'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: "http://10.30.18.157:8081", // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    Spin.show();
    // do something before request is sent
    // console.log('发送请求成功拦截');
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    // console.log('发送请求失败拦截');
    Modal.error({content:"请求发生错误"});

    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    Spin.hide()

    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200 && res.code !== 0) {

      if (res.code == 401 || res.code == 403){
        alert(res.msg);
        store.dispatch('user/resetToken').then(() => {
          router.replace('/login')
        })
      }
      else{
        Modal.info({title:'错误码:'+res.code,content:"错误信息:"+res.msg});
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      // Message.success({content:"操作成功"});
      return res
    }
  },
  error => {
    Spin.hide()
    Message.error({content:"与服务器失去连接"});
    // Modal.$Modal.error({);
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
