export enum ResponseStatus {
  success = 200,
  fail = 500,
  sysNotInit
}
/**
 * 接口返回json统一结构
 */
export interface ApiResult{
  status: ResponseStatus,
  data: object | null,
  msg?: string
}