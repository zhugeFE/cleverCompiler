import { ChangeGitVersionParams, UpdateTemplateGlobalConfig } from './../types/template';
/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 16:47:43
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-19 16:35:10
 */
import { 
  CreateTemplateGlobalConfigParams, 
  CreateTemplateVersionGitParams, 
  CreateTemplateVersionParams, 
  TemplateConfig, 
  TemplateGlobalConfig, 
  TemplateInfo, 
  TemplateInstance, 
  TemplateVersion, 
  TemplateVersionGit, 
  UpdateConfigParam, 
  UpdateTemplateStatus} from "../types/template"
import templateDao from "../dao/template"

class TemplateService {
  async query (): Promise<TemplateInstance[]> {
    return await templateDao.query()
  }

  async getVersionList (id: string): Promise<TemplateInfo[]> {
    return await templateDao.getVersionList(id)
  }

  async updateTemplate (template: TemplateInstance): Promise<void> {
    await templateDao.updateTemplate(template)
  }
  
  async getInfoById (id: string): Promise<TemplateInfo> {
    return await templateDao.getInfo(id)
  }

  async getVersionInfo(id: string): Promise<TemplateVersion>{
    return await templateDao.getVersionbyId(id)
  }
  async addVersion (param: CreateTemplateVersionParams, creatorId: string): Promise<TemplateVersion> {
    return await templateDao.createVersion(param, creatorId)  
  }

  async copyVersion (templateId: string, templateVersionId: string, name: string, creatorId: string): Promise<TemplateInstance> {
    return await templateDao.copyVersion(templateId, templateVersionId, name, creatorId)
  }

  async updateVersion (param: TemplateVersion): Promise<void> {
    await templateDao.updateVersion(param)
  }

  async changeGitVersion (param: ChangeGitVersionParams): Promise<TemplateVersionGit> {
    return await templateDao.changeGitVersion(param)
  }
  async delVersion (id: string): Promise<void> {
    await templateDao.delVersionById(id)
  }
  async addGit (config: CreateTemplateVersionGitParams): Promise<TemplateVersionGit> {
    return await templateDao.createTemplateVersionGit(config)
  }
  async deleteGitById(configId: string): Promise<TemplateVersion> {
    return await templateDao.delTemplateVersionGit(configId)
  }

  async updateConfig(config: UpdateConfigParam): Promise<TemplateConfig> {
    return await templateDao.updateConfig(config)
  }
  async updateConfigStatus (config: {id: string; status: number}): Promise<void> {
    await templateDao.updateConfigStatus(config)
  } 

  async updateConfigGlobalConfig (config: {id: string; globalConfig: string}): Promise <void>{
    await templateDao.updateConfigGlobalConfig(config)
  }

  async deleteConfigById(configId: string): Promise<void> {
    await templateDao.deleteConfigById(configId)
  }
  async addGlobalConfig(config: CreateTemplateGlobalConfigParams): Promise<TemplateGlobalConfig> {
    return await templateDao.addGlobalConfig(config) as TemplateGlobalConfig
  }
  async updateGlobalConfig(config: UpdateTemplateGlobalConfig): Promise<TemplateGlobalConfig> {
    return await templateDao.updateGlobalConfig(config)
  }

  async updateGlobalConfigStatus(config: {id: string; status: number}): Promise<void> {
    await templateDao.updateGlobalConfigStatus(config)
  } 
  async deleteGlobalConfigById(configId: string): Promise<void> {
    await templateDao.deleteGlobalConfigById(configId)
  }

  async deleteTemplate (id: string): Promise<void> {
    await templateDao.deleteTemplateById(id)
  }
  async updateTemplateStatus (data: UpdateTemplateStatus[]): Promise<void> {
    await templateDao.updateTemplateStatus(data)
  }

}

const templateService = new TemplateService()
export default templateService