/**
 * 模板
 */

import { Template } from "../types/template"
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
}
const templateDao = new TemplateDao()
export default templateDao