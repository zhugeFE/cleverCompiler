/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 16:47:43
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-07 10:13:25
 */
import {Router, Response, Request, NextFunction} from 'express'
import templateService from '../service/template'
import { ApiResult, ResponseStatus } from '../types/apiResult'
import { Template , TemplateInstance} from '../types/template'
const router = Router()

router.post('/add', (req: Request, res: Response, next: NextFunction) => {
  const params = req.body as {
    name: string;
    description: string;
  }
  templateService.add(req.session.currentUser.id, params.name, params.description)
  .then((template: Template) => {
    res.json(new ApiResult(ResponseStatus.success, template))
  })
  .catch(next)
})

router.get('/list', (req: Request, res: Response, next: NextFunction) => {
  templateService.query()
  .then((templateList: TemplateInstance[]) => {
    res.json(new ApiResult(ResponseStatus.success, templateList))
  })
  .catch(err => {
    next(err)
  })
})

export default router