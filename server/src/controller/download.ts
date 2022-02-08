/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-10-15 16:04:49
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-23 16:52:23
 */
import * as path from "path";
import config from "../config";
import { NextFunction } from 'express';
import {Router, Response, Request} from 'express'
import fsUtil from '../utils/fsUtil'
import { ApiResult, ResponseStatus } from '../types/apiResult'

const router = Router()

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  const filePath = req.query.filePath
  const workDir =  path.resolve(config.compileDir, req.session.currentUser.id)
  const realPathName = path.resolve(workDir, `${filePath}.tar.gz`)
  try {
    fsUtil.pathExist(realPathName)
    .then ( (exist: boolean) => {
      if (exist) {
        res.download(realPathName)
        return
      } 
      res.json(new ApiResult(ResponseStatus.fail, "文件不存在"))
    })
  } catch (err) {
    next()
  }
  
})


export default router