/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 18:41:25
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-09 19:03:48
 */
import { CreateProjectParams, Project } from "@/models/project";
import request from "@/utils/request";
import api from "./constants/apis";


class ProjectService {
  
  async compileInfo (id: string) {
    return request(api.project.compileInfo, {
      params: {
        id
      }
    })
  }

  async compileParamInfo () {
    return request(api.project.compileParamInfo)
  }

  async projectList () {
    return request(api.project.projectList)
  }

  async addProject (data: CreateProjectParams) {
    return request(api.project.createProject, {
      requestType: 'form',
      method: "post",
      data
    })
  }

  async updateProject (data: any) {
    return request(api.project.updateProject, {
      requestType: 'form',
      method: "post",
      data
    })
  }

  async updateTemplateProject (data: {projectId: string, versionId: string}) {
    return request(api.project.templateUpdateProject, {
      method: "post",
      data
    })
  }

  async projectInfo (id: string) {
    return request(api.project.getInfo, {
      params:{
        id
      }
    })
  }

  async memberList () {
    return request(api.project.getMemberList)
  }
}

export default new ProjectService()