import { RouteRecordRaw } from "vue-router";
import { constantRoutes } from "@/router";
import { store } from "@/store";
import { listRoutes } from "@/api/system/menu";

const modules = import.meta.glob("../../views/**/**.vue");
const Layout = () => import("@/layout/index.vue");

/**
 * Use meta.role to determine if the current user has permission
 *
 * @param roles 用户角色集合
 * @param route 路由
 * @returns
 */
const hasPermission = (roles: string[], route: RouteRecordRaw) => {
  if (route.meta && route.meta.roles) {
    // 角色【超级管理员】拥有所有权限，忽略校验
    if (roles.includes("ROOT")) {
      return true;
    }
    return roles.some((role) => {
      if (route.meta?.roles) {
        return route.meta.roles.includes(role);
      }
    });
  }
  return false;
};

/**
 * 递归过滤有权限的异步(动态)路由
 *
 * @param routes 接口返回的异步(动态)路由
 * @param roles 用户角色集合
 * @returns 返回用户有权限的异步(动态)路由
 */
const filterAsyncRoutes = (routes: RouteRecordRaw[], roles: string[]) => {
  const asyncRoutes: RouteRecordRaw[] = [];

  routes.forEach((route) => {
    const tmpRoute = { ...route }; // ES6扩展运算符复制新对象
    if (!route.name) {
      tmpRoute.name = route.path;
    }
    // 判断用户(角色)是否有该路由的访问权限
    if (hasPermission(roles, tmpRoute)) {
      if (tmpRoute.component?.toString() == "Layout") {
        tmpRoute.component = Layout;
      } else {
        const component = modules[`../../views/${tmpRoute.component}.vue`];
        if (component) {
          tmpRoute.component = component;
        } else {
          tmpRoute.component = modules[`../../views/error-page/404.vue`];
        }
      }

      if (tmpRoute.children) {
        tmpRoute.children = filterAsyncRoutes(tmpRoute.children, roles);
      }

      asyncRoutes.push(tmpRoute);
    }
  });

  return asyncRoutes;
};

// setup
export const usePermissionStore = defineStore("permission", () => {
  // state
  const routes = ref<RouteRecordRaw[]>([]);

  // actions
  function setRoutes(newRoutes: RouteRecordRaw[]) {
    routes.value = newRoutes;
  }
  /**
   * 生成动态路由
   *
   * @param roles 用户角色集合
   * @returns
   */
  function generateRoutes(roles: string[]) {
    return new Promise<RouteRecordRaw[]>((resolve, reject) => {
      // 接口获取所有路由
      listRoutes()
        .then(({ data: asyncRoutes }) => {
          // 根据角色获取有访问权限的路由
          const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
          
          // 合并动态路由和静态路由中重名的分组
          const mergedRoutes = mergeRoutes(constantRoutes, accessedRoutes);
          
          setRoutes(mergedRoutes);
          resolve(mergedRoutes);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  
  /**
   * 合并动态路由和静态路由中重名的分组
   * @param staticRoutes 静态路由
   * @param dynamicRoutes 动态路由
   * @returns 合并后的路由
   */
  function mergeRoutes(staticRoutes: RouteRecordRaw[], dynamicRoutes: RouteRecordRaw[]): RouteRecordRaw[] {
    const mergedRoutes = [...staticRoutes];
    
    dynamicRoutes.forEach(dynamicRoute => {
      // 检查是否存在相同path的路由
      const existingRouteIndex = mergedRoutes.findIndex(route => route.path === dynamicRoute.path);
      
      if (existingRouteIndex !== -1) {
        // 如果存在相同path的路由，合并它们的子路由
        const existingRoute = mergedRoutes[existingRouteIndex];
        const mergedChildren: RouteRecordRaw[] = [...(existingRoute.children || [])];
        
        // 合并动态路由的子路由到静态路由的子路由中，去重
        (dynamicRoute.children || []).forEach(dynamicChild => {
          const childExists = mergedChildren.some(child => child.path === dynamicChild.path);
          if (!childExists) {
            mergedChildren.push(dynamicChild);
          }
        });
        
        // 更新合并后的路由
        mergedRoutes[existingRouteIndex] = {
          ...existingRoute,
          children: mergedChildren
        };
      } else {
        // 如果不存在相同path的路由，直接添加
        mergedRoutes.push(dynamicRoute);
      }
    });
    
    return mergedRoutes;
  }
  /**
   * 获取与激活的顶部菜单项相关的混合模式左侧菜单集合
   */
  const mixLeftMenus = ref<RouteRecordRaw[]>([]);
  function setMixLeftMenus(topMenuPath: string) {
    const matchedItem = routes.value.find((item) => item.path === topMenuPath);
    if (matchedItem && matchedItem.children) {
      mixLeftMenus.value = matchedItem.children;
    }
  }
  return {
    routes,
    setRoutes,
    generateRoutes,
    mixLeftMenus,
    setMixLeftMenus,
  };
});

// 非setup
export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
