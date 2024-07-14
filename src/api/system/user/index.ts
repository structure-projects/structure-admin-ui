import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { UserInfo,UserDetail } from "./types";

/**
 * 登录成功后获取用户信息（昵称、头像、权限集合和角色集合）
 */
export function getUserInfoApi(): AxiosPromise<UserInfo> {
  return request({
    url: "/api/users/current",
    method: "get",
  });
}

export function getUserDetailApi(): AxiosPromise<UserDetail> {
  return request({
    url: "/api/users/currentUserDetail",
    method: "get",
  });
}


export function changeCurrent(data : UserDetail) {
  return request({
    url: "/api/users/changeCurrent",
    method: "put",
    data: data
  });
}
