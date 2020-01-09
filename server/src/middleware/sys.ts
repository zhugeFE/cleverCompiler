import { Request, Response, NextFunction } from "express"
import sysDao from '../dao/sys'
import { ApiResult, ResponseStatus } from "../types/apiResult"

export default async function (req: Request, res: Response, next: NextFunction): Promise<void> {
  const inited = await sysDao.getStatus()
  if (!inited) {
    res.json(new ApiResult(ResponseStatus.sysNotInit))
  } else {
    next()
  }
}