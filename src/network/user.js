import { request } from "./request";
// 获取用户列表
export function getUserList(params) {
  return request({
    url: '/users',
    method: 'get',
    params
  })
}
// 编辑用户
export function changeUserStatus(uid, type) {
  return request({
    url: `/users/${uid}/state/${type}`,
    method: 'put'
  })
}
// 搜索用户
export function searchUser(params) {
  return request({
    url: `/users`,
    method: 'get',
    params
  })
}
// 添加用户
export function addUser(username,password,email,mobile) {
  return request({
    url: `/users`,
    method: 'post',
    data:{
      username,
      password,
      email,
      mobile
    }
  })
}
// 通过id获取用户
export function getUser(id) {
  return request({
    url: `/users/${id}`,
    method: 'get'
  })
}
// 编辑用户
export function changeUser(id,email,mobile) {
  return request({
    url: `/users/${id}`,
    method: 'put',
    data:{
      email,
      mobile
    }
  })
}
// 删除用户
export function deleteUser(id) {
  return request({
    url: `/users/${id}`,
    method: 'delete'
  })
}
// 分配用户角色
export function allocationRole(id,rid) {
  return request({
    url: `users/${id}/role`,
    method: 'put',
    data: {
      rid
    }
  })
}