<template>

    <Modal v-model="isCreate" :closable="false" :footer-hide="true">
        <Form :model="userContent" :rules="ruleInline" ref="formInline" :label-width="80" style="width: 400px">
            <FormItem label="账号" prop="username" :rules="ruleInline.user">
                <Input type="text" v-model="userContent.username"></Input>
            </FormItem>
            <FormItem label="姓名" prop="name">
                <Input type="text" v-model="userContent.name"></Input>
            </FormItem>
<!--            <FormItem label="部门id" prop="deptId">-->
<!--                <Select v-model="userContent.deptId" @on-open-change="loadDept">-->
<!--                    <Option v-for="item in defaultParam.depts" :label="item.name" :value="item.deptId">-->
<!--                    </Option>-->
<!--                </Select>-->

<!--            </FormItem>-->
            <FormItem label="部门名称" prop="deptId">
                <Select v-model="userContent.deptId" @on-open-change="loadDept">
                    <Option v-for="item in defaultParam.depts" :label="item.name" :value="item.deptId">
                        {{item.name}}
                    </Option>
                </Select>
            </FormItem>

            <FormItem label="角色" prop="roleIdList" >
                <Select v-model="userContent.roleIdList" @on-open-change="loadRole" multiple>
                    <Option v-for="item in defaultParam.roles" :label="item.roleName" :value="item.roleId"></Option>
                </Select>
            </FormItem>
            <FormItem label="状态" prop="status">
                <Select v-model="userContent.status">
                    <Option v-for="item in defaultParam.status" :label="item.label" :value="item.value"></Option>
                </Select>
            </FormItem>

            <FormItem label="密码" prop="password">
                <Input type="text" v-model="userContent.password"></Input>
            </FormItem>
            <FormItem label="邮箱" prop="email">
                <Input type="text" v-model="userContent.email"></Input>
            </FormItem>
            <FormItem label="手机号" prop="mobile">
                <Input type="text" v-model="userContent.mobile"></Input>
            </FormItem>
        </Form>
        <div style="height: 35px">
            <Button type="info" @click="ok" style="float: right">添加角色</Button>
        </div>
    </Modal>

</template>

<script>


    import {userModel} from './model'
    import deptApi from '../../api/dept'
    import roleApi from '../../api/role'
    import userApi from '../../api/user'
    export default {
        name: "CreateUserForm",
        data() {
            return {
                isCreate: false,
                isUpdate:false,
                userContent: new userModel(),
                defaultParam: {
                    depts:[],
                    roles:[],
                    status: [
                        {
                            label: '正常',
                            value: 1
                        }, {
                            label: '禁止',
                            value: 0
                        }]
                },
                ruleInline: {
                    user: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ],
                    deptId: [
                        {required: true,type:'number', message: '请选择部门名', trigger: 'change'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '请输入email', trigger: 'blur'}
                    ],
                    mobile: [
                        {required: true, message: '请输入电话', trigger: 'blur'}
                    ],
                    roleIdList: [
                        {required: true,type:'array', message: '请选择角色', trigger: 'change'}
                    ],
                    status: [
                        {required: true,type:'number', message: '请选择用户状态', trigger: 'change'}
                    ]
                }

            }
        },
        methods:{
            insert(){
                this.isUpdate = false;
                this.ruleInline.password[0].required = true;
                this.isCreate = true;
                this.userContent = new userModel();
                // this.$refs.formInline.resetFields();
                console.log('formInline',this.$refs.formInline)
            },
            async update(user){
                this.isUpdate = true;
                this.ruleInline.password[0].required = false;
                this.userContent = user || new userModel();
                this.isCreate = true;
                this.loadDept(true)
                this.loadRole(true)
            },
            async ok(){
                console.log('提交的数据',this.userContent);
                let isOk = await this.$refs.formInline.validate();
                console.log('校验结果：',isOk);
                if (!isOk){
                    this.$Message.info({content:'请检查表单是否填写完整'});
                    return;
                }
                let content = this.userContent;
                if(this.isUpdate){
                    content.roleIdList = [...content.roleIdList];
                    userApi.userUpdateApi(content).then(resp=>{
                        console.log('修改成功');
                        this.isCreate = false;
                    }).catch(err=>{
                        console.log('修改失败');
                    })
                }else{
                    content.roleIdList = [...content.roleIdList];
                    userApi.userSaveApi(content).then(resp=>{
                        console.log('保存成功');
                        this.isCreate = false;
                    }).catch(err=>{
                        console.log('保存失败');
                    })
                }

            },

            loadRole(open){
                if (open && this.defaultParam.roles.length<=0){
                    roleApi.queryRoleApi().then(resp=>{
                        console.log('角色列表',resp)
                        this.defaultParam.roles = resp.page.list;
                    }).catch(err=>{
                        console.log('加载角色失败',err);
                    })
                }
            },
            loadDept(open){
                if (open && this.defaultParam.depts.length<=0){
                    deptApi.deptListApi().then(resp=>{
                        console.log('部门列表',resp)
                        this.defaultParam.depts = resp.data;
                    }).catch(err=>{
                        console.log('加载列表发生错误',err)
                    })
                }

            }
        }
    }
</script>

<style scoped>

</style>
