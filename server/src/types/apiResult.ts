enum ResponseStatus {
  success = 200,
  fail = 500,
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