/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 17:13:39
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-18 10:58:50
 */
import { ProjectCompileParams } from './../types/project';
import projectDao from "../dao/project";
import { CreateProjectParams, ProjectType, ProjectInfo, ProjectInstance, UpdateProjectParams } from "../types/project";
import { Member } from "../types/user";
import userDao from "../dao/user";
import { CompileGitParams } from "../types/git";

class Project {

  //获取分享成员
  async getMemberList (): Promise<Member[]> {
    return await userDao.getMemberList()
  }

  //项目列表
  async projectList(): Promise<ProjectInstance[]>{
    return await projectDao.projectList()
  }

  //编译项目的创建
  async addProject(data: CreateProjectParams, userId: string): Promise<ProjectType>{
    return await projectDao.createProject(data, userId)
  }
  
  //更新项目
  async updateProject(data: UpdateProjectParams): Promise<void>{
    await projectDao.updateProject(data)
  }

  //项目详细
  async projectInfo(id: string): Promise<ProjectInfo>{
    return await projectDao.getProjectInfo(id)
  }

  async projectCompileInfo (id: string): Promise<ProjectInfo>{
    return await projectDao.projectCompileInfo(id)
  }

  async getCompileGitData (gitIds: string[]): Promise<CompileGitParams[]> {
    return await projectDao.getCompileGitData(gitIds)
  }

  async getProjectCompileData (): Promise<ProjectCompileParams[]> {
    return await projectDao.getProjectCompileData()
  } 
}

export default new Project()