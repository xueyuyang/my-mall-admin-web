import request from '@/utils/request'
export function fetchList(data) {
  return request({
    url:'/mdc/product/queryProductListWithPage',
    method:'post',
    data:data
  })
}

export function fetchSimpleList(params) {
  return request({
    url:'/product/simpleList',
    method:'get',
    params:params
  })
}

export function updateDeleteStatus(params) {
  return request({
    url:'/mdc/product/update/deleteStatus',
    method:'post',
    params:params
  })
}

export function updateNewStatus(params) {
  return request({
    url:'/mdc/product/update/newStatus',
    method:'post',
    params:params
  })
}

export function updateRecommendStatus(params) {
  return request({
    url:'/mdc/product/update/recommendStatus',
    method:'post',
    params:params
  })
}

export function updatePublishStatus(params) {
  return request({
    url:'/mdc/product/update/publishStatus',
    method:'post',
    params:params
  })
}

export function createProduct(data) {
  return request({
    url:'/mdc/product/save',
    method:'post',
    data:data
  })
}

export function updateProduct(id,data) {
  data.id = id;
  return request({
    url:'/mdc/product/save/',
    method:'post',
    data:data
  })
}

export function getProduct(id) {
  return request({
    url:'/mdc/product/getById/'+id,
    method:'post',
  })
}

