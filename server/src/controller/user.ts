/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-01-04 14:50:02
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-01-10 10:16:33
 */
import {Router, Response, Request, NextFunction} from 'express'
import userService from '../service/user';
import { ResponseStatus, ApiResult } from '../types/apiResult';
import { LoginParam, RegistParam, User } from '../types/user';
import * as Joi from '@hapi/joi'
import { RoleType } from '../constants';
const router = Router()


router.get('/list', (req: Request, res: Response, next: NextFunction) => {  
  if (req.session.currentUser.roleId === RoleType.admin) {
    userService.query()
    .then ( (data: User[]) => {
      res.json( new ApiResult(ResponseStatus.success, data))
    })
    .catch (next)
  } else {
    res.json( new ApiResult(ResponseStatus.fail, null, "权限不够"))
  }
})

router.get('/getCurrent', (req: Request, res: Response) => {
  if (req.session.currentUser) {
    res.json(new ApiResult(ResponseStatus.success, req.session.currentUser))
  } else {
    res.json(new ApiResult(ResponseStatus.notLoggin, null, '系统未登录'))
  }
})
router.post('/regist', (req: Request, res: Response, next: NextFunction) => {
  const param: RegistParam = req.body
  const validation: Joi.ValidationResult = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().required()
  }).validate(param)
  if (validation.error) {
    res.json(new ApiResult(ResponseStatus.paramError, null, '参数错误'))
    return
  }
  userService.regist(param)
    .then(result => {
      res.json(result)
    }).catch(next)
})


router.post('/checkName', (req: Request, res: Response, next: NextFunction) => {
  const username: string = req.body.username
  if (!username) {
    res.json(new ApiResult(ResponseStatus.fail, null, '用户名不能为空'))
    return
  }
  userService.checkName(username)
  .then( (data: boolean) => {
    res.json( new ApiResult(ResponseStatus.success, {result:data}))
  })
  .catch(next) 
})
router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  const param: LoginParam = req.body
  const validation: Joi.ValidationResult = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  }).validate(param)
  if (validation.error) {
    res.json(new ApiResult(ResponseStatus.paramError, null, '参数错误'))
    return
  }
  userService.login(param)
    .then(result => {
      if (result.status === ResponseStatus.success) {
        req.session.currentUser = result.data
      }
      res.json(result)
    }).catch(next)
})
export default router