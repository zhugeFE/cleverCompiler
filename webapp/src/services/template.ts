/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-06 16:01:47
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-01-07 11:14:23
 */

import request from "@/utils/request";
import api from "./constants/apis";
import type { TemplateCreateParam, CreateTemplateVersionParams, TemplateVersion, CreateTemplateGlobalConfigParams, TemplateGlobalConfig, CreateTemplateVersionGitParams, UpdateConfigParam, UpdateTemplateStatus, ChangeGitVersionParams } from "@/models/template";


// const updateVersionTimer: Record<number, any> = {}

class TemplateService {
  async queryTemplateList () {
    return request(api.template.queryTemplateList)
  }
  async uqueryTemplateList () {
    return request(api.template.uqueryTemplateList)
  }
  async getInfo (id: string) {
    return request(api.template.getInfo, {
      params: {
        id
      }
    })
  }

  async getVersionUpdateInfo (id: string) {
    return request(api.template.getVersionUpdateInfo, {
      method: "post",
      data: {
        id
      }
    })
  }
  async copyTemplate (data: {templateId: string, templateVersionId: string, name: string}) {
    return request( api.template.copyTemplate, {
      method: "post",
      data: {
        templateId: data.templateId,
        templateVersionId: data.templateVersionId,
        name: data.name
      }
    })
  }
  async createTemplate (data: TemplateCreateParam) {
    return request(api.template.createTemplate , {
      method:"post",
      data
    })
  }
  async deleteTemplate (id: string) {
    return request(api.template.deleteTemplate, {
      method: "delete",
      params: {
        id
      }
    })
  }
  async updateTemplateVersionStatus (data: {id: string, status: number}) {
    return request(api.template.updateVersionStatus, {
      method: "post",
      data
    })
  }
  
  async updateTemplateStatus (data: UpdateTemplateStatus) {
    return request(api.template.updateTemplateStatus, {
      method:"post",
      data
    })
  }

  async getTemplateVersionInfo (id: string) {
    return request(api.template.getTemplateVersionInfo, {
      method: "get",
      params: {
        id
      }
    })
  }

  async getVersionInfo (id: string) {
    return request(api.template.getVersionInfo, {
      params:{
        id
      }
    })
  }
  async addVersion ( data: CreateTemplateVersionParams) {
    return request(api.template.addVersion, {
      method:"post",
      data
    })
  }

  async delVersion (id: string) {
    return request(api.template.delVersion , {
      method:"delete",
      params:{
        id
      }
    })
  }

  async updateVersion ( data: TemplateVersion) {
    // for (const timer in updateVersionTimer) {
    //   clearTimeout(Number(timer))
    //   updateVersionTimer[timer]()
    //   delete updateVersionTimer[timer]
    // }
    // const d = await new Promise((resolve) => {
    //   const timer = setTimeout(() => {
    //     const res = request(api.template.updateVersion, {
    //       method:"post",
    //       data
    //     })
    //     delete updateVersionTimer[Number(timer)]
    //     resolve(res)
    //   }, 500)
    //   updateVersionTimer[Number(timer)] = resolve
    // })
    // return d
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

  async changeGitVersion (data: ChangeGitVersionParams) {
    return request(api.template.changeGitVersion, {
      method: "post",
      data
    })
  }
  

  async delVersionGit (id: string) {
    return request(api.template.delVersionGit , {
      method:"delete",
      params:{
        id
      }
    })
  }


  async updateConfig ( data: UpdateConfigParam) {
    return request(api.template.updateConfig, {
      requestType:'form',
      method:"post",
      data
    })
  }

  async updateConfigStatus (data: {id: string; status: number}) {
    return request(api.template.updateConfigStatus, {
      method: "post",
      data
    })
  }

  async updateConfigGlobalConfig (data: {id: string; globalConfig: string}) {
    return request(api.template.updateConfigGlobalConfig, {
      method: "post",
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


  async addGlobalConfig ( data: CreateTemplateGlobalConfigParams) {
    return request(api.template.addGlobalConfig, {
      requestType: 'form',
      method:"post",
      data
    })
  }
  async updateGlobalConfig ( data: TemplateGlobalConfig) {
    return request(api.template.updateGlobalConfig, {
      requestType: 'form',
      method:"post",
      data
    })
  }
  
  async updateGlobalConfigStatus (data: {id: string; status: number}) {
    return request(api.template.updateGlobalConfigStatus, {
      method: "post",
      data
    })
  }

  async delGlobalConfig (configId: string) {
    return request(api.template.delGlobalConfig, {
      method: 'delete',
      params: {
        configId
      }
    })
  }

}

export default new TemplateService()