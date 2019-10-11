<template>
    <Layout style="height: 100%">
        <ApplyProject ref="myApply"> </ApplyProject>
        <Header style="background: rgba(1,157,141,0.87)">
            <Row type="flex" justify="space-between" class="code-row-bg">
                <Col span="16">
                    <h2 style="color: white;">重点工作任务智能助手</h2>


                </Col>

                <Col span="8">
                    <div style="float: right">
                        <Tooltip placement="top"  offset="10" content="申请项目">
<!--                            <Icon type="md-add-circle" />-->
                            <Icon type="md-add-circle" @click="toApply" color="white" size="26" style="margin-left: 20px"></Icon>
                        </Tooltip>
                        <Tooltip placement="top" offset="10" content="刷新">
                            <Icon type="md-refresh" color="white" size="26" @click="refresh"  style="margin-left: 20px"></Icon>
                        </Tooltip>

                        <Tooltip placement="top" offset="10" content="提醒">
                            <Badge :count="number" style="margin-left: 20px" :offset="[20,0]">
                                <Icon type="ios-notifications-outline" color="white" size="30"></Icon>
                            </Badge>
                        </Tooltip>

                        <!--<Avatar style="color: #f56a00;background-color: #fde3cf;position: absolute;right: 0px;top:15px">-->
                            <!--{{userModel.name}}-->
                        <!--</Avatar>-->
                        <Dropdown  trigger="click" style="margin-left: 20px"  @on-click="userClick">
                            <a href="javascript:void(0)">
                                <Avatar style="color: #f56a00;background-color: #fde3cf">
                                    {{userModel.name.charAt(userModel.name.length-1)}}
                                </Avatar>
                                <!--<Icon type="ios-arrow-down"></Icon>-->
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem>姓名：{{userModel.name}}</DropdownItem>
                                <DropdownItem>账号：{{userModel.username}}</DropdownItem>
                                <DropdownItem disabled>部门：{{userModel.deptName}}</DropdownItem>
                                <DropdownItem>邮箱：{{userModel.email}}</DropdownItem>
                                <DropdownItem name="logout" divided>退出登录</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>

                        <!--                        <Button type="success" style="float: right;display: inline-block" @click="refresh">刷新</Button>-->
                    </div>

                </Col>
            </Row>
            <!--            <h2 style="color: white;display: inline-block">智能文件助手</h2>-->

        </Header>
        <Layout>
            <Sider style="width: 200px;background: #fff">

                <my-menu ref="menu" style="width: 200px" @on-select="x" :open-names="[0,1]" :menu-data="navMenu"
                         :active-name="activeSub">

                </my-menu>
            </Sider>
            <Content>

                <router-view/>
              <!--  <div>
                    <input type="text" v-model="text">
                    <button @click="send()">发送消息</button>
                    <br>
                    <button @click="closeWebSocket()">关闭websocket连接</button>
                    <br>
                    <div>{{data}}</div>
                </div>-->
            </Content>
        </Layout>
    </Layout>
</template>

