import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { OperationRecordQuery, OperationRecordVO } from "./types";

/**
 * 查询操作记录
 * @param queryParams 查询参数
 * @returns 分页结果
 */
export function getOperationRecordApi(queryParams?: PageQuery<OperationRecordQuery>): AxiosPromise<PageResult<OperationRecordVO[]>> {
  return request({
    url: "/api/operation-record/list",
    method: "get",
    params: {
      ...queryParams?.params,
      currentPage: queryParams?.page,
      pageSize: queryParams?.pageSize
    }
  });
}
