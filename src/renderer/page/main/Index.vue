<template>
    <div>首页</div>
</template>

<script>
    import {getMenu} from '../../api/main'
    export default {
        name: "Index",
        mounted() {
            getMenu().then(resp=>{
               console.log('获取菜单',resp);
            }).catch(err=>{
                console.log('发生错误',err);
            });
        }
    }
</script>

<style scoped>

</style>