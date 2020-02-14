import {Router, Response, Request, NextFunction} from 'express'
import userService from '../service/user';
const router = Router()

router.get('/getCurrent', (req: Request, res: Response, next: NextFunction) => {
  userService.getCurrent()
  .then(data => {
    res.json(data)
  }).catch(next)
})
export default router