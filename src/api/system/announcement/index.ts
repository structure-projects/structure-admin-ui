import request from "@/utils/request";
import { AxiosPromise } from "axios";
import {
  AnnouncementDTO,
  AnnouncementQuery,
  AnnouncementVO,
  AnnouncementPageResult,
  AppAnnouncementPageResult
} from "./types";

/**
 * 添加系统公告
 *
 * @param data
 */
export function addAnnouncement(data: AnnouncementDTO): AxiosPromise<number> {
  return request({
    url: "/api/announcement/",
    method: "post",
    data: data
  });
}

/**
 * 查询系统公告列表
 *
 * @param queryParams
 */
export function getAnnouncementList(
  queryParams?: PageQuery<AnnouncementQuery>
): AxiosPromise<AnnouncementPageResult> {
  return request({
    url: "/api/announcement/list",
    method: "get",
    params: {
      ...queryParams?.params,
      currentPage: queryParams?.page,
      pageSize: queryParams?.pageSize
    }
  });
}

/**
 * 根据系统类型，查询系统公告列表
 *
 * @param queryParams
 */
export function getAnnouncementListByScope(
  queryParams?: PageQuery<AnnouncementQuery>
): AxiosPromise<AppAnnouncementPageResult> {
  return request({
    url: "/api/announcement/listByScope",
    method: "get",
    params: {
      ...queryParams?.params,
      currentPage: queryParams?.page,
      pageSize: queryParams?.pageSize
    }
  });
}

/**
 * 查询系统公告详情
 *
 * @param id
 */
export function getAnnouncementById(id: number): AxiosPromise<AnnouncementVO> {
  return request({
    url: "/api/announcement/" + id,
    method: "get"
  });
}

/**
 * 修改系统公告
 *
 * @param id
 * @param data
 */
export function updateAnnouncement(id: number, data: AnnouncementDTO): AxiosPromise<void> {
  return request({
    url: "/api/announcement/" + id,
    method: "put",
    data: data
  });
}

/**
 * 删除系统公告
 *
 * @param ids 系统公告ID，多个以英文逗号(,)分割
 */
export function deleteAnnouncement(ids: string): AxiosPromise<void> {
  return request({
    url: "/api/announcement/" + ids,
    method: "delete"
  });
}
