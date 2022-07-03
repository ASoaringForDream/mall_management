import { request } from "./request";
// 登录
export function login(username,password) {
  return request({
    url:'/login',
    method:'post',
    params:{
      username,
      password
    }
  })
}