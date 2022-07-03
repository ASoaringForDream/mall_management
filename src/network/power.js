import { request } from "./request";
// 获取权限列表
export function getRightsList(type) {
  return request({
    url: `/rights/${type}`,
    method: 'get'
  })
}
// 获取角色列表
export function getRolesList() {
  return request({
    url: `/roles`,
    method: 'get'
  })
}
// 添加角色
export function addRole(data) {
  return request({
    url: `/roles`,
    method: 'post',
    data
  })
}
// 通过id获取角色
export function getRole(id) {
  return request({
    url: `/roles/${id}`,
    method: 'get'
  })
}
// 编辑角色
export function editRole(id,data) {
  return request({
    url: `/roles/${id}`,
    method: 'put',
    data
  })
}
// 删除角色
export function deleteRole(id) {
  return request({
    url: `/roles/${id}`,
    method: 'delete'
  })
}
// 删除指定权限
export function deleteCurrentRight(roleId,rightId) {
  return request({
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}
// 分配权限
export function allocationRight(roleId,rights) {
  return request({
    url: `roles/${roleId}/rights`,
    method: 'post',
    data: {
      rids: rights
    }
  })
}