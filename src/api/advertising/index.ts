import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { AdvertisingDTO, AdvertisingListParams, AdvertisingVO, AdvertisingCallbackListParams, AdvertisingCallbackVO } from "./types";

/**
 * 添加广告
 * @param data 广告DTO
 * @returns 广告ID
 */
export function addAdvertisingApi(data: AdvertisingDTO): AxiosPromise<number> {
  return request({
    url: "/advertising/",
    method: "post",
    data,
  });
}

/**
 * 查询广告位提供APP上展示
 * @param params 查询参数
 * @returns 广告列表
 */
export function getAdPlaceCodeApi(params?: { code?: string }): AxiosPromise<AdvertisingVO[]> {
  return request({
    url: "/advertising/getAdPlaceCode",
    method: "get",
    params,
  });
}

/**
 * 查询广告列表
 * @param params 查询参数
 * @returns 分页结果
 */
export function getAdvertisingListApi(params: AdvertisingListParams): AxiosPromise<{
  current: number;
  pages: number;
  records: AdvertisingVO[];
  size: number;
  total: number;
}> {
  return request({
    url: "/advertising/list",
    method: "get",
    params,
  });
}

/**
 * 查询广告详情
 * @param id 广告ID
 * @returns 广告详情
 */
export function getAdvertisingApi(id: number): AxiosPromise<AdvertisingVO> {
  return request({
    url: `/advertising/${id}`,
    method: "get",
  });
}

/**
 * 修改广告
 * @param id 广告ID
 * @param data 广告DTO
 * @returns 广告ID
 */
export function updateAdvertisingApi(id: number, data: AdvertisingDTO): AxiosPromise<number> {
  return request({
    url: `/advertising/${id}`,
    method: "put",
    data,
  });
}

/**
 * 删除广告
 * @param id 广告ID
 * @returns 广告ID
 */
export function deleteAdvertisingApi(id: number): AxiosPromise<number> {
  return request({
    url: `/advertising/${id}`,
    method: "delete",
  });
}

/**
 * 分页查询广告回调记录列表
 * @param params 查询参数
 * @returns 分页结果
 */
export function getAdvertisingCallbackListApi(params: AdvertisingCallbackListParams): AxiosPromise<{
  current: number;
  pages: number;
  records: AdvertisingCallbackVO[];
  size: number;
  total: number;
}> {
  return request({
    url: "/advertising/callback/list",
    method: "get",
    params,
  });
}
