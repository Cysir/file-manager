<template>
    <div class="user-content">
        <Modal  v-model="project.isShow" :mask-closable="false" :footer-hide="true" @on-visible-change="visibleChange">
            <div style="margin:0px 20px">
                <div style="display: inline-block;position: relative;top:-3px">
                    <Icon size="20" type="md-checkmark-circle" color="green"/>
                </div>
                <div style="font-size: 16px;line-height: 20px;display: inline-block">提示：确定同意用户【{{project.name}}】申请项目【{{project.projectName}}】吗</div>
                <div style="font-size: 14px;margin-top: 20px">
                    请选择项目所属菜单：
                </div>
                <Select v-model="project.menuIds" multiple style="margin-bottom: 20px">
                    <Option v-for="item in project.allMenus" :value="item.menuId" :key="item.menuId">{{item.parentName+'--'+item.name}}</Option>
                </Select>
                <Button type="primary" @click="agreeApply">确认</Button>
            </div>

        </Modal>
<!--        延期弹窗-->
        <Modal v-model="updateTime.isShow" :mask-closable="false" :footer-hide="true" @on-visible-change="">
            <div style="margin:0px 20px">
                <div style="display: inline-block;position: relative;top:-3px">
                    <Icon size="20" type="md-checkmark-circle" color="green"/>
                </div>
                <div style="font-size: 16px;line-height: 20px;display: inline-block">提示：请选择延期时间</div>
                <p style="margin-top: 30px">项目名：{{updateTime.data.name}}</p>
                <p style="margin-top: 20px">负责人：{{updateTime.data.applyForIdName}}</p>
                <div style="margin-top: 20px">
                    项目开始时间：
                    <DatePicker :value="new Date(updateTime.data.startTime)" type="datetime" readonly placeholder="请选择时间" style="width: 200px;"></DatePicker>
                <br/>
                    项目结束时间：
                    <DatePicker v-model="updateTime.data.endTime" :value="updateTime.data.endTime" type="datetime" placeholder="请选择时间" style="width: 200px;margin-top: 20px" ></DatePicker>
                </div>
                <Button style="margin-top: 20px;margin-bottom: 20px" type="success" @click="toUpdateTime">提交</Button>
            </div>
        </Modal>

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
                updateTime:{
                    isShow:false,
                    data:{}
                },
                project:{
                    data:null,
                    allMenus:[],
                    isShow:false,
                    menuIds:[],
                    name:'',
                    projectName:''
                },
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
                    },{
                        title:'项目进度',
                        width: 200,
                        render:(h,param)=>{
                            return h('Progress',{
                                props:{
                                    status:'active',
                                    percent:param.row.percentage
                                }
                            })
                        }
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
                                let able = params.row.status == 0||params.row.status == 1;
                                return h('div',{
                                    props:{
                                        // class:'opt_menu'
                                    },
                                },[
                                    h('Button',{props:{
                                            disabled:able,
                                            size:'small',type:'info'
                                        },
                                        style:{
                                            'margin-right':'2px'
                                        },on:{
                                            click(){
                                                console.log('当前点击的数据',params.row);
                                                self.openAlert(params.row);
                                                // self.$Modal.confirm({title:"提示：此操作为 同意",content:'确认同意用户['+params.row.applyForIdName+']申请项目['+params.row.name+']吗?',onOk(){
                                                //         params.row.status = 0;
                                                //         projectApi.applyUpdateApi(params.row).then(resp=>{
                                                //             self.$Message.success({content:"操作成功"})
                                                //             self.loadData()
                                                //         }).catch(error=>{
                                                //             self.$Modal.error({title:"操作失败",content:JSON.stringify(error)})
                                                //         })
                                                //     }})
                                            }
                                        }
                                    },'同意'),
                                    h('Button',{props:{
                                                disabled:able,
                                                size:'small',type:'error'
                                            },on:{
                                                click(){
                                                    self.$Modal.confirm({title:"提示：此操作为 拒绝",content:'确认拒绝用户['+params.row.applyForIdName+']申请项目['+params.row.name+']吗?',onOk(){
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
                                        '拒绝'),h('Button',{props:{
                                                size:'small',type:'warning'
                                            },on:{
                                                click(){
                                                    self.updateTime.isShow = true

                                                    let xincan_data = {}
                                                    Object.assign(xincan_data,params.row)
                                                    xincan_data.endTime = new Date(xincan_data.endTime)
                                                    self.updateTime.data = xincan_data
                                                    console.log('延期时间数据',self.updateTime.data)
                                                }
                                            }},
                                        '延期')])
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
            agreeApply(){
                        this.project.data.status = 0
                this.project.data.menuId = this.project.menuIds;
                        projectApi.applyUpdateApi(this.project.data).then(resp=>{
                            this.$Message.success({content:"操作成功"})
                            this.project.isShow = false
                            this.loadData()
                        }).catch(error=>{
                            this.$Modal.error({title:"操作失败",content:JSON.stringify(error)})
                        })
            },
            openAlert(data){
                this.project.data = data
                this.project.isShow = true
                console.log("data:",data)
                this.project.name = data.applyForIdName
                this.project.projectName = data.name
            },
            visibleChange(isShow){
                if (isShow){
                    projectApi.applyMenuApi().then(resp=>{
                        this.project.allMenus = resp.data

                    }).catch(error=>{
                        this.$Modal.error({title:"获取菜单时发生错误",content:JSON.stringify(error)});
                    })
                }
                this.project.isShow = isShow

            },
            pageChange(page) {
                this.mouldForm.page = page.toString();
                this.loadData();
            },
            limitChange(limit) {
                this.mouldForm.limit = limit.toString();
                this.loadData();
            },
            toUpdateTime(){
                if (this.updateTime.data.endTime==null || this.updateTime.data.endTime == ""){
                    this.$Modal.error({content:"请选择延期的时间"})
                    return
                }
                // let updateData = {...this.updateTime.data}
                // Object.assign(updateData,this.updateTime.data)
                // this.updateTime.data.endTime = this.updateTime.data.endTime.getTime()
                // updateData.endTime = updateData.endTime.getTime()
                let data = {}
                Object.keys(this.updateTime.data).forEach(v=>{
                    data[v]=this.updateTime.data[v]
                })
                data.endTime = this.updateTime.data.endTime.getTime()
                console.log('更新时间',data)

                projectApi.applyUpdateTimeApi(data).then(resp=>{
                    this.$Message.success({content:"延期成功"})
                    this.updateTime.isShow = false
                    // this.updateTime.data = null
                    // this.$forceUpdate()
                    this.loadData()
                }).catch(error=>{
                    // this.$Modal.error({title:"延期时发生错误",content:JSON.stringify(error)})
                    this.$Message.error({content:"延期失败"})
                    this.updateTime.isShow = false
                    // this.updateTime.data = null
                })
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