import {Router, Response, Request, NextFunction} from 'express'
import sysService from '../service/sys'
import { ConfigType, Role } from '../types/sys';
import { ApiResult, ResponseStatus } from '../types/apiResult';
const router = Router()

router.post('/init', (req: Request, res: Response, next: NextFunction) => {
  sysService.init(req.body)
  .then(result => {
    res.json(result)
  })
  .catch(next)
})
router.get('/configtypes', (req: Request, res: Response, next: NextFunction) => {
  sysService.queryConfigType()
  .then((list: ConfigType[]) => {
    res.json(new ApiResult(ResponseStatus.success, list))
  })
  .catch(next)
})
router.get('/roles', (req: Request, res: Response, next: NextFunction) => {
  sysService.queryRoles()
  .then((list: Role[]) => {
    res.json(new ApiResult(ResponseStatus.success, list))
  })
  .catch(next)
})
export default router