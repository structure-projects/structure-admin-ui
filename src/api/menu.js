import request from '@/utils/request'

export function children(params) {
  return request({
    url: '/menu/list/children',
    method: 'get',
    params: params
  })
}

export function option(params) {
  return request({
    url: '/menu/option',
    method: 'get',
    params: params
  })
}

export function list(page, params) {
  return request({
    url: '/menu/list/' + page.currentPage + '/' + page.pageSize + '/',
    method: 'get',
    params: params
  })
}

export function save(data) {
  return request({
    url: '/menu/',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/menu/',
    method: 'put',
    data
  })
}

export function remove(menuId) {
  return request({
    url: '/menu/' + menuId,
    method: 'delete'
  })
}

export function enable(menuId) {
  return request({
    url: '/menu/enable/' + menuId,
    method: 'put'
  })
}

export function disable(menuId) {
  return request({
    url: '/menu/disable/' + menuId,
    method: 'put'
  })
}
