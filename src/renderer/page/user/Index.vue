<template>
<div class="user-content">
    <CreateUserForm ref="modal"></CreateUserForm>
    <Button type="success" @click="toCreate">
        添加管理员
    </Button>
    <Button type="success" >
        选择部门：
    </Button>
        <Select v-model="model1"  type="success" style="width:200px" @on-open-change="recipientlick" @on-change="uploadingdata" >
            <Option v-for="item in cityList" :value="item.deptId" :key="item.deptId">{{ item.label }}</Option>
        </Select>

    <Table style="margin-top: 5px" border :columns="table.tabHeader" :data="table.userData">

    </Table>
    <div style="margin-top: 20px;margin-bottom: 20px">
        <Page :total="recData.total" show-sizer @on-change="pageChange" @on-page-size-change="limitChange"/>
    </div>
</div>
</template>

<script>
    import userApi from '../../api/user'

    import CreateUserForm from "./CreateUserForm";

    export default {
        name: "Index",
        components: {CreateUserForm},
        data(){
            return {
                cityList:[],
                model1:'',
                table:{
                    userData:[],
                    tabHeader:[      {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                        {
                            title: '用户名',
                            key: 'name'
                        },
                        {
                            title: '公司',
                            key: 'deptName'
                        },
                        {
                            title: '电话',
                            key: 'mobile'
                        }
                        ,
                        {
                            title: '邮箱',
                            key: 'email'
                        },
                        {
                            title: '角色',
                            key: 'roleIdList',
                            render:(h,param)=>{
                                let role = [...this.$store.getters['role/roleList']];
                                console.log('aaa角色',param.row)
                                let roleIdName = param.row.roleIdList.map(v=>{
                                    let name = null;
                                    role.forEach(vv=>{
                                        if (vv.roleId == v) {
                                            name =  vv.roleName;
                                        }
                                    })
                                    return name
                                });
                                roleIdName = roleIdName.reduce((pv,cv)=>{
                                    return pv+'\n'+cv
                                })
                                return h('div',roleIdName);
                            }
                        },
                        {
                            title: '操作',
                            width:120,
                            render:(h,params)=>{
                                let self = this;
                                return h('div',{
                                    props:{
                                        // class:'opt_menu'
                                    },
                                },[
                                    h('Button',{props:{
                                        size:'small',type:'info'
                                    },
                                    style:{
                                        'margin-right':'2px'
                                    },on:{
                                        click(){
                                            console.log('当前点击的数据',params.row);
                                            self.$refs.modal.update(params.row);
                                        }
                                        }
                                    },'查看'),
                                    h('Button',{props:{
                                            size:'small',type:'error'
                                        },on:{
                                            click(){
                                                self.$Modal.confirm({content:'确认删除用户['+params.row.name+']吗?',onOk(){
                                                        let id = params.row.userId;
                                                        let userId = [id];
                                                        // console.log('啊啊啊',param);
                                                        userApi.userDeleteApi({userId}).then(resp=>{
                                                            console.log('删除成功');
                                                            self.$Message.success({content:'删除成功'})
                                                            self.init()
                                                        }).catch(err=>{
                                                            self.$Message.success({content:'删除失败'})
                                                        })
                                                    }})

                                            }
                                            }},
                                        '删除')])
                            }
                        },
                        ],
                },
                recData: {
                    total: 0,
                    currPage: 0,
                    list: [],
                    totalPage: 0
                },
                mouldForm: {
                    page: '0', limit: '10'
                },
                queryParam:{
                    username:'',
                    page:'',
                    limit:''
                }
            }
        },
        created() {
            this.init();
            },
        methods:{
            toCreate(){
                this.$refs.modal.insert();
            },
            pageChange(page) {
                this.mouldForm.page = page.toString();
                this.loadData();
            },
            limitChange(limit) {
                this.mouldForm.limit = limit.toString();
                this.loadData();
            },
            loadData(){
                userApi.userListApi(this.mouldForm).then(resp=>{
                    console.log('用户列表',resp);
                    this.recData.totalPage = resp.page.totalPage;
                    this.recData.currPage = resp.page.currPage;
                    this.recData.total = resp.page.totalCount;
                    let role = [...this.$store.getters['role/roleList']];
                    console.log('权限查看，',role);
                    this.table.userData = resp.page.list

                }).catch(error=>{
                    console.log('发生错误')
                });
            },
            recipientlick(){
                    console.log("www")
                userApi.departmentApi().then(resp=>{
                            console.log(resp.data)
                            this.cityList=resp.data
                    console.log(this.cityList)
                    console.log(this.model1)
                }).catch(error=>{
                    console.log('发生错误')
                });
            },
            uploadingdata(){
                console.log("测试选择框内容")
                console.log(this.model1)
                let data1=this.mouldForm
                let page= '0'
                let limit= '10'
                let deptId=this.model1
                let data={page,limit,deptId}
                userApi.departmentPersonnelApi(data).then(resp=>{
                    console.log(resp.page)
                    console.log('用户列表',resp);
                    this.recData.totalPage = resp.page.totalPage;
                    this.recData.currPage = resp.page.currPage;
                    this.recData.total = resp.page.totalCount;
                    let role = [...this.$store.getters['role/roleList']];
                    console.log('权限查看，',role);
                    this.table.userData = resp.page.list
                }).catch(error=>{
                    console.log("发生错误")
                })
            },
            init(){
                this.loadData();
                // userApi.userListApi().then(resp=>{
                //     console.log('用户列表',resp);
                //     let role = [...this.$store.getters['role/roleList']];
                //     console.log('权限查看，',role);
                //     this.table.userData = resp.page.list.map(v=>{
                //         console.log('缺陷列表,',v.roleIdList);
                //         v.roleIdList = v.roleIdList.map(_v=>{
                //             let name = null;
                //             role.forEach(vv=>{
                //                 if (vv.roleId == _v) {
                //                     name =  vv.roleName;
                //                 }
                //             })
                //             return name
                //         });
                //         let q = '';
                //         v.roleIdList.forEach(vv=>{
                //             q += vv+"\n"
                //         })
                //         v.roleIdList = q
                //         return v;
                //     });
                //
                // }).catch(error=>{
                //     console.log('发生错误')
                // });
            }
        }
    }
</script>

<style scoped>
    .user-content{
        margin: 5px;
        background-color: white;
        width: 100%;
    }
    .opt_menu > button{
        display: inline-block;
        margin-left: 5px;
    }
</style>