<script>
    import Vue from 'vue'
    import ApplyProject from './component/ApplyProject'
    // var aplha = 1;
    const { ipcRenderer } = require('electron')
    function test(h, data, index,aplha) {

        if (data.list && data.list.length != 0) {

            return h("Submenu", {props: {name: index},style:{
                background:'#515a6e',
                    // background: "rgba(1,157,141,0.87)"
                }}, [h("template", {slot: "title"}, data.name), data.list.map((v, sindex) => {
                let a = aplha - 0.2;
                return test(h, v, index + '-' + (sindex),a);

            })])
        } else {
            let path = '';
            if (data.url && data.url.indexOf("custom_menu") != -1) {
                path = data.url + data.menuId;
            } else {
                path = data.url;
            }
            // console.log('导航菜单路径：'+path,index)
            return h('MenuItem', {props: {name: path, to: path},style:{
                backgroundColor:'rgba(1,157,141,'+aplha+')'
                }}, data.name);
        }
    }

    Vue.component("my-menu", {
        functional: true,
        props: {
            menuData: null,
            // activeMenu:0
        },
        methods: {
            test(v) {
                console.log('菜单改变,', v);
            }
        },
        watch: {
            activeMenu(val) {
                console.log('组件内部改变值', val);
            }
        },
        render(createElement, context) {

            console.log('context',context);
            context.data.props = {theme:'dark'};
            // context.data.style={
            //
            // }
            return createElement('Menu', context.data,[context.props.menuData.map(
                    (v, index) => {
                        // console.log(v,index);
                        return test(createElement, v, index,1);
                    }
                )]

            );

        }
    });

    import {getMenu} from '../../api/main'

    export default {
        name: "Index",
              components: {ApplyProject},
        data() {
            return {
                number:0,
                navMenu: [],
                userModel: {},
                text: '',
                data: '',
                websocket: null,
                userId:'1',
                informationdata:'',
                creationPerson:'',
                informationgradeState:'',
                informationstatus:'',
                stardaydata:'',
                enddaydata:'',
                newList:[],
                newListtem:[],
                informationTime:'',
                taskTypedata:' temporary'
            }
        },
        computed: {
            activeSub() {
                // console.log('保存的值',localStorage.getItem('index/active'))
                return this.$route.path;
            }
        },
            watch:{
                    'informationdata':function (newval) {
                        if (newval=="WebSocket连接成功   状态码：1"){
                            console.log(this.informationdata)
                            console.log("测试111")
                        }else if (newval=="连接已建立成功"){
                            console.log(this.informationdata)
                            console.log("测试222")
                        }else {

                            console.log("标记"+this.informationdata)
                           /* let data=this.informationdata

                           let  data1=data.replace('{','')
                           let  data2=data1.replace('{','')
                            console.log(data2)
                            let data3=data2.replace('}','')
                            let data4=data3.replace('}','')
                            console.log(data4)
                            let data5=data4.replace('[','{')
                            let data6=data5.replace(']','}')
                            let data7=JSON.parse(data6)
                            console.log(data7)
                            console.log(data7.label)
                            console.log(data7.message)

                            if (data7.label==1){
                                this.informationTime=data7.message
                                console.log(this.informationTime)
                                this.renderFuncTime()
                            }*/

                            let datat=this.informationdata
                            let lable=datat.substr(0,1)
                            console.log(lable)
                            console.log(datat)
                            datat=datat.substr(1)
                            console.log(datat+"测试")
                            if (lable==1){
                                let  data1=datat.replace('{','')
                                let  data2=data1.replace('{','')
                                console.log(data2+"测试一")
                                let data3=data2.replace('}','')
                                let data4=data3.replace('}','')
                                console.log(data4+"测试二")
                                let data5=data4.replace('[','{')
                                let data6=data5.replace(']','}')
                                let data7=JSON.parse(data6)
                                console.log(data7)
                                console.log(data7.label)
                                console.log(data7.message)

                                if (data7.label==1){
                                    this.informationTime=data7.message
                                    console.log(this.informationTime)
                                    this.renderFuncTime()
                                }
                            } else {

                                let data=[]
                                data=datat
                                let str=data.replace(/=/g,":")
                                let strnew=str.split('(:)')

                                console.log(strnew)
                                for (let i=0;i<strnew.length;i++){
                                    console.log(strnew[i])
                                    /* let str1=strnew[i].split('{')
                                     let  str2=strnew[i].split('}')
                                     console.log(str2)*/
                                    let templatedata=JSON.parse(strnew[1])
                                    console.log(templatedata)
                                    for (let i=0;i<templatedata.length;i++) {
                                        console.log(templatedata[i])
                                    }
                                    let data=JSON.parse(strnew[0])
                                    console.log(strnew[0])
                                    this.creationPerson=data.creationPerson
                                    this.informationgradeState=data.gradeState
                                    this.informationstatus=data.status
                                    this.stardaydata=data.startDays
                                    this.enddaydata=data.endDays


                                    console.log(data)
                                    console.log(this.creationPerson)
                                    console.log(this.stardaydata)
                                    console.log(this.enddaydata)
                                    console.log(this.informationgradeState)
                                    console.log(this.informationstatus)
                                    console.log(this.daydata)
                                    this.newList.push(data)
                                    console.log(data)
                                    this.deteleObject(this.newList)
                                    console.log(this.newList)
                                    console.log(this.newList.length)
                                    /*localStorage.setItem()*/
                                    console.log(data.taskType)
                                    console.log(this.taskTypedata)
                                    if (data.taskType=='temporary' ){
                                        
                                        if(data.startDays>0){
                                            this.temporaryRenderFunc1()
                                        }else if (data.endDays<3) {
                                            this.temporaryRenderFunc2()
                                        }
                                    }else {
                                        this.renderFunc()
                                    }


                                }
                                /*  if (this.oldList.length>0){
                                      console.log(this.oldList)
                                      for (let i=0;i<this.oldList.length;i++){
                                          this.newList.push(this.oldList[i])
                                      }
                                  }*/

                                localStorage.setItem('newList',JSON.stringify(this.newList))
                                this.newListtem=JSON.parse(localStorage.getItem('newList'))
                                this.number=this.newListtem.length
                                /*  console.log("测试333")
                                let newList1=JSON.parse(localStorage.getItem('newList'))
                                console.log(newList1)
                                console.log(newList1.length)
                                this.number=newList1.length
                                console.log(this.number)*/
                               /* if (this.taskType=='temporary' ){

                                }else {
                                   alert("222")
                                }*/

                                console.log("测试444")
                            }

                        }

                    }
            },
        async mounted() {
            this.$ipcR.on('MsgExitLogin',this.logout)
            console.log('首页路由', this.$route.path);
            try{
                let resp =await getMenu();
                if (resp.code == 0) {
                    this.navMenu = resp.menuList;
                    this.$nextTick(() => {
                        // console.log(this.$refs['menu']);
                        // console.log('aaaaaaa>>>>>>',this.$refs.menu);
                        // this.$refs.menu.updateOpened();
                        // this.$refs.menu.updateActiveName();
                    })
                }
            }
            catch (e) {
                if (e.message.includes("timeout")){
                    this.$router.replace("/login");
                }
                console.log('读取菜单时发生错误',e.message)
                return ;
            }
            let resp =await this.$store.dispatch("role/getRole");
            console.log('权限数据信息',resp);
            this.$store.dispatch("mine/getInfo").then(resp => {
                // console.log('用户数据得到》》》')
                let userInfo = this.$store.getters["mine/info"];
                this.userModel = userInfo;
                console.log('用户数据>>>>', userInfo)
                this.$ipcR.send("MsgUserInfo",userInfo.name);
                console.log('getters获得数据',this.$store.getters.token)
                if ('WebSocket' in window) {
                    console.log("bbbbbbbbbbbbbbbbb")
                    this.websocket = new WebSocket('ws://'+localStorage.getItem("serverIp")+'/myWebSocket/websocket/'+userInfo.userId);
                    this.initWebSocket();
                    console.log("aaaaaaaaaaaaaaaaa")
                } else {
                    alert('当前浏览器 Not support websocket')
                }
            }).catch(error => {
                this.$Modal.error({content: '获取用户信息出错'})
            })
        },
        beforeDestroy() {
            this.onbeforeunload()
            this.$ipcR.removeListener('MsgExitLogin',this.logout);
        },
        methods: {
            toApply(){
                console.log("aaaaaaaaaaa>点击申请项目");
                this.$refs.myApply.insert();
            },
            userClick(event){
                // alert(event);
                if (event == 'logout'){
                    this.logout()
                }
            },
            /*消息提醒弹出框内容*/
            renderFuncTime () {
                let _this = this
                this.$Notice.success({
                    title: "新消息：管理员角色到期提醒",
                    desc: 'The desc will hide when you set render.',
                    render: function (h, params) {
                        let test='内容：'+_this.informationTime
                        return h('div', [
                            h('span', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '8px'
                                },

                            }, test)
                        ]);
                    },
                    duration:0,

                });
          // let msg = JSON.parse(event.data)
                this.$ipcR.send("indexMessage",this.informationTime)

            },
            renderFunc () {
                let _this = this
                this.$ipcR.send("indexMessage",`新消息：发送人[${_this.creationPerson}]:情况：${_this.informationstatus} 等级：${_this.informationgradeState}`)
                this.$Notice.success({
                    title: "新消息：发送人:"+this.creationPerson+"",
                    desc: 'The desc will hide when you set render.',
                    render: function (h, params) {
                        let test='情况：'+_this.informationstatus+'   等级：'+_this.informationgradeState
                        return h('div', [
                            h('span', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '8px'
                                },

                            }, test)
                        ]);
                    },
                    duration:0,
                    onClose:e=>{
                        this.number=this.number-1
                    }
                });
            },
            temporaryRenderFunc1 () {
                let _this = this
                this.$Notice.success({
                    title: "任务:创建人:"+this.creationPerson+""+" 距任务开始:"+this.stardaydata+"天",
                    desc: 'The desc will hide when you set render.',
                    render: function (h, params) {
                        let test='情况：'+_this.informationstatus+'   等级：'+_this.informationgradeState
                        return h('div', [
                            h('span', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '8px'
                                },

                            }, test)
                        ]);
                    },
                    duration:0,
                    onClose:e=>{
                        this.number=this.number-1
                    }
                });
            },
            temporaryRenderFunc2 () {
                let _this = this
                this.$Notice.success({
                    title: "任务:创建人:"+this.creationPerson+""+" 距任务结束:"+this.enddaydata+"天",
                    desc: 'The desc will hide when you set render.',
                    render: function (h, params) {
                        let test='情况：'+_this.informationstatus+'   等级：'+_this.informationgradeState
                        return h('div', [
                            h('span', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '8px'
                                },

                            }, test)
                        ]);
                    },
                    duration:0,
                    onClose:e=>{
                        this.number=this.number-1
                    }
                });
            },
            /*消息提醒的数组里面数据重复解决方法*/
            deteleObject(obj) {
                var uniques = [];
                var stringify = {};
                for (var i = 0; i < obj.length; i++) {
                    var keys = Object.keys(obj[i]);
                    keys.sort(function(a, b) {
                        return (Number(a) - Number(b));
                    });
                    var str = '';
                    for (var j = 0; j < keys.length; j++) {
                        str += JSON.stringify(keys[j]);
                        str += JSON.stringify(obj[i][keys[j]]);
                    }
                    if (!stringify.hasOwnProperty(str)) {
                        uniques.push(obj[i]);
                        stringify[str] = true;
                    }
                }
                this.newList = uniques;
                return this.newList;
            },
            /*消息提醒的websocket链接*/
            initWebSocket() {
                //连接错误
                this.websocket.onerror = this.setErrorMessage

                // //连接成功
                this.websocket.onopen = this.setOnopenMessage

                //收到消息的回调
                this.websocket.onmessage = this.setOnmessageMessage

                //连接关闭的回调
                this.websocket.onclose = this.setOncloseMessage

                //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
                window.onbeforeunload = this.onbeforeunload
            },
            setErrorMessage() {
                this.data = "WebSocket连接发生错误" + '   状态码：' + this.websocket.readyState;
            },
            setOnopenMessage() {
                this.data = "WebSocket连接成功" + '   状态码：' + this.websocket.readyState;
            },
            setOnmessageMessage(event) {
                this.informationdata= event.data;
                console.log("收到一条socket消息",event)
                //消息提醒
               /* let msg = JSON.parse(event.data)
                if(Array.isArray(msg)){
                    this.$ipcR.send("indexMessage",msg[0].message)

                }
                    ipcRenderer.send("indexMessage",msg[0].message)
                }*/

            },
            setOncloseMessage() {
                this.data = "WebSocket连接关闭" + '   状态码：' + this.websocket.readyState;
            },
            onbeforeunload() {
                this.closeWebSocket();
            },

            //websocket发送消息
           /* send() {
                this.websocket.send(this.text)
                this.text = ''
            },
            closeWebSocket() {
                this.websocket.close()
            },*/
            //退出登录
            logout(){
                let self = this;
                this.$Modal.confirm({content:'确定退出登录吗?',onOk(){
                        self.$store.dispatch('user/logout').then(resp=>{
                            console.log('退出登录成功',resp);
                            self.$router.replace('/login');
                            self.$Message.success({content:'退出登录成功'});
                        }).catch(err=>{
                            console.log('退出登录失败',err);
                        });
                    }});
            },
            refresh() {
                location.reload();
            },
            x(x) {

            },
            test() {
                alert("asdssad")
            },
        },
    }
