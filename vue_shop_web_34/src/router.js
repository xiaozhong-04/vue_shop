import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: "/home"
    },
    {
      path: "/login",
      name: "login",
      component: () => import("./views/Login.vue")
    },
    {
      path: "/home",
      component: Home,
      redirect: "/welcome",
      children: [
        // 首页
        {
          path: "/welcome",
          component: () => import("@/components/Welcome.vue")
        },
        // 用户列表
        {
          path: "/users",
          component: () => import("@/components/User/UserList.vue")
        },
        //权限列表
        {
          path: "/rights",
          component: () => import("@/components/Rights/RightsList.vue")
        },
        //角色列表
        {
          path: "/roles",
          component: () => import("@/components/Rights/RolesList.vue")
        },
        //商品分类
        {
          path: "/categories",
          component: () => import("@/components/Goods/Category.vue")
        },
        //分类参数
        {
          path: "/params",
          component: () => import("@/components/Params/Params.vue")
        },
        //订单列表
        {
          path: "/orders",
          component: () => import("@/components/order/order.vue")
        },
        //商品列表
        {
          path: "/goods",
          redirect: "/goods/list"
        },
        {
          path: "/goods/list",
          component: () => import("@/components/Goods/GoodsList.vue")
        },
        //商品列表添加
        {
          path: "/goods/add",
          component: () => import("@/components/Goods/GoodsAdd.vue")
        },
        //数据报表
        {
          path: "/reports",
          component: () => import("@/components/Reports/Reports.vue")
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.path == "/login") return next();
  const tokenStr = sessionStorage.getItem("token");
  if (!tokenStr) return next("/login");
  next();
});

export default router;
