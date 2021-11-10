/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 17:15:21
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-10 16:55:10
 */
import _ = require("lodash");
import { CreateProjectParams, ProjectConfig, ProjectGit, ProjectGlobalConfig, ProjectInfo, ProjectInstance, ProjectType } from "../types/project";
import util from "../utils/util";
import pool from "./pool";
import templateDao from "../dao/template"
import logger from "../utils/logger";

class Project {

   // 项目列表
   async projectList (): Promise<ProjectInstance[]>{
    const sql = `SELECT
      p.id AS id,
      p.\`name\` AS NAME,
      p.creator_id AS creator_id,
      p.create_time AS create_time,
      p.compile_type AS compile_type,
      c.compile_time AS last_compile_time,
      c.compile_result AS last_compile_result,
      p.customer AS customer,
      u.NAME AS compileUser 
    FROM
      project AS p
      LEFT JOIN (
        ( SELECT project_id, compile_result, compile_user, max( compile_time ) AS compile_time FROM compile GROUP BY compile.project_id ) AS c
      LEFT JOIN \`user\` AS u ON u.id = c.compile_user 
      ) ON p.id = c.project_id
    `
    return await pool.query<ProjectInstance>(sql)
  }

  //编译项目创建
  async createProject(params: CreateProjectParams, userId: string): Promise<ProjectType>{
    //传入名称 模板id 模板版本id 编译类型 描述进行创建  生成id、时间
    const sql = `INSERT INTO project ( id, NAME, template_id, template_version, compile_type, public_type, description, create_time, customer, receive_user_id, creator_id)
      VALUES
        ( ?,?,?,?,?,?,?,?,?,?,? )`
    const id = util.uuid()
    await pool.write(sql, [
      id,
      params.name,
      params.templateId,
      params.templateVersionId,
      params.compileType,
      params.publicType,
      params.description,
      new Date(),
      params.customer,
      params.shareNumber,
      userId
    ])

    //创建config
    const gitMap = {}
    const GlobalConfigMap = {}

    await Promise.all( params.configList.map( async config => {
      GlobalConfigMap[config.id] = await this.insetGlobalConfig(id, config.id, config.targetValue)
    }))

    await Promise.all(params.gitList.map(async git => {
      gitMap[git.id] = await this.insertProjectGit(git.name, id, git.id)
    }))

    await Promise.all( params.gitList.map( async git => {
      git.configList.map( async config => {
        await this.insertConfig(gitMap[git.id], config.id, GlobalConfigMap[config.globalConfigId], config.targetValue)
      })
    }))
    
    return this.getProjectInfo(id)
  }

  async insertProjectGit (name: string, projectId: string, templateGitId: string): Promise<string> {
    const sql = 'INSERT INTO project_git (id, name, project_id, template_git_id) VALUES (?,?,?,?)'
    const id = util.uuid()
    await pool.query(sql, [
      id,
      name,
      projectId,
      templateGitId
    ])
    return id
  }

  async insertConfig (projectGitId: string, sourceConfigId: string,  globalConfigId: string, targetValue: string): Promise<void> {
    const sql = `INSERT INTO project_config (id, target_value, template_config_id, global_config_id, project_git_id) VALUES (?,?,?,?,?)`
    await pool.query(sql, [util.uuid(), targetValue, sourceConfigId, globalConfigId, projectGitId])
  }

  async insetGlobalConfig (projectId: string, sourceConfigId: string, targetValue: string): Promise<string> {
    const sql = `INSERT INTO project_global_config (id, project_id, template_global_config_id ,target_value) VALUES (?,?,?,?)`
    const id = util.uuid()
    await pool.query(sql, [id, projectId, sourceConfigId, targetValue])
    return id
  }

  async getProjectInfo (id: string): Promise<ProjectInfo>{
    const projectData = await this.getProjectById(id)
    const globalConfig = await this.getGlobalConfigByProjectId(id)
    const templateVersionInfo = await templateDao.getVersionbyId(projectData.templateVersion)
    templateVersionInfo.gitList = await this.getProjectGit(id)

    
    const data: ProjectInfo = {
      ...projectData,
      globalConfigList: globalConfig,
      gitList: templateVersionInfo.gitList
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
      customer
    FROM
      project 
    WHERE
      id = ?`
    
    const list = await pool.query<ProjectType>(sql, [id])
    return list.length > 0 ? list[0] : null
  }

  //项目基本信息更新
  async updateProject (data: ProjectType): Promise<void>{
    const props = []
    const params = []
    for (const key in data) {
      if (key !== 'id') {
        props.push(`${_.snakeCase(key)}=?`)
        params.push(data[key])
      }
    }
    params.push(data.id)
    const sql = `update project set ${props.join(',')} where id=?`
    await pool.query(sql, params)
  }

  async getProjectGit( projectId: string): Promise<ProjectGit[]> {
    const sql = `SELECT
      p.id AS id,
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

    const data = await pool.query<ProjectGit>(sql, [projectId])

    await Promise.all(data.map( async item => {
      item['configList'] = await this.getConfigByProjectGitId(item.id)
    }))
    return data
  }
  
  //根据项目id查询全局配置
  async getGlobalConfigByProjectId (projectId: string): Promise<ProjectGlobalConfig[]>{
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

    return await pool.query<ProjectGlobalConfig>(sql, [projectId])
  }

  //全局配置更新
  async updateGlobalConfig (data: ProjectGlobalConfig): Promise<void>{
    const props = []
    const params = []
    for (const key in data) {
      if (key !== 'id') {
        props.push(`${_.snakeCase(key)}=?`)
        params.push(data[key])
      }
    }
    params.push(data.id)
    const sql = `update project_global_config set ${props.join(',')} where id=?`
    await pool.query(sql, params)
  }

  //根据项目id查询局部配置
  async getConfigByProjectGitId (projectGitId: string): Promise<ProjectConfig[]>{
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

    return await pool.query<ProjectConfig>(sql, [projectGitId])
  }
 

  //局部配置更新
  async updateConfig (data: ProjectConfig): Promise<void>{
    const props = []
    const params = []
    for (const key in data) {
      if (key !== 'id') {
        props.push(`${_.snakeCase(key)}=?`)
        params.push(data[key])
      }
    }
    params.push(data.id)
    const sql = `update project_config set ${props.join(',')} where id=?`
    await pool.query(sql, params)
  }

  //项目编译记录
  async projectCompileRecord (id: string): Promise<ProjectInstance[]>{
    const sql = `SELECT
      p.id AS id,
      p.\`name\` AS NAME,
      p.create_time AS create_time,
      c.compile_time AS last_compile_time,
      c.compile_result AS last_compile_result,
      u.NAME AS compileUser 
    FROM
      project AS p
      LEFT JOIN ( SELECT project_id, compile_result, compile_user, max( create_time ) AS create_time FROM compile GROUP BY compile.project_id ) AS c
      LEFT JOIN \`user\` AS u ON p.id = c.project_id ON u.id = c.compile_user
      WHERE p.id = ?`
    return await pool.query<ProjectInstance>(sql, [id])
  }
  
}

export default new Project()