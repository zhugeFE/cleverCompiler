import { Request, Response, NextFunction } from "express"
import sysDao from '../dao/sys'
import { ApiResult, ResponseStatus } from "../types/apiResult"
import logger from '../utils/logger';

export default function (req: Request, res: Response, next: NextFunction): void {
  sysDao.getStatus()
  .then(inited => {
    if (!inited) {
      res.json(new ApiResult(ResponseStatus.sysNotInit))
    } else {
      next()
    }
  })
  .catch(e => {
    logger.error('检查系统状态错误', e)
    const result = new ApiResult(ResponseStatus.fail)
    result.msg = '检查系统状态异常'
    res.json(result)
  })
}