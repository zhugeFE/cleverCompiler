/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-07 09:59:03
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-07 10:20:49
 */
/**
 * 模板
 */

import { Template, TemplateInstance } from "../types/template"
import * as _ from 'lodash'
import pool from "./pool"

class TemplateDao {
  async create (template: Template): Promise<Template> {
    const keys = []
    const params = []
    for (const key in template) {
      keys.push(_.snakeCase(key))
      params.push(template[key])
    }
    const sql = `insert into template(${keys.join(',')}) values(${params.map(() => '?').join(',')})`
    await pool.write(sql, params)
    return await this.getById(template.id)
  }
  async getById (id: string): Promise<Template> {
    const sql = 'select * from template where id = ?'
    const list = await pool.query<Template>(sql, [id])
    return list.length ? list[0] : null
  }
  async query (): Promise<TemplateInstance[]> {
    const sql = `
    SELECT
      t.id,
      t.name,
      t.description,
      t.creator_id,
      t.create_time
    FROM
      template AS t
    order by t.create_time desc
    `
    return await pool.query<TemplateInstance>(sql)as TemplateInstance[]
  }
}
const templateDao = new TemplateDao()
export default templateDao