import request from '../utils/request'

export function getMenuList() {
    return request.post("/sys/menu/menulist")
}
export function getEmp() {
    return request.get("/sys/dept/deptlist")
}
export function saveMould(data) {
    return request.post("/sys/templatefield/save",data)
}
export function queryMould() {
    return request.post("/sys/templatefield/querytemplatelist")
}
export function deleteMould(id) {
    return request.get("/sys/templatefield/delete",{params:{id}})
}
export default {getMenuList,getEmp,queryMould,saveMould,deleteMould}