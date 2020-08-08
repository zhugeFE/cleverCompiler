import {Router, Response, Request, NextFunction} from 'express'
import templateService from '../service/template'
import { ApiResult, ResponseStatus } from '../types/apiResult'
import { Template } from '../types/template'
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

router.get('/query', (req: Request, res: Response, next: NextFunction) => {
  templateService.query()
  .then(list => {
    res.json(new ApiResult(ResponseStatus.success, list))
  })
  .catch(next)
})

export default router