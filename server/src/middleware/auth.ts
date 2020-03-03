import { Request, Response, NextFunction } from "express"
import { ApiResult, ResponseStatus } from "../types/apiResult"

export default function (req: Request, res: Response, next: NextFunction): void {
  if (req.session.ccu && req.session.ccp) {
    next()
  } else {
    res.json(new ApiResult(ResponseStatus.notLoggin, null, '系统未登录'))
  }
}