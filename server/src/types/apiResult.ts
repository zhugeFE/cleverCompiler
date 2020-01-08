enum ResponseStatus {
  success = 200,
  fail = 500,
}
class ApiResult{
  status: number
  data: any
  constructor (status: ResponseStatus, data: object) {
    this.status = status
    this.data = data
  }
}

export {
  ApiResult,
  ResponseStatus
}