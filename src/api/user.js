import request from '@/utils/request'

export function get(params) {
  return request({
    url: '/user/get',
    method: 'get',
    params: params
  })
}

export function list(page, params) {
  return request({
    url: '/user/list/' + page.currentPage + '/' + page.pageSize + '/',
    method: 'get',
    params: params
  })
}

export function save(data) {
  return request({
    url: '/user/',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/user/',
    method: 'put',
    data
  })
}

export function resetPassword(data) {
  return request({
    url: '/user/resetPassword',
    method: 'put',
    data
  })
}

export function remove(userId) {
  return request({
    url: '/user/' + userId,
    method: 'delete'
  })
}

export function enable(userId) {
  return request({
    url: '/user/enable/' + userId,
    method: 'put'
  })
}

export function disable(userId) {
  return request({
    url: '/user/disable/' + userId,
    method: 'put'
  })
}

export function lock(userId) {
  return request({
    url: '/user/lock/' + userId,
    method: 'put'
  })
}

export function unlock(userId) {
  return request({
    url: '/user/unlock/' + userId,
    method: 'put'
  })
}

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getInfo() {
  return request({
    url: '/user/current',
    method: 'get'
  })
}
export function changeProfile(data) {
  return request({
    url: '/user/changeProfile',
    method: 'put',
    data
  })
}

export function changePassword(data) {
  return request({
    url: '/user/changePassword',
    method: 'put',
    data
  })
}

export function getUserMenu() {
  return request({
    url: '/user/getUserMenu',
    method: 'get'
  })
}
