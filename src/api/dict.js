import request from '@/utils/request'

export function list(page, params) {
  return request({
    url: '/dict/category/list/' + page.currentPage + '/' + page.pageSize + '/',
    method: 'get',
    params: params
  })
}

export function save(data) {
  return request({
    url: '/dict/category/',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/dict/category/',
    method: 'put',
    data
  })
}

export function remove(dictId) {
  return request({
    url: '/dict/category/' + dictId,
    method: 'delete'
  })
}

export function enable(dictId) {
  return request({
    url: '/dict/category/enable/' + dictId,
    method: 'put'
  })
}

export function disable(dictId) {
  return request({
    url: '/dict/category/disable/' + dictId,
    method: 'put'
  })
}

export function listItem(params) {
  return request({
    url: '/dict/item/list/',
    method: 'get',
    params: params
  })
}

export function saveItem(data) {
  return request({
    url: '/dict/item/',
    method: 'post',
    data
  })
}

export function updateItem(data) {
  return request({
    url: '/dict/item/',
    method: 'put',
    data
  })
}

export function removeItem(itemId) {
  return request({
    url: '/dict/item/' + itemId,
    method: 'delete'
  })
}

export function enableItem(itemId) {
  return request({
    url: '/dict/item/enable/' + itemId,
    method: 'put'
  })
}

export function disableItem(itemId) {
  return request({
    url: '/dict/item/disable/' + itemId,
    method: 'put'
  })
}
