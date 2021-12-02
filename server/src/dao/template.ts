/*
 * @Descripttion:
 * @version:
 * @Author: Adxiong
 * @Date: 2021-08-07 09:59:03
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-02 17:54:02
 */
/**
 * 模板
 */
import { ChangeGitVersionParams, HistoryVersion, TemplateVersionGitUpdateInfo, TemplateVersionUpdateInfo } from './../types/template';
import { PoolConnection } from 'mysql';
import {
  UpdateTemplateGlobalConfig,
  CreateTemplateConfig,
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
  UpdateTemplateStatus
} from '../types/template'
import * as _ from 'lodash'
import pool from './pool'
import util from '../utils/util'
import logger from '../utils/logger'
import { GitConfig } from '../types/git'
import { VersionStatus } from '../types/common';
import { version } from '@hapi/joi';

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
        a.*,
        tv.id
      FROM
        (
          SELECT
            template_id,
            max( version ) AS version
          FROM
            template_version 
          GROUP BY
            template_id
        ) AS a
        LEFT JOIN template_version AS tv ON tv.template_id = a.template_id and tv.version = a.version) AS b 
    ON a.id = b.template_id`
    return await pool.query<TemplateInstance>(sql)
  }

  async queryTemplateInstance (id: string): Promise<TemplateInstance> {
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
    ON a.id = b.template_id
    WHERE a.id = ?`
    const res =  await pool.query<TemplateInstance>(sql, [id])
    return res.length ? res[0] : null 
  }

  async getVersionList (id: string): Promise<TemplateInfo[]> {
    const sql = 'SELECT id,version FROM template_version WHERE template_id = ? AND template_version.`status` = 2'
    return await pool.query<TemplateInfo>(sql, [id])
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
    const conn = await pool.beginTransaction()
    try {
      const sql = `update template set ${props.join(',')} where id=?`
      await pool.writeInTransaction(conn,sql, params)
      await pool.commit(conn)
    }catch (e) {
      logger.error(e)
      await pool.rollback(conn)
      throw(e)
    }
   
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
    if (infoList) {
      templateInfo.versionList = await this.getVersionbyTemplateId(templateInfo.id) 
    } else {
      templateInfo.versionList = []
    }
    
    return templateInfo
  }

  /**
   * 从某一个模版的特定模版拷贝创建新的
   * @param templateId 
   * @param templateVersionId 
   * @param name 
   * @param creatorId 
   * @returns 
   */
  async copyVersion (templateId: string, templateVersionId: string, name: string, creatorId: string): Promise<TemplateInstance> {

    const templateInfo = await this.getInfo(templateId)

    const templateVersionInfo = templateInfo.versionList.filter(item => item.id == templateVersionId)[0]

    let newTemplateId 
    const connect = await pool.beginTransaction()
    try {
      const insertTemplateSql =  `insert into 
      template(
        id, 
        name,
        description,
        creator_id,
        create_time
      ) values(
        ?,?,?,?,?
      )`
      newTemplateId = util.uuid()
      await pool.writeInTransaction(connect, insertTemplateSql, [
        newTemplateId,
        name,
        templateInfo.description,
        creatorId,
        new Date()
      ])
      await this.copyTemplateVersion(connect,newTemplateId, {name: templateInfo.name, description: templateInfo.description}, templateVersionInfo)
      await pool.commit(connect)
      return await this.queryTemplateInstance(newTemplateId)
    }
    catch (e) {
      pool.rollback(connect)
      throw e
    }
  }

  /**
   * create Template Init-Version or new Version 
   * @param param 
   * @param creatorId 
   * @returns 
   */

  async createVersion( param: CreateTemplateVersionParams, creatorId: string): Promise<TemplateVersion> {
    let templateId = param.templateId
    const connect = await pool.beginTransaction()
    try { 
      if (templateId == "" ) {
        const sql =  `insert into 
        template(
          id, 
          name,
          description,
          creator_id,
          create_time
        ) values(
          ?,?,?,?,?
        )`
        templateId = util.uuid()
        await pool.writeInTransaction(connect, sql, [
          templateId,
          param.name,
          param.description,
          creatorId,
          new Date()
        ])
        const versionId = await this.addTemplateVersion(connect,templateId, param, null)
        await pool.commit(connect)
        return await this.getVersionbyId(versionId)
      }

      const tempInfo = await this.getInfo(templateId)
      const lastTempVersionInfo = tempInfo.versionList[0]
      const versionId = await this.addTemplateVersion(connect,templateId, param, lastTempVersionInfo)
      await pool.commit(connect)
      return await this.getVersionbyId(versionId)

    } catch ( e ) {
      await pool.rollback(connect)
      throw(e)
    }
  }

  async copyTemplateVersion (connect: PoolConnection, templateId: string, templateInfo, templateVersionInfo: TemplateVersion): Promise<void> {
    const sql = `insert into 
      template_version(
        id, 
        template_id,
        description,
        version,
        publish_time,
        build_doc,
        readme_doc,
        update_doc
      ) values(
        ?,?,?,?,?,?,?,?
      )`
    const versionId = util.uuid()
    await pool.writeInTransaction(connect,sql, [
      versionId,
      templateId,
      templateVersionInfo.description,
      '1.0.0' ,
      new Date(),
      templateVersionInfo.buildDoc,
      templateVersionInfo.readmeDoc,
      templateVersionInfo.updateDoc
    ])

    const globalConfigMap = {}
    for ( const config  of templateVersionInfo.globalConfigList ) {
      const configId = await this.addGlobalConfig({
        name: config.name,
        templateId,
        templateVersionId: versionId,
        description: config.description,
        targetValue: config.targetValue,
        type: config.type,
        isHidden: 0,
      }, connect)
      globalConfigMap[config.id] = configId
    } 
    for ( const git of templateVersionInfo.gitList ) {
      await this.copyTemplateVersionGit(connect,git, templateId, versionId, globalConfigMap)
    }
  }

  async addTemplateVersion (connect: PoolConnection, templateId: string, param: CreateTemplateVersionParams,lastVersionInfo: TemplateVersion ): Promise<string> {
    const sql = `insert into 
      template_version(
        id, 
        template_id,
        description,
        version,
        publish_time,
        build_doc,
        readme_doc,
        update_doc
      ) values(
        ?,?,?,?,?,?,?,?
      )`
    const versionId = util.uuid()
    try {
      await pool.writeInTransaction(connect,sql, [
        versionId,
        templateId,
        param.versionDescription,
        param.version,
        new Date(),
        lastVersionInfo ? lastVersionInfo.buildDoc : '',
        lastVersionInfo ? lastVersionInfo.readmeDoc : '',
        lastVersionInfo ? lastVersionInfo.updateDoc : ''
      ])

      const globalConfigMap = {}

      if (lastVersionInfo) {
        for (const config of lastVersionInfo.globalConfigList) {
          const configId = await this.addGlobalConfig({
            name: config.name,
            templateId,
            templateVersionId: versionId,
            description: config.description,
            targetValue: config.targetValue,
            type: config.type,
            isHidden: 0,
          }, connect) as TemplateGlobalConfig
          globalConfigMap[config.id] = configId
        }
        for (const git of lastVersionInfo.gitList) {
          await this.copyTemplateVersionGit(connect,git, templateId, versionId, globalConfigMap)
        }
      }
      
      
      return versionId
    } catch(e) {
      logger.error(e)
      throw(e)
    }
  }

  async copyTemplateVersionGit(connect: PoolConnection ,git: TemplateVersionGit, templateId, templateVersionId, globalConfigMap): Promise<void> {
    const sql = `insert into 
    template_version_git(
      id,
      template_id,
      template_version_id,
      git_source_id,
      git_source_version_id,
      git_source_branch_id
    )values(
      ?,?,?,?,?,?
    )`
    const gitId = util.uuid()
    try {
      await pool.writeInTransaction(connect, sql, [
        gitId,
        templateId,
        templateVersionId,
        git.gitSourceId,
        git.gitSourceVersionId,
        git.gitSourceBranchId
      ])
      
      for(const config of git.configList) {
        await this.copyTemplateVersionConfig(connect,config, templateId, templateVersionId, gitId, globalConfigMap[config.globalConfigId])
      }

    } catch (e) {
      logger.error(e)
      throw(e)
    }
    
  }

  async copyTemplateVersionConfig (connect: PoolConnection, config: CreateTemplateConfig, templateId: string, templateVersionId: string, gitId: string, globalConfigId: string): Promise<void> {
    const sql = `insert into 
     template_config(
       id, 
       template_id,
       template_version_id,
       template_version_git_id,
       git_source_config_id,
       target_value,
       is_hidden,
       global_config_id
     ) values(
       ?,?,?,?,?,?,?,?
     )`
    const configId = util.uuid()
    await pool.writeInTransaction(connect,sql, [
      configId,
      templateId,
      templateVersionId,
      gitId,
      config.gitSourceConfigId,
      config.targetValue,
      0,
      globalConfigId != "" ? globalConfigId : null
    ])
  }

  async getVersionbyId(id: string): Promise<TemplateVersion> {
    const sql = 'select template_version.* from template_version where id = ?'
    const list = await pool.query<TemplateVersion>(sql, [id])
    if( list.length ){
      list[0].gitList = await this.getGitByTemplateVersionId(id)
      list[0].globalConfigList = await this.getGlobalConfigByTemplateVersionId(id)
    }
    return list.length ? list[0] : null
  }

  async getVersionbyTemplateId(templateid: string): Promise<TemplateVersion[]> {
    const sql =
      'select version.* from template_version as version where version.template_id = ? order by version.publish_time desc'
    let versionList =  await pool.query<TemplateVersion>(sql, [templateid])
    //处理未归档版本但已经时间超过24小时
    for (const version of versionList) {
      const isExpire = 24 * 60 * 60 * 1000 < (new Date().getTime() - version.publishTime)
      if (  version.status == VersionStatus.normal && isExpire) {
        version.status = VersionStatus.placeOnFile
        await this.updateVersion(version)
      }
    }
    versionList =  await pool.query<TemplateVersion>(sql, [templateid])
    await Promise.all(
      versionList.map(async item => {
        item.gitList = await this.getGitByTemplateVersionId(item.id)
        item.globalConfigList = await this.getGlobalConfigByTemplateVersionId(
          item.id
        )
      })
    )
    return versionList
  }

  async updateVersion(template: TemplateVersion,connect?: PoolConnection): Promise<void> {
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
    if( connect ) {
      await pool.writeInTransaction(connect,sql, params)
    } else {
      await pool.query(sql, params)
    }
  }

  async changeGitVersion (params: ChangeGitVersionParams): Promise<TemplateVersionGit> {
    const updateTVGsql = `update template_version_git set git_source_version_id = ? where id = ?`
    const delConfigsql = `delete from template_config where template_version_git_id = ?`
    const connect = await pool.beginTransaction()
    try {
      await pool.writeInTransaction(connect, updateTVGsql, [params.gitSourceVersionId, params.id])
      await pool.writeInTransaction(connect, delConfigsql, [params.id])
      for (const config of params.configList) {
        await this.copyTemplateVersionConfig(connect, config, config.templateId, config.templateVersionId, config.templateVersionGitId, "" )
      }
      await pool.commit(connect)
      return await this.getGitById(params.id)
    } catch (err) {
      await pool.rollback(connect)
      throw(err)
    }
  }

  async delVersionById(id: string): Promise<void> {
    const delTempletVersion = 'delete from template_version where id = ?'
    const delTemplateVersionGit = 'delete from template_version_git where template_version_id = ?'
    const delTemplateConfig = 'delete from template_config where template_version_id = ?'
    const delTemplateGlobalConfig = `delete from template_global_config where template_version_id = ?`
    const conn = await pool.beginTransaction()
    try {
      await pool.writeInTransaction(conn, delTemplateConfig, [id])
      await pool.writeInTransaction(conn, delTemplateVersionGit, [id])
      await pool.writeInTransaction(conn, delTemplateGlobalConfig, [id])
      await pool.writeInTransaction(conn, delTempletVersion, [id])
      await pool.commit(conn)
    } catch (e) {
      pool.rollback(conn)
      throw e
    }
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
       git_source_version_id,
       git_source_branch_id
     )values(
       ?,?,?,?,?,?
     )`
    const id = util.uuid()
    const connect = await pool.beginTransaction()

    try {
      await pool.writeInTransaction(connect,sql, [
        id,
        params.templateId,
        params.templateVersionId,
        params.gitSourceId,
        params.gitSourceVersionId,
        params.gitSourceBranchId
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
      } as TemplateVersion, connect)

      const configList = await this.getGitSourceConfigByVersionId(
        params.gitSourceVersionId
      )

      for (const config of configList) {
        await this.copyTemplateVersionConfig(connect,{
          templateId: params.templateId,
          templateVersionId: params.templateVersionId,
          templateVersionGitId: id,
          gitSourceConfigId: config.id,
          targetValue: config.targetValue,
          isHidden: 0
        }, params.templateId, params.templateVersionId, id, "")
      }
     
      await pool.commit(connect)
      return await this.getGitById(id)
    }catch (e) {
      await pool.rollback(e)
      throw(e)
    }
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

    const connect = await pool.beginTransaction()
    try {
      await this.updateVersion(updateParam, connect)
      const sql = `delete from template_version_git where id = ?`
      await pool.writeInTransaction(connect,sql, [id])
      await pool.commit(connect)
      return updateParam

    } catch(e) {
      await pool.rollback(connect)
      throw(e)
    }
  }

  async getGitById(tvId: string): Promise<TemplateVersionGit> {
    const sql = `SELECT
      vg.*,
      source_version.version as version,
      git_source.name,
      source_branch.name as branchName
    FROM
      template_version_git AS vg
      LEFT JOIN git_source ON vg.git_source_id = git_source.id
      LEFT JOIN source_version ON source_version.id = vg.git_source_version_id
      LEFT JOIN source_branch ON source_branch.id = vg.git_source_branch_id
    WHERE
      vg.id = ?`
    const list = await pool.query<TemplateVersionGit>(sql, [tvId])
    if (list.length) {
      await Promise.all(
        list.map(async item => {
          item.configList = await this.getGitSourceConfigAndConfigByVersionId(item.id)
        })
      )
    }
    return list.length > 0 ? list[0] : null
  }

  async getGitByTemplateVersionId(tvId: string): Promise<TemplateVersionGit[]> {
    const sql = `SELECT
      vg.*,
      source_version.version as version,
      git_source.name,
      source_branch.name as branchName
    FROM
      template_version_git AS vg
      LEFT JOIN git_source ON vg.git_source_id = git_source.id
      LEFT JOIN source_version ON source_version.id = vg.git_source_version_id
      LEFT JOIN source_branch ON source_branch.id = vg.git_source_branch_id
    WHERE
      vg.template_version_id = ?`

  
    const  data = await pool.query<TemplateVersionGit>(sql, [tvId])
    for (const git of data) {
      git.configList = await this.getGitSourceConfigAndConfigByVersionId(git.id)
    }

    
    return data.length > 0 ? data : []
  }

  

  async getGitSourceConfigAndConfigByVersionId(
    versionGitId: string,
  ): Promise<TemplateConfig[]> {
    const sql = `SELECT
      tc.id AS id,
      tc.template_id AS template_id,
      tc.template_version_id AS template_version_id,
      tc.template_version_git_id AS template_version_git_id,
      tc.git_source_config_id AS git_source_config_id,
      tc.target_value AS target_value,
      tc.is_hidden AS is_hidden,
      tc.global_config_id AS global_config_id,
      sc.type_id AS type_id,
      sc.description AS description,
      sc.reg AS reg,
      sc.file_path AS file_path
    FROM
      template_config AS tc
      LEFT JOIN source_config AS sc ON sc.id = tc.git_source_config_id 
    WHERE
      tc.template_version_git_id = ? `

    return await pool.query<TemplateConfig>(sql, [versionGitId])
    
  }



  async getConfigById(id: string, connect?: PoolConnection): Promise<TemplateConfig> {
    const sql =  `SELECT
    tc.id AS id,
    tc.template_id AS template_id,
    tc.template_version_id AS template_version_id,
    tc.template_version_git_id AS template_version_git_id,
    tc.git_source_config_id AS git_source_config_id,
    tc.target_value AS target_value,
    tc.is_hidden AS is_hidden,
    tc.global_config_id AS global_config_id,
    sc.type_id AS type_id,
    sc.description AS description,
    sc.reg AS reg,
    sc.file_path AS file_path
  FROM
    template_config AS tc
    LEFT JOIN source_config AS sc ON sc.id = tc.git_source_config_id 
  WHERE
    tc.id = ? `
    if (!connect) {
      const list = await pool.query<TemplateConfig>(sql, [id])
    return list.length > 0 ? list[0] : null
    }
    const list = await pool.queryInTransaction<TemplateConfig>(connect,sql, [id])
    return list.length > 0 ? list[0] : null
  }

  async updateConfigStatus(config: {id: string; status: number}): Promise<void> {
    const sql = `update template_config set is_hidden = ? where id = ?`
    await pool.query(sql, [
      config.status,
      config.id
    ])
  }

  async updateConfigGlobalConfig(config: {id: string; globalConfig: string}): Promise<void> {
    const sql = `update template_config set global_config_id = ? where id = ?`
    await pool.query(sql, [
      config.globalConfig,
      config.id
    ])
  }
  async updateConfig(config: UpdateConfigParam): Promise<TemplateConfig> {
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
    await pool.query( sql, params)
    return await this.getConfigById(config.id)
   
  }

  async delTemplateVersionConfigByVGID(id: string): Promise<void> {
    const sql = `delete from template_config where template_version_git_id = ?`
    await pool.query(sql, [id])
  }

  async deleteConfigById(configId: string): Promise<void> {
    const sql = `delete from template_config where id=?`
    await pool.query(sql, [configId])
  }

  async addGlobalConfig(
    config: CreateTemplateGlobalConfigParams,
    connect? : PoolConnection
  ): Promise<TemplateGlobalConfig | string> {
    const sql = `insert into 
     template_global_config(
       id ,
       name,
       description,
       template_id ,
       template_version_id, 
       target_value,
       type
      ) 
      values(?,?,?,?,?,?,?)`
    const comConfigId = util.uuid()
    if (connect) {
      await pool.writeInTransaction(connect, sql, [
        comConfigId,
        config.name,
        config.description,
        config.templateId,
        config.templateVersionId,
        config.targetValue,
        config.type
      ])
      return comConfigId
    }
    await pool.write(sql, [
      comConfigId,
      config.name,
      config.description,
      config.templateId,
      config.templateVersionId,
      config.targetValue,
      config.type
    ])
    return this.getGlobalConfigById(comConfigId)
  }

  async getGlobalConfigById(id: string): Promise<TemplateGlobalConfig> {
    const sql = `select * from template_global_config where id = ?`
    const list = await pool.query<TemplateGlobalConfig>(sql, [id])
    return list.length > 0 ? list[0] : null
  }

  async getGlobalConfigByTemplateVersionId(
    id: string
  ): Promise<TemplateGlobalConfig[]> {
    const sql = `select * from template_global_config where template_version_id = ?`
    const data = await pool.query<TemplateGlobalConfig>(sql, [id])
    return data.length > 0 ? data : []
  }

  async updateGlobalConfig(config: UpdateTemplateGlobalConfig): Promise<TemplateGlobalConfig> {
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
    return await this.getGlobalConfigById(config.id)
  }

  async updateGlobalConfigStatus(config: {id: string; status: number}): Promise<void> {
    const sql = `update template_global_config set is_hidden = ? where id = ?`
    await pool.query(sql, [
      config.status,
      config.id
    ])
  }

  async deleteGlobalConfigById(configId: string): Promise<void> {
    const sql = `delete from template_global_config where id=?`
    await pool.query(sql, [configId])
  }

  async deleteTemplateById (id: string): Promise<void>{
    const delTemplate = 'delete from template where id = ?'
    const delTempletVersion = 'delete from template_version where template_id = ?'
    const delTemplateVersionGit = 'delete from template_version_git where template_id = ?'
    const delTemplateConfig = 'delete from template_config where template_id = ?'
    const delTemplateGlobalConfig = `delete from template_global_config where template_id = ?`
    const conn = await pool.beginTransaction()
    try {
      await pool.writeInTransaction(conn, delTemplateConfig, [id])
      await pool.writeInTransaction(conn, delTemplateVersionGit, [id])
      await pool.writeInTransaction(conn, delTemplateGlobalConfig, [id])
      await pool.writeInTransaction(conn, delTempletVersion, [id])
      await pool.writeInTransaction(conn, delTemplate, [id])
      await pool.commit(conn)
    } catch (e) {
      pool.rollback(conn)
      throw e
    }
  }

  async updateTemplateStatus (List: UpdateTemplateStatus[]): Promise<void> {
    const sql = 'update template set enable = ? where id = ?'
    const connect = await pool.beginTransaction()
    try {
      await Promise.all( List.map( async git => {
        await pool.writeInTransaction(connect, sql, [git.enable, git.id])
      }))
      await pool.commit(connect)
    }
    catch (e) {
      await pool.rollback(connect)
      logger.error('向git表插入数据失败', e)
      throw (e)
    }
  }

  async getVersionUpdateInfo (id: string): Promise<TemplateVersionUpdateInfo[]> {
    const queryVersionSql = `
      SELECT
        tv.id,
        tp.NAME,
        tv.description,
        tv.version 
      FROM
        template_version AS tv
        LEFT JOIN template AS tp ON tv.template_id = tp.id 
      WHERE
        tp.id = ?
      ORDER BY tv.version DESC`
    const queryVersionGitSql = `
        SELECT 
        git_source.NAME,
        version,
        update_doc,
        build_doc,
        source_version.description,
        source_version.publish_time,
        git_source_id,
        git_source_branch_id,
        source_branch.name as branch_name
      FROM
        template_version_git
        LEFT JOIN source_version ON source_version.id = git_source_version_id
        LEFT JOIN git_source ON git_source.id = source_version.source_id
        LEFT JOIN source_branch ON source_branch.id = template_version_git.git_source_branch_id 
      WHERE
        template_version_id = ?
      ORDER BY NAME DESC` 

    const queryHistoryVersionSql = `
      SELECT
        id,
        source_id,
        version,
        build_doc,
        update_doc
      FROM
        source_version 
      WHERE
        source_id = ?
      ORDER BY version ASC`
    const templateVersion = await pool.query<TemplateVersionUpdateInfo>(queryVersionSql, [id])
    for (const version of templateVersion) {
      version['gitInfo'] = await pool.query<TemplateVersionGitUpdateInfo>(queryVersionGitSql, [version.id])
      for (const git of version['gitInfo']) {
        git['historyVersion'] = await pool.query<HistoryVersion>(queryHistoryVersionSql,[git.gitSourceId])
      }
    }
    return templateVersion
  }
}
const templateDao = new TemplateDao()
export default templateDao
