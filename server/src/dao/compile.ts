/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-23 16:18:20
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-08 10:27:19
 */

import pool from './pool'
import {
  CompileDoc,
  CompileGitData,
  CompileParam,
  ProjectCompile,
} from "../types/compile"
import util from '../utils/util'
import _ = require('lodash')

class Compile {
   //新建编译
   async addProjectCompile(data: CompileParam): Promise<ProjectCompile>{
    const sql = `INSERT INTO compile ( id, compile_time, compile_user, compile_result, project_id, description )
      VALUES
        ( ?,?,?,?,?,? )`
    const id = util.uuid()
    await pool.write(sql, [
      id,
      new Date(),
      data.compileUser,
      data.compileResult,
      data.projectId,
      data.description
    ])
    return await this.getProjectCompileById(id)
  }
  //根据id查询编译记录
  async getProjectCompileById (id: string): Promise<ProjectCompile>{
    const sql = `SELECT
      id,
      compile_time,
      compile_user,
      compile.compile_result,
      project_id,
      description,
      file
    FROM
      compile 
    WHERE
      id = ?`
    const list = await pool.query<ProjectCompile>(sql, [id])
    return list.length > 0 ? list[0] : null
  }
  //查询编译记录根据项目配置id
  async getProjectCompile (id: string): Promise<ProjectCompile[]>{
    const sql = `SELECT
      c.id as id,
      c.compile_time as compile_time,
      c.compile_user as compile_user, 
      c.compile_result as compile_result,
      c.file as file,
      c.project_id as project_id,
      c.description as description ,
      p.name as projectName,
      p.description as projectDesc,
      cus.name as cusName
    FROM
      compile as c
    LEFT JOIN project as p
    ON c.project_id = p.id
    LEFT JOIN customer as cus
    ON p.customer = cus.id
    WHERE p.id = ?
    ORDER BY
      compile_time DESC`
    return await pool.query<ProjectCompile>(sql, [id])
  }
  //编译状态更新
  async updateProjectCompile (data: ProjectCompile | {id: string; file: string; compileResult: string}): Promise<void>{
    const props = []
    const params = []
    for (const key in data) {
      if (key !== 'id') {
        props.push(`${_.snakeCase(key)}=?`)
        params.push(data[key])
      }
    }
    params.push(data.id)
    const sql = `update compile set ${props.join(',')} where id=?`
    await pool.query(sql, params)
  }

  async getGitData (projectGitId: string): Promise<CompileGitData>{          
    const sql = `
      SELECT 
        pg.NAME,
        sv.output_name,
        sv.public_type,
        sv.public_git
      FROM
        project_git as pg
      LEFT JOIN template_version_git as tg ON pg.template_git_id = tg.id
      LEFT JOIN source_version as sv ON tg.git_source_version_id = sv.id
      WHERE pg.id = ?`
    const data  = await pool.query<CompileGitData>(sql, [projectGitId])
    return data.length ? data[0] : null
  }

  async getTemplateDoc (projectId: string): Promise<CompileDoc> {
    const sql = `
      SELECT
        tv.build_doc,
        tv.readme_doc,
        tv.update_doc
      FROM
        project
      LEFT JOIN template_version as tv ON tv.id = project.template_version
      WHERE project.id = ?`
    const data = await pool.query<CompileDoc>(sql, [projectId])
    return data.length ? data[0] : null
  }
}

export default new Compile()
