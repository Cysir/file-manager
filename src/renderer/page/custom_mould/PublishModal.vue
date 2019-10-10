<template>
    <Modal width="600px" v-model="this_publish" :mask-closable=false :footer-hide=true @on-visible-change="visibleChange">
        <Row class="my-row">
            <Col span="3" style="">收件人</Col>
            <Col span="18">
                <Select :disabled="!type.isCreate" filterable v-model="selectUser" multiple style="width:100%">
                    <Option v-for="item in userList" :value="item.userId" :key="item.userId">{{ item.name }}</Option>
                </Select>
            </Col>
        </Row>
<!--        <template-form  :mould-form="dataContent.content"></template-form>-->
<!--        模板-->

        <Form ref="myform"  :model="testContent">
            <div v-for="item in dataContent.content">


            <Row :gutter="gutter" justify="space-around" class="my-row">

                <Col span="3">{{item.displayName}}</Col>
                <Col span="18">
                    <FormItem v-if="item.type=='input'" :rules="{required: true, message: item.displayName+' 字段不能为空', trigger: 'blur'}" :prop="item.fieldName">
                        <Input v-model="testContent[item.fieldName]" />
                    </FormItem>

                    <FormItem v-if="item.type=='text'" :rules="{required: true, message: item.displayName+' 字段不能为空', trigger: 'blur'}" :prop="item.fieldName">
                        <Input v-model="testContent[item.fieldName]" />
                    </FormItem>

                    <FormItem v-if="item.type=='radio'" :rules="{required: true, message: item.displayName+' 字段不能为空', trigger: 'change'}" :prop="item.fieldName">
                        <RadioGroup  v-model="testContent[item.fieldName]" >
                            <Radio v-for="v in item.optionalValue" :label=v></Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem v-if="item.type=='checkbox'" :rules="{required: true,type: 'array', min: 1, message: item.displayName+' 字段不能为空', trigger: 'change'}" :prop="item.fieldName">
                        <CheckboxGroup v-model="testContent[item.fieldName]" >
                            <Checkbox v-for="v in item.optionalValue" :label=v></Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                    <FormItem v-if="item.type=='date' " :rules="{required: true,type: 'date', message: item.displayName+' 字段不能为空', trigger: 'change'}" :prop="item.fieldName">
                        <DatePicker type='date' v-model="testContent[item.fieldName]" ></DatePicker>
                    </FormItem>

                    <Button v-if="item.type == 'button'" type="primary">{{item.displayName}}</Button>

                </Col>
            </Row>
            </div>
        </Form>
        <Divider/>
