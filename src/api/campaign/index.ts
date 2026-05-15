import request from "@/utils/request";
import { AxiosPromise } from "axios";
import {
  CampaignCategoryVO,
  CreateCampaignCategoryDTO,
  UpdateCampaignCategoryDTO,
  CampaignTemplateVO,
  CreateCampaignTemplateDTO,
  UpdateCampaignTemplateDTO,
  CampaignPlanVO,
  CreateCampaignPlanDTO,
  UpdateCampaignPlanDTO,
  CampaignPlanListParams,
  CampaignExecutionRecordVO,
  CampaignExecutionRecordListParams,
  CampaignCategoryResult
} from "./types";

// 活动分类相关API

/**
 * 创建活动分类
 * @param data 创建活动分类DTO
 * @returns 活动分类VO
 */
export function createCampaignCategoryApi(data: CreateCampaignCategoryDTO): AxiosPromise<CampaignCategoryVO> {
  return request({
    url: "/campaign/category/create",
    method: "post",
    data,
  });
}

/**
 * 删除活动分类
 * @param id 活动分类ID
 * @returns 成功状态
 */
export function deleteCampaignCategoryApi(id: number): AxiosPromise<void> {
  return request({
    url: `/campaign/category/delete/${id}`,
    method: "delete",
  });
}

/**
 * 查询活动分类详情
 * @param id 活动分类ID
 * @returns 活动分类VO
 */
export function getCampaignCategoryDetailApi(id: number): AxiosPromise<CampaignCategoryVO> {
  return request({
    url: `/campaign/category/detail/${id}`,
    method: "get",
  });
}

/**
 * 查询所有活动分类
 * @returns 活动分类列表
 */
export function getAllCampaignCategoriesApi(): AxiosPromise<CampaignCategoryResult> {
  return request({
    url: "/campaign/category/list",
    method: "get",
  });
}

/**
 * 更新活动分类
 * @param data 更新活动分类DTO
 * @returns 活动分类VO
 */
export function updateCampaignCategoryApi(data: UpdateCampaignCategoryDTO): AxiosPromise<CampaignCategoryVO> {
  return request({
    url: "/campaign/category/update",
    method: "post",
    data,
  });
}

// 活动模板相关API

/**
 * 创建活动模板
 * @param data 创建活动模板DTO
 * @returns 活动模板VO
 */
export function createCampaignTemplateApi(data: CreateCampaignTemplateDTO): AxiosPromise<CampaignTemplateVO> {
  return request({
    url: "/campaign/template/create",
    method: "post",
    data,
  });
}

/**
 * 删除活动模板
 * @param id 活动模板ID
 * @returns 成功状态
 */
export function deleteCampaignTemplateApi(id: number): AxiosPromise<void> {
  return request({
    url: `/campaign/template/delete/${id}`,
    method: "delete",
  });
}

/**
 * 查询活动模板详情
 * @param id 活动模板ID
 * @returns 活动模板VO
 */
export function getCampaignTemplateDetailApi(id: number): AxiosPromise<CampaignTemplateVO> {
  return request({
    url: `/campaign/template/detail/${id}`,
    method: "get",
  });
}

/**
 * 查询所有启用的活动模板
 * @returns 活动模板列表
 */
export function getEnabledCampaignTemplatesApi(): AxiosPromise<CampaignTemplateVO[]> {
  return request({
    url: "/campaign/template/enabled",
    method: "get",
  });
}

/**
 * 查询所有活动模板
 * @param params 分页参数
 * @returns 分页结果
 */
export function getAllCampaignTemplatesApi(params: {
  page?: number;
  pageSize?: number;
}): AxiosPromise<{
  current: number;
  pages: number;
  records: CampaignTemplateVO[];
  size: number;
  total: number;
}> {
  return request({
    url: "/campaign/template/list",
    method: "get",
    params: {
      currentPage: params.page,
      pageSize: params.pageSize
    }
  });
}

/**
 * 更新活动模板
 * @param data 更新活动模板DTO
 * @returns 活动模板VO
 */
export function updateCampaignTemplateApi(data: UpdateCampaignTemplateDTO): AxiosPromise<CampaignTemplateVO> {
  return request({
    url: "/campaign/template/update",
    method: "post",
    data,
  });
}

// 活动计划相关API

/**
 * 创建活动计划
 * @param data 创建活动计划DTO
 * @returns 活动计划VO
 */
export function createCampaignPlanApi(data: CreateCampaignPlanDTO): AxiosPromise<CampaignPlanVO> {
  return request({
    url: "/campaign/plan/create",
    method: "post",
    data,
  });
}

/**
 * 删除活动计划
 * @param id 活动计划ID
 * @returns 成功状态
 */
export function deleteCampaignPlanApi(id: number): AxiosPromise<void> {
  return request({
    url: `/campaign/plan/delete/${id}`,
    method: "delete",
  });
}

/**
 * 查询活动计划详情
 * @param id 活动计划ID
 * @returns 活动计划VO
 */
export function getCampaignPlanDetailApi(id: number): AxiosPromise<CampaignPlanVO> {
  return request({
    url: `/campaign/plan/detail/${id}`,
    method: "get",
  });
}

/**
 * 查询活动计划列表
 * @param params 查询参数
 * @returns 分页结果
 */
export function getCampaignPlanListApi(params: CampaignPlanListParams): AxiosPromise<{
  current: number;
  pages: number;
  records: CampaignPlanVO[];
  size: number;
  total: number;
}> {
  return request({
    url: "/campaign/plan/list",
    method: "get",
    params,
  });
}

/**
 * 更新活动计划
 * @param data 更新活动计划DTO
 * @returns 活动计划VO
 */
export function updateCampaignPlanApi(data: UpdateCampaignPlanDTO): AxiosPromise<CampaignPlanVO> {
  return request({
    url: "/campaign/plan/update",
    method: "post",
    data,
  });
}

/**
 * 启动活动计划
 * @param id 活动计划ID
 * @returns 成功状态
 */
export function startCampaignPlanApi(id: number): AxiosPromise<void> {
  return request({
    url: `/campaign/plan/start/${id}`,
    method: "post",
  });
}

/**
 * 结束活动计划
 * @param id 活动计划ID
 * @returns 成功状态
 */
export function endCampaignPlanApi(id: number): AxiosPromise<void> {
  return request({
    url: `/campaign/plan/end/${id}`,
    method: "post",
  });
}

/**
 * 取消活动计划
 * @param id 活动计划ID
 * @returns 成功状态
 */
export function cancelCampaignPlanApi(id: number): AxiosPromise<void> {
  return request({
    url: `/campaign/plan/cancel/${id}`,
    method: "post",
  });
}

// 活动记录相关API

/**
 * 查询活动记录列表
 * @param params 查询参数
 * @returns 分页结果
 */
export function getCampaignRecordListApi(params: CampaignExecutionRecordListParams): AxiosPromise<{
  current: number;
  pages: number;
  records: CampaignExecutionRecordVO[];
  size: number;
  total: number;
}> {
  return request({
    url: "/campaign-record/list",
    method: "get",
    params,
  });
}

/**
 * 查询活动记录详情
 * @param id 活动记录ID
 * @returns 活动记录详情
 */
export function getCampaignRecordDetailApi(id: number): AxiosPromise<CampaignExecutionRecordVO> {
  return request({
    url: `/campaign-record/detail/${id}`,
    method: "get",
  });
}
