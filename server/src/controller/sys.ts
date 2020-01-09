import {Router, Response, Request} from 'express'
import sysService from '../service/sys'
import errorHandle from '../middleware/errorHandle'
const router = Router()

router.post('/init', (req: Request, res: Response) => {
  sysService.init(req.body)
  .then(result => {
    res.json(result)
  })
  .catch(e => {
    errorHandle(e, req, res)
  })
})
export default router