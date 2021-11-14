/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-10-15 16:04:49
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-14 14:35:00
 */

import {Router, Response, Request, NextFunction} from 'express'
import fsUtil from '../utils/fsUtil'
import * as pt from 'path'
import logger from '../utils/logger'
import { ApiResult, ResponseStatus } from '../types/apiResult'

const router = Router()

router.post('/info', (req: Request, res: Response, next: NextFunction) => {
  const pathName =  req.body.pathName
  const realPathName = __dirname.replace('dist/controller', `www/download/${pathName}`)
  fsUtil.pathExist(realPathName).then( async data=>{
    const childerFile = await fsUtil.readDir(realPathName)
    res.json(new ApiResult(ResponseStatus.success, childerFile))
  }).catch( err =>{
    logger.info(err)
    next
  })
})

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  const filePath = req.params.filePath
  const exist = fsUtil.pathExist(filePath)
  if (exist) {
    res.download(filePath)
    return
  } 
  next
})


export default router