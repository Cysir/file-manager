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
export function userListApi(data) {
  return request.get('/sys/user/list',{params: data})
}
export function departmentApi() {
      return request.post('/sys/dept/querydeptlist')
}
export function departmentPersonnelApi(data) {
    return request.get('/sys/user/deptqueryuser',{params: data})
}

export function userSaveApi(data) {
  return request.post('/sys/user/save',data)
}
export function userUpdateApi(data) {
  return request.put('/sys/user/update',data)
}
export function userDeleteApi(data) {
  return request.post('/sys/user/delete',data)
}
export default {login,getInfo,logout,userListApi,departmentApi,departmentPersonnelApi,roleListApi,userSaveApi,userUpdateApi,userDeleteApi}
