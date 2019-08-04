<template>
    <Layout>
        <Content style="margin: 5px">
            <Modal :footer-hide="true" :mask-closable="false" v-model="addRole">
                <div style="width: 100%;height: 100%;">
                    <p>啊实打实的</p>
                    <p>啊实打实的</p>
                    <p>啊实打实的</p>
                    <p>啊实打实的</p>
                </div>
            </Modal>
            <Button @click="openAddRole" type="primary" style="margin-bottom: 10px">添加角色</Button>
            <Table border :columns="tableColumn" :data="roleData">

            </Table>
        </Content>
    </Layout>
</template>

<script>
    import roleApi from '../../api/role'
    const TAG = '角色管理'
    export default {
        name: "Index",
        data(){
            return {
                addRole:true,
                roleData:[],
                tableColumn:[{
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                    {
                        title: '权限名',
                        key: 'roleName'
                    },
                    {
                        title: '备注',
                        key: 'remark'
                    },
                    {
                        title: '部门名',
                        key: 'deptName'
                    },{
                    width:120,
                    title:'操作',
                        render:(h,params)=>{
                        let _this = this;
                        return h('div',[h('Button',{props:{type:'success',size:'small'},style:{'margin-right':'2px'}},'查看'),h('Button',{props:{type:'error',size:'small'},on:{
                            click(){
                                _this.$Modal.confirm({content:'确定删除该角色吗?',onOk(){
                                    roleApi.deleteRoleApi([params.row.roleId]).then(resp=>{
                                        console.log('删除成功');
                                        _this.loadRoles();
                                        _this.$Message.success({content:"角色删除成功"});
                                    }).catch(error=>{
                                        console.log('角色删除失败');
                                    })
                                    }})
                            }
                            }},'删除')])
                        }
                    }]}
        },
        mounted() {
            this.loadRoles();

        },
        methods:{
            openAddRole(){
                this.addRole = true;
            },
            loadRoles(){

                roleApi.queryRoleApi().then(resp=>{
                    this.roleData = resp.list;
                    console.log(TAG,resp)
                }).catch(error=>{
                    console.log(TAG,error)
                })
            }
        }
    }
</script>

<style scoped>

</style>