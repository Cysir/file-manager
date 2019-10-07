<template>
    <div class="user-content">
        <Table style="margin-top: 5px" border :columns="table.tabHeader" :data="table.userData">

        </Table>
        <div style="margin-top: 20px;margin-bottom: 20px">
            <Page :total="recData.total" show-sizer @on-change="pageChange" @on-page-size-change="limitChange"/>
        </div>
    </div>
</template>

<script>
    import projectApi from "../../api/project";
    export default {
        name: "Index",
        data(){
            return {
                mouldForm: {
                    page: '0', limit: '10'
                },
                recData: {
                    total: 0,
                    currPage: 0,
                    list: [],
                    totalPage: 0
                },
                table:{
                    userData:[],
                    tabHeader:[      {
                        // type: 'index',
                        title:"id",
                        width: 60,
                        key:"id",
                        align: 'center'
                    },
                        {
                            title: '项目名',
                            key: 'name'
                        },
                        {
                            title: '说明或原因',
                            key: 'cause'
                        },
                        {
                            title: '用户名',
                            key: 'applyForIdName'
                        }
                        ,
                        {
                            title: '部门名',
                            key: 'deptName'
                        },
                        {
                            title: '申请日期',
                            key: 'jurisdictionTime'
                        },
                        {
                            title: '状态',
                            key: 'status',
                            render:(h,params)=>{
                                let status = '';
                                switch (params.row.status) {
                                    case 1:status = "拒绝";break;
                                    case 0:status = "同意";break;
                                    default:status = "未处理";break;
                                }
                                return h('div',status)
                            }

                        },
                        {
                            title: '开始时间',
                            key: 'startTime',
                            render:(h,params)=>{
                                let time = new Date(params.row.startTime).format("yyyy-MM-dd hh:mm:ss")
                                return h('div',time)
                            }
                        },
                        {
                            title: '结束时间',
                            key: 'endTime',
                            render:(h,params)=>{
                                // console.log("结束时间",typeof params.row.endTime,params.row.endTime)
                                let time = new Date(params.row.endTime).format("yyyy-MM-dd hh:mm:ss")
                                return h('div',time)
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
                                                self.$Modal.confirm({title:"提示：此操作为 同意",content:'确认同意用户['+params.row.applyForIdName+']申请项目['+params.row.name+']吗?',onOk(){
                                                        // let id = params.row.userId;
                                                        // let userId = [id];
                                                        // console.log('啊啊啊',param);
                                                        // userApi.userDeleteApi({userId}).then(resp=>{
                                                        //     console.log('删除成功');
                                                        //     self.$Message.success({content:'删除成功'})
                                                        //     self.init()
                                                        // }).catch(err=>{
                                                        //     self.$Message.success({content:'删除失败'})
                                                        // })
                                                        params.row.status = 0;
                                                        projectApi.applyUpdateApi(params.row).then(resp=>{
                                                            self.$Message.success({content:"操作成功"})
                                                            self.loadData()
                                                        }).catch(error=>{
                                                            self.$Modal.error({title:"操作失败",content:JSON.stringify(error)})
                                                        })
                                                    }})
                                            }
                                        }
                                    },'同意'),
                                    h('Button',{props:{
                                                size:'small',type:'error'
                                            },on:{
                                                click(){
                                                    self.$Modal.confirm({title:"提示：此操作为 拒绝",content:'确认拒绝用户['+params.row.applyForIdName+']申请项目['+params.row.name+']吗?',onOk(){
                                                            // let id = params.row.userId;
                                                            // let userId = [id];
                                                            // console.log('啊啊啊',param);
                                                            // userApi.userDeleteApi({userId}).then(resp=>{
                                                            //     console.log('删除成功');
                                                            //     self.$Message.success({content:'删除成功'})
                                                            //     self.init()
                                                            // }).catch(err=>{
                                                            //     self.$Message.success({content:'删除失败'})
                                                            // })
                                                            params.row.status = 1;
                                                            projectApi.applyUpdateApi(params.row).then(resp=>{
                                                                self.$Message.success({content:"操作成功"})
                                                                self.loadData()
                                                            }).catch(error=>{
                                                                self.$Modal.error({title:"操作失败",content:JSON.stringify(error)})
                                                            })
                                                        }})

                                                }
                                            }},
                                        '拒绝')])
                            }
                        },
                    ],
                },
            }
        },
        mounted(){
            this.loadData()
        },
        methods:{
            pageChange(page) {
                this.mouldForm.page = page.toString();
                this.loadData();
            },
            limitChange(limit) {
                this.mouldForm.limit = limit.toString();
                this.loadData();
            },
            loadData(){
                projectApi.applyListApi(this.mouldForm).then(resp=>{
                    // alert("chengg")
                    this.$Message.success({content:"加载成功"});
                    this.table.userData = resp.page.list;
                    this.recData.total = resp.page.totalCount;
                    console.clear()
                    console.log(resp)
                },onerror=>{
                    this.$Modal.error({title:"查询失败",content:JSON.stringify(onerror)})
                }).catch(err=>{
                    this.$Modal.error({title:"查询失败2",content:JSON.stringify(err)})
                })
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
</style>