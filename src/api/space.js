import request from '@/utils/request'

export function list(page, params) {
  return request({
    url: '/space/list/' + page.currentPage + '/' + page.pageSize + '/',
    method: 'get',
    params: params
  })
}

export function save(data) {
  return request({
    url: '/space/',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/space/',
    method: 'put',
    data
  })
}

export function remove(spaceId) {
  return request({
    url: '/space/' + spaceId,
    method: 'delete'
  })
}

export function enable(spaceId) {
  return request({
    url: '/space/enable/' + spaceId,
    method: 'put'
  })
}

export function disable(spaceId) {
  return request({
    url: '/space/disable/' + spaceId,
    method: 'put'
  })
}
