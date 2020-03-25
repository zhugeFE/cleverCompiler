import { Request, Response, NextFunction } from "express"
import { ApiResult, ResponseStatus } from "../types/apiResult"
import logger from '../utils/logger';

export default function (req: Request, res: Response, next: NextFunction): void {
  const whiteList = ['/api/user/login', '/api/sys/init']
  if (req.session.currentUser || whiteList.includes(req.path)) {
    logger.info('登录状态检查正常', req.path)
    next()
  } else {
    res.json(new ApiResult(ResponseStatus.notLoggin, null, '系统未登录'))
  }
}