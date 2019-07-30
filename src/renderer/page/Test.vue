<template>
    <Layout>

        <Sider style="width: 200px">
            <Menu style="width: 200px" active-name="1-2" :open-names="['1']">
                <Submenu name="1">

                        <MenuItem name="1-1">Option 1</MenuItem>
                        <MenuItem name="1-2">Option 2</MenuItem>
                        <Submenu name="2">
                            <template slot="title">
                                Navigation One
                            </template>
                            <MenuGroup title="Item 2">
                                <MenuItem name="2-1">Option 1</MenuItem>
                                <MenuItem name="2-2">Option 2</MenuItem>

                            </MenuGroup>
                            <MenuGroup title="Item 3">
                                <MenuItem name="2-3">Option 3</MenuItem>
                                <MenuItem name="2-4">Option 4</MenuItem>
                            </MenuGroup>
                        </Submenu>
                         <MenuItem name="1-3">Option 3</MenuItem>
                        <MenuItem name="1-4">Option 4</MenuItem>
                    <template slot="title">
                        <Icon type="ios-analytics" />
                        Navigation One
                    </template>
                </Submenu>
            </Menu>
        </Sider>
        <Content style="color: #2c3e50">
            <div>aasdsaddsa

                <my-menu :menu-data="menu"></my-menu>
            </div>
        </Content>
    </Layout>
</template>

<script>
    import Vue from 'vue'
    function test(h,data,index){

        if (data.list){

            return h("Submenu",{props:{name:index}},[h("template",{slot:"title"},data.name),data.list.map((v,sindex)=>{

                    return test(h,v,index+'-'+(sindex));

            })])
        }
        else {
            return h('MenuItem',{props:{name:index}},data.name);
        }
    }
    Vue.component("my-menu",{
        functional: true,
        props:{
            menuData:null,
        },
        render(createElement, context) {
            console.log('data',context.data);
            console.log('props',context.props);
            return createElement('Menu',context.data,
                context.props.menuData.map(
                (v,index)=>{
                    console.log(v,index);
                    return test(createElement,v,index);
                }
            )
            );

        }
    });
    export default {
        name: "Test",

        data(){
            return {menu:[{name:"人员管理",list:[{name:"找人"},{name:"兼任"}]},{name:"后勤管理"},
                    {name:"设备管理",list:[{name:"检修"},{name:"施工",list:[{name:"临时工"},{name:"合同工"}]}]}]}
        }
    }
</script>

<style scoped>

</style>
