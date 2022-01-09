/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-01-04 14:50:02
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-01-10 00:08:12
 */
import request from '@/utils/request';
import apis from './constants/apis';

export interface LoginParam {
  username: string;
  password: string;
}

export interface RegistParam {
  username: string;
  password: string;
  email: string;
}
class UserServices {
  async list () {
    return request(apis.user.list)
  }
  async login (data: LoginParam) {
    return request(apis.user.login, {
      data,
      method: 'post'
    })
  }

  async regist (data: RegistParam) {
    return request(apis.user.regist, {
      data,
      method: 'post'
    })
  }

 async checkName( name: string) {
   return request(apis.user.checkName, {
     data: {
       name
     },
     method: 'post'
   })
 }
  
  async getCurrent () {
    return request(apis.user.getCurrent)
  }
}

const userService = new UserServices()
export default userService