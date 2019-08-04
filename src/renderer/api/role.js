import request from '../utils/request'
export function queryRoleApi() {
    return request.get("/sys/role/select")
}
export function roleInfoApi(id) {
    return request.get('/sys/role/info/'+id)
}

export function saveRoleApi(data) {
    return request.post("/sys/role/save",data)
}
export function updateRoleApi(data) {
    return request.put("/sys/role/update",data)
}
export function deleteRoleApi(ids) {
    return request.delete("/sys/role/delete",{data:ids})
}
export default {queryRoleApi,roleInfoApi,saveRoleApi,updateRoleApi,deleteRoleApi}