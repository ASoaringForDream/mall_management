import { request } from "./request";
// 获取商品分类列表
export function getGoodsCateList(params) {
  return request({
    url: `/categories`,
    method: 'get',
    params
  })
}
// 通过id获取商品分类
export function getGoodsCateById(id) {
  return request({
    url: `/categories/${id}`,
    method: 'get'
  })
}
// 添加商品分类
export function addGoodsCate(data) {
  return request({
    url: `/categories`,
    method: 'post',
    data
  })
}
// 删除商品分类
export function deleteGoodsCate(id) {
  return request({
    url: `/categories/${id}`,
    method: 'delete'
  })
}
// 编辑商品分类
export function editGoodsCate(id,data) {
  return request({
    url: `/categories/${id}`,
    method: 'put',
    data
  })
}
// 获取分类参数
export function getGoodsAttrs(id,params) {
  return request({
    url: `/categories/${id}/attributes`,
    method: 'get',
    params
  })
}

// 添加分类参数
export function addGoodsAttrs(id,data) {
  return request({
    url: `/categories/${id}/attributes`,
    method: 'post',
    data
  })
}
// 编辑分类参数
export function editGoodsAttrs(id,attrId,data) {
  return request({
    url: `/categories/${id}/attributes/${attrId}`,
    method: 'put',
    data
  })
}
// 删除分类参数
export function deleteGoodsAttrs(id,attrId) {
  return request({
    url: `/categories/${id}/attributes/${attrId}`,
    method: 'delete'
  })
}
// 获取商品列表
export function getGoodsList(params) {
  return request({
    url: `/goods`,
    method: 'get',
    params
  })
}

// 删除商品
export function deleteGood(id) {
  return request({
    url: `/goods/${id}`,
    method: 'delete'
  })
}

// 删除商品
export function addGood(data) {
  return request({
    url: `/goods`,
    method: 'post',
    data
  })
}
// 通过id获取商品
export function getGoodById(id) {
  return request({
    url: `/goods/${id}`,
    method: 'get'
  })
}
// 编辑商品
export function editGood(id,data) {
  return request({
    url: `/goods/${id}`,
    method: 'put',
    data
  })
}