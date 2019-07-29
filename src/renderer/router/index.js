import Vue from 'vue'
import Router from 'vue-router'
import Login from '../page/Login'
import store from '../store';
Vue.use(Router)


export const constantRoutes = [
  {
    path:'/',
    redirect:'/index'
  },
  {
    path: '/index',
    component: require('@/page/main/Index').default,
    hidden: true,
    meta:{
      requireAuth:true
    }
  },
  {
    path:'/login',
    component:Login,
    hidden:true
  }

  /*404页面必须放在结尾处*/
  // {path: '*', redirect: '/404', hidden: true}
];

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
});

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher // reset router
}
router.beforeEach((to,from,next)=>{
  if (to.meta.requireAuth){
    if (store.getters.token){
      next();
    }
    else {
      next({path:'/login'});
    }
  }else{
    next();
  }
});
export default router
