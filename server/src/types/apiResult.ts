enum ResponseStatus {
  success = 200,
  fail = 500,
  sysNotInit,
  sysInited
}
/**
 * 接口返回json统一结构
 */
class ApiResult{
  status: ResponseStatus
  data: object | null
  msg?: string
  constructor (status: ResponseStatus, data?: object | null, message?: string) {
    this.status = status
    this.data = data
    this.msg = message
  }
}
export {
  ApiResult,
  ResponseStatus
}