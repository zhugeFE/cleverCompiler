import {Router, Response, Request, NextFunction} from 'express'
import userService from '../service/user';
import { ResponseStatus, ApiResult } from '../types/apiResult';
import { LoginParam } from '../types/user';
import * as Joi from '@hapi/joi'
const router = Router()

router.get('/getCurrent', (req: Request, res: Response, next: NextFunction) => {
  if (req.session.ccu && req.session.ccp) {
    const param: LoginParam = {
      username: req.session.ccu,
      password: req.session.ccp
    }
    userService.login(param)
      .then(data => {
        res.json(data)
      }).catch(next)
  } else {
    res.json(new ApiResult(ResponseStatus.notLoggin, null, '系统未登录'))
  }
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