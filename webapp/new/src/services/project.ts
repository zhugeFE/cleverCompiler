/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 18:41:25
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-09 16:40:05
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

  async updateProject (data: Project) {
    return request(api.project.updateProject, {
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