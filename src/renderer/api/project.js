import request from '../utils/request'
export function applySaveApi(data){
    return request.post("/sys/applyfor/save",data)
}
export function applyListApi(param){
    return request.get("/sys/applyfor/list",{params:param})
}
export function applyInfoApi(id){
    return request.get("/sys/applyfor/info/"+id)
}
export function applyUpdateApi(data){
    return request.post("/sys/applyfor/update",data)
}
export function applyDeleteApi(id){
    return request.get("/sys/applyfor/delete",{params:{id}})
}
export function applyMenuApi() {
    return request.get("/sys/menu/list");
}
export default{applySaveApi,applyListApi,applyInfoApi,applyDeleteApi,applyUpdateApi,applyMenuApi}