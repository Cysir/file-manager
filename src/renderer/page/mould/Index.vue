<template>
    <div style="height: 100%;margin: 10px">
        <Modal width="1000" :mask-closable=false v-model="create" :footer-hide=true class-name="vertical-center-modal">

            <div class="editField" style="font-size: 15px;padding-right: 5px">

                <Divider orientation="left">模板</Divider>

                <Row>

<!--                    <Col span="5">模板名:<Input v-model="mouldTemplate.name" placeholder="如:异常上报" style="width:90px"/></Col>-->
                    <Col span="8">
                        部门: <Select v-model="mouldTemplate.dept" style="width:200px">
                        <Option v-for="item in mouldTemplate.mouldDept" :value="item.deptId" :key="item.deptId">{{ item.name }}</Option>
                    </Select>
                    </Col>
                    <Col span="8">
                        菜单: <Select v-model="mouldTemplate.menu" style="width:200px">
                        <Option v-for="item in mouldTemplate.mouldMenu" :value="item.menuId" :key="item.menuId">{{ item.name }}</Option>
                    </Select>
                    </Col>

                    <Col span="8">
                        <Button style="float: right" type="success" @click="createMould">保存模板</Button>
                    </Col>
                </Row>
                <Divider orientation="left">
                    标题
                </Divider>
                <div>
                <Row gutter="2">
                    <Col span="8">
                        小标题(模板名):<Input v-model="mouldTemplate.name" placeholder="如:异常上报"/>
                    </Col>
                    <Col span="8"> 中标题：<Input v-model="mouldTemplate.subtitle" placeholder="请输入中标题"/></Col>
                    <Col span="8"> 大标题：<Input v-model="mouldTemplate.headings" placeholder="请输入小标题"/></Col>
                </Row>
                </div>
                <Divider orientation="left">
                    公共字段
                </Divider>
                <div >
                    <CheckboxGroup v-model="mouldTemplate.common" >
                        <Checkbox style="font-size: 15px" label="1">附件</Checkbox>
                        <Checkbox style="font-size: 15px" label="2">完成情况</Checkbox>
                        <Checkbox style="font-size: 15px" label="3">等级</Checkbox>
<!--                        <Checkbox label="西瓜"></Checkbox>-->
                    </CheckboxGroup>

                </div>
                <Divider orientation="left">字段</Divider>
                <Row>

                    <Col span="4">显示名:<Input v-model="form.displayName" placeholder="如:姓名" style="width:70px"/></Col>
                    <Col span="4">字段:<Input v-model="form.fieldName" placeholder="如：name" style="width:70px"/></Col>
                    <Col span="4">
                        导出: <Select v-model="form.onlyRead" style="width:70px">
                        <Option v-for="item in modeRadios" :value="item.value" >{{ item.label }}</Option>
                    </Select>
                    </Col>
                    <Col span="4">
                        合并: <Select v-model="form.merge" style="width:70px">
                        <Option v-for="item in mergeData" :value="item.value" >{{ item.label }}</Option>
                    </Select>
                    </Col>
                    <Col span="3">
                        类型: <Select v-model="form.type" style="width:70px">
                        <Option v-for="item in modeTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    </Col>
                    <Col span="3">
                        宽度：<Input v-model="form.widths" style="width: 60px"/>
                    </Col>
                  <!--  <Col span="3">
                        高度：<Input v-model="form.heights" style="width: 60px"/>
                    </Col>-->

                    <Col span="2">
                        <Button style="width: 80px" type="warning" @click="test">添加字段</Button>
                    </Col>


                </Row>
                <Form :model="form">
                <div class="container" v-if="form.type=='radio'||form.type=='checkbox'">

                    <FormItem  v-for="(item,index) in form.optionalValue" :prop="item">
                        <Input v-model="form.optionalValue[index]"  placeholder="输入可选值"></Input>
                    </FormItem>
                    <div>
                        <Button style="width: 50px" type="success" @click="addOptional">添加</Button>
                        <Button style="width: 50px" type="error" v-if="form.optionalValue.length > 0" @click="form.optionalValue.pop()">删除</Button>
                    </div>
                </div>
                </Form>
            </div>
            <div style="height: 380px">
                <Divider orientation="left">页面预览</Divider>
                <template-form ref="mould_form" :mould-form="mould"></template-form>
            </div>
