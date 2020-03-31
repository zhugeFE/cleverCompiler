import axios, { Method } from 'axios'
import sysDao from '../dao/sys'
import logger from './logger';

class GitUtil {
  async ajax<T> (path: string, method: Method, params?: object): Promise<T> {
    const sysInfo = await sysDao.getSysInfo()
    const url = `api/v3/${path}`
    logger.info('gitAPI请求', url)
    const res = await axios({
      url,
      method,
      baseURL: sysInfo.gitHost,
      headers: {
        'PRIVATE-TOKEN': sysInfo.gitToken
      },
      [method.toLowerCase() === 'post' ? 'data' : 'params']: params
    }) as {
      data: T;
    }
    return res.data
  }
}
export default new GitUtil()