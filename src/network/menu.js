import { request } from "./request";
// 获取权限列表
export function getAsideMenu() {
  return request({
    url:'/menus',
    method:'get'
  })
}