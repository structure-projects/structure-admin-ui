/**
 * 配置查询参数
 */
export interface ConfigQuery {
  keywords?: string;
}

/**
 * 配置对象
 */
export interface Config {
  /**
   * 	配置ID
   */
  id?: number;
  /**
   * 当前系统配置KEY
   */
  key?: string;

  /**
   * 当前系统配置value
   */
  value?: string;
  /**
  * 配置描述
  */
  remark?: string;
}

/**
 * 配置分页VO对象
 */
export type ConfigPageResult = PageResult<Config[]>;
