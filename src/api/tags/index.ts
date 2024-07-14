import { TagDto, TagResult } from "./types";
import request from "@/utils/request";
import { AxiosPromise } from "axios";

export function getUserTags(): AxiosPromise<TagResult> {
    return request({
        url: "/api/user-tags/get",
        method: "get"
    });
}

export function addUserTags(data: Object) {
    return request({
        url: "/api/user-tags/",
        method: "post",
        data: data
    });
}

export function delUserTags(id: number) {
    return request({
        url: "/api/user-tags/" + id,
        method: "delete",
        data: {}
    });
}