/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 17:12:16
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-25 18:32:26
 */
import {Router, Response, Request, NextFunction} from 'express'
import { ApiResult, ResponseStatus } from '../types/apiResult'
import ProjectService from "../service/project"
import { CreateProjectParams, ProjectInfo, ProjectInstance, ProjectType } from '../types/project'
const router = Router()


//项目列表
router.get('/list', (req: Request, res: Response, next: NextFunction) => {
  ProjectService.projectList()
  .then((projectList: ProjectInstance[]) => {
    res.json(new ApiResult(ResponseStatus.success, projectList))
  })
  .catch(next)
})

//项目添加
router.post('/add', (req: Request, res: Response, next: NextFunction) => {
  const project = req.body as CreateProjectParams
  ProjectService.addProject(project)
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
router.post('/:id/info', (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id
  ProjectService.projectInfo(id)
  .then( (projectInfo: ProjectInfo) => {
    res.json(new ApiResult(ResponseStatus.success, projectInfo))
  })
  .catch(next)
})

export default router