import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user', noCache: true }
      }
    ]
  },

  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/select-tenant',
    component: () => import('@/views/tenant/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  }

]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/app',
    component: Layout,
    redirect: 'noRedirect',
    name: 'App',
    meta: {
      title: '应用中心',
      icon: 'lock'
      // roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'shop',
        component: () => import('@/views/user/index'),
        name: 'AppShop',
        meta: {
          title: '应用市场'
          // roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'plugin',
        component: () => import('@/views/employee/index'),
        name: 'AppPlugin',
        meta: {
          title: '插件市场'
          // roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'my',
        component: () => import('@/views/employee/index'),
        name: 'MyApp',
        meta: {
          title: '我的应用'
        //  roles: ['admin'] // 版本管理（资源查看，发布上线，应用开发（测试，打包），应用上架） 资源定义（资源目录、数据模型，审批流程，页面，接口，处理器，插件，子应用）
        }
      },
      {
        path: 'develop',
        component: () => import('@/views/employee/index'),
        name: 'AppDevelop',
        meta: {
          title: '应用开发'
        //  roles: ['admin'] // or you can only set roles in sub nav
        }
      }
    ]
  },
  {
    path: '/admin',
    component: Layout,
    redirect: 'noRedirect',
    name: 'SystemAdmin',
    meta: {
      title: '系统管理',
      icon: 'lock'
      // roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/user/index'),
        name: 'User',
        meta: {
          title: '用户管理'
        //  roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'employee',
        component: () => import('@/views/employee/index'),
        name: 'Employee',
        meta: {
          title: '职工管理' // or you can only set roles in sub nav
        }
      },
      {
        path: 'role',
        component: () => import('@/views/role/index'),
        name: 'RoleAdmin',
        meta: {
          title: '角色管理' // or you can only set roles in sub nav
        }
      },
      {
        path: 'menu',
        component: () => import('@/views/menu/index'),
        name: 'MenuAdmin',
        meta: {
          title: '菜单管理' // or you can only set roles in sub nav
        }
      },
      {
        path: 'dept',
        component: () => import('@/views/dept/index'),
        name: 'Dept',
        meta: {
          title: '部门管理' // or you can only set roles in sub nav
        }
      },
      {
        path: 'dict',
        component: () => import('@/views/dict/index'),
        name: 'Dict',
        meta: {
          title: '字典管理' // or you can only set roles in sub nav
        }
      },
      {
        path: 'space',
        component: () => import('@/views/space/index'),
        name: 'Space',
        meta: {
          title: '空间管理' // or you can only set roles in sub nav
        }
      },
      {
        path: 'organization',
        component: () => import('@/views/organization/index'),
        name: 'Organization',
        meta: {
          title: '机构信息' // or you can only set roles in sub nav
        }
      },
      {
        path: 'config',
        component: () => import('@/views/config/index'),
        name: 'Config',
        meta: {
          title: '系统配置' // or you can only set roles in sub nav
        }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
