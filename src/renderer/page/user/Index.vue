<template>
<div class="user-content">
    <CreateUserForm ref="modal"></CreateUserForm>
    <Button type="success" @click="toCreate">
        添加管理员
    </Button>
    <Table style="margin-top: 5px" border :columns="table.tabHeader" :data="table.userData">

    </Table>
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
                            key: 'roleIdList'
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
            init(){
                userApi.userListApi().then(resp=>{
                    console.log('用户列表',resp);
                    this.table.userData = resp.page.list;
                }).catch(error=>{
                    console.log('发生错误')
                });
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
