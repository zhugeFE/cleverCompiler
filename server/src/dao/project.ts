/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 17:15:21
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-25 18:22:53
 */
import _ = require("lodash");
import { CreateConfigParams, CreateProjectParams, CreateShareProject, ProjectConfig, ProjectInfo, ProjectInstance, ProjectShare, ProjectType } from "../types/project";
import util from "../utils/util";
import pool from "./pool";

class Project {

   // 项目列表
   async projectList (): Promise<ProjectInstance[]>{
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
    `
    return await pool.query<ProjectInstance>(sql)
  }

  //编译项目创建
  async createProject(params: CreateProjectParams): Promise<ProjectType>{
    //传入名称 模板id 模板版本id 编译类型 描述进行创建  生成id、时间
    const sql = `INSERT INTO project ( id, NAME, template_id, template_version, compile_type, description, create_time )
      VALUES
        ( ?,?,?,?,?,?,? )`
    const id = util.uuid()
    await pool.write(sql, [
      id,
      params.name,
      params.templateId,
      params.templateVersion,
      params.compileType,
      params.description,
      new Date()
    ])
    return this.getProjectById(id)
  }

  async projectInfo (id: string): Promise<ProjectInfo>{
    const projectData = await this.getProjectById(id)
    const shareNumber = await this.getShareProjectByProjectId(id)
    const globalConfig = await this.getGlobalConfigByProjectId(id)
    const data: ProjectInfo = {
      ...projectData,
      shareNumber: shareNumber.map(item=>item.receiveUserId),
      globalConfigList: globalConfig
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
        publish_type,
        description,
        create_time 
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
  
    //全局配置添加
    async addGlobalConfig (data: CreateConfigParams[]): Promise<void>{
      const sql = `INSERT INTO project_global_config ( id, config_id, project_id, \`value\` )
        VALUES
          ( ?,?,?,? )`
      Promise.all(data.map(async item => {
        const id = util.uuid()
        await pool.write(sql,[
          id,
          item.configId,
          item.projectId,
          item.value
        ])
      }))   
    }
  
    //根据项目id查询全局配置
    async getGlobalConfigByProjectId (projectId: string): Promise<ProjectConfig[]>{
      const sql =  `SELECT
        id,
        config_id,
        project_id,
        \`value\` 
      FROM
        project_global_config 
      WHERE
        project_id = ?`
  
      return await pool.query<ProjectConfig>(sql, [projectId])
    }
  
    //全局配置更新
    async updateGlobalConfig (data: ProjectConfig): Promise<void>{
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
  
    //局部配置添加
    async addConfig (data: CreateConfigParams[]): Promise<void>{
      const sql = `INSERT INTO project_config ( id, config_id, project_id, \`value\` )
        VALUES
          ( ?,?,?,? )`
      Promise.all(data.map(async item => {
        const id = util.uuid()
        await pool.write(sql,[
          id,
          item.configId,
          item.projectId,
          item.value
        ])
      }))   
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
  
    //项目分享
    async shareProject (data: CreateShareProject): Promise<void>{
  
      await this.deletShareProjectByProjectId(data.projectId)
  
      Promise.all(data.receiverUserIds.map(async rid => {
        await this.addProjectShareNumber({
          receiverUserId: rid,
          projectId: data.projectId,
          userId: data.userId  
        })
      }))
  
    }
  
    //项目分享添加成员
    async addProjectShareNumber (data: CreateShareProject): Promise<void> {
      const sql = `INSERT INTO project_share ( id, receive_user_id, project_id, user_id )
        VALUES
          ( ?,?,?,? )`
      const id = util.uuid()
      await pool.query(sql, [
        id,
        data.receiverUserId,
        data.projectId,
        data.userId
      ])
    }
  
    //项目分享删除根据分享id
    async deletShareProjectByProjectId (projectId: string): Promise<void> {
      const sql = `DELETE FROM project_share WHERE project_id = ?`
      await pool.query(sql, [projectId])
    }
  
  
    //项目分享根据项目id查询
    async getShareProjectByProjectId (projectId: string): Promise<ProjectShare[]>{
      const sql = `SELECT
        id,
        receive_user_id,
        user_id,
        project_id 
      FROM
        project_share 
      WHERE
        project_id = ?`
  
      return await pool.query<ProjectShare>(sql, [projectId])
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