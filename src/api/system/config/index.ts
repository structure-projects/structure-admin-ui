import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { ConfigQuery, ConfigPageResult, Config } from "./types";

/**
 * 获取配置分页数据
 *
 * @param queryParams
 */
export function getConfigPage(
  queryParams?: PageQuery<ConfigQuery>
): AxiosPromise<ConfigPageResult> {
  return request({
    url: "/api/config/" + queryParams?.page + "/" + queryParams?.pageSize + "/page",
    method: "get",
    params: queryParams?.params,
  });
}
/**
 * 获取配置详情
 *
 * @param id
 */
export function geConfigById(id: number): AxiosPromise<Config> {
  return request({
    url: "/api/config/" + id,
    method: "get",
  });
}

/**
 * 添加配置
 *
 * @param data
 */
export function addConfig(data: Config) {
  return request({
    url: "/api/config/",
    method: "post",
    data: data,
  });
}

/**
 * 更新配置
 *
 * @param id
 * @param data
 */
export function updateConfig(id: number, data: Config) {
  return request({
    url: "/api/config/" + id,
    method: "put",
    data: data,
  });
}

/**
 * 批量删除配置，多个以英文逗号(,)分割
 *
 * @param ids
 */
export function deleteConfig(ids: string) {
  return request({
    url: "/api/config/" + ids,
    method: "delete",
  });
}
