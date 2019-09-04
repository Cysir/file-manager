<template>
    <Layout style="height: 100%">
        <Header>
            <Row type="flex" justify="space-between" class="code-row-bg">
                <Col span="6">
                    <h2 style="color: white;">智能文件助手</h2>
                </Col>

                <Col span="4">
                    <div style="position:relative;">
                        <Icon type="md-exit" color="white" size="26" @click="logout"></Icon>
                        <Icon type="md-refresh" color="white" size="26" @click="refresh"></Icon>
                        <Badge :count=99 style="position: absolute;right: 50px;top:0px;" :offset="[20,0]">
                            <Icon type="ios-notifications-outline" color="white" size="30"></Icon>
                        </Badge>

                        <Avatar style="color: #f56a00;background-color: #fde3cf;position: absolute;right: 0px;top:15px">
                            {{userModel.name}}
                        </Avatar>

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
            </Content>
        </Layout>
    </Layout>
</template>

<script>
    import Vue from 'vue'

    function test(h, data, index) {

        if (data.list && data.list.length != 0) {

            return h("Submenu", {props: {name: index}}, [h("template", {slot: "title"}, data.name), data.list.map((v, sindex) => {

                return test(h, v, index + '-' + (sindex));

            })])
        } else {
            let path = '';
            if (data.url && data.url.indexOf("custom_menu") != -1) {
                path = data.url + data.menuId;
            } else {
                path = data.url;
            }
            // console.log('导航菜单路径：'+path,index)
            return h('MenuItem', {props: {name: path, to: path},}, data.name);
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

            // console.log('context',context);

            return createElement('Menu', context.data,
                context.props.menuData.map(
                    (v, index) => {
                        // console.log(v,index);
                        return test(createElement, v, index);
                    }
                )
            );

        }
    });

    import {getMenu} from '../../api/main'

    export default {
        name: "Index",
        data() {
            return {navMenu: [], userModel: {}}
        },
        computed: {
            activeSub() {
                // console.log('保存的值',localStorage.getItem('index/active'))
                return this.$route.path;
            }
        },
        methods: {
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
        mounted() {
            console.log('首页路由', this.$route.path);
            getMenu().then(resp => {
                // console.log('获取菜单',resp);
                if (resp.code == 0) {
                    this.navMenu = resp.menuList;
                    this.$nextTick(() => {
                        this.$refs.menu.updateOpened();
                        this.$refs.menu.updateActiveName();
                    })
                }
            }).catch(err => {
                console.log('发生错误', err);
            });
            this.$store.dispatch("mine/getInfo").then(resp => {
                // console.log('用户数据得到》》》')
                let userInfo = this.$store.getters["mine/info"];
                this.userModel = userInfo;
                console.log('用户数据>>>>', userInfo)
            }).catch(error => {
                this.$Modal.error({content: '获取用户信息出错'})
            })
        }
    }
</script>

<style scoped>
    .demo-badge {
        width: 36px;
        height: 36px;
        background: #eee;
        border-radius: 6px;
        display: inline-block;
    }
</style>
