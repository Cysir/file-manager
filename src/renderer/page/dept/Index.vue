<template>
    <div class="dept_content">
        <Button type="success">
            添加部门
        </Button>
        <Table style="margin-top: 5px" border :columns="table.tabHeader" :data="table.deptData">

        </Table>

    </div>
</template>

<script>
    import deptApi from '../../api/dept'
    export default {
        name: "Index",
        data() {
            return {
                table: {
                    deptData: [],
                    tabHeader: [{
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                        {
                            title: '部门名称',
                            key: 'name'
                        },
                        {
                            title: '上级部门',
                            key: 'parentName'
                        },
                        {
                            title: '操作',
                            width: 120,
                            render: (h, params) => {
                                return h('div', {
                                    props: {
                                        // class:'opt_menu'
                                    },
                                }, [
                                    h('Button', {
                                        props: {
                                            size: 'small', type: 'info'
                                        },
                                        style: {
                                            'margin-right': '2px'
                                        }
                                    }, '查看'),
                                    h('Button', {
                                            props: {
                                                size: 'small', type: 'error'
                                            }
                                        },
                                        '删除')])
                            }
                        },
                    ],
                }
            }
        },
        mounted() {
            this.init();
        },
        methods:{
            init(){
                deptApi.deptListApi().then(resp=>{
                    console.log('部门列表',resp);
                    this.table.deptData = resp.data;
                }).catch(error=>{
                   console.log('error',error);
                });
            }
        }
    }
</script>

<style scoped>

    .dept_content {
        margin: 5px;
        width: 100%;
        height: 100%;
        background-color: white;
    }

</style>
