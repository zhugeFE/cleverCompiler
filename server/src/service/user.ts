/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 16:47:43
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-09-03 22:51:17
 */
import { ApiResult, ResponseStatus } from "../types/apiResult"
import { User, LoginParam } from '../types/user';
import userDao from "../dao/user";
import logger from '../utils/logger';

const userService = {
  async login (param: LoginParam): Promise<ApiResult> {
    try {
      const users: User[] = await userDao.login(param)
      if (users.length) {
        return new ApiResult(ResponseStatus.success, users[0])
      } else {
        return new ApiResult(ResponseStatus.fail, null, '用户名或密码错误')
      }
    } catch (e) {
      const result = new ApiResult(ResponseStatus.fail, null, '用户名或密码错误')
      logger.error('登录失败', param)
      return result
    }
  }
}
export default userService