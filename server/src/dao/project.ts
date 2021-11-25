/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 17:15:21
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-25 11:06:25
 */
import { ProjectCompileParams } from './../types/project';
import { TemplateVersionGit, TemplateGlobalConfig, TemplateConfig } from './../types/template';
import { CreateProjectParams, ProjectInfo, ProjectInstance, ProjectType, UpdateProjectParams } from "../types/project";
import util from "../utils/util";
import pool from "./pool";
import logger from "../utils/logger";
import { CompileGitParams } from '../types/git';

class Project {

   // 项目列表
   async projectList (): Promise<ProjectInstance[]>{
    const sql = `
      SELECT
        p.id AS id,
        p.\`name\` AS NAME,
        p.creator_id AS creator_id,
        p.create_time AS create_time,
        p.compile_type AS compile_type,
        c.compile_time AS last_compile_time,
        c.compile_result AS last_compile_result,
        p.customer AS customer,
        u.NAME AS compileUser,
        p.template_id,
				p.template_version 
      FROM
        project AS p
        LEFT JOIN (
        ( SELECT
            a.*,
            c.compile_user,
            c.compile_result 
          FROM
            ( SELECT project_id, max( compile_time ) AS compile_time FROM compile GROUP BY compile.project_id ) AS a
            LEFT JOIN compile AS c ON c.project_id = a.project_id 
            AND a.compile_time = c.compile_time ) AS c
        LEFT JOIN \`user\` AS u ON u.id = c.compile_user 
        ) ON p.id = c.project_id
    `
    return await pool.query<ProjectInstance>(sql)
  }

  //编译项目创建
  async createProject(params: CreateProjectParams, userId: string): Promise<ProjectInfo>{
    //传入名称 模板id 模板版本id 编译类型 描述进行创建  生成id、时间
    const conn = await pool.beginTransaction()
    //创建config
    const gitMap = {}
    const GlobalConfigMap = {}
    const globalConfigDataList = []
    const gitDataList = []
    const configDataList = []

    const sql = `INSERT INTO project ( id, NAME, template_id, template_version, compile_type, public_type, description, create_time, customer, receive_user_id, creator_id)
      VALUES
        ( ?,?,?,?,?,?,?,?,?,?,? )`
    
    try {
      const projectId = util.uuid()
      await pool.writeInTransaction(conn,sql, [
        projectId,
        params.name,
        params.templateId,
        params.templateVersionId,
        params.compileType,
        params.publicType,
        params.description,
        new Date(),
        params.customer,
        params.shareMember,
        userId
      ])
      params.configList.map( async config => {
        const configId = util.uuid()
        GlobalConfigMap[config.id] = configId
        globalConfigDataList.push([configId, projectId , config.id, config.targetValue])
       })

      if (globalConfigDataList.length) {
        await this.insetGlobalConfig(conn, globalConfigDataList)
      }

      params.gitList.map( async git => {
        const gitId = util.uuid()
        gitMap[git.id] = gitId
        gitDataList.push([gitId, git.name, projectId, git.id])
  
      })

      if (gitDataList.length) {
        await this.insertProjectGit(conn, gitDataList)
      }

      params.gitList.map(  git => {
        git.configList.map( config => {
          const configId = util.uuid()
          configDataList.push([configId,config.targetValue,config.id, GlobalConfigMap[config.globalConfigId], gitMap[git.id]] )
        })
      })

      if (configDataList.length) {
        await this.insertConfig(conn, configDataList)
      }

      await pool.commit(conn)
      return this.getProjectInfo(projectId)

    }
    catch (err){
      await pool.rollback(conn)
      logger.info(err)
      throw(err)
    }
  }

  async insertProjectGit (conn, data: string[][]): Promise<void> {
    const sql = 'INSERT INTO project_git (id, name, project_id, template_git_id) VALUES ?'

    await pool.writeInTransaction(conn,sql, [data])
  }

  async insertConfig (conn, data: string[][]): Promise<void> {
    const sql = `INSERT INTO project_config (id, target_value, template_config_id, global_config_id, project_git_id) VALUES ?`
    await pool.writeInTransaction(conn,sql, [data])
  }
  async insetGlobalConfig (conn, data: string[][]): Promise<void> {
    const sql = `INSERT INTO project_global_config (id, project_id, template_global_config_id ,target_value) VALUES ?`
    await pool.writeInTransaction(conn,sql, [data])
  }

  async getProjectInfo (id: string): Promise<ProjectInfo>{
    const projectData = await this.getProjectById(id)
    const globalConfig = await this.getGlobalConfigByProjectId(id)
    const gitList = await this.getProjectGit(id)

    const data: ProjectInfo = {
      ...projectData,
      globalConfigList: globalConfig,
      gitList
    }
    return data
  }

