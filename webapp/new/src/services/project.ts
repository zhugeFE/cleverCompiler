/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 18:41:25
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-09-03 23:03:30
 */
import { CreateProjectParams, Project } from "@/models/project";
import request from "@/utils/request";
import api from "./constants/apis";


class ProjectService {
  async projectList () {
    return request(api.project.projectList)
  }

  async addProject (data: CreateProjectParams) {
    return request(api.project.createProject, {
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