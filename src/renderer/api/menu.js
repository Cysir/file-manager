import request from '../utils/request'
export function menuListApi() {
    return request.get('/sys/menu/list')
}

export function menuInfoApi(id) {
    return request.get('/sys/menu/info/'+id);
}

export function menuSaveApi(data) {
    return request.post('/sys/menu/save',data)
}

export function menuUpdateApi(data) {
    return request.post('/sys/menu/update',data);
}

export function menuDeleteApi(menuId) {
    return request.get('/sys/menu/delete',{params:{menuId}})
}

export default {menuListApi,menuInfoApi,menuSaveApi,menuDeleteApi,menuUpdateApi}
