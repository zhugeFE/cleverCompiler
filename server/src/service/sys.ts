import { ApiResult, ResponseStatus } from "../types/apiResult"
import sysDao from '../dao/sys'
import logger from "../utils/logger"

interface SysStatus{
  inited: boolean;
}
const service = {
  async init (param: InitParam): Promise<ApiResult> {
    try{
      await sysDao.init(param)
      return new ApiResult(ResponseStatus.success)
    } catch (e) {
      const res = new ApiResult(ResponseStatus.fail)
      logger.error('系统初始化失败', e)
      return res
    }
  }
}

export default service