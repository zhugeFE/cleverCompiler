/*
 * @Descripttion:
 * @version:
 * @Author: Adxiong
 * @Date: 2021-08-07 09:59:03
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-23 10:16:02
 */
/**
 * 模板
 */

import {
  ConfigInstance,
  CreateTemplateConfigParams,
  CreateTemplateGlobalConfigParams,
  CreateTemplateParams,
  CreateTemplateVersionGitParams,
  CreateTemplateVersionParams,
  GitConfig,
  TemplateConfig,
  TemplateGlobalConfig,
  TemplateInfo,
  TemplateInstance,
  TemplateVersion,
  TemplateVersionGit,
  UpdateConfigParam
} from '../types/template'
import * as _ from 'lodash'
import pool from './pool'
import util from '../utils/util'

interface GitVersionDoc {
  name: string;
  readmeDoc: string;
  buildDoc: string;
  updateDoc: string;
}

class TemplateDao {
  async query(): Promise<TemplateInstance[]> {
    const sql = `SELECT
      a.id as id,
      a.\`name\` as name,
      a.description as description,
      a.creator_id as creator_id,
      a.create_time as create_time,
      a.\`enable\` as enable,
      b.id as version_id,
      b.version as version 
    FROM
      template AS a
    LEFT JOIN ( 
      SELECT 
        id,
        template_id, 
        max( version ) AS version
      FROM template_version 
      GROUP BY template_id ) AS b 
    ON a.id = b.template_id`
    return (await pool.query<TemplateInstance>(sql)) as TemplateInstance[]
  }

  async create(
    params: CreateTemplateParams,
    version: string,
    versionDescription: string
  ): Promise<TemplateInfo> {
    const sql = `insert into 
       template(
         id, 
         name,
         description,
         creator_id,
         create_time
       ) values(
         ?,?,?,?,?
       )`
    const id = util.uuid()
    await pool.write(sql, [
      id,
      params.name,
      params.description,
      params.creatorId,
      new Date()
    ])
    const versionData: TemplateVersion = await this.createVersion({
      templateId: id,
      description: versionDescription,
      version
    })
    versionData.globalConfigList = []
    versionData.gitList = []
    const templateData = await this.getById(id)
    const data: TemplateInfo = {
      ...templateData,
      versionList: [versionData]
    }
    return data
  }

  async updateTemplate(template: TemplateInstance): Promise<void> {
    const props = []
    const params = []
    for (const key in template) {
      if (key !== 'id' && key !== 'create_time') {
        props.push(`${_.snakeCase(key)}=?`)
        params.push(template[key])
      }
    }
    params.push(template.id)
    const sql = `update template set ${props.join(',')} where id=?`
    await pool.query(sql, params)
  }

  async getById(id: string): Promise<TemplateInstance> {
    const sql = 'select * from template where id = ?'
    const list = await pool.query<TemplateInstance>(sql, [id])
    return list.length ? list[0] : null
  }

  async getInfo(id: string): Promise<TemplateInfo> {
    const infoSql = 'select tp.* from template as tp where tp.id = ?'
    const infoList = (await pool.query<TemplateInfo>(infoSql, [
      id
    ])) as TemplateInfo[]
    const templateInfo = infoList.length ? infoList[0] : null

    templateInfo.versionList = await this.getVersionbyTemplateId(
      templateInfo.id
    )

    await Promise.all(
      templateInfo.versionList.map(async item => {
        item.gitList = await this.getGitByTemplateVersionId(item.id)
        item.globalConfigList = await this.getComConfigByTemplateVersionId(
          item.id
        )
      })
    )
    return templateInfo
  }

  async createVersion(
    param: CreateTemplateVersionParams
  ): Promise<TemplateVersion> {
    const sql = `insert into 
       template_version(
         id, 
         template_id,
         description,
         version,
         publish_time
       ) values(
         ?,?,?,?,?
       )`
    const versionId = util.uuid()
    await pool.write(sql, [
      versionId,
      param.templateId,
      param.description,
      param.version,
      new Date()
    ])
    return this.getVersionbyId(versionId)
  }

