export interface OperationRecordVO {
  action: string;
  costTime: number;
  errorMsg: string;
  id: number;
  ipAddress: string;
  mid: number;
  module: number;
  operationParams: string;
  operationResult: string;
  operationTime: string;
  operationUser: string;
  status: number;
  userAgent: string;
}

export interface OperationRecordQuery {
  action?: string;
  beginTime?: string;
  endTime?: string;
  keyword?: string;
  module?: number;
  startTime?: string;
  status?: number;
}

