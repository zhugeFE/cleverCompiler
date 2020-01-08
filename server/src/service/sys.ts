import { ApiResult, ResponseStatus } from "../types/apiResult"

const service = {
  checkStatus (): ApiResult {
    return new ApiResult(ResponseStatus.success, '', null)
  }
}

export default service