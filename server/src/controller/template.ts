/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 16:47:43
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-01-02 13:33:19
 */
import { ChangeGitVersionParams, TemplateConfig, TemplateVersionUpdateInfo, UpdateConfigStatus } from './../types/template';
import {Router, Response, Request, NextFunction} from 'express'
import templateService from '../service/template'
import { ApiResult, ResponseStatus } from '../types/apiResult'
import { UpdateTemplateStatus } from '../types/template'
import { 
  CreateTemplateVersionGitParams, 
  CreateTemplateVersionParams, 
  TemplateGlobalConfig, 
  TemplateInfo, 
  TemplateInstance, 
  TemplateVersion, 
  TemplateVersionGit } from '../types/template'
import logger from '../utils/logger'
import * as path from "path"
import { IncomingForm } from "formidable"
const router = Router()

router.get('/list', (req: Request, res: Response, next: NextFunction) => {
  templateService.query(req.session.currentUser.id)
  .then((templateList: TemplateInstance[]) => {
    res.json(new ApiResult(ResponseStatus.success, templateList))
  })
  .catch(next)
})

//无身份验证
router.get('/u.list', (req: Request, res: Response, next: NextFunction) => {
  templateService.uquery()
  .then((templateList: TemplateInstance[]) => {
    res.json(new ApiResult(ResponseStatus.success, templateList))
  })
  .catch(next)
})

router.get('/version/list', (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.id) {
    res.json(new ApiResult(ResponseStatus.fail, 'id不存在'))
    return
  }
  templateService.getVersionList(req.query.id)
  .then((data: TemplateInfo[]) => {
    res.json( new ApiResult( ResponseStatus.success, data))
  })
  .catch(next)
})

router.post('/version/updateInfo', (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.id) {
    res.json(new ApiResult(ResponseStatus.fail, "id不存在"))
    return
  }
  templateService.getVersionUpdateInfo (req.body.id)
  .then( (data: TemplateVersionUpdateInfo[]) => {
    res.json(new ApiResult(ResponseStatus.success, data))
  })
  .catch(next)
})

router.post('/status', (req: Request, res: Response, next: NextFunction) => {
  templateService.updateTemplateStatus(req.body as UpdateTemplateStatus[])
  .then(() => {
    res.json(new ApiResult(ResponseStatus.success))
  })
  .catch(next)
})

router.get('/:id/info', (req: Request, res: Response, next: NextFunction) => {
  templateService.getInfoById(req.params.id)
  .then((templateInfo: TemplateInfo) => {
    if (!templateInfo) {
      res.json(new ApiResult(ResponseStatus.fail, null, '数据不存在'))
    } else {
      res.json(new ApiResult(ResponseStatus.success, templateInfo))
    }
  }).catch(next)
})

router.post('/version/add', (req: Request, res: Response, next: NextFunction) => {
  templateService.addVersion( req.body as CreateTemplateVersionParams, req.session.currentUser.id)
  // templateService.addVersion( req.body as CreateTemplateVersionParams, 'f975eb7e-cea4-4a1d-b515-7e6da94b1899')
  .then((version: TemplateVersion) => { 
    res.json(new ApiResult(ResponseStatus.success, version))
  })
  .catch(next)
})

router.post('/copy', (req: Request, res: Response, next: NextFunction) => {
  templateService.copyVersion( req.body.templateId, req.body.templateVersionId, req.body.name, req.session.currentUser.id )
  .then( (version: TemplateInstance) => {
    res.json( new ApiResult(ResponseStatus.success, version))
  })
  .catch(next)
})

router.post('/version/status', (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.id) {
    res.json(new ApiResult(ResponseStatus.fail, 'id不存在'))
    return
  }
  templateService.updateVersion(req.body)
  .then (() => {
    res.json(new ApiResult(ResponseStatus.success))
  })
  .catch(next)
})

router.post('/version/update', (req: Request, res: Response, next: NextFunction) => {
  const param = req.body as TemplateVersion
  if (!param.id) {
    res.json(new ApiResult(ResponseStatus.fail, null, "模板id不能为空"))
    return
  }
  templateService.updateVersion(req.body)
  .then(() => {
    res.json(new ApiResult(ResponseStatus.success))
  })
  .catch(next)
})