<!--        完成情况-->
        <Form ref="extraForm" :model="extraField">
            <FormItem v-if="dataContent.status == 1" :rules="{required: true, message: '请选择完成情况', trigger: 'change'}" prop="status">
            <Row :gutter="gutter" class="my-row">
                <Col span="3">完成状态</Col>
                <Col span="18">
                    <Select v-model="extraField.status">
                        <Option v-for="item in extraField.statusO" :value="item">{{item}}</Option>
                    </Select>
                </Col>
            </Row>
            </FormItem>

            <FormItem v-if="dataContent.gradeState == 1" :rules="{required: true, message: '请选择任务等级', trigger: 'change'}" prop="gradeState">

            <Row :gutter="gutter" class="my-row">
                <Col span="3">任务等级</Col>
                <Col span="18">
                    <!--        等级-->
                    <Select v-model="extraField.gradeState">
                        <Option v-for="item in extraField.gradeStateO" :value="item">{{item}}</Option>

                    </Select>
                </Col>
            </Row>
            </FormItem>
            <FormItem :rules='{
            required: true,
            type: "date",
            message: "Please select the date",
            trigger: "change"
            }' prop="startTime">

                <Row :gutter="gutter" class="my-row">
                    <Col span="3">开始时间</Col>
                    <Col span="18">
                        <DatePicker v-model="extraField.startTime" type="datetime" :value="extraField.startTime"></DatePicker>
                    </Col>
                </Row>
            </FormItem>
            <FormItem :rules='{
            required: true,
            type: "date",
            message: "Please select the date",
            trigger: "change"
            }' prop="endTime">

                <Row :gutter="gutter" class="my-row">
                    <Col span="3">结束时间</Col>
                    <Col span="18">
                        <DatePicker v-model="extraField.endTime" type="datetime"></DatePicker>
                    </Col>
                </Row>
            </FormItem>
        </Form>
        <div v-if="dataContent.urls == 1" style="margin-bottom: 10px">
            <Row :gutter="gutter" class="my-row">
                <Col span="3">附件</Col>
                <Col span="18">
                    <Upload :default-file-list="extraField.fileList" ref="upload" :action="token" :on-error="uploadFail" name="file" :on-success="uploadSuccess">
                        <Button icon="ios-cloud-upload-outline">上传附件</Button>
                    </Upload>
                </Col>
            </Row>
            <Row :gutter="gutter" class="my-row">
                <Col span="3">下载附件</Col>
                <Col span="18">
                        <Button icon="ios-cloud-upload-outline" @click="downloadFile">点击下载</Button>
                </Col>
            </Row>
        </div>
        <Button type="primary" @click="sendData" ref="testForm">发送</Button>
        <Button type="info" @click="saveData" ref="saveForm">保存草稿</Button>
    </Modal>
</template>

