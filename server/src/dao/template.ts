/**
 * 模板
 */

import { Template, TemplateListItem } from "../types/template"
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
  async query (): Promise<TemplateListItem[]> {
    const sql = `
    SELECT
      t.id,
      t.name,
      t.description,
      v.version_id,
      v.version 
    FROM
      template AS t
      LEFT JOIN (
      SELECT
        a.id AS version_id,
        a.template_id,
        a.version 
      FROM
        template_version AS a
      JOIN ( SELECT template_id, MAX( publish_time ) FROM template_version GROUP BY template_id ) AS b ON a.id = b.template_id 
      ) AS v ON t.id = v.template_id
    `
    return await pool.query<TemplateListItem>(sql, [])
  }
}
const templateDao = new TemplateDao()
export default templateDao