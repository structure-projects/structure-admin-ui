import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { useUserStoreHook } from "@/store/modules/user";

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000,
  headers: { "Content-Type": "application/json;charset=utf-8" ,
    "X-ORGANIZATION_ID":1
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = accessToken;
    }
    return config;
  },
  (error: any) => {
    console.log(error)
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, msg, message, success } = response.data;
    const errorMsg = msg || message || "系统出错";
    
    if (response.data instanceof ArrayBuffer) {
      return response;
    }

    if (success === true || response.data.code === undefined) {
      return response.data;
    }

    ElMessage.error(errorMsg);
    return Promise.reject(new Error(errorMsg));
  },
  (error: any) => {
    let errorMsg = "系统出错";
    
    if (error.response) {
      const { data } = error.response;
      if (data) {
        const { code, msg, message } = data;
        errorMsg = msg || message || errorMsg;
        
        if (code === "INVALID_AUTHENTICATION" || code === "NOT_LOGGED_IN") {
          ElMessageBox.confirm("当前页面已失效，请重新登录", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            const userStore = useUserStoreHook();
            userStore.resetToken().then(() => {
              location.reload();
            });
          });
          return Promise.reject(new Error("认证失效"));
        }
      }
    } else if (error.message) {
      errorMsg = error.message;
    }

    ElMessage.error(errorMsg);
    return Promise.reject(new Error(errorMsg));
  }
);

// 导出 axios 实例
export default service;
