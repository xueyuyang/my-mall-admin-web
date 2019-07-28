import request from '@/utils/request'
export function fetchList(parentId,params) {
  return request({
    url:'/mdc/category/queryProductCategoryListByPid/'+parentId,
    method:'post',
    params:params
  })
}
export function deleteProductCate(id) {
  return request({
    url:'/mdc/category/deleteById/'+id,
    method:'post'
  })
}

export function createProductCate(data) {
  return request({
    url:'/mdc/category/create',
    method:'post',
    data:data
  })
}

export function updateProductCate(id,data) {
  return request({
    url:'/mdc/category/update/'+id,
    method:'post',
    data:data
  })
}

export function getProductCate(id) {
  return request({
    url:'/mdc/category/'+id,
    method:'post',
  })
}

export function updateShowStatus(data) {
  return request({
    url:'/mdc/category/modifyShowStatus',
    method:'post',
    data:data
  })
}

export function updateNavStatus(data) {
  return request({
    url:'/mdc/category/modifyNavStatus',
    method:'post',
    data:data
  })
}

export function fetchListWithChildren() {
  return request({
    url:'/mdc/category/getTree',
    method:'post'
  })
}

export function fetchAllCatList() {
  return request({
    url:'/mdc/category/getTree',
    method:'post'
  })
}