  async getVersionbyId(id: string): Promise<TemplateVersion> {
    const sql = 'select template_version.* from template_version where id = ?'
    const list = await pool.query<TemplateVersion>(sql, [id])
    if( list.length ){
      list[0].gitList = []
      list[0].globalConfigList = []
    }
    return list.length ? list[0] : null
  }

  async getVersionbyTemplateId(templateid: string): Promise<TemplateVersion[]> {
    const sql =
      'select version.* from template_version as version where version.template_id = ? order by version.publish_time desc'
    return await pool.query<TemplateVersion>(sql, [templateid])
  }

  async updateVersion(template: TemplateVersion): Promise<void> {
    const props = []
    const params = []
    for (const key in template) {
      if (key !== 'id') {
        props.push(`${_.snakeCase(key)}=?`)
        params.push(template[key])
      }
    }
    params.push(template.id)
    const sql = `update template_version set ${props.join(',')} where id=?`
    await pool.query(sql, params)
  }

  async delVersionById(id: string): Promise<void> {
    const sql = `delete from template_version where id=?`
    await pool.query(sql, [id])
  }

  async getGitDocByGitVersionID(id: string): Promise<GitVersionDoc> {
    const sql = `SELECT
       readme_doc,
       build_doc,
       update_doc,
     NAME 
     FROM
       source_version
       LEFT JOIN git_source ON source_version.source_id = git_source.id 
     WHERE
       source_version.id = ?`
    const list = await pool.query<GitVersionDoc>(sql, [id])
    if (list.length > 0) {
      list[0].buildDoc = list[0].buildDoc == null ? '' : list[0].buildDoc
      list[0].readmeDoc = list[0].readmeDoc == null ? '' : list[0].readmeDoc
      list[0].updateDoc = list[0].updateDoc == null ? '' : list[0].updateDoc
      return list[0]
    }
    return null
  }
  async getVersionDocByID(id: string): Promise<TemplateVersion> {
    const sql = `SELECT
       readme_doc,
       build_doc,
       update_doc 
     FROM
       template_version 
     WHERE
       id = ?`
    const list = await pool.query<TemplateVersion>(sql, [id])
    if (list.length > 0) {
      list[0].buildDoc = list[0].buildDoc == null ? '' : list[0].buildDoc
      list[0].readmeDoc = list[0].readmeDoc == null ? '' : list[0].readmeDoc
      list[0].updateDoc = list[0].updateDoc == null ? '' : list[0].updateDoc
      return list[0]
    }
  }

  //添加template——version-git
  async createTemplateVersionGit(
    params: CreateTemplateVersionGitParams
  ): Promise<TemplateVersionGit> {
    const sql = `insert into 
     template_version_git(
       id,
       template_id,
       template_version_id,
       git_source_id,
       git_source_version_id
     )values(
       ?,?,?,?,?
     )`
    const id = util.uuid()
    await pool.write(sql, [
      id,
      params.templateId,
      params.templateVersionId,
      params.gitSourceId,
      params.gitSourceVersionId
    ])
    const gitVersionDoc = await this.getGitDocByGitVersionID(params.gitSourceVersionId)
    const versionDoc = await this.getVersionDocByID(params.templateVersionId)
    const Merge = {
      buildDpc: `${versionDoc.buildDoc}\n# ${gitVersionDoc.name}\n${gitVersionDoc.buildDoc}`,
      readmeDoc: `${versionDoc.readmeDoc}\n# ${gitVersionDoc.name}\n${gitVersionDoc.readmeDoc}`,
      updateDoc: `${versionDoc.updateDoc}\n# ${gitVersionDoc.name}\n${gitVersionDoc.updateDoc}`
    }
    await this.updateVersion({
      id: params.templateVersionId,
      buildDoc: Merge.buildDpc,
      readmeDoc: Merge.readmeDoc,
      updateDoc: Merge.updateDoc
    } as TemplateVersion)
    const configList = await this.getGitSourceConfigByVersionId(
      params.gitSourceVersionId
    )
    const GitData = await this.getGitById(id)

    await Promise.all(
      configList.map(async item => {
        const config = await this.createConfig({
          templateId: params.templateId,
          templateVersionId: params.templateVersionId,
          templateVersionGitId: id,
          gitSourceConfigId: item.id
        })
        if (!GitData.configList) {
          GitData.configList = []
        }
        GitData.configList.push({
          id: config.id,
          value: '',
          sourceValue: item.targetValue,
          isHidden: config.isHidden,
          globalConfigId: config.globalConfigId,
          typeId: item.typeId,
          description: item.description,
          reg: item.reg,
          filePath: item.filePath
        } as ConfigInstance)
      })
    )
    GitData.buildDoc = Merge.buildDpc
    GitData.readmeDoc = Merge.readmeDoc
    GitData.updateDoc = Merge.updateDoc
    return GitData
  }