  async projectCompileInfo (id: string): Promise<ProjectInfo>{
    const projectData = await this.getProjectById(id)
    const globalConfig = await this.getGlobalConfigByProjectIdReturnPid(id)
    const gitList = await this.getProjectGitReturnPid(id)

    const data: ProjectInfo = {
      ...projectData,
      globalConfigList: globalConfig,
      gitList
    }
    return data
  }


  //根据项目id查询信息
  async getProjectById(id: string): Promise<ProjectType>{
    const sql = `SELECT
      id,
      name,
      template_id,
      template_version,
      compile_type,
      public_type,
      description,
      create_time,
      receive_user_id as share_member,
      customer
    FROM
      project 
    WHERE
      id = ?`
    
    const list = await pool.query<ProjectType>(sql, [id])
    return list.length > 0 ? list[0] : null
  }

  //项目基本信息更新
  async updateProject (data: UpdateProjectParams): Promise<void>{
    
    //创建config
    const conn = await pool.beginTransaction()
    const gitMap = {}
    const gitData = []
    const globalConfigMap = {}
    const globalConfigData = []
    const configData = []

    const updateProjectSql = `UPDATE project 
      SET template_id = ?,
        template_version = ?,
        public_type = ?,
        description =?,
        receive_user_id =?
      WHERE id = ?`
    try {
      await pool.writeInTransaction(conn, updateProjectSql, [data.templateId, data.templateVersionId,data.publicType,data.description,data.shareMember,data.id])
      
      await this.deleteProjectGitByProjectId(conn,data.id)
      await this.deleteProjectGlobalConfigByProjectId(conn, data.id)


      data.globalConfigList.map( config => {
        const globalConfigId = util.uuid()
        globalConfigMap[config.id] = globalConfigId
        globalConfigData.push([globalConfigId, data.id, config.id, config.targetValue])
      })
      if ( globalConfigData.length) {
        await this.insetGlobalConfig(conn, globalConfigData)
      }

  

      data.gitList.map( git => {
        const gitId = util.uuid()
        gitMap[git.id] = gitId
        gitData.push([gitId, git.name, data.id, git.id])
      })
      
      if (gitData.length){
        await this.insertProjectGit(conn, gitData)
      }

      data.gitList.map( git => {
        git.configList.map( config => {
          configData.push([util.uuid(), config.targetValue, config.id, globalConfigMap[config.globalConfigId], gitMap[git.id]])
        })
      })

      if( configData.length) {
        await this.insertConfig(conn, configData)
      }
      await pool.commit(conn)
    }
    catch (err) {
      logger.info(err)
      await pool.rollback(conn)
      throw(err)
    }
  }

  async deleteProjectGitByProjectId (conn ,projectId: string): Promise<void> {
    const queryGitSql = `select id from project_git where project_id = ?`
    const GitIdList = await pool.query<{id: string}>(queryGitSql, [projectId])
    const delGitSql = `delete from project_git where project_id = ?`
    const gitList = GitIdList.map( item => item.id)
    await this.delectProjectConfigByGId(conn, gitList)
    await pool.writeInTransaction(conn, delGitSql, [projectId])
  }

  async delectProjectConfigByGId (conn, gitIdList: string[]): Promise<void> {
    const sql =  `delete from project_config where project_git_id in (?)`
    await pool.writeInTransaction(conn, sql, [gitIdList])
  }

  async deleteProjectGlobalConfigByProjectId (conn, projectId: string): Promise<void> {
    const sql = `delete from project_global_config where project_id = ?`
    await pool.writeInTransaction(conn, sql, [projectId])    
  }

  async getProjectGit( projectId: string): Promise<TemplateVersionGit[]> {
    const sql = `SELECT
      t.id AS id,
      p.id AS pid,
      t.template_id as template_id,
      t.template_version_id as template_version_id,
      t.git_source_id as git_source_id,
      t.git_source_version_id as git_source_version_id,
      p.NAME AS NAME,
      git_source.name as name,
      source_version.version as version,
      p.project_id AS project_id
    FROM
      project_git AS p
    LEFT JOIN template_version_git as t ON t.id = p.template_git_id
    LEFT JOIN git_source ON t.git_source_id = git_source.id
    LEFT JOIN source_version ON source_version.id = t.git_source_version_id
    WHERE p.project_id = ?`

    const data = await pool.query<TemplateVersionGit>(sql, [projectId])

    await Promise.all(data.map( async item => {
      item['configList'] = await this.getConfigByProjectGitId(item.pid)
    }))
    return data
  }

  async getProjectGitReturnPid( projectId: string): Promise<TemplateVersionGit[]> {
    const sql = `SELECT
      p.id AS id,
      p.id AS pid,
      t.template_id as template_id,
      t.template_version_id as template_version_id,
      t.git_source_id as git_source_id,
      t.git_source_version_id as git_source_version_id,
      p.NAME AS NAME,
      git_source.name as name,
      source_version.version as version,
      p.project_id AS project_id
    FROM
      project_git AS p
    LEFT JOIN template_version_git as t ON t.id = p.template_git_id
    LEFT JOIN git_source ON t.git_source_id = git_source.id
    LEFT JOIN source_version ON source_version.id = t.git_source_version_id
    WHERE p.project_id = ?`

    const data = await pool.query<TemplateVersionGit>(sql, [projectId])

    await Promise.all(data.map( async item => {
      item['configList'] = await this.getConfigByProjectGitIdReturnPid(item.pid)
    }))
    return data
  }
  
