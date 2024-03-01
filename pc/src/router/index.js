/*
 * @Description: 项目模块
 * @Version: 1.0
 * @Autor: steFan
 * @Date: 2020-03-17 09:39:58
 * @LastEditors: steFan
 * @LastEditTime: 2020-03-28 14:44:20
 */
import Vue from "vue";
import Router from "vue-router";
import i18n from "../i18n/index";

import Home from "../pages/Home/Home";
import playList from "../components/gamesData/playList";
import McenterPage from "../pages/mcenter/mcenterPage.vue";
import myAccount from "../pages/mcenter/myAccount.vue"; //个人资料
import securityCenter from "../pages/mcenter/securityCenter.vue"; //安全中心
import recharge from "../pages/mcenter/recharge.vue";
import Drawing from "../pages/mcenter/drawing.vue";
import returnWater from "../pages/mcenter/returnWater.vue";
import returnWaterDetail from "../pages/mcenter/returnWaterDetail.vue";
import correspondence from "../pages/mcenter/correspondence.vue";
import activity from "../pages/activity/activity"; //优惠活动
import BankList from "../pages/mcenter/bankList.vue";
import AddBank from "../pages/mcenter/addBank.vue";
import AddCurrey from "../pages/mcenter/addCurrey.vue";
import AddWallet from "../pages/mcenter/addWallet.vue";
import Discount from "../pages/mcenter/discount/index.vue";
import vipLevel from "../pages/vipLevel/vipLevel.vue"; //vip
Vue.use(Router);
let projectImgUrl = "";
if (window.projectImgUrl) {
  if (["bgga", "betc88", "sovip","wynn","dola789"].includes(window.projectImgUrl)) {
    projectImgUrl = "bggame";
  } else if (["xiaocao", "g9bet"].includes(window.projectImgUrl)) {
    projectImgUrl = "bet88";
  } else if (["kubet", "phattai68", "choibet"].includes(window.projectImgUrl)) {
    projectImgUrl = "kubet";
  } else if (["xoc88"].includes(window.projectImgUrl)) {
    projectImgUrl = "xoc88";
  } else {
    projectImgUrl = window.projectImgUrl;
  }
}

let skinPage = "skinPage/" + projectImgUrl;
/**
 * 重写路由的push方法
 */