<script>

    import customApi from '../../api/custom'
    import {getToken} from '../../utils/auth'

    export default {
        name: "PublishModal",
        props:['publish','mouldContent','saveContent'],
        data(){
            return {
                token:'http://'+localStorage.getItem("serverIp")+'/sys/file/upload?token='+getToken(),
                extraField:{
                    status:'',
                    statusO:['已完成','进行中','未开始'],
                    gradeState:'',
                    gradeStateO:['一级','二级','三级'],
                    url:'',
                    fileList:[],
                    // startTime:new Date(),
                    // endTime:''
                },
            type:{
                isCreate:true,
                id:'',
            },
                //任务类型【默认other】：temporary 不发送 临时任务； other 发送 非临时任务
                taskType:"other",
                gutter:10,this_publish:this.publish,dataContent:this.mouldContent?this.mouldContent:{},userList:null,
                selectUser:[],testContent:this.saveContent?this.saveContent:{}}
        },
        methods:{
            downloadFile(){
                if (this.extraField.url!==""){
                    window.location.href="http://"+localStorage.getItem("serverIp")+"/sys/file/download?"+"token="+getToken()+"&filePath="+this.extraField.url
                    this.$Message.info('下载成功！');
                }else {
                    this.$Message.info('没有附件！');
                }
            },
            insert(){

                this.type.isCreate = true;
                this.extraField.status='';
                this.extraField.gradeState='';
                this.extraField.url='';
                this.extraField.fileList=[];
                this.extraField.startTime = new Date()
                this.extraField.endTime = new Date()
                this.testContent = {};
                this.this_publish = true;
                this.selectUser = [];
                // this.$refs.extraForm.resetFields()
                this.$refs.myform.resetFields()
            },
            update(testContent,extraField,userIds,data=null){

                this.type.isCreate = false;
                this.type.id = data.id;
                console.log('查看操作',userIds);
                console.log('内容',testContent,'额外字段',extraField,'所有信息',data)
                this.testContent = testContent;
                this.extraField.status = extraField.status;
                this.extraField.url = extraField.url;
                this.extraField.gradeState = extraField.gradeState;
                //设置时间
                this.extraField.startTime = new Date(Date.parse(data.startTime))
                console.log('__o__查看项目开始时间',this.extraField.startTime)
                this.extraField.endTime = new Date(Date.parse(data.endTime))
                this.extraField.fileList = extraField.fileList;
                this.this_publish = true;
                this.selectUser = userIds;
                // this.$refs.extraForm.resetFields()
                this.$refs.myform.resetFields()
            },
            uploadFail(err,file,fileList){
                console.log('fileE',file);
                console.log('fileListE',fileList);
            },
            uploadSuccess(response, file, fileList){
                this.extraField.url = response.data;
                console.log('response',response);
                console.log('file',file);
                console.log('fileList',fileList);
            },
            visibleChange(){
                console.log('显示发生改变',this.this_publish);
                this.$emit('change',this.this_publish);
                if (this.this_publish){
                    this.loadUser();
                }
            },
            loadUser(){
                customApi.userListApi().then(resp=>{
                   console.log('用户列表',resp)
                    this.userList = resp.page.list;
                });
            },
            async saveData(){
                alert("保存到草稿")
                this.taskType = "temporary"
                await this.realSendData()
            },
            async sendData(){
                // console.log('aaa',this.extraField.startTime.format('yyyy-MM-dd hh:mm:ss'))
                this.taskType = "other"
                await this.realSendData()
            },
            //发送数据
            async realSendData(){
                console.log('模板内容',this.dataContent);
                console.log('选择用户',this.selectUser);
                let isValidate1 = await this.$refs.myform.validate();
                let isValidate2 = await this.$refs.extraForm.validate();
                console.log(isValidate1,isValidate2);
                if (!isValidate1 || !isValidate2) {
                    this.$Message.error({content:'请正确填写信息'});
                    return ;
                }
                // if ()
                // this.$nextTick(()=>{
                //
                // });
                // setTimeout(()=>{console.log('数据',this.$refs['testForm']);},1000)
                console.log('数据',this.testContent);
                let data =[];
                for (let key in this.testContent){
                    let obj = {};
                    obj[key] = this.testContent[key];
                    data.push(obj)
                }
                let userIds =this.selectUser.length>1? this.selectUser.reduce((v1,v2,cur)=>{
                    if (cur==1){
                        return `'${v1}','${v2}'`
                    }
                    return `${v1},'${v2}'`
                }):`'${this.selectUser[0]}'`;
                if (userIds=="'undefined'"){
                    this.$Message.error({content:"收件人不能为空"});
                    return;
                }
                console.log(userIds)
                let menuId = this.dataContent.menuId;
                let templateFieldId = this.dataContent.id;
                let formData = {
                    startTime:this.extraField.startTime.format('yyyy-MM-dd hh:mm:ss'),
                    endTime:this.extraField.endTime.format('yyyy-MM-dd hh:mm:ss'),
                    taskType:this.taskType,menuId,templateFieldId,userIds,templateData:JSON.stringify(data)};

                if (this.dataContent.status==1){
                    formData.status = this.extraField.status
                }
                if (this.dataContent.gradeState == 1){
                    formData.gradeState = this.extraField.gradeState;
                }
                if (this.dataContent.urls == 1){
                    formData.urls = this.extraField.url;
                }
                console.log("拼接后数据:",formData);
                if (this.type.isCreate){
                    customApi.mouldSendApi(formData).then(resp=>{
                        this.this_publish = false;
                        this.$emit('new_data');
                    }).catch(error=>{
                        console.log(error);
                    })
                } else{
                    formData.id = this.type.id;
                    customApi.mouldUpdateApi(formData).then(resp=>{
                        this.this_publish = false;
                        this.$emit('new_data');
                    }).catch(error=>{
                        console.log(error);
                    })
                }

            }
        },
        watch:{
            publish(val){
                this.this_publish = val;

            },
            mouldContent(val){
                this.dataContent = val;
            }
        }
    }
</script>

<style scoped>
    /deep/.ivu-form-item-error-tip{
        padding-top: 2px;
    }
    /deep/.ivu-form-item{
        margin-bottom: 5px;
    }
    /deep/.ivu-col{
        line-height: 33px;
    }
    .my-row{
        margin-top: 10px;
    }
    .my-row:first-child{
        font-size: 14px
    }
</style>
