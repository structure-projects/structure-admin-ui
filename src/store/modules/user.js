import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  tenant: {
    id: localStorage.getItem('tenantId'),
    loginImage: localStorage.getItem('tenantId'),
    logo: localStorage.getItem('tenantId'),
    title: localStorage.getItem('tenantId')
  }
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_TENANT: (state, tenant) => {
    state.tenant = tenant
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, authType, code } = userInfo
    console.log(JSON.stringify(userInfo))
    return new Promise((resolve, reject) => {
      const loginParams = {
        username: username.trim(),
        password: password,
        authType: authType,
        code: code
      }
      login(loginParams).then(response => {
        const { data } = response
        // console.log('login data -> ', data)
        commit('SET_TOKEN', data)
        setToken(data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roles, nickName, photo } = data
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        const newRoles = roles.map((obj, index) => {
          return obj.code
        }).join(',').split(',')
        data.roles = newRoles
        commit('SET_ROLES', newRoles)
        commit('SET_NAME', nickName)
        commit('SET_AVATAR', photo)
        // commit('SET_DEPT_ID', deptId)
        commit('SET_INTRODUCTION', 'false')
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  // async changeRoles({ commit, dispatch }, role) {
  //   // const token = role + '-token'

  //   // commit('SET_TOKEN', token)
  //   // setToken(token)

  //   const { roles } = await dispatch('getInfo')

  //   resetRouter()

  //   // generate accessible routes map based on roles
  //   const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
  //   // dynamically add accessible routes
  //   router.addRoutes(accessRoutes)

  //   // reset visited views and cached views
  //   dispatch('tagsView/delAllViews', null, { root: true })
  // },

  // dynamically modify permissions
  async changeTenant({ commit, dispatch }, tenant) {
    // const token = role + '-token'

    commit('SET_TENANT', tenant)
    // setToken(token)

    localStorage.setItem('tenantId', tenant)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
