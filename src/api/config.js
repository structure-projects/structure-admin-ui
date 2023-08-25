import request from '@/utils/request'

export function getSysConfig(params) {
  return request({
    url: '/config/getSysConfig',
    method: 'get',
    params: params
  })
}

export function changSysConfig(config) {
  return request({
    url: '/config/changSysConfig',
    method: 'put',
    data: config
  })
}

export function getConfig() {
  return request({
    url: '/config/getUserConfigByCode',
    method: 'get'
  })
}

export function setConfig(data) {
  return request({
    url: '/config/changCurrentUserConfig',
    method: 'put',
    data: data
  })
}
