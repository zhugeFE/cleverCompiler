import { ApiResult, ResponseStatus } from "../types/apiResult"
import sysDao from '../dao/sys'

const service = {
  async getStatus (): Promise<any> {
    const inited = await sysDao.getStatus()
    return new ApiResult(ResponseStatus.success, {
      inited
    })
  }
}

export default service