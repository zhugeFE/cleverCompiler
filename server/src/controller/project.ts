/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 17:12:16
 */
import { ProjectCompileParams } from './../types/project';
import {Router, Response, Request, NextFunction} from 'express'
import { IncomingForm } from 'formidable';
import { ApiResult, ResponseStatus } from '../types/apiResult'
import ProjectService from "../service/project"
import CompileService from "../service/compile"
import { CreateProjectParams, ProjectInfo, ProjectInstance, ProjectType, UpdateProjectParams } from '../types/project'
import { Member } from '../types/user'
import * as path from 'path'
import { ProjectCompile } from '../types/compile'
import fsUtil from '../utils/fsUtil';
const router = Router()

//项目列表
router.get('/list', (req: Request, res: Response, next: NextFunction) => {
  ProjectService.projectList(req.session.currentUser.id)
  .then((projectList: ProjectInstance[]) => {
    res.json(new ApiResult(ResponseStatus.success, projectList))
  })
  .catch(next)
})

//项目添加
router.post('/add', (req: Request, res: Response, next: NextFunction) => {
  const saveFilePath = path.resolve(__dirname, '../../file')
  const form = new IncomingForm({keepExtensions: true, uploadDir:saveFilePath})
  const projectInfo = {}

  form.parse( req, (err, fields, file) => {
    if (err) {
      res.json(new ApiResult(ResponseStatus.fail,err))
      return
    }

    Object.keys(fields).map(  key => {
      if (key == 'configList') {
        projectInfo[key] = []
        const configList = JSON.parse(fields[key] as string)
        configList.map( config => {
          projectInfo[key].push(config)
        })
      } else if ( key == 'gitList') {
        projectInfo[key] = []
        const gitList = JSON.parse(fields[key] as string)
        gitList.map( (git: any) => {
          projectInfo[key].push(git)
        })
      } else {
        projectInfo[key] = fields[key]
      }
    })

    Object.keys(file).map( async name=> {
      const newname = file[name]['newFilename'] 
      const oldPath = path.resolve(saveFilePath, newname)
      const newPath = path.resolve(saveFilePath, name)
      await fsUtil.rename(oldPath, newPath)
    })
    
    ProjectService.addProject(projectInfo as CreateProjectParams, req.session.currentUser.id)
    .then((project: ProjectType) => {
      res.json(new ApiResult(ResponseStatus.success, project))
    })
    .catch(next)
  }) 
})

//项目更新
router.post('/update', (req: Request, res: Response, next: NextFunction) => {
  const saveFilePath = path.resolve(__dirname, '../../file')
  const form = new IncomingForm({keepExtensions: true, uploadDir:saveFilePath})
  const projectInfo = {}
  form.parse( req, (err, fields, file) => {
    if (err) {
      res.json(new ApiResult(ResponseStatus.fail,err))
      return
    }

    Object.keys(fields).map(  key => {
      if (key == 'globalConfigList') {
        projectInfo[key] = []
        const configList = JSON.parse(fields[key] as string)
        configList.map( config => {          
          projectInfo[key].push(config)
        })
      }
      else if ( key == 'gitList') {
        projectInfo[key] = []
        const gitList = JSON.parse(fields[key] as string)
        gitList.map( git => {
          projectInfo[key].push(git)
        }) 
      }
      else {
        projectInfo[key] = fields[key]
      }      
    })

    Object.keys(file).map( async name=> {
      const newname = file[name]['newFilename'] 
      const oldPath = path.resolve(saveFilePath, newname)
      const newPath = path.resolve(saveFilePath, name)
      await fsUtil.rename(oldPath, newPath)
    })
    
    ProjectService.updateProject(projectInfo as UpdateProjectParams)
    .then(() => {
      res.json(new ApiResult(ResponseStatus.success))
    })
    .catch(next)
  }) 
})

//项目信息
router.get('/:id/info', (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id
  if (!id) {
    res.json( new ApiResult(ResponseStatus.fail, 'id为空!'))
    return
  }
  ProjectService.projectInfo(id)
  .then( (projectInfo: ProjectInfo) => {
    res.json(new ApiResult(ResponseStatus.success, projectInfo))
  })
  .catch(next)
})

router.get('/compile', (req: Request, res: Response, next: NextFunction) => {
  ProjectService.getProjectCompileData()
  .then( (data: ProjectCompileParams[]) => {
    res.json(new ApiResult(ResponseStatus.success, data))
  })
  .catch(next)
})

//项目编译记录
router.get('/:id/list', (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id
  if ( !id ) {
    res.json(new ApiResult(ResponseStatus.fail, null , "项目id不能为空!"))
    return
  }
  CompileService.compileList(id)
  .then( (compileList: ProjectCompile[]) => {
    res.json(new ApiResult(ResponseStatus.success, compileList))
  })
  .catch(next)
})

router.get('/members', (req: Request, res: Response, next: NextFunction) => {
  ProjectService.getMemberList()
  .then( (memberList: Member[]) => {
    res.json(new ApiResult(ResponseStatus.success, memberList))
  })
  .catch(next)
})

export default router