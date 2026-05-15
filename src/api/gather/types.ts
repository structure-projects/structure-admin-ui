import { AxiosPromise } from 'axios';

/**
 * 分页查询参数
 */
export interface PageQuery {
  page?: number;
  pageSize?: number;
  currentPage?: number;
  beginTime?: string;
  endTime?: string;
  keyword?: string;
}

/**
 * 分页响应对象
 */
export interface PageResult<T> {
  /** 数据列表 */
  records: T[];
  /** 总数 */
  total: number;
  /** 当前页 */
  current: number;
  /** 每页数量 */
  size: number;
  /** 总页数 */
  pages: number;
}

/**
 * 回收记录查询参数
 */
export interface RecycleRecordQuery extends PageQuery {
  beginTime?: string;
  endTime?: string;
  keyword?: string;
}

/**
 * 采集记录VO
 */
export interface GatherRecordVO {
  baseNumber: number;
  beginTime: string;
  complete: boolean;
  endTime: string;
  gatherRecordId: number;
  mid: number;
  multiple: number;
  progress: number;
  propIds: any[];
  recycle: boolean;
  score: number;
  showScore: number;
  uid: number;
  upperLimit: number;
}

/**
 * 回收记录VO
 */
export interface RecycleRecordVO {
  beginTime: string;
  complete: boolean;
  endTime: string;
  gatherRecordId: number;
  gatherRecordVOList: GatherRecordVO[];
  mid: number;
  recycle: boolean;
  score: number;
  showScore: string;
  sourceDescription: string;
  uid: number;
}

/**
 * 回收记录分页结果
 */
export type RecycleRecordPageResult = PageResult<RecycleRecordVO>;
