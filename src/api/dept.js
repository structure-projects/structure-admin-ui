import request from '@/utils/request'

export function list(page, params) {
  return request({
    url: '/dept/list/' + page.currentPage + '/' + page.pageSize + '/',
    method: 'get',
    params: params
  })
}

export function children(params) {
  return request({
    url: '/dept/list/children',
    method: 'get',
    params: params
  })
}

export function save(data) {
  return request({
    url: '/dept/',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/dept/',
    method: 'put',
    data
  })
}

export function remove(deptId) {
  return request({
    url: '/dept/' + deptId,
    method: 'delete'
  })
}

export function enable(deptId) {
  return request({
    url: '/dept/enable/' + deptId,
    method: 'put'
  })
}

export function disable(deptId) {
  return request({
    url: '/dept/disable/' + deptId,
    method: 'put'
  })
}

export function tree() {
  return request({
    url: '/dept/option/',
    method: 'get'
  })
}
