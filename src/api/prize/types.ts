export interface SenderPrizeVO {
  auto: boolean;
  channelTransaction: string;
  channelType: number;
  description: string;
  failReason: string;
  id: number;
  mid: number;
  prizeCode: string;
  prizeId: string;
  prizeName: string;
  prizeNumber: number;
  receiveTime: string;
  sendStatus: number;
  sendTime: string;
  sourceChannel: string;
  sourceDescription: string;
  sourceId: string;
  type: number;
}

export interface SendRecordParams {
  beginTime?: string;
  endTime?: string;
  keyword?: string;
  state?: number;
  type?: number;
}

export type SenderPrizePageResult = PageResult<SenderPrizeVO[]>;