  //根据项目id查询全局配置
  async getGlobalConfigByProjectId (projectId: string): Promise<TemplateGlobalConfig[]>{
    const sql =  `SELECT
      t.id as id,
      t.name as name,
      t.description as description,
      t.template_id as template_id, 
      t.template_version_id as template_version_id,
      p.target_value as target_value,
      t.is_hidden as is_hidden,
      t.type as type
    FROM
      project_global_config as p
    LEFT JOIN template_global_config as t
    ON t.id = p.template_global_config_id
    WHERE p.project_id = ?`

    return await pool.query<TemplateGlobalConfig>(sql, [projectId])
  }

  async getGlobalConfigByProjectIdReturnPid (projectId: string): Promise<TemplateGlobalConfig[]>{
    const sql =  `SELECT
      p.id as id,
      t.name as name,
      t.description as description,
      t.template_id as template_id, 
      t.template_version_id as template_version_id,
      p.target_value as target_value,
      t.is_hidden as is_hidden,
      t.type as type
    FROM
      project_global_config as p
    LEFT JOIN template_global_config as t
    ON t.id = p.template_global_config_id
    WHERE p.project_id = ?`

    return await pool.query<TemplateGlobalConfig>(sql, [projectId])
  }

 
  //根据项目id查询局部配置
  async getConfigByProjectGitId (projectGitId: string): Promise<TemplateConfig[]>{
    const sql =  `SELECT
      t.id as id,
      s.type_id as type_id,
      s.reg as reg,
      s.file_path as file_path,
      s.description as description,
      t.global_config_id as global_config_id,
      t.template_id as template_id,
      t.template_version_id as template_version_id,
      t.template_version_git_id as template_version_git_id,
      t.git_source_config_id as git_source_config_id,
      t.is_hidden as is_hidden,
      p.target_value as target_value   
    FROM
      project_config as p
    LEFT JOIN template_config AS t
    ON t.id = p.template_config_id
    LEFT JOIN source_config AS s ON s.id = t.git_source_config_id 
    WHERE
      p.project_git_id = ?`

    return await pool.query<TemplateConfig>(sql, [projectGitId])
  }

  async getConfigByProjectGitIdReturnPid (projectGitId: string): Promise<TemplateConfig[]>{
    const sql =  `SELECT
      p.id as id,
      s.type_id as type_id,
      s.reg as reg,
      s.file_path as file_path,
      s.description as description,
      p.global_config_id as global_config_id,
      t.template_id as template_id,
      t.template_version_id as template_version_id,
      t.template_version_git_id as template_version_git_id,
      t.git_source_config_id as git_source_config_id,
      t.is_hidden as is_hidden,
      p.target_value as target_value   
    FROM
      project_config as p
    LEFT JOIN template_config AS t
    ON t.id = p.template_config_id
    LEFT JOIN source_config AS s ON s.id = t.git_source_config_id 
    WHERE
      p.project_git_id = ?`

    return await pool.query<TemplateConfig>(sql, [projectGitId])
  }
 

  async getCompileGitData (gitIds: string[]): Promise<CompileGitParams[]> {
    const sql =  `SELECT
      p.id,
      gs.name,
      gs.git AS ssh,
      sv.source_value AS git_value,
      sv.source_type AS git_type ,
      tv.readme_doc AS readme_doc,
      tv.build_doc AS build_doc,
      tv.update_doc AS update_doc,
      sv.compile_orders AS compile_orders
    FROM
      project_git AS p
    LEFT JOIN template_version_git AS tvg ON tvg.id = p.template_git_id
    LEFT JOIN source_version AS sv ON sv.id = tvg.git_source_version_id
    LEFT JOIN template_version AS tv on tvg.template_version_id = tv.id
    LEFT JOIN git_source AS gs ON gs.id = tvg.git_source_id
    WHERE p.id in (?)`
    return await pool.query<CompileGitParams>(sql, [gitIds])
  } 

  async getProjectCompileData (): Promise<ProjectCompileParams[]> {
    const queryProjectSql = 'SELECT id,name,public_type from project'
    const queryProjectGitSql = 'SELECT id, name FROM project_git WHERE project_id = ?'

    const projectInfo = await pool.query<ProjectCompileParams>(queryProjectSql)

    await Promise.all(projectInfo.map( async item => {
      item.gitList = await pool.query<{id: string; name: string}>(queryProjectGitSql, [item.id])
    }))

    return projectInfo.length ? projectInfo : []

  }

}

export default new Project()