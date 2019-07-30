<template>
    <Layout style="height: 100%">
        <Header>
            <h2 style="color: white">智能文件助手</h2>
        </Header>
        <Layout>
            <Sider style="width: 200px;background: #fff">
<!--                <Menu ref="menu" active-name="1-1" :open-names="['1']" style="width: 200px">-->
<!--                    <Submenu name="1" v-for="(item,index) in navMenu">-->
<!--                        <template slot="title">-->
<!--                            <Icon type="ios-analytics" />-->
<!--                            {{item.name}}-->
<!--                        </template>-->
<!--                            <MenuItem name="1-1" v-for="(subItem,index) in item.list"> {{subItem.name}}</MenuItem>-->
<!--                    </Submenu>-->
<!--                </Menu>-->
                <my-menu ref="menu" style="width: 200px" :open-names="['0']" :menu-data="navMenu">

                </my-menu>
            </Sider>
            <Content>
                <router-view/>
            </Content>
        </Layout>
    </Layout>
</template>

<script>
    import Vue from 'vue'
    function test(h,data,index){

        if (data.list && data.list.length!=0){

            return h("Submenu",{props:{name:index}},[h("template",{slot:"title"},data.name),data.list.map((v,sindex)=>{

                return test(h,v,index+'-'+(sindex));

            })])
        }
        else {
            return h('MenuItem',{props:{name:index,to:data.url}},data.name);
        }
    }
    Vue.component("my-menu",{
        functional: true,
        props:{
            menuData:null,
        },
        render(createElement, context) {
            context.data.props = {'open-names':[0,1]}
            // console.log('context',context.data);

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

    import {getMenu} from '../../api/main'
    export default {
        name: "Index",
        data(){
            return {navMenu:[]}
        },
        mounted() {
            getMenu().then(resp=>{
               console.log('获取菜单',resp);
               if (resp.code==0){
                   this.navMenu = resp.menuList;
                   this.$nextTick(()=>{
                       this.$refs.menu.updateOpened();
                   })
               }
            }).catch(err=>{
                console.log('发生错误',err);
            });
        }
    }
</script>

<style scoped>

</style>
