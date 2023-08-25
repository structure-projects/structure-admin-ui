import request from '@/utils/request'

export function list(page, params) {
  return request({
    url: '/employee/list/' + page.currentPage + '/' + page.pageSize + '/',
    method: 'get',
    params: params
  })
}

export function save(data) {
  return request({
    url: '/employee/',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/employee/',
    method: 'put',
    data
  })
}

export function remove(employeeId) {
  return request({
    url: '/employee/' + employeeId,
    method: 'delete'
  })
}

export function get(params) {
  return request({
    url: '/get',
    method: 'get'
  })
}
