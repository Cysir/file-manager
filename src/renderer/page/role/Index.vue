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
                        <FormItem v-if="false" label="角色分类" prop="grade">
                            <Select v-model="roleForm.grade">
                                <Option v-for="grade in roleForm.gradeList" :value="grade.id" :key="grade.id">{{grade.name}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="部门" prop="deptId">
                            <Select v-model="roleForm.deptId">
                                <Option v-for="dept in roleForm.deptList" :value="dept.deptId" :key="dept.deptId">{{dept.name}}</Option>
                            </Select>
                        </FormItem>

                        <FormItem label="拥有部门">
                            <Tree ref="o_dept" :data="roleForm.deptIdListTree" show-checkbox></Tree>
                        </FormItem>

                        <FormItem label="拥有菜单" prop="deptId">
                            <Tree ref="o_menu" :data="roleForm.menuIdListTree" show-checkbox></Tree>
                        </FormItem>
                        <Button v-if="!isUpdate" @click="saveRole" style="width: 100px;margin:0 auto;display: block" type="primary">添加角色</Button>
                        <Button v-if="isUpdate" @click="updateRole" style="width: 100px;margin:0 auto;display: block" type="primary">修改角色</Button>
                    </Form>
                </div>
            </Modal>
            <Button @click="openAddRole" type="success" style="margin-bottom: 10px">添加角色</Button>
            <Table border :columns="tableColumn" :data="roleData">

            </Table>
            <div style="margin-top: 20px">
                <Page :total="recData.total" show-sizer @on-change="pageChange" @on-page-size-change="limitChange"/>
            </div>
        </Content>
    </Layout>
</template>

<script>
    import roleApi from '../../api/role'
    const TAG = '角色管理'
    var _this = null
    export default {
        name: "Index",
        data(){
            return {
                isUpdate:false,
                mouldForm: {
                    page: '0', limit: '10'
                },
                recData: {
                    total: 0,
                    currPage: 0,
                    list: [],
                    totalPage: 0
                },
                roleForm:{
                    roleName:'',
                    deptId:'',
                    roleId:'',
                    remark:'',
                    grade:1,
                    gradeList:[{id:1,name:'管理员'},{id:2,name:'普通用户'}],
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
                            return h('div',[h('Button',{props:{type:'info',size:'small'},style:{'margin-right':'2px'},on:{
                                    click(){
                                        _this.viewRole(params.row.roleId);
                                    }
                                }},'查看'),h('Button',{props:{type:'error',size:'small'},on:{
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
            _this = this;
        },
        methods:{
            //创建角色
            saveRole(){
                console.log('角色表单',this.roleForm);
                let dept = this.$refs.o_dept.getCheckedNodes()
                let menu = this.$refs.o_menu.getCheckedNodes()
                console.log('部门，',dept);
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
                if (menuIdList.findIndex(v=>{return v == -1})!=-1){
                    menuIdList.splice(menuIdList.findIndex(value => {return value == -1}),1)
                }
                deptIdList.splice(deptIdList.findIndex(value => {return value == -1}),1)
                console.log('aaaaaaaaaaaaaaaaaa>',deptIdList)
                roleApi.saveRoleApi({deptIdList,roleName:this.roleForm.roleName,deptId:this.roleForm.deptId,remark:this.roleForm.remark,
                    menuIdList
                }).then(resp=>{
                    console.log('角色创建成功');
                    this.addRole = false;
                    this.loadRoles();
                }).catch(error=>{
                    console.log('角色创建失败')
                })
            },
            //创建角色
            updateRole(){
                console.log('角色表单',this.roleForm);
                let dept = this.$refs.o_dept.getCheckedNodes()
                let menu = this.$refs.o_menu.getCheckedNodes()
                let menuIdList = menu.map((value)=>{
                    if (value.title == '全部'){
                        return -1;
                    }
                    return value.id;
                });
                let deptIdList = dept.map((value)=>{
                    if (value.title == '全部'){
                        return -1;
                    }
                    return value.id;
                });
                console.log('更新角色,>>>>>>>>',menuIdList);
                if (menuIdList.findIndex(v=>{return v == -1})!=-1){
                    menuIdList.splice(menuIdList.findIndex(value => {return value == -1}),1)
                }
                if (deptIdList.findIndex(v=>{return v == -1})!=-1){
                    deptIdList.splice(deptIdList.findIndex(value => {return value == -1}),1);
                }
                roleApi.updateRoleApi({deptIdList,roleId:this.roleForm.roleId,roleName:this.roleForm.roleName,deptId:this.roleForm.deptId,remark:this.roleForm.remark,
                    menuIdList
                }).then(resp=>{
                    console.log('角色修改成功');
                    this.addRole = false;
                    this.loadRoles();
                }).catch(error=>{
                    console.log('角色修改失败')
                })
            },
            //添加角色
            async openAddRole(){
                this.isUpdate = false;
                this.addRole = true;
                let dept = await roleApi.selectDept();
                let menu = await roleApi.selectMenu();
                this.roleForm.deptList = dept.data;
                // this.toTreeMenu(menu.data);
                let t = dept.data.map((value,index)=>{
                    // console.log('aaaa',value.name)
                    return {title:value.name,id:value.deptId}
                });
                this.roleForm.deptIdListTree[0].children=t;
                let m = menu.data.map((value,index)=>{
                    return {title:value.parentName+'-'+value.name,id:value.menuId};
                });
                this.roleForm.menuIdListTree[0].children=m;
                this.roleForm.remark = '';
                this.roleForm.deptId = '';
                this.roleForm.roleId = '';
                this.roleForm.roleName = '';
                this.roleForm.grade = null;
            },
            //筛选出树形菜单数据
            toTreeMenu(data){
                console.log('开始拼接数据',data);
                let treeList = {};
                for (let v of data){
                    if (treeList.hasOwnProperty(v.parentId)){
                        treeList[v.parentId].push(v);
                    }else{
                        treeList[v.parentId] = [v];
                    }
                }
                console.log('treeList',treeList);
                //第二次处理
                let keys = Object.getOwnPropertyNames(treeList);
                let treeA = [];
                for (let i in keys){
                    if (i==0){
                        treeA.push(treeList[i]);
                    }
                    else{
                    }
                }
            },
            //查看角色权限
            async viewRole(id){
                console.log('开始运行');
                await this.openAddRole();
                this.addRole = true;
                console.log('结束运行');
                this.isUpdate = true;
                let resp = await roleApi.roleInfoApi(id);
                console.log('查询角色信息',resp);
                let role = resp.role;
                this.roleForm.remark = role.remark;
                this.roleForm.deptId = role.deptId;
                this.roleForm.roleId = role.roleId;
                this.roleForm.roleName = role.roleName;
                this.roleForm.grade = role.grade;
                console.log(this.roleForm);
                let dept = role.deptList;
                let menu = role.menuList;
                // 设置默认选中
                this.roleForm.deptIdListTree[0].children = this.roleForm.deptIdListTree[0].children.map((value,index)=>{
                    if (dept.findIndex(v=>{
                        if (v == null)
                            return false;
                        return v.deptId == value.id
                    })!=-1){
                        // console.log('找到',value,dept)
                        return {title:value.title,id:value.id,checked:true}
                    }
                    // console.log('重新》》',value)
                    return {title:value.title,id:value.id,checked:false}
                });
                //设置菜单默认选中
                this.roleForm.menuIdListTree[0].children = this.roleForm.menuIdListTree[0].children.map((value,index)=>{
                    if (menu.findIndex(v=>{
                        console.log('查看菜单aaa>',v,' bbb>',value)
                        if (v == null)
                            return false;
                        return v.menuId == value.id
                    })!=-1){
                        // console.log('找到')
                        return {title:value.title,id:value.id,checked:true}
                    }
                    // console.log('重新》》',value)
                    return {title:value.title,id:value.id,checked:false}
                });
            },
            pageChange(page) {
                this.mouldForm.page = page.toString();
                this.loadRoles();
            },
            limitChange(limit) {
                this.mouldForm.limit = limit.toString();
                this.loadRoles();
            },
            loadRoles(){
                roleApi.queryRoleApi(this.mouldForm).then(resp=>{
                    this.roleData = resp.page.list;
                    console.log(TAG,resp)
                    this.recData.total = resp.page.totalCount;
                    this.recData.currPage = resp.page.currPage;
                    this.recData.totalPage = resp.page.totalPage;
                }).catch(error=>{
                    console.log(TAG,error)
                })
            }
        }
    }
</script>

<style scoped>
</style>