import request from '../utils/request'
export  function announcementDataApi() {
    return request.get('/sys/notice/list')
}
export  function preserveDataApi(data) {
    return request.post('/sys/notice/save',data)
}
export function deleteApi(data) {
    return request.get('/sys/notice/delete',{params:data})
}
export function inquireApi(data) {
    return request.get('/sys/notice/info/'+data)
}
export function modificationDataApi(data) {
    return request.post('/sys/notice/update',data)
}
export function pageApi(data) {
    return request.get('/sys/notice/list',{params:data})
}
export default {announcementDataApi,preserveDataApi,deleteApi,inquireApi,modificationDataApi,pageApi}