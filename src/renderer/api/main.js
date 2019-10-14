import request from '../utils/request'
export function getMenu() {

    return request({
        url:"/sys/menu/nav",
        method:"get"
    })
}
export function updatePasswordApi(data) {

    return request.post("/sys/user/password",data)
}
export default {getMenu,updatePasswordApi}