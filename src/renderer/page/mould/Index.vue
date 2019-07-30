<template>
    <div style="height: 100%;padding: 10px">
        <Modal width="600" height="800" :mask-closable=false v-model="create" :footer-hide=true class-name="vertical-center-modal">
            <div style="font-size: 15px;padding-right: 5px">
                显示名:<Input placeholder="如:姓名" style="width:90px"/>
                字段名:<Input placeholder="如：name" style="width:90px"/>
                类型: <Select v-model="modeType" style="width:100px">
                            <Option v-for="item in modeTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                只读: <Select v-model="readOnly" style="width:100px">
                        <Option v-for="item in modeRadios" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                只读: <Select v-model="readOnly" style="width:100px">
                <Option v-for="item in modeRadios" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            </div>
            <div style="height: 380px">
                <Divider orientation="center">预览页面</Divider>
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
        data(){
            return {
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
</style>