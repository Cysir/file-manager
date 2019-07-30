<template>

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
        name: "ExpendMenu"
    }
</script>

<style scoped>

</style>
