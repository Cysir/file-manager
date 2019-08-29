<template>
<div class="user-content">
    <Button type="success" >
        添加管理员
    </Button>
    <Table style="margin-top: 5px" border :columns="table.tabHeader" :data="table.userData">

    </Table>
</div>
</template>

<script>
    import userApi from '../../api/user'
    export default {
        name: "Index",
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
                                    }
                                    },'查看'),
                                    h('Button',{props:{
                                            size:'small',type:'error'
                                        }},
                                        '删除')])
                            }
                        },
                        ],
                }
            }
        },
        created() {
            this.init();
            },
        methods:{
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
