import { ApiResult, ResponseStatus } from "../types/apiResult"
import sysDao from '../dao/sys'
import logger from "../utils/logger"
import { SysInfo, ConfigType, Role } from '../types/sys';

class SysService {
  async init (param: SysInfo): Promise<ApiResult> {
    try{
      await sysDao.init(param)
      return new ApiResult(ResponseStatus.success)
    } catch (e) {
      const res = new ApiResult(ResponseStatus.fail, null, '系统初始化失败')
      logger.error('系统初始化失败', e)
      return res
    }
  }
  async queryConfigType (): Promise<ConfigType[]> {
    return await sysDao.queryConfigType()
  }
  async queryRoles (): Promise<Role[]> {
    return await sysDao.queryRole()
  }
}

export default new SysService()