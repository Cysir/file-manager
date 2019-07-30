<template>
    <div style="height: 100%;padding: 10px">
        <Modal width="800" height="800" :mask-closable=false v-model="create" :footer-hide=true class-name="vertical-center-modal">

            <div class="editField" style="font-size: 15px;padding-right: 5px">

                <Divider orientation="left">模板</Divider>

                <Row>
                    <Col span="5">模板名:<Input placeholder="如:异常上报" style="width:90px"/></Col>
                    <Col span="5">
                        部门: <Select v-model="readOnly" style="width:100px">
                        <Option v-for="item in modeRadios" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    </Col>
                    <Col span="5">
                        菜单: <Select v-model="readOnly" style="width:100px">
                        <Option v-for="item in modeRadios" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    </Col>

                </Row>
                <Divider orientation="left">字段</Divider>
                <Row>
                    <Col span="5">显示名:<Input placeholder="如:姓名" style="width:90px"/></Col>
                    <Col span="5">字段:<Input placeholder="如：name" style="width:90px"/></Col>
                    <Col span="5">
                        只读: <Select v-model="readOnly" style="width:100px">
                        <Option v-for="item in modeRadios" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    </Col>
                    <Col span="5">
                        类型: <Select v-model="modeType" style="width:100px">
                        <Option v-for="item in modeTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    </Col>
                    <Col span="4">
                        <Button style="" type="warning" @click="test">添加字段</Button>
                    </Col>

                </Row>
                <Form :model="form">
                <div class="container" v-if="modeType=='radio'||modeType=='checkbox'">

                    <FormItem  v-for="(item,index) in form.optionalValue" :prop="item">
                        <Input v-model="form.optionalValue[index]"  placeholder="输入可选值"></Input>
                    </FormItem>
                    <div>
                        <Button style="width: 50px" type="success" @click="addOptinal">添加</Button>
                        <Button style="width: 50px" type="error" v-if="form.optionalValue.length > 0" @click="form.optionalValue.pop()">删除</Button>
                    </div>
                </div>
                </Form>
            </div>
            <div style="height: 380px">
                <Divider orientation="left">页面预览</Divider>
            </div>
<!--            <Button slot="footer"></Button>-->
        </Modal>
        <div>
            <Button type="primary" @click="create=true">新建模板</Button>
        </div>

        <div style="margin-top: 20px">
            <Table border ref="selection" :columns="headerColumn" :data="data1"></Table>

        </div>
        <div style="margin-top: 20px">
            <Page style="text-align: center" :total="1000" />
        </div>
    </div>
</template>

<script>
    export default {
        name: "Index",
        methods:{
            test(){
                console.log(this.form.optionalValue)
            },
            addOptinal(){
                this.form.optionalValue.push("");
            }
        },
        data(){
            return {
                form:{optionalValue:[]},
                create:false,
                modeType:'',
                readOnly:'',
                modeRadios:[{value:'yes',label:'是'},{value:'no',label:'否'},],
                modeTypes:[{value:'input',label:'输入框'},{value:'text',label:'文本框'},{value:'radio',label:'单选框'},{value:'checkbox',label:'多选框'},{value:'date',label:'日期框'}],
                headerColumn: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '模板名称',
                        key: 'name'
                    },
                    {
                        title: '所属部门',
                        key: 'age'
                    },
                    {
                        title: '所属菜单',
                        key: 'address'
                    },
                    {
                        title: '操作',
                        width:'120px',
                        render:(h,params)=>{
                            return h('div',[h('Button',{props:{type:'success',size:'small'},style:{
                                'margin-right':'1px'
                                }},'查看'),h('Button',{props:{type:'error',size:'small'}},'删除')])
                        }
                    }
                ],
                data1: [
                    {
                        name: 'John Brown',
                        age: 18,
                        address: 'New York No. 1 Lake Park',
                        date: '2016-10-03'
                    },
                    {
                        name: 'Jim Green',
                        age: 24,
                        address: 'London No. 1 Lake Park',
                        date: '2016-10-01'
                    },
                    {
                        name: 'Joe Black',
                        age: 30,
                        address: 'Sydney No. 1 Lake Park',
                        date: '2016-10-02'
                    },
                    {
                        name: 'Jon Snow',
                        age: 26,
                        address: 'Ottawa No. 2 Lake Park',
                        date: '2016-10-04'
                    }
                ]
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