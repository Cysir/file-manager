import request from '../utils/request'
export  function classificationDataApi() {
    return request.get('sys/type/classification/query')
}
export  function selectclassificationDataApi() {
    return request.post('sys/type/classification/pulldown')
}
export  function saveaddDataApi(data) {
    return request.post('sys/type/classification/save',data)
}
export  function removeDataApi(data) {
    return request.get('sys/type/classification/delete',{params:data})
}
export  function datapageApi(data) {
    return request.get('sys/type/classification/query',{params:data})
}
export default {classificationDataApi,selectclassificationDataApi,saveaddDataApi,removeDataApi,datapageApi}