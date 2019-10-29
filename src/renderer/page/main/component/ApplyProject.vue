<template>
  <Modal
    v-model="sign.isShow"
    :mask-closable="false"
    :footer-hide="true"
    @on-visible-change="visibleChange"
  >
    <Divider orientation="left">申请项目</Divider>
    <Form label-position="top"  ref="myApplyForm" :model="applyData" :rules="ruleValidate">
      <FormItem label="原因说明" prop="cause">
        <Input v-model="applyData.cause" />
      </FormItem>

      <FormItem label="项目名" prop="name">
        <Input v-model="applyData.name" />
      </FormItem>
      <FormItem label="申请日期" prop="jurisdictionTime">
      <DatePicker v-model="applyData.jurisdictionTime" type="datetime" placeholder="请选择申请日期" style="width: 200px"></DatePicker>
    </FormItem>
      <FormItem label="负责人角色开始时间" prop="startTime">
        <DatePicker  v-model="applyData.startTime" type="datetime" placeholder="请选择开始时间" style="width: 200px"></DatePicker>
      </FormItem>
      <FormItem label="负责人角色结束时间" prop="endTime">
        <DatePicker v-model="applyData.endTime" type="datetime" placeholder="请选择结束时间" style="width: 200px"></DatePicker>
      </FormItem>
      <Button type="primary" @click="submit">提交申请</Button>
    </Form>
  </Modal>
</template>
<!--申请项目组件-->
<script>
class ApplyBean{
    constructor(){
        this.name = ''
        this.cause = ''
        this.jurisdictionTime = null
        this.startTime = null
        this.endTime = null
    }
}
import projectApi from '../../../api/project'
export default {
  name: "ApplyProject",
  data() {
    return {
      title: ["原因说明"],
      applyData:{

      },
      ruleValidate: {
        cause: [
          {
            required: true,
            message: "输入框不能为空！",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "输入框不能为空！",
            trigger: "blur"
          }
        ],

        // city: [
        //     { required: true, message: 'Please select the city', trigger: 'change' }
        // ],
        // gender: [
        //     { required: true, message: 'Please select gender', trigger: 'change' }
        // ],
        // interest: [
        //     { required: true, type: 'array', min: 1, message: 'Choose at least one hobby', trigger: 'change' },
        //     { type: 'array', max: 2, message: 'Choose two hobbies at best', trigger: 'change' }
        // ],
        jurisdictionTime: [
          {
            required: true,
            type: "date",
            message: "Please select the date",
            trigger: "change"
          }
        ],
        startTime: [
          {
            required: true,
            type: "date",
            message: "Please select the date",
            trigger: "change"
          }
        ],
        endTime: [
          {
            required: true,
            type: "date",
            message: "Please select the date",
            trigger: "change"
          }
        ],
        time: [
          {
            required: true,
            type: "string",
            message: "Please select time",
            trigger: "change"
          }
        ],
        desc: [
          {
            required: true,
            message: "Please enter a personal introduction",
            trigger: "blur"
          },
          {
            type: "string",
            min: 20,
            message: "Introduce no less than 20 words",
            trigger: "blur"
          }
        ]
      },
      sign: {
        isShow: false,
        isCreate: false
      }
    };
  },
  methods: {
    visibleChange() {},
    insert() {
      this.sign.isShow = true
      this.sign.isCreate = true
      this.applyData = new ApplyBean()
      this.$refs.myApplyForm.resetFields()
    },
    async submit(){
        let isOk = await this.$refs.myApplyForm.validate()
        if(!isOk){
            this.$Message.error({content:"请正确填写表单内容"});
            return
        }
        console.log("申请数据",this.applyData)
        // this.applyData = new ApplyBean()
        let  jurisdictionTime = this.applyData.jurisdictionTime.getTime()
        let startTime = this.applyData.startTime.getTime()
        let endTime = this.applyData.endTime.getTime()
        let cause = this.applyData.cause;
        let name = this.applyData.name;
        projectApi.applySaveApi({name,cause,jurisdictionTime,startTime,endTime}).then(resp=>{
          this.sign.isShow = false
          this.$Modal.success({title:"提示",content:"提交成功"})
        }).catch(err=>{
          console.log('失败原因',err)
          this.$Modal.error({title:"提示",content:"提交失败"})
        });
    },
    update(data) {
      this.sign.isShow = true;
      this.sign.isCreate = false;
      this.applyData = data;
    }
  }
};
</script>

<style scoped>
</style>
