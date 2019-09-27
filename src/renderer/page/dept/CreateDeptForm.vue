<template>
    <Modal v-model="sign.isShow" :closable="false" :footer-hide="true">
        <Form ref="myForm" :label-width="80" style="width: 400px" :model="deptContent" :rules="ruleInline">

            <FormItem label="部门名" prop="name">
                <Input type="text" v-model="deptContent.name"></Input>
            </FormItem>
            <FormItem label="排序" prop="orderNum">
                <Input type="number" v-model="deptContent.orderNum"></Input>
            </FormItem>
            <FormItem label="上级部门" prop="parentId">
                <Select v-model="deptContent.parentId">
                    <Option v-for="dept in deptList" :value="dept.deptId" :label="dept.name"/>
<!--                    <Option label="有效" :value=0></Option>-->
<!--                    <Option label="无效" :value=-1></Option>-->
                </Select>
            </FormItem>
            <FormItem label="是否有效" prop="delFlag">
                <Select v-model="deptContent.delFlag">
                    <Option label="有效" :value=0></Option>
                    <Option label="无效" :value=-1></Option>
                </Select>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="submit">提交</Button>
                <Button style="margin-left: 8px" @click="()=>{sign.isShow = false}">取消</Button>
            </FormItem>
        </Form>
    </Modal>
</template>

<script>
    class deptModel {

        constructor() {
            this.parentId = null;
            this.name = '';
            this.orderNum = null;
            this.delFlag = 0;
        }
    }
    import deptApi from '../../api/dept';
    export default {
        name: "CreateDeptForm",
        data() {
            return {
                deptList:[],
                deptContent:new deptModel(),
                sign: {
                    isShow: false,
                    isCreate: true
                },
                ruleInline: {
                    name:[
                        {required:true,trigger:'blur',message:'请输入部门名'}
                    ],
                    parentId: [
                        {required: true,type:'number', trigger: 'change', message: '请选择上级部门'}
                    ],
                    orderNum: [
                        {required: true, trigger: 'blur', message: '请输入排序'}
                    ],

                    delFlag: [
                        {required: true, type: 'number', message: '请选择状态', trigger: 'change'}
                    ]
                }
            }
        },
        methods: {
            init() {
                deptApi.deptListApi().then(resp=>{
                    this.deptList = resp.data;
                }).catch(err=>{

                });
            },
            insert() {
                this.sign.isCreate = true;
                this.sign.isShow = true;
                this.deptContent = new deptModel();
                this.init();
            },
            update(data) {
                this.sign.isCreate = false;
                this.sign.isShow = true;
                this.init();
                this.deptContent = data;
            },
            async submit(){
                console.log('部门表单数据',this.deptContent);
                if(!await this.$refs.myForm.validate()){
                    this.$Modal.error({content:'表单信息填写不完整'});
                    return ;
                }
                //插入数据
                if(this.sign.isCreate){
                    deptApi.deptSaveApi(this.deptContent).then(resp=>{
                       this.sign.isShow = false;
                       this.$emit('update');
                    }).catch(error=>{

                    });
                }
                //更新数据
                else {
                    deptApi.deptUpdateApi(this.deptContent).then(resp=>{
                        this.sign.isShow = false;
                        this.$emit('update');
                    }).catch(error=>{

                    });
                }
            }

        }
    }
</script>

<style scoped>

</style>
