import request from "@/utils/request";
import { AxiosPromise } from "axios";
import {
  DictTypeQuery,
  DictTypePageResult,
  DictTypeForm,
  DictQuery,
  DictForm,
  DictPageResult,
} from "./types";

/**
 * 字典类型分页列表
 *
 * @param queryParams
 */
export function getDictTypePage(
  queryParams: PageQuery<DictTypeQuery>
): AxiosPromise<DictTypePageResult> {
  return request({
    url: "/api/dict/category/" + queryParams.page + "/" + queryParams.pageSize +"/page",
    method: "get",
    params: queryParams.params,
  });
}

/**
 * 字典类型表单数据
 *
 * @param id
 */
export function getDictTypeForm(id: number): AxiosPromise<DictTypeForm> {
  return request({
    url: "/api/dict/category/" + id,
    method: "get",
  });
}

/**
 * 新增字典类型
 *
 * @param data
 */
export function addDictType(data: DictTypeForm) {
  return request({
    url: "/api/dict/category/",
    method: "post",
    data: data,
  });
}

/**
 * 修改字典类型
 *
 * @param id
 * @param data
 */
export function updateDictType(id: number, data: DictTypeForm) {
  return request({
    url: "/api/dict/category/" + id,
    method: "put",
    data: data,
  });
}

/**
 * 删除字典类型
 */
export function deleteDictTypes(ids: string) {
  return request({
    url: "/api/dict/category/" + ids,
    method: "delete",
  });
}

/**
 * 获取字典类型的数据项
 *
 * @param typeCode 字典类型编码
 */
export function getDictOptions(typeCode: string): AxiosPromise<OptionType[]> {
  return request({
    url: "/api/dict/" + typeCode + "/options",
    method: "get",
  });
}

/**
 * 字典分页列表
 */
export function getDictPage(
  queryParams: PageQuery<DictQuery>
): AxiosPromise<DictPageResult> {
  return request({
    url: "/api/dict/"+ queryParams.page + "/" + queryParams.pageSize + "/page",
    method: "get",
    params: queryParams.params,
  });
}

/**
 * 获取字典表单数据
 *
 * @param id
 */
export function getDictFormData(id: number): AxiosPromise<DictForm> {
  return request({
    url: "/api/dict/" + id,
    method: "get",
  });
}

/**
 * 新增字典
 *
 * @param data
 */
export function addDict(data: DictForm) {
  return request({
    url: "/api/dict/",
    method: "post",
    data: data,
  });
}

/**
 * 修改字典项
 *
 * @param id
 * @param data
 */
export function updateDict(id: number, data: DictForm) {
  return request({
    url: "/api/dict/" + id,
    method: "put",
    data: data,
  });
}

/**
 * 删除字典
 *
 * @param ids 字典项ID，多个以英文逗号(,)分割
 */
export function deleteDict(ids: string) {
  return request({
    url: "/api/dict/" + ids,
    method: "delete",
  });
}
