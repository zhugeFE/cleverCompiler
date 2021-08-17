/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-06 16:01:47
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-17 17:20:04
 */

import request from "@/utils/request";
import api from "./constants/apis";
import { TemplateCreateParam, CreateTemplateVersionParams, TemplateVersion, TemplateConfig, TemplateInfo, TemplateInstance, CreateTemplateGlobalConfigParams, TemplateGlobalConfig, CreateTemplateVersionGitParams, UpdateConfigParam } from "@/models/template";

class TemplateService {
  async queryTemplateList () {
    return request(api.template.queryTemplateList)
  }
  async getInfo (id: string) {
    return request(api.template.getInfo, {
      params: {
        id
      }
    })
  }
  async createTemplate (data: TemplateCreateParam) {
    return request(api.template.createTemplate , {
      method:"post",
      data
    })
  }
  async updateTemplateStatus (data: TemplateInstance) {
    return request(api.template.updateTemplateStatus, {
      method:"post",
      data
    })
  }
  async addVersion ( data: CreateTemplateVersionParams) {
    return request(api.template.addVersion, {
      method:"post",
      data
    })
  }

  async delVersion (id : string) {
    return request(api.template.delVersion , {
      method:"delete",
      params:{
        id
      }
    })
  }

  async updateVersion ( data: TemplateVersion) {
    return request(api.template.updateVersion, {
      method:"post",
      data
    })
  }


  async addVersionGit ( data: CreateTemplateVersionGitParams) {
    return request(api.template.addVersionGit, {
      method:"post",
      data
    })
  }

  async delVersionGit (id : string) {
    return request(api.template.delVersionGit , {
      method:"delete",
      params:{
        id
      }
    })
  }


  async updateConfig ( data: UpdateConfigParam) {
    return request(api.template.updateConfig, {
      method:"post",
      data
    })
  }

  // async delConfig (configId: string) {
  //   return request(api.template.delConfig, {
  //     method: 'delete',
  //     params: {
  //       configId
  //     }
  //   })
  // }


  async addComConfig ( data: CreateTemplateGlobalConfigParams) {
    return request(api.template.addComConfig, {
      method:"post",
      data
    })
  }
  async updateComConfig ( data: TemplateGlobalConfig) {
    return request(api.template.updateComConfig, {
      method:"post",
      data
    })
  }

  async delComConfig (configId: string) {
    return request(api.template.delComConfig, {
      method: 'delete',
      params: {
        configId
      }
    })
  }

}

export default new TemplateService()