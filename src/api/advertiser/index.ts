import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { CreateAdvertiserDTO, UpdateAdvertiserDTO, AdvertiserVO, AdvertiserListParams } from "./types";

/**
 * 创建广告商
 * @param data 创建广告商DTO
 * @returns 广告商详情
 */
export function createAdvertiserApi(data: CreateAdvertiserDTO): AxiosPromise<AdvertiserVO> {
  return request({
    url: "/advertiser",
    method: "post",
    data,
  });
}

/**
 * 更新广告商
 * @param data 更新广告商DTO
 * @returns 广告商详情
 */
export function updateAdvertiserApi(data: UpdateAdvertiserDTO): AxiosPromise<AdvertiserVO> {
  return request({
    url: "/advertiser",
    method: "put",
    data,
  });
}

/**
 * 分页查询广告商列表
 * @param params 查询参数
 * @returns 分页结果
 */
export function getAdvertiserListApi(params: AdvertiserListParams): AxiosPromise<{
  current: number;
  pages: number;
  records: AdvertiserVO[];
  size: number;
  total: number;
}> {
  return request({
    url: "/advertiser/list",
    method: "get",
    params,
  });
}

/**
 * 查询广告商详情
 * @param id 广告商ID
 * @returns 广告商详情
 */
export function getAdvertiserApi(id: number): AxiosPromise<AdvertiserVO> {
  return request({
    url: `/advertiser/${id}`,
    method: "get",
  });
}

/**
 * 删除广告商
 * @param id 广告商ID
 * @returns 响应结果
 */
export function deleteAdvertiserApi(id: number): AxiosPromise<void> {
  return request({
    url: `/advertiser/${id}`,
    method: "delete",
  });
}

/**
 * 禁用广告商
 * @param id 广告商ID
 * @returns 响应结果
 */
export function disableAdvertiserApi(id: number): AxiosPromise<void> {
  return request({
    url: `/advertiser/${id}/disable`,
    method: "post",
  });
}

/**
 * 启用广告商
 * @param id 广告商ID
 * @returns 响应结果
 */
export function enableAdvertiserApi(id: number): AxiosPromise<void> {
  return request({
    url: `/advertiser/${id}/enable`,
    method: "post",
  });
}
