import request from '@/utils/request';
import apis from './constants/apis';

export interface LoginParam {
  username: string;
  password: string;
}

class UserServices {
  async login (data: LoginParam) {
    return request(apis.user.login, {
      data,
      method: 'post'
    })
  }
  
  async getCurrent () {
    return request(apis.user.getCurrent)
  }
}

const userService = new UserServices()
export default userService