export interface AdvertisingDTO {
  adName?: string;
  adPlaceCode?: string;
  adType?: number;
  description?: string;
  endTime?: string;
  linkType?: number;
  resourcesUrl?: string;
  sort?: number;
  startTime?: string;
  status?: number;
  targetId?: string;
  targetModuleName?: string;
  targetUrl?: string;
}

export interface AdvertisingVO {
  id: number;
  adName: string;
  adPlaceCode: string;
  adType: number;
  clickCount: number;
  description: string;
  endTime: string;
  linkType: number;
  resourcesUrl: string;
  showCount: number;
  sort: number;
  startTime: string;
  status: number;
  targetId: string;
  targetModuleName: string;
  targetUrl: string;
  updateBy: string;
  updateTime: string;
}

export interface AdvertisingListParams {
  beginTime?: string;
  currentPage?: number;
  endTime?: string;
  keyword?: string;
  pageSize?: number;
  status?: number;
}

// 广告回调记录VO
export interface AdvertisingCallbackVO {
  id: number;
  adId: string;
  advertiserCode: string;
  callbackStatus: number;
  callbackStatusName: string;
  callbackType: number;
  callbackTypeName: string;
  createTime: string;
  description: string;
  ecpm: number;
  ipAddress: string;
  mid: number;
  transactionId: string;
  uid: number;
}

// 广告回调记录列表查询参数
export interface AdvertisingCallbackListParams {
  beginTime?: string;
  currentPage?: number;
  endTime?: string;
  keyword?: string;
  pageSize?: number;
  advertiserCode?: string;
  callbackStatus?: number;
  callbackType?: number;
}
