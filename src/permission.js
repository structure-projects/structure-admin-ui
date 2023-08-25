import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { getSysConfig } from '@/api/config.js'
import { getTenant } from '@/api/organization.js'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // 如果当前租户存在则放行如果
          const tenantId = localStorage.getItem('tenantId')
          const { roles, useTenantId } = await store.dispatch('user/getInfo')
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          router.addRoutes(accessRoutes)
          console.log('tenantId')
          next({ ...to, replace: true })
          // if (useTenantId === tenantId) {
          //   next({ ...to, replace: true })
          // } else {
          //   next(`/select-tenant?redirect=${to.path}`)
          // }
        } catch (error) {
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    // 获取一下租户信息
    let tenantId = localStorage.getItem('tenantId')
    if (!tenantId) {
    // 租户不存在则需要通过HOST 去获取租户信息
      to.meta.host = window.location.host
      let host = window.location.host
      let endIndex = host.lastIndexOf(':')
      endIndex = (endIndex < 0) ? host.length : endIndex
      host = host.substring(0, endIndex)
      // console.log(host)
      if (host) {
      // 调用租户获取租户信息
        getTenant({
          host: host
        }).then((res) => {
          tenantId = res.data.organizationId
          localStorage.setItem('tenantId', tenantId)
        })
      }
    }
    // 存在租户去更新配置
    if (tenantId) {
      getSysConfig({
        organizationId: localStorage.getItem('tenantId')
      }).then((res) => {
        if (res.success) {
          //  console.log(res)
          // 登录背景图
          sessionStorage.setItem('loginBg', res.data.loginBg)
          // 设置系统名称
          sessionStorage.setItem('title', res.data.title)
          // 设置系统logo
          sessionStorage.setItem('logo', res.data.logo)
          // 设置主题色
          sessionStorage.setItem('theme', res.data.themeColors)
        }
      })
    }
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
