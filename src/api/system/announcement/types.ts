/**
 * 系统公告DTO
 */
export interface AnnouncementDTO {
  /**
   * 内容
   */
  content: string;
  /**
   * 失效时间
   */
  expirationTime?: string;
  /**
   * 作用域: 0 全部，1 app、2 管理端
   */
  scope?: number;
  /**
   * 状态：1正常，2失效
   */
  state?: number;
  /**
   * 主题
   */
  subject: string;
  /**
   * 是否置顶:0否 1是
   */
  top?: boolean;
  /**
   * 类型：1长期、2短期
   */
  type?: number;
}

/**
 * 系统公告查询对象类型
 */
export interface AnnouncementQuery {
  beginTime?: string;
  endTime?: string;
  keyword?: string;
  scope?: number;
  state?: number;
  top?: boolean;
  type?: number;
}

/**
 * 系统公告VO
 */
export interface AnnouncementVO {
  /**
   * 内容
   */
  content: string;
  /**
   * 失效时间
   */
  expirationTime?: string;
  /**
   * 主键ID
   */
  id: number;
  /**
   * 作用域: 1 app、2 管理端
   */
  scope: number;
  /**
   * 状态：1正常，2失效
   */
  state: number;
  /**
   * 主题
   */
  subject: string;
  /**
   * 是否置顶:0否 1是
   */
  top: boolean;
  /**
   * 类型：1长期、2短期
   */
  type: number;
  /**
   * 更新时间
   */
  updateTime: string;
}

/**
 * 移动端系统公告VO
 */
export interface AppAnnouncementVO {
  /**
   * 内容
   */
  content: string;
  /**
   * ID
   */
  id: number;
  /**
   * 主题
   */
  subject: string;
  /**
   * 创建时间
   */
  updateTime: string;
}

/**
 * 系统公告分页结果
 */
export type AnnouncementPageResult = PageResult<AnnouncementVO[]>;

/**
 * 移动端系统公告分页结果
 */
export type AppAnnouncementPageResult = PageResult<AppAnnouncementVO[]>;
