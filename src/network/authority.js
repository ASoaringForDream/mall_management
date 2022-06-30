import { request } from "./request";
export function getAsideMenu(username,password) {
  return request({
    url:'/menus',
    type:'get'
  })
}