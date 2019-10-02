import roleApi from '@/api/role'
const state = {
    roleList:[]
}
const mutations = {
    SET_ROLE:(state,info)=>state.roleList = info,
}
const getters = {
    roleList(state){
        return state.roleList;
    }
}
const actions = {
    getRole(context){
        return new Promise((resolve,reject)=>{
            roleApi.queryAllRoleApi().then(resp=>{
                console.log('测试查看权限测试',resp)

                context.commit('SET_ROLE',resp.data);
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
