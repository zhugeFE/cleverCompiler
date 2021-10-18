/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 16:47:43
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-09-26 09:55:57
 */
import { 
  CreateTemplateConfigParams, 
  CreateTemplateGlobalConfigParams, 
  CreateTemplateParams, 
  CreateTemplateVersionGitParams, 
  CreateTemplateVersionParams, 
  TemplateConfig, 
  TemplateGlobalConfig, 
  TemplateInfo, 
  TemplateInstance, 
  TemplateVersion, 
  TemplateVersionGit, 
  UpdateConfigParam } from "../types/template"
import templateDao from "../dao/template"

class TemplateService {
  async add (userId: string, name: string, description: string , version: string ,versionDescription: string): Promise<TemplateInfo> {
    const param: CreateTemplateParams = {
      name,
      description,
      creatorId: userId,
    }
    return await templateDao.create(param,version , versionDescription)
  }

  async query (): Promise<TemplateInstance[]> {
    return await templateDao.query()
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
  async addVersion (param: CreateTemplateVersionParams): Promise<TemplateVersion> {
    return await templateDao.createVersion(param)
    
  }
  async updateVersion (param: TemplateVersion): Promise<void> {
    await templateDao.updateVersion(param)
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
  async addConfig (config: CreateTemplateConfigParams): Promise<TemplateConfig> {
    return await templateDao.createConfig(config)
  }
  async updateConfig(config: UpdateConfigParam): Promise<void> {
    await templateDao.updateConfig(config)
  }
  async deleteConfigById(configId: string): Promise<void> {
    await templateDao.deleteConfigById(configId)
  }
  async addComConfig(config: CreateTemplateGlobalConfigParams): Promise<TemplateGlobalConfig> {
    return await templateDao.addComConfig(config)
  }
  async updateComConfig(config: TemplateGlobalConfig): Promise<void> {
    await templateDao.updateComConfig(config)
  }
  async deleteComConfigById(configId: string): Promise<void> {
    await templateDao.deleteComConfigById(configId)
  }
}

const templateService = new TemplateService()
export default templateService