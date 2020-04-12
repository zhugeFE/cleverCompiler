import { Router, Response, Request, NextFunction } from 'express'
import gitService from '../service/git'
import { ApiResult, ResponseStatus } from '../types/apiResult'
import { GitInstance, GitInfo, GitBranch, GitTag, GitCommit, GitCreateVersionParam, GitVersion } from '../types/git';
import { DirNode } from '../types/common';
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
router.get('/:id/info', (req: Request, res: Response, next: NextFunction) => {
  gitService.getInfoById(req.params.id)
  .then((gitInfo: GitInfo) => {
    if (!gitInfo) {
      res.json(new ApiResult(ResponseStatus.fail, null, '数据不存在'))
    } else {
      res.json(new ApiResult(ResponseStatus.success, gitInfo))
    }
  }).catch(() => {
    const err = new Error()
    err.message = '获取git详情失败'
    next(err)
  })
})
router.get('/:id/branchs', (req: Request, res: Response, next: NextFunction) => {
  gitService.getBranchsById(req.params.id)
  .then((branchList: GitBranch[]) => {
    res.json(new ApiResult(ResponseStatus.success, branchList))
  })
  .catch(next)
})
router.get('/:id/tags', (req: Request, res: Response, next: NextFunction) => {
  gitService.getTagsById(req.params.id)
  .then((tagList: GitTag[]) => {
    res.json(new ApiResult(ResponseStatus.success, tagList))
  })
  .catch(next)
})
router.get('/:id/commits', (req: Request, res: Response, next: NextFunction) => {
  gitService.getCommitsById(req.params.id)
  .then((commits: GitCommit[]) => {
    res.json(new ApiResult(ResponseStatus.success, commits))
  })
  .catch(next)
})
router.post('/version/add', (req: Request, res: Response, next: NextFunction) => {
  gitService.addVersion(req.body as GitCreateVersionParam)
  .then((version: GitVersion) => {
    res.json(new ApiResult(ResponseStatus.success, version))
  })
  .catch(next)
})
router.get('/filetree', (req: Request, res: Response, next: NextFunction) => {
  gitService.getFileTree(req.session, req.query.id, req.query.versionId, req.session.currentUser)
  .then((treeList: DirNode[]) => {
    res.json(new ApiResult(ResponseStatus.success, treeList))
  })
  .catch(next)
})
router.get('/cat', (req: Request, res: Response, next: NextFunction) => {
  gitService.getFileContent(req.session, req.query.filePath)
  .then((fileContent: string) => {
    res.json(new ApiResult(ResponseStatus.success, fileContent))
  })
  .catch(next)
})
router.post('/config/add', (req: Request, res: Response, next: NextFunction) => {
  gitService.addConfig(req.body)
  .then(() => {
    res.json(new ApiResult(ResponseStatus.success))
  })
  .catch(next)
})
export default router