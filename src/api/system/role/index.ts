import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { RoleQuery, RolePageResult, RoleInfo } from "./types";

/**
 * 获取角色分页数据
 *
 * @param queryParams
 */
export function getRolePage(
  queryParams?: PageQuery<RoleQuery>
): AxiosPromise<RolePageResult> {
  return request({
    url: "/api/roles/" + queryParams?.page + "/" + queryParams?.pageSize + "/page",
    method: "get",
    params: queryParams?.params,
  });
}

/**
 * 获取角色下拉数据
 *
 * @param queryParams
 */
export function getRoleOptions(
  queryParams?: RoleQuery
): AxiosPromise<OptionType[]> {
  return request({
    url: "/api/roles/options",
    method: "get",
    params: queryParams,
  });
}

/**
 * 获取角色的菜单ID集合
 *
 * @param queryParams
 */
export function getRoleMenuIds(roleId: number): AxiosPromise<number[]> {
  return request({
    url: "/api/roles/" + roleId + "/menuIds",
    method: "get",
  });
}

/**
 * 分配菜单权限给角色
 *
 * @param queryParams
 */
export function updateRoleMenus(
  roleId: number,
  data: string[]
): AxiosPromise<any> {
  return request({
    url: "/api/roles/bindAuthorities",
    method: "post",
    data: {
      id: roleId,
      authorities: data
    },
  });
}

/**
 * 获取角色详情
 *
 * @param id
 */
export function getRoleById(id: number): AxiosPromise<RoleInfo> {
  return request({
    url: "/api/roles/" + id,
    method: "get",
  });
}

/**
 * 添加角色
 *
 * @param data
 */
export function addRole(data: RoleInfo) {
  return request({
    url: "/api/roles/",
    method: "post",
    data: data,
  });
}

/**
 * 更新角色
 *
 * @param id
 * @param data
 */
export function updateRole(id: number, data: RoleInfo) {
  return request({
    url: "/api/roles/" + id,
    method: "put",
    data: data,
  });
}

/**
 * 批量删除角色，多个以英文逗号(,)分割
 *
 * @param ids
 */
export function deleteRoles(ids: string) {
  return request({
    url: "/api/roles/" + ids,
    method: "delete",
  });
}
