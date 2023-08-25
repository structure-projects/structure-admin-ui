import request from '@/utils/request'

export function get(params) {
  return request({
    url: '/role/get',
    method: 'get',
    params: params
  })
}

export function option(params) {
  return request({
    url: '/role/list',
    method: 'get',
    params: params
  })
}

export function list(page, params) {
  return request({
    url: '/role/list/' + page.currentPage + '/' + page.pageSize + '/',
    method: 'get',
    params: params
  })
}

export function save(data) {
  return request({
    url: '/role/',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/role/',
    method: 'put',
    data
  })
}

export function remove(roleId) {
  return request({
    url: '/role/' + roleId,
    method: 'delete'
  })
}

export function enable(roleId) {
  return request({
    url: '/role/enable/' + roleId,
    method: 'put'
  })
}

export function disable(roleId) {
  return request({
    url: '/role/disable/' + roleId,
    method: 'put'
  })
}
