export interface CreateAdvertiserDTO {
  advertiserCode: string;
  advertiserName: string;
  company?: string;
  contactName?: string;
  contactPhone?: string;
  description?: string;
  email?: string;
}

export interface UpdateAdvertiserDTO {
  id: number;
  advertiserCode: string;
  advertiserName: string;
  company?: string;
  contactName?: string;
  contactPhone?: string;
  description?: string;
  email?: string;
  status?: number;
}

export interface AdvertiserVO {
  id: number;
  advertiserCode: string;
  advertiserName: string;
  company: string;
  contactName: string;
  contactPhone: string;
  createTime: string;
  description: string;
  email: string;
  status: number;
  statusName: string;
  updateTime: string;
}

export interface AdvertiserListParams {
  advertiserName?: string;
  beginTime?: string;
  currentPage?: number;
  endTime?: string;
  keyword?: string;
  pageSize?: number;
  status?: number;
}
