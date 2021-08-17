/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 16:47:43
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-17 17:21:26
 */
import {Router, Response, Request, NextFunction} from 'express'
import templateService from '../service/template'
import { ApiResult, ResponseStatus } from '../types/apiResult'
import { CreateTemplateConfigParams, CreateTemplateGlobalConfigParams, CreateTemplateVersionGitParams, CreateTemplateVersionParams, TemplateConfig, TemplateGlobalConfig, TemplateInfo, TemplateInstance, TemplateVersion, TemplateVersionGit, UpdateConfigParam } from '../types/template'
const router = Router()

//添加模板
// 传递name、description、version 、versionDescription
router.post('/add', (req: Request, res: Response, next: NextFunction) => {
  const params = req.body as {
    name: string;
    description: string;
    version: string;
    versionDescription: string;
  }
  templateService.add(req.session.currentUser.id, params.name, params.description, params.version,params.versionDescription)
  .then((template: TemplateInstance) => {
    res.json(new ApiResult(ResponseStatus.success, template))
  })
  .catch(next)
})


router.get('/list', (req: Request, res: Response, next: NextFunction) => {
  templateService.query()
  .then((templateList: TemplateInstance[]) => {
    res.json(new ApiResult(ResponseStatus.success, templateList))
  })
  .catch(err => {
    next(err)
  })
})

router.get('/:id/info', (req: Request, res: Response, next: NextFunction) => {
  templateService.getInfoById(req.params.id)
  .then((templateInfo: TemplateInfo) => {
    if (!templateInfo) {
      res.json(new ApiResult(ResponseStatus.fail, null, '数据不存在'))
    } else {
      res.json(new ApiResult(ResponseStatus.success, templateInfo))
    }
  }).catch(() => {
    const err = new Error()
    err.message = '获取template详情失败'
    next(err)
  })
})

router.post('/update', (req: Request, res: Response, next: NextFunction) => {
  const param = req.body as TemplateInstance
  if (!param.id) {
    res.json(new ApiResult(ResponseStatus.fail, null, "模板id不能为空"))
    return
  }
  templateService.updateTemplate(req.body)
  .then(() => {
    res.json(new ApiResult(ResponseStatus.success))
  })
  .catch(next)
})

router.post('/version/add', (req: Request, res: Response, next: NextFunction) => {
  templateService.addVersion(req.body as CreateTemplateVersionParams)
  .then((version: TemplateVersion) => {
    res.json(new ApiResult(ResponseStatus.success, version))
  })
  .catch(next)
})

router.post('/version/update', (req: Request, res: Response, next: NextFunction) => {
  const param = req.body as TemplateVersion
  if (!param.id) {
    res.json(new ApiResult(ResponseStatus.fail, null, '版本id不能为空'))
    return
  }
  templateService.updateVersion(req.body)
  .then(() => {
    res.json(new ApiResult(ResponseStatus.success))
  })
  .catch(next)
})

router.delete('/version', (req: Request, res: Response, next: NextFunction) => {
  templateService.delVersion(req.query.id)
  .then(() => {
    res.json(new ApiResult(ResponseStatus.success))
  })
  .catch(next)
})

router.post('/git/add', (req: Request, res: Response, next: NextFunction) => {
  templateService.addGit(req.body as CreateTemplateVersionGitParams)
  .then((version: TemplateVersionGit) => {
    res.json(new ApiResult(ResponseStatus.success, version))
  })
  .catch(next)
})

router.delete('/git', (req: Request, res: Response, next: NextFunction) => {
  templateService.deleteGitById(req.query.id)
  .then((data: TemplateVersion) => {
    res.json(new ApiResult(ResponseStatus.success, data))
  })
  .catch(next)
})

router.post('/config/add', (req: Request, res: Response, next: NextFunction) => {
  templateService.addConfig(req.body as CreateTemplateConfigParams)
  .then((config: TemplateConfig) => {
    res.json(new ApiResult(ResponseStatus.success, config))
  })
  .catch(next)
})

router.post('/config/update', (req: Request, res: Response, next: NextFunction) => {
  const param = req.body as UpdateConfigParam
  if (!param.id) {
    res.json(new ApiResult(ResponseStatus.fail, null, '配置id不能为空'))
    return
  }
  templateService.updateConfig(req.body)
  .then(() => {
    res.json(new ApiResult(ResponseStatus.success))
  })
  .catch(next)
})

router.delete('/config', (req: Request, res: Response, next: NextFunction) => {
  templateService.deleteConfigById(req.query.configId)
  .then(() => {
    res.json(new ApiResult(ResponseStatus.success))
  })
  .catch(next)
})

router.post('/comconfig/add', (req: Request, res: Response , next: NextFunction) => {
  templateService.addComConfig(req.body as CreateTemplateGlobalConfigParams )
  .then((config: TemplateGlobalConfig) => {
    res.json(new ApiResult(ResponseStatus.success, config))
  })
  .catch(next)
})

router.post('/comconfig/update', (req: Request, res: Response, next: NextFunction) => {
  const param = req.body as TemplateGlobalConfig
  if (!param.id) {
    res.json(new ApiResult(ResponseStatus.fail, null, '配置id不能为空'))
    return
  }
  templateService.updateComConfig(req.body)
  .then(() => {
    res.json(new ApiResult(ResponseStatus.success))
  })
  .catch(next)
})

router.delete('/comconfig', (req: Request, res: Response, next: NextFunction) => {
  templateService.deleteComConfigById(req.query.configId)
  .then(() => {
    res.json(new ApiResult(ResponseStatus.success))
  })
  .catch(next)
})
export default router