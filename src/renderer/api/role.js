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
/**
 * 选择部门
 * @returns {AxiosPromise<any>}
 */
export function selectDept() {
    return request.get("/sys/dept/select")
}

/**
 * 选择菜单
 * @returns {AxiosPromise<any>}
 */
export function selectMenu() {
    return request.get("/sys/menu/nav")

}
export default {queryRoleApi,roleInfoApi,saveRoleApi,updateRoleApi,deleteRoleApi,selectDept,selectMenu}