router.post('/version/changeGitVersion', (req: Request, res: Response, next: NextFunction) => {
  const param = req.body as ChangeGitVersionParams
  if (!param.id) {
    res.json(new ApiResult(ResponseStatus.fail, null, "gitid不能为空"))
    return
  }
  templateService.changeGitVersion(req.body)
  .then( (gitdata: TemplateVersionGit) => {
    logger.info(gitdata)
    res.json(new ApiResult(ResponseStatus.success, gitdata))
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

router.post('/config/update', (req: Request, res: Response, next: NextFunction) => {
  const saveFilePath = path.resolve(__dirname, '../../file')
  const form = new IncomingForm({keepExtensions:true, uploadDir:saveFilePath})
  form.parse(req, (err, fields, files) => {
    if (err || !fields['configId']) {
      logger.info(err)
      res.json(new ApiResult(ResponseStatus.fail, err || "configId不能为空"))
      return
    }
    templateService.updateConfig({
      id: fields['configId'] as string,
      targetValue: JSON.stringify(files) !== '{}' ? JSON.stringify({newFilename: files['files']['newFilename'], originalFilename: files['files']['originalFilename']}) : fields["targetValue"] as string,
    })
    .then((config: TemplateConfig) => {
      res.json(new ApiResult(ResponseStatus.success, config))
    })
    .catch(next)
  })
})

router.post('/config/status/update', (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.configList.length) {
    res.json(new ApiResult(ResponseStatus.fail, "数据为空"))
    return
  }
  templateService.updateConfigStatus(req.body.configList as UpdateConfigStatus[])
  .then ( () => {
    res.json(new ApiResult(ResponseStatus.success))
  })
  .catch(next)
})

router.post('/config/globalConfig/update', (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.id) {
    res.json(new ApiResult(ResponseStatus.fail, 'id不存在'))
    return
  }
  templateService.updateConfigGlobalConfig({id: req.body.id, globalConfig: req.body.globalConfigId})
  .then ( () => {
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

router.post('/globalconfig/add', (req: Request, res: Response , next: NextFunction) => {
  const saveFilePath = path.resolve(__dirname, '../../file')
  const form = new IncomingForm({keepExtensions:true, uploadDir:saveFilePath})
  form.parse(req, (err, fields, files) => {
    if (err) {
      logger.info(err)
      res.json(new ApiResult(ResponseStatus.fail, err))
      return
    }
    templateService.addGlobalConfig({
      name: fields['name'] as string,
      targetValue: JSON.stringify(files) !== '{}' ? JSON.stringify({newFilename: files['files']['newFilename'], originalFilename: files['files']['originalFilename']}) : fields["targetValue"] as string,
      description: fields['description'] as string,
      templateId: fields['templateId'] as string, 
      templateVersionId: fields['templateVersionId'] as string,
      type: Number(fields['type'] as string),
    })
    // templateService.addGlobalConfig({
    //   name: req.body.name,
    //   targetValue:  req.body.targetValue,
    //   description: req.body.description,
    //   templateId: req.body.templateId, 
    //   templateVersionId: req.body.templateVersionId,
    //   type: req.body.type,
    // })
    .then((config: TemplateGlobalConfig) => {
      res.json(new ApiResult(ResponseStatus.success, config))
    })
    .catch(next)
  })
})

router.post('/globalconfig/status/update', (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.configList.length) {
    res.json(new ApiResult(ResponseStatus.fail, "数据为空"))
    return
  }
  templateService.updateGlobalConfigStatus(req.body.configList as UpdateConfigStatus[])
  .then (() => {
    res.json(new ApiResult(ResponseStatus.success))
  })
  .catch(next)
})

router.post('/globalconfig/update', (req: Request, res: Response, next: NextFunction) => {
  const saveFilePath = path.resolve(__dirname, '../../file')
  const form = new IncomingForm({keepExtensions:true, uploadDir:saveFilePath})
  form.parse(req, (err, fields, files) => {
    if (err || !fields['configId']) {
      logger.info(err)
      res.json(new ApiResult(ResponseStatus.fail, err || "configId不能为空"))
      return
    }
    templateService.updateGlobalConfig({
      id: fields['configId'] as string,
      description: fields['description'] as string,
      targetValue: JSON.stringify(files) !== '{}' ? JSON.stringify({newFilename: files['files']['newFilename'], originalFilename: files['files']['originalFilename']}) : fields["targetValue"] as string,
    })
    .then((config: TemplateGlobalConfig) => {
      res.json(new ApiResult(ResponseStatus.success, config))
    })
    .catch(next)
  })
})

router.delete('/globalconfig', (req: Request, res: Response, next: NextFunction) => {
  templateService.deleteGlobalConfigById(req.query.configId)
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
  templateService.deleteTemplate(req.query.id)
  .then( () => {
    res.json(new ApiResult(ResponseStatus.success))
  })
  .catch(next)
})

export default router