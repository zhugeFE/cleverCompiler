/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-10-15 16:04:49
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-14 14:43:44
 */

import {Router, Response, Request} from 'express'
import fsUtil from '../utils/fsUtil'
import { ApiResult, ResponseStatus } from '../types/apiResult'

const router = Router()

router.post('/info', (req: Request, res: Response) => {
  const pathName =  req.body.pathName

  const realPathName = __dirname.replace('dist/controller', `www/download/${pathName}`)
  fsUtil.pathExist(realPathName)
  .then( async (exist: boolean) => {
    if (exist) {
      const childerFile = await fsUtil.readDir(realPathName)
      res.json(new ApiResult(ResponseStatus.success, childerFile))
      return
    }
    res.json(new ApiResult(ResponseStatus.fail, "文件不存在"))
  } )
})

router.get('/', (req: Request, res: Response) => {
  const filePath = req.params.filePath

  fsUtil.pathExist(filePath)
  .then ( (exist: boolean) => {
    if (exist) {
      res.download(filePath)
      return
    } 
    res.json(new ApiResult(ResponseStatus.fail, "文件不存在"))
  })
})


export default router