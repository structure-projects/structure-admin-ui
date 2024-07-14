import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { LoginData, LoginResult } from "./types";

/**
 * 登录API
 *
 * @param data {LoginData}
 * @returns
 */
export function loginApi(data: LoginData): AxiosPromise<LoginResult> {
  if (data.grantType) {
    //这里走的是认证服务
    return request({
      url: "/oauth/token",
      method: "post",
      data: data,
    });
  }else{
    //这里走的是单体服务
    return request({
      url: "/api/user/login",
      method: "post",
      data: data,
    });
  }
}


/**
 * 注销API
 */
export function logoutApi() {
  return request({
    url: "/api/user/logout",
    method: "post",
  });
}