</script>

<style scoped>
    /deep/.ivu-btn-info{
        background-color: rgba(1,157,141,0.87);
        border-color:rgba(1,157,141,0.87);
    }
    /deep/.ivu-btn-success{
        background-color: rgba(1,157,141,0.87);
        border-color:rgba(1,157,141,0.87);
    }
    /deep/.ivu-btn-primary{
        background-color: rgba(1,157,141,0.87);
        border-color:rgba(1,157,141,0.87);
    }
    /deep/.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu){
        color: rgba(1,157,141,0.87);
    }
    /deep/.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu):after{
        background: rgba(1,157,141,0.87);
    }
    /*打开子菜单时的色彩*/
    /deep/ .ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened .ivu-menu-submenu-title{
        background: rgba(1,157,141,1);
    }
    /*/deep/ .ivu-menu-dark,.ivu-menu-submenu,.ivu-menu{*/
    /*    background: rgba(1,157,141,0.87);*/
    /*}*/
    /*选中时的色彩*/
    /deep/ .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active:hover{
        background: rgba(1,157,141,0.5)!important;
    }
    /deep/ .ivu-menu-item:hover{
        background: red;
    }
    .demo-badge {
        width: 36px;
        height: 36px;
        background: #eee;
        border-radius: 6px;
        display: inline-block;
    }
</style>
