/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 16:47:43
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-01-10 00:07:08
 */
import { ApiResult, ResponseStatus } from "../types/apiResult"
import { User, LoginParam, RegistParam } from '../types/user';
import userDao from "../dao/user";
import logger from '../utils/logger';

const userService = {
  async query (): Promise<User[]> {
    return await userDao.query()
  },
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
  },
  async regist (param: RegistParam): Promise<ApiResult> {
    try {
      await userDao.regist(param)
      return new ApiResult(ResponseStatus.success) 
    } catch (e) {
      return new ApiResult(ResponseStatus.fail, null, '注册失败')
    }
  }
}
export default userService