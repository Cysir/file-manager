<template>
    <div>
        <div style="margin-top: 2px;margin-left: 5px">
            <Button type="success"  @click="addData">
                添加项目类型
            </Button>
            <Modal
                    v-model="modal1"
                    title="添加项目类型数据"
                    @on-ok="ok"
                    @on-cancel="cancel">
                <Form :model="formItem" :label-width="80" >
                    <FormItem label="分类名称">
                        <Input v-model="formItem.input1" placeholder="数据内容...."></Input>
                    </FormItem>
                    <FormItem label="排序">
                        <Input v-model="formItem.input2" placeholder="输入数字...."></Input>
                    </FormItem>
                </Form>
            </Modal>
        </div>

        <Table style="margin-left: 5px;margin-top: 10px" border :columns="columns" :data="data"></Table>
    </div>

</template>

<script>
    import  classification from '../../api/classification'
    export default {
        name: "Index",
        data () {
            return {
                modal1: false,
                formItem:{
                    input1:'',
                    input2:''
                },
                columns: [
                    {
                        title: '序号',
                        key: 'sorting',
                        render: (h, params) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        type: 'person'
                                    }
                                }),
                                h('strong', params.row.sorting)
                            ]);
                        }
                    },
                    {
                        title: '类型',
                        key: 'typeClassificationName'
                    },

                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.row.typeClassificationId)
                                            console.log(params.row.typeClassificationId)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                data: []
            }
        },
        mounted(){
            this.init()
        },
        methods: {
            init(){
                classification.classificationDataApi().then(resp=>{
                    console.log("数据",resp.data)
                    console.log(resp.data.list)
                    this.data=resp.data.list
                }).catch(error=>{
                    console.log("错误！")
                })
            },
            addData(){
                    this.modal1=true
            },
          /*  show (index) {
                this.$Modal.info({
                    title: 'User Info',
                    content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`
                })
            },*/
            remove (index) {
                let  id=index
                classification.removeDataApi({id}).then(resp=>{
                    console.log(resp.msg)
                    this.init()
                }).catch(error=>{
                    console.log("错误！")
                })
            },
            ok () {

                console.log(this.formItem.input1)
                let typeClassificationName=this.formItem.input1

                console.log(this.formItem.input2)
                let sorting=this.formItem.input2
                classification.saveaddDataApi({typeClassificationName,sorting}).then(resp=>{
                    console.log("数据",resp.data)
                    this.init()
                }).catch(error=>{
                    console.log("错误!")
                })
            },
            cancel () {
                this.$Message.info('Clicked cancel');
            }
        }
    }
</script>

<style scoped>

</style>