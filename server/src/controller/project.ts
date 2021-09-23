/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 17:12:16
 */
import {Router, Response, Request, NextFunction} from 'express'
import { ApiResult, ResponseStatus } from '../types/apiResult'
import ProjectService from "../service/project"
import CompileService from "../service/compile"
import { CreateProjectParams, ProjectInfo, ProjectInstance, ProjectType } from '../types/project'
import { Member } from '../types/user'
import logger from '../utils/logger'
import { ProjectCompile } from '../types/compile'
const router = Router()


//项目列表
router.get('/list', (req: Request, res: Response, next: NextFunction) => {
  ProjectService.projectList()
  .then((projectList: ProjectInstance[]) => {
    res.json(new ApiResult(ResponseStatus.success, projectList))
  })
  .catch( (err) => {
    // const err = new Error()
    // err.message = "获取project列表失败"
    // next(err)
    logger.info(err)
    next
  })
})

//项目添加
router.post('/add', (req: Request, res: Response, next: NextFunction) => {
  const project = req.body as CreateProjectParams
  ProjectService.addProject(project, req.session.currentUser.id)
  .then((project: ProjectType) => {
    res.json(new ApiResult(ResponseStatus.success, project))
  })
  .catch(next)
})

//项目更新
router.post('/update', (req: Request, res: Response, next: NextFunction) => {
  const project = req.body as ProjectType
  if( !project.id ){
    res.json(new ApiResult(ResponseStatus.fail, null , "项目id不能为空!"))
    return
  }
  ProjectService.updateProject(project)
  .then(() => {
    res.json(new ApiResult(ResponseStatus.success))
  })
  .catch(next)
})

//项目信息
router.get('/:id/info', (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id
  ProjectService.projectInfo(id)
  .then( (projectInfo: ProjectInfo) => {
    res.json(new ApiResult(ResponseStatus.success, projectInfo))
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