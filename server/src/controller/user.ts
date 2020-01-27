import {Router, Response, Request, NextFunction} from 'express'
const router = Router()

router.post('/getCurrent', (req: Request, res: Response, next: NextFunction) => {
  res.send('....get current user')
})
export default router