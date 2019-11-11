<template>
    <div class="custom_content">

        <div>
            <PublishModal ref="alert" :publish="isPublish" @new_data="newData" @change="x=>isPublish =x"
                          :mould-content="mouldContent"/>
            <Modal  v-model="exportWord.isShow" :mask-closable="false" :footer-hide="true" @on-visible-change="exportChange">
                <Divider orientation="left">导出报表</Divider>
                <Form label-position="top"  ref="myApplyForm" :model="exportWord.searchParams">
                    <FormItem label="任务等级">
                        <RadioGroup v-model="exportWord.searchParams.gradeState">
                            <Radio label="">全部</Radio>
                            <Radio label="一级"></Radio>
                            <Radio label="二级"></Radio>
                            <Radio label="三级"></Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="完成状态">
                        <RadioGroup v-model="exportWord.searchParams.status">
                            <Radio label="">全部</Radio>
                            <Radio label="未开始"></Radio>
                            <Radio label="进行中"></Radio>
                            <Radio label="已完成"></Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="开始时间" prop="startTime">
                        <DatePicker  v-model="exportWord.searchParams.startTime" type="datetime" placeholder="请选择开始时间" style="width: 200px"></DatePicker>
                    </FormItem>
                    <FormItem label="结束时间" prop="endTime">
                        <DatePicker v-model="exportWord.searchParams.endTime" type="datetime" placeholder="请选择结束时间" style="width: 200px"></DatePicker>
                    </FormItem>
                    <Button type="primary" @click="toexportWord">导出word</Button>
                    <Button type="primary" @click="toexportExcel">导出excel</Button>
                    <Button type="primary" @click="alltoexportExcel">导出项目word</Button>
                </Form>
            </Modal>
        </div>
        <div style="">
            <div class="filterHeader">
                <Button type="primary"  >{{this.exportWord.mouldName}}</Button>

                等级:
                <Select placeholder="任务等级" style="width: 70px" v-model="queryParam.gradeState">
                    <Option v-for="item in settingParam.gradeState" :label="item.label" :value="item.value">

                    </Option>
                </Select>
                情况:
                <Select placeholder="完成情况" style="width: 70px" v-model="queryParam.status">
                    <Option v-for="item in settingParam.status" :label="item.label" :value="item.value">
                    </Option>
                </Select>
                查询时间:
                <DatePicker @on-clear="clear" v-model="queryParam.startTime" type="datetime" placeholder="请选择开始时间" style="width: 150px"></DatePicker>
                -
                <DatePicker @on-clear="clear" v-model="queryParam.endTime" type="datetime" placeholder="请选择结束时间" style="width: 150px"></DatePicker>
                关键字：
                <Input v-model="queryParam.sendDataPublicFields" placeholder="输入搜索关键字..." clearable style="width: 150px" />
                <Button type="info" STYLE="float: right;margin-left: 5px" @click="()=>{exportWord.isShow = true}">导出报表</Button>
                <Button type="primary" @click="insert" style="float: right">下发任务</Button>
                <Button type="info" STYLE="float: right;margin-right: 5px" @click="search">查询</Button>

            </div>
            <Table ref="table" :columns="tableCol" border :data="recData.list">

            </Table>
            <div style="margin-top: 20px">
                <Page :total="recData.total" show-sizer @on-change="pageChange" @on-page-size-change="limitChange"/>
            </div>
        </div>

    </div>
</template>

<script>
    import PublishModal from "./PublishModal";
    import customeApi from "../../api/custom";
    import {getToken} from '../../utils/auth'
    const Qs = require('qs');
    export default {
        name: "Index",
        components: { PublishModal},
        data() {
            return {
                exportWord:{
                    isShow:false,
                    mouldName:'',
                    allmouldName:'',
                    searchParams:{
                        menuId:'',
                        templateFieldId:'',
                        status:"",
                        startTime:'',
                        endTime:'',
                        gradeState:""

                    },
                    parentId:'',

                },
                my_data:{},
                my_col :[
                    {
                        title:'项目进度',
                        width: 200,
                        fixed:'left',
                        render:(h,param)=>{
                            return h('Progress',{
                                props:{
                                    status:'active',
                                    percent:param.row.completionSchedule
                                }
                            })
                        }
                    },
                    {
                        title: '等级',
                        key: 'gradeState',
                        width:80
                    },
                    {
                        title: '接收人',
                        key: 'sysName'
                    },
                  {
                         title: '任务名称',
                        key: 'sendDataPublicFields',
                     },
                    {
                        title: '创建人',
                        key: 'creationPerson'
                    },
                    {
                        title: '修改人',
                        key: 'modificationPerson'
                    },
                    {
                        title: '任务申请时间',
                        key: 'modificationTime'
                    },
                    {
                        title: '完成状态',
                        key: 'status'
                    },
                    {
                        title: '是否草稿',
                        key: 'taskType',
                        width:90,
                        render:(h,param)=>{
                            let text = param.row.taskType == 'temporary'?"草稿":"已送达"
                            return h('div',text)
                        }
                    },
                    {
                        title: '操作',
                        width: 126,
                        render: (h, params) => {
                            let self = this;
                            return h('div',[h('Button',
                                {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    style:{
                                        width:'82px',
                                        margin:'1px 0px'
                                    },
                                    on: {
                                        click() {

                                            let data = params.row;
                                            let testContent = {};
                                            let templateData = JSON.parse(data.templateData);
                                            for (let data of templateData) {
                                                for (let key in data) {
                                                    testContent[key] = data[key];
                                                }
                                            }
                                            let extraField = {
                                                sendDataPublicFields:data.sendDataPublicFields,
                                                status: data.status,
                                                gradeState: data.gradeState,
                                                url: data.urls,
                                                fileList: data.urls != null ? [{
                                                    name: '文件：' + data.urls.split('/')[data.urls.split('/').length - 1],
                                                    url: data.urls
                                                }] : []
                                            };
                                            console.log('拼接后的data', testContent);
                                            console.log(data.userIds, data.userIds.replace("'", ''));
                                            let userId = data.userIds.replace(/'/g, '').split(',').map(v => {
                                                return parseInt(v);
                                            });
                                            self.$refs.alert.update(testContent, extraField, userId, data);
                                            //     .testContent = testContent;
                                            // self.$refs.alert.extraField = extraField;
                                            // self.isPublish = true;
                                        }
                                    }
                                }, '查看'),h('Button',{
                                style:{
                                    margin:'0px 1px'
                                },
                                props: {
                                    type: 'primary',
                                    size: 'small',

                                },
                                on:{
                                    click(){
                                        let id = params.row.id
                                        let sortOrder = 'up'
                                        customeApi.mouldMoveApi({id,sortOrder}).then(resp=>{
                                            self.$Message.success({content:'操作成功'})
                                            self.loadData()
                                        }).catch(err=>{
                                            self.$Message.error({content:'操作失败'})
                                        })
                                    }
                                },
                                },'上移'),h('Button',{
                                style:{
                                    margin:'0px 1px'
                                },
                                props: {
                                    type: 'success',
                                    size: 'small'
                                },
                                on:{
                                    click(){
                                        let id = params.row.id
                                        let sortOrder = 'down'
                                        customeApi.mouldMoveApi({id,sortOrder}).then(resp=>{
                                            self.$Message.success({content:'操作成功'})
                                            self.loadData()
                                        }).catch(err=>{
                                            self.$Message.error({content:'操作失败'})
                                        })
                                    }
                                }
                                },'下移')])
                        }
                    }
                ],
                mouldContent: null,
                queryParam:{
                    sendDataPublicFields:'',
                    startTime:'',
                    endTime:new Date(),
                    status:'',
                    gradeState:'',
                },
                settingParam:{
                    status:[
                        {label:'未开始',value:'未开始'},
                        {label:'进行中',value:'进行中'},
                        {label:'已完成',value:'已完成'},
                        {label:'全部',value:'全部'},
                    ],
                    gradeState:[
                        {label:'一级',value:'一级'},
                        {label:'二级',value:'二级'},
                        {label:'三级',value:'三级'},
                        {label:'全部',value:'全部'},
                    ]
                },
                recData: {
                    total: 0,
                    currPage: 0,
                    list: [],
                    totalPage: 0
                },
                tableCol: [


                ],
                path: '未定义', isPublish: false, total: 0,
                mouldForm: {
                    page: '0', limit: '10', templateFieldId: 0, menuId: 0
                }
            }
        },
        created() {
            this.init();

        },
        beforeRouteUpdate(to, from, next) {
            // react to route changes...
            // don't forget to call next()
            next();
            console.log('进入下一步方法')
            this.init();
        }, methods: {
            //导出word,
            toexportWord(){
                console.log('查询参数WORD:',this.exportWord.searchParams)
                this.exportWord.searchParams.token = getToken()
                // let param = Qs.stringify(this.exportWord.searchParams)
                // window.location.href="http://"+localStorage.getItem("serverIp")+":8088/sys/query/deriveword?"+"token="+getToken()+param
                let params = {}
                for (let key in this.exportWord.searchParams) {
                    params[key] = this.exportWord.searchParams[key]
                }
                if ( this.exportWord.searchParams.startTime != ''){
                    params.startTime = this.exportWord.searchParams.startTime.getTime()
                }
                if(this.exportWord.searchParams.endTime != ''){
                    params.endTime = this.exportWord.searchParams.endTime.getTime()
                }

                customeApi.mouldExportWord(params).then(resp=>{
                    // console.log(resp.headers)
                    console.log('下载参数：',resp)
                    let url = window.URL.createObjectURL(resp.data);
                    let link = document.createElement('a');
                    link.style.display = 'none';
                    link.href = url;
                    link.setAttribute('download','项目:'+this.exportWord.mouldName+'  word报表.docx');
                    document.body.appendChild(link);
                    link.click();
                }).catch(err=>{
                    console.log('err,导出word',err)
                })
            },
            alltoexportExcel(){
                console.log('查询参数WORD:',this.exportWord.searchParams)
                this.exportWord.searchParams.token = getToken()
                // let param = Qs.stringify(this.exportWord.searchParams)
                // window.location.href="http://"+localStorage.getItem("serverIp")+":8088/sys/query/deriveword?"+"token="+getToken()+param
                let parentId=this.exportWord.parentId
                let params = {parentId:parentId}
                for (let key in this.exportWord.searchParams) {
                    params[key] = this.exportWord.searchParams[key]
                }
                if ( this.exportWord.searchParams.startTime != ''){
                    params.startTime = this.exportWord.searchParams.startTime.getTime()
                }
                if(this.exportWord.searchParams.endTime != ''){
                    params.endTime = this.exportWord.searchParams.endTime.getTime()
                }

                customeApi.allmouldExportWord(params).then(resp=>{
                    // console.log(resp.headers)
                    console.log('下载参数：',resp)
                    let url = window.URL.createObjectURL(resp.data);
                    let link = document.createElement('a');
                    link.style.display = 'none';
                    link.href = url;
                    link.setAttribute('download','项目:'+this.exportWord.allmouldName+'  word报表.docx');
                    document.body.appendChild(link);
                    link.click();
                }).catch(err=>{
                    console.log('err,导出word',err)
                })
            },
            //导出excel
            toexportExcel(){
                console.log('查询参数EXCEL:',this.exportWord.searchParams)
                this.exportWord.searchParams.token = getToken()
                let params = {}
                for (let key in this.exportWord.searchParams) {
                    params[key] = this.exportWord.searchParams[key]
                }
                if ( this.exportWord.searchParams.startTime != ''){
                    params.startTime = this.exportWord.searchParams.startTime.getTime()
                }
                if(this.exportWord.searchParams.endTime != ''){
                    params.endTime = this.exportWord.searchParams.endTime.getTime()
                }
                // let param = Qs.stringify(this.exportWord.searchParams)
                // window.location.href="http://"+localStorage.getItem("serverIp")+":8088/sys/query/deriveword?"+"token="+getToken()+param
                customeApi.mouldExportExcel(params).then(resp=>{
                    // console.log(resp.headers)
                    console.log('下载参数：',resp)
                    let url = window.URL.createObjectURL(resp.data);
                    let link = document.createElement('a');
                    link.style.display = 'none';
                    link.href = url;
                    link.setAttribute('download','项目:'+this.exportWord.mouldName+'  excel报表.xls');
                    document.body.appendChild(link);
                    link.click();
                }).catch(err=>{
                    console.log('err,导出word',err)
                })
            },
            //导出报表菜单
            exportChange(isShow){

            }
            ,
            exportData(){

                this.$refs.table.exportCsv({
                    filename:this.mouldContent.templateName
                });
            },
            clear(){
                console.log('清楚时间',this.queryParam.startTime);
                // this.queryParam.startTime = {};
                console.log('清楚时间2',this.queryParam.startTime);
            },
            newData() {
                this.loadData();
            },
            insert() {
                this.$refs.alert.insert();
            },
            pageChange(page) {
                this.mouldForm.page = page.toString();
                this.loadData();
            },
            limitChange(limit) {
                this.mouldForm.limit = limit.toString();
                this.loadData();
            },
            async loadData() {
                let mouldList = await customeApi.mouldDataList(this.mouldForm);
                console.log("加载的模板数据", mouldList);
                this.recData.total = mouldList.object.page.totalCount;
                this.recData.list = mouldList.object.page.list;
                console.log('数据内容：',this.recData.list);
                let allContent = this.recData.list.map(v=>{
                    let arr = JSON.parse(v.templateData);
                    for (let i = 0; i < arr.length; i++) {
                        for(let key in arr[i]){
                            v[key] = arr[i][key];
                        }
                    }
                    return v
                });
                console.log('处理后的数据内容',allContent);
                this.recData.currPage = mouldList.object.page.currPage;
                this.recData.totalPage = mouldList.object.page.totalPage;
            },
            search(){
                try{
                    let time = this.queryParam.startTime.getTime();
                    console.log('查看时间',this.queryParam.startTime);
                    this.mouldForm.startTime = time;

                }
                catch (e) {
                    console.log('发生错误',e)
                    delete this.mouldForm.startTime;

                }
                try{
                    this.mouldForm.endTime = this.queryParam.endTime.getTime();
                }
                catch (e) {
                    console.log('发生错误',e)
                    delete this.mouldForm.endTime;
                }
                let self = this;
                let findF = (v)=>{
                    return self.queryParam.status == v.value;
                };
                let findF2 = (v)=>{
                    return self.queryParam.gradeState == v.value;
                };
                let findF3 = (v)=>{
                        return self.queryParam.sendDataPublicFields == v.value;
                };
                if (this.settingParam.status.findIndex(findF)!=-1) {
                    this.mouldForm.status = this.queryParam.status;
                    this.mouldForm.sendDataPublicFields = this.queryParam.sendDataPublicFields;
                }else{
                    delete this.mouldForm.status
                    this.mouldForm.sendDataPublicFields = this.queryParam.sendDataPublicFields;
                }
                if (this.settingParam.gradeState.findIndex(findF2)!=-1) {
                    this.mouldForm.gradeState = this.queryParam.gradeState;
                    this.mouldForm.sendDataPublicFields = this.queryParam.sendDataPublicFields;
                }else{
                    delete this.mouldForm.gradeState
                    this.mouldForm.sendDataPublicFields = this.queryParam.sendDataPublicFields;
                }
                if (this.queryParam.status =='全部'){
                    delete this.mouldForm.status
                    this.mouldForm.sendDataPublicFields = this.queryParam.sendDataPublicFields;
                }
                if(this.queryParam.gradeState=='全部'){
                    delete this.mouldForm.gradeState
                    this.mouldForm.sendDataPublicFields = this.queryParam.sendDataPublicFields;
                }


                console.log('查询',this.queryParam);
                this.loadData();
            },
            async init() {
                this.path = this.$route.path;
                console.log("测试！",this.$route);
                // console.log("加载的参数id",this.$route.params.id);
                let mouldTemp = await customeApi.mouldListApi(this.$route.params.id);
                console.log('数据模板',mouldTemp);
                console.log('模板ID',mouldTemp.data.menuId)
                this.exportWord.parentId=mouldTemp.data.parentId
                console.log('上级菜单ID',mouldTemp.data.parentId)
                this.exportWord.mouldName = mouldTemp.data.templateName;
                this.exportWord.allmouldName=mouldTemp.data.subtitle
                console.log('模板名称',mouldTemp.data.templateName)
                let coustom_col = JSON.parse(mouldTemp.data.content).map(v=>{
                    return {title:v.displayName,key:v.fieldName};
                });
                console.log('啊啊》',coustom_col)
                this.tableCol = [];
                this.tableCol.push(...coustom_col,...this.my_col);
                this.mouldForm.menuId = mouldTemp.data.menuId;
                this.mouldForm.templateFieldId = mouldTemp.data.id;
                //设置默认的导出菜单参数
                this.exportWord.searchParams.menuId = mouldTemp.data.menuId;
                this.exportWord.searchParams.templateFieldId = mouldTemp.data.id;
                mouldTemp.data.content = JSON.parse(mouldTemp.data.content);
                this.mouldContent = mouldTemp.data;
                this.loadData();
                console.log("初始化完成")
            }
        }
    }
</script>

<style scoped>

    .custom_content {
        padding: 5px;
        width: 100%;
        height: 100%;
        /*background-color: #4fc08d;*/
    }
    .filterHeader{
        margin:10px 0px 2px;
    }
    .filterHeader > div{
        display: inline-block;
        margin-right: 3px;
    }
</style>
