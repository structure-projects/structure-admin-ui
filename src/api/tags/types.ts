/**
 * 角色表单对象
 */
export interface TagDto {
    /**
     * 角色ID
     */
    id: number;
  
    /**
     * 角色编码
     */
    tag?: string;
}

export type TagResult = TagDto[];