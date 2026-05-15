import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

export const Layout = () => import("@/layout/index.vue");


// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue"),
      },
    ],
  },

  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: { hidden: true },
  },
  {
    path: "/",
    name: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        name: "Dashboard", // 用于 keep-alive, 必须与SFC自动推导或者显示声明的组件name一致
        // https://cn.vuejs.org/guide/built-ins/keep-alive.html#include-exclude
        meta: {
          title: "dashboard",
          icon: "homepage",
          affix: true,
          keepAlive: true,
          alwaysShow: false,
        },
      },
      {
        path: "account",
        component: () => import("@/views/account/index.vue"),
        name: "Account", 
        meta: {
          title: "个人中心",
          hidden: true,
          keepAlive: true,
          alwaysShow: false,
        },
      },
      {
        path: "401",
        component: () => import("@/views/error-page/401.vue"),
        meta: { hidden: true },
      },
      {
        path: "404",
        component: () => import("@/views/error-page/404.vue"),
        meta: { hidden: true },
      },
    ],
  }
];
/**
 * ,
  {
    path: "/gather",
    component: Layout,
    name: "Gather",
    meta: {
      title: "回收日志",
      icon: "document",
      alwaysShow: true,
    },
    children: [
      {
        path: "recycleRecord",
        component: () => import("@/views/gather/recycleRecord/index.vue"),
        name: "RecycleRecord",
        meta: {
          title: "回收记录",
          icon: "todolist",
          keepAlive: true,
          alwaysShow: false,
        },
      },
    ],
  },
  {
    path: "/system",
    component: Layout,
    name: "System",
    meta: {
      title: "系统设置",
      icon: "system",
      alwaysShow: true
    },
    children: [
      {
        path: "announcement",
        component: () => import("@/views/system/announcement/index.vue"),
        name: "Announcement",
        meta: {
          title: "系统公告",
          icon: "message",
          keepAlive: true
        }
      },
      {
        path: "operation-record",
        component: () => import("@/views/operation-record/index.vue"),
        name: "OperationRecord",
        meta: {
          title: "操作记录",
          icon: "document",
          keepAlive: true
        }
      }
    ]
  },
  {
    path: "/prize",
    component: Layout,
    name: "Prize",
    meta: {
      title: "奖品管理",
      icon: "coupon",
      alwaysShow: true
    },
    children: [
      {
        path: "sendRecord",
        component: () => import("@/views/prize/sendRecord/index.vue"),
        name: "SendRecord",
        meta: {
          title: "奖品发放记录",
          icon: "coupon",
          keepAlive: true,
          alwaysShow: false
        }
      }
    ]
  },
  {
    path: "/advertising",
    component: Layout,
    name: "Advertising",
    meta: {
      title: "广告管理",
      icon: "advert",
      alwaysShow: true
    },
    redirect: "/advertising/list",
    children: [
      {
        path: "advertiser",
        component: () => import("@/views/advertiser/index.vue"),
        name: "Advertiser",
        meta: {
          title: "广告商管理",
          icon: "brand",
          keepAlive: true,
          alwaysShow: false
        }
      },
      {
        path: "list",
        component: () => import("@/views/advertising/index.vue"),
        name: "AdvertisingList",
        meta: {
          title: "广告列表",
          icon: "advert",
          keepAlive: true,
          alwaysShow: false
        }
      },
      {
        path: "callback",
        component: () => import("@/views/advertising/callback/index.vue"),
        name: "AdvertisingCallback",
        meta: {
          title: "广告回调记录",
          icon: "document",
          keepAlive: true,
          alwaysShow: false
        }
      }
    ]
  },
  {
    path: "/campaign",
    component: Layout,
    name: "Campaign",
    meta: {
      title: "活动管理",
      icon: "chart",
      alwaysShow: true
    },
    children: [
      {
        path: "category",
        component: () => import("@/views/campaign/category/index.vue"),
        name: "CampaignCategory",
        meta: {
          title: "活动分类",
          icon: "tree",
          keepAlive: true,
          alwaysShow: false
        }
      },
      {
        path: "template",
        component: () => import("@/views/campaign/template/index.vue"),
        name: "CampaignTemplate",
        meta: {
          title: "活动模板",
          icon: "project",
          keepAlive: true,
          alwaysShow: false
        }
      },
      {
        path: "plan",
        component: () => import("@/views/campaign/plan/index.vue"),
        name: "CampaignPlan",
        meta: {
          title: "活动计划",
          icon: "chart",
          keepAlive: true,
          alwaysShow: false
        }
      },
      {
        path: "record",
        component: () => import("@/views/campaign/record/index.vue"),
        name: "CampaignRecord",
        meta: {
          title: "活动记录",
          icon: "document",
          keepAlive: true,
          alwaysShow: false
        }
      }
    ]
  }
 */

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes as RouteRecordRaw[],
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

/**
 * 重置路由
 */
export function resetRouter() {
  router.replace({ path: "/login" });
}

export default router;