  async getGitSourceConfigByVersionId(id: string): Promise<GitConfig[]> {
    const sql = `select sc.* from source_config as sc where version_id = ?`
    return await pool.query<GitConfig>(sql, [id])
  }

  async delTemplateVersionGit(id: string): Promise<TemplateVersion> {
    await this.delTemplateVersionConfigByVGID(id)
    //查询出template_version_id,git_source_version_id
    const data = await this.getGitById(id)
    const versionDoc = await this.getVersionDocByID(data.templateVersionId)
    const sourceVersionDoc = await this.getGitDocByGitVersionID(
      data.gitSourceVersionId
    )
    if (versionDoc && sourceVersionDoc) {
      versionDoc.readmeDoc = versionDoc.readmeDoc.replace(
        `\n# ${sourceVersionDoc.name}\n${sourceVersionDoc.readmeDoc}`,
        ''
      )

      versionDoc.updateDoc = versionDoc.updateDoc.replace(
        `\n# ${sourceVersionDoc.name}\n${sourceVersionDoc.updateDoc}`,
        ''
      )

      versionDoc.buildDoc = versionDoc.buildDoc.replace(
        `\n# ${sourceVersionDoc.name}\n${sourceVersionDoc.buildDoc}`,
        ''
      )
    }

    const updateParam = {
      id: data.templateVersionId,
      readmeDoc: versionDoc.readmeDoc,
      updateDoc: versionDoc.updateDoc,
      buildDoc: versionDoc.buildDoc
    } as TemplateVersion
    await this.updateVersion(updateParam)

    const sql = `delete from template_version_git where id = ?`
    await pool.query(sql, [id])

    return updateParam
  }

  async getGitById(tvId: string): Promise<TemplateVersionGit> {
    const sql = `select vg.* ,name from template_version_git as vg left join git_source ON vg.git_source_id = git_source.id where vg.id = ?`
    const list = await pool.query<TemplateVersionGit>(sql, [tvId])
    return list.length > 0 ? list[0] : null
  }

  async getGitByTemplateVersionId(tvId: string): Promise<TemplateVersionGit[]> {
    const sql = `select vg.* ,name from template_version_git as vg left join git_source ON vg.git_source_id = git_source.id where vg.template_version_id = ?`
    const data = await pool.query<TemplateVersionGit>(sql, [tvId])
    if (data.length) {
      await Promise.all(
        data.map(async item => {
          item.configList = await this.getGitSourceConfigAndConfigByVersionId(
            item.id
          )
        })
      )
    }
    return data.length > 0 ? data : []
  }

  async createConfig(
    config: CreateTemplateConfigParams
  ): Promise<TemplateConfig> {
    const sql = `insert into 
     template_config(
       id, 
       template_id,
       template_version_id,
       template_version_git_id,
       git_source_config_id,
       default_value,
       global_config_id
     ) values(
       ?,?,?,?,?,?,?
     )`
    const configId = util.uuid()
    await pool.write(sql, [
      configId,
      config.templateId,
      config.templateVersionId,
      config.templateVersionGitId,
      config.gitSourceConfigId,
      '',
      null
    ])
    return this.getConfigById(configId)
  }

  async getGitSourceConfigAndConfigByVersionId(
    versionGitId: string
  ): Promise<ConfigInstance[]> {
    const sql = `select 
       tc.id as id,
       tc.default_value as value,
       tc.is_hidden as is_hidden,
       tc.global_config_id ,
       sc.type_id as type_id,
       sc.desc as description,
       sc.reg as reg,
       sc.file_path as file_path,
       sc.target_value as source_value
       from template_config as tc
       left JOIN source_config as sc
       on
         sc.id = tc.git_source_config_id
       where tc.template_version_git_id = ?`
    return await pool.query<ConfigInstance>(sql, [versionGitId])
  }

  async getConfigsByVersionGitId(id: string): Promise<TemplateConfig[]> {
    const sql = 'select * from template_config where git_source_config_id =?'
    const list = await pool.query<TemplateConfig>(sql, [id])
    return list
  }

  async getConfigById(id: string): Promise<TemplateConfig> {
    const sql = 'select * from template_config where id =?'
    const list = await pool.query<TemplateConfig>(sql, [id])
    return list.length > 0 ? list[0] : null
  }

  async updateConfig(config: UpdateConfigParam): Promise<void> {
    const props = []
    const params = []
    for (const key in config) {
      if (key !== 'id') {
        props.push(`${_.snakeCase(key)}=?`)
        params.push(config[key])
      }
    }
    params.push(config.id)
    const sql = `update template_config set ${props.join(',')} where id=?`
    await pool.query(sql, params)
  }

  async delTemplateVersionConfigByVGID(id: string): Promise<void> {
    const sql = `delete from template_config where template_version_git_id = ?`
    await pool.query(sql, [id])
  }

  async deleteConfigById(configId: string): Promise<void> {
    const sql = `delete from template_config where id=?`
    await pool.query(sql, [configId])
  }

  async addComConfig(
    config: CreateTemplateGlobalConfigParams
  ): Promise<TemplateGlobalConfig> {
    const sql = `insert into 
     template_global_config(id ,
       template_version_id , 
       template_id ,
       default_value,
       is_hidden,name,
       description) 
       values(?,?,?,?,?,?,?)`
    const comConfigId = util.uuid()
    await pool.write(sql, [
      comConfigId,
      config.templateVersionId,
      config.templateId,
      config.defaultValue,
      0,
      config.name,
      config.description
    ])
    return await this.getComConfigById(comConfigId)
  }

  async getComConfigById(id: string): Promise<TemplateGlobalConfig> {
    const sql = `select * from template_global_config where id = ?`
    const list = await pool.query<TemplateGlobalConfig>(sql, [id])
    return list.length > 0 ? list[0] : null
  }

  async getComConfigByTemplateVersionId(
    id: string
  ): Promise<TemplateGlobalConfig[]> {
    const sql = `select * from template_global_config where template_version_id = ?`
    return await pool.query<TemplateGlobalConfig>(sql, [id])
  }

  async updateComConfig(config: TemplateGlobalConfig): Promise<void> {
    const props = []
    const params = []
    for (const key in config) {
      if (key !== 'id') {
        props.push(`${_.snakeCase(key)}=?`)
        params.push(config[key])
      }
    }
    params.push(config.id)
    const sql = `update template_global_config set ${props.join(
      ','
    )} where id=?`
    await pool.query(sql, params)
  }

  async deleteComConfigById(configId: string): Promise<void> {
    const sql = `delete from template_global_config where id=?`
    await pool.query(sql, [configId])
  }
}
const templateDao = new TemplateDao()
export default templateDao
