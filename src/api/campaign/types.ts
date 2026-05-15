// 活动分类相关类型
export interface CreateCampaignCategoryDTO {
  code: string;
  description?: string;
  name: string;
}

export interface UpdateCampaignCategoryDTO {
  code?: string;
  description?: string;
  id: number;
  name?: string;
}

export interface CampaignCategoryVO {
  code: string;
  createTime: string;
  description: string;
  id: number;
  name: string;
  updateTime: string;
}

// 活动模板相关类型
export interface CreateCampaignTemplateDTO {
  config?: string;
  cycle?: number;
  cycleUnit?: number;
  description?: string;
  name: string;
  type: number;
}

export interface UpdateCampaignTemplateDTO {
  config?: string;
  cycle?: number;
  cycleUnit?: number;
  description?: string;
  id: number;
  name?: string;
  status?: number;
  type?: number;
}

export interface CampaignTemplateVO {
  code: string;
  config: string;
  createTime: string;
  cycle: number;
  cycleUnit: number;
  description: string;
  id: number;
  name: string;
  status: number;
  type: number;
  updateTime: string;
}

// 活动计划相关类型
export interface CreateCampaignPlanDTO {
  beginTime?: string;
  categoryId: number;
  cycle?: number;
  cycleUnit?: number;
  description?: string;
  endTime: string;
  name: string;
  startTime: string;
  status?: number;
  templateId: number;
  type: number;
}

export interface UpdateCampaignPlanDTO {
  beginTime?: string;
  categoryId?: number;
  cycle?: number;
  cycleUnit?: number;
  description?: string;
  endTime?: string;
  id: number;
  name?: string;
  startTime?: string;
  status?: number;
  templateId?: number;
  type?: number;
}

export interface CampaignPlanVO {
  beginTime?: string;
  categoryId: number;
  categoryName: string;
  cycle?: number;
  cycleUnit?: number;
  createTime: string;
  description: string;
  endTime: string;
  id: number;
  name: string;
  startTime: string;
  status: number;
  templateId: number;
  templateName: string;
  type?: number;
  updateTime: string;
}

export interface CampaignPlanListParams {
  beginTime?: string;
  categoryId?: number;
  currentPage?: number;
  endTime?: string;
  keyword?: string;
  pageSize?: number;
  status?: number;
}

// 活动执行记录相关类型
export interface CampaignExecutionRecordVO {
  campaignName: string;
  endTime: string;
  executionId: number;
  executionParams: string;
  executionResult: string;
  executionStatus: number;
  executionTime: string;
  planId: number;
  startTime: string;
}

export interface CampaignExecutionRecordListParams {
  beginTime?: string;
  categoryId?: number;
  campaignPlanId?: number;
  currentPage?: number;
  endTime?: string;
  keyword?: string;
  pageSize?: number;
  status?: number;
}

export type CampaignCategoryResult = CampaignCategoryVO[];