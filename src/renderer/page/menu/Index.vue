<template>
    <div style="margin: 30px">
         <Modal class="my_modal" v-model="create" :mask-closable=false :footer-hide=true>
            <Row>
                <Col span="4">名称</Col>
                <Col span="20">
                    <Input v-model="form.name" style="width: 300px"></Input>
                </Col>
            </Row>
            <Row>
                <Col span="4">变量名</Col>
                <Col span="20">
                    <Input v-model="form.perms" style="width: 300px"></Input>
                </Col>
            </Row>
            <Row>
                <Col span="4">排序</Col>
                <Col span="20">
                    <Input v-model="form.orderNum" style="width: 300px"></Input>
                </Col>
            </Row>
           <!-- <Row>
                <Col span="4">部门名称</Col>
                <Col span="20">
                    <Input v-model="form.deptId" style="width: 300px"></Input>
                </Col>
            </Row>-->
<!--            <Row>-->
<!--                <Col span="4">地址url</Col>-->
<!--                <Col span="20">-->
<!--                    <Input v-model="form.url" style="width: 300px"></Input>-->
<!--                </Col>-->
<!--            </Row>-->

            <Row>
                <Col span="4">类型</Col>
                <Col span="20">
                    <RadioGroup v-model="form.type">
                        <Radio label="0">
                            <Icon type="ios-aperture" />
                            <span>目录</span>
                        </Radio>
                        <Radio label="1">
                            <Icon type="ios-basket" />
                            <span>菜单</span>
                        </Radio>
                        <Radio label="2">
                            <Icon type="logo-windows"></Icon>
                            <span>按钮</span>
                        </Radio>
                    </RadioGroup>
                </Col>

            </Row>
            <div style="width: 100%">
                <Button type="primary" @click="createMenu" style="width: 90px;margin:0 auto;display: block">添加</Button>
            </div>
        </Modal>
        <Tree :data="menuList" style="width: 300px" :render="renderContent" show-checkbox multiple>

        </Tree>
    </div>

</template>

<script>
    import menuApi from '../../api/menu'
    export default {
        name: "Index",
        data(){
            return {
                create:false,
                form:{
                  /*  deptId:0,*/
                    type:"1",
                    name:'',
                    perms:'',
                    url:'/custom_menu/',
                    parentId:'',
                    icon:'',
                    orderNum:''

                },
                menuList:[],buttonProps: {
                    type: 'default',
                    size: 'small',
                }
            }
        },
        mounted() {
            this.reload();
        },
        methods:{
            toTreeList(data){
                console.log('数据',data);
                let treeList = {};
                for (let v of data){
                    if (treeList.hasOwnProperty(v.parentId)){
                        treeList[v.parentId].push({menuId:v.menuId,parentId:v.parentId,title:v.name,id:v.menuId,type:v.type});
                    }else{
                        treeList[v.parentId] = [{menuId:v.menuId,parentId:v.parentId,title:v.name,id:v.menuId,type:v.type}];
                    }
                }
                console.log('treeList',treeList);
                //二次处理
                let obj = Object.assign({},treeList);
                console.log('obj:',obj);
                let keys = Object.getOwnPropertyNames(treeList);
                keys = keys.reverse()
                console.log('keys;>>>>>>>',keys)
                for (let k of keys){
                    if (k == 0){
                        treeList[0][0].expand = true;
                        treeList[0][0].render=(h, { root, node, data }) => {
                            return h('span', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%'
                                }
                            }, [
                                h('span', [
                                    h('Icon', {
                                        props: {
                                            type: 'ios-folder-outline'
                                        },
                                        style: {
                                            marginRight: '8px'
                                        }
                                    }),
                                    h('span', data.title)
                                ]),
                                h('span', {
                                    style: {
                                        display: 'inline-block',
                                        float: 'right',
                                        marginRight: '32px'
                                    }
                                }, [
                                    h('Button', {
                                        props: Object.assign({}, this.buttonProps, {
                                            icon: 'ios-add',
                                            type: 'primary'
                                        }),
                                        style: {
                                            width: '64px'
                                        },
                                        on: {
                                            click: () => { this.append(data) }
                                        }
                                    })
                                ])
                            ]);}
                    }
                    else{
                        console.log('从下往上>>>',k)
                        // let objKeys = Object.getOwnPropertyNames(obj);
                        for (let key in obj){
                            let objContent = obj[key];
                            // console.log('objcontent',objContent)
                            let find = objContent.findIndex(v=>{
                                return v.menuId == k;
                            })
                            if (find!=-1){
                                console.log(key,find,k);
                                treeList[key][find].children = obj[k];
                                delete treeList[k];
                            }
                        }

                    }
                }
                console.log('结束',treeList)
                return treeList[0];
            },renderContent (h, { root, node, data }) {
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    }
                }, [
                    h('span', [
                        h('Icon', {
                            props: {
                                type: 'ios-paper-outline'
                            },
                            style: {
                                marginRight: '8px'
                            }
                        }),
                        h('span', data.title)
                    ]),
                    h('span', {
                        style: {
                            display: 'inline-block',
                            float: 'right',
                            marginRight: '32px'
                        }
                    }, [
                        h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                icon: 'ios-add'
                            }),
                            style: {
                                marginRight: '8px'
                            },
                            on: {
                                click: () => { this.append(data) }
                            }
                        }),
                        h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                icon: 'ios-remove'
                            }),
                            on: {
                                click: () => { this.remove(root, node, data) }
                            }
                        })
                    ])
                ]);
            },
            createMenu(){
                console.log('aaa>',this.form);
                menuApi.menuSaveApi(this.form).then(resp=>{
                    this.reload();
                }).catch(error=>{

                })
            },
            reload(){
                this.resetForm();
                this.create = false;
                menuApi.menuListApi().then(resp=>{
                    let a  = this.toTreeList(resp.data);
                    // console.log('aaaa>',a)
                    this.menuList = a;
                }).catch(error=>{
                    this.$Modal.error({content:'请求发生错误:'+error.toString()});
                })
            },
            resetForm(){
                this.form={
                    type:'1',
                    name:'',
                    perms:'',
                    url:'/custom_menu/',
                    parentId:'',
                    icon:'',
                    orderNum:''

                }
            },
            append (data) {
                this.resetForm();
                if (data.type==2){
                    this.$Modal.error({title:'提示',content:'按钮不能添加菜单'});
                    return;
                }
                // localStorage.setItem('menu_parent_id',data.)
                this.form.parentId = data.menuId;
                // alert('添加')
                console.log('当前菜单:',data);
                this.create = true;

                // const children = data.children || [];
                // data.expand = true;
                // children.push({
                //     title: 'appended node',
                //     expand: true
                // });
                // this.$set(data, 'children', children);
            },
            remove (root, node, data) {
                let _this = this;
                this.$Modal.confirm({title:'提示',content:'是否删除菜单['+data.title+']?',onOk(){
                    menuApi.menuDeleteApi(data.menuId).then(resp=>{
                        _this.reload();
                    }).catch(error=>{
                       _this.$Modal.error({title:'错误',content:error.toString()});
                    });

                    }})
                // console.log('数据》',data);
                // const parentKey = root.find(el => el === node).parent;
                // const parent = root.find(el => el.nodeKey === parentKey).node;
                // const index = parent.children.indexOf(data);
                // parent.children.splice(index, 1);
            }
        }
    }
</script>

<style scoped>
/deep/.ivu-modal-body > * {
    margin-top: 20px;
    line-height: 32px;
    font-size: 14px;
}
</style>
