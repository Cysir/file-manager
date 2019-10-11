<template>
    <div>
        <div style="margin-top: 0.5%;margin-left: 0.5%">
            <Button type="success" >
                公告公示
            </Button>
            <Button type="success" @click="Popout">
                添加公告
            </Button>
            <Modal
                    v-model="modal1"
                    title="Common Modal dialog box title"
                    @on-ok="ok"
                    @on-cancel="cancel">
                <Form :model="formItem" :label-width="80">
                    <FormItem label="标题">
                        <Input v-model="formItem.input1" placeholder="输入标题..."></Input>
                    </FormItem>
                    <FormItem label="内容">
                        <Input v-model="formItem.textarea" placeholder="输入主要内容.." type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
                    </FormItem>
                    <FormItem label="发布时间" prop="startTime">
                        <DatePicker  v-model="formItem.time" type="datetime" placeholder="请选择发布时间..." style="width: 200px"></DatePicker>
                    </FormItem>
                </Form>
            </Modal>
            <Modal
                    v-model="modal2"
                    title="Common Modal dialog box title"
                    @on-ok="ok2"
                    @on-cancel="cance1">
                <Form :model="formItem2" :label-width="80">
                    <FormItem label="标题">
                        <Input v-model="formItem.input2" placeholder="输入标题..."></Input>
                    </FormItem>
                    <FormItem label="内容">
                        <Input v-model="formItem.textarea2" placeholder="输入主要内容.." type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
                    </FormItem>
                    <FormItem label="发布时间" prop="startTime">
                        <DatePicker  v-model="formItem.time2" type="datetime" placeholder="请选择发布时间..." style="width: 200px"></DatePicker>
                    </FormItem>
                </Form>
            </Modal>
        </div>
        <Row style="background:#eee;padding:20px">
            <div v-for="data in listength">
                <Col span="24">
                    <Card :bordered="true" dis-hover>
                        <div slot="title" >

                        <p  style="height: 35px ;font-family: inherit;font-weight: 700;line-height: 1.1;color: inherit;">
                            标题：
                        {{data.title}}
                            <Button  type="success" @click="deleteAnnouncement(data.id)" >
                                删除
                            </Button>
                            <Button type="success" @click="modificationAnnouncement(data.id)" >
                                修改
                            </Button>
                        </p>
                        </div>
                        <Card :bordered="false">
                            <div slot="title">
                                <p style="font-family: inherit;font-weight: 700;line-height: 1.1;color: inherit;">发布者：{{data.creatorName}}</p>
                            </div>

                            <p style="font-family: inherit;font-weight: 700;line-height: 1.1;color: inherit;">内容:</p>
                            <Card :bordered="false" style="background-color: #fafafa; ">
                                <p>{{data.content }}</p>
                            </Card>

                            &nbsp
                            <p style="font-family: inherit;font-weight: 700;line-height: 1.1;color: inherit;">发布时间:</p>
                            <Card :bordered="false" style="background-color: #fafafa; ">
                                <p>{{data.publishTime}}</p>
                            </Card>
                        </Card>


                    </Card>
                </Col>
            </div>


        </Row>
        <Page :total="totalCount" show-elevator  @on-change="changePage"/>
    </div>

</template>

<script>
    import announcement from '../../api/announcement'
    export default {
        name: "Index",
        data(){
            return{
                totalCount:'',
            listength:[],
            title:'',	//标题
            content:'',//内容
            creatorId:'',	//创建人
            creatorName: '',//姓名
            publishTime:'', //发布时间
                id:'',
            modal1:false,
                modal2:false,
            formItem:{
                input1:'',
                textarea:'',
                time:''
            },
                formItem2:{
                    input2:'',
                    textarea2:'',
                    time2:''
                }
        }

        },
        mounted(){
                this.inie()
        },
        methods:{
            inie(){
                announcement.announcementDataApi().then(resp=>{
                    console.log("公告列表",resp.data)
                    console.log(resp.data.list.length)
                    this.listength=resp.data.list
                    this.totalCount=resp.data.totalCount
                    console.log(resp.data.totalCount)
                }).catch(error=>{
                    console.log("错误！")
                })
            },
            Popout(){
                this.modal1=true
            },
            ok () {
                this.$Message.info("成功!");
               let time=this.dateConversion(this.formItem.time)
                console.log(this.formItem.input1,this.formItem.textarea,time)
                let title=this.formItem.input1
                let content=this.formItem.textarea
                let publishTime=time
                    announcement.preserveDataApi({title,content, publishTime}).then(resp=>{
                        console.log('添加公告列表',resp.msg)
                        this.inie()
                        this.formItem.time=null
                        this.formItem.textarea=null
                        this.formItem.input1=null
                    }).catch(error=>{
                        console.log('错误！')
                    })
            },
            cancel () {
                this.$Message.info('Clicked cancel');

            },
            dateConversion(value){
                var d = new Date(value);
                var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
                return date;
            },
            /*删除公告*/
            deleteAnnouncement(id1){
                let id=id1
                    announcement.deleteApi({id}).then(resp=>{
                        console.log(resp.msg)
                        console.log(resp.data)
                        this.$Message.info('删除成功！');
                        this.inie()
                    }).catch(error=>{
                        console.log('错误！')
                    })
            },
            /*修改公告*/
            modificationAnnouncement(id1){

                this.modal2=true

                let id=id1
                announcement.inquireApi(id).then(resp=>{
                    console.log('查询一个公告信息',resp.data)
                    this.formItem.input2=resp.data.title
                    this.formItem.textarea2=resp.data.content
                    this.formItem.time2=resp.data.publishTime
                     this.id=resp.data.id
                    this.creatorId=resp.data.creatorId
                }).catch(error=>{
                    console.log('错误！')
                })
            },
            ok2 () {
                this.$Message.info("成功!");
                let time=this.dateConversion(this.formItem.time2)
                console.log(this.formItem.input2,this.formItem.textarea2,time)
                let id=this.id
                let creatorId=this.creatorId
                let title=this.formItem.input2
                let content=this.formItem.textarea2
                let publishTime=time
                announcement.modificationDataApi({id,creatorId,title,content, publishTime}).then(resp=>{
                    console.log('修改公告列表',resp.msg)
                    this.inie()
                    this.modal2=false
                }).catch(error=>{
                    console.log('错误！')
                })
            },
            /*分页*/
            changePage(val){
                let page=val
                console.log(page)
                let limit=10
                announcement.pageApi({page,limit}).then(resp=>{
                    console.log("分页查询公告列表",resp.data)
                    console.log(resp.data.list.length)
                    this.listength=resp.data.list
                    this.totalCount=resp.data.totalCount
                }).catch(error=>{
                    console.log("错误！")
                })

            }
        }
    }
</script>

<style scoped>

</style>