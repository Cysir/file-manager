import { login, logout, getInfo } from '@/api/user'
const state = {
    userInfo:{}
}
const mutations = {
    SET_INFO:(state,info)=>state.userInfo = info,
}
const getters = {
    info(state){
        return state.userInfo;
    }
}
const actions = {
    getInfo(context){
        return new Promise((resolve,reject)=>{
            getInfo().then(resp=>{
                // console.log('测试1')
                context.commit('SET_INFO',resp.user);
                // console.log('测试2',context.state.userInfo)
                resolve(resp);
            }).catch(error=>{
                reject(error);
            })
        });
    }
}
export default {
    namespaced:true,
    state,
    mutations,
    getters,
    actions
}
