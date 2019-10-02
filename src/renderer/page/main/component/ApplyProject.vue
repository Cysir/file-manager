<template>

    <Modal>

    </Modal>

</template>
<!--申请项目组件-->
<script>
    export default {
        name: "ApplyProject",
        data(){
            return {
                sign:{
                    isShow:false,
                    isCreate:false
                }
            }
        },
        methods:{
            insert(){
                this.sign.isShow = true;
                this.sign.isCreate = true;
            },
            update(data){
                this.sign.isShow = true;
                this.sign.isCreate = false;
            }

        }
    }
</script>

<style scoped>

</style>
