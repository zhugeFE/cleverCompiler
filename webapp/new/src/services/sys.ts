import request from '@/utils/request';
import apis from './constants/apis';

export interface InitParam {
  account: string
  email: string
  host: string
  password: string
  rePassword: string
  sshToken: string
  token: string
}

class SysService {
  async init(data: InitParam) {
    return request(apis.sys.init, {
      method: 'post',
      data
    })
  }
}

const sysService = new SysService()
export default sysService