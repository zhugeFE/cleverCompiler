/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 17:13:39
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-30 14:57:40
 */
import projectDao from "../dao/project";
import { CreateProjectParams, ProjectType, ProjectInfo, ProjectInstance } from "../types/project";

class Project {

  //项目列表
  async projectList(): Promise<ProjectInstance[]>{
    return await projectDao.projectList()
  }

  //编译项目的创建
  async addProject(data: CreateProjectParams, userId: string): Promise<ProjectType>{
    return await projectDao.createProject(data, userId)
  }
  
  //更新项目
  async updateProject(data: ProjectType): Promise<void>{
    await projectDao.updateProject(data)
  }

  //项目详细
  async projectInfo(id: string): Promise<ProjectInfo>{
    return await projectDao.projectInfo(id)
  }

}

export default new Project()