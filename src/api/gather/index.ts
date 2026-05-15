import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { RecycleRecordQuery, RecycleRecordVO } from './types';

/**
 * 查询回收记录列表
 * @param queryParams 查询参数
 * @returns 分页结果
 */
export function queryRecycleRecord(queryParams?: RecycleRecordQuery): AxiosPromise<any> {
  return request({
    url: '/gather/queryRecycleRecord',
    method: 'get',
    params: queryParams
  });
}

/**
 * 查询回收记录详情
 * @param recycleRecordId 回收记录ID
 * @returns 回收记录详情
 */
export function queryRecycleRecordDetail(recycleRecordId: number): AxiosPromise<RecycleRecordVO> {
  return request({
    url: `/gather/queryRecycleRecordDatil/${recycleRecordId}`,
    method: 'get'
  });
}