<!--            <Button slot="footer"></Button>-->
        </Modal>
        <div>
            <Button type="success" @click="openCreate">新建模板</Button>
        </div>

        <div style="margin-top: 20px">
            <Table border ref="selection" :columns="headerColumn" :data="mouldData"></Table>

        </div>
<!--        <div style="margin-top: 20px">-->
<!--            <Page style="text-align: center" :total="1000" />-->
<!--        </div>-->
    </div>
</template>

<script>
    import Vue from 'vue'
    //自定义模板控件
    Vue.component("template-form",{
        functional: true,
        props:{
            mouldForm:null,mouldID:null
        },
        //渲染函数
        render(createElement, context) {

            // console.log("a"+context.props.mouldForm)
            return createElement('div',{style:{}},[context.props.mouldForm.map((value,index)=>{
                let vnode = null;
                switch (value.type) {
                    //输入框
                    case 'input':
                        vnode = createElement('Row',{props:{gutter:10,justify:'space-around'},style:{'margin-top':'10px'}},[
                            createElement('Col',{props:{span:3},style:{'font-size':'18px'}},value.displayName),
                            createElement('Col',{props:{span:18}},[createElement('Input')]),
                            createElement('Col',{props:{span:3}},[createElement('Button',{props:{type:'error'},on:{
                                click(){
                                    context.props.mouldForm.splice(context.props.mouldForm.findIndex((v,i) => i ==index ), 1)
                                }
                                }},'删除')])
                        ]);
                        break;
                    //    文本框
                    case 'text':
                        vnode = createElement('Row',{props:{gutter:10,justify:'space-around'},style:{'margin-top':'10px'}},[
                            createElement('Col',{props:{span:3},style:{'font-size':'18px'}},value.displayName),
                            createElement('Col',{props:{span:18}},[createElement('Input')]),
                            createElement('Col',{props:{span:3}},[createElement('Button',{props:{type:'error'},on:{
                                    click(){
                                        context.props.mouldForm.splice(context.props.mouldForm.findIndex((v,i) => i ==index ), 1)
                                    }
                                }},'删除')])
                        ]);
                        break;
                    case 'radio':
                        vnode = createElement('Row',{props:{gutter:10,justify:'space-around'},style:{'margin-top':'10px'}},[
                            createElement('Col',{props:{span:3},style:{'font-size':'18px'}},value.displayName),
                            createElement('Col',{props:{span:18}},[createElement('RadioGroup',[value.optionalValue.map((value,index)=>{
                                return createElement('Radio',{props:{label:value}})
                            })])]),
                            createElement('Col',{props:{span:3}},[createElement('Button',{props:{type:'error'},on:{
                                    click(){
                                        context.props.mouldForm.splice(context.props.mouldForm.findIndex((v,i) => i ==index ), 1)
                                    }
                                }},'删除')])
                        ]);
                        break;
                    case 'checkbox':
                        vnode = createElement('Row',{props:{gutter:10,justify:'space-around'},style:{'margin-top':'10px'}},[
                            createElement('Col',{props:{span:3},style:{'font-size':'18px'}},value.displayName),
                            createElement('Col',{props:{span:18}},[createElement('CheckboxGroup',[value.optionalValue.map((value,index)=>{
                                return createElement('Checkbox',{props:{label:value}})
                            })])]),
                            createElement('Col',{props:{span:3}},[createElement('Button',{props:{type:'error'},on:{
                                    click(){
                                        context.props.mouldForm.splice(context.props.mouldForm.findIndex((v,i) => i ==index ), 1)
                                    }
                                }},'删除')])
                        ]);
                        break;
                    case 'date':
                        vnode = createElement('Row',{props:{gutter:10,justify:'space-around'},style:{'margin-top':'10px'}},[
                            createElement('Col',{props:{span:3},style:{'font-size':'18px'}},value.displayName),
                            createElement('Col',{props:{span:18}},[createElement('DatePicker',{props:{multiple:true,type:'date',placeholder:'请选择日期'},style:{width:'300px'}})]),
                            createElement('Col',{props:{span:3}},[createElement('Button',{props:{type:'error'},on:{
                                    click(){
                                        context.props.mouldForm.splice(context.props.mouldForm.findIndex((v,i) => i ==index ), 1)
                                    }
                                }},'删除')])
                        ]);
                        break;
                    case 'button':
                        vnode = createElement('Row',{props:{gutter:10,justify:'space-around'},style:{'margin-top':'10px'}},[
                            createElement('Col',{props:{span:3},style:{'font-size':'18px'}},' '),
                            createElement('Col',{props:{span:18}},[createElement('Button',{props:{type:'primary'}},value.displayName)]),
                            createElement('Col',{props:{span:3}},[createElement('Button',{props:{type:'error'},on:{
                                    click(){
                                        context.props.mouldForm.splice(context.props.mouldForm.findIndex((v,i) => i ==index ), 1)
                                    }
                                }},'删除')])
                        ]);
                        break;
                }
                return vnode;
            })])
        }
    });
    import mould from '../../api/mould'
    export default {
        name: "Index",
        async mounted(){
            mould.queryMould().then(resp=>{
               console.log('得到所有模板:',resp);
               this.mouldData = resp.data;
               // this.mouldTemplate.common = [resp.data]
            }).catch(error=>{
                console.log('模板加载错误',error);
            });
            try{
                let emp = await mould.getEmp();
                let menu = await mould.getMenuList();
                this.mouldTemplate.mouldMenu = menu.data;
                this.mouldTemplate.mouldDept = emp.data;
                console.log(emp)
                console.log(menu)
            }
            catch (e) {

            }

        },
        methods:{
            openCreate(){
                //打开创建的面板
                this.menu()
                this.create = true;
                this.mouldTemplate.id = null;
                this.mouldTemplate.name=''
                this.mouldTemplate.headings=''
                this.mouldTemplate.subtitle=''
                this.mouldTemplate.common=[]
                this.restMould();
               this.mounted()

            },
            menu(){
                mould.getMenuList().then(resp=>{
                    this.mouldTemplate.mouldMenu = resp.data;
                }).catch(error=>{
                    console.log("错误！")
                })
            },
            createMould(){
                let menuId = this.mouldTemplate.menu;
                let templateName = this.mouldTemplate.name;
                let deptId = this.mouldTemplate.dept;
                //中标题
                let subtitle=this.mouldTemplate.subtitle;
                //小标题
                let headings=this.mouldTemplate.headings;
                let content = JSON.stringify(this.mould);
                //设置导出字段
                let deriveWord = [];
                for (let f of this.mould){
                    if (f.onlyRead == 'yes')
                        deriveWord.push(f)
                }
                deriveWord = JSON.stringify(deriveWord)
                //
                let id = this.mouldTemplate.id;
                console.log(JSON.stringify(this.mould));
                let urls = 0;
                let status = 0;
                let gradeState = 0;
                for (let v of this.mouldTemplate.common){
                    if (v == 1){
                        urls = 1;
                    }
                    if(v == 2){
                        status = 1;
                    }
                    if (v==3){
                        gradeState = 1;
                    }
                }
                mould.saveMould({subtitle,headings,deriveWord,templateName,menuId,deptId,content,id,urls,status,gradeState}).then(resp=>{
                    this.$Message.info({content:"模板创建成功"});
                    this.restMould();
                    mould.queryMould().then(resp=>{
                        console.log('得到所有模板:',resp);
                        this.mouldData = resp.data;
                        this.mouldTemplate.mouldMenu=[]
                    }).catch(error=>{
                        console.log('模板加载错误',error);
                    });
                }).catch(error=>{
                    this.$Modal.error({content:"模板创建失败"})
                })

            },
            test(){
                this.mould.push(this.form);
                console.log(this.mould);
                this.restForm();
            },
            addOptional(){
                this.form.optionalValue.push("");
            },

            restMould(){
            //    重置模板
                this.mould = [];
                this.restForm();
            },
            restForm(){
                //重置表单
                this.form = {
                    displayName:'',
                    fieldName:'',
                    onlyRead:'yes',
                    type:'input',
                    widths:100,
                  /*  heights:40,*/
                    optionalValue:[]};
            }
        },
        data(){
            return {

                mouldTemplate:{
                    id:null,
                    name:'',
                    dept:'',
                    menu:'',
                    subtitle:'',
                    headings:'',
                    mouldDept:[],
                    mouldMenu:[],
                    common:[],
                },
                form:{
                    displayName:'',
                    fieldName:'',
                    onlyRead:'yes',
                    merge:'no',
                    type:'input',
                    widths:100,
                   /* heights:40,*/
                    optionalValue:[]},
                mould:[],
                create:false,

                modeRadios:[{value:'yes',label:'是'},{value:'no',label:'否'}],
                mergeData:[{value:'no',label:'否'},{value:'yes',label:'是'}],
                modeTypes:[{value:'input',label:'输入框'},{value:'text',label:'文本框'},{value:'radio',label:'单选框'},{value:'checkbox',label:'多选框'},{value:'date',label:'日期框'},{value:'button',label:'按钮'}],
                headerColumn: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '模板名称',
                        key: 'templateName'
                    },
                    {
                        title: '所属部门',
                        key: 'deptIdName'
                    },
                    {
                        title: '所属菜单',
                        key: 'menuIdName'
                    },
                    {
                        title: '操作',
                        width:'120px',
                        render:(h,params)=>{
                            let _this = this;
                            return h('div',[h('Button',{props:{type:'info',size:'small'},style:{
                                'margin-right':'1px'
                                },on:{
                                click(){
                                    //查看模板
                                    _this.mouldTemplate.id = params.row.id;
                                    _this.mould = JSON.parse(params.row.content);
                                    _this.create =true;
                                    _this.mouldTemplate.dept = params.row.deptId;
                                    _this.mouldTemplate.menu = params.row.menuId;
                                    _this.mouldTemplate.name = params.row.templateName;
                                    _this.mouldTemplate.subtitle = params.row.subtitle
                                    _this.mouldTemplate.headings = params.row.headings
                                    console.log("前置多选框值",params.row);
                                    _this.mouldTemplate.common = [params.row.urls==1?'1':'0',params.row.status==1?'2':'0',params.row.gradeState==1?'3':'0'];
                                    console.log('加载多选按钮值：',_this.mouldTemplate.common);
                                }
                                }},'查看'),h('Button',{props:{type:'error',size:'small'},on:{
                                    click(){
                                        _this.$Modal.confirm({content:"确定删除模板吗？",onOk(){
                                            mould.deleteMould(params.row.id).then(resp=>{
                                                console.log('删除模板成功');
                                                let i = _this.mould.findIndex((value,index)=>{
                                                    return value.id == params.row.id
                                                });
                                                _this.mould.splice(index,1);
                                            }).catch(error=>{
                                                console.log('删除模板时发生错误')
                                            })
                                            },onCancel(){}})
                                    }
                                }},'删除')])
                        }
                    }
                ],
                mouldData: []
            }
        }
    }
</script>

<style scoped>
    .vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;

    }
    .container {
        display: grid;
        grid-template-columns: repeat(5,1fr);
        width: 100%;
    }
    .editField>div{
        margin-top: 10px;
    }
</style>
