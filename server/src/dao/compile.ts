/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-23 16:18:20
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-09-15 11:10:07
 */

import pool from './pool'
import {
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
      description 
    FROM
      compile 
    WHERE
      id = ?`
    const list = await pool.query<ProjectCompile>(sql, [id])
    return list.length > 0 ? list[0] : null
  }

  //查询全部编译记录
  async getProjectCompile (): Promise<ProjectCompile[]>{
    const sql = `SELECT
      c.id as id,
      c.compile_time as compile_time,
      c.compile_user as compile_user, 
      c.compile_result as compile_result,
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
    ORDER BY
      compile_time DESC
    `
    return await pool.query<ProjectCompile>(sql)
  }

  //编译状态更新
  async updateProjectCompile (data: ProjectCompile): Promise<void>{
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


  

}

const compile = new Compile()
export default compile