const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch((error) => error);
};
const routers = [
  {
    path: "/",
    name: "Home",
    component: Home,
    redirect: "/home",
    children: [
      {
        path: "/home",
        meta: {
          // requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  (登录拦截) putInGr
          title: window.projectName,
        },
        component: () => import(`@/${skinPage}/homeIndex`),
      },
      // 电子游艺
      {
        path: "/slots/:pid?/:id?/:type?",
        name: "slots",
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  (登录拦截) putInGr
          title: window.projectName,
        },
        component: () => import("@/pages/Home/slots"),
      },
      // 体育赛事
      {
        path: "/sport/:pid?/:id?/:type?",
        name: "sport",
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  (登录拦截) putInGr
          title: window.projectName,
        },
        component: () => import("@/pages/Home/sport"),
      },
      // 彩票游戏
      {
        path: "/lottery/:pid?/:id?/:type?",
        name: "lottery",
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  (登录拦截) putInGr
          title: window.projectName,
        },
        component: () => import("@/pages/Home/lottery"),
      },
      // 视讯直播
      {
        path: "/casino/:pid?/:id?/:type?",
        name: "casino",
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  (登录拦截) putInGr
          title: window.projectName,
        },
        component: () => import("@/pages/Home/casino"),
      },
      // 电竞赛事
      {
        path: "/elec/:pid?/:id?/:type?",
        name: "elec",
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  (登录拦截) putInGr
          title: window.projectName,
        },
        component: () => import("@/pages/Home/electric"),
      },
      // 捕鱼
      {
        path: "/slot/:pid?/:id?/:type?",
        name: "slot",
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  (登录拦截) putInGr
          title: window.projectName,
        },
        component: () => import("@/pages/Home/slot"),
      },
      // 棋牌游戏
      {
        path: "/chess/:pid?/:id?/:type?",
        name: "chess",
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  (登录拦截) putInGr
          title: window.projectName,
        },
        component: () => import("@/pages/Home/chess"),
      },
      {
        path: "/playList",
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  (登录拦截) putInGr
          title: window.projectName,
        },
        component: playList,
      },
      {
        path: "/activity",
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  (登录拦截) putInGr
          title: window.projectName,
        },
        component: activity,
      },
      {
        path: "/vipLevel",
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  (登录拦截) putInGr
          title: i18n.$t("VIP等級特权"),
        },
        component: vipLevel,
      },
      {
        path: "/activation",
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  (登录拦截) putInGr
          title: i18n.$t("领取激活码"),
        },
        component: () => import("@/pages/activation/activation"),
      },
      {
        path: "/agent",
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  (登录拦截) putInGr
          title: window.projectName,
        },
        component: () => import("@/components/agent/agent"),
      },
      {
        path: "/mall",
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  (登录拦截) putInGr
          title: i18n.$t("积分商城"),
        },
        component: () => import("@/pages/mall/mall.vue"),
      },
      {
        path: "/mallrules",
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  (登录拦截) putInGr
          title: window.projectName,
        },
        component: () => import("@/pages/mall/mallrules"),
      },
    ],
  },
  {
    path: "/register",
    name: "register",
    meta: {
      requireAuth: false, // 添加该字段，表示进入这个路由是需要登录的  (登录拦截) putInGr
      title: window.projectName,
    },
    component: () => import("@/pages/register/register"),
  },
  {
    path: "/playList",
    name: "playList",
    component: playList,
    redirect: "/playList",
    children: [],
  },
  /**
   * 新窗口路由，我的账户、返水、存款、取款、信息公告放入此路由下面
   */
  {
    path: "/mcenter",
    component: McenterPage,
    children: [
      {
        path: "/",
        name: "mcenter",
        redirect: "/mcenter/recharge",
      },
      {
        path: "/mcenter/returnWater", //返水记录
        name: "returnWater",
        component: returnWater,
      },
      {
        path: "/mcenter/returnWaterDetail", //返水详情
        name: "returnWaterDetail",
        component: returnWaterDetail,
      },
      {
        path: "/mcenter/correspondence", //来往记录
        name: "correspondence",
        component: correspondence,
      },
      {
        path: "/mcenter/recharge", //存款
        name: "recharge",
        component: recharge,
      },
      {
        path: "/mcenter/drawing", //取款
        name: "drawing",
        component: Drawing,
      },
      {
        path: "/mcenter/myAccount", //我的账户(个人资料)
        name: "myAccount",
        component: myAccount,
      },
      {
        path: "/mcenter/securityCenter", //我的账户（安全中心）
        name: "securityCenter",
        component: securityCenter,
      },
      {
        path: "/mcenter/bank", //银行卡管理
        name: "bank",
        component: BankList,
      },
      {
        path: "/mcenter/addBank", //添加银行卡
        name: "addBank",
        component: AddBank,
      },
      {
        path: "/mcenter/news",
        name: "news",
        component: () => import("@/components/news/news"),
      },
      {
        path: "/mcenter/addCurrey", //添加数字货币
        name: "addCurrey",
        component: AddCurrey,
      },
      {
        path: "/mcenter/addWallet", //添加起点钱包
        name: "addWallet",
        component: AddWallet,
      },
      {
        path: "/mcenter/discount", //自助优惠
        name: "discount",
        component: Discount,
      },
    ],
  },
  {
    path: "/user/pwdforget",
    name: "pwdforget",
    component: () => import("@/pages/user/pwdforget"), //忘记密码
  },
  {
    path: "/bankRecharge",
    name: "bankRecharge",
    component: () => import("@/pages/bankRecharge/bankRecharge"),
  },
  {
    path: "/iplimit",
    name: "iplimit",
    component: () => import("@/pages/iplimit/iplimit"),
  },
];

// 页面刷新时，重新赋值token
// if (window.localStorage.getItem('token')) {
//     // let token = localStorage.getItem("token");
//     // store.commit(types.LOGIN, token)
// };
const router = new Router({
  // mode: 'hash',
  mode: "history",
  routes: routers,
});
//(登录拦截)
// * to: Route: 即将要进入的目标 路由对象
// * from: Route: 当前导航正要离开的路由
// * next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。
// * next(): 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 confirmed （确认的）。
// * next(false): 中断当前的导航。如果浏览器的 URL 改变了（可能是用户手动或者浏览器后退按钮），那么 URL 地址会重置到 from 路由对应的地址。
// * next(‘/’) 或者 next({ path: ‘/’ }): 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。
let isLoading = null;
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  // if (to.matched.length === 0) { //如果未匹配到路由
  // 	next('/'); //如果上级也未匹配到路由则跳转主页面，如果上级能匹配到则转上级路由
  // } else {
  // 	next(); //如果匹配到正确跳转
  // }
  if (to.matched.some((r) => r.meta.requireAuth)) {
    isLoading = true;
    let token = localStorage.getItem("set_user");
    let restraint = sessionStorage.getItem("restraint");
    if (!restraint || restraint === "false") {
      next();
    } else {
      next("/restraint");
    }
  } else {
    next();
  }
});
router.afterEach((to, from) => {
  // 首次进入在顶部
  document.documentElement.scrollTop = 0;
});
// router.beforeEach(() => {
// 	isLoading = false
// })
export default router;
