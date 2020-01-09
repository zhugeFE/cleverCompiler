import { Response, Request } from "express";
import { ApiResult, ResponseStatus } from "../types/apiResult";
import logger from '../utils/logger';

export default function (err: Error, req: Request, res: Response): void {
  logger.error(err)
  const result = new ApiResult(ResponseStatus.fail)
  result.msg = err.message
  res.json(result)
}