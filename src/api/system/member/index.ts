import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { MemberQuery, MemberPageResult, Member } from "./types";

/**
 * 获取成员分页数据
 *
 * @param queryParams
 */
export function getMemberPage(
  queryParams?: PageQuery<MemberQuery>
): AxiosPromise<MemberPageResult> {
  return request({
    url: "/api/member/" + queryParams?.page + "/" + queryParams?.pageSize + "/page",
    method: "get",
    params: queryParams?.params,
  });
}
/**
 * 获取成员详情
 *
 * @param id
 */
export function getMemberById(id: number): AxiosPromise<Member> {
  return request({
    url: "/api/member/" + id,
    method: "get",
  });
}

/**
 * 添加成员
 *
 * @param data
 */
export function addMember(data: Member) {
  return request({
    url: "/api/member/",
    method: "post",
    data: data,
  });
}

/**
 * 添加成员
 *
 * @param data
 */
export function updateMemberStatus(id: number, state: number) {
  return request({
    url: "/api/member/" + id + "/" + state + "/changeState",
    method: "put",
  });
}

/**
 * 更新成员
 *
 * @param id
 * @param data
 */
export function updateMember(id: number, data: Member) {
  return request({
    url: "/api/member/" + id,
    method: "put",
    data: data,
  });
}

/**
 * 批量删除成员，多个以英文逗号(,)分割
 *
 * @param ids
 */
export function deleteMember(ids: string) {
  return request({
    url: "/api/member/" + ids,
    method: "delete",
  });
}

export function getMemberDeptTree(id: number) {
  return request({
    url: "/api/member/getMemberDeptTree",
    method: "get",
    params: { 
      userId:id
    },
  });
}


/**
 * 修改成员密码
 *
 * @param id
 * @param password
 */
export function updateMemberPassword(id: number, password: string) {
  return request({
    url: "/api/member/resetPassword",
    method: "put",
    data: { 
      memberId:id,
      password: password 
    },
  });
}


/**
 * 下载成员导入模板
 *
 * @returns
 */
export function downloadTemplateApi() {
  return request({
    url: "/api/member/template",
    method: "get",
    responseType: "arraybuffer",
  });
}

/**
 * 导出成员
 *
 * @param queryParams
 * @returns
 */
export function exportMember(queryParams: MemberQuery) {
  return request({
    url: "/api/member/export",
    method: "get",
    params: queryParams,
    responseType: "arraybuffer",
  });
}

/**
 * 导入成员
 *
 * @param file
 */
export function importMember(deptId: number, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/api/member/import",
    method: "post",
    params: { deptId: deptId },
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}