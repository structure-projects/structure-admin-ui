import request from '@/utils/request'

export function getCurrent() {
  return request({
    url: '/org/current',
    method: 'get'
  })
}

export function getTenant(params) {
  return request({
    url: '/org/getTenant',
    method: 'get',
    params: params
  })
}

export function changCurrent(org) {
  return request({
    url: '/org/changCurrent',
    method: 'put',
    data: org
  })
}
