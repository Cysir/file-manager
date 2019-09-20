<template>
  <div id="app">

    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'file-manager',
      data(){
        return {showIp:true,serverIp:''}
      },

    methods:{


    }
  }
</script>

<style>
  /* CSS */
  .demo-affix:hover{
    background-color: red;
    color: white;
    cursor:pointer;
  }
  .demo-affix{
    font-size: 18px;
  }
</style>
