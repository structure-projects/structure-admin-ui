/**
 * 成员查询参数
 */
export interface MemberQuery {
  keywords?: string;
  deptId?: number,
  state?: number,
}

/**
 * 成员对象
 */
export interface Member {
  /**
   * 	成员ID
   */
  id?: number;

  /**
   * 	部门id
   */
  deptId?: number;

  /**
   * 部门名词
   */
  deptName ?: string;

  /**
  * 	姓名
  */
  name?: string;

  /**
  * 	手机号
  */
  phone?: string;
  /**
  * 	性别
  */
  sex?: string;

  /**
  * 	成员状态
  */
  state?: number;

  /**
   * 角色ID
   */
  roleIds?: number[];

  /**
   * 创建时间
   */
  createTime?: Date;
}

/**
 * 成员分页VO对象
 */
export type MemberPageResult = PageResult<Member[]>;
