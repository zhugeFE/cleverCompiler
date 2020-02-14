import { ApiResult, ResponseStatus } from "../types/apiResult"
import { User } from '../types/user';
import userDao from "../dao/user";
import logger from '../utils/logger';

const userService = {
  async getCurrent (): Promise<ApiResult> {
    try {
      const user: User = await userDao.getUser('xxx')
      const result = new ApiResult(ResponseStatus.success, user)
      return result
    } catch (e) {
      const result = new ApiResult(ResponseStatus.fail)
      logger.error('获取当前用户信息失败')
      return result
    }
  }
}
export default userService