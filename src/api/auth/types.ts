/**
 * 登录请求参数
 */
export interface LoginData {
  /**
   * 用户名
   */
  username: string;
  /**
   * 密码
   */
  password: string;
  /**
   * 授权类型
   */
  grantType?: string;
  /**
   * 验证码ID
   */
  captchaId?: string;
  /**
   * 验证码
   */
  captcha?: string;
}

/**
 * 验证码响应DTO
 */
export interface CaptchaDTO {
  /**
   * 验证码ID
   */
  captchaId: string;
  /**
   * 验证码图片Base64
   */
  imageBase64: string;
  /**
   * 验证码过期时间（秒）
   */
  expireSeconds: number;
}

/**
 * 登录响应
 */
export interface LoginResult {
  /**
   * 访问token
   */
  accessToken?: string;
  /**
   * 过期时间(单位：毫秒)
   */
  expires?: number;
  /**
   * 刷新token
   */
  refreshToken?: string;
  /**
   * token 类型
   */
  tokenType?: string;
}

