<template>
    <Layout>
        <Content style="margin: 5px">

            <Modal :footer-hide="true" :mask-closable="false" v-model="addRole">
                <div style="width: 100%;height: 100%;">
                    <Form :model="roleForm">
                        <FormItem label="角色名" prop="roleName">
                            <Input v-model="roleForm.roleName"></Input>
                        </FormItem>
                        <FormItem label="备注" prop="remark">
                            <Input v-model="roleForm.remark"></Input>
                        </FormItem>
                        <FormItem label="部门" prop="deptId">
                            <Select v-model="roleForm.deptId">
                                <Option v-for="dept in roleForm.deptList" :value="dept.deptId" :key="dept.deptId">{{dept.name}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="拥有部门" prop="deptId">

                            <Tree ref="o_dept" :data="roleForm.deptIdListTree" show-checkbox></Tree>


                        </FormItem>
                        <FormItem label="拥有菜单" prop="deptId">
                            <Tree ref="o_menu" :data="roleForm.menuIdListTree" show-checkbox></Tree>
                        </FormItem>
                        <Button @click="saveRole" style="width: 100px;margin:0 auto;display: block" type="primary">添加角色</Button>
                    </Form>
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
                roleForm:{
                    roleName:'',
                    deptId:'',
                    remark:'',
                    deptList:[],
                    menuIdListTree:[{
                        title: '全部',
                        expand: true,
                        children:[]
                    }],
                    deptIdListTree:[{
                        title: '全部',
                        expand: true,
                        children:[]
                    }]
                },
                addRole:false,
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
            saveRole(){
                console.log('角色表单',this.roleForm);
                let dept = this.$refs.o_dept.getCheckedNodes()
                let menu = this.$refs.o_menu.getCheckedNodes()
                let menuIdList = menu.map((value)=>{
                    if (value.title == '全部'){
                        return -1;
                    }
                    return value.id;
                })
                let deptIdList = dept.map((value)=>{
                    if (value.title == '全部'){
                        return -1;
                    }
                    return value.id;
                });
                menuIdList.splice(menuIdList.findIndex(value => {return value == -1}),1)

                deptIdList.splice(deptIdList.findIndex(value => {return value == -1}),1)

                roleApi.saveRoleApi({roleName:this.roleForm.roleName,deptId:this.roleForm.deptId,remark:this.roleForm.remark,
                menuIdList,deptIdList
                }).then(resp=>{
                    console.log('角色创建成功');
                    this.addRole = false;
                    this.loadRoles();
                }).catch(error=>{
                    console.log('角色创建失败')
                })
            },
            async openAddRole(){
                this.addRole = true;
                let dept = await roleApi.selectDept();
                let menu = await roleApi.selectMenu();
                this.roleForm.deptList = dept.deptList;
                let t = dept.deptList.map((value,index)=>{
                    // console.log('aaaa',value.name)
                    return {title:value.name,id:value.deptId}
                });
                this.roleForm.deptIdListTree[0].children=t;
                let m = menu.menuList.map((value,index)=>{
                   return {title:value.name,id:value.menuId};
                });
                this.roleForm.menuIdListTree[0].children=m;
                // console.log('asdsad',t)
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
