import request from '../utils/request'
export function mouldListApi(menuid) {

    return request.get("/sys/templatefield/querytemplate/",{params:{menuid}})
}
export function mouldDataList(data) {
    return request.post("/sys/Templatedata/list",data)
}
export function userListApi() {
    return request.get("/sys/user/list");

}
export function uploadFile() {
    return request.post("sys/file/upload");
}
export function mouldSendApi(data) {
    return request.post("/sys/Templatedata/save",data)
}
export function mouldUpdateApi(data) {
    return request.post("/sys/Templatedata/update",data)

}
export function mouldDownload(filePath) {
    return request.get("sys/file/download",{params:filePath})
}

export default {mouldDownload,mouldListApi,mouldDataList,userListApi,mouldSendApi,mouldUpdateApi}
