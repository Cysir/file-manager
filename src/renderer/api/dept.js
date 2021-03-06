import request from '../utils/request'

export function deptListApi() {
    return request.get("/sys/dept/list");
}
export function alldeptListApi() {
    return request.post("/sys/dept/querydeptlist");
}
export function deptSelectApi() {
    return request.get("/sys/dept/select");
}
export function deptSaveApi(data) {
    return request.post("/sys/dept/save",data);
}
export function deptUpdateApi(data) {
    return request.post("/sys/dept/update",data);
}
export function deptDeleteApi(deptId) {
    return request.get("/sys/dept/delete",{params:{deptId}})
}

export default {deptDeleteApi,deptSelectApi,deptSaveApi,deptUpdateApi,deptListApi,alldeptListApi}
