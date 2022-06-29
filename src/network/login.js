import { request } from "./request";
export function login(username,password) {
  return request({
    url:'/login',
    type:'post',
    params:{
      username,
      password
    }
  })
}