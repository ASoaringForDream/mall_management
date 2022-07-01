import { request } from "./request";
export function getUserList(params) {
  return request({
    url: '/users',
    method: 'get',
    params
  })
}

export function changeUserStatus(uid, type) {
  return request({
    url: `/users/${uid}/state/${type}`,
    method: 'put'
  })
}

export function searchUser(params) {
  return request({
    url: `/users`,
    method: 'get',
    params
  })
}

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

export function getUser(id) {
  return request({
    url: `/users/${id}`,
    method: 'get'
  })
}

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

export function deleteUser(id) {
  return request({
    url: `/users/${id}`,
    method: 'delete'
  })
}