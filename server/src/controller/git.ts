import { BranchUpdateDocInfo, GitList, UpdateGitStatus } from './../types/git';
import { Router, Response, Request, NextFunction } from 'express'
import gitService from '../service/git'
import { ApiResult, ResponseStatus } from '../types/apiResult'
import { GitInstance, GitInfo, GitBranch, GitTag, GitCommit, GitCreateVersionParam, GitVersion, GitConfig } from '../types/git';
import { DirNode } from '../types/common';
import { IncomingForm } from 'formidable';
import * as path from 'path';
import logger from '../utils/logger';
const router = Router()

router.get('/remotelist', (req: Request, res: Response, next: NextFunction) => {
  gitService.getRemoteGitList()
  .then( (gitList: GitList[]) => {
    res.json(new ApiResult(ResponseStatus.success, gitList))
  })
  .catch(err => {
    next(err)
  })
})

router.get('/list', (req: Request, res: Response, next: NextFunction) => {
  gitService.query(req.session.currentUser.id)
  .then((gitList: GitInstance[]) => {
    res.json(new ApiResult(ResponseStatus.success, gitList))
  })
  .catch(err => {
    next(err)
  })
})
router.post('/status', (req: Request, res: Response, next: NextFunction) => {
  gitService.updateGitStatus(req.body as UpdateGitStatus[])
  .then(() => {
    res.json(new ApiResult(ResponseStatus.success))
  })
  .catch(next)
})

router.get('/:id/info', (req: Request, res: Response, next: NextFunction) => {
  gitService.getInfoById(req.session, req.params.id)
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
router.get('/:id/:branch/commits', (req: Request, res: Response, next: NextFunction) => {
  gitService.getCommitsById(req.params.id, req.params.branch)
  .then((commits: GitCommit[]) => {
    res.json(new ApiResult(ResponseStatus.success, commits))
  })
  .catch(next)
})

router.post('/version/updateInfo', (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.id) {
    res.json(new ApiResult(ResponseStatus.fail, "id为空"))
    return
  }
  gitService.getBranchUpdateDocByGitId(req.body.id)
  .then ( (data: BranchUpdateDocInfo[]) => {
    res.json(new ApiResult(ResponseStatus.success, data))
  })
  .catch (next)
})

router.post('/version/add', (req: Request, res: Response, next: NextFunction) => {
  gitService.addVersion(req.body as GitCreateVersionParam, req.session.currentUser.id)
  // gitService.addVersion(req.body as GitCreateVersionParam, 'f975eb7e-cea4-4a1d-b515-7e6da94b1899')
  .then((data: GitInfo) => {
    res.json(new ApiResult(ResponseStatus.success, data))
  })
  .catch(next)
})

router.post('/version/status', (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.id) {
    res.json(new ApiResult(ResponseStatus.fail, 'id不存在'))
    return
  }
  gitService.updateVersion(req.body)
  .then ( () => {
    res.json(new ApiResult(ResponseStatus.success))
  })
  .catch(next)
})

router.post('/version/update', (req: Request, res: Response, next: NextFunction) => {
  const param = req.body as GitVersion
  if (!param.id) {
    res.json(new ApiResult(ResponseStatus.fail, null, '版本id不能为空'))
    return
  }
  gitService.updateVersion(req.body)
  .then(() => {
    res.json(new ApiResult(ResponseStatus.success))
  })
  .catch(next)
})
router.delete('/branch', (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.id) {
    res.json(new ApiResult(ResponseStatus.fail, 'branchId 不存在！'))
    return
  }
  gitService.deleteBranch(req.query.id)
  .then( () => {
    res.json(new ApiResult(ResponseStatus.success))
  })
  .catch(next)
})
router.delete('/version', (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.id) {
    res.json(new ApiResult(ResponseStatus.fail, 'versionId 不存在！'))
    return
  }
  gitService.deleteVersion(req.query.id)
  .then(() => {
    res.json(new ApiResult(ResponseStatus.success))
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
  
  const saveFilePath = path.resolve(__dirname, '../../file')
  const form = new IncomingForm({keepExtensions:true, uploadDir:saveFilePath})
  form.parse(req, (err, fields, files) => {
    if (err) {
      logger.info(err)
      res.json(new ApiResult(ResponseStatus.fail, err))
      return
    }
    gitService.addConfig({
      sourceId: fields['sourceId'] as string,
      branchId: fields['branchId'] as string,
      versionId: fields['versionId'] as string,
      typeId: fields['typeId'] as string,
      reg: fields["reg"] as string,
      filePath: fields['filePath'] as string,
      targetValue: JSON.stringify(files) !== '{}' ? JSON.stringify({newFilename: files['files']['newFilename'], originalFilename: files['files']['originalFilename']}) : fields["targetValue"] as string,
      description: fields['description'] as string
    })
    // gitService.addConfig({
    //   sourceId: req.body.sourceId,
    //   branchId: req.body.branchId,
    //   versionId: req.body.versionId,
    //   typeId: req.body.typeId,
    //   reg: req.body.reg,
    //   filePath: req.body.filePath,
    //   targetValue: req.body.targetValue,
    //   description: req.body.description
    // })
    .then((config: GitConfig) => {
      res.json(new ApiResult(ResponseStatus.success, config))
    })
    .catch(next)
  })
  
})

router.post('/config/update', (req: Request, res: Response, next: NextFunction) => {
  const saveFilePath = path.resolve(__dirname, '../../file')
  const form = new IncomingForm({keepExtensions:true, uploadDir:saveFilePath})
  form.parse(req, (err, fields, files) => {
    if (err || !fields['configId']) {
      logger.info(err)
      res.json(new ApiResult(ResponseStatus.fail, err || "configId不能为空"))
      return
    }
    gitService.updateConfig({
      configId: fields['configId'] as string,
      reg: fields["reg"] as string,
      filePath: fields['filePath'] as string,
      targetValue: JSON.stringify(files) !== '{}' ? JSON.stringify({newFilename: files['files']['newFilename'], originalFilename: files['files']['originalFilename']}) : fields["targetValue"] as string,
      description: fields['description'] as string
    })
    .then((config: GitConfig) => {
      res.json(new ApiResult(ResponseStatus.success, config))
    })
    .catch(next)
  })
  
})

router.delete('/config', (req: Request, res: Response, next: NextFunction) => {
  gitService.deleteConfigById(req.query.configId)
  .then(() => {
    res.json(new ApiResult(ResponseStatus.success))
  })
  .catch(next)
})

router.delete('/info', (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.id) {
    res.json(new ApiResult(ResponseStatus.fail, 'id不存在'))
    return
  }
  gitService.deleteGit(req.query.id)
  .then( () => {
    res.json(new ApiResult(ResponseStatus.success))
  })
  .catch(next)
})

export default router