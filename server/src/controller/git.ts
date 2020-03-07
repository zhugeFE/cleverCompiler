import { Router, Response, Request, NextFunction } from 'express'
import gitService from '../service/git'
const router = Router()

router.post('/list', (req: Request, res: Response, next: NextFunction) => {
  gitService.query()
})
export default router