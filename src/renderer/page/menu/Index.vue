<template>
    <div>菜单管理
        <Tree :data="menuList" style="width: 300px" :render="renderContent" show-checkbox multiple>

        </Tree>
    </div>

</template>

<script>
    import menuApi from '../../api/menu'
    export default {
        name: "Index",
        data(){
            return {menuList:[],buttonProps: {
                    type: 'default',
                    size: 'small',
                }
            }
        },
        mounted() {
            menuApi.menuListApi().then(resp=>{

                let a  = this.toTreeList(resp.data);
                // console.log('aaaa>',a)
                this.menuList = a;
            }).catch(error=>{
                this.$Modal.error({content:'请求发生错误:'+error.toString()});
            })
        },
        methods:{
            toTreeList(data){
                console.log('数据',data);
                let treeList = {};
                for (let v of data){
                    if (treeList.hasOwnProperty(v.parentId)){
                        treeList[v.parentId].push({menuId:v.menuId,parentId:v.parentId,title:v.name,id:v.menuId});
                    }else{
                        treeList[v.parentId] = [{menuId:v.menuId,parentId:v.parentId,title:v.name,id:v.menuId}];
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
            append (data) {
                const children = data.children || [];
                children.push({
                    title: 'appended node',
                    expand: true
                });
                this.$set(data, 'children', children);
            },
            remove (root, node, data) {
                console.log('数据》',data);
                const parentKey = root.find(el => el === node).parent;
                const parent = root.find(el => el.nodeKey === parentKey).node;
                const index = parent.children.indexOf(data);
                parent.children.splice(index, 1);
            }
        }
    }
</script>

<style scoped>

</style>
