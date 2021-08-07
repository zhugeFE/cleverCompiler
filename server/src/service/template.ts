/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 16:47:43
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-07 10:14:02
 */
import { Template, TemplateInstance } from "../types/template"
import util from "../utils/util"
import templateDao from "../dao/template"

class TemplateService {
  async add (userId: string, name: string, description: string): Promise<Template> {
    const param: Template = {
      id: util.uuid(),
      name,
      description,
      creatorId: userId,
      createTime: new Date()
    }
    return await templateDao.create(param)
  }
  async query (): Promise<TemplateInstance[]> {
    return await templateDao.query()
  }
}

const templateService = new TemplateService()
export default templateService