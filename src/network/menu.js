import { request } from "./request";
export function getAsideMenu() {
  return request({
    url:'/menus',
    method:'get'
  })
}