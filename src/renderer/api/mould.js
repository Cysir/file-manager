import request from '../utils/request'

export function getMenuList() {
    return request.post("/sys/templatefield/querymenulist")
}
export function getEmp() {
    return request.get("/sys/dept/list")
}
export function saveMould(data) {
    return request.post("/sys/templatefield/save",data)
}
export default {getMenuList,getEmp,saveMould}