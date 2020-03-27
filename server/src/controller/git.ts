import { Router, Response, Request, NextFunction } from 'express'
import gitService from '../service/git'
import { ApiResult, ResponseStatus } from '../types/apiResult'
import { GitInstance, GitInfo } from '../types/git';
const router = Router()

router.post('/list', (req: Request, res: Response, next: NextFunction) => {
  gitService.query()
  .then((gitList: GitInstance[]) => {
    res.json(new ApiResult(ResponseStatus.success, gitList))
  })
  .catch(err => {
    next(err)
  })
})
router.get('/info/:id', (req: Request, res: Response, next: NextFunction) => {
  gitService.getInfoById(req.params.id)
  .then((gitInfo: GitInfo) => {
    if (!gitInfo) {
      res.json(new ApiResult(ResponseStatus.fail, null, '数据不存在'))
    } else {
      res.json(new ApiResult(ResponseStatus.success, gitInfo))
    }
  }).catch(next)
})
export default router