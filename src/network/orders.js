import { request } from "./request";
// 获取订单列表
export function getOrdersList(params) {
  return request({
    url: `/orders`,
    method: 'get',
    params
  })
}

// 获取订单列表
export function getLogistics(id) {
  return request({
    url: `//kuaidi/${id}`,
    method: 'get'
  })
}