enum ResponseStatus {
  success = 100,
  fail
}
class ApiResult{
  status: number
  msg: string
  data: any
  constructor (status: ResponseStatus, msg: string, data: any) {
    this.status = status
    this.msg = msg
    this.data = data
  }
}

export {
  ApiResult,
  ResponseStatus
}