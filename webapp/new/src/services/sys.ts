import request from '@/utils/request';
import apis from './constants/apis';
export interface InitParam {
  gitHost: string;
  gitToken: string;
  gitSsh: string;
  gitAccount: string;
  email: string;
  password: string;
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