import request from "@/utils/request";
import { AxiosPromise } from "axios";
import {  SendRecordParams, SenderPrizePageResult } from "./types";

/**
 * 查询奖品发放记录
 * @param params 查询参数
 * @returns 分页结果
 */
export function getSendRecordApi(params: PageQuery<SendRecordParams>): AxiosPromise<SenderPrizePageResult> {
  return request({
    url: "/prize/sendRecord",
    method: "get",
    params: {
      ...params?.params,
      currentPage: params?.page,
      pageSize: params?.pageSize
    },
  });
}
