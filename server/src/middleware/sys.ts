import { Request, Response, NextFunction } from "express"
import sysDao from '../dao/sys'
import { ApiResult, ResponseStatus } from "../types/apiResult"
import logger from '../utils/logger';

export default function (req: Request, res: Response, next: NextFunction): void {
  sysDao.getStatus()
  .then(inited => {
    if (!inited && req.path !== '/api/sys/init') {
      res.json(new ApiResult(ResponseStatus.sysNotInit, null, '系统未初始化'))
    } else if (req.path === '/api/sys/init') {
      res.json(new ApiResult(ResponseStatus.sysInited, null, '系统已初始化'))
    } else {
      next()
    }
  })
  .catch(e => {
    logger.error('检查系统状态错误', e)
    const result = new ApiResult(ResponseStatus.fail, null, '检查系统状态错误')
    result.msg = '检查系统状态异常'
    res.json(result)
  })
}