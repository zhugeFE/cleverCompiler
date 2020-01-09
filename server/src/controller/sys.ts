import {Router, Response, Request, NextFunction} from 'express'
import sysService from '../service/sys'
const router = Router()

router.post('/init', (req: Request, res: Response, next: NextFunction) => {
  sysService.init(req.body)
  .then(result => {
    res.json(result)
  })
  .catch(next)
})
export default router