import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/sys/user/queryuser',
    method: 'post'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
export function roleListApi() {
  return request({
    url:'/sys/role/list',
    method:'get',
    params:{pageSize:100}
  })
}
export function userListApi() {
  return request.get('/sys/user/list')
}


export default {login,getInfo,logout,userListApi,roleListApi}
